import {
  api,
  Command,
  getCommand,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToGroup } from "src/utils/groupUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { UserGroup } from "../utils/datatypes/globalDataTypes";

/**
 * User Group-related endpoints: addToGroups, removeFromGroups, getGroupInfoByName, addGroup, removeGroups
 *
 * API commands:
 * - group_add: https://freeipa.readthedocs.io/en/latest/api/group_add.html
 * - group_del: https://freeipa.readthedocs.io/en/latest/api/group_del.html
 * - group_add_member: https://freeipa.readthedocs.io/en/latest/api/group_add_member.html
 * - group_remove_member: https://freeipa.readthedocs.io/en/latest/api/group_remove_member.html
 * - group_show: https://freeipa.readthedocs.io/en/latest/api/group_show.html
 */

export interface GroupShowPayload {
  groupNamesList: string[];
  no_members?: boolean;
  version: string;
}

export interface GroupAddPayload {
  groupName: string;
  version?: string;
  gidnumber?: string;
  description?: string;
  groupType: "posix" | "non-posix" | "external";
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Add a group
     * @param {object} GroupAddPayload - Group payload parameters
     * @param GroupAddPayload.groupName - The name of the group
     * @param GroupAddPayload.desc - The group description
     * @param GroupAddPayload.gid - The gidnumber for the group (posix only)
     * @param GroupAddPayload.groupType - The group type
     *    Available types: non-posix | posix | external
     * @param GroupAddPayload.version - The api version
     */
    addGroup: build.mutation<FindRPCResponse, GroupAddPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["groupName"]],
          {
            version: payloadData.version || API_VERSION_BACKUP,
          },
        ];
        if ("gidnumber" in payloadData && payloadData["gidnumber"] !== "") {
          params[1]["gidnumber"] = payloadData["gidnumber"];
        }
        if ("description" in payloadData && payloadData["description"] !== "") {
          params[1]["description"] = payloadData["description"];
        }
        if (payloadData["groupType"] === "non-posix") {
          params[1]["nonposix"] = true;
        } else if (payloadData["groupType"] === "external") {
          params[1]["external"] = true;
        }

        return getCommand({
          method: "group_add",
          params: params,
        });
      },
    }),
    /**
     * Remove groups
     * @param {UserGroup[]} listOfGroups - List of groups to remove
     */
    removeGroups: build.mutation<BatchRPCResponse, UserGroup[]>({
      query: (groups) => {
        const groupsToDeletePayload: Command[] = [];
        groups.map((group) => {
          const payloadItem = {
            method: "group_del",
            params: [[group.cn], {}],
          } as Command;
          groupsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(groupsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    /**
     * Add entity to groups
     * @param {string} toId - ID of the entity to add to groups
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the groups
     */
    addToGroups: build.mutation<BatchRPCResponse, [string, string, string[]]>({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const groupNames = payload[2];
        const membersToAdd: Command[] = [];
        groupNames.map((groupName) => {
          const payloadItem = {
            method: "group_add_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    removeFromGroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const groupNames = payload[2];
        const membersToRemove: Command[] = [];
        groupNames.map((groupName) => {
          const payloadItem = {
            method: "group_remove_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
    /**
     * Given a list of group names, show the full data of those groups
     * @param {string[]} groupNames - List of group names
     * @param {boolean} noMembers - Whether to show members or not
     * @returns {BatchRPCResponse} - Batch response
     */
    getGroupInfoByName: build.query<UserGroup[], GroupShowPayload>({
      query: (payload) => {
        const groupNames = payload.groupNamesList;
        const noMembers = payload.no_members || true;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const groupShowCommands: Command[] = groupNames.map((groupName) => ({
          method: "group_show",
          params: [[groupName], { no_members: noMembers }],
        }));
        return getBatchCommand(groupShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): UserGroup[] => {
        const groupList: UserGroup[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const groupData = apiToGroup(results[i].result);
          groupList.push(groupData);
        }
        return groupList;
      },
    }),
  }),
  overrideExisting: false,
});

// Groups
export const useGettingGroupsQuery = (payloadData) => {
  payloadData["objName"] = "group";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useAddGroupMutation,
  useRemoveGroupsMutation,
  useAddToGroupsMutation,
  useRemoveFromGroupsMutation,
  useGetGroupInfoByNameQuery,
} = extendedApi;
