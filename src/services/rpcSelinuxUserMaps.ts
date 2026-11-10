import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SELinuxUserMap } from "src/utils/datatypes/globalDataTypes";
import { apiToSelinuxUserMap } from "src/utils/selinuxUserMapUtils";

/**
 * SELinux user map-related endpoints
 *
 * API commands:
 * - selinuxusermap_find:    https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_find.html
 * - selinuxusermap_show:    https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_show.html
 * - selinuxusermap_add:     https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_add.html
 * - selinuxusermap_del:     https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_del.html
 * - selinuxusermap_enable:  https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_enable.html
 * - selinuxusermap_disable: https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_disable.html
 * - selinuxusermap_mod:     https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_mod.html
 * - selinuxusermap_add_user:    https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_add_user.html
 * - selinuxusermap_remove_user: https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_remove_user.html
 * - selinuxusermap_add_host:    https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_add_host.html
 * - selinuxusermap_remove_host: https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_remove_host.html
 */

interface SelinuxUserMapsFullDataPayload {
  searchValue: string;
  apiVersion?: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

interface FindSelinuxUserMapArgs {
  cn: string[];
}

export interface SelinuxUserMapAddPayload {
  cn: string;
  ipaselinuxuser: string;
}

export type SelinuxUserMapFullData = {
  selinuxUserMap?: Partial<SELinuxUserMap>;
};

export interface AllowAllPayload {
  groupName: string;
  version?: string;
  users: string[];
  groups: string[];
  hosts: string[];
  hostgroups: string[];
  modifiedValues: Partial<SELinuxUserMap>;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSelinuxUserMapsFullData: build.query<
      BatchRPCResponse,
      SelinuxUserMapsFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;
        const apiVersionUsed = apiVersion || API_VERSION_BACKUP;

        const findParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersionUsed,
        };

        const findCommand: Command = {
          method: "selinuxusermap_find",
          params: [[searchValue], findParams],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));

        if (findResult.error) {
          return { error: findResult.error };
        }

        const findResponse = findResult.data as FindRPCResponse;
        const ids: string[] = [];
        const totalCount = findResponse.result.result.length as number;

        for (let i = startIdx; i < totalCount && i < stopIdx; i++) {
          const item = findResponse.result.result[
            i
          ] as unknown as FindSelinuxUserMapArgs;
          ids.push(item.cn[0]);
        }

        const showCommands: Command[] = ids.map((id) => ({
          method: "selinuxusermap_show",
          params: [[id], {}],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersionUsed)
        );

        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalCount;
        }

        return { data: response };
      },
    }),
    addSelinuxUserMap: build.mutation<
      FindRPCResponse,
      SelinuxUserMapAddPayload
    >({
      query: (payload) => {
        const params: Record<string, unknown> = {
          ipaselinuxuser: payload.ipaselinuxuser,
          version: API_VERSION_BACKUP,
        };

        return getCommand({
          method: "selinuxusermap_add",
          params: [[payload.cn], params],
        });
      },
    }),

    deleteSelinuxUserMaps: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = payload.map((id) => ({
          method: "selinuxusermap_del",
          params: [[id], {}],
        }));

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    enableSelinuxUserMaps: build.mutation<BatchRPCResponse, string[]>({
      query: (ids) => {
        const commands: Command[] = ids.map((id) => ({
          method: "selinuxusermap_enable",
          params: [[id], {}],
        }));

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    disableSelinuxUserMaps: build.mutation<BatchRPCResponse, string[]>({
      query: (ids) => {
        const commands: Command[] = ids.map((id) => ({
          method: "selinuxusermap_disable",
          params: [[id], {}],
        }));

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    getSelinuxUserMapFullData: build.query<SelinuxUserMapFullData, string>({
      query: (ruleId) => {
        const rule_params = {
          all: true,
          rights: true,
        };

        const ruleShowCommand: Command = {
          method: "selinuxusermap_show",
          params: [[ruleId], rule_params],
        };

        const batchPayload: Command[] = [ruleShowCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): SelinuxUserMapFullData => {
        const [ruleResponse] = response.result.results;

        const ruleData = ruleResponse.result;
        let ruleObject = {};
        if (!ruleResponse.error) {
          ruleObject = apiToSelinuxUserMap(ruleData);
        }

        return {
          selinuxUserMap: ruleObject,
        };
      },
      providesTags: ["FullSelinuxUserMap"],
    }),

    saveAndCleanSelinuxUserMap: build.mutation<
      FindRPCResponse,
      AllowAllPayload
    >({
      query: (payload) => {
        const actions: Command[] = [];

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
            method: "selinuxusermap_remove_user",
            params: [[payload.groupName], params],
          } as Command);
        }

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
            method: "selinuxusermap_remove_host",
            params: [[payload.groupName], params],
          } as Command);
        }

        const mod_params = {
          version: API_VERSION_BACKUP,
          ...payload.modifiedValues,
        };
        actions.push({
          method: "selinuxusermap_mod",
          params: [[payload.groupName], mod_params],
        } as Command);

        return getBatchCommand(actions, API_VERSION_BACKUP);
      },
    }),

    addMembersToSelinuxUserMap: build.mutation<
      BatchRPCResponse,
      [string, string, string[], boolean]
    >({
      query: (payload) => {
        const [id, memberType, members, unsetCategory] = payload;
        const commands: Command[] = [];

        if (unsetCategory) {
          const categoryField =
            memberType === "user" || memberType === "group"
              ? "usercategory"
              : "hostcategory";
          commands.push({
            method: "selinuxusermap_mod",
            params: [[id], { [categoryField]: "" }],
          } as Command);
        }

        const params = {};
        params[memberType] = members;
        commands.push({
          method:
            memberType === "user" || memberType === "group"
              ? "selinuxusermap_add_user"
              : "selinuxusermap_add_host",
          params: [[id], params],
        } as Command);

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    removeMembersFromSelinuxUserMap: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const [id, memberType, members] = payload;
        const params = {};
        params[memberType] = members;

        const commands: Command[] = [
          {
            method:
              memberType === "user" || memberType === "group"
                ? "selinuxusermap_remove_user"
                : "selinuxusermap_remove_host",
            params: [[id], params],
          },
        ];

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSelinuxUserMapsFullDataQuery,
  useAddSelinuxUserMapMutation,
  useDeleteSelinuxUserMapsMutation,
  useEnableSelinuxUserMapsMutation,
  useDisableSelinuxUserMapsMutation,
  useGetSelinuxUserMapFullDataQuery,
  useSaveAndCleanSelinuxUserMapMutation,
  useAddMembersToSelinuxUserMapMutation,
  useRemoveMembersFromSelinuxUserMapMutation,
} = extendedApi;
