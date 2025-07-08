import { registerEnumType } from '@nestjs/graphql';

export enum AppointmentFailureReason {
  PET_OWNER_NO_SHOW = 'PET_OWNER_NO_SHOW',
  CAREGIVER_NO_SHOW = 'CAREGIVER_NO_SHOW',
  PET_OWNER_CANCELLATION = 'PET_OWNER_CANCELLATION',
  CAREGIVER_CANCELLATION = 'CAREGIVER_CANCELLATION',
  OTHER = 'OTHER',
}

registerEnumType(AppointmentFailureReason, {
  name: 'AppointmentFailureReason',
  description: 'The reason why an appointment has failed',
});
