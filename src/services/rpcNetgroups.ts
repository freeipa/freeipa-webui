import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { apiToNetgroup } from "src/utils/netgroupsUtils";
import { Netgroup } from "../utils/datatypes/globalDataTypes";

/**
 * Netgroup-related endpoints: addToNetgroups, removeFromNetgroups, getNetgroupInfoByName
 *
 * API commands:
 * - netgroup_add_member: https://freeipa.readthedocs.io/en/latest/api/netgroup_add_member.html
 * - netgroup_remove_member: https://freeipa.readthedocs.io/en/latest/api/netgroup_remove_member.html
 * - netgroup_show: https://freeipa.readthedocs.io/en/latest/api/netgroup_show.html
 */

export interface NetgroupShowPayload {
  netgroupNamesList: string[];
  no_members?: boolean;
  version: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Add entity to netgroups
     * @param {string} toId - ID of the entity to add to netgroups
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the netgroups
     */
    addToNetgroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const netgroupNames = payload[2];
        const membersToAdd: Command[] = [];
        netgroupNames.map((netgroupName) => {
          const payloadItem = {
            method: "netgroup_add_member",
            params: [[netgroupName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    /**
     * Delete entity from netgroups
     * @param {string} memberId - ID of the entity to remove from netgroups
     * @param {string} memberType - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} netgroupNames - List of members to remove from netgroups
     */
    removeFromNetgroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const netgroupNames = payload[2];
        const membersToRemove: Command[] = [];
        netgroupNames.map((netgroupName) => {
          const payloadItem = {
            method: "netgroup_remove_member",
            params: [[netgroupName], { [memberType]: memberId }],
          } as Command;
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
    /**
     * Given a list of netgroup names, show the full data of those netgroups
     * @param {NetgroupShowPayload} - Payload with netgroup names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getNetgroupInfoByName: build.query<Netgroup[], NetgroupShowPayload>({
      query: (payload) => {
        const netgroupNames = payload.netgroupNamesList;
        const noMembers = payload.no_members || true;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const netgroupShowCommands: Command[] = netgroupNames.map(
          (netgroupName) => ({
            method: "netgroup_show",
            params: [[netgroupName], { no_members: noMembers }],
          })
        );
        return getBatchCommand(netgroupShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): Netgroup[] => {
        const netgroupList: Netgroup[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const netgroupData = apiToNetgroup(results[i].result);
          netgroupList.push(netgroupData);
        }
        return netgroupList;
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingNetgroupsQuery = (payloadData) => {
  payloadData["objName"] = "netgroup";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useAddToNetgroupsMutation,
  useRemoveFromNetgroupsMutation,
  useGetNetgroupInfoByNameQuery,
} = extendedApi;
