// Re-export the hooks from rpcUserStatus.ts
import {
  useGetUserStatusQuery,
  useUpdateUserStatusMutation,
  UserStatus,
  UserStatusShowPayload,
  UserStatusUpdatePayload,
} from "src/services/rpcUserStatus";

// Export type definitions
export type { UserStatus, UserStatusShowPayload, UserStatusUpdatePayload };

// Re-export the hooks
export { useGetUserStatusQuery, useUpdateUserStatusMutation };
