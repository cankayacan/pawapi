import { registerEnumType } from '@nestjs/graphql';

export enum SterilizationStatus {
  UNKNOWN = 'UNKNOWN',
  STERILIZED = 'STERILIZED',
  NOT_STERILIZED = 'NOT_STERILIZED',
}

registerEnumType(SterilizationStatus, {
  name: 'SterilizationStatus',
  description: 'Sterilization status of the pet',
});
