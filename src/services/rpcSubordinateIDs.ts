import {
  api,
  BatchRPCResponse,
  Command,
  FindRPCResponse,
  getBatchCommand,
  getCommand,
} from "./rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Data types
import { SubId } from "src/utils/datatypes/globalDataTypes";

/**
 * Endpoints: useGetSubIdEntriesQuery, useSearchSubIdEntriesMutation
 *
 * API commands:
 * - subid_find: https://freeipa.readthedocs.io/en/latest/api/subid_find.html
 * - subid_show: https://freeipa.readthedocs.io/en/latest/api/subid_show.html
 */

export interface SubIdDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

// API
const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
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
  }),
});

export const { useGetSubIdEntriesQuery, useSearchSubIdEntriesMutation } =
  extendedApi;
