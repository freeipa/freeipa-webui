import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToHBACRule } from "src/utils/hbacRulesUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { HBACRule, HBACService } from "../utils/datatypes/globalDataTypes";

/**
 * HBAC-related endpoints:
 * - getHbacRulesInfoByName
 * - addHbacRule
 * - removeHbacRules
 * - addToHbacRules
 * - removeFromHbacRules
 * - disableHbacRule
 * - enableHbacRule
 * - addHbacService
 * - removeHbacService
 *
 * API commands:
 * - hbacrule_show: https://freeipa.readthedocs.io/en/latest/api/hbacrule_show.html
 * - hbacrule_add: https://freeipa.readthedocs.io/en/latest/api/hbacrule_add.html
 * - hbacrule_del: https://freeipa.readthedocs.io/en/latest/api/hbacrule_del.html
 * - hbacrule_add_user: https://freeipa.readthedocs.io/en/latest/api/hbacrule_add_user.html
 * - hbacrule_add_host: https://freeipa.readthedocs.io/en/latest/api/hbacrule_add_host.html
 * - hbacrule_add_service: https://freeipa.readthedocs.io/en/latest/api/hbacrule_add_service.html
 * - hbacrule_add_sourcehost: https://freeipa.readthedocs.io/en/latest/api/hbacrule_add_sourcehost.html
 * - hbacrule_remove_user: https://freeipa.readthedocs.io/en/latest/api/hbacrule_remove_user.html
 * - hbacrule_remove_host: https://freeipa.readthedocs.io/en/latest/api/hbacrule_remove_host.html
 * - hbacrule_remove_service: https://freeipa.readthedocs.io/en/latest/api/hbacrule_remove_service.html
 * - hbacrule_remove_sourcehost: https://freeipa.readthedocs.io/en/latest/api/hbacrule_remove_sourcehost.html
 * - hbacrule_disable: https://freeipa.readthedocs.io/en/latest/api/hbacrule_disable.html
 * - hbacrule_enable: https://freeipa.readthedocs.io/en/latest/api/hbacrule_enable.html
 * - hbacsvc_add: https://freeipa.readthedocs.io/en/latest/api/hbacsvc_add.html
 * - hbacsvc_del: https://freeipa.readthedocs.io/en/latest/api/hbacsvc_del.html
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
     * Add HBAC rule
     * @param {string} name - ID of the entity to add to HBAC rules
     * @param {string} description - description
     */
    addHbacRule: build.mutation<BatchRPCResponse, [string, string]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          {
            description: payload[1],
          },
        ];
        return getCommand({
          method: "hbacrule_add",
          params: params,
        });
      },
    }),
    /**
     * Remove HBAC rule
     * @param {string[]} names - HBAC Rule name
     */
    removeHbacRules: build.mutation<BatchRPCResponse, HBACRule[]>({
      query: (rules) => {
        const groupsToDeletePayload: Command[] = [];
        rules.map((rule) => {
          const payloadItem = {
            method: "hbacrule_del",
            params: [[rule.cn], {}],
          } as Command;
          groupsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(groupsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
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
    enableHbacRule: build.mutation<FindRPCResponse, HBACRule>({
      query: (rule) => {
        const params = [
          [rule.cn],
          {
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "hbacrule_enable",
          params: params,
        });
      },
    }),
    disableHbacRule: build.mutation<FindRPCResponse, HBACRule>({
      query: (rule) => {
        const params = [
          [rule.cn],
          {
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "hbacrule_disable",
          params: params,
        });
      },
    }),
    /**
     * Add HBAC service
     * @param {string} name - ID of the entity to add to HBAC services
     * @param {string} description - description
     */
    addHbacService: build.mutation<BatchRPCResponse, [string, string]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          {
            description: payload[1],
          },
        ];
        return getCommand({
          method: "hbacsvc_add",
          params: params,
        });
      },
    }),
    /**
     * Remove HBAC services
     * @param {string[]} services - HBAC service names
     */
    removeHbacServices: build.mutation<BatchRPCResponse, HBACService[]>({
      query: (services) => {
        const servicesToDeletePayload: Command[] = [];
        services.map((service) => {
          const payloadItem = {
            method: "hbacsvc_del",
            params: [[service.cn], {}],
          } as Command;
          servicesToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(servicesToDeletePayload, API_VERSION_BACKUP);
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

export const useGettingHbacServicesQuery = (payloadData) => {
  payloadData["objName"] = "hbacsvc";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useAddHbacRuleMutation,
  useRemoveHbacRulesMutation,
  useGetHbacRulesInfoByNameQuery,
  useAddToHbacRulesMutation,
  useRemoveFromHbacRulesMutation,
  useDisableHbacRuleMutation,
  useEnableHbacRuleMutation,
  useAddHbacServiceMutation,
  useRemoveHbacServicesMutation,
} = extendedApi;
