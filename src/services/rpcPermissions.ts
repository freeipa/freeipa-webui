import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Permission, cnType } from "../utils/datatypes/globalDataTypes";
import { apiToPermission } from "../utils/permissionsUtils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Permissions-related endpoints
 *
 * API commands:
 * - permission_find: https://freeipa.readthedocs.io/en/latest/api/permission_find.html
 * - permission_show: https://freeipa.readthedocs.io/en/latest/api/permission_show.html
 * - permission_add: https://freeipa.readthedocs.io/en/latest/api/permission_add.html
 * - permission_del: https://freeipa.readthedocs.io/en/latest/api/permission_del.html
 * - permission_mod: https://freeipa.readthedocs.io/en/latest/api/permission_mod.html
 */

const PERMISSION_MOD_KEYS = [
  "ipapermright",
  "attrs",
  "ipapermbindruletype",
  "ipapermlocation",
  "extratargetfilter",
  "ipapermtarget",
  "memberof",
  "type",
  "targetgroup",
] as const;

const ARRAY_MOD_KEYS = new Set([
  "ipapermright",
  "attrs",
  "extratargetfilter",
  "memberof",
]);

const toModValue = (key: string, value: unknown): unknown => {
  if (!ARRAY_MOD_KEYS.has(key)) {
    return value;
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    return value.trim() === "" ? [] : [value];
  }
  return value;
};

interface PermissionAddPayload {
  cn: string;
  ipapermright: string[];
  ipapermbindruletype: string;
  type?: string;
  ipapermlocation?: string;
  extratargetfilter?: string[];
  memberof?: string[];
  ipapermtarget?: string;
  attrs?: string[];
}

interface PermissionsFullDataPayload {
  searchValue: string;
  sizeLimit: number;
  apiVersion: string;
  startIdx: number;
  stopIdx: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get permissions with full data via two-step permission_find + permission_show pattern
     * @param {PermissionsFullDataPayload} - Payload with search parameters
     * @returns {BatchRPCResponse} - Batch response with permission data
     */
    getPermissionsFullData: build.query<
      BatchRPCResponse,
      PermissionsFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, apiVersion, startIdx, stopIdx } =
          payloadData;

        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: apiVersion,
        };

        // Step 1: Find permission IDs
        const findCommand: Command = {
          method: "permission_find",
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
          const permissionId = findResponse.result.result[i] as cnType;
          ids.push(permissionId.cn[0] as string);
        }

        // Step 2: Batch show for each permission
        const showCommands: Command[] = ids.map((id) => ({
          method: "permission_show",
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
    /**
     * Add a new permission via `permission_add`
     * @param {PermissionAddPayload} - Payload with permission fields
     * @returns {FindRPCResponse} - Response from API
     */
    addPermission: build.mutation<FindRPCResponse, PermissionAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
          ipapermright: payload.ipapermright,
          ipapermbindruletype: payload.ipapermbindruletype,
        };
        if (payload.type) {
          params.type = payload.type;
        }
        if (payload.ipapermlocation) {
          params.ipapermlocation = payload.ipapermlocation;
        }
        if (payload.extratargetfilter) {
          params.extratargetfilter = payload.extratargetfilter;
        }
        if (payload.memberof) {
          params.memberof = payload.memberof;
        }
        if (payload.ipapermtarget) {
          params.ipapermtarget = payload.ipapermtarget;
        }
        if (payload.attrs && payload.attrs.length > 0) {
          params.attrs = payload.attrs;
        }
        return getCommand({
          method: "permission_add",
          params: [[payload.cn], params],
        });
      },
    }),
    /**
     * Delete permissions via batch `permission_del`
     * @param {Permission[]} - Array of permissions to delete
     * @returns {BatchRPCResponse} - Batch response
     */
    deletePermissions: build.mutation<BatchRPCResponse, Permission[]>({
      query: (permissions) => {
        const commands: Command[] = permissions.map((permission) => ({
          method: "permission_del",
          params: [[permission.cn], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Get a single permission by cn via `permission_show`
     * @param {string} cn - Permission name
     * @returns {Permission[]} - Permission data
     */
    getPermissionById: build.query<Permission[], string>({
      query: (cn) => {
        return getCommand({
          method: "permission_show",
          params: [[cn], { all: true, rights: true }],
        });
      },
      transformResponse: (response: FindRPCResponse): Permission[] => {
        if (response.result?.result) {
          return [
            apiToPermission(
              response.result.result as unknown as Record<string, unknown>
            ),
          ];
        }
        return [];
      },
    }),
    /**
     * Modify an existing permission via `permission_mod`
     * @param {Partial<Permission>} - Permission data to modify (must include cn)
     * @returns {FindRPCResponse} - Response from API
     */
    savePermission: build.mutation<FindRPCResponse, Partial<Permission>>({
      query: (permission) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };
        for (const key of PERMISSION_MOD_KEYS) {
          const value = permission[key];
          if (value !== undefined) {
            params[key] = toModValue(key, value);
          }
        }
        return getCommand({
          method: "permission_mod",
          params: [[permission.cn], params],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPermissionsFullDataQuery,
  useAddPermissionMutation,
  useDeletePermissionsMutation,
  useGetPermissionByIdQuery,
  useSavePermissionMutation,
} = extendedApi;
