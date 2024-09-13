import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
  MemberPayload,
} from "./rpc";
import { apiToHBACServiceGroup } from "src/utils/hbacServiceGrpUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { HBACServiceGroup } from "../utils/datatypes/globalDataTypes";

/**
 * HBAC-related endpoints:
 *
 * API commands:
 * - hbacsvcgroup_add: https://freeipa.readthedocs.io/en/latest/api/hbacsvcgroup_add.html
 * - hbacsvcgroup_del: https://freeipa.readthedocs.io/en/latest/api/hbacsvcgroup_del.html
 * - hbacsvcgroup_mod: https://freeipa.readthedocs.io/en/latest/api/hbacsvcgroup_mod.html
 * - hbacsvcgroup_show: https://freeipa.readthedocs.io/en/latest/api/hbacsvcgroup_show.html
 */

export interface GroupShowPayload {
  groupNamesList: string[];
  no_members?: boolean;
  version: string;
}

export type SvcGroupFullData = {
  svcGrp?: Partial<HBACServiceGroup>;
};

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
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
    saveHbacServiceGroup: build.mutation<
      FindRPCResponse,
      Partial<HBACServiceGroup>
    >({
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
    /**
     * Get host group info by name
     */
    getHbacServiceGroupById: build.query<HBACServiceGroup, string>({
      query: (groupId) => {
        return getCommand({
          method: "hbacsvcgroup_show",
          params: [
            [groupId],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse): HBACServiceGroup =>
        apiToHBACServiceGroup(response.result.result),
    }),
    /**
     * Given a list of group names, show the full data of those groups
     * @param {string[]} groupNames - List of group names
     * @param {boolean} noMembers - Whether to show members or not
     * @returns {BatchRPCResponse} - Batch response
     */
    getHbacServiceGroupInfoByName: build.query<
      HBACServiceGroup[],
      GroupShowPayload
    >({
      query: (payload) => {
        const groupNames = payload.groupNamesList;
        const noMembers = payload.no_members || true;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const groupShowCommands: Command[] = groupNames.map((groupName) => ({
          method: "hostgroup_show",
          params: [[groupName], { no_members: noMembers }],
        }));
        return getBatchCommand(groupShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): HBACServiceGroup[] => {
        const groupList: HBACServiceGroup[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const groupData = apiToHBACServiceGroup(results[i].result);
          groupList.push(groupData);
        }
        return groupList;
      },
    }),
    /**
     * Add hbac service members to group
     * @param {MemberPayload} - Payload with IDs and options
     */
    addMembersToHbacSvcGroup: build.mutation<FindRPCResponse, MemberPayload>({
      query: (payload) => {
        const group = payload.entryName;
        const idsToAdd = payload.idsToAdd;
        const memberType = payload.entityType;
        return getCommand({
          method: "hbacsvcgroup_add_member",
          params: [
            [group],
            { all: true, [memberType]: idsToAdd, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Remove hbac service mmebers from group
     * @param {MemberPayload} - Payload with IDs and options
     */
    removeMembersFromHbacSvcGroup: build.mutation<
      FindRPCResponse,
      MemberPayload
    >({
      query: (payload) => {
        const group = payload.entryName;
        const idsToAdd = payload.idsToAdd;
        const memberType = payload.entityType;

        return getCommand({
          method: "hbacsvcgroup_remove_member",
          params: [
            [group],
            { all: true, [memberType]: idsToAdd, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    addToHbacServiceGroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const groupNames = payload[2];
        const membersToAdd: Command[] = [];
        groupNames.map((groupName) => {
          const payloadItem = {
            method: "hbacsvcgroup_add_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    removeFromHbacServiceGroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const groupNames = payload[2];
        const membersToRemove: Command[] = [];
        groupNames.map((groupName) => {
          const payloadItem = {
            method: "hbacsvcgroup_remove_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingHbacServiceGroupQuery = (payloadData) => {
  payloadData["objName"] = "hbacsvcgroup";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useAddHbacServiceGroupMutation,
  useRemoveHbacServiceGroupsMutation,
  useGetHbacSvcGrpFullDataQuery,
  useSaveHbacServiceGroupMutation,
  useGetHbacServiceGroupInfoByNameQuery,
  useGetHbacServiceGroupByIdQuery,
  useAddMembersToHbacSvcGroupMutation,
  useRemoveMembersFromHbacSvcGroupMutation,
  useAddToHbacServiceGroupsMutation,
  useRemoveFromHbacServiceGroupsMutation,
} = extendedApi;
