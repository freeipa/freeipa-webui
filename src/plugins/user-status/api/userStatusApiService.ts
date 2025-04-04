import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { pluginApiService } from "src/services";

// types for the user status data
export interface UserStatus {
  userId: string;
  status: "active" | "inactive" | "disabled";
}

// types for update payload
export interface UpdateStatusRequest {
  status: "active" | "inactive" | "disabled";
}

/**
 * API service for the User Status plugin
 * Uses RTK Query
 */
export const userStatusApiService = createApi({
  reducerPath: "userStatusApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/plugins" }),
  tagTypes: ["UserStatus"],
  endpoints: (builder) => ({
    // Get user status
    getUserStatus: builder.query<UserStatus, string>({
      query: (userId) => `/user-status/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "UserStatus", id: userId },
      ],
    }),

    // Update user status
    updateUserStatus: builder.mutation<
      UserStatus,
      { userId: string; status: "active" | "inactive" | "disabled" }
    >({
      query: ({ userId, status }) => ({
        url: `/user-status/${userId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "UserStatus", id: userId },
      ],
    }),
  }),
});

// Export hooks for use in components
export const { useGetUserStatusQuery, useUpdateUserStatusMutation } =
  userStatusApiService;

/**
 * Stand-alone functions for direct API access without RTK Query
 * These are useful in cases where hooks are not suitable
 */
export const userStatusApi = {
  /**
   * Get the status for a user
   */
  async getUserStatus(userId: string): Promise<UserStatus> {
    // For demo purposes, just return a mock response
    return Promise.resolve({
      userId,
      status: "active",
    });

    // Real implementation would be:
    // return await pluginApiService.get<UserStatus>(`/user-status/${userId}`);
  },

  /**
   * Update a user's status
   */
  async updateUserStatus(
    userId: string,
    status: "active" | "inactive" | "disabled"
  ): Promise<UserStatus> {
    // For demo purposes, just return a mock response
    return Promise.resolve({
      userId,
      status,
    });

    // Real implementation would be:
    // return await pluginApiService.put<UserStatus>(`/user-status/${userId}`, { status });
  },
};
