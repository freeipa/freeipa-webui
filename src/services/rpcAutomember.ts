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

/**
 * Automember-related endpoints: defaultGroupShow
 *
 * API commands:
 * - automember_default_group_show: https://freeipa.readthedocs.io/en/latest/api/automember_default_group_show.html
 * - automember_find: https://freeipa.readthedocs.io/en/latest/api/automember_find.html
 * - automember_add: https://freeipa.readthedocs.io/en/latest/api/automember_add.html
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
} = extendedApi;
