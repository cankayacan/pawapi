import { Body, Controller, Post } from '@nestjs/common';

import { CreatePetOwnerDto } from '../dto/create-pet-owner.dto';
import { PetOwnerService } from '../services/pet-owner.service';

@Controller('/pet-owner')
export class PetOwnerController {
  constructor(private readonly petOwnerService: PetOwnerService) {}

  @Post('register')
  async register(@Body() user: CreatePetOwnerDto) {
    await this.petOwnerService.create(user);
  }
}
