import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  TFindRPCResponse,
  TBatchRPCResponse,
  ValidBatchRPCResponse,
  MaybePromise,
} from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
// Data types
import {
  DNSForwardZone,
  dnsZoneType,
} from "src/utils/datatypes/globalDataTypes";
import { apiToDnsForwardZone } from "src/utils/dnsForwardZonesUtils";
import {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";

/**
 * Forward DNS zones-related endpoint: useDnsForwardZonesFindQuery, useGetDnsForwardZonesFullDataQuery,
                            useSearchDnsForwardZonesEntriesMutation,
 *
 * API commands:
 * - dnsforwardzone_find: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_find.html
 * - dnsforwardzone_show: https://freeipa.readthedocs.io/en/latest/api/dnsforwardzone_show.html
 */

export interface DnsForwardZonesFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

export interface DnsForwardZonesFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizeLimit: number;
  startIdx: number;
  stopIdx: number;
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
  const dnsZonesParams = {
    pkey_only: payload.pkeyOnly,
    sizelimit: payload.sizeLimit,
    version: payload.version || API_VERSION_BACKUP,
  };

  return getCommand({
    method: method_name,
    params: [[payload.searchValue], dnsZonesParams],
  });
};

const find = async (
  payloadData: DnsForwardZonesFullDataPayload,
  fetchWithBQ: (
    arg: string | FetchArgs
  ) => MaybePromise<
    QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
  >
) => {
  try {
    const { searchValue, apiVersion, sizeLimit, startIdx, stopIdx } =
      payloadData;

    if (apiVersion === undefined) {
      return {
        error: {
          status: <const>"CUSTOM_ERROR",
          data: "",
          error: "API version not available",
        },
      };
    }

    // Make call using 'fetchWithBQ'
    const getResultForwardDnsZones = await fetchWithBQ(
      dnsForwardZonesFind(
        {
          searchValue,
          pkeyOnly: true,
          sizeLimit: sizeLimit,
          version: apiVersion,
        },
        "dnsforwardzone_find"
      )
    );

    const responseDataForwardDnsZones =
      getResultForwardDnsZones.data as TFindRPCResponse<dnsZoneType>;
    // Return possible errors
    if (responseDataForwardDnsZones.error) {
      return {
        error: {
          status: <const>"CUSTOM_ERROR",
          data: responseDataForwardDnsZones.error,
          error: "Error fetching forward DNS Zones",
        },
      };
    }

    // FETCH DNS ZONE DATA VIA "dnsforwardzone_show" COMMAND
    const dnsZonesItemsCount = responseDataForwardDnsZones.result.result.length;
    const dnsZonesIds: string[] = responseDataForwardDnsZones.result.result
      .slice(startIdx, Math.min(dnsZonesItemsCount, stopIdx))
      .map((dnsZone) => dnsZone.idnsname[0].__dns_name__);

    // FETCH DNS ZONE DATA VIA "dnsforwardzone_show" COMMAND
    const commands: Command[] = dnsZonesIds.map((dnsZoneId) => {
      return {
        method: "dnsforwardzone_show",
        params: [[dnsZoneId], {}],
      };
    });

    const dnsZonesShowResult = await fetchWithBQ(
      getBatchCommand(commands, apiVersion)
    );

    const response = dnsZonesShowResult.data as TBatchRPCResponse<unknown>;
    if (response.error) {
      return {
        error: {
          status: <const>"CUSTOM_ERROR",
          data: response.error,
          error: "Error fetching forward DNS Zones details",
        },
      };
    }

    const retypedResponse: ValidBatchRPCResponse<DNSForwardZone> = {
      ...response,
      result: {
        ...response.result,
        results: response.result.results.map((result) => {
          if (result.error != null) return result;
          return {
            ...result,
            result: apiToDnsForwardZone(
              result.result as Record<string, unknown>
            ),
          };
        }),
      },
    };

    // Return results
    return { data: retypedResponse };
  } catch (error) {
    return {
      error: {
        status: <const>"CUSTOM_ERROR",
        data: error,
        error: "Error obtaining",
      },
    };
  }
};

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get forward DNS zones IDs
     * @param {DnsForwardZonesFindPayload} payload - The payload containing search parameters
     * @returns {Command<TFindRPCResponse<DNSForwardZone>>} - Promise with the response data
     *
     */
    dnsForwardZonesFind: build.query<
      TFindRPCResponse<never>,
      DnsForwardZonesFindPayload
    >({
      query: (payload) => dnsForwardZonesFind(payload, "dnsforwardzone_find"),
    }),
    /**
     * Find forward DNS zones full data
     * @param {DnsZonesFullDataPayload} payload - The payload containing search parameters
     * @returns {TBatchRPCResponse<DNSForwardZone>} - List of DNS zones full data
     */
    getDnsForwardZonesFullData: build.query<
      ValidBatchRPCResponse<DNSForwardZone>,
      DnsForwardZonesFullDataPayload
    >({
      queryFn: async (payloadData, _queryApi, _extraOptions, fetchWithBQ) =>
        find(payloadData, fetchWithBQ),
    }),
    /**
     * Find forward DNS zones full data
     * @param {DnsZonesFullDataPayload} payload - The payload containing search parameters
     * @returns {DNSZoneBatchResponse} - List of DNS zones full data
     *
     */
    searchDnsForwardZonesEntries: build.mutation<
      ValidBatchRPCResponse<DNSForwardZone>,
      DnsForwardZonesFullDataPayload
    >({
      queryFn: async (payloadData, _queryApi, _extraOptions, fetchWithBQ) =>
        find(payloadData, fetchWithBQ),
    }),
  }),
  overrideExisting: false,
});

export const {
  useDnsForwardZonesFindQuery,
  useGetDnsForwardZonesFullDataQuery,
  useSearchDnsForwardZonesEntriesMutation,
} = extendedApi;
