/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, getCommand } from "./rpc";
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

export interface UserStatus {
  userId: string;
  status: "active" | "inactive" | "disabled";
}

export interface UserStatusShowPayload {
  userId: string;
}

export interface UserStatusUpdatePayload {
  userId: string;
  status: "active" | "inactive" | "disabled";
}

const validateStatus = (status: string): "active" | "inactive" | "disabled" => {
  if (status === "active" || status === "inactive" || status === "disabled") {
    return status;
  }
  return "active";
};

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    // get user status
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
        if (!response || !response.result || !response.result.result) {
          console.error("Invalid response format:", response);
          return {
            userId: "",
            status: "active",
          };
        }

        const userId = Array.isArray(response.result.result.uid)
          ? response.result.result.uid[0]
          : response.result.result.uid || "";

        const status = Array.isArray(response.result.result.inetuserstatus)
          ? response.result.result.inetuserstatus[0]
          : response.result.result.inetuserstatus || "active";

        return {
          userId,
          status: validateStatus(status),
        };
      },
      providesTags: ["FullUser"],
    }),

    // update user status
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
        if (!response || !response.result || !response.result.result) {
          console.error("Invalid response format:", response);

          const context =
            (response && response.error && response.error.context) || {};

          return {
            userId: context.userId || "",
            status: validateStatus(context.status || "active"),
          };
        }

        const userId = Array.isArray(response.result.result.uid)
          ? response.result.result.uid[0]
          : response.result.result.uid || "";

        const status = Array.isArray(response.result.result.inetuserstatus)
          ? response.result.result.inetuserstatus[0]
          : response.result.result.inetuserstatus || "active";

        return {
          userId,
          status: validateStatus(status),
        };
      },
      invalidatesTags: ["FullUser"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserStatusQuery, useUpdateUserStatusMutation } =
  extendedApi;
