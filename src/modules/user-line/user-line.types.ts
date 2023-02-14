export enum UserLineStatus {
  PENDING = 'pending', // User requested access to admin, pending approval
  ACTIVE = 'active', // User can use associated line normally
  SUSPENDED = 'suspended', // Access to associated line suspended by admin
}
