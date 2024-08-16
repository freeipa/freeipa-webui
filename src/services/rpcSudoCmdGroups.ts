import {
  api,
  Command,
  getCommand,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
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

export interface SudoCmdsShowPayload {
  sudoCmdNamesList: string[];
  no_members: boolean | true;
  version: string;
}

export interface SudoCmdPayload {
  no_members: boolean | true;
  sudocmd?: string;
  description?: string;
  timelimit?: number;
  sizelimit?: number;
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
} = extendedApi;
