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

export const { useSearchIdRangesEntriesMutation, useGetIdRangeEntriesQuery } =
  extendedApi;
