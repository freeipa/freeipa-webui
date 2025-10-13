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
} from "src/utils/datatypes/globalDataTypes";
import { apiToDnsForwardZone } from "src/utils/dnsForwardZonesUtils";

/**
 * Forward DNS zones-related endpoint: useDnsForwardZonesFindQuery, useGetDnsForwardZonesFullDataQuery,
                            useSearchDnsForwardZonesEntriesMutation,
 *
 * API commands:
 * - dnsforwardzone_find: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_find.html
 * - dnsforwardzone_show: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_show.html
 */

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
     * Find DNS zones full data
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
  useGetDnsForwardZonesFullDataQuery,
  useSearchDnsForwardZonesEntriesMutation,
} = extendedApi;
