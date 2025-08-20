import { api, FindRPCResponse, getCommand } from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";

/**
 * DNS servers-related endpoints: useDnsServersFindQuery, useSearchDnsServersEntriesMutation
 *
 * API commands: dnsserver_find
 */

export interface DnsServersFindPayload {
  searchValue: string;
  sizeLimit: number;
  pkeyOnly?: boolean;
  version?: string;
}

export interface DnsServersFindResult {
  dn: string;
  idnsserverid: string;
}

export interface DnsServersFindResponse {
  data: string[];
  error: string | null;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get DNS servers IDs
     * @param {DnsServersFindPayload} payload - The payload containing search parameters
     * @returns {DnsServersFindResponse} - Response data or error
     *
     */
    dnsServersFind: build.query<DnsServersFindResponse, DnsServersFindPayload>({
      query: (payload) => {
        const dnsServersParams = {
          pkey_only: payload.pkeyOnly || true,
          sizelimit: payload.sizeLimit,
          version: payload.version || API_VERSION_BACKUP,
        };

        return getCommand({
          method: "dnsserver_find",
          params: [[payload.searchValue], dnsServersParams],
        });
      },
      transformResponse: (response: FindRPCResponse) => {
        const listResult = response.result.result;
        const listSize = response.result.count;
        const error = response.error;
        const dnsServerIdList: string[] = [];

        if (error && typeof error === "object") {
          return { data: [], error: error.message };
        } else if (error && typeof error === "string") {
          return { data: [], error: error };
        }

        for (let i = 0; i < listSize; i++) {
          const item = listResult[i] as DnsServersFindResult;
          dnsServerIdList.push(item.idnsserverid);
        }

        return { data: dnsServerIdList, error: null };
      },
    }),
    /**
     * Search for a specific DNS server (Mutation)
     * @param {DnsServersFindPayload} payload - The payload containing search parameters
     * @returns {DnsServersFindResponse} - Response data or error
     *
     */
    searchDnsServersEntries: build.mutation<
      DnsServersFindResponse,
      DnsServersFindPayload
    >({
      query: (payload) => {
        const dnsServersParams = {
          pkey_only: payload.pkeyOnly !== undefined ? payload.pkeyOnly : true,
          sizelimit: payload.sizeLimit,
          version: payload.version || API_VERSION_BACKUP,
        };

        return getCommand({
          method: "dnsserver_find",
          params: [[payload.searchValue], dnsServersParams],
        });
      },
      transformResponse: (response: FindRPCResponse) => {
        const listResult = response.result.result;
        const listSize = response.result.count;
        const error = response.error;
        const dnsServerIdList: string[] = [];

        if (error && typeof error === "object") {
          return { data: [], error: error.message };
        } else if (error && typeof error === "string") {
          return { data: [], error: error };
        }

        for (let i = 0; i < listSize; i++) {
          const item = listResult[i] as DnsServersFindResult;
          dnsServerIdList.push(item.idnsserverid);
        }

        return { data: dnsServerIdList, error: null };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useDnsServersFindQuery, useSearchDnsServersEntriesMutation } =
  extendedApi;
