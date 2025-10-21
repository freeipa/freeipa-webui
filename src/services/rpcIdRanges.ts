import {
  api,
  FindRPCResponse,
  getCommand,
  getBatchCommand,
  BatchRPCResponse,
  Command,
} from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";

/**
 * ID ranges-related endpoints: useIdRangesFindQuery, useSearchIdRangesEntriesMutation,
 *                              useGetIdRangeEntriesQuery, useAddIdRangeMutation,
 *                              useDeleteIdRangesMutation
 *
 * API commands:
 * - idrange_find: https://freeipa.readthedocs.io/en/latest/api/idrange_find.html
 * - idrange_show: https://freeipa.readthedocs.io/en/latest/api/idrange_show.html
 * - idrange_add: https://freeipa.readthedocs.io/en/latest/api/idrange_add.html
 * - idrange_del: https://freeipa.readthedocs.io/en/latest/api/idrange_del.html
 */

interface IdRangesFindResult {
  dn: string;
  cn: string[];
}

interface IdRangeDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

export interface AddIdRangePayload {
  cn: string;
  ipabaseid: string;
  ipaidrangesize: string;
  ipabaserid?: string;
  ipasecondarybaserid?: string;
  ipanttrusteddomainname?: string;
  ipanttrusteddomainsid?: string;
  ipaautoprivategroups?: string;
  iparangetype?: string;
  apiVersion?: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Search for specific ID ranges (Mutation)
     * @param {IdRangesFindPayload} payload - The payload containing search parameters
     * @returns {IdRangesFindResponse} - Response data or error
     */
    searchIdRangesEntries: build.mutation<BatchRPCResponse, IdRangeDataPayload>(
      {
        async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
          const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
            payloadData;

          // Prepare find parameters
          const params = {
            pkey_only: true,
            sizelimit: sizelimit,
            version: apiVersion || API_VERSION_BACKUP,
          };

          // idrange_find
          const findResult = await fetchWithBQ(
            getCommand({
              method: "idrange_find",
              params: [[searchValue], params],
            })
          );
          if (findResult.error) {
            return { error: findResult.error };
          }
          const findData = findResult.data as FindRPCResponse;
          const listSize = findData.result.result.length as number;

          // Build list of cns for the requested range
          const cnList: string[] = [];
          for (let i = startIdx; i < listSize && i < stopIdx; i++) {
            const entry = findData.result.result[i] as IdRangesFindResult;
            const cn = entry?.cn?.[0] as string | undefined;
            if (cn) cnList.push(cn);
          }

          // Batch show
          const commands: Command[] = cnList.map((cn) => ({
            method: "idrange_show",
            params: [[cn], {}],
          }));

          const batchShow = await fetchWithBQ(
            getBatchCommand(commands, apiVersion)
          );
          if (batchShow.error) {
            return { error: batchShow.error };
          }
          const response = batchShow.data as BatchRPCResponse;
          if (response) {
            response.result.totalCount = listSize;
          }
          return { data: response };
        },
      }
    ),
    /**
     * Get a paginated list of ID Range entries with details (batch of idrange_show)
     * @param {IdRangeDataPayload} payload - The payload containing pagination and search parameters
     * @returns {BatchRPCResponse} - Response data (batched idrange_show) or error
     */
    getIdRangeEntries: build.query<BatchRPCResponse, IdRangeDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;

        // Prepare find parameters
        const params = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion || API_VERSION_BACKUP,
        };

        // idrange_find
        const findResult = await fetchWithBQ(
          getCommand({
            method: "idrange_find",
            params: [[searchValue], params],
          })
        );
        if (findResult.error) {
          return { error: findResult.error };
        }
        const findData = findResult.data as FindRPCResponse;
        const listSize = findData.result.result.length as number;

        // Build list of cns for the requested page range
        const cnList: string[] = [];
        for (let i = startIdx; i < listSize && i < stopIdx; i++) {
          const entry = findData.result.result[i] as IdRangesFindResult;
          const cn = entry?.cn?.[0] as string | undefined;
          if (cn) cnList.push(cn);
        }

        // Build batch idrange_show commands
        const commands: Command[] = cnList.map((cn) => ({
          method: "idrange_show",
          params: [[cn], {}],
        }));

        const batchShow = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );
        if (batchShow.error) {
          return { error: batchShow.error };
        }
        const response = batchShow.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = listSize;
        }
        return { data: response };
      },
    }),
    /**
     * Add ID range
     * @param {AddIdRangePayload} payload - The payload containing new ID range parameters
     * @returns {FindRPCResponse} - Response data or error
     */
    addIdRange: build.mutation<FindRPCResponse, AddIdRangePayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: payload.apiVersion || API_VERSION_BACKUP,
        };

        const optionalKeys: Array<
          keyof Omit<AddIdRangePayload, "cn" | "apiVersion">
        > = [
          "ipabaseid",
          "ipaidrangesize",
          "ipabaserid",
          "ipasecondarybaserid",
          "ipanttrusteddomainname",
          "ipanttrusteddomainsid",
          "ipaautoprivategroups",
          "iparangetype",
        ];

        optionalKeys.forEach((key) => {
          const value = payload[key];
          if (value !== undefined && value !== "") {
            params[key] = value;
          }
        });

        const cn = payload.cn !== "" ? [payload.cn] : [];

        return getCommand({
          method: "idrange_add",
          params: [cn, params],
        });
      },
    }),
    /**
     * Delete ID ranges
     * @param {string[]} payload - List of range names (cn) to delete
     * @returns {BatchRPCResponse} - Batch response with per-item results or error
     */
    deleteIdRanges: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = payload.map((cn) => ({
          method: "idrange_del",
          params: [[cn], {}],
        }));

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
  }),
});

export const {
  useSearchIdRangesEntriesMutation,
  useGetIdRangeEntriesQuery,
  useAddIdRangeMutation,
  useDeleteIdRangesMutation,
} = extendedApi;
