// RTK Query
import {
  api,
  Command,
  getCommand,
  FindRPCResponse,
  useGettingGenericQuery,
  GenericPayload,
  BatchRPCResponse,
  getBatchCommand,
} from "./rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Utils
import { API_VERSION_BACKUP } from "../utils/utils";
// Data types
import {
  Automember,
  automemberType,
  groupType,
  AutomemberEntry,
} from "src/utils/datatypes/globalDataTypes";
import { apiToAutomember } from "src/utils/automemberUtils";

/**
 * Automember-related endpoints: automemberFind, automemberFindBasicInfo, defaultGroupShow,
 *      searchUserGroupRulesEntries, addToAutomember, deleteFromAutomember, changeDefaultGroup,
 *      searchHostGroupRulesEntries, automemberShow, saveAutomember, automemberAddCondition,
 *      automemberRemoveCondition
 *
 * API commands:
 * - automember_default_group_show: https://freeipa.readthedocs.io/en/latest/api/automember_default_group_show.html
 * - automember_find: https://freeipa.readthedocs.io/en/latest/api/automember_find.html
 * - automember_add: https://freeipa.readthedocs.io/en/latest/api/automember_add.htmls
 * - automember_del: https://freeipa.readthedocs.io/en/latest/api/automember_del.html
 * - automember_default_group_set: https://freeipa.readthedocs.io/en/latest/api/automember_default_group_set.html
 * - automember_show: https://freeipa.readthedocs.io/en/latest/api/automember_show.html
 * - automember_add_condition: https://freeipa.readthedocs.io/en/latest/api/automember_add_condition.html
 * - automember_remove_condition: https://freeipa.readthedocs.io/en/latest/api/automember_remove_condition.html
 * - automember_mod: https://freeipa.readthedocs.io/en/latest/api/automember_mod.html
 *
 */

export type AutomemberFullData = {
  automember?: Partial<Automember>;
};

export interface AutomemberShowPayload {
  automemberNamesList: string[];
  no_members: boolean | true;
  version: string;
}

export interface AddPayload {
  group: string;
  type: string;
}

export interface RemovePayload {
  groups: string[];
  type: string;
}

export interface ChangeDefaultPayload {
  defaultGroup: string;
  type: string;
}

export interface AutomemberShowPayload {
  automemberId: string;
  type: string;
}

export interface AutomemberModPayload {
  automemberId: string;
  type: string;
  description?: string;
}

export interface AddConditionPayload {
  automemberId: string;
  automemberType: string;
  conditionType: "inclusive" | "exclusive";
  key: string;
  automemberregex: string;
}

export interface Condition {
  key: string;
  automemberregex: string;
}
export interface RemoveConditionPayload {
  automemberId: string;
  automemberType: string;
  conditionType: "inclusive" | "exclusive";
  conditions: Condition[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Find automembers
     * @param string Type of automember to retrieve ("group" or "hostgroup")
     * @returns List of automember IDs
     */
    automemberFind: build.query<string[], string>({
      query: (automemberType) => {
        const params = [
          [],
          { type: automemberType, version: API_VERSION_BACKUP },
        ];
        return getCommand({
          method: "automember_find",
          params: params,
        });
      },
      transformResponse: (response: FindRPCResponse): string[] => {
        const automembersResult = response.result
          .result as unknown as automemberType[];
        const automemberIdsList: string[] = [];
        automembersResult.map((automember) => {
          automemberIdsList.push(automember.cn.toString());
        });
        return automemberIdsList;
      },
    }),
    /**
     * Find automembers basic information (cn and description) and returns it as 'AutomemberEntry' data type
     * @param string Type of automember to retrieve ("group" or "hostgroup")
     * @returns List of automembers ('AutomemberEntry')
     */
    automemberFindBasicInfo: build.query<AutomemberEntry[], string>({
      query: (automemberType) => {
        const params = [
          [],
          { type: automemberType, version: API_VERSION_BACKUP },
        ];
        return getCommand({
          method: "automember_find",
          params: params,
        });
      },
      transformResponse: (response: FindRPCResponse): AutomemberEntry[] => {
        const automembersResult = response.result
          .result as unknown as automemberType[];
        const automembersList: AutomemberEntry[] = [];
        automembersResult.map((automember) => {
          const entryInfo: AutomemberEntry = {
            automemberRule: automember.cn.toString(),
            description: automember.description
              ? automember.description[0]
              : "",
          };
          automembersList.push(entryInfo);
        });
        return automembersList;
      },
    }),
    /**
     * Get default group for automember
     * @param string Type of automember to retrieve ("group" or "hostgroup")
     * @returns List of default groups
     */
    defaultGroupShow: build.query<string, string>({
      query: (automemberType) => {
        const params = [
          [],
          { type: automemberType, version: API_VERSION_BACKUP },
        ];
        return getCommand({
          method: "automember_default_group_show",
          params: params,
        });
      },
      transformResponse: (response: FindRPCResponse): string => {
        return response.result.result.automemberdefaultgroup as string;
      },
    }),
    /**
     * Find automembers and groups.
     * Combines the data to build the 'AutomemberEntry' data type
     * @param GenericPayload
     * @returns List of automember entries with 'automemberRule' and 'description'
     *
     */
    searchUserGroupRulesEntries: build.mutation<
      AutomemberEntry[],
      GenericPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, startIdx, stopIdx } = payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        // FETCH AUTOMEMBER IDS DATA
        // Prepare search parameters
        const automembersParams = {
          type: "group",
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataAutomembers: Command = {
          method: "automember_find",
          params: [[searchValue], automembersParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultAutomember = await fetchWithBQ(
          getCommand(payloadDataAutomembers)
        );
        // Return possible errors
        if (getResultAutomember.error) {
          return { error: getResultAutomember.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataAutomember =
          getResultAutomember.data as FindRPCResponse;

        const automemberIds: string[] = [];
        const automembersItemsCount = responseDataAutomember.result.result
          .length as number;

        for (let i = startIdx; i < automembersItemsCount && i < stopIdx; i++) {
          const automemberId = responseDataAutomember.result.result[
            i
          ] as automemberType;
          const { cn } = automemberId;
          automemberIds.push(cn[0] as string);
        }

        // FETCH USER GROUPS DATA
        // Prepare search parameters
        const groupParams = {
          version: apiVersion,
        };

        const payloadDataGroups: Command = {
          method: "group_find",
          params: [[searchValue], groupParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultGroup = await fetchWithBQ(getCommand(payloadDataGroups));
        // Return possible errors
        if (getResultGroup.error) {
          return { error: getResultGroup.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataGroup = getResultGroup.data as FindRPCResponse;
        const groupsItemsCount = responseDataGroup.result.result
          .length as number;

        // COMBINE RESULTS AND RETURN
        const fullAutomemberIdsList: AutomemberEntry[] = [];
        for (let i = 0; i < groupsItemsCount && i < stopIdx; i++) {
          for (let j = 0; j < automemberIds.length; j++) {
            const groupId = responseDataGroup.result.result[i] as groupType;
            if (groupId.cn[0] === automemberIds[j]) {
              fullAutomemberIdsList.push({
                automemberRule: groupId.cn[0] as string,
                description: groupId.description
                  ? (groupId.description[0] as string)
                  : "",
              });
            }
          }
        }

        // Return results
        return { data: fullAutomemberIdsList };
      },
    }),
    /**
     * Adds group to automember
     * @param AddPayload
     * @returns FindRPCResponse
     */
    addToAutomember: build.mutation<FindRPCResponse, AddPayload>({
      query: (payload) => {
        const params = [[payload.group], { type: payload.type }];
        return getCommand({
          method: "automember_add",
          params: params,
        });
      },
    }),
    /**
     * Removes groups from automember
     * @param RemovePayload
     * @returns BatchRPCResponse
     */
    deleteFromAutomember: build.mutation<BatchRPCResponse, RemovePayload>({
      query: (payload) => {
        const rulesToDelete = payload.groups;
        const params = [rulesToDelete, { type: payload.type }];

        const batchParams = {
          method: "automember_del",
          params: params,
        };

        return getBatchCommand([batchParams], API_VERSION_BACKUP);
      },
    }),
    /**
     * Changes default group for automember
     * @param ChangeDefaultPayload
     * @returns FindRPCResponse
     */
    changeDefaultGroup: build.mutation<FindRPCResponse, ChangeDefaultPayload>({
      query: (payload) => {
        const params = [
          [],
          {
            type: payload.type,
            automemberdefaultgroup: payload.defaultGroup,
            version: API_VERSION_BACKUP,
          },
        ];
        return getCommand({
          method: "automember_default_group_set",
          params: params,
        });
      },
    }),
    /**
     * Find automembers and groups.
     * Combines the data to build the 'AutomemberEntry' data type
     * @param GenericPayload
     * @returns List of automember entries with 'automemberRule' and 'description'
     *
     */
    searchHostGroupRulesEntries: build.mutation<
      AutomemberEntry[],
      GenericPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, startIdx, stopIdx } = payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        // FETCH AUTOMEMBER IDS DATA
        // Prepare search parameters
        const automembersParams = {
          type: "hostgroup",
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataAutomembers: Command = {
          method: "automember_find",
          params: [[searchValue], automembersParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultAutomember = await fetchWithBQ(
          getCommand(payloadDataAutomembers)
        );
        // Return possible errors
        if (getResultAutomember.error) {
          return { error: getResultAutomember.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataAutomember =
          getResultAutomember.data as FindRPCResponse;

        const automemberIds: string[] = [];
        const automembersItemsCount = responseDataAutomember.result.result
          .length as number;

        for (let i = startIdx; i < automembersItemsCount && i < stopIdx; i++) {
          const automemberId = responseDataAutomember.result.result[
            i
          ] as automemberType;
          const { cn } = automemberId;
          automemberIds.push(cn[0] as string);
        }

        // FETCH USER GROUPS DATA
        // Prepare search parameters
        const groupParams = {
          version: apiVersion,
        };

        const payloadDataGroups: Command = {
          method: "hostgroup_find",
          params: [[searchValue], groupParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultGroup = await fetchWithBQ(getCommand(payloadDataGroups));
        // Return possible errors
        if (getResultGroup.error) {
          return { error: getResultGroup.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataGroup = getResultGroup.data as FindRPCResponse;
        const groupsItemsCount = responseDataGroup.result.result
          .length as number;

        // COMBINE RESULTS AND RETURN
        const fullAutomemberIdsList: AutomemberEntry[] = [];
        for (let i = 0; i < groupsItemsCount && i < stopIdx; i++) {
          for (let j = 0; j < automemberIds.length; j++) {
            const groupId = responseDataGroup.result.result[i] as groupType;
            if (groupId.cn[0] === automemberIds[j]) {
              fullAutomemberIdsList.push({
                automemberRule: groupId.cn[0] as string,
                description: groupId.description
                  ? (groupId.description[0] as string)
                  : "",
              });
            }
          }
        }

        // Return results
        return { data: fullAutomemberIdsList };
      },
    }),
    /**
     * Given an automember ID, retrieves the full automember data
     * @param AutomemberShowPayload
     * @returns FindRPCResponse
     */
    automemberShow: build.query<Automember, AutomemberShowPayload>({
      query: (payload) => {
        const params = [
          [payload.automemberId],
          { all: true, type: payload.type },
        ];
        return getCommand({
          method: "automember_show",
          params: params,
        });
      },
      transformResponse: (response: FindRPCResponse): Automember => {
        // Initialize automember data (to prevent 'undefined' values)
        const automemberData = response.result.result;
        let automemberObject = {};
        if (!response.error) {
          automemberObject = apiToAutomember(automemberData);
        }
        return automemberObject as Automember;
      },
    }),
    /**
     * Save automember data
     * @param AutomemberModPayload
     * @returns FindRPCResponse
     */
    saveAutomember: build.mutation<FindRPCResponse, AutomemberModPayload>({
      query: (payload) => {
        const paramProps = { all: true, type: payload.type };
        if (payload.description !== undefined) {
          paramProps["description"] = payload.description;
        }

        const params = [[payload.automemberId], paramProps];
        return getCommand({
          method: "automember_mod",
          params: params,
        });
      },
    }),
    /**
     * Add automember attribute to rule (e.g. employeeType=staff)
     * @param AddConditionPayload
     * @returns FindRPCResponse
     */
    automemberAddCondition: build.mutation<
      FindRPCResponse,
      AddConditionPayload
    >({
      query: (payload) => {
        const paramProps = {
          key: payload.key,
          type: payload.automemberType,
        };

        if (payload.conditionType === "exclusive") {
          paramProps["automemberexclusiveregex"] = payload.automemberregex;
        } else {
          paramProps["automemberinclusiveregex"] = payload.automemberregex;
        }

        const params = [[payload.automemberId], paramProps];
        return getCommand({
          method: "automember_add_condition",
          params: params,
        });
      },
    }),
    /**
     * Remove automember attribute from rule (e.g. employeeType=staff)
     * @param AddConditionPayload
     * @returns BatchRPCResponse
     */
    automemberRemoveCondition: build.mutation<
      BatchRPCResponse,
      RemoveConditionPayload
    >({
      query: (payload) => {
        const batch = payload.conditions.map((item) => {
          const subparams = {
            key: item.key,
            type: payload.automemberType,
          };

          if (payload.conditionType === "exclusive") {
            subparams["automemberexclusiveregex"] = item.automemberregex;
          } else {
            subparams["automemberinclusiveregex"] = item.automemberregex;
          }

          const batchParams = {
            method: "automember_remove_condition",
            params: [[payload.automemberId], subparams],
          };
          return batchParams;
        });

        return getBatchCommand(batch, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingAutomembersQuery = (payloadData) => {
  payloadData["objName"] = "automember";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useAutomemberFindQuery,
  useDefaultGroupShowQuery,
  useSearchUserGroupRulesEntriesMutation,
  useAutomemberFindBasicInfoQuery,
  useAddToAutomemberMutation,
  useDeleteFromAutomemberMutation,
  useChangeDefaultGroupMutation,
  useSearchHostGroupRulesEntriesMutation,
  useAutomemberShowQuery,
  useSaveAutomemberMutation,
  useAutomemberAddConditionMutation,
  useAutomemberRemoveConditionMutation,
} = extendedApi;
