import {
  api,
  BatchResponse,
  Command,
  FindRPCResponse,
  getCommand,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
  MemberPayload,
} from "./rpc";
import { apiToSudoCmdGroup } from "src/utils/sudoCmdGroupsUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SudoCmdGroup } from "../utils/datatypes/globalDataTypes";

/**
 * Sudo sudo command-related endpoints: getSudoCmdGroupInfoByName, addSudoCmdGroup,
 *   removeSudoCmdGroup
 *
 * API commands:
 * - sudocmdgroup_show: https://freeipa.readthedocs.io/en/latest/api/sudocmdgroup_show.html
 * - sudocmdgroup_add: https://freeipa.readthedocs.io/en/latest/api/sudocmdgroup_add_.html
 * - sudocmdgroup_del: https://freeipa.readthedocs.io/en/latest/api/sudocmdgroup_del.html
 *
 */

interface CmdFullData {
  group?: Partial<SudoCmdGroup>;
}

interface SudoCmdsShowPayload {
  sudoCmdNamesList: string[];
  no_members: boolean | true;
  version: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Given a list of Sudo cmd names, show the full data of those Sudo cmds
     * @param {sudoCmdsShowPayload} - Payload with Sudo cmd names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getSudoCmdGroupsInfoByName: build.query<
      SudoCmdGroup[],
      SudoCmdsShowPayload
    >({
      query: (payload) => {
        const sudoRuleNames = payload.sudoCmdNamesList;
        const noMembers = payload.no_members || false;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const sudoRuleNamesShowCommands: Command[] = sudoRuleNames.map(
          (sudoRuleName) => ({
            method: "sudocmdgroup_show",
            params: [[sudoRuleName], { no_members: noMembers }],
          })
        );
        return getBatchCommand(sudoRuleNamesShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): SudoCmdGroup[] => {
        const sudoGroupList: SudoCmdGroup[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const sudoGroupData = apiToSudoCmdGroup(results[i].result);
          sudoGroupList.push(sudoGroupData);
        }
        return sudoGroupList;
      },
    }),
    /**
     * Add Sudo cmd group
     * @param {string} name - ID of the entity to add to sudo cmd groups
     * @param {string} description - description
     */
    addSudoCmdGroups: build.mutation<BatchRPCResponse, [string, string]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          {
            description: payload[1],
          },
        ];
        return getCommand({
          method: "sudocmdgroup_add",
          params: params,
        });
      },
    }),
    /**
     * Remove Sudo command groups
     * @param {string[]} names - Sudo cmd group names
     */
    removeSudoCmdGroups: build.mutation<BatchRPCResponse, SudoCmdGroup[]>({
      query: (cmds) => {
        const cmdsToDeletePayload: Command[] = [];
        cmds.map((cmd) => {
          const payloadItem = {
            method: "sudocmdgroup_del",
            params: [[cmd.cn], {}],
          } as Command;
          cmdsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(cmdsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    getSudoCmdGroupsFullData: build.query<CmdFullData, string>({
      query: (group) => {
        // Prepare search parameters
        const params = {
          all: true,
          rights: true,
        };

        const showCommand: Command = {
          method: "sudocmdgroup_show",
          params: [[group], params],
        };

        const batchPayload: Command[] = [showCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): CmdFullData => {
        const [groupResponse] = response.result.results;

        // Initialize group data (to prevent 'undefined' values)
        const groupData = groupResponse.result;
        let groupObject = {};
        if (!groupResponse.error) {
          groupObject = apiToSudoCmdGroup(groupData);
        }

        return {
          group: groupObject,
        };
      },
      providesTags: ["FullSudoCmdGroup"],
    }),
    saveSudoCmdGroup: build.mutation<FindRPCResponse, Partial<SudoCmdGroup>>({
      query: (cmd) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...cmd,
        };
        delete params["cn"];
        const id = cmd.cn !== undefined ? cmd.cn : "";
        return getCommand({
          method: "sudocmdgroup_mod",
          params: [[id], params],
        });
      },
      invalidatesTags: ["FullSudoCmdGroup"],
    }),
    addToSudoCmdGroups: build.mutation<
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
            method: "sudocmdgroup_add_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    removeFromSudoCmdGroups: build.mutation<
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
            method: "sudocmdgroup_remove_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
    /**
     * Get host group info by name
     */
    getSudoCmdGroupById: build.query<SudoCmdGroup, string>({
      query: (groupId) => {
        return getCommand({
          method: "sudocmdgroup_show",
          params: [
            [groupId],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse): SudoCmdGroup =>
        apiToSudoCmdGroup(response.result.result),
    }),
    /**
     * Add sudo command members to group
     * @param {MemberPayload} - Payload with IDs and options
     */
    addMembersToSudoCmdGroup: build.mutation<FindRPCResponse, MemberPayload>({
      query: (payload) => {
        const group = payload.entryName;
        const idsToAdd = payload.idsToAdd;
        const memberType = payload.entityType;
        return getCommand({
          method: "sudocmdgroup_add_member",
          params: [
            [group],
            { all: true, [memberType]: idsToAdd, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Remove sudo command members from group
     * @param {MemberPayload} - Payload with IDs and options
     */
    removeMembersFromSudoCmdGroup: build.mutation<
      FindRPCResponse,
      MemberPayload
    >({
      query: (payload) => {
        const group = payload.entryName;
        const idsToAdd = payload.idsToAdd;
        const memberType = payload.entityType;

        return getCommand({
          method: "sudocmdgroup_remove_member",
          params: [
            [group],
            { all: true, [memberType]: idsToAdd, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingSudoCmdGroupsQuery = (payloadData) => {
  payloadData["objName"] = "sudocmdgroup";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useGetSudoCmdGroupsInfoByNameQuery,
  useAddSudoCmdGroupsMutation,
  useRemoveSudoCmdGroupsMutation,
  useSaveSudoCmdGroupMutation,
  useGetSudoCmdGroupsFullDataQuery,
  useAddToSudoCmdGroupsMutation,
  useRemoveFromSudoCmdGroupsMutation,
  useGetSudoCmdGroupByIdQuery,
  useAddMembersToSudoCmdGroupMutation,
  useRemoveMembersFromSudoCmdGroupMutation,
} = extendedApi;
