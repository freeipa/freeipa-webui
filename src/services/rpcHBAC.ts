import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToHBACRule } from "src/utils/hbacRulesUtils";
import { apiToHBACService } from "src/utils/hbacServicesUtils";
import { apiToHBACServiceGroup } from "src/utils/hbacServiceGrpUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import {
  HBACRule,
  HBACService,
  HBACServiceGroup,
} from "../utils/datatypes/globalDataTypes";

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
 * - getHbacRuleFullData
 * -
 *
 * API commands:
 * - hbacrule_mod: https://freeipa.readthedocs.io/en/latest/api/hbacrule_mod.html
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
 * - hbacsvcgroup_add: https://freeipa.readthedocs.io/en/latest/api/hbacsvcgroup_add.html
 * - hbacsvcgroup_del: https://freeipa.readthedocs.io/en/latest/api/hbacsvcgroup_del.html
 * - hbacsvcgroup_mod: https://freeipa.readthedocs.io/en/latest/api/hbacsvcgroup_mod.html
 * - hbacsvcgroup_show: https://freeipa.readthedocs.io/en/latest/api/hbacsvcgroup_show.html
 */

export type RuleFullData = {
  rule?: Partial<HBACRule>;
};

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

export type ServiceFullData = {
  service?: Partial<HBACService>;
};

// Selecting allow any/all requires removing old members first
export interface AllowAllPayload {
  groupName: string;
  version?: string;
  // User category
  users: string[];
  groups: string[];
  // Host category
  hosts: string[];
  hostgroups: string[];
  // Service category
  services: string[];
  servicegroups: string[];
  external: string[];
  modifiedValues: Partial<HBACRule>;
}

export type SvcGroupFullData = {
  svcGrp?: Partial<HBACServiceGroup>;
};

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
    getHbacRuleFullData: build.query<RuleFullData, string>({
      query: (ruleId) => {
        // Prepare search parameters
        const rule_params = {
          all: true,
          rights: true,
        };

        const ruleShowCommand: Command = {
          method: "hbacrule_show",
          params: [[ruleId], rule_params],
        };

        const batchPayload: Command[] = [ruleShowCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): RuleFullData => {
        const [rulesResponse] = response.result.results;

        // Initialize group data (to prevent 'undefined' values)
        const groupData = rulesResponse.result;
        let groupObject = {};
        if (!rulesResponse.error) {
          groupObject = apiToHBACRule(groupData);
        }

        return {
          rule: groupObject,
        };
      },
      providesTags: ["FullHBACRule"],
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
     *    Available types:
     *        user | group |
     *        host | hostgroup |
     *        hbacsrc | hbacsvcgroup |
     *        sourcehost
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
        if (memberType === "user" || memberType === "group") {
          methodType = "hbacrule_add_user";
        } else if (memberType === "host" || memberType === "hostgroup") {
          methodType = "hbacrule_add_host";
        } else if (memberType === "hbacsvc" || memberType === "hbacsvcgroup") {
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
     * Add entity to HBAC rule
     * @param {string} toId - ID of the HBAC rule
     * @param {string} type - Type of the entity
     *    Available types:
     *        user | group |
     *        host | hostgroup |
     *        hbacsrc | hbacsvcgroup |
     *        sourcehost
     * @param {string[]} listOfMembers - List of members to add to the HBAC rule
     * @param {boolean} unsetCategory - set the category from "all" to ""
     */
    addMembersToHbacRule: build.mutation<
      BatchRPCResponse,
      [string, string, string[], boolean]
    >({
      query: (payload) => {
        const actions: Command[] = [];
        const id = payload[0];
        const memberType = payload[1];
        const members = payload[2];
        const unsetCategory = payload[3];
        let methodType = "";
        let catAttr = "";

        if (memberType === "user" || memberType === "group") {
          methodType = "hbacrule_add_user";
          catAttr = "usercategory";
        } else if (memberType === "host" || memberType === "hostgroup") {
          methodType = "hbacrule_add_host";
          catAttr = "hostcategory";
        } else if (memberType === "hbacsvc" || memberType === "hbacsvcgroup") {
          methodType = "hbacrule_add_service";
          catAttr = "servicecategory";
        } else if (memberType === "sourcehost") {
          methodType = "hbacrule_add_sourcehost";
          catAttr = "sourcehostcategory";
        }

        if (unsetCategory) {
          actions.push({
            method: "hbacrule_mod",
            params: [[id], { [catAttr]: "" }],
          } as Command);
        }
        actions.push({
          method: methodType,
          params: [[id], { [memberType]: members }],
        } as Command);

        return getBatchCommand(actions, API_VERSION_BACKUP);
      },
    }),
    /**
     * Remove entity from HBAC rule
     * @param {string} toId - ID of the HBAC rule
     * @param {string} type - Type of the entity
     *    Available types:
     *        user | group |
     *        host | hostgroup |
     *        hbacsrc | hbacsvcgroup |
     *        sourcehost
     * @param {string[]} listOfMembers - List of members to remove
     */
    removeMembersFromHbacRule: build.mutation<
      FindRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const id = payload[0];
        const memberType = payload[1];
        const members = payload[2];

        let methodType = "";
        if (memberType === "user" || memberType === "group") {
          methodType = "hbacrule_remove_user";
        } else if (memberType === "host" || memberType === "hostgroup") {
          methodType = "hbacrule_remove_host";
        } else if (memberType === "hbacsvc" || memberType === "hbacsvcgroup") {
          methodType = "hbacrule_remove_service";
        } else if (memberType === "sourcehost") {
          methodType = "hbacrule_remove_sourcehost";
        }

        return getCommand({
          method: methodType,
          params: [[id], { [memberType]: members }],
        });
      },
    }),
    /**
     * Delete entity from HBAC rules
     * @param {string} memberId - ID of the entity to remove from HBAC rules
     * @param {string} memberType - Type of the entity
     *    Available types:
     *        user | group |
     *        host | hostgroup |
     *        hbacsvc | hbacsvcgroup |
     *        sourcehost
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
        if (memberType === "user" || memberType === "group") {
          methodType = "hbacrule_add_user";
        } else if (memberType === "host" || memberType === "hostgroup") {
          methodType = "hbacrule_add_host";
        } else if (memberType === "hbacsvc" || memberType === "hbacsvcgroup") {
          methodType = "hbacrule_add_service";
        } else if (memberType === "sourcehost") {
          methodType = "hbacrule_add_sourcehost";
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
    /*
     * Add HBAC service group
     * @param {string} name - ID of the entity to add to HBAC service groups
     * @param {string} description - description
     */
    addHbacServiceGroup: build.mutation<BatchRPCResponse, [string, string]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          {
            description: payload[1],
          },
        ];
        return getCommand({
          method: "hbacsvcgroup_add",
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
    /*
     * Remove HBAC service groups
     * @param {string[]} services - HBAC service group names
     */
    removeHbacServiceGroups: build.mutation<
      BatchRPCResponse,
      HBACServiceGroup[]
    >({
      query: (services) => {
        const servicesToDeletePayload: Command[] = [];
        services.map((service) => {
          const payloadItem = {
            method: "hbacsvcgroup_del",
            params: [[service.cn], {}],
          } as Command;
          servicesToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(servicesToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    saveHbacService: build.mutation<FindRPCResponse, Partial<HBACService>>({
      query: (service) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...service,
        };
        delete params["cn"];
        const cn = service.cn !== undefined ? service.cn : "";
        return getCommand({
          method: "hbacsvc_mod",
          params: [[cn], params],
        });
      },
      invalidatesTags: ["FullHBACService"],
    }),
    getHbacServiceFullData: build.query<ServiceFullData, string>({
      query: (srvId) => {
        // Prepare search parameters
        const rule_params = {
          all: true,
          rights: true,
        };
        const srvShowCommand: Command = {
          method: "hbacsvc_show",
          params: [[srvId], rule_params],
        };

        const batchPayload: Command[] = [srvShowCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): ServiceFullData => {
        const [srvResponse] = response.result.results;

        // Initialize service data (to prevent 'undefined' values)
        const serviceData = srvResponse.result;
        let serviceObject = {};
        if (!srvResponse.error) {
          serviceObject = apiToHBACService(serviceData);
        }

        return {
          service: serviceObject,
        };
      },
      providesTags: ["FullHBACService"],
    }),
    saveHbacRule: build.mutation<FindRPCResponse, Partial<HBACRule>>({
      query: (rule) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...rule,
        };
        delete params["cn"];
        const cn = rule.cn !== undefined ? rule.cn : "";
        return getCommand({
          method: "hbacrule_mod",
          params: [[cn], params],
        });
      },
      invalidatesTags: ["FullHBACRule"],
    }),
    /*
     * In order to set the user/host/service category to "all" all the previous
     * members must be removed first before setting the attribute
     */
    saveAndCleanHbacRule: build.mutation<FindRPCResponse, AllowAllPayload>({
      query: (payload) => {
        const actions: Command[] = [];

        // User category
        if (
          payload.modifiedValues.usercategory &&
          payload.modifiedValues.usercategory === "all"
        ) {
          const params = {
            version: payload.version || API_VERSION_BACKUP,
          };
          if (payload.users.length > 0) {
            params["user"] = payload.users;
          }
          if (payload.groups.length > 0) {
            params["group"] = payload.groups;
          }
          actions.push({
            method: "hbacrule_remove_user",
            params: [[payload.groupName], params],
          } as Command);
        }
        // Host category
        if (
          payload.modifiedValues.hostcategory &&
          payload.modifiedValues.hostcategory === "all"
        ) {
          const params = {
            version: payload.version || API_VERSION_BACKUP,
          };
          if (payload.hosts.length > 0) {
            params["host"] = payload.hosts;
          }
          if (payload.hostgroups.length > 0) {
            params["hostgroup"] = payload.hostgroups;
          }
          actions.push({
            method: "hbacrule_remove_host",
            params: [[payload.groupName], params],
          } as Command);
        }
        // Service category
        if (
          payload.modifiedValues.servicecategory &&
          payload.modifiedValues.servicecategory === "all"
        ) {
          const params = {
            version: payload.version || API_VERSION_BACKUP,
          };
          if (payload.services.length > 0) {
            params["hbacsvc"] = payload.services;
          }
          if (payload.servicegroups.length > 0) {
            params["hbacsvcgroup"] = payload.servicegroups;
          }
          actions.push({
            method: "hbacrule_remove_service",
            params: [[payload.groupName], params],
          } as Command);
        }

        // Do the remaining mods
        const mod_params = {
          version: API_VERSION_BACKUP,
          ...payload.modifiedValues,
        };
        actions.push({
          method: "hbacrule_mod",
          params: [[payload.groupName], mod_params],
        } as Command);

        return getBatchCommand(actions, API_VERSION_BACKUP);
      },
    }),
    getHbacSvcGrpFullData: build.query<SvcGroupFullData, string>({
      query: (svcGrpId) => {
        // Prepare search parameters
        const rule_params = {
          all: true,
          rights: true,
        };
        const ruleShowCommand: Command = {
          method: "hbacsvcgroup_show",
          params: [[svcGrpId], rule_params],
        };

        const batchPayload: Command[] = [ruleShowCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): SvcGroupFullData => {
        const [rulesResponse] = response.result.results;

        // Initialize group data (to prevent 'undefined' values)
        const groupData = rulesResponse.result;
        let groupObject = {};
        if (!rulesResponse.error) {
          groupObject = apiToHBACServiceGroup(groupData);
        }

        return {
          svcGrp: groupObject,
        };
      },
      providesTags: ["FullHBACServiceGrp"],
    }),
    saveHbacServiceGroup: build.mutation<FindRPCResponse, Partial<HBACRule>>({
      query: (svcGrp) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...svcGrp,
        };
        delete params["cn"];
        const cn = svcGrp.cn !== undefined ? svcGrp.cn : "";
        return getCommand({
          method: "hbacsvcgroup_mod",
          params: [[cn], params],
        });
      },
      invalidatesTags: ["FullHBACServiceGrp"],
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

export const useGettingHbacServiceGroupQuery = (payloadData) => {
  payloadData["objName"] = "hbacsvcgroup";
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
  useAddHbacServiceGroupMutation,
  useRemoveHbacServiceGroupsMutation,
  useSaveHbacServiceMutation,
  useGetHbacServiceFullDataQuery,
  useGetHbacRuleFullDataQuery,
  useSaveHbacRuleMutation,
  useSaveAndCleanHbacRuleMutation,
  useRemoveMembersFromHbacRuleMutation,
  useAddMembersToHbacRuleMutation,
  useGetHbacSvcGrpFullDataQuery,
  useSaveHbacServiceGroupMutation,
} = extendedApi;
