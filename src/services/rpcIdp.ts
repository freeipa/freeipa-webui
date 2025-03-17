import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  getCommand,
} from "./rpc";
// Data types
import { cnType } from "src/utils/datatypes/globalDataTypes";
// Redux
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Password policies-related endpoints: useGetIdpEntriesQuery, useSearchIdpEntriesMutation
 *
 * API commands:
 * - idp_find: https://freeipa.readthedocs.io/en/latest/api/idp_find.html
 * - idp_show: https://freeipa.readthedocs.io/en/latest/api/idp_show.html
 */

export interface IdpFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

export interface IdpFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Find IdP servers full data.
     * @param IdpFullDataPayload
     * @returns List of IdP server entries
     *
     */
    getIdpEntries: build.query<BatchRPCResponse, IdpFullDataPayload>({
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

        // FETCH IDP DATA VIA "idp_find" COMMAND
        // Prepare search parameters
        const idpFindParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataIdpFind: Command = {
          method: "idp_find",
          params: [[searchValue], idpFindParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultIdpFind = await fetchWithBQ(
          getCommand(payloadDataIdpFind)
        );
        // Return possible errors
        if (getResultIdpFind.error) {
          return { error: getResultIdpFind.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataIdpFind = getResultIdpFind.data as FindRPCResponse;

        const idpIds: string[] = [];
        const idpItemsCount = responseDataIdpFind.result.result
          .length as number;

        for (let i = startIdx; i < idpItemsCount && i < stopIdx; i++) {
          const idpId = responseDataIdpFind.result.result[i] as cnType;
          const { cn } = idpId;
          idpIds.push(cn[0] as string);
        }

        // FETCH IDP DATA VIA "idp_show" COMMAND
        const commands: Command[] = [];
        idpIds.forEach((idpId) => {
          commands.push({
            method: "idp_show",
            params: [[idpId], {}],
          });
        });

        const idpShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = idpShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = idpItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Search for a specific IdP server.
     * @param IdpFullDataPayload
     * @returns IdP entries that match with the search criteria
     */
    searchIdpEntries: build.mutation<BatchRPCResponse, IdpFullDataPayload>({
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

        // FETCH IDP DATA VIA "idp_find" COMMAND
        // Prepare search parameters
        const idpFindParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataIdpFind: Command = {
          method: "idp_find",
          params: [[searchValue], idpFindParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultIdpFind = await fetchWithBQ(
          getCommand(payloadDataIdpFind)
        );
        // Return possible errors
        if (getResultIdpFind.error) {
          return { error: getResultIdpFind.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataIdpFind = getResultIdpFind.data as FindRPCResponse;

        const idpIds: string[] = [];
        const idpItemsCount = responseDataIdpFind.result.result
          .length as number;

        for (let i = startIdx; i < idpItemsCount && i < stopIdx; i++) {
          const idpId = responseDataIdpFind.result.result[i] as cnType;
          const { cn } = idpId;
          idpIds.push(cn[0] as string);
        }

        // FETCH IDP DATA VIA "idp_show" COMMAND
        const commands: Command[] = [];
        idpIds.forEach((idpId) => {
          commands.push({
            method: "idp_show",
            params: [[idpId], {}],
          });
        });

        const idpShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = idpShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = idpItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetIdpEntriesQuery, useSearchIdpEntriesMutation } =
  extendedApi;
