import {
  api,
  Command,
  getCommand,
  getBatchCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
  MemberPayload,
} from "./rpc";
import { apiToHostGroup } from "src/utils/hostGroupUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
// Data types
import { HostGroup } from "src/utils/datatypes/globalDataTypes";

/**
 * User Group-related endpoints: addToGroups, removeFromGroups,
 * getGroupInfoByName, addGroup, removeGroups, saveHostGroup
 *
 * API commands:
 * - hostgroup_add: https://freeipa.readthedocs.io/en/latest/api/hostgroup_add.html
 * - hostgroup_del: https://freeipa.readthedocs.io/en/latest/api/hostgroup_del.html
 * - hostgroup_add_member: https://freeipa.readthedocs.io/en/latest/api/hostgroup_add_member.html
 * - hostgroup_remove_member: https://freeipa.readthedocs.io/en/latest/api/hostgroup_remove_member.html
 * - hostgroup_show: https://freeipa.readthedocs.io/en/latest/api/hostgroup_show.html
 * - hostgroup_mod: https://freeipa.readthedocs.io/en/latest/api/hostgroup_mod.html
 */

interface GroupShowPayload {
  groupNamesList: string[];
  no_members?: boolean;
  version: string;
}

export interface GroupAddPayload {
  groupName: string;
  version?: string;
  description?: string;
}

type GroupFullData = {
  hostGroup?: Partial<HostGroup>;
};

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHostGroupsFullData: build.query<GroupFullData, string>({
      query: (groupId) => {
        // Prepare search parameters
        const group_params = {
          all: true,
          rights: true,
        };

        const groupShowCommand: Command = {
          method: "hostgroup_show",
          params: [[groupId], group_params],
        };

        const batchPayload: Command[] = [groupShowCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): GroupFullData => {
        const [groupResponse] = response.result.results;

        // Initialize group data (to prevent 'undefined' values)
        const groupData = groupResponse.result;

        let groupObject = {};
        if (!groupResponse.error) {
          groupObject = apiToHostGroup(groupData);
        }

        return {
          hostGroup: groupObject,
        };
      },
      providesTags: ["FullHostGroup"],
    }),
    /**
     * Add a group
     * @param {object} GroupAddPayload - Group payload parameters
     * @param GroupAddPayload.groupName - The name of the group
     * @param GroupAddPayload.desc - The group description
     * @param GroupAddPayload.version - The api version
     */
    addHostGroup: build.mutation<FindRPCResponse, GroupAddPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["groupName"]],
          {
            version: payloadData.version || API_VERSION_BACKUP,
          },
        ];

        if ("description" in payloadData && payloadData["description"] !== "") {
          params[1]["description"] = payloadData["description"];
        }

        return getCommand({
          method: "hostgroup_add",
          params: params,
        });
      },
    }),
    /**
     * Remove groups
     * @param {HostGroup[]} listOfGroups - List of groups to remove
     */
    removeHostGroups: build.mutation<BatchRPCResponse, HostGroup[]>({
      query: (groups) => {
        const groupsToDeletePayload: Command[] = [];
        groups.map((group) => {
          const payloadItem = {
            method: "hostgroup_del",
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
    addToHostGroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const groupNames = payload[2];
        const membersToAdd: Command[] = [];
        groupNames.map((groupName) => {
          const payloadItem = {
            method: "hostgroup_add_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    removeFromHostGroups: build.mutation<
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
            method: "hostgroup_remove_member",
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
    getHostGroupInfoByName: build.query<HostGroup[], GroupShowPayload>({
      query: (payload) => {
        const groupNames = payload.groupNamesList;
        const noMembers = payload.no_members || true;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const groupShowCommands: Command[] = groupNames.map((groupName) => ({
          method: "hostgroup_show",
          params: [[groupName], { no_members: noMembers }],
        }));
        return getBatchCommand(groupShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): HostGroup[] => {
        const groupList: HostGroup[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const groupData = apiToHostGroup(results[i].result);
          groupList.push(groupData);
        }
        return groupList;
      },
    }),
    /**
     * Get host group info by name
     */
    getHostGroupById: build.query<HostGroup, string>({
      query: (groupId) => {
        return getCommand({
          method: "hostgroup_show",
          params: [
            [groupId],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse): HostGroup =>
        apiToHostGroup(response.result.result),
    }),
    saveHostGroup: build.mutation<FindRPCResponse, Partial<HostGroup>>({
      query: (group) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...group,
        };
        delete params["cn"];
        const cn = group.cn !== undefined ? group.cn : "";
        return getCommand({
          method: "hostgroup_mod",
          params: [[cn], params],
        });
      },
      invalidatesTags: ["FullHostGroup"],
    }),
    /**
     * Given a list of user IDs, add them as members to a group
     * @param {MemberPayload} - Payload with user IDs and options
     */
    addAsMemberHG: build.mutation<FindRPCResponse, MemberPayload>({
      query: (payload) => {
        const hostGroup = payload.entryName;
        const idsToAdd = payload.idsToAdd;
        const memberType = payload.entityType;

        return getCommand({
          method: "hostgroup_add_member",
          params: [
            [hostGroup],
            { all: true, [memberType]: idsToAdd, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Remove a user group from some user members
     * @param {MemberPayload} - Payload with user IDs and options
     */
    removeAsMemberHG: build.mutation<FindRPCResponse, MemberPayload>({
      query: (payload) => {
        const hostGroup = payload.entryName;
        const idsToAdd = payload.idsToAdd;
        const memberType = payload.entityType;

        return getCommand({
          method: "hostgroup_remove_member",
          params: [
            [hostGroup],
            { all: true, [memberType]: idsToAdd, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Add member managers (user & host groups)
     * @param {MemberPayload} - Payload with IDs and options
     */
    addHGMemberManagers: build.mutation<FindRPCResponse, MemberPayload>({
      query: (payload) => {
        const id = payload.entryName;
        const idsToAdd = payload.idsToAdd;
        const memberType = payload.entityType;

        return getCommand({
          method: "hostgroup_add_member_manager",
          params: [
            [id],
            { all: true, [memberType]: idsToAdd, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Remove member managers (user & host groups)
     * @param {MemberPayload} - Payload with IDs and options
     */
    removeHGMemberManagers: build.mutation<FindRPCResponse, MemberPayload>({
      query: (payload) => {
        const id = payload.entryName;
        const idsToAdd = payload.idsToAdd;
        const memberType = payload.entityType;

        return getCommand({
          method: "hostgroup_remove_member_manager",
          params: [
            [id],
            { all: true, [memberType]: idsToAdd, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
  }),
  overrideExisting: false,
});

// Groups
export const useGettingHostGroupsQuery = (payloadData) => {
  payloadData["objName"] = "hostgroup";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useAddHostGroupMutation,
  useRemoveHostGroupsMutation,
  useAddToHostGroupsMutation,
  useRemoveFromHostGroupsMutation,
  useGetHostGroupInfoByNameQuery,
  useGetHostGroupsFullDataQuery,
  useSaveHostGroupMutation,
  useGetHostGroupByIdQuery,
  useAddAsMemberHGMutation,
  useRemoveAsMemberHGMutation,
  useAddHGMemberManagersMutation,
  useRemoveHGMemberManagersMutation,
} = extendedApi;
