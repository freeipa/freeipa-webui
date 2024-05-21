import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToSudoRule } from "src/utils/sudoRulesUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SudoRule } from "../utils/datatypes/globalDataTypes";

/**
 * Sudo rules-related endpoints: getSudoRulesInfoByName, addToSudoRules, removeFromSudoRules
 *
 * API commands:
 * - sudorule_show: https://freeipa.readthedocs.io/en/latest/api/sudorule_show.html
 * - sudorule_add_user: https://freeipa.readthedocs.io/en/latest/api/sudorule_add_user.html
 * - sudorule_add_host: https://freeipa.readthedocs.io/en/latest/api/sudorule_add_host.html
 * - sudorule_add_option: https://freeipa.readthedocs.io/en/latest/api/sudorule_add_option.html
 * - sudorule_remove_user: https://freeipa.readthedocs.io/en/latest/api/sudorule_remove_user.html
 * - sudorule_remove_host: https://freeipa.readthedocs.io/en/latest/api/sudorule_remove_host.html
 * - sudorule_remove_option: https://freeipa.readthedocs.io/en/latest/api/sudorule_remove_option.html
 *
 */

export interface SudoRulesShowPayload {
  sudoRuleNamesList: string[];
  no_members: boolean | true;
  version: string;
}

export interface SudoRulePayload {
  no_members: boolean | true;
  cn?: string;
  description?: string;
  ipaenabledflag?: boolean;
  usercategory?: "all";
  hostcategory?: "all";
  cmdcategory?: "all";
  ipasudorunasusercategory?: "all";
  ipasudorunasgroupcategory?: "all";
  sudoorder?: number | 0;
  externaluser?: string;
  externalhost?: string;
  ipasudorunasextuser?: string;
  ipasudorunasextgroup?: string;
  timelimit?: number;
  sizelimit?: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Given a list of Sudo rules names, show the full data of those Sudo rules
     * @param {sudoRulesShowPayload} - Payload with Sudo rule names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getSudoRulesInfoByName: build.query<SudoRule[], SudoRulesShowPayload>({
      query: (payload) => {
        const sudoRuleNames = payload.sudoRuleNamesList;
        const noMembers = payload.no_members || false;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const sudoRuleNamesShowCommands: Command[] = sudoRuleNames.map(
          (sudoRuleName) => ({
            method: "sudorule_show",
            params: [[sudoRuleName], { no_members: noMembers }],
          })
        );
        return getBatchCommand(sudoRuleNamesShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): SudoRule[] => {
        const sudoRulesList: SudoRule[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const sudoRuleData = apiToSudoRule(results[i].result);
          sudoRulesList.push(sudoRuleData);
        }
        return sudoRulesList;
      },
    }),
    /**
     * Add entity to Sudo rules
     * @param {string} toId - ID of the entity to add to Sudo rules
     * @param {string} type - Type of the entity
     *    Available types: user | host | option
     * @param {string[]} listOfMembers - List of members to add to the Sudo rules
     */
    addToSudoRules: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const sudoRoleNames = payload[2];

        let methodType = "";
        if (memberType === "user") {
          methodType = "sudorule_add_user";
        } else if (memberType === "host") {
          methodType = "sudorule_add_host";
        } else if (memberType === "option") {
          methodType = "sudorule_add_option";
        }

        const membersToAdd: Command[] = [];
        sudoRoleNames.map((sudoRoleName) => {
          const payloadItem = {
            method: methodType,
            params: [[sudoRoleName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    /**
     * Delete entity from Sudo rules
     * @param {string} memberId - ID of the entity to remove from Sudo rules
     * @param {string} memberType - Type of the entity
     *    Available types: user | host | option
     * @param {string[]} listOfSudoRules - List of members to remove from Sudo rules
     */
    removeFromSudoRules: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const listOfSudoRules = payload[2];

        let methodType = "";
        if (memberType === "user") {
          methodType = "sudorule_remove_user";
        } else if (memberType === "host") {
          methodType = "sudorule_remove_host";
        } else if (memberType === "option") {
          methodType = "sudorule_remove_option";
        }

        const membersToRemove: Command[] = [];
        listOfSudoRules.map((hbacrule) => {
          const payloadItem: Command = {
            method: methodType,
            params: [[hbacrule], { [memberType]: memberId }],
          };
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingSudoRulesQuery = (payloadData) => {
  payloadData["objName"] = "sudorule";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useGetSudoRulesInfoByNameQuery,
  useAddToSudoRulesMutation,
  useRemoveFromSudoRulesMutation,
} = extendedApi;
