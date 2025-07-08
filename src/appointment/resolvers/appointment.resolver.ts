import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/auth/services/auth.guard';
import { RolesGuard } from 'src/auth/services/roles.guard';
import { Role } from 'src/auth/types/role';
import { HasRoles } from 'src/auth/utils/roles.decorator';
import { Appointment } from 'src/db/schema/appointment';
import { PetOwnerResponseDto } from 'src/pet-owner/dto/pet-owner-response.dto';
import { PetOwnerService } from 'src/pet-owner/services/pet-owner.service';
import { PetResponseDto } from 'src/pet/dto/pet-response.dto';
import { PetService } from 'src/pet/services/pet.service';
import { UploadService } from 'src/upload/upload.service';

import { AppointmentResponseDto } from '../dto/appointment-response.dto';
import { UpsertAppointmentRequestDto } from '../dto/upsert-appointment-request.dto';
import { AppointmentService } from '../services/appointment.service';

@Resolver(() => AppointmentResponseDto)
@UseGuards(GqlAuthGuard, RolesGuard)
export class AppointmentResolver {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly petService: PetService,
    private readonly petOwnerService: PetOwnerService,
    private readonly uploadService: UploadService,
  ) {}

  @Mutation(() => AppointmentResponseDto)
  @HasRoles(Role.PET_OWNER)
  async createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: UpsertAppointmentRequestDto,
    @Context() context: any,
  ) {
    const petOwnerId = context.req.user.id;
    const newAppointment = await this.appointmentService.create(
      petOwnerId,
      createAppointmentInput,
      petOwnerId,
    );

    return AppointmentResponseDto.fromAppointment(newAppointment);
  }

  @Query(() => [AppointmentResponseDto], { name: 'appointments' })
  @HasRoles(Role.PET_OWNER)
  async findUpcomingPetOwnerAppointments(
    @Context() context: any,
  ): Promise<AppointmentResponseDto[]> {
    const petOwnerId = context.req.user.id;
    const appointments =
      await this.appointmentService.findUpcomingAppointmentsByPetOwnerId(
        petOwnerId,
      );
    return appointments?.map((appointment: Appointment) =>
      AppointmentResponseDto.fromAppointment(appointment),
    );
  }

  @Query(() => [AppointmentResponseDto], { name: 'appointmentsByDate' })
  @HasRoles(Role.CAREGIVER)
  async findCaregiverAppointments(
    @Args('date') date: string,
  ): Promise<AppointmentResponseDto[]> {
    const targetDate = new Date(date);
    const appointments =
      await this.appointmentService.findConfirmedAppointmentsByDate(targetDate);
    return appointments?.map((appointment: Appointment) =>
      AppointmentResponseDto.fromAppointment(appointment),
    );
  }

  @ResolveField(() => PetResponseDto, { name: 'pet' })
  async resolvePet(
    @Parent() appointment: AppointmentResponseDto,
  ): Promise<PetResponseDto | null> {
    const pet = await this.petService.findById(appointment.petId);

    if (!pet) return null;

    const avatarImageURL = pet.avatarFilePath
      ? this.uploadService.getImageUrl(pet.avatarFilePath)
      : '';

    return PetResponseDto.fromPet(pet, avatarImageURL);
  }

  @ResolveField(() => PetOwnerResponseDto, { name: 'owner' })
  async resolveOwner(
    @Parent() appointment: AppointmentResponseDto,
  ): Promise<PetOwnerResponseDto | null> {
    const petOwner = await this.petOwnerService.findOneById(
      appointment.petOwnerId,
    );

    if (!petOwner) {
      throw new Error('Pet owner not found');
    }

    return PetOwnerResponseDto.fromPetOwner(petOwner);
  }
}
