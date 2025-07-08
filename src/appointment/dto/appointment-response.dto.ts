import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Appointment } from 'src/db/schema/appointment';
import { PetResponseDto } from 'src/pet/dto/pet-response.dto';

import { AppointmentStatus } from '../types/appointment-status';

@ObjectType()
export class AppointmentResponseDto {
  @Field(() => ID, { description: 'The id of the appointment' })
  readonly id: string;

  @Field(() => String, {
    description: 'The id of the pet for which this appointment has beeen made',
  })
  readonly petId: string;

  @Field(() => String, {
    description:
      'The id of the owner for which this appointment has beeen made',
  })
  readonly petOwnerId: string;

  @Field(() => String, {
    description:
      'The status of the appointment. Can be PENDING, CANCELLED, or COMPLETED',
  })
  readonly status: AppointmentStatus;

  @Field(() => String, {
    description: 'The date of this appointment',
  })
  readonly date: string;

  @Field({
    description: 'The reason why this appointment has been made',
  })
  readonly reason: string;

  @Field(() => String, {
    description: 'The custom reason why this appointment has been made',
    nullable: true,
  })
  readonly otherReason: string | null;

  @Field(() => String, {
    description: 'The date when this appointment has been created',
  })
  readonly createdAt: Date;

  @Field(() => PetResponseDto, {
    description: 'The pet for which this appointment has been made',
    nullable: true,
  })
  readonly pet?: PetResponseDto;

  static fromAppointment(appointment: Appointment): AppointmentResponseDto {
    return {
      id: appointment.id,
      petId: appointment.petId,
      petOwnerId: appointment.petOwnerId,
      status: appointment.status as AppointmentStatus,
      date: appointment.date.toISOString(),
      reason: appointment.reason,
      otherReason: appointment.otherReason,
      createdAt: appointment.createdAt,
    };
  }
}
