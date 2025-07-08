import { registerEnumType } from '@nestjs/graphql';

export enum PetType {
  DOG = 'DOG',
  CAT = 'CAT',
}

registerEnumType(PetType, {
  name: 'PetType',
  description: 'Type of the pet, typically cat or dog',
});
