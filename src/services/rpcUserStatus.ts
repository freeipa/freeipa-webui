/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, Command, getCommand, FindRPCResponse } from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";

/**
 * User Status-related endpoints: getUserStatus, updateUserStatus
 *
 * API commands:
 * - user_show: https://freeipa.readthedocs.io/en/latest/api/user_show.html
 *   Used to retrieve user data including inetuserstatus attribute
 * - user_mod: https://freeipa.readthedocs.io/en/latest/api/user_mod.html
 *   Used to update user data including inetuserstatus attribute
 */

// Define the user status data structure
export interface UserStatus {
  userId: string;
  status: "active" | "inactive" | "disabled";
}

// Define payload types
export interface UserStatusShowPayload {
  userId: string;
}

export interface UserStatusUpdatePayload {
  userId: string;
  status: "active" | "inactive" | "disabled";
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Get user status
    getUserStatus: build.query<UserStatus, UserStatusShowPayload>({
      query: (payload) => {
        return getCommand({
          method: "user_show",
          params: [
            [payload.userId],
            {
              all: true,
              rights: true,
              version: API_VERSION_BACKUP,
            },
          ],
        });
      },
      transformResponse: (response: any): UserStatus => {
        // Handle case where response or response.result is null/undefined
        if (!response || !response.result || !response.result.result) {
          console.error("Invalid response format:", response);
          return {
            userId: "",
            status: "active", // default status
          };
        }

        return {
          userId: response.result.result.uid?.[0] || "",
          status: response.result.result.inetuserstatus?.[0] || "active",
        };
      },
      providesTags: (result, error, arg) => ["FullUser"],
    }),

    // Update user status
    updateUserStatus: build.mutation<UserStatus, UserStatusUpdatePayload>({
      query: (payload) => {
        return getCommand({
          method: "user_mod",
          params: [
            [payload.userId],
            {
              inetuserstatus: [payload.status],
              version: API_VERSION_BACKUP,
            },
          ],
        });
      },
      transformResponse: (response: any): UserStatus => {
        // Handle case where response or response.result is null/undefined
        if (!response || !response.result || !response.result.result) {
          console.error("Invalid response format:", response);

          // Return the input status if we can extract it from the error context
          const context =
            (response && response.error && response.error.context) || {};

          return {
            userId: context.userId || "",
            status: context.status || "active",
          };
        }

        return {
          userId: response.result.result.uid?.[0] || "",
          status: response.result.result.inetuserstatus?.[0] || "active",
        };
      },
      invalidatesTags: ["FullUser"],
    }),
  }),
  overrideExisting: false,
});

// Export the generated hooks
export const { useGetUserStatusQuery, useUpdateUserStatusMutation } =
  extendedApi;

// Stand-alone function for direct API access without hooks
export const getUserStatus = async (userId: string): Promise<UserStatus> => {
  try {
    const response = await fetch("/ipa/session/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "user_show",
        params: [
          [userId],
          {
            all: true,
            rights: true,
            version: API_VERSION_BACKUP,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get user status: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle case where data structure is unexpected
    if (!data || !data.result || !data.result.result) {
      console.error("Invalid API response structure:", data);
      return {
        userId,
        status: "active", // default status
      };
    }

    return {
      userId: data.result.result.uid?.[0] || userId,
      status: data.result.result.inetuserstatus?.[0] || "active",
    };
  } catch (error) {
    console.error("Error in getUserStatus:", error);
    return {
      userId,
      status: "active", // default to active on error
    };
  }
};

// Stand-alone function for updating user status
export const updateUserStatus = async (
  userId: string,
  status: "active" | "inactive" | "disabled"
): Promise<UserStatus> => {
  try {
    const response = await fetch("/ipa/session/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "user_mod",
        params: [
          [userId],
          {
            inetuserstatus: [status], // Always use array format for LDAP compatibility
            version: API_VERSION_BACKUP,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user status: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle case where data structure is unexpected
    if (!data || !data.result || !data.result.result) {
      console.error("Invalid API response structure:", data);
      return {
        userId,
        status, // Return the status we tried to set
      };
    }

    return {
      userId: data.result.result.uid?.[0] || userId,
      status: data.result.result.inetuserstatus?.[0] || status,
    };
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    return {
      userId,
      status, // Return the status we tried to set
    };
  }
};
