import { AppointmentReason } from '../types/appointment-reason';

export const appointmentReasonTitles: Record<AppointmentReason, string> = {
  [AppointmentReason.OTHER]: 'Andere',
  [AppointmentReason.PET_SITTING]: 'Tierpflege',
  [AppointmentReason.DOG_WALKING]: 'Hundesport',
};

export const getAppointmentDisplayReason = (
  reason: string,
  otherReason?: string,
): string => {
  const isOtherReason = reason === AppointmentReason.OTHER;

  const displayReason = isOtherReason
    ? otherReason!
    : appointmentReasonTitles[reason as AppointmentReason];

  return displayReason;
};
