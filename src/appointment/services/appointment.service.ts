import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { parseISO } from 'date-fns';
import { and, eq, gte, isNull, sql } from 'drizzle-orm';

import { db } from 'src/db';
import { appointments } from 'src/db/schema/appointment';
import { PetService } from 'src/pet/services/pet.service';

import { UpsertAppointmentRequestDto } from '../dto/upsert-appointment-request.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly petService: PetService) {}

  async findByAppointmentId(petOwnerId: string, appointmentId: string) {
    const appointment = await db.query.appointments.findFirst({
      where: and(
        eq(appointments.id, appointmentId),
        isNull(appointments.deletedAt),
      ),
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.petOwnerId !== petOwnerId) {
      throw new UnauthorizedException('You do not own this pet');
    }

    return appointment;
  }

  async findUpcomingAppointmentsByPetOwnerId(petOwnerId: string) {
    const today = new Date().setHours(0, 0, 0, 0);

    return db.query.appointments.findMany({
      where: and(
        eq(appointments.petOwnerId, petOwnerId),
        gte(appointments.date, sql`${new Date(today)}`),
        isNull(appointments.deletedAt),
      ),
      orderBy: (appointments, { asc }) => [asc(appointments.date)],
    });
  }

  async findConfirmedAppointmentsByDate(targetDate: Date) {
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return db.query.appointments.findMany({
      where: and(
        gte(appointments.date, sql`${startOfDay}`),
        gte(sql`${endOfDay}`, appointments.date),
        isNull(appointments.deletedAt),
      ),
      orderBy: (appointments, { asc }) => [asc(appointments.date)],
    });
  }

  async create(
    petOwnerId: string,
    createAppointmentDto: UpsertAppointmentRequestDto,
    createdBy: string,
  ) {
    const petToBook = await this.petService.findById(
      createAppointmentDto.petId,
    );

    if (!petToBook) {
      throw new NotFoundException('Pet not found');
    }

    if (petToBook.ownerId !== petOwnerId) {
      throw new UnauthorizedException('You do not own this pet');
    }

    const [newAppointment] = await db
      .insert(appointments)
      .values({
        petOwnerId,
        petId: createAppointmentDto.petId,
        date: parseISO(createAppointmentDto.date),
        reason: createAppointmentDto.reason,
        otherReason: createAppointmentDto.otherReason,
        createdBy,
      })
      .returning();

    return newAppointment;
  }
}
