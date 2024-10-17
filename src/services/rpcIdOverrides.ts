import {
  api,
  Command,
  getCommand,
  getBatchCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import {
  apiToOverrideUser,
  apiToOverrideGroup,
} from "src/utils/idOverrideUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
// Data types
import {
  IDViewOverrideUser,
  IDViewOverrideGroup,
} from "src/utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

/**
 * ID override-related endpoints:
 * getIDViewsFullData, getIDViewInfoByName, addIDView, removeIDViews, saveIDVIew,
 * unapplyHosts, unapplyHostgroups
 *
 * API commands:
 * - idoverrideuser_add: https://freeipa.readthedocs.io/en/latest/api/idoverrideuser_add.html
 * - idoverrideuser_del: https://freeipa.readthedocs.io/en/latest/api/idoverrideuser_del.html
 * - idoverrideuser_find: https://freeipa.readthedocs.io/en/latest/api/idoverrideuser_find.html
 * - idoverrideuser_show: https://freeipa.readthedocs.io/en/latest/api/idoverrideuser_show.html
 * - idoverrideuser_mod: https://freeipa.readthedocs.io/en/latest/api/idoverrideuser_mod.html
 * - idoverridegroup_add: https://freeipa.readthedocs.io/en/latest/api/idoverridegroup_add.html
 * - idoverridegroup_del: https://freeipa.readthedocs.io/en/latest/api/idoverridegroup_del.html
 * - idoverridegroup_find: https://freeipa.readthedocs.io/en/latest/api/idoverridegroup_find.html
 * - idoverridegroup_show: https://freeipa.readthedocs.io/en/latest/api/idoverridegroup_show.html
 * - idoverridegroup_mod: https://freeipa.readthedocs.io/en/latest/api/idoverridegroup_mod.html
 */

export interface ShowPayload {
  list: string[];
  version: string;
}

export interface AddUserPayload {
  idview: string;
  name: string;
  uid?: string;
  gecos?: string;
  uidnumber?: string;
  gidnumber?: string;
  loginshell?: string;
  homedirectory?: string;
  usercertificate?: string;
  ipasshpubkey?: string;
  description?: string;
  version?: string;
}

export interface AddGroupPayload {
  idview: string;
  group: string;
  groupName?: string;
  gidnumber?: string;
  description?: string;
  version?: string;
}

export type OverrideFullData = {
  user?: Partial<IDViewOverrideUser>;
  group?: Partial<IDViewOverrideGroup>;
};

export type ModPayload = {
  idview: string;
  user?: Partial<IDViewOverrideUser>;
  group?: Partial<IDViewOverrideGroup>;
};

export type DelUserPayload = {
  idview: string;
  users: string[];
};

export type DelGroupPayload = {
  idview: string;
  groups: string[];
};

export interface IDOverridePayload {
  entryType: "idoverrideuser" | "idoverridegroup";
  idView: string;
  searchValue: string;
  sizeLimit: number;
  startIdx: number;
  stopIdx: number;
}

interface OverrideType {
  dn: string;
  ipaanchoruuid: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getIDOverrideUserFullData: build.query<OverrideFullData, string>({
      query: (name) => {
        const showCommand: Command = {
          method: "idoverrideuser_show",
          params: [[name], { all: true, rights: true }],
        };
        const batchPayload: Command[] = [showCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): OverrideFullData => {
        const [overrideResponse] = response.result.results;

        // Initialize data (to prevent 'undefined' values)
        const overrideData = overrideResponse.result;
        let overrideObject = {};
        if (!overrideResponse.error) {
          overrideObject = apiToOverrideUser(overrideData);
        }

        return {
          user: overrideObject,
        };
      },
      providesTags: ["FullOverrideUser"],
    }),
    getIDOverrideGroupFullData: build.query<OverrideFullData, string[]>({
      query: (name) => {
        const showCommand: Command = {
          method: "idoverridegroup_show",
          params: [[name], { all: true, rights: true }],
        };
        const batchPayload: Command[] = [showCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): OverrideFullData => {
        const [overrideResponse] = response.result.results;

        // Initialize data (to prevent 'undefined' values)
        const overrideData = overrideResponse.result;
        let overrideObject = {};
        if (!overrideResponse.error) {
          overrideObject = apiToOverrideGroup(overrideData);
        }

        return {
          group: overrideObject,
        };
      },
      providesTags: ["FullOverrideGroup"],
    }),
    /**
     * Add an ID override user
     * @param {object} AddUserPayload - ID overrdie payload parameters
     * @param AddUserPayload.idview - The name of the ID view
     * @param AddUserPayload.name - The name of the user override
     * @param AddUserPayload.uid
     * @param AddUserPayload.gecos
     * @param AddUserPayload.uidnumber
     * @param AddUserPayload.gidnumber
     * @param AddUserPayload.loginshell
     * @param AddUserPayload.homedirectory
     * @param AddUserPayload.usercertificate
     * @param AddUserPayload.ipasshpubkey
     * @param AddUserPayload.version
     * @param AddUserPayload.description
     * @param AddUserPayload.version - The api version
     */
    addIDOverrideUser: build.mutation<FindRPCResponse, AddUserPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["idview"], payloadData["name"]],
          {
            version: payloadData.version || API_VERSION_BACKUP,
          },
        ];
        if ("description" in payloadData && payloadData["description"] !== "") {
          params[1]["description"] = payloadData["description"];
        }
        if (
          "ipasshpubkey" in payloadData &&
          payloadData["ipasshpubkey"] !== ""
        ) {
          params[1]["ipasshpubkey"] = payloadData["ipasshpubkey"];
        }
        if (
          "usercertificate" in payloadData &&
          payloadData["usercertificate"] !== ""
        ) {
          params[1]["usercertificate"] = payloadData["usercertificate"];
        }
        if (
          "homedirectory" in payloadData &&
          payloadData["homedirectory"] !== ""
        ) {
          params[1]["homedirectory"] = payloadData["homedirectory"];
        }
        if ("loginshell" in payloadData && payloadData["loginshell"] !== "") {
          params[1]["loginshell"] = payloadData["loginshell"];
        }
        if ("gidnumber" in payloadData && payloadData["gidnumber"] !== "") {
          params[1]["gidnumber"] = payloadData["gidnumber"];
        }
        if ("uidnumber" in payloadData && payloadData["uidnumber"] !== "") {
          params[1]["uidnumber"] = payloadData["uidnumber"];
        }
        if ("gecos" in payloadData && payloadData["gecos"] !== "") {
          params[1]["gecos"] = payloadData["gecos"];
        }
        if ("uid" in payloadData && payloadData["uid"] !== "") {
          params[1]["uid"] = payloadData["uid"];
        }

        return getCommand({
          method: "idoverrideuser_add",
          params: params,
        });
      },
    }),
    /**
     * Add an ID override group
     * @param {object} AddGroupPayload - ID override payload parameters
     * @param AddUserPayload.idview - The name of the ID view
     * @param AddUserPayload.group - The name of the group to override
     * @param AddUserPayload.groupName - The name of this override group
     * @param AddUserPayload.gidnumber
     * @param AddUserPayload.description
     * @param AddUserPayload.version - The api version
     */
    addIDOverrideGroup: build.mutation<FindRPCResponse, AddGroupPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["idview"], payloadData["group"]],
          {
            version: payloadData.version || API_VERSION_BACKUP,
          },
        ];
        if ("groupName" in payloadData && payloadData["groupName"] !== "") {
          params[1]["cn"] = payloadData["groupName"];
        }
        if ("description" in payloadData && payloadData["description"] !== "") {
          params[1]["description"] = payloadData["description"];
        }
        if ("gidnumber" in payloadData && payloadData["gidnumber"] !== "") {
          params[1]["gidnumber"] = payloadData["gidnumber"];
        }

        return getCommand({
          method: "idoverridegroup_add",
          params: params,
        });
      },
    }),
    /**
     * Remove ID override users
     * @param {IDViewOverrideUser[]} - List of user overrides to remove
     */
    removeIDOverrideUsers: build.mutation<BatchRPCResponse, DelUserPayload>({
      query: (payload) => {
        const usersToDeletePayload: Command[] = [];
        payload.users.map((user) => {
          const payloadItem = {
            method: "idoverrideuser_del",
            params: [[payload.idview, user], {}],
          } as Command;
          usersToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(usersToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    /**
     * Remove ID override groups
     * @param {IDViewOverrideUser[]} - List of group overrides to remove
     */
    removeIDOverrideGroups: build.mutation<BatchRPCResponse, DelGroupPayload>({
      query: (payload) => {
        const groupsToDeletePayload: Command[] = [];
        payload.groups.map((group) => {
          const payloadItem = {
            method: "idoverridegroup_del",
            params: [[payload.idview, group], {}],
          } as Command;
          groupsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(groupsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    /**
     * Given a list of user names, show the full data of those users
     * @param {string[]} groupNames - List of user names
     * @param {boolean} noMembers - Whether to show members or not
     * @returns {BatchRPCResponse} - Batch response
     */
    getIDOverrideUsersInfoByName: build.query<
      IDViewOverrideUser[],
      ShowPayload
    >({
      query: (payload) => {
        const names = payload.list;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const viewShowCommands: Command[] = names.map((groupName) => ({
          method: "idoverrideuser_show",
          params: [[groupName], {}],
        }));
        return getBatchCommand(viewShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): IDViewOverrideUser[] => {
        const list: IDViewOverrideUser[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const data = apiToOverrideUser(results[i].result);
          list.push(data);
        }
        return list;
      },
    }),
    /**
     * Given a list of group names, show the full data of those groups
     * @param {string[]} groupNames - List of group names
     * @param {boolean} noMembers - Whether to show members or not
     * @returns {BatchRPCResponse} - Batch response
     */
    getIDOverrideGroupsInfoByName: build.query<
      IDViewOverrideGroup[],
      ShowPayload
    >({
      query: (payload) => {
        const names = payload.list;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const viewShowCommands: Command[] = names.map((groupName) => ({
          method: "idoverridegroupshow",
          params: [[groupName], {}],
        }));
        return getBatchCommand(viewShowCommands, apiVersion);
      },
      transformResponse: (
        response: BatchRPCResponse
      ): IDViewOverrideGroup[] => {
        const list: IDViewOverrideGroup[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const data = apiToOverrideGroup(results[i].result);
          list.push(data);
        }
        return list;
      },
    }),
    saveIDOverrideUser: build.mutation<FindRPCResponse, ModPayload>({
      query: (payload) => {
        const user = payload["user"] ? payload["user"] : "";
        const params = {
          version: API_VERSION_BACKUP,
          ...user,
        };
        const id = user["ipaanchoruuid"];
        return getCommand({
          method: "idoverrideuser_mod",
          params: [[payload["idview"], id], params],
        });
      },
      invalidatesTags: ["FullOverrideUser"],
    }),
    saveIDOverrideGroup: build.mutation<FindRPCResponse, ModPayload>({
      query: (payload) => {
        const group = payload["group"] ? payload["group"] : {};
        const params = {
          version: API_VERSION_BACKUP,
          ...group,
        };

        const id = group["ipaanchoruuid"];
        return getCommand({
          method: "idoverridegroup_mod",
          params: [[payload["idview"], id], params],
        });
      },
      invalidatesTags: ["FullOverrideGroup"],
    }),
    gettingIDOverrideUsers: build.query<IDViewOverrideUser[], string>({
      query: (idview) => {
        const findCmd: Command = {
          method: "idoverrideuser_find",
          params: [[idview], { version: API_VERSION_BACKUP }],
        };
        return getCommand(findCmd);
      },
      transformResponse: (response: FindRPCResponse): IDViewOverrideUser[] =>
        response.result.result as unknown as IDViewOverrideUser[],
    }),
    gettingIDOverrideGroups: build.query<IDViewOverrideGroup[], string>({
      query: (idview) => {
        const findCmd: Command = {
          method: "idoverridegroup_find",
          params: [[idview], { version: API_VERSION_BACKUP }],
        };
        return getCommand(findCmd);
      },
      transformResponse: (response: FindRPCResponse): IDViewOverrideGroup[] =>
        response.result.result as unknown as IDViewOverrideGroup[],
    }),
    // Refresh entries by search value (mutation instead of query)
    searchOverrideEntries: build.mutation<BatchRPCResponse, IDOverridePayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { idView, searchValue, sizeLimit, startIdx, stopIdx, entryType } =
          payloadData;

        // Prepare search parameters
        const params = {
          sizelimit: sizeLimit,
          version: API_VERSION_BACKUP,
          all: true,
        };

        // Prepare payload
        const payloadDataIds: Command = {
          method: entryType + "_find",
          params: [[idView, searchValue], params],
        };

        // Make call using 'fetchWithBQ'
        const getGroupIDsResult = await fetchWithBQ(getCommand(payloadDataIds));
        // Return possible errors
        if (getGroupIDsResult.error) {
          return { error: getGroupIDsResult.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseData = getGroupIDsResult.data as FindRPCResponse;
        const ids: string[] = [];
        const itemsCount = responseData.result.result.length as number;
        for (let i = startIdx; i < itemsCount && i < stopIdx; i++) {
          const overrideId = responseData.result.result[i] as OverrideType;
          const { ipaanchoruuid } = overrideId;

          ids.push(ipaanchoruuid[0] as string);
        }

        // 2ND CALL - GET PARTIAL INFO
        // Prepare payload
        let payloadDataBatch: Command[] = [];
        payloadDataBatch = ids.map((id) => ({
          method: entryType + "_show",
          params: [[idView, id], {}],
        }));

        // Make call using 'fetchWithBQ'
        const partialInfoResult = await fetchWithBQ(
          getBatchCommand(payloadDataBatch as Command[], API_VERSION_BACKUP)
        );

        const response = partialInfoResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = itemsCount;
        }

        // Return results
        return response
          ? { data: response }
          : {
              error: partialInfoResult.error as unknown as FetchBaseQueryError,
            };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddIDOverrideGroupMutation,
  useAddIDOverrideUserMutation,
  useRemoveIDOverrideGroupsMutation,
  useRemoveIDOverrideUsersMutation,
  useGetIDOverrideUsersInfoByNameQuery,
  useGetIDOverrideGroupsInfoByNameQuery,
  useGetIDOverrideUserFullDataQuery,
  useGetIDOverrideGroupFullDataQuery,
  useSaveIDOverrideUserMutation,
  useSaveIDOverrideGroupMutation,
  useGettingIDOverrideUsersQuery,
  useGettingIDOverrideGroupsQuery,
  useSearchOverrideEntriesMutation,
} = extendedApi;
