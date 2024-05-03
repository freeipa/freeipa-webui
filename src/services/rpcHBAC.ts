import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  useGettingGenericQuery,
  useGetGenericListQuery,
} from "./rpc";
import { apiToHBACRule } from "src/utils/hbacRulesUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { HBACRule } from "../utils/datatypes/globalDataTypes";

/**
 * HBAC-related endpoints: getHbacRulesInfoByName
 *
 * API commands:
 * - hbacrule_show: https://freeipa.readthedocs.io/en/latest/api/hbacrule_show.html
 */

export interface HbacRulesShowPayload {
  hbacRuleNamesList: string[];
  no_members: boolean | true;
  version: string;
}

export interface HBACRulePayload {
  no_members: boolean | true;
  cn?: string;
  accessruletype?: "allow" | "deny";
  usercategory?: "all";
  hostcategory?: "all";
  sourcehostcategory?: "all";
  servicecategory?: "all";
  description: string;
  ipaenabledflag?: boolean;
  externalhost?: string;
  timelimit?: number;
  sizelimit?: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Given a list of HBAC rules names, show the full data of those HBAC rules
     * @param {HbacRulesShowPayload} - Payload with HBAC rule names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getHbacRulesInfoByName: build.query<HBACRule[], HbacRulesShowPayload>({
      query: (payload) => {
        const hbacRuleNames = payload.hbacRuleNamesList;
        const noMembers = payload.no_members || false;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const hbacRuleNamesShowCommands: Command[] = hbacRuleNames.map(
          (hbacRuleName) => ({
            method: "hbacrule_show",
            params: [[hbacRuleName], { no_members: noMembers }],
          })
        );
        return getBatchCommand(hbacRuleNamesShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): HBACRule[] => {
        const hbacRulesList: HBACRule[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const hbacRuleData = apiToHBACRule(results[i].result);
          hbacRulesList.push(hbacRuleData);
        }
        return hbacRulesList;
      },
    }),
    /**
     * Add entity to HBAC rules
     * @param {string} toId - ID of the entity to add to HBAC rules
     * @param {string} type - Type of the entity
     *    Available types: user | host | service | sourcehost
     * @param {string[]} listOfMembers - List of members to add to the HBAC rules
     */
    addToHbacRules: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const roleNames = payload[2];

        let methodType = "";
        if (memberType === "user") {
          methodType = "hbacrule_add_user";
        } else if (memberType === "host") {
          methodType = "hbacrule_add_host";
        } else if (memberType === "service") {
          methodType = "hbacrule_add_service";
        } else if (memberType === "sourcehost") {
          methodType = "hbacrule_add_sourcehost";
        }

        const membersToAdd: Command[] = [];
        roleNames.map((roleName) => {
          const payloadItem = {
            method: methodType,
            params: [[roleName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    /**
     * Delete entity from HBAC rules
     * @param {string} memberId - ID of the entity to remove from HBAC rules
     * @param {string} memberType - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfHbacRules - List of members to remove from HBAC rules
     */
    removeFromHbacRules: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const listOfHbacRules = payload[2];

        let methodType = "";
        if (memberType === "user") {
          methodType = "hbacrule_remove_user";
        } else if (memberType === "host") {
          methodType = "hbacrule_remove_host";
        } else if (memberType === "service") {
          methodType = "hbacrule_remove_service";
        } else if (memberType === "sourcehost") {
          methodType = "hbacrule_remove_sourcehost";
        }

        const membersToRemove: Command[] = [];
        listOfHbacRules.map((hbacrule) => {
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

export const useGettingHbacRulesQuery = (payloadData) => {
  payloadData["objName"] = "hbacrule";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const useGettingHostQuery = (payloadData) => {
  payloadData["objName"] = "host";
  payloadData["objAttr"] = "fqdn";
  return useGettingGenericQuery(payloadData);
};

export const useGetHostsListQuery = () => {
  return useGetGenericListQuery("host");
};

export const useGetDNSZonesQuery = () => {
  return useGetGenericListQuery("dnszone");
};

export const {
  useGetHbacRulesInfoByNameQuery,
  useAddToHbacRulesMutation,
  useRemoveFromHbacRulesMutation,
} = extendedApi;
