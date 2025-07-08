import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/auth/services/auth.guard';
import { RolesGuard } from 'src/auth/services/roles.guard';
import { Role } from 'src/auth/types/role';
import { HasRoles } from 'src/auth/utils/roles.decorator';
import { UploadService } from 'src/upload/upload.service';

import { CreatePetRequestDto } from '../dto/create-pet-request.dto';
import { PetResponseDto } from '../dto/pet-response.dto';
import { UpdatePetRequestDto } from '../dto/update-pet-request.dto';
import { PetService } from '../services/pet.service';

@Resolver(() => PetResponseDto)
@UseGuards(GqlAuthGuard, RolesGuard)
export class PetResolver {
  constructor(
    private readonly petService: PetService,
    private readonly uploadService: UploadService,
  ) {}

  @Mutation(() => PetResponseDto)
  @HasRoles(Role.PET_OWNER)
  async createPet(
    @Args('createPetInput') createPetInput: CreatePetRequestDto,
    @Context() context: any,
  ) {
    const petOwnerId = context.req.user.id;

    const pet = await this.petService.create(petOwnerId, createPetInput);
    return this.getPetResponseDto(pet);
  }

  @Query(() => [PetResponseDto], { name: 'pets' })
  @HasRoles(Role.PET_OWNER)
  async findPets(@Context() context: any): Promise<PetResponseDto[]> {
    const petOwnerId = context.req.user.id;
    const pets = await this.petService.findByOwnerId(petOwnerId);
    return Promise.all(pets.map((p) => this.getPetResponseDto(p)));
  }

  @Mutation(() => PetResponseDto)
  @HasRoles(Role.PET_OWNER, Role.CAREGIVER)
  async updatePet(
    @Args('updatePetInput') updatePetInput: UpdatePetRequestDto,
    @Context() context: any,
  ) {
    const userRole = context.req.user.role;
    const userId = context.req.user.id;

    const petToUpdate = await this.petService.findById(updatePetInput.id);

    if (!petToUpdate) {
      throw new NotFoundException('Pet is not found!');
    }

    if (userRole === Role.PET_OWNER && petToUpdate.ownerId !== userId) {
      throw new UnauthorizedException('Pet is not allowed to be updated!');
    }

    const pet = await this.petService.update(
      petToUpdate.ownerId,
      updatePetInput,
    );
    return this.getPetResponseDto(pet);
  }

  @Mutation(() => Boolean)
  @HasRoles(Role.PET_OWNER)
  async removePet(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ): Promise<boolean> {
    const petOwnerId = context.req.user.id;
    await this.petService.delete(petOwnerId, id);
    return true;
  }

  private async getPetResponseDto(pet: any): Promise<PetResponseDto> {
    const avatarImageURL = pet.avatarFilePath
      ? this.uploadService.getImageUrl(pet.avatarFilePath)
      : '';
    return PetResponseDto.fromPet(pet, avatarImageURL);
  }
}
