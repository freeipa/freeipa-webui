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
import { DNSZone, dnsZoneType } from "src/utils/datatypes/globalDataTypes";
import { apiToDnsZone } from "src/utils/dnsZonesUtils";

/**
 * DNS zones-related endpoints: useDnsZonesFindQuery, useGetDnsZonesFullDataQuery,
                            useSearchDnsZonesEntriesMutation,
 *
 * API commands:
 * - dnszone_find: https://freeipa.readthedocs.io/en/latest/api/dnszone_find.html
 * - dnszone_show: https://freeipa.readthedocs.io/en/latest/api/dnszone_show.html
 */

export interface DnsZonesFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

export interface DnsZonesFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

export interface DnsZoneBatchResponse {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: DNSZone[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get DNS zones IDs
     * @param {DnsZonesFindPayload} payload - The payload containing search parameters
     * @returns {Command<FindRPCResponse<DNSZone>>} - Promise with the response data
     *
     */
    dnsZonesFind: build.query<FindRPCResponse, DnsZonesFindPayload>({
      query: (payload) => {
        const dnsZonesParams = {
          pkey_only: payload.pkeyOnly,
          sizelimit: payload.sizeLimit,
          version: payload.version || API_VERSION_BACKUP,
        };

        return getCommand({
          method: "dnszone_find",
          params: [[payload.searchValue], dnsZonesParams],
        });
      },
    }),
    /**
     * Find DNS zones full data
     * @param {DnsZonesFullDataPayload} payload - The payload containing search parameters
     * @returns {BatchRPCResponse} - List of DNS zones full data
     *
     */
    getDnsZonesFullData: build.query<BatchRPCResponse, DnsZonesFullDataPayload>(
      {
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

          // FETCH DNS ZONES DATA VIA "dnszone_find" COMMAND
          // Prepare search parameters
          const dnsZonesIdsParams = {
            pkey_only: true,
            sizelimit: sizelimit,
            version: apiVersion,
          };

          // Prepare payload
          const payloadDataDnsZones: Command = {
            method: "dnszone_find",
            params: [[searchValue], dnsZonesIdsParams],
          };

          // Make call using 'fetchWithBQ'
          const getResultDnsZones = await fetchWithBQ(
            getCommand(payloadDataDnsZones)
          );
          // Return possible errors
          if (getResultDnsZones.error) {
            return { error: getResultDnsZones.error };
          }
          // If no error: cast and assign 'ids'
          const responseDataDnsZones =
            getResultDnsZones.data as FindRPCResponse;

          const dnsZonesIds: string[] = [];
          const dnsZonesItemsCount = responseDataDnsZones.result.result
            .length as number;

          for (let i = startIdx; i < dnsZonesItemsCount && i < stopIdx; i++) {
            const dnsZoneId = responseDataDnsZones.result.result[
              i
            ] as dnsZoneType;
            const dnsName = dnsZoneId.idnsname[0]["__dns_name__"];
            if (dnsName) {
              dnsZonesIds.push(dnsName as string);
            }
          }

          // FETCH DNS ZONE DATA VIA "dnszone_show" COMMAND
          const commands: Command[] = [];
          dnsZonesIds.forEach((dnsZoneId) => {
            commands.push({
              method: "dnszone_show",
              params: [[dnsZoneId], {}],
            });
          });

          const dnsZonesShowResult = await fetchWithBQ(
            getBatchCommand(commands, apiVersion)
          );

          const response = dnsZonesShowResult.data as BatchRPCResponse;
          if (response) {
            response.result.totalCount = dnsZonesItemsCount;
          }

          // Return results
          return { data: response };
        },
      }
    ),
    /**
     * Search for a specific DNS zone
     * @param {DnsZonesFullDataPayload} payload - The payload containing search parameters
     * @returns {DnsZoneBatchResponse} - List of DNS zones full data
     */
    searchDnsZonesEntries: build.mutation<
      DnsZoneBatchResponse,
      DnsZonesFullDataPayload
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

        // FETCH DNS ZONES DATA VIA "dnszone_find" COMMAND
        // Prepare search parameters
        const dnsZonesIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataDnsZones: Command = {
          method: "dnszone_find",
          params: [[searchValue], dnsZonesIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultDnsZones = await fetchWithBQ(
          getCommand(payloadDataDnsZones)
        );
        // Return possible errors
        if (getResultDnsZones.error) {
          return { error: getResultDnsZones.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataDnsZones = getResultDnsZones.data as FindRPCResponse;

        const dnsZonesIds: string[] = [];
        const dnsZonesItemsCount = responseDataDnsZones.result.result
          .length as number;

        for (let i = startIdx; i < dnsZonesItemsCount && i < stopIdx; i++) {
          const dnsZoneId = responseDataDnsZones.result.result[
            i
          ] as dnsZoneType;
          const dnsName = dnsZoneId.idnsname[0]["__dns_name__"];
          if (dnsName) {
            dnsZonesIds.push(dnsName as string);
          }
        }

        // FETCH DNS ZONE DATA VIA "dnszone_show" COMMAND
        const commands: Command[] = [];
        dnsZonesIds.forEach((dnsZoneId) => {
          commands.push({
            method: "dnszone_show",
            params: [[dnsZoneId], {}],
          });
        });

        const dnsZonesShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = dnsZonesShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = dnsZonesItemsCount;
        }

        // Handle the '__dns_name__' fields
        const dnsZones: DNSZone[] = [];
        const count = response.result.totalCount;
        for (let i = 0; i < count; i++) {
          const dnsZone = response.result.results[i].result as Record<
            string,
            unknown
          >;
          // Convert API object to DNSZone type
          const convertedDnsZone: DNSZone = apiToDnsZone(dnsZone);
          dnsZones.push(convertedDnsZone);
        }

        // Return results
        return {
          data: {
            ...response,
            result: dnsZones,
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useDnsZonesFindQuery,
  useGetDnsZonesFullDataQuery,
  useSearchDnsZonesEntriesMutation,
} = extendedApi;
