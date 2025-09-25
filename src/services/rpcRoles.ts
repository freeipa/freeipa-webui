import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToRole } from "src/utils/rolesUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Role } from "../utils/datatypes/globalDataTypes";

/**
 * Roles-related endpoints: addToRoles, removeFromRoles, getRolesInfoByName
 *
 * API commands:
 * - role_add_member: https://freeipa.readthedocs.io/en/latest/api/role_add_member.html
 * - role_remove_member: https://freeipa.readthedocs.io/en/latest/api/role_remove_member.html
 * - role_show: https://freeipa.readthedocs.io/en/latest/api/role_show.html
 */

interface RoleShowPayload {
  roleNamesList: string[];
  no_members?: boolean;
  version: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Add entity to roles
     * @param {string} toId - ID of the entity to add to roles
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the roles
     */
    addToRoles: build.mutation<BatchRPCResponse, [string, string, string[]]>({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const roleNames = payload[2];
        const membersToAdd: Command[] = [];
        roleNames.map((roleName) => {
          const payloadItem = {
            method: "role_add_member",
            params: [[roleName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    /**
     * Delete entity from roles
     * @param {string} memberId - ID of the entity to remove from roles
     * @param {string} memberType - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfRoles - List of members to remove from roles
     */
    removeFromRoles: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const listOfRoles = payload[2];
        const membersToRemove: Command[] = [];
        listOfRoles.map((role) => {
          const payloadItem: Command = {
            method: "role_remove_member",
            params: [[role], { [memberType]: memberId }],
          };
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
    /**
     * Given a list of roles names, show the full data of those roles
     * @param {RoleShowPayload} - Payload with role names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getRolesInfoByName: build.query<Role[], RoleShowPayload>({
      query: (payload) => {
        const roleNames = payload.roleNamesList;
        const noMembers = payload.no_members || false;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const roleShowCommands: Command[] = roleNames.map((roleName) => ({
          method: "role_show",
          params: [[roleName], { no_members: noMembers }],
        }));
        return getBatchCommand(roleShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): Role[] => {
        const roleList: Role[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const roleData = apiToRole(results[i].result);
          roleList.push(roleData);
        }
        return roleList;
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingRolesQuery = (payloadData, options) => {
  payloadData["objName"] = "role";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData, options);
};

export const {
  useAddToRolesMutation,
  useRemoveFromRolesMutation,
  useGetRolesInfoByNameQuery,
} = extendedApi;
