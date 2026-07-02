import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Privilege, cnType } from "../utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Privileges-related endpoints
 *
 * API commands:
 * - privilege_find: https://freeipa.readthedocs.io/en/latest/api/privilege_find.html
 * - privilege_show: https://freeipa.readthedocs.io/en/latest/api/privilege_show.html
 * - privilege_add: https://freeipa.readthedocs.io/en/latest/api/privilege_add.html
 * - privilege_del: https://freeipa.readthedocs.io/en/latest/api/privilege_del.html
 */

interface PrivilegeAddPayload {
  cn: string;
  description?: string;
}

interface PrivilegesFullDataPayload {
  searchValue: string;
  sizeLimit: number;
  apiVersion: string;
  startIdx: number;
  stopIdx: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get privileges with full data via two-step privilege_find + privilege_show pattern
     * @param {PrivilegesFullDataPayload} - Payload with search parameters
     * @returns {BatchRPCResponse} - Batch response with privilege data
     */
    getPrivilegesFullData: build.query<
      BatchRPCResponse,
      PrivilegesFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, apiVersion, startIdx, stopIdx } =
          payloadData;

        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: apiVersion,
        };

        // Step 1: Find privilege IDs
        const findCommand: Command = {
          method: "privilege_find",
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
          const privilegeId = findResponse.result.result[i] as cnType;
          ids.push(privilegeId.cn[0] as string);
        }

        // Step 2: Batch show for each privilege
        const showCommands: Command[] = ids.map((id) => ({
          method: "privilege_show",
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
     * Add a new privilege via `privilege_add`
     * @param {PrivilegeAddPayload} - Payload with privilege cn and optional description
     * @returns {FindRPCResponse} - Response from API
     */
    addPrivilege: build.mutation<FindRPCResponse, PrivilegeAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };
        if (payload.description) {
          params.description = payload.description;
        }
        return getCommand({
          method: "privilege_add",
          params: [[payload.cn], params],
        });
      },
    }),
    /**
     * Delete privileges via batch `privilege_del`
     * @param {Privilege[]} - Array of privileges to delete
     * @returns {BatchRPCResponse} - Batch response
     */
    deletePrivileges: build.mutation<BatchRPCResponse, Privilege[]>({
      query: (privileges) => {
        const commands: Command[] = privileges.map((privilege) => ({
          method: "privilege_del",
          params: [[privilege.cn], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Search privileges via two-step privilege_find + privilege_show pattern
     * @param {PrivilegesFullDataPayload} - Search parameters
     * @returns {BatchRPCResponse} - Batch response with privilege data
     */
    searchPrivilegesEntries: build.mutation<
      BatchRPCResponse,
      PrivilegesFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, apiVersion, startIdx, stopIdx } =
          payloadData;

        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: apiVersion,
        };

        // Step 1: Find privilege IDs
        const findCommand: Command = {
          method: "privilege_find",
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
          const privilegeId = findResponse.result.result[i] as cnType;
          ids.push(privilegeId.cn[0] as string);
        }

        // Step 2: Batch show for each privilege
        const showCommands: Command[] = ids.map((id) => ({
          method: "privilege_show",
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

export const {
  useGetPrivilegesFullDataQuery,
  useAddPrivilegeMutation,
  useDeletePrivilegesMutation,
  useSearchPrivilegesEntriesMutation,
} = extendedApi;
