export enum TherapistTransferRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum TherapistTransferRequestStatusUpdate {
  APPROVE = TherapistTransferRequestStatus.APPROVED,
  REJECT = TherapistTransferRequestStatus.REJECTED,
}
