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
import { Trust } from "../utils/datatypes/globalDataTypes";
import { apiToTrust } from "src/utils/trustsUtils";

/**
 * Trusts-related endpoints: useGetTrustsFullDataQuery, useSearchTrustsEntriesMutation
 *                           useAddTrustMutation, useDeleteTrustsMutation, useTrustShowQuery
 *                           useTrustModMutation
 *
 * API commands:
 * - trust_find: https://freeipa.readthedocs.io/en/latest/api/trust_find.html
 * - trust_show: https://freeipa.readthedocs.io/en/latest/api/trust_show.html
 * - trust_add: https://freeipa.readthedocs.io/en/latest/api/trust_add.html
 * - trust_del: https://freeipa.readthedocs.io/en/latest/api/trust_del.html
 * - trust_mod: https://freeipa.readthedocs.io/en/latest/api/trust_mod.html
 */

interface TrustsFullDataPayload {
  searchValue: string;
  apiVersion?: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

interface FindTrustArgs {
  cn: string;
  ipantflatname: string;
  ipanttrusteddomainsid: string;
  ipantsidblacklistincoming: string[];
  ipantsidblacklistoutgoing: string[];
}

export interface TrustAddPayload {
  domainName: string;
  bidirectional?: boolean;
  external?: boolean;
  realm_admin?: string;
  realm_passwd?: string;
  trust_secret?: string;
  range_type?: "" | "ipa-ad-trust" | "ipa-ad-trust-posix";
  base_id?: number;
  range_size?: number;
  version?: string;
}

export interface TrustModPayload {
  cn: string;
  ipantadditionalsuffixes?: string[];
  ipantsidblacklistincoming?: string[];
  ipantsidblacklistoutgoing?: string[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Find trusts full data
     * @param {TrustsFullDataPayload} payload - The payload containing search parameters
     * @returns {TrustsFullDataResponse} - List of trusts full data
     *
     */
    getTrustsFullData: build.query<BatchRPCResponse, TrustsFullDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;
        const apiVersionUsed = apiVersion || API_VERSION_BACKUP;

        // FETCH TRUSTS DATA VIA "trust_find" COMMAND
        // Prepare search parameters
        const trustsIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersionUsed,
        };

        // Prepare payload
        const payloadDataTrusts: Command = {
          method: "trust_find",
          params: [[searchValue], trustsIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultTrusts = await fetchWithBQ(
          getCommand(payloadDataTrusts)
        );

        // Return possible errors
        if (getResultTrusts.error) {
          return { error: getResultTrusts.error };
        }

        // If no error: cast and assign 'ids'
        const responseDataTrusts = getResultTrusts.data as FindRPCResponse;
        const trustsIds: string[] = [];
        const trustsItemsCount = responseDataTrusts.result.result
          .length as number;

        for (let i = startIdx; i < trustsItemsCount && i < stopIdx; i++) {
          const trustId = responseDataTrusts.result.result[i] as FindTrustArgs;
          trustsIds.push(trustId.cn[0]);
        }

        // FETCH TRUST DATA VIA "trust_show" COMMAND
        const commands: Command[] = [];
        trustsIds.map((trustId) => {
          commands.push({
            method: "trust_show",
            params: [[trustId], {}],
          });
        });

        const trustsShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersionUsed)
        );

        const response = trustsShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = trustsItemsCount;
        }

        // Return results
        const results: Trust[] = [];
        for (
          let i = startIdx;
          i < response.result.totalCount && i < stopIdx;
          i++
        ) {
          const trust = response.result.results[i].result as Record<
            string,
            unknown
          >;
          results.push(apiToTrust(trust));
        }

        return { data: response };
      },
    }),
    /**
     * Search for a specific Trust
     * @param {TrustsFullDataPayload} payload - The payload containing search parameters
     * @returns {BatchRPCResponse} - List of Trusts full data
     */
    searchTrustsEntries: build.mutation<
      BatchRPCResponse,
      TrustsFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;
        const apiVersionUsed = apiVersion || API_VERSION_BACKUP;

        // FETCH TRUSTS DATA VIA "trust_find" COMMAND
        // Prepare search parameters
        const trustsIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersionUsed,
        };

        // Prepare payload
        const payloadDataTrusts: Command = {
          method: "trust_find",
          params: [[searchValue], trustsIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultTrusts = await fetchWithBQ(
          getCommand(payloadDataTrusts)
        );

        // Return possible errors
        if (getResultTrusts.error) {
          return { error: getResultTrusts.error };
        }

        // If no error: cast and assign 'ids'
        const responseDataTrusts = getResultTrusts.data as FindRPCResponse;
        const trustsIds: string[] = [];
        const trustsItemsCount = responseDataTrusts.result.result
          .length as number;

        for (let i = startIdx; i < trustsItemsCount && i < stopIdx; i++) {
          const trustId = responseDataTrusts.result.result[i] as FindTrustArgs;
          trustsIds.push(trustId.cn[0]);
        }

        // FETCH TRUST DATA VIA "trust_show" COMMAND
        const commands: Command[] = [];
        trustsIds.map((trustId) => {
          commands.push({
            method: "trust_show",
            params: [[trustId], {}],
          });
        });

        const trustsShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersionUsed)
        );

        const response = trustsShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = trustsItemsCount;
        }

        // Return results
        const results: Trust[] = [];
        for (
          let i = startIdx;
          i < response.result.totalCount && i < stopIdx;
          i++
        ) {
          const trust = response.result.results[i].result as Record<
            string,
            unknown
          >;
          results.push(apiToTrust(trust));
        }

        return { data: response };
      },
    }),
    /**
     * Add a new trust
     * @param {TrustAddPayload} payload - The payload containing the trust data
     * @returns {FindRPCResponse} - The response from the API
     */
    addTrust: build.mutation<FindRPCResponse, TrustAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };

        const optionalKeys: Array<keyof Omit<TrustAddPayload, "domainName">> = [
          "bidirectional",
          "external",
          "realm_admin",
          "realm_passwd",
          "trust_secret",
          "range_type",
          "base_id",
          "range_size",
        ];

        optionalKeys.forEach((key) => {
          const value = payload[key];
          if (value !== undefined) {
            params[key] = value.toString();
          }
        });

        return getCommand({
          method: "trust_add",
          params: [[payload.domainName], params],
        });
      },
    }),
    /**
     * Delete a trust
     * @param {string[]} payload - The IDs of the trusts to delete
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    deleteTrusts: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = [];
        payload.forEach((trustId) => {
          commands.push({
            method: "trust_del",
            params: [[trustId], {}],
          });
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Get trust details
     * @param {string} trustId - The ID of the trust
     * @returns {FindRPCResponse} - Promise with the response data
     */
    trustShow: build.query<FindRPCResponse, string>({
      query: (trustId) => {
        return getCommand({
          method: "trust_show",
          params: [[trustId], { all: true, rights: true }],
        });
      },
    }),
    /**
     * Modify a trust
     * @param {TrustModPayload} payload - The payload containing the trust data
     * @returns {FindRPCResponse} - Promise with the response data
     */
    trustMod: build.mutation<FindRPCResponse, TrustModPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
        };

        const optionalKeys: Array<keyof Omit<TrustModPayload, "cn">> = [
          "ipantadditionalsuffixes",
          "ipantsidblacklistincoming",
          "ipantsidblacklistoutgoing",
        ];

        optionalKeys.forEach((key) => {
          const value = payload[key];
          if (value !== undefined) {
            params[key] = value.toString();
          }
        });

        return getCommand({
          method: "trust_mod",
          params: [[payload.cn], params],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTrustsFullDataQuery,
  useSearchTrustsEntriesMutation,
  useAddTrustMutation,
  useDeleteTrustsMutation,
  useTrustShowQuery,
  useTrustModMutation,
} = extendedApi;
