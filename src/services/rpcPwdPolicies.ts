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
import { cnType, PwPolicy } from "src/utils/datatypes/globalDataTypes";
// Redux
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Password policies-related endpoints:
 *     usePwPolicyFindQuery, useGetPwPoliciesEntriesQuery, useSearchPwdPolicyEntriesMutation,
 *     usePwPolicyAddMutation, usePwPolicyDeleteMutation, usePwPolicyShowQuery, usePwPolicyModMutation
 *
 * API commands:
 * - pwpolicy_find: https://freeipa.readthedocs.io/en/ipa-4-11/api/pwpolicy_find.html
 * - pwpolicy_show: https://freeipa.readthedocs.io/en/ipa-4-11/api/pwpolicy_show.html
 * - pwpolicy_add: https://freeipa.readthedocs.io/en/ipa-4-11/api/pwpolicy_add.html
 * - pwpolicy_del: https://freeipa.readthedocs.io/en/ipa-4-11/api/pwpolicy_del.html
 * - pwpolicy_mod: https://freeipa.readthedocs.io/en/ipa-4-11/api/pwpolicy_mod.html
 */

export interface PwPolicyFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

interface PwPolicyFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

export interface PwPolicyAddPayload {
  groupId: string;
  priority: string;
  version?: string;
}

// Modified values are either the value (in string) or an array ([]) when set to empty string
export interface PwPolicyModPayload {
  pwPolicyId: string;
  krbmaxpwdlife?: string | [];
  krbminpwdlife?: string | [];
  krbpwdhistorylength?: string | [];
  krbpwdmindiffchars?: string | [];
  krbpwdminlength?: string | [];
  krbpwdmaxfailure?: string | [];
  krbpwdfailurecountinterval?: string | [];
  krbpwdlockoutduration?: string | [];
  cospriority?: string;
  passwordgracelimit?: string | [];
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
    /**
     * Add a new password policy
     * @param {PwPolicyAddPayload} - Payload with the new password policy data
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    pwPolicyAdd: build.mutation<FindRPCResponse, PwPolicyAddPayload>({
      query: (payload) => {
        return getCommand({
          method: "pwpolicy_add",
          params: [
            [payload.groupId],
            {
              cospriority: payload.priority,
              version: payload.version || API_VERSION_BACKUP,
            },
          ],
        });
      },
    }),
    /**
     * Delete password policies
     * @param {PwPolicyDeletePayload} - Payload with the password policy IDs
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    pwPolicyDelete: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = [];
        payload.forEach((pwPolicyId) => {
          commands.push({
            method: "pwpolicy_del",
            params: [[pwPolicyId], {}],
          });
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Show a specific Password policy (with all its details).
     * @param string
     * @returns SubId
     */
    pwPolicyShow: build.query<PwPolicy, string>({
      query: (pwPolicyId) => {
        return getCommand({
          method: "pwpolicy_show",
          params: [
            [pwPolicyId],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse) => {
        return response.result.result as unknown as PwPolicy;
      },
    }),
    /**
     * Update a specific Password policy.
     * @param PwPolicyModPayload
     * @returns FindRPCResponse
     */
    pwPolicyMod: build.mutation<FindRPCResponse, PwPolicyModPayload>({
      query: (payload) => {
        const params = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
        };

        // Add the parameters that are not undefined
        if (payload.krbmaxpwdlife) {
          params["krbmaxpwdlife"] = payload.krbmaxpwdlife;
        }
        if (payload.krbminpwdlife) {
          params["krbminpwdlife"] = payload.krbminpwdlife;
        }
        if (payload.krbpwdhistorylength) {
          params["krbpwdhistorylength"] = payload.krbpwdhistorylength;
        }
        if (payload.krbpwdmindiffchars) {
          params["krbpwdmindiffchars"] = payload.krbpwdmindiffchars;
        }
        if (payload.krbpwdminlength) {
          params["krbpwdminlength"] = payload.krbpwdminlength;
        }
        if (payload.krbpwdmaxfailure) {
          params["krbpwdmaxfailure"] = payload.krbpwdmaxfailure;
        }
        if (payload.krbpwdfailurecountinterval) {
          params["krbpwdfailurecountinterval"] =
            payload.krbpwdfailurecountinterval;
        }
        if (payload.krbpwdlockoutduration) {
          params["krbpwdlockoutduration"] = payload.krbpwdlockoutduration;
        }
        if (payload.cospriority) {
          params["cospriority"] = payload.cospriority;
        }
        if (payload.passwordgracelimit) {
          params["passwordgracelimit"] = payload.passwordgracelimit;
        }

        return getCommand({
          method: "pwpolicy_mod",
          params: [payload.pwPolicyId, params],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  usePwPolicyFindQuery,
  useGetPwPoliciesEntriesQuery,
  useSearchPwdPolicyEntriesMutation,
  usePwPolicyAddMutation,
  usePwPolicyDeleteMutation,
  usePwPolicyShowQuery,
  usePwPolicyModMutation,
} = extendedApi;
