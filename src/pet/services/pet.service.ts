import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from 'src/db';
import { pets } from 'src/db/schema/pet';
import { Pet } from 'src/db/schema/pet';

import { CreatePetRequestDto } from '../dto/create-pet-request.dto';
import { UpdatePetRequestDto } from '../dto/update-pet-request.dto';

@Injectable()
export class PetService {
  async findById(id: string): Promise<Pet | undefined> {
    return db.query.pets.findFirst({
      where: and(eq(pets.id, id), isNull(pets.deletedAt)),
    });
  }

  async findByOwnerId(ownerId: string): Promise<Pet[]> {
    return db.query.pets.findMany({
      where: and(eq(pets.ownerId, ownerId), isNull(pets.deletedAt)),
      orderBy: [desc(pets.createdAt)],
    });
  }

  async create(ownerId: string, pet: CreatePetRequestDto): Promise<Pet> {
    const [newPet] = await db
      .insert(pets)
      .values({
        ownerId,
        name: pet.name,
        type: pet.type,
        gender: pet.gender,
        sterilizationStatus: pet.sterilizationStatus,
        birthday: pet.birthday ? new Date(pet.birthday) : null,
        avatarFilePath: pet.avatarFilePath,
      })
      .returning();

    return newPet;
  }

  async update(
    ownerId: string,
    updatePetDto: UpdatePetRequestDto,
  ): Promise<Pet> {
    const petToUpdate = await this.findById(updatePetDto.id);
    if (!petToUpdate) throw new NotFoundException();
    if (petToUpdate.ownerId !== ownerId) throw new UnauthorizedException();

    const { avatarFilePath, birthday, ...rest } = updatePetDto;
    const updateData = {
      ...rest,
      ...(avatarFilePath ? { avatarFilePath } : {}),
      ...(birthday ? { birthday: new Date(birthday) } : {}),
    };

    const [updatedPet] = await db
      .update(pets)
      .set(updateData)
      .where(eq(pets.id, updatePetDto.id))
      .returning();

    if (!updatedPet) {
      throw new NotFoundException();
    }

    return updatedPet;
  }

  async delete(ownerId: string, petId: string): Promise<void> {
    const petToDelete = await this.findById(petId);

    if (!petToDelete) {
      throw new NotFoundException();
    }

    if (petToDelete.ownerId !== ownerId) {
      throw new UnauthorizedException();
    }

    await db
      .update(pets)
      .set({ deletedAt: new Date() })
      .where(eq(pets.id, petId));
  }
}
