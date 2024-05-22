import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToSubId } from "src/utils/subIdsUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SubId } from "src/utils/datatypes/globalDataTypes";

/**
 * Subordinate IDs-related endpoints:
 *
 * API commands:
 * - subid_show: https://freeipa.readthedocs.io/en/latest/api/subid_show.html
 *
 */

export interface SubIdsShowPayload {
  subIdsList: string[];
  version: string;
}

export interface SubIdPayload {
  ipauniqueid?: string;
  description?: string;
  ipaowner?: string;
  ipasubuidnumber?: string;
  ipasubgidnumber?: string;
  timelimit?: number;
  sizelimit?: number;
  version?: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Given a list of Subordinate IDs , show the full data of those Subordinate IDs
     * @param {subIdsShowPayload} - Payload with Subordinate IDs and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getSubIdsInfoByName: build.query<SubId[], SubIdsShowPayload>({
      query: (payload) => {
        const subIdsList = payload.subIdsList;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const subIdsShowCommands: Command[] = subIdsList.map((subId) => ({
          method: "subid_show",
          params: [[subId], {}],
        }));
        return getBatchCommand(subIdsShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): SubId[] => {
        const subIdsList: SubId[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const subIdData = apiToSubId(results[i].result);
          subIdsList.push(subIdData);
        }
        return subIdsList;
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingSubIdsQuery = (payloadData) => {
  payloadData["objName"] = "subid";
  payloadData["objAttr"] = "ipauniqueid";
  return useGettingGenericQuery(payloadData);
};

export const { useGetSubIdsInfoByNameQuery } = extendedApi;
