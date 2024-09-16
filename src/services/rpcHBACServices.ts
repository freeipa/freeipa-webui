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
import { apiToHBACService } from "src/utils/hbacServicesUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { HBACService } from "../utils/datatypes/globalDataTypes";

/**
 * HBAC-related endpoints:
 * - addHbacService
 * - removeHbacService
 * -
 *
 * API commands:
 * - hbacsvc_add: https://freeipa.readthedocs.io/en/latest/api/hbacsvc_add.html
 * - hbacsvc_del: https://freeipa.readthedocs.io/en/latest/api/hbacsvc_del.html
 */

export type ServiceFullData = {
  service?: Partial<HBACService>;
};

export interface ShowPayload {
  serviceNamesList: string[];
  no_members?: boolean;
  version: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
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
    getHbacServiceById: build.query<HBACService, string>({
      query: (svcId) => {
        return getCommand({
          method: "hbacsvc_show",
          params: [[svcId], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): HBACService =>
        apiToHBACService(response.result.result),
    }),

    /**
     * Add entity to HBAC rule
     * @param {string} toId - ID of the HBAC rule
     * @param {string} type - Type of the entity
     *    Available types:
     *        user | group |
     *        host | hostgroup |
     *        hbacsrv | hbacsvcgroup |
     *        sourcehost
     * @param {string[]} listOfMembers - List of members to add to the HBAC rule
     * @param {boolean} unsetCategory - set the category from "all" to ""
     */
    addMembersToHbacService: build.mutation<
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
    removeMembersFromHbacService: build.mutation<
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
     * Given a list of group names, show the full data of those groups
     * @param {string[]} groupNames - List of group names
     * @param {boolean} noMembers - Whether to show members or not
     * @returns {BatchRPCResponse} - Batch response
     */
    getHBACServicesInfoByName: build.query<HBACService[], ShowPayload>({
      query: (payload) => {
        const names = payload.serviceNamesList;
        const noMembers = payload.no_members || true;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const showCommands: Command[] = names.map((name) => ({
          method: "hbacsvc_show",
          params: [[name], { no_members: noMembers }],
        }));
        return getBatchCommand(showCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): HBACService[] => {
        const svcList: HBACService[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const groupData = apiToHBACService(results[i].result);
          svcList.push(groupData);
        }
        return svcList;
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingHbacServicesQuery = (payloadData) => {
  payloadData["objName"] = "hbacsvc";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useAddHbacServiceMutation,
  useRemoveHbacServicesMutation,
  useSaveHbacServiceMutation,
  useGetHbacServiceFullDataQuery,
  useRemoveMembersFromHbacServiceMutation,
  useAddMembersToHbacServiceMutation,
  useGetHbacServiceByIdQuery,
  useGetHBACServicesInfoByNameQuery,
} = extendedApi;
