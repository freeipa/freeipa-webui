import { api, FindRPCResponse, getCommand } from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
import { IDNSForwardPolicy } from "src/utils/datatypes/globalDataTypes";

/**
 * DNS global config-related endpoints: useDnsGlobalConfigFindQuery, useDnsGlobalConfigModMutation
 *                                      useDnsGlobalConfigUpdateSystemDnsRecordsMutation
 *
 * API commands: dnsconfig_show, dnsconfig_mod, dns_update_system_records
 */

export interface DnsGlobalConfigPayload {
  idnsforwarders?: string[];
  idnsforwardpolicy?: IDNSForwardPolicy;
  idnsallowsyncptr?: boolean;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get DNS global config
     * @returns {FindRPCResponse} - Response data or error
     *
     */
    dnsGlobalConfigFind: build.query<FindRPCResponse, void>({
      query: () => {
        return getCommand({
          method: "dnsconfig_show",
          params: [
            [],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Modify DNS global config
     * @param {DnsGlobalConfigPayload} payload - The payload containing the DNS global config
     * @returns {FindRPCResponse} - Response data or error
     *
     */
    dnsGlobalConfigMod: build.mutation<FindRPCResponse, DnsGlobalConfigPayload>(
      {
        query: (payload) => {
          const params = {
            all: true,
            rights: true,
            version: API_VERSION_BACKUP,
          };

          if ("idnsforwarders" in payload) {
            params["idnsforwarders"] = payload.idnsforwarders;
          }
          if ("idnsforwardpolicy" in payload) {
            params["idnsforwardpolicy"] = payload.idnsforwardpolicy;
          }
          if ("idnsallowsyncptr" in payload) {
            params["idnsallowsyncptr"] = payload.idnsallowsyncptr;
          }

          return getCommand({
            method: "dnsconfig_mod",
            params: [[], params],
          });
        },
      }
    ),
    /**
     * Update system DNS records
     * @returns {FindRPCResponse} - Response data or error
     *
     */
    dnsGlobalConfigUpdateSystemDnsRecords: build.mutation<
      FindRPCResponse,
      void
    >({
      query: () => {
        return getCommand({
          method: "dns_update_system_records",
          params: [[], { version: API_VERSION_BACKUP }],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useDnsGlobalConfigFindQuery,
  useDnsGlobalConfigModMutation,
  useDnsGlobalConfigUpdateSystemDnsRecordsMutation,
} = extendedApi;
