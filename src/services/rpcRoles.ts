import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToRole } from "src/utils/rolesUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Role, cnType } from "../utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Roles-related endpoints: addToRoles, removeFromRoles, getRolesInfoByName, addRole, deleteRoles
 *
 * API commands:
 * - role_find: https://freeipa.readthedocs.io/en/latest/api/role_find.html
 * - role_show: https://freeipa.readthedocs.io/en/latest/api/role_show.html
 * - role_add: https://freeipa.readthedocs.io/en/latest/api/role_add.html
 * - role_del: https://freeipa.readthedocs.io/en/latest/api/role_del.html
 * - role_add_member: https://freeipa.readthedocs.io/en/latest/api/role_add_member.html
 * - role_remove_member: https://freeipa.readthedocs.io/en/latest/api/role_remove_member.html
 */

interface RoleShowPayload {
  roleNamesList: string[];
  no_members?: boolean;
  version: string;
}

interface RoleAddPayload {
  cn: string;
  description?: string;
}

interface RolesSearchPayload {
  searchValue: string;
  sizeLimit: number;
  apiVersion: string;
  startIdx: number;
  stopIdx: number;
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
    /**
     * Add a new role via `role_add`
     * @param {RoleAddPayload} - Payload with role cn and optional description
     * @returns {FindRPCResponse} - Response from API
     */
    addRole: build.mutation<FindRPCResponse, RoleAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };
        if (payload.description) {
          params.description = payload.description;
        }
        return getCommand({
          method: "role_add",
          params: [[payload.cn], params],
        });
      },
    }),
    /**
     * Delete roles via batch `role_del`
     * @param {Role[]} - Array of roles to delete
     * @returns {BatchRPCResponse} - Batch response
     */
    deleteRoles: build.mutation<BatchRPCResponse, Role[]>({
      query: (roles) => {
        const commands: Command[] = roles.map((role) => ({
          method: "role_del",
          params: [[role.cn], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Modify an existing role via `role_mod`
     * @param {Partial<Role>} - Role data to modify (must include cn)
     * @returns {FindRPCResponse} - Response from API
     */
    saveRole: build.mutation<FindRPCResponse, Partial<Role>>({
      query: (role) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...role,
        };
        delete params.cn;
        return getCommand({
          method: "role_mod",
          params: [[role.cn], params],
        });
      },
    }),
    /**
     * Search roles via two-step role_find + role_show pattern
     * @param {RolesSearchPayload} - Search parameters
     * @returns {BatchRPCResponse} - Batch response with role data
     */
    searchRolesEntries: build.mutation<BatchRPCResponse, RolesSearchPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, apiVersion, startIdx, stopIdx } =
          payloadData;

        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: apiVersion,
          all: true,
        };

        // Step 1: Find role IDs
        const findCommand: Command = {
          method: "role_find",
          params: [[searchValue], params],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));
        if (findResult.error) {
          return { error: findResult.error as FetchBaseQueryError };
        }

        const findResponse = findResult.data as FindRPCResponse;
        const totalCount = findResponse.result.result.length as number;
        const ids: string[] = [];

        for (let i = startIdx; i < totalCount && i < stopIdx; i++) {
          const roleId = findResponse.result.result[i] as cnType;
          ids.push(roleId.cn[0] as string);
        }

        // Step 2: Batch show for each role
        const showCommands: Command[] = ids.map((id) => ({
          method: "role_show",
          params: [[id], { no_members: true }],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersion)
        );

        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalCount;
        }

        return response
          ? { data: response }
          : { error: showResult.error as FetchBaseQueryError };
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingRolesQuery = (payloadData, options?) => {
  payloadData["objName"] = "role";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData, options);
};

export const useRoleShowQuery = (roleId: string) => {
  return useGetRolesInfoByNameQuery(
    {
      roleNamesList: [roleId],
      no_members: true,
      version: API_VERSION_BACKUP,
    },
    { skip: !roleId }
  );
};

export const {
  useAddToRolesMutation,
  useRemoveFromRolesMutation,
  useGetRolesInfoByNameQuery,
  useAddRoleMutation,
  useDeleteRolesMutation,
  useSearchRolesEntriesMutation,
  useSaveRoleMutation,
} = extendedApi;
