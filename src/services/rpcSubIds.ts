import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
  FindRPCResponse,
  getCommand,
} from "./rpc";
import { apiToSubId } from "src/utils/subIdsUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SubId } from "src/utils/datatypes/globalDataTypes";

/**
 * Subordinate IDs-related endpoints: getSubIdsInfoByName, assignSubIds
 *
 * API commands:
 * - subid_show: https://freeipa.readthedocs.io/en/latest/api/subid_show.html
 * - subid_generate: https://freeipa.readthedocs.io/en/latest/api/subid_generate.html
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
    /**
     * Generate and auto-assign subUID and subGID range to user entry
     * @param {uid} - User entry
     */
    assignSubIds: build.mutation<FindRPCResponse, string>({
      query: (uid) => {
        const params = [
          [],
          {
            ipaowner: uid,
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "subid_generate",
          params: params,
        });
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

export const { useGetSubIdsInfoByNameQuery, useAssignSubIdsMutation } =
  extendedApi;
