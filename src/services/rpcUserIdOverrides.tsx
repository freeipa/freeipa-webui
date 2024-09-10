/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { apiToUserIDOverride } from "src/utils/userIdOverrideUtils";
import { UserIDOverride } from "src/utils/datatypes/globalDataTypes";

/**
 * User ID override-related endpoints: getUserIdOverride, addUserIdOverride, removeUserIdOverride
 *
 * API commands:
 * - user_idoverride_show: https://freeipa.readthedocs.io/en/latest/api/user_idoverride_show.html
 * - user_idoverride_add: https://freeipa.readthedocs.io/en/latest/api/user_idoverride_add.html
 * - user_idoverride_del: https://freeipa.readthedocs.io/en/latest/api/user_idoverride_del.html
 * - user_idoverride_find: https://freeipa.readthedocs.io/en/latest/api/user_idoverride_find.html
 */
const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Given a list of User ID overrides, show the full data of those services
     * @param {string[]} - Payload with service IDs and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getUserIdOverridesInfoByUid: build.query<UserIDOverride[], string[]>({
      query: (userIDOverridesList) => {
        const serviceShowCommands: Command[] = userIDOverridesList.map(
          (userIDOverride) => ({
            method: "idoverrideuser_show",
            params: [[userIDOverride], { no_members: true }],
          })
        );
        return getBatchCommand(serviceShowCommands, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchRPCResponse): UserIDOverride[] => {
        const serviceList: UserIDOverride[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const serviceData = apiToUserIDOverride(results[i].result);
          serviceList.push(serviceData);
        }
        return serviceList;
      },
    }),
    /**
     * Given a group ID, show the User ID overrides associated with it
     * @param {string} - Group ID
     * @returns {FindRPCResponse} - Find response
     */
    getUserIdOverridesInfoByGroup: build.query<FindRPCResponse, string>({
      query: (groupId) => {
        return getCommand({
          method: "idoverrideuser_find",
          params: [
            [groupId],
            { no_members: true, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Given a ID View, show the User ID overrides associated with it
     * @param {string} - ID View name
     * @returns {FindRPCResponse} - Find response
     */
    getUserIdOverridesInfoByIdView: build.mutation<UserIDOverride[], string>({
      query: (IDView) => {
        return getCommand({
          method: "idoverrideuser_find",
          params: [[IDView], { no_members: true, version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): UserIDOverride[] => {
        const userIdOverrideList: UserIDOverride[] = [];
        if (response.result.result !== undefined) {
          const results = response.result.result;
          const count = response.result.count;
          for (let i = 0; i < count; i++) {
            const idOverrideData = apiToUserIDOverride(
              results[i] as Record<string, unknown>
            );
            userIdOverrideList.push(idOverrideData);
          }
        }
        return userIdOverrideList;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserIdOverridesInfoByUidQuery,
  useGetUserIdOverridesInfoByGroupQuery,
  useGetUserIdOverridesInfoByIdViewMutation,
} = extendedApi;
