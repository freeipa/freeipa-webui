import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { apiToSysAccount } from "src/utils/sysaccountsUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SysAccount } from "../utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * System account-related endpoints
 *
 * API commands:
 * - sysaccount_find: https://freeipa.readthedocs.io/en/latest/api/sysaccount_find.html
 * - sysaccount_show: https://freeipa.readthedocs.io/en/latest/api/sysaccount_show.html
 * - sysaccount_add:  https://freeipa.readthedocs.io/en/latest/api/sysaccount_add.html
 * - sysaccount_del:  https://freeipa.readthedocs.io/en/latest/api/sysaccount_del.html
 * - sysaccount_mod:  https://freeipa.readthedocs.io/en/latest/api/sysaccount_mod.html
 */

interface SysAccountsFullDataPayload {
  searchValue: string;
  sizeLimit: number;
  apiVersion: string;
  startIdx: number;
  stopIdx: number;
}

interface SysAccountsFullDataResponse {
  sysAccounts: SysAccount[];
  totalCount: number;
}

interface SysAccountAddPayload {
  cn: string;
  description?: string;
  userpassword?: string;
  privileged?: boolean;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Simple search for system accounts (used by member selectors)
     * @param {string} searchValue - Search criteria
     * @returns {SysAccount[]} - List of system accounts
     */
    getSysaccounts: build.query<SysAccount[], string>({
      query: (searchValue) => {
        return getCommand({
          method: "sysaccount_find",
          params: [
            [searchValue],
            {
              version: API_VERSION_BACKUP,
              sizelimit: 100,
              all: true,
            },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse): SysAccount[] => {
        const results = response.result.result as unknown as Record<
          string,
          unknown
        >[];
        return results.map((result) => apiToSysAccount(result));
      },
    }),
    /**
     * List system accounts via two-step sysaccount_find + sysaccount_show
     * @param {SysAccountsFullDataPayload} payloadData - Search and pagination params
     * @returns {SysAccountsFullDataResponse} - Parsed system accounts and total count
     */
    getSysAccountsFullData: build.query<
      SysAccountsFullDataResponse,
      SysAccountsFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, apiVersion, startIdx, stopIdx } =
          payloadData;

        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: apiVersion,
        };

        // Step 1: Find system account IDs
        const findCommand: Command = {
          method: "sysaccount_find",
          params: [[searchValue], params],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));
        if (findResult.error) {
          return { error: findResult.error as FetchBaseQueryError };
        }

        const findResponse = findResult.data as FindRPCResponse;
        const totalCount = findResponse.result.count as number;
        const pageItemsCount = findResponse.result.result.length as number;
        const ids: string[] = [];

        for (let i = startIdx; i < pageItemsCount && i < stopIdx; i++) {
          const item = findResponse.result.result[i] as Record<string, unknown>;
          ids.push((item.uid as string[])[0]);
        }

        // Step 2: Batch show for each system account
        if (ids.length === 0) {
          return { data: { sysAccounts: [], totalCount } };
        }

        const showCommands: Command[] = ids.map((id) => ({
          method: "sysaccount_show",
          params: [[id], { no_members: true }],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersion)
        );

        if (showResult.error) {
          return { error: showResult.error as FetchBaseQueryError };
        }

        const batchResponse = showResult.data as BatchRPCResponse;
        const results = batchResponse.result.results as unknown as {
          result: Record<string, unknown>;
        }[];
        const sysAccounts: SysAccount[] = results.map((entry) =>
          apiToSysAccount(entry.result)
        );

        return {
          data: { sysAccounts, totalCount },
        };
      },
    }),
    /**
     * Add a new system account via `sysaccount_add`
     * @param {SysAccountAddPayload} payload - System account data
     * @returns {FindRPCResponse} - Response from API
     */
    addSysAccount: build.mutation<FindRPCResponse, SysAccountAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };
        if (payload.description) {
          params.description = payload.description;
        }
        if (payload.userpassword) {
          params.userpassword = payload.userpassword;
        }
        if (payload.privileged !== undefined) {
          params.privileged = payload.privileged;
        }
        return getCommand({
          method: "sysaccount_add",
          params: [[payload.cn], params],
        });
      },
    }),
    /**
     * Delete system accounts via batch `sysaccount_del`
     * @param {SysAccount[]} sysAccounts - System accounts to delete
     * @returns {BatchRPCResponse} - Batch response
     */
    deleteSysAccounts: build.mutation<BatchRPCResponse, SysAccount[]>({
      query: (sysAccounts) => {
        const commands: Command[] = sysAccounts.map((account) => ({
          method: "sysaccount_del",
          params: [[account.uid], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSysaccountsQuery,
  useGetSysAccountsFullDataQuery,
  useAddSysAccountMutation,
  useDeleteSysAccountsMutation,
} = extendedApi;
