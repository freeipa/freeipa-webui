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
 * ID ranges-related endpoints: useIdRangesFindQuery, useSearchIdRangesEntriesMutation
 *                              useIdRangesShowQuery
 *
 * API commands: idrange_find, idrange_show
 */

export interface IdRangesFindPayload {
  searchValue: string;
  sizeLimit: number;
  pkeyOnly?: boolean;
  version?: string;
  cn?: string;
  ipabaseid?: number;
  ipaidrangesize?: number;
  ipabaserid?: number;
  ipasecondarybaserid?: number;
  ipanttrusteddomainsid?: string;
  iparangetype?: "ipa-ad-trust" | "ipa-ad-trust-posix" | "ipa-local";
  ipaautoprivategroups?: "true" | "false" | "hybrid";
  timelimit?: number;
  all?: boolean; // required flag in docs (default false)
  raw?: boolean; // required flag in docs (default false)
}

export interface IdRangesFindResult {
  dn: string;
  cn: string[];
}

export interface IdRangesShowPayload {
  cn: string;
  rights?: boolean;
  all?: boolean;
  raw?: boolean;
  version?: string;
}

export interface IdRangeDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get ID range IDs
     * @param {IdRangesFindPayload} payload - The payload containing search parameters
     * @returns {IdRangesFindResponse} - Response data or error
     */
    idRangesFind: build.query<FindRPCResponse, IdRangesFindPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          pkey_only: payload.pkeyOnly || true,
          sizelimit: payload.sizeLimit,
          version: payload.version || API_VERSION_BACKUP,
          all: payload.all ?? false,
          raw: payload.raw ?? false,
        };

        // Add optional filters if provided
        const optionalKeys: Array<
          keyof Omit<
            IdRangesFindPayload,
            "searchValue" | "sizeLimit" | "pkeyOnly" | "version" | "all" | "raw"
          >
        > = [
          "cn",
          "ipabaseid",
          "ipaidrangesize",
          "ipabaserid",
          "ipasecondarybaserid",
          "ipanttrusteddomainsid",
          "iparangetype",
          "ipaautoprivategroups",
          "timelimit",
        ];

        optionalKeys.forEach((key) => {
          const value = payload[key];
          if (value !== undefined) {
            params[key] = value;
          }
        });

        return getCommand({
          method: "idrange_find",
          params: [[payload.searchValue], params],
        });
      },
    }),
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
     * Get ID range details
     * @param {IdRangesShowPayload} payload - The payload containing ID range identifier and flags
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    idRangesShow: build.query<FindRPCResponse, IdRangesShowPayload>({
      query: (payload) => {
        const params = {
          rights: payload.rights ?? false,
          all: payload.all ?? false,
          raw: payload.raw ?? false,
          version: payload.version || API_VERSION_BACKUP,
        };
        return getCommand({
          method: "idrange_show",
          params: [[payload.cn], params],
        });
      },
    }),
    /**
     * Get a paginated list of ID Range entries with details (batch of idrange_show)
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
  }),
});

export const {
  useIdRangesFindQuery,
  useSearchIdRangesEntriesMutation,
  useIdRangesShowQuery,
  useGetIdRangeEntriesQuery,
} = extendedApi;
