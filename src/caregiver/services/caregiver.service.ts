import { Injectable } from '@nestjs/common';

import { eq, isNull } from 'drizzle-orm';

import { db } from '../../db';
import { caregivers } from '../../db/schema/caregiver';
import type { Caregiver, NewCaregiver } from '../../db/schema/caregiver';

@Injectable()
export class CaregiverService {
  async create(data: NewCaregiver): Promise<Caregiver> {
    const [caregiver] = await db.insert(caregivers).values(data).returning();
    return caregiver;
  }

  async findAll(): Promise<Caregiver[]> {
    return await db
      .select()
      .from(caregivers)
      .where(isNull(caregivers.deletedAt));
  }

  async findById(id: string): Promise<Caregiver | null> {
    const [caregiver] = await db
      .select()
      .from(caregivers)
      .where(eq(caregivers.id, id))
      .limit(1);

    return caregiver || null;
  }

  async update(
    id: string,
    data: Partial<NewCaregiver>,
  ): Promise<Caregiver | null> {
    const [caregiver] = await db
      .update(caregivers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(caregivers.id, id))
      .returning();

    return caregiver || null;
  }

  async delete(id: string): Promise<boolean> {
    const [caregiver] = await db
      .update(caregivers)
      .set({ deletedAt: new Date() })
      .where(eq(caregivers.id, id))
      .returning();

    return !!caregiver;
  }

  async findByLocation(
    lat: number,
    lng: number,
    radiusKm: number = 10,
  ): Promise<Caregiver[]> {
    // This is a simplified location-based search
    // In a real application, you might want to use PostGIS or a more sophisticated geospatial query
    const caregivers = await this.findAll();

    return caregivers.filter((caregiver) => {
      const distance = this.calculateDistance(
        lat,
        lng,
        caregiver.geocode.lat,
        caregiver.geocode.lng,
      );
      return distance <= radiusKm;
    });
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
