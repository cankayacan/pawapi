import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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
import { PetResponseDto } from 'src/pet/dto/pet-response.dto';
import { PetService } from 'src/pet/services/pet.service';
import { UploadService } from 'src/upload/upload.service';

import { PetOwner } from '../../db';
import { PaginationDto } from '../../shared/pagination.dto';
import { CreatePetOwnerDto } from '../dto/create-pet-owner.dto';
import { PetOwnerResponseDto } from '../dto/pet-owner-response.dto';
import { PetOwnersResponseDto } from '../dto/pet-owners-response.dto';
import { UpdatePetOwnerDto } from '../dto/update-pet-owner.dto';
import { PetOwnerService } from '../services/pet-owner.service';

@Resolver(() => PetOwnerResponseDto)
@UseGuards(GqlAuthGuard, RolesGuard)
export class PetOwnerResolver {
  constructor(
    private readonly petOwnerService: PetOwnerService,
    private readonly petService: PetService,
    private readonly uploadService: UploadService,
  ) {}

  @Query(() => PetOwnerResponseDto, { name: 'petOwner', nullable: true })
  @HasRoles(Role.CAREGIVER, Role.PET_OWNER)
  async getPetOwner(
    @Args('id', { type: () => String, nullable: true }) id: string | null,
    @Context() context: any,
  ): Promise<PetOwnerResponseDto | null> {
    const userRole = context.req.user.role;
    const userId = context.req.user.id;

    if (userRole === Role.PET_OWNER && id !== userId) {
      throw new UnauthorizedException('Profile is not allowed to be accessed!');
    }

    const queryUserid = id || userId;

    const petOwner = await this.petOwnerService.findOneById(queryUserid);
    if (!petOwner) {
      throw new NotFoundException('Pet owner is not found');
    }
    return PetOwnerResponseDto.fromPetOwner(petOwner);
  }

  @Query(() => PetOwnersResponseDto, { name: 'petOwners' })
  @HasRoles(Role.CAREGIVER)
  async getPetOwners(
    @Args('pagination', { nullable: true }) paginationDto?: PaginationDto,
    @Args('search', { nullable: true, type: () => String }) search?: string,
  ): Promise<PetOwnersResponseDto> {
    const limit = paginationDto?.limit || 10;
    const offset = paginationDto?.offset || 0;

    const petOwners = await this.petOwnerService.findAll(limit, offset, search);
    const totalCount = await this.petOwnerService.countTotal(search);

    return {
      petOwners: petOwners.map((owner: PetOwner) =>
        PetOwnerResponseDto.fromPetOwner(owner),
      ),
      totalCount,
    };
  }

  @ResolveField(() => [PetResponseDto], { name: 'pets' })
  @HasRoles(Role.CAREGIVER)
  async resolvePets(
    @Parent() petOwner: PetOwnerResponseDto,
  ): Promise<PetResponseDto[]> {
    const pets = await this.petService.findByOwnerId(petOwner.id);
    return Promise.all(
      pets.map(async (pet) => {
        const avatarImageURL = pet.avatarFilePath
          ? this.uploadService.getImageUrl(pet.avatarFilePath)
          : '';
        return PetResponseDto.fromPet(pet, avatarImageURL);
      }),
    );
  }

  @Mutation(() => PetOwnerResponseDto)
  @HasRoles(Role.PET_OWNER, Role.CAREGIVER)
  async updatePetOwner(
    @Args('id', { type: () => String, nullable: true }) id: string | null,
    @Args('petOwnerInput') updatePetOwnerInput: UpdatePetOwnerDto,
    @Context() context: any,
  ) {
    const userRole = context.req.user.role;
    const userId = context.req.user.id;

    if (userRole === Role.PET_OWNER && id !== userId) {
      throw new UnauthorizedException(
        'Pet owner is not allowed to be accessed!',
      );
    }

    const queryUserid = id || userId;

    const petOwner = await this.petOwnerService.update(
      queryUserid,
      updatePetOwnerInput,
    );

    if (!petOwner) {
      throw new NotFoundException('Pet owner is not found');
    }

    return PetOwnerResponseDto.fromPetOwner(petOwner);
  }

  @Mutation(() => PetOwnerResponseDto)
  async createPetOwner(
    @Args('petOwnerInput') createPetOwnerInput: CreatePetOwnerDto,
  ): Promise<PetOwnerResponseDto> {
    const petOwner = await this.petOwnerService.create(createPetOwnerInput);
    return PetOwnerResponseDto.fromPetOwner(petOwner);
  }
}
