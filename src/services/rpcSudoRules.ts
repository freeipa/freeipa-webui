import {
  api,
  Command,
  getCommand,
  getBatchCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToSudoRule } from "src/utils/sudoRulesUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SudoRule } from "../utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Sudo rules-related endpoints: getSudoRulesInfoByName, addToSudoRules, removeFromSudoRules,
 *   disableSudoRule, enableSudoRule
 *
 * API commands:
 * - sudorule_show: https://freeipa.readthedocs.io/en/latest/api/sudorule_show.html
 * - sudorule_add_user: https://freeipa.readthedocs.io/en/latest/api/sudorule_add_user.html
 * - sudorule_add_host: https://freeipa.readthedocs.io/en/latest/api/sudorule_add_host.html
 * - sudorule_add_option: https://freeipa.readthedocs.io/en/latest/api/sudorule_add_option.html
 * - sudorule_remove_user: https://freeipa.readthedocs.io/en/latest/api/sudorule_remove_user.html
 * - sudorule_remove_host: https://freeipa.readthedocs.io/en/latest/api/sudorule_remove_host.html
 * - sudorule_remove_option: https://freeipa.readthedocs.io/en/latest/api/sudorule_remove_option.html
 * - sudorule_disable: https://freeipa.readthedocs.io/en/latest/api/sudorule_disable.html
 * - sudorule_enable: https://freeipa.readthedocs.io/en/latest/api/sudorule_enable.html
 */

export type RuleFullData = {
  rule?: Partial<SudoRule>;
};

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

export interface AddOptionPayload {
  option: string;
  toSudoRule: string;
}

export interface RemoveOptionsPayload {
  options: string[];
  fromSudoRule: string;
}

export interface AddRemoveToSudoRulesPayload {
  toId: string;
  type: string;
  listOfMembers: string[];
}

export interface AddRemoveToSudoRulesResult {
  completed: number;
  error: Record<string, unknown> | null;
  failed: {
    memberuser: {
      group: string[];
      user: string[];
    };
  };
  result: {
    cn: string;
    dn: string;
    externaluser: string[];
    ipaenabledflag: boolean;
    memberuser_user: string[];
    memberuser_group: string[];
    sudoorder: number;
  };
}

export interface AddRemoveHostToSudoRulesResult {
  completed: number;
  error: Record<string, unknown> | null;
  failed: {
    memberhost: {
      host: string[];
      hostgroup: string[];
    };
  };
  result: {
    cn: string;
    dn: string;
    externalhost: string[];
    ipaenabledflag: boolean;
    memberhost_host: string[];
    memberhost_hostgroup: string[];
    sudoorder: number;
  };
}

export interface AddRemoveCommandToSudoRulesResult {
  completed: number;
  error: Record<string, unknown> | null;
  failed: {
    memberallowcmd: {
      sudocmd: string[];
      sudocmdgroup: string[];
    };
    memberdenycmd: {
      sudocmd: string[];
      sudocmdgroup: string[];
    };
  };
  result: {
    cn: string;
    dn: string;
    ipaenabledflag: boolean;
    memberallowcmd_sudocmd: string[];
    memberallowcmd_sudocmdgroup: string[];
    memberdenycmd_sudocmd: string[];
    memberdenycmd_sudocmdgroup: string[];
    sudoorder: number;
  };
}

export interface BatchDeleteAllCommandsResult {
  completed: number;
  error: Record<string, unknown> | null;
  failed: {
    memberallowcmd: {
      sudocmd: string[];
      sudocmdgroup: string[];
    };
    memberdenycmd: {
      sudocmd: string[];
      sudocmdgroup: string[];
    };
  };
  result: {
    cn: string;
    dn: string;
    ipaenabledflag: boolean;
    cmdcategory: string;
    memberallowcmd_sudocmd: string[];
    memberallowcmd_sudocmdgroup: string[];
    memberdenycmd_sudocmd: string[];
    memberdenycmd_sudocmdgroup: string[];
  };
}

export interface BatchDeleteAllCommandsResponse {
  error: Record<string, unknown> | null;
  id: string | null;
  principal: string;
  result: {
    count: number;
    results: BatchDeleteAllCommandsResult[];
  };
}

export interface RemoveAllCommandsFromSudoRulesPayload {
  sudoRuleId: string;
  allowCommands: string[];
  denyCommands: string[];
  allowCommandGroups: string[];
  denyCommandGroups: string[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Add Sudo rule
     * @param {string} name - ID of the entity to add to sudo rules
     * @param {string} description - description
     */
    addSudoRule: build.mutation<BatchRPCResponse, [string, string]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          {
            description: payload[1],
          },
        ];
        return getCommand({
          method: "sudorule_add",
          params: params,
        });
      },
    }),
    /**
     * Remove Sudo rules
     * @param {string[]} names - Sudo rule names
     */
    removeSudoRules: build.mutation<BatchRPCResponse, SudoRule[]>({
      query: (rules) => {
        const groupsToDeletePayload: Command[] = [];
        rules.map((rule) => {
          const payloadItem = {
            method: "sudorule_del",
            params: [[rule.cn], {}],
          } as Command;
          groupsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(groupsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
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
        if (memberType === "user" || memberType === "group") {
          methodType = "sudorule_add_user";
        } else if (memberType === "host" || memberType === "hostgroup") {
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
        } else if (memberType === "host" || memberType === "hostgroup") {
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
    /**
     * Enable entity from Sudo rules
     * @param {SudoRule} Rule to enable from Sudo rules
     */
    enableSudoRule: build.mutation<FindRPCResponse, SudoRule>({
      query: (rule) => {
        const params = [
          [rule.cn],
          {
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "sudorule_enable",
          params: params,
        });
      },
    }),
    /**
     * Disable entity from Sudo rules
     * @param {SudoRule} Rule to disable from Sudo rules
     */
    disableSudoRule: build.mutation<FindRPCResponse, SudoRule>({
      query: (rule) => {
        const params = [
          [rule.cn],
          {
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "sudorule_disable",
          params: params,
        });
      },
    }),
    /**
     * Given a Sudo rule name, show the full data of that Sudo rule
     * @param {string} Sudo rule name/id/cn
     */
    getSudoRuleFullData: build.query<RuleFullData, string>({
      query: (ruleId) => {
        // Prepare search parameters
        const rule_params = {
          all: true,
          rights: true,
        };

        const ruleShowCommand: Command = {
          method: "sudorule_show",
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
          groupObject = apiToSudoRule(groupData);
        }

        return {
          rule: groupObject,
        };
      },
      providesTags: ["FullSudoRule"],
    }),
    /**
     * Save Sudo rule
     * @param {Partial<SudoRule>} - Sudo rule data
     */
    saveSudoRule: build.mutation<FindRPCResponse, Partial<SudoRule>>({
      query: (rule) => {
        const params = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
          ...rule,
        };
        delete params["cn"];
        const cn = rule.cn !== undefined ? rule.cn : "";
        return getCommand({
          method: "sudorule_mod",
          params: [[cn], params],
        });
      },
      invalidatesTags: ["FullSudoRule"],
    }),
    /**
     * Add a new Option to a Sudo rule
     * @param {AddOptionPayload} Option to add to Sudo rule and Sudo rule name
     */
    addOptionToSudoRule: build.mutation<FindRPCResponse, AddOptionPayload>({
      query: (payload) => {
        const option = payload.option;
        const toSudoRule = payload.toSudoRule;

        const params = [
          [toSudoRule],
          {
            ipasudoopt: option,
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "sudorule_add_option",
          params: params,
        });
      },
    }),
    /**
     * Remove Options from a given Sudo rule
     * @param {AddOptionPayload} Option to add to Sudo rule and Sudo rule name
     */
    removeOptionsFromSudoRule: build.mutation<
      BatchResponse,
      RemoveOptionsPayload
    >({
      query: (payload) => {
        const options = payload.options;
        const fromSudoRule = payload.fromSudoRule;

        const batchParams: Command[] = [];

        options.map((option) => {
          const chunk = {
            method: "sudorule_remove_option",
            params: [[fromSudoRule], { ipasudoopt: option }],
          };
          batchParams.push(chunk);
        });

        return getBatchCommand(batchParams, API_VERSION_BACKUP);
      },
    }),
    /**
     * Add user from sudo rule
     * @param {AddToSudoRulesPayload} Parameters to add to Sudo rule
     */
    addToSudoRule: build.mutation<BatchResponse, AddRemoveToSudoRulesPayload>({
      query: (payload) => {
        const toId = payload.toId;
        const type = payload.type; // Shoud be 'user' or 'group'
        const listOfMembers = payload.listOfMembers;

        const batchParams: Command[] = [];

        listOfMembers.map((option) => {
          const chunk = {
            method: "sudorule_add_user",
            params: [[toId], { [type]: option }],
          };
          batchParams.push(chunk);
        });

        return getBatchCommand(batchParams, API_VERSION_BACKUP);
      },
    }),
    /**
     * Remove user from sudo rule
     * @param {RemoveFromSudoRulesPayload} Parameters to remove from Sudo rule
     */
    removeFromSudoRule: build.mutation<
      FindRPCResponse,
      AddRemoveToSudoRulesPayload
    >({
      query: (payload) => {
        const toId = payload.toId;
        const type = payload.type; // Should be 'user'
        const listOfMembers = payload.listOfMembers;

        const params = [
          [toId],
          { [type]: listOfMembers, version: API_VERSION_BACKUP },
        ];

        return getCommand({
          method: "sudorule_remove_user",
          params: params,
        });
      },
    }),
    /**
     * Add host from sudo rule
     * @param {AddToSudoRulesPayload} Parameters to add to Sudo rule
     */
    addHostToSudoRule: build.mutation<
      BatchResponse,
      AddRemoveToSudoRulesPayload
    >({
      query: (payload) => {
        const toId = payload.toId;
        const type = payload.type; // Should be 'host' or 'hostgroup
        const listOfMembers = payload.listOfMembers;

        const batchParams: Command[] = [];

        listOfMembers.map((option) => {
          const chunk = {
            method: "sudorule_add_host",
            params: [[toId], { [type]: option }],
          };
          batchParams.push(chunk);
        });

        return getBatchCommand(batchParams, API_VERSION_BACKUP);
      },
    }),
    /**
     * Remove host from sudo rule
     * @param {RemoveFromSudoRulesPayload} Parameters to remove from Sudo rule
     */
    removeHostFromSudoRule: build.mutation<
      FindRPCResponse,
      AddRemoveToSudoRulesPayload
    >({
      query: (payload) => {
        const toId = payload.toId;
        const type = payload.type; // Should be 'host' or 'hostgroup
        const listOfMembers = payload.listOfMembers;

        const params = [
          [toId],
          { [type]: listOfMembers, version: API_VERSION_BACKUP },
        ];

        return getCommand({
          method: "sudorule_remove_host",
          params: params,
        });
      },
    }),
    /**
     * Add allow command from sudo rule
     * @param {AddToSudoRulesPayload} Parameters to add to Sudo rule
     */
    addAllowCommandToSudoRule: build.mutation<
      BatchResponse,
      AddRemoveToSudoRulesPayload
    >({
      query: (payload) => {
        const toId = payload.toId;
        const type = payload.type; // Should be 'sudocmd' or 'sudocmdgroup'
        const listOfMembers = payload.listOfMembers;

        const batchParams: Command[] = [];

        listOfMembers.map((option) => {
          const chunk = {
            method: "sudorule_add_allow_command",
            params: [[toId], { [type]: option }],
          };
          batchParams.push(chunk);
        });

        return getBatchCommand(batchParams, API_VERSION_BACKUP);
      },
    }),
    /**
     * Remove allow command from sudo rule
     * @param {RemoveFromSudoRulesPayload} Parameters to remove from Sudo rule
     */
    removeAllowCommandFromSudoRule: build.mutation<
      FindRPCResponse,
      AddRemoveToSudoRulesPayload
    >({
      query: (payload) => {
        const toId = payload.toId;
        const type = payload.type; // Should be 'sudocmd' or 'sudocmdgroup'
        const listOfMembers = payload.listOfMembers;

        let methodType = "";
        if (type === "sudocmd") {
          methodType = "sudorule_remove_allow_command";
        } else if (type === "sudocmdgroup") {
          methodType = "sudorule_remove_allow_command";
        }

        const params = [
          [toId],
          { [type]: listOfMembers, version: API_VERSION_BACKUP },
        ];

        return getCommand({
          method: methodType,
          params: params,
        });
      },
    }),
    /**
     * Add deny command from sudo rule
     * @param {AddToSudoRulesPayload} Parameters to add to Sudo rule
     */
    addDenyCommandToSudoRule: build.mutation<
      BatchResponse,
      AddRemoveToSudoRulesPayload
    >({
      query: (payload) => {
        const toId = payload.toId;
        const type = payload.type; // Should be 'sudocmd' or 'sudocmdgroup'
        const listOfMembers = payload.listOfMembers;

        let methodType = "";
        if (type === "sudocmd") {
          methodType = "sudorule_add_deny_command";
        } else if (type === "sudocmdgroup") {
          methodType = "sudorule_add_deny_command";
        }

        const batchParams: Command[] = [];

        listOfMembers.map((option) => {
          const chunk = {
            method: methodType,
            params: [[toId], { [type]: option }],
          };
          batchParams.push(chunk);
        });

        return getBatchCommand(batchParams, API_VERSION_BACKUP);
      },
    }),
    /**
     * Remove deny command from sudo rule
     * @param {RemoveFromSudoRulesPayload} Parameters to remove from Sudo rule
     */
    removeDenyCommandFromSudoRule: build.mutation<
      FindRPCResponse,
      AddRemoveToSudoRulesPayload
    >({
      query: (payload) => {
        const toId = payload.toId;
        const type = payload.type; // Should be 'sudocmd' or 'sudocmdgroup'
        const listOfMembers = payload.listOfMembers;

        let methodType = "";
        if (type === "sudocmd") {
          methodType = "sudorule_remove_deny_command";
        } else if (type === "sudocmdgroup") {
          methodType = "sudorule_remove_deny_command";
        }

        const params = [
          [toId],
          { [type]: listOfMembers, version: API_VERSION_BACKUP },
        ];

        return getCommand({
          method: methodType,
          params: params,
        });
      },
    }),
    /**
     * Remove all commands from sudo rule (allow, deny, commands, and command groups)
     * @param {RemoveFromSudoRulesPayload} Parameters to remove from Sudo rule
     */
    removeAllCommandsAndSaveFromSudoRule: build.mutation<
      BatchRPCResponse,
      RemoveAllCommandsFromSudoRulesPayload
    >({
      async queryFn(
        payloadData: RemoveAllCommandsFromSudoRulesPayload,
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        const {
          sudoRuleId,
          allowCommands,
          denyCommands,
          allowCommandGroups,
          denyCommandGroups,
        } = payloadData;

        // Commands
        const allowCommandsParams = [[sudoRuleId], { sudocmd: allowCommands }];

        const denyCommandsParams = [[sudoRuleId], { sudocmd: denyCommands }];

        // Command groups
        const allowCommandGroupsParams = [
          [sudoRuleId],
          { sudocmdgroup: allowCommandGroups },
        ];

        const denyCommandGroupsParams = [
          [sudoRuleId],
          { sudocmdgroup: denyCommandGroups },
        ];

        // Batch commands
        const batchPayload: Command[] = [
          {
            method: "sudorule_remove_allow_command",
            params: allowCommandsParams,
          },
          {
            method: "sudorule_remove_allow_command",
            params: allowCommandGroupsParams,
          },
          {
            method: "sudorule_remove_deny_command",
            params: denyCommandsParams,
          },
          {
            method: "sudorule_remove_deny_command",
            params: denyCommandGroupsParams,
          },
          {
            method: "sudorule_mod",
            params: [
              [sudoRuleId],
              { all: true, rights: true, cmdcategory: "all" },
            ],
          },
        ];

        // Execute batch commands
        const response = await fetchWithBQ(
          getBatchCommand(batchPayload, API_VERSION_BACKUP)
        );
        // Return possible errors
        if (response.error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "Failed to search for entries",
            } as FetchBaseQueryError,
          };
        }

        return {
          data: response.data as BatchRPCResponse,
        };
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
  useDisableSudoRuleMutation,
  useEnableSudoRuleMutation,
  useAddSudoRuleMutation,
  useRemoveSudoRulesMutation,
  useGetSudoRuleFullDataQuery,
  useSaveSudoRuleMutation,
  useAddOptionToSudoRuleMutation,
  useRemoveOptionsFromSudoRuleMutation,
  useAddToSudoRuleMutation,
  useRemoveFromSudoRuleMutation,
  useAddHostToSudoRuleMutation,
  useRemoveHostFromSudoRuleMutation,
  useAddAllowCommandToSudoRuleMutation,
  useRemoveAllowCommandFromSudoRuleMutation,
  useAddDenyCommandToSudoRuleMutation,
  useRemoveDenyCommandFromSudoRuleMutation,
  useRemoveAllCommandsAndSaveFromSudoRuleMutation,
} = extendedApi;
