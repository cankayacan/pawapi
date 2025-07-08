import { registerEnumType } from '@nestjs/graphql';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

registerEnumType(AppointmentStatus, {
  name: 'AppointmentStatus',
  description: 'The status of an appointment',
});
