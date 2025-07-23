import { NotFoundException } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';

import { CaregiverResponseDto } from '../dto/caregiver-response.dto';
import { CaregiverService } from '../services/caregiver.service';

@Resolver(() => CaregiverResponseDto)
export class CaregiverResolver {
  constructor(private readonly caregiverService: CaregiverService) {}

  @Query(() => CaregiverResponseDto, { name: 'caregiver', nullable: true })
  async getCaregiver(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CaregiverResponseDto | null> {
    const caregiver = await this.caregiverService.findById(id);

    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }

    return CaregiverResponseDto.fromCaregiver(caregiver);
  }
}
