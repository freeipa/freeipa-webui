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
// Redux
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Password policies-related endpoints: usePwPolicyFindQuery, useGetPwPoliciesEntriesQuery, useSearchPwdPolicyEntriesMutation,
 *
 * API commands:
 * - pwpolicy_find: https://freeipa.readthedocs.io/en/ipa-4-11/api/pwpolicy_find.html
 * - pwpolicy_show: https://freeipa.readthedocs.io/en/ipa-4-11/api/pwpolicy_show.html
 */

export interface PwPolicyFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

export interface PwPolicyFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get password policy IDs
     * @param {PwPolicyFindPayload} - Payload with search value and options
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     *
     */
    PwPolicyFind: build.query<FindRPCResponse, PwPolicyFindPayload>({
      query: (payload) => {
        const pwpolicyParams = {
          pkey_only: payload.pkeyOnly,
          sizelimit: payload.sizeLimit,
          version: payload.version || API_VERSION_BACKUP,
        };

        return getCommand({
          method: "pwpolicy_find",
          params: [[payload.searchValue], pwpolicyParams],
        });
      },
    }),
    /**
     * Find password policies full data.
     * @param PwPolicyFullDataPayload
     * @returns List of pasword policies entries
     *
     */
    getPwPoliciesEntries: build.query<
      BatchRPCResponse,
      PwPolicyFullDataPayload
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
            } as FetchBaseQueryError,
          };
        }

        // FETCH PWD POLICIES DATA VIA "pwpolicy_find" COMMAND
        // Prepare search parameters
        const pwPolicyIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataPwPolicy: Command = {
          method: "pwpolicy_find",
          params: [[searchValue], pwPolicyIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultPwdPolicy = await fetchWithBQ(
          getCommand(payloadDataPwPolicy)
        );
        // Return possible errors
        if (getResultPwdPolicy.error) {
          return { error: getResultPwdPolicy.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataPwPolicy = getResultPwdPolicy.data as FindRPCResponse;

        const pwPolicyIds: string[] = [];
        const pwPolicyItemsCount = responseDataPwPolicy.result.result
          .length as number;

        for (let i = startIdx; i < pwPolicyItemsCount && i < stopIdx; i++) {
          const pwPolicyId = responseDataPwPolicy.result.result[i] as cnType;
          const { cn } = pwPolicyId;
          pwPolicyIds.push(cn[0] as string);
        }

        // FETCH PASSWORD POLICY DATA VIA "pwpolicy_show" COMMAND
        const commands: Command[] = [];
        pwPolicyIds.forEach((pwPolicyId) => {
          commands.push({
            method: "pwpolicy_show",
            params: [[pwPolicyId], {}],
          });
        });

        const pwdPolicyShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = pwdPolicyShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = pwPolicyItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Search for a specific password policy.
     * @param SubIdDataPayload
     * @returns Subordinate ID entries that match with the search criteria
     */
    searchPwdPolicyEntries: build.mutation<
      BatchRPCResponse,
      PwPolicyFullDataPayload
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
            } as FetchBaseQueryError,
          };
        }

        // FETCH PWD POLICIES DATA VIA "pwpolicy_find" COMMAND
        // Prepare search parameters
        const pwPolicyIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataPwPolicy: Command = {
          method: "pwpolicy_find",
          params: [[searchValue], pwPolicyIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultPwdPolicy = await fetchWithBQ(
          getCommand(payloadDataPwPolicy)
        );
        // Return possible errors
        if (getResultPwdPolicy.error) {
          return { error: getResultPwdPolicy.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataPwPolicy = getResultPwdPolicy.data as FindRPCResponse;

        const pwPolicyIds: string[] = [];
        const pwPolicyItemsCount = responseDataPwPolicy.result.result
          .length as number;

        for (let i = startIdx; i < pwPolicyItemsCount && i < stopIdx; i++) {
          const pwPolicyId = responseDataPwPolicy.result.result[i] as cnType;
          const { cn } = pwPolicyId;
          pwPolicyIds.push(cn[0] as string);
        }

        // FETCH PASSWORD POLICY DATA VIA "pwpolicy_show" COMMAND
        const commands: Command[] = [];
        pwPolicyIds.forEach((pwPolicyId) => {
          commands.push({
            method: "pwpolicy_show",
            params: [[pwPolicyId], {}],
          });
        });

        const pwdPolicyShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = pwdPolicyShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = pwPolicyItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  usePwPolicyFindQuery,
  useGetPwPoliciesEntriesQuery,
  useSearchPwdPolicyEntriesMutation,
} = extendedApi;
