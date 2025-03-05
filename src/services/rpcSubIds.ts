import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
  FindRPCResponse,
  getCommand,
} from "./rpc";
import { apiToSubId } from "src/utils/subIdUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SubId } from "src/utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Subordinate IDs-related endpoints: getSubIdsInfoByName, assignSubIds, getSubIdEntries, searchSubIdEntries, subidStats, subidMod
 *
 * API commands:
 * - subid_show: https://freeipa.readthedocs.io/en/latest/api/subid_show.html
 * - subid_generate: https://freeipa.readthedocs.io/en/latest/api/subid_generate.html
 * - subid_find: https://freeipa.readthedocs.io/en/latest/api/subid_find.html
 * - subid_stats: https://freeipa.readthedocs.io/en/latest/api/subid_stats.html
 * - subid_mod: https://freeipa.readthedocs.io/en/latest/api/subid_mod.html
 */

export interface SubIdsShowPayload {
  subIdsList: string[];
  version: string;
}

export interface SubIdPayload {
  ipauniqueid?: string;
  description?: string;
  ipaowner?: string;
  ipasubuidnumber?: string;
  ipasubgidnumber?: string;
  timelimit?: number;
  sizelimit?: number;
  version?: string;
}

export interface SubIdDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

export interface SubidFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

export interface SubidModPayload {
  ipauniqueid: string;
  description: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Given a list of Subordinate IDs , show the full data of those Subordinate IDs
     * @param {subIdsShowPayload} - Payload with Subordinate IDs and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getSubIdsInfoByName: build.query<SubId[], SubIdsShowPayload>({
      query: (payload) => {
        const subIdsList = payload.subIdsList;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const subIdsShowCommands: Command[] = subIdsList.map((subId) => ({
          method: "subid_show",
          params: [[subId], {}],
        }));
        return getBatchCommand(subIdsShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): SubId[] => {
        const subIdsList: SubId[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const subIdData = apiToSubId(results[i].result);
          subIdsList.push(subIdData);
        }
        return subIdsList;
      },
    }),
    /**
     * Generate and auto-assign subUID and subGID range to user entry
     * @param {uid} - User entry
     */
    assignSubIds: build.mutation<FindRPCResponse, string>({
      query: (uid) => {
        const params = [
          [],
          {
            ipaowner: uid,
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "subid_generate",
          params: params,
        });
      },
    }),
    /**
     * Find subordinate IDs.
     * @param SubIdDataPayload
     * @returns List of subordinate IDs entries
     *
     */
    getSubIdEntries: build.query<BatchRPCResponse, SubIdDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        // FETCH SUBID DATA VIA "subid_find" COMMAND
        // Prepare search parameters
        const subidsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataSubids: Command = {
          method: "subid_find",
          params: [[searchValue], subidsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultSubid = await fetchWithBQ(getCommand(payloadDataSubids));
        // Return possible errors
        if (getResultSubid.error) {
          return { error: getResultSubid.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataSubid = getResultSubid.data as FindRPCResponse;

        const subidIds: string[] = [];
        const subidsItemsCount = responseDataSubid.result.result
          .length as number;

        for (let i = startIdx; i < subidsItemsCount && i < stopIdx; i++) {
          const subidId = responseDataSubid.result.result[i] as SubId;
          const { ipauniqueid } = subidId;
          subidIds.push(ipauniqueid[0] as string);
        }

        // FETCH SUBID DATA VIA "subid_show" COMMAND
        const commands: Command[] = [];
        subidIds.forEach((subidId) => {
          commands.push({
            method: "subid_show",
            params: [[subidId], {}],
          });
        });

        const subIdsShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = subIdsShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = subidsItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Search for a specific subordinate ID.
     * @param SubIdDataPayload
     * @returns Subordinate ID entry
     */
    searchSubIdEntries: build.mutation<BatchRPCResponse, SubIdDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        // FETCH SUBID DATA VIA "subid_find" COMMAND
        // Prepare search parameters
        const subidsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataSubids: Command = {
          method: "subid_find",
          params: [[searchValue], subidsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultSubid = await fetchWithBQ(getCommand(payloadDataSubids));
        // Return possible errors
        if (getResultSubid.error) {
          return { error: getResultSubid.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataSubid = getResultSubid.data as FindRPCResponse;

        const subidIds: string[] = [];
        const subidsItemsCount = responseDataSubid.result.result
          .length as number;

        for (let i = startIdx; i < subidsItemsCount && i < stopIdx; i++) {
          const subidId = responseDataSubid.result.result[i] as SubId;
          const { ipauniqueid } = subidId;
          subidIds.push(ipauniqueid[0] as string);
        }

        // FETCH SUBID DATA VIA "subid_show" COMMAND
        const commands: Command[] = [];
        subidIds.forEach((subidId) => {
          commands.push({
            method: "subid_show",
            params: [[subidId], {}],
          });
        });

        const subIdsShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = subIdsShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = subidsItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Retrieves all subordinate IDs (unique IDs).
     * @param SubidFindPayload
     * @returns FindRPCResponse
     */
    subidFind: build.query<FindRPCResponse, SubidFindPayload>({
      query: (payload) => {
        return getCommand({
          method: "subid_find",
          params: [
            [payload.searchValue],
            {
              pkey_only: payload.pkeyOnly,
              sizelimit: payload.sizeLimit,
              version: payload.version || API_VERSION_BACKUP,
            },
          ],
        });
      },
    }),
    /**
     * Get subordinate ID statistics
     *
     */
    subidStats: build.query<FindRPCResponse, void>({
      query: () => {
        return getCommand({
          method: "subid_stats",
          params: [[], { all: true, version: API_VERSION_BACKUP }],
        });
      },
    }),
    /**
     * Show a specific subordinate ID (with all its details).
     * @param string
     * @returns SubId
     */
    subidShow: build.query<SubId, string>({
      query: (subid) => {
        return getCommand({
          method: "subid_show",
          params: [
            [subid],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse) => {
        return response.result.result as unknown as SubId;
      },
    }),
    /**
     * Update a specific subordinate ID.
     * @param SubidModPayload
     * @returns FindRPCResponse
     */
    subidMod: build.mutation<FindRPCResponse, SubidModPayload>({
      query: (payload) => {
        return getCommand({
          method: "subid_mod",
          params: [
            [payload.ipauniqueid],
            {
              all: true,
              rights: true,
              description: payload.description,
              version: API_VERSION_BACKUP,
            },
          ],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingSubIdsQuery = (payloadData) => {
  payloadData["objName"] = "subid";
  payloadData["objAttr"] = "ipauniqueid";
  return useGettingGenericQuery(payloadData);
};

export const {
  useGetSubIdsInfoByNameQuery,
  useAssignSubIdsMutation,
  useGetSubIdEntriesQuery,
  useSearchSubIdEntriesMutation,
  useSubidFindQuery,
  useSubidStatsQuery,
  useSubidShowQuery,
  useSubidModMutation,
} = extendedApi;
