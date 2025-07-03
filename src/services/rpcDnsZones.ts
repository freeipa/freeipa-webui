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
                            useSearchDnsZonesEntriesMutation, useAddDnsZoneMutation,
                            useDnsZoneDeleteMutation
 *
 * API commands:
 * - dnszone_find: https://freeipa.readthedocs.io/en/latest/api/dnszone_find.html
 * - dnszone_show: https://freeipa.readthedocs.io/en/latest/api/dnszone_show.html
 * - dnszone_add: https://freeipa.readthedocs.io/en/latest/api/dnszone_add.html
 * - dnszone_del: https://freeipa.readthedocs.io/en/latest/api/dnszone_del.html
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

export interface AddDnsZonePayload {
  idnsname?: string;
  nameFromIp?: string;
  skipOverlapCheck?: boolean;
  version?: string;
}

export interface DnsZoneModPayload {
  idnsname: string;
  idnssoamname?: string;
  idnssoarname?: string;
  idnssoarefresh?: string;
  idnssoaretry?: string;
  idnssoaexpire?: string;
  idnssoaminimum?: string;
  dnsdefaultttl?: string;
  dnsttl?: string;
  idnsallowdynupdate?: boolean;
  idnsupdatepolicy?: string;
  idnsallowquery?: string[];
  idnsallowtransfer?: string[];
  idnsforwarders?: string[];
  idnsforwardpolicy?: string;
  idnsallowsyncptr?: boolean;
  idnssecinlinesigning?: boolean;
  nsec3paramrecord?: string;
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
    /**
     * Add DNS zone
     * @param {AddDnsZonePayload} payload - The payload containing new DNS zone data
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    addDnsZone: build.mutation<FindRPCResponse, AddDnsZonePayload>({
      query: (payload) => {
        const params = {
          version: payload.version || API_VERSION_BACKUP,
        };

        // Check which parameters are provided
        if (payload.nameFromIp !== undefined && payload.nameFromIp !== "") {
          params["name_from_ip"] = payload.nameFromIp;
        }

        if (
          payload.skipOverlapCheck !== undefined &&
          payload.skipOverlapCheck !== false
        ) {
          params["skip_overlap_check"] = payload.skipOverlapCheck;
        }

        const idnsname = payload.idnsname !== "" ? [payload.idnsname] : [];

        return getCommand({
          method: "dnszone_add",
          params: [idnsname, params],
        });
      },
    }),
    /**
     * Delete DNS zones
     * @param {string[]} dnsZoneIds - The IDs of the DNS zones to delete
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    dnsZoneDelete: build.mutation<BatchRPCResponse, string[]>({
      query: (dnsZoneIds) => {
        const commands: Command[] = [];
        dnsZoneIds.forEach((dnsZoneId) => {
          commands.push({
            method: "dnszone_del",
            params: [[dnsZoneId], {}],
          });
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Disable DNS zones
     * @param {string[]} dnsZoneIds - The IDs of the DNS zones to disable
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    dnsZoneDisable: build.mutation<BatchRPCResponse, string[]>({
      query: (dnsZoneIds) => {
        const commands: Command[] = [];
        dnsZoneIds.forEach((dnsZoneId) => {
          commands.push({
            method: "dnszone_disable",
            params: [[dnsZoneId], {}],
          });
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Enable DNS zones
     * @param {string[]} dnsZoneIds - The IDs of the DNS zones to enable
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    dnsZoneEnable: build.mutation<BatchRPCResponse, string[]>({
      query: (dnsZoneIds) => {
        const commands: Command[] = [];
        dnsZoneIds.forEach((dnsZoneId) => {
          commands.push({
            method: "dnszone_enable",
            params: [[dnsZoneId], {}],
          });
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Get DNS zone details
     * @param {string} dnsZoneId - DNS zone ID to fetch details for
     * @returns {Promise<BatchResponse>} - Promise with the response data
     */
    dnsZoneDetails: build.query<BatchRPCResponse, string>({
      query: (dnsZoneId) => {
        const commands: Command[] = [];

        commands.push({
          method: "dnszone_show",
          params: [[dnsZoneId], { all: true, rights: true }],
        });

        commands.push({
          method: "permission_show",
          params: [["Manage DNS zone " + dnsZoneId], {}],
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Update existing DNS zone
     * @param {DnsZoneModPayload} payload - The payload containing DNS zone data to update
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    dnsZoneMod: build.mutation<FindRPCResponse, DnsZoneModPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
        };

        const optionalKeys: Array<keyof Omit<DnsZoneModPayload, "idnsname">> = [
          "idnssoamname",
          "idnssoarname",
          "idnssoarefresh",
          "idnssoaretry",
          "idnssoaexpire",
          "idnssoaminimum",
          "dnsdefaultttl",
          "dnsttl",
          "idnsallowdynupdate",
          "idnsupdatepolicy",
          "idnsallowquery",
          "idnsallowtransfer",
          "idnsforwarders",
          "idnsforwardpolicy",
          "idnsallowsyncptr",
          "idnssecinlinesigning",
          "nsec3paramrecord",
        ];

        optionalKeys.forEach((key) => {
          const value = payload[key];
          if (value !== undefined) {
            params[key] = value.toString();
          }
        });

        return getCommand({
          method: "dnszone_mod",
          params: [[payload.idnsname], params],
        });
      },
    }),
    /**
     * Add permission to DNS zone
     * @param {string} dnsZoneId - The ID of the DNS zone to add
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    addDnsZonePermission: build.mutation<FindRPCResponse, string>({
      query: (dnsZoneId) => {
        return getCommand({
          method: "dnszone_add_permission",
          params: [
            [dnsZoneId],
            {
              version: API_VERSION_BACKUP,
            },
          ],
        });
      },
    }),
    /**
     * Remove permission from DNS zone
     * @param {string} dnsZoneId - The ID of the DNS zone to remove
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    removeDnsZonePermission: build.mutation<FindRPCResponse, string>({
      query: (dnsZoneId) => {
        return getCommand({
          method: "dnszone_remove_permission",
          params: [
            [dnsZoneId],
            {
              version: API_VERSION_BACKUP,
            },
          ],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useDnsZonesFindQuery,
  useGetDnsZonesFullDataQuery,
  useSearchDnsZonesEntriesMutation,
  useAddDnsZoneMutation,
  useDnsZoneDeleteMutation,
  useDnsZoneDisableMutation,
  useDnsZoneEnableMutation,
  useDnsZoneDetailsQuery,
  useDnsZoneModMutation,
  useAddDnsZonePermissionMutation,
  useRemoveDnsZonePermissionMutation,
} = extendedApi;
