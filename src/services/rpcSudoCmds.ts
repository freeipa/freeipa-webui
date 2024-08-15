import {
  api,
  Command,
  getCommand,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToSudoCmd } from "src/utils/sudoCmdsUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SudoCmd } from "../utils/datatypes/globalDataTypes";

/**
 * Sudo sudo command-related endpoints: getSudoCmdInfoByName, addSudoCmd,
 *   removeSudoCmd
 *
 * API commands:
 * - sudocmd_show: https://freeipa.readthedocs.io/en/latest/api/sudocmd_show.html
 * - sudocmd_add: https://freeipa.readthedocs.io/en/latest/api/sudocmd_add_.html
 * - sudocmd_del: https://freeipa.readthedocs.io/en/latest/api/sudocmd_del.html
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
    getSudoCmdsInfoByName: build.query<SudoCmd[], SudoCmdsShowPayload>({
      query: (payload) => {
        const sudoRuleNames = payload.sudoCmdNamesList;
        const noMembers = payload.no_members || false;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const sudoRuleNamesShowCommands: Command[] = sudoRuleNames.map(
          (sudoRuleName) => ({
            method: "sudocmd_show",
            params: [[sudoRuleName], { no_members: noMembers }],
          })
        );
        return getBatchCommand(sudoRuleNamesShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): SudoCmd[] => {
        const sudoRulesList: SudoCmd[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const sudoRuleData = apiToSudoCmd(results[i].result);
          sudoRulesList.push(sudoRuleData);
        }
        return sudoRulesList;
      },
    }),
    /**
     * Add Sudo cmd
     * @param {string} name - ID of the entity to add to sudo cmds
     * @param {string} description - description
     */
    addSudoCmd: build.mutation<BatchRPCResponse, [string, string]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          {
            description: payload[1],
          },
        ];
        return getCommand({
          method: "sudocmd_add",
          params: params,
        });
      },
    }),
    /**
     * Remove Sudo commands
     * @param {string[]} names - Sudo cmd names
     */
    removeSudoCmds: build.mutation<BatchRPCResponse, SudoCmd[]>({
      query: (cmds) => {
        const cmdsToDeletePayload: Command[] = [];
        cmds.map((cmd) => {
          const payloadItem = {
            method: "sudocmd_del",
            params: [[cmd.sudocmd], {}],
          } as Command;
          cmdsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(cmdsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingSudoCmdsQuery = (payloadData) => {
  payloadData["objName"] = "sudocmd";
  payloadData["objAttr"] = "sudocmd";
  return useGettingGenericQuery(payloadData);
};

export const {
  useGetSudoCmdsInfoByNameQuery,
  useAddSudoCmdMutation,
  useRemoveSudoCmdsMutation,
} = extendedApi;
