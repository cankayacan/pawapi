import { Field, Int, ObjectType } from '@nestjs/graphql';

import { PetOwnerResponseDto } from './pet-owner-response.dto';

@ObjectType()
export class PetOwnersResponseDto {
  @Field(() => [PetOwnerResponseDto], { description: 'List of pet owners' })
  petOwners: PetOwnerResponseDto[];

  @Field(() => Int, { description: 'Total number of pet owners' })
  totalCount: number;
}
