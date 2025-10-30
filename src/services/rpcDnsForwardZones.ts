import {
  api,
  BatchRPCResponse,
  Command,
  FindRPCResponse,
  getBatchCommand,
  getCommand,
} from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
// Data types
import {
  DNSForwardZone,
  dnsZoneType,
  IDNSForwardPolicy,
} from "src/utils/datatypes/globalDataTypes";
import { apiToDnsForwardZone } from "src/utils/dnsForwardZonesUtils";

/**
 * Forward DNS zones-related endpoints: useAddDnsForwardZoneMutation, useDnsForwardZoneDeleteMutation,
 *        useDnsForwardZoneDisableMutation, useDnsForwardZoneEnableMutation, useGetDnsForwardZonesFullDataQuery,
 *        useSearchDnsForwardZonesEntriesMutation
 *
 * API commands:
 * - dnsforwardzone_add: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_add.html
 * - dnsforwardzone_mod: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_mod.html
 * - dnsforwardzone_find: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_find.html
 * - dnsforwardzone_show: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_show.html
 * - dnsforwardzone_del: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_del.html
 * - dnsforwardzone_disable: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_disable.html
 * - dnsforwardzone_enable: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_enable.html
 */

export interface IPAddressWithPort {
  ipAddress: string;
  port: number | null;
}

const asIpa = (value: IPAddressWithPort): string => {
  if (value.port === null) {
    return value.ipAddress;
  }

  return `${value.ipAddress} port ${value.port}`;
};

interface ShowDnsForwardZonePayload {
  idnsname: string;
}

interface BaseDnsForwardZonePayload {
  idnsforwarders: IPAddressWithPort[];
  idnsforwardpolicy: IDNSForwardPolicy;
  version?: string;
}
export interface BaseDnsForwardZoneAddPayload
  extends BaseDnsForwardZonePayload {
  skipOverlapCheck: boolean;
}

export interface DnsForwardZoneModPayload
  extends Partial<BaseDnsForwardZonePayload>,
    ShowDnsForwardZonePayload {}

interface NameDnsForwardZoneAddPayload
  extends BaseDnsForwardZoneAddPayload,
    ShowDnsForwardZonePayload {}

interface FromIpDnsForwardZoneAddPayload extends BaseDnsForwardZoneAddPayload {
  nameFromIp: string;
}

export type DnsForwardZoneAddPayload =
  | NameDnsForwardZoneAddPayload
  | FromIpDnsForwardZoneAddPayload;

interface DnsForwardZonesFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  version?: string;
}

interface DnsForwardZonesFullDataPayload {
  searchValue: string;
  apiVersion: string;
  startIdx: number;
  stopIdx: number;
}

interface DnsForwardZoneBatchResponse {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: DNSForwardZone[];
}

/**
 * Get DNS forward zones IDs
 * @param {DnsForwardZonesFindPayload} payload - The payload containing search parameters
 * @returns {Command<FindRPCResponse<DNSForwardZone>>} - Promise with the response data
 *
 */
const dnsForwardZonesFind = (
  payload: DnsForwardZonesFindPayload,
  method_name: string
) => {
  const dnsForwardZonesParams = {
    pkey_only: payload.pkeyOnly,
    version: payload.version || API_VERSION_BACKUP,
  };

  return getCommand({
    method: method_name,
    params: [[payload.searchValue], dnsForwardZonesParams],
  });
};

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Add DNS forward zone
     * @param {DnsForwardZoneAddPayload} payload - The payload containing new DNS forward zone data
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    addDnsForwardZone: build.mutation<
      FindRPCResponse,
      DnsForwardZoneAddPayload
    >({
      query: (payload) => {
        const params: Record<string, unknown> = {
          idnsforwarders: payload.idnsforwarders.map(asIpa),
          idnsforwardpolicy: payload.idnsforwardpolicy,
          skip_overlap_check: payload.skipOverlapCheck,
          version: payload.version || API_VERSION_BACKUP,
        };

        // Check which parameters are provided
        if ("idnsname" in payload) {
          return getCommand({
            method: "dnsforwardzone_add",
            params: [[payload.idnsname], params],
          });
        }

        params["name_from_ip"] = payload.nameFromIp;
        return getCommand({
          method: "dnsforwardzone_add",
          params: [[], params],
        });
      },
    }),
    /**
     * Modify DNS forward zone
     * @param {DnsForwardZoneModPayload} payload - The payload containing the DNS forward zone data to update
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    saveDnsForwardZone: build.mutation<
      FindRPCResponse,
      DnsForwardZoneModPayload
    >({
      query: (payload) => {
        const params: Record<string, unknown> = {
          ...(payload.idnsforwarders !== undefined && {
            idnsforwarders: payload.idnsforwarders.map(asIpa),
          }),
          ...(payload.idnsforwardpolicy !== undefined && {
            idnsforwardpolicy: payload.idnsforwardpolicy,
          }),
          version: payload.version || API_VERSION_BACKUP,
        };

        return getCommand({
          method: "dnsforwardzone_mod",
          params: [[payload.idnsname], params],
        });
      },
    }),
    /**
     * Delete DNS forward zones
     * @param {string[]} dnsForwardZoneIds - The IDs of the DNS forward zones to delete
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    dnsForwardZoneDelete: build.mutation<BatchRPCResponse, string[]>({
      query: (dnsForwardZoneIds) => {
        const commands: Command[] = dnsForwardZoneIds.map(
          (dnsForwardZoneId) => {
            return {
              method: "dnsforwardzone_del",
              params: [[dnsForwardZoneId], {}],
            };
          }
        );

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Disable DNS forward zones
     * @param {string[]} dnsForwardZoneIds - The IDs of the DNS forward zones to disable
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    dnsForwardZoneDisable: build.mutation<BatchRPCResponse, string[]>({
      query: (dnsZoneIds) => {
        const commands: Command[] = dnsZoneIds.map((dnsZoneId) => {
          return {
            method: "dnsforwardzone_disable",
            params: [[dnsZoneId], {}],
          };
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Enable DNS forward zones
     * @param {string[]} dnsForwardZoneIds - The IDs of the DNS forward zones to enable
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    dnsForwardZoneEnable: build.mutation<BatchRPCResponse, string[]>({
      query: (dnsZoneIds) => {
        const commands: Command[] = dnsZoneIds.map((dnsZoneId) => {
          return {
            method: "dnsforwardzone_enable",
            params: [[dnsZoneId], {}],
          };
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Find DNS forward zones full data
     * @param {DnsForwardZonesFullDataPayload} payload - The payload containing search parameters
     * @returns {BatchRPCResponse} - List of DNS zones full data
     *
     */
    getDnsForwardZonesFullData: build.query<
      BatchRPCResponse,
      DnsForwardZonesFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, startIdx, stopIdx } = payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            },
          };
        }

        // FETCH DNS FORWARD ZONES DATA VIA "dnsforwardzone_find" COMMAND
        // Prepare search parameters
        const dnsForwardZonesIdsParams: DnsForwardZonesFindPayload = {
          pkeyOnly: true,
          version: apiVersion,
          searchValue,
        };

        // Make call using 'fetchWithBQ'
        const getResultDnsForwardZones = await fetchWithBQ(
          dnsForwardZonesFind(dnsForwardZonesIdsParams, "dnsforwardzone_find")
        );
        // Return possible errors
        if (getResultDnsForwardZones.error) {
          return { error: getResultDnsForwardZones.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataDnsForwardZones =
          getResultDnsForwardZones.data as FindRPCResponse;

        const dnsZonesIds: string[] = [];
        const dnsZonesItemsCount = responseDataDnsForwardZones.result.result
          .length as number;

        for (let i = startIdx; i < dnsZonesItemsCount && i < stopIdx; i++) {
          const dnsZoneId = responseDataDnsForwardZones.result.result[
            i
          ] as dnsZoneType;
          const dnsName = dnsZoneId.idnsname[0]["__dns_name__"];
          if (dnsName) {
            dnsZonesIds.push(dnsName as string);
          }
        }

        // FETCH DNS FORWARD ZONE DATA VIA "dnsforwardzone_show" COMMAND
        const commands: Command[] = [];
        dnsZonesIds.forEach((dnsZoneId) => {
          commands.push({
            method: "dnsforwardzone_show",
            params: [[dnsZoneId], {}],
          });
        });

        const dnsForwardZonesShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = dnsForwardZonesShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = dnsZonesItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    getDnsForwardZoneDetails: build.query<
      FindRPCResponse,
      ShowDnsForwardZonePayload
    >({
      query: (payload) => {
        return getCommand({
          method: "dnsforwardzone_show",
          params: [[payload.idnsname], {}],
        });
      },
    }),
    /**
     * Search for a specific DNS zone
     * @param {DnsForwardZonesFullDataPayload} payload - The payload containing search parameters
     * @returns {DnsForwardZoneBatchResponse} - List of DNS zones full data
     */
    searchDnsForwardZonesEntries: build.mutation<
      DnsForwardZoneBatchResponse,
      DnsForwardZonesFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, startIdx, stopIdx } = payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            },
          };
        }

        // FETCH DNS ZONES DATA VIA "dnszone_find" COMMAND
        // Prepare search parameters
        const dnsForwardZonesIdsParams: DnsForwardZonesFindPayload = {
          pkeyOnly: true,
          version: apiVersion,
          searchValue,
        };

        // Make call using 'fetchWithBQ'
        const getResultDnsForwardZones = await fetchWithBQ(
          dnsForwardZonesFind(dnsForwardZonesIdsParams, "dnsforwardzone_find")
        );
        // Return possible errors
        if (getResultDnsForwardZones.error) {
          return { error: getResultDnsForwardZones.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataDnsForwardZones =
          getResultDnsForwardZones.data as FindRPCResponse;

        const dnsZonesIds: string[] = [];
        const dnsZonesItemsCount = responseDataDnsForwardZones.result.result
          .length as number;

        for (let i = startIdx; i < dnsZonesItemsCount && i < stopIdx; i++) {
          const dnsZoneId = responseDataDnsForwardZones.result.result[
            i
          ] as dnsZoneType;
          const dnsName = dnsZoneId.idnsname[0]["__dns_name__"];
          if (dnsName) {
            dnsZonesIds.push(dnsName as string);
          }
        }

        // FETCH DNS ZONE DATA VIA "dnsforwardzone_show" COMMAND
        const commands: Command[] = [];
        dnsZonesIds.forEach((dnsZoneId) => {
          commands.push({
            method: "dnsforwardzone_show",
            params: [[dnsZoneId], {}],
          });
        });

        const dnsForwardZonesShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = dnsForwardZonesShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = dnsZonesItemsCount;
        }

        // Handle the '__dns_name__' fields
        const dnsForwardZones: DNSForwardZone[] = [];
        const count = response.result.totalCount;
        for (let i = 0; i < count; i++) {
          const dnsZone = response.result.results[i].result as Record<
            string,
            unknown
          >;
          // Convert API object to DNSForwardZone type
          const convertedDnsForwardZone: DNSForwardZone =
            apiToDnsForwardZone(dnsZone);
          dnsForwardZones.push(convertedDnsForwardZone);
        }

        // Return results
        return {
          data: {
            ...response,
            result: dnsForwardZones,
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddDnsForwardZoneMutation,
  useSaveDnsForwardZoneMutation,
  useDnsForwardZoneDeleteMutation,
  useDnsForwardZoneDisableMutation,
  useDnsForwardZoneEnableMutation,
  useGetDnsForwardZoneDetailsQuery,
  useGetDnsForwardZonesFullDataQuery,
  useSearchDnsForwardZonesEntriesMutation,
} = extendedApi;
