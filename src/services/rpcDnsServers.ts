import { api, FindRPCResponse, getCommand } from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";

/**
 * DNS servers-related endpoints: useDnsServersFindQuery, useSearchDnsServersEntriesMutation
 *                                useDnsServersShowQuery
 *
 * API commands: dnsserver_find, dnsserver_show
 */

interface DnsServersFindPayload {
  searchValue: string;
  sizeLimit: number;
  pkeyOnly?: boolean;
  version?: string;
}

interface DnsServersFindResult {
  dn: string;
  idnsserverid: string;
}

interface DnsServersFindResponse {
  data: string[];
  error: string | null;
}

export interface DnsServerModPayload {
  idnsserverid: string;
  idnssoamname?: string[];
  idnsforwarders?: string[];
  idnsforwardpolicy?: string[];
  version?: string;
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
    /**
     * Get DNS servers details
     * @param {string} dnsServerId - The ID of the DNS server
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    dnsServersShow: build.query<FindRPCResponse, string>({
      query: (dnsServerId) => {
        const dnsServersParams = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
        };
        return getCommand({
          method: "dnsserver_show",
          params: [[dnsServerId], dnsServersParams],
        });
      },
    }),
    /**
     * Update DNS server
     * @param {DnsServerModPayload} payload - The payload containing the DNS server data
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    dnsServersMod: build.mutation<FindRPCResponse, DnsServerModPayload>({
      query: (payload) => {
        const params = {
          all: true,
          rights: true,
          version: payload.version || API_VERSION_BACKUP,
        };

        const optionalKeys: Array<
          keyof Omit<DnsServerModPayload, "idnsserverid">
        > = ["idnssoamname", "idnsforwarders", "idnsforwardpolicy"];

        optionalKeys.forEach((key) => {
          const value = payload[key];
          if (value !== undefined) {
            params[key] = value;
          }
        });

        return getCommand({
          method: "dnsserver_mod",
          params: [[payload.idnsserverid], params],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useDnsServersFindQuery,
  useSearchDnsServersEntriesMutation,
  useDnsServersShowQuery,
  useDnsServersModMutation,
} = extendedApi;
