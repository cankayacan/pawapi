import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RequestWithUser } from 'src/auth/types/request-with-user';
import { UploadService } from 'src/upload/upload.service';

import { Pet } from '../../db';
import { CreatePetRequestDto } from '../dto/create-pet-request.dto';
import { PetResponseDto } from '../dto/pet-response.dto';
import { UpdatePetRequestDto } from '../dto/update-pet-request.dto';
import { PetService } from '../services/pet.service';

@Controller('/:userId/pets')
export class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly uploadService: UploadService,
  ) {}

  getPetResponseDto(pet: Pet): PetResponseDto {
    const avatarImage = pet.avatarFilePath
      ? this.uploadService.getImageUrl(pet.avatarFilePath)
      : '';
    return PetResponseDto.fromPet(pet, avatarImage);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getPets(
    @Req() req: RequestWithUser,
  ): Promise<PetResponseDto[] | null | undefined> {
    const pets = await this.petService.findByOwnerId(req.user.id.toString());
    return pets?.map((p) => this.getPetResponseDto(p));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPet(
    @Req() req: RequestWithUser,
    @Body() createPetDto: CreatePetRequestDto,
  ): Promise<PetResponseDto> {
    const pet = await this.petService.create(
      req.user.id.toString(),
      createPetDto,
    );
    return this.getPetResponseDto(pet);
  }

  @Patch(':petId')
  @UseGuards(AuthGuard('jwt'))
  async updatePet(
    @Req() req: RequestWithUser,
    @Body() updatePetDto: UpdatePetRequestDto,
  ): Promise<PetResponseDto> {
    const pet = await this.petService.update(
      req.user.id.toString(),
      updatePetDto,
    );
    return this.getPetResponseDto(pet);
  }

  @Delete(':petId')
  @UseGuards(AuthGuard('jwt'))
  async deletePet(
    @Req() req: RequestWithUser,
    @Param('petId') petId: string,
  ): Promise<void> {
    return this.petService.delete(req.user.id.toString(), petId);
  }
}
