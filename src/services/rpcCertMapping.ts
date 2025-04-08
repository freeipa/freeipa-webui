import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  getCommand,
} from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
// Data types
import { cnType } from "src/utils/datatypes/globalDataTypes";

/**
 * Password policies-related endpoints: useCertMapRuleFindQuery, useGetCertMapRuleEntriesQuery,
 *                             useSearchCertMapRuleEntriesMutation
 *
 * API commands:
 * - certmaprule_find: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmaprule_find.html
 * - certmaprule_show: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmaprule_show.html
 */

export interface CertMapFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

export interface CertMapFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get certificate mapping IDs
     * @param {CertMapFindPayload} - Payload with search value and options
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     *
     */
    certMapRuleFind: build.query<FindRPCResponse, CertMapFindPayload>({
      query: (payload) => {
        const certmapruleParams = {
          pkey_only: payload.pkeyOnly,
          sizelimit: payload.sizeLimit,
          version: payload.version || API_VERSION_BACKUP,
        };

        return getCommand({
          method: "certmaprule_find",
          params: [[payload.searchValue], certmapruleParams],
        });
      },
    }),
    /**
     * Find certificate mapping full data.
     * @param CertMapFullDataPayload
     * @returns List of certificate mapping entries
     *
     */
    getCertMapRuleEntries: build.query<
      BatchRPCResponse,
      CertMapFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            },
          };
        }

        // FETCH CERT. MAPPING DATA VIA "certmaprule_find" COMMAND
        // Prepare search parameters
        const certMapIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataCertMap: Command = {
          method: "certmaprule_find",
          params: [[searchValue], certMapIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultCertMap = await fetchWithBQ(
          getCommand(payloadDataCertMap)
        );
        // Return possible errors
        if (getResultCertMap.error) {
          return { error: getResultCertMap.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataCertMap = getResultCertMap.data as FindRPCResponse;

        const certMapIds: string[] = [];
        const certMapItemsCount = responseDataCertMap.result.result
          .length as number;

        for (let i = startIdx; i < certMapItemsCount && i < stopIdx; i++) {
          const certMapId = responseDataCertMap.result.result[i] as cnType;
          const { cn } = certMapId;
          certMapIds.push(cn[0] as string);
        }

        // FETCH CERT. MAPPING DATA VIA "certmaprule_show" COMMAND
        const commands: Command[] = [];
        certMapIds.forEach((certMapId) => {
          commands.push({
            method: "certmaprule_show",
            params: [[certMapId], {}],
          });
        });

        const certMapShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = certMapShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = certMapItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Search for a specific password policy.
     * @param CertMapFullDataPayload
     * @returns Certificate mapping entries that match with the search criteria
     */
    searchCertMapRuleEntries: build.mutation<
      BatchRPCResponse,
      CertMapFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            },
          };
        }

        // FETCH CERT. MAPPING DATA VIA "certmaprule_find" COMMAND
        // Prepare search parameters
        const certMapIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataCertMap: Command = {
          method: "certmaprule_find",
          params: [[searchValue], certMapIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultCertMap = await fetchWithBQ(
          getCommand(payloadDataCertMap)
        );
        // Return possible errors
        if (getResultCertMap.error) {
          return { error: getResultCertMap.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataCertMap = getResultCertMap.data as FindRPCResponse;

        const certMapIds: string[] = [];
        const certMapItemsCount = responseDataCertMap.result.result
          .length as number;

        for (let i = startIdx; i < certMapItemsCount && i < stopIdx; i++) {
          const certMapId = responseDataCertMap.result.result[i] as cnType;
          const { cn } = certMapId;
          certMapIds.push(cn[0] as string);
        }

        // FETCH CERT. MAPPING DATA VIA "certmaprule_show" COMMAND
        const commands: Command[] = [];
        certMapIds.forEach((certMapId) => {
          commands.push({
            method: "certmaprule_show",
            params: [[certMapId], {}],
          });
        });

        const certMapShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = certMapShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = certMapItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCertMapRuleFindQuery,
  useGetCertMapRuleEntriesQuery,
  useSearchCertMapRuleEntriesMutation,
} = extendedApi;
