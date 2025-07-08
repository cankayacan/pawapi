import { Injectable } from '@nestjs/common';

import { SQL, and, eq, ilike, isNull, or } from 'drizzle-orm';

import { db } from 'src/db';
import { PetOwner, petOwners } from 'src/db/schema/pet-owner';
import { CreatePetOwnerDto } from 'src/pet-owner/dto/create-pet-owner.dto';
import { UpdatePetOwnerDto } from 'src/pet-owner/dto/update-pet-owner.dto';

import { AuthService } from '../../auth/services/auth.service';
import { Role } from '../../auth/types/role';
import { CreatePetOwnerWithFullAddressDto } from '../dto/create-pet-owner-with-address.dto';
import { GeocodingService } from './geocoding.service';

@Injectable()
export class PetOwnerService {
  constructor(
    private readonly authService: AuthService,
    private readonly geocodingService: GeocodingService,
  ) {}

  async findAll(
    limit: number = 10,
    offset: number = 0,
    search?: string,
  ): Promise<PetOwner[]> {
    const conditions = [isNull(petOwners.deletedAt)];

    if (search) {
      const searchCondition = or(
        ilike(petOwners.fullName, `%${search}%`),
        ilike(petOwners.email, `%${search}%`),
        ilike(petOwners.mobileNumber, `%${search}%`),
      ) as SQL<unknown>;
      conditions.push(searchCondition);
    }

    return db.query.petOwners.findMany({
      where: and(...conditions),
      limit,
      offset,
      orderBy: (petOwners, { desc }) => [desc(petOwners.createdAt)],
    });
  }

  countTotal(search?: string): Promise<number> {
    const conditions = [isNull(petOwners.deletedAt)];

    if (search) {
      const searchCondition = or(
        ilike(petOwners.fullName, `%${search}%`),
        ilike(petOwners.email, `%${search}%`),
        ilike(petOwners.mobileNumber, `%${search}%`),
      ) as SQL<unknown>;
      conditions.push(searchCondition);
    }

    return db.query.petOwners
      .findMany({
        where: and(...conditions),
        columns: {
          id: true,
        },
      })
      .then((results) => results.length);
  }

  async findOneById(id: string): Promise<PetOwner | null> {
    const petOwner = await db.query.petOwners.findFirst({
      where: eq(petOwners.id, id),
    });
    return petOwner || null;
  }

  async findOneByEmail(email: string): Promise<PetOwner | null> {
    const petOwner = await db.query.petOwners.findFirst({
      where: eq(petOwners.email, email),
    });
    return petOwner || null;
  }

  async findOneByMobileNumber(mobileNumber: string): Promise<PetOwner | null> {
    const petOwner = await db.query.petOwners.findFirst({
      where: eq(petOwners.mobileNumber, mobileNumber),
    });
    return petOwner || null;
  }

  async create(createPetOwnerDto: CreatePetOwnerDto): Promise<PetOwner> {
    const user = await this.authService.register(createPetOwnerDto, [
      Role.PET_OWNER,
    ]);

    let geocode = null;
    let addressParts = null;

    if (createPetOwnerDto.address) {
      const address = createPetOwnerDto.address;
      const fullAddress = `${address.street} ${address.streetNumber}, ${address.postCode} ${address.city}`;
      geocode = await this.geocodingService.getGeocode(fullAddress);
      addressParts = await this.geocodingService.getAddressParts(fullAddress);
    }

    const [petOwner] = await db
      .insert(petOwners)
      .values({
        id: user.id,
        fullName: createPetOwnerDto.fullName,
        email: createPetOwnerDto.email,
        mobileNumber: createPetOwnerDto.mobileNumber,
        address: addressParts,
        geocode: geocode,
      })
      .returning();
    return petOwner;
  }

  async createWithFullAddress(petOwnerDto: CreatePetOwnerWithFullAddressDto) {
    const user = await this.authService.register(petOwnerDto, [Role.PET_OWNER]);

    const fullAddress = petOwnerDto.fullAddress;
    const geocode = await this.geocodingService.getGeocode(fullAddress);
    const addressParts =
      await this.geocodingService.getAddressParts(fullAddress);

    const [petOwner] = await db
      .insert(petOwners)
      .values({
        id: user.id,
        fullName: petOwnerDto.fullName,
        email: petOwnerDto.email,
        mobileNumber: petOwnerDto.mobileNumber,
        address: addressParts,
        geocode: geocode,
      })
      .returning();

    return petOwner;
  }

  async update(
    id: string,
    updatePetOwnerDto: UpdatePetOwnerDto,
  ): Promise<PetOwner | null> {
    const updateData: Partial<PetOwner> = {};

    if (updatePetOwnerDto.fullName !== undefined) {
      updateData.fullName = updatePetOwnerDto.fullName;
    }
    if (updatePetOwnerDto.email !== undefined) {
      updateData.email = updatePetOwnerDto.email;
    }
    if (updatePetOwnerDto.mobileNumber !== undefined) {
      updateData.mobileNumber = updatePetOwnerDto.mobileNumber;
    }
    if (updatePetOwnerDto.address !== undefined) {
      const address = updatePetOwnerDto.address;
      const fullAddress = `${address.street} ${address.streetNumber}, ${address.postCode} ${address.city}`;
      const geocode = await this.geocodingService.getGeocode(fullAddress);
      updateData.address = address;
      updateData.geocode = geocode;
    }

    const [updatedPetOwner] = await db
      .update(petOwners)
      .set(updateData)
      .where(eq(petOwners.id, id))
      .returning();

    return updatedPetOwner || null;
  }

  async softDelete(id: string): Promise<void> {
    await db
      .update(petOwners)
      .set({ deletedAt: new Date() })
      .where(eq(petOwners.id, id));
  }
}
