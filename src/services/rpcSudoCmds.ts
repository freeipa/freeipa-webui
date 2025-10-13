import {
  api,
  BatchResponse,
  Command,
  FindRPCResponse,
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
 * - sudocmd_mod: https://freeipa.readthedocs.io/en/latest/api/sudocmd_mod.html
 */

type CmdFullData = {
  cmd?: Partial<SudoCmd>;
};

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
    getSudoCmdFullData: build.query<CmdFullData, string>({
      query: (cmd) => {
        // Prepare search parameters
        const params = {
          all: true,
          rights: true,
        };

        const showCommand: Command = {
          method: "sudocmd_show",
          params: [[cmd], params],
        };

        const batchPayload: Command[] = [showCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): CmdFullData => {
        const [cmdResponse] = response.result.results;

        // Initialize data (to prevent 'undefined' values)
        const cmdData = cmdResponse.result;
        let cmdObject = {};
        if (!cmdResponse.error) {
          cmdObject = apiToSudoCmd(cmdData);
        }

        return {
          cmd: cmdObject,
        };
      },
      providesTags: ["FullSudoCmd"],
    }),
    saveSudoCmd: build.mutation<FindRPCResponse, Partial<SudoCmd>>({
      query: (cmd) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...cmd,
        };
        delete params["sudocmd"];
        const id = cmd.sudocmd !== undefined ? cmd.sudocmd : "";
        return getCommand({
          method: "sudocmd_mod",
          params: [[id], params],
        });
      },
      invalidatesTags: ["FullSudoCmd"],
    }),
    /**
     * Get command info by name
     */
    getSudoCmdById: build.query<SudoCmd, string>({
      query: (groupId) => {
        return getCommand({
          method: "sudocmd_show",
          params: [
            [groupId],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse): SudoCmd =>
        apiToSudoCmd(response.result.result),
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
  useGetSudoCmdFullDataQuery,
  useSaveSudoCmdMutation,
  useGetSudoCmdByIdQuery,
} = extendedApi;
