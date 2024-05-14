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
 * Sudo rules-related endpoints: getSudoRulesInfoByName
 *
 * API commands:
 * - sudorule_show: https://freeipa.readthedocs.io/en/latest/api/hbacrule_show.html
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
  }),
  overrideExisting: false,
});

export const useGettingSudoRulesQuery = (payloadData) => {
  payloadData["objName"] = "sudorule";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const { useGetSudoRulesInfoByNameQuery } = extendedApi;
