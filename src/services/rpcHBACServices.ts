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

type ServiceFullData = {
  service?: Partial<HBACService>;
};

interface ShowPayload {
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
  useGetHbacServiceByIdQuery,
  useGetHBACServicesInfoByNameQuery,
} = extendedApi;
