import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  getCommand,
  BatchResult,
} from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
import { apiToDnsZone } from "src/utils/dnsZonesUtils";
import { apiToDnsRecord } from "src/utils/dnsRecordUtils";
// Data types
import {
  DNSRecord,
  DnsRecordType,
  DNSZone,
  dnsZoneType,
  RecordType,
} from "src/utils/datatypes/globalDataTypes";

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

export interface FindDnsRecordPayload {
  dnsZoneId: string;
  recordName: string;
  sizeLimit?: number;
  version?: string;
}

export interface DnsRecordBatchResponse {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: DNSRecord[];
}

// Base interface with required fields
export interface AddDnsRecordPayload {
  dnsZoneId: string;
  recordName: string;
  recordType: DnsRecordType;
  version?: string;
}

// Extended interface with dynamic field support and all DNS record fields
export interface DynamicAddDnsRecordPayload extends AddDnsRecordPayload {
  // Dynamic fields - allows any additional DNS record field
  [key: string]: string | number | boolean | undefined;
}

export interface DeleteDnsRecordPayload {
  dnsZoneId: string;
  recordNames: string[];
  version?: string;
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
    /**
     * Find DNS record
     * @param {FindDnsRecordPayload} payload - The payload containing DNS zone ID and record name
     * @returns {DnsRecordBatchResponse} - Promise with the response data
     */
    dnsRecordFind: build.query<DnsRecordBatchResponse, FindDnsRecordPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { dnsZoneId, recordName, sizeLimit, version } = payloadData;

        const apiVersion = version || API_VERSION_BACKUP;
        const limit = sizeLimit || 100; // Default size limit if not provided

        // FETCH DNS RECORDS DATA VIA "dnsrecord_find" COMMAND
        // Prepare search parameters
        const dnsRecordParams = {
          pkey_only: true,
          sizelimit: limit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataDnsRecords: Command = {
          method: "dnsrecord_find",
          params: [[dnsZoneId, recordName], dnsRecordParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultDnsRecords = await fetchWithBQ(
          getCommand(payloadDataDnsRecords)
        );
        // Return possible errors
        if (getResultDnsRecords.error) {
          return { error: getResultDnsRecords.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataDnsRecords =
          getResultDnsRecords.data as FindRPCResponse;

        const dnsRecordsIds: string[] = [];
        const dnsRecordsItemsCount = responseDataDnsRecords.result.result
          .length as number;

        for (let i = 0; i < dnsRecordsItemsCount; i++) {
          const dnsRecordId = responseDataDnsRecords.result.result[
            i
          ] as dnsZoneType;
          const dnsRecordType = dnsRecordId.idnsname[0]["__dns_name__"];
          if (dnsRecordType) {
            dnsRecordsIds.push(dnsRecordType);
          }
        }

        // FETCH DNS RECORDS DATA VIA "dnsrecord_show" COMMAND
        const commands: Command[] = [];
        dnsRecordsIds.forEach((recordType) => {
          commands.push({
            method: "dnsrecord_show",
            params: [
              [dnsZoneId, recordType],
              { all: true, rights: true, structured: true },
            ],
          });
        });

        const dnsZonesShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = dnsZonesShowResult.data as BatchRPCResponse;

        // Handle the '__dns_name__' fields
        const dnsRecords: DNSRecord[] = [];
        const records = response.result.results as unknown as BatchResult[];

        records.forEach((dnsRec) => {
          // Convert API object to 'DNSRecord' type
          const convertedDnsRecord: DNSRecord = apiToDnsRecord(dnsRec.result);
          const nsrecordsTypesList = dnsRec.result.dnsrecords as RecordType[];

          // Extract the types into a string format (e.g. "A, NS, ...")
          const types: string[] = [];
          convertedDnsRecord.dnsrecords.map((dnsRecord) => {
            types.push(dnsRecord.dnstype);
          });
          const typesString = types.join(", ");

          // Extract the data into a string format (e.g. "dns1.example.com, dns2.example.com, ...")
          const data: string[] = [];
          convertedDnsRecord.dnsrecords.map((dnsRecord) => {
            data.push(dnsRecord.dnsdata);
          });
          const dataString = data.join(", ");

          convertedDnsRecord.dnsrecords = nsrecordsTypesList.map(() => ({
            dnstype: typesString,
            dnsdata: dataString,
          }));
          dnsRecords.push(convertedDnsRecord);

          // Add 'dnsrecord_type' and 'dnsrecord_data' to the 'convertedDnsRecord'
          convertedDnsRecord.dnsrecord_types = typesString;
          convertedDnsRecord.dnsrecord_data = dataString;
        });

        // Return results
        return {
          data: {
            ...response,
            result: dnsRecords,
          },
        };
      },
    }),
    /**
     * Find DNS records
     * @param {FindDnsRecordPayload} payload - The payload containing DNS zone ID and record name
     * @returns {DnsRecordBatchResponse} - Promise with the response data
     */
    searchDnsRecordsEntries: build.mutation<
      DnsRecordBatchResponse,
      FindDnsRecordPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { dnsZoneId, recordName, sizeLimit, version } = payloadData;

        const apiVersion = version || API_VERSION_BACKUP;
        const limit = sizeLimit || 100; // Default size limit if not provided

        // FETCH DNS RECORDS DATA VIA "dnsrecord_find" COMMAND
        // Prepare search parameters
        const dnsRecordParams = {
          pkey_only: true,
          sizelimit: limit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataDnsRecords: Command = {
          method: "dnsrecord_find",
          params: [[dnsZoneId, recordName], dnsRecordParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultDnsRecords = await fetchWithBQ(
          getCommand(payloadDataDnsRecords)
        );
        // Return possible errors
        if (getResultDnsRecords.error) {
          return { error: getResultDnsRecords.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataDnsRecords =
          getResultDnsRecords.data as FindRPCResponse;

        const dnsRecordsIds: Map<string, string> = new Map();
        const dnsRecordsItemsCount = responseDataDnsRecords.result.result
          .length as number;

        for (let i = 0; i < dnsRecordsItemsCount; i++) {
          const dnsRecordId = responseDataDnsRecords.result.result[
            i
          ] as dnsZoneType;
          const dnsRecordType = dnsRecordId.idnsname[0]["__dns_name__"];
          if (dnsRecordType) {
            dnsRecordsIds.set(dnsZoneId[i], dnsRecordType);
          }
        }

        // FETCH DNS RECORDS DATA VIA "dnsrecord_show" COMMAND
        const commands: Command[] = [];
        dnsRecordsIds.forEach((dnsName, recordType) => {
          commands.push({
            method: "dnsrecord_show",
            params: [[dnsName, recordType], { all: true }],
          });
        });

        const dnsZonesShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = dnsZonesShowResult.data as BatchRPCResponse;

        // Handle the '__dns_name__' fields
        const dnsRecords: DNSRecord[] = [];
        const count = response.result.totalCount;
        for (let i = 0; i < count; i++) {
          const dnsRecord = response.result.results[i].result as Record<
            string,
            unknown
          >;
          // Convert API object to DNSRecord type
          const convertedDnsRecord: DNSRecord = apiToDnsRecord(dnsRecord);
          dnsRecords.push(convertedDnsRecord);
        }

        // Return results
        return {
          data: {
            ...response,
            result: dnsRecords,
          },
        };
      },
    }),
    /**
     * Add DNS record
     * @param {AddDnsRecordPayload} payload - The payload containing DNS zone ID and record data
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    addDnsRecord: build.mutation<FindRPCResponse, DynamicAddDnsRecordPayload>({
      query: (payload) => {
        const apiVersion = payload.version || API_VERSION_BACKUP;

        const params: Record<string, unknown> = {
          version: apiVersion,
        };

        // Dynamically add all fields from payload except core ones
        const coreFields = new Set([
          "dnsZoneId",
          "recordName",
          "recordType",
          "version",
        ]);

        Object.entries(payload).forEach(([key, value]) => {
          if (!coreFields.has(key) && value !== undefined && value !== null) {
            params[key] = value;
          }
        });

        return getCommand({
          method: "dnsrecord_add",
          params: [[payload.dnsZoneId, payload.recordName], params],
        });
      },
    }),
    /**
     * Delete DNS records
     * @param {DeleteDnsRecordPayload} payload - The payload containing DNS zone ID and record data
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    dnsRecordDelete: build.mutation<BatchRPCResponse, DeleteDnsRecordPayload>({
      query: (payload) => {
        const commands: Command[] = [];
        payload.recordNames.forEach((recordName) => {
          commands.push({
            method: "dnsrecord_del",
            params: [[payload.dnsZoneId, recordName], { del_all: true }],
          });
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
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
  useDnsRecordFindQuery,
  useSearchDnsRecordsEntriesMutation,
  useAddDnsRecordMutation,
  useDnsRecordDeleteMutation,
} = extendedApi;
