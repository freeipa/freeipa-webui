import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToService } from "../utils/serviceUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Service } from "../utils/datatypes/globalDataTypes";

/**
 * Services-related endpoints: getServicesFullData, addService, removeServices
 *
 * API commands:
 * - service_show: https://freeipa.readthedocs.io/en/latest/api/service_show.html
 * - service_add: https://freeipa.readthedocs.io/en/latest/api/service_add.html
 * - service_del: https://freeipa.readthedocs.io/en/latest/api/service_del.html
 */

export interface ServiceAddPayload {
  service: string;
  skip_host_check: boolean;
  force: boolean; // skip DNS check
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getServicesFullData: build.query<Service, string>({
      query: (serviceName: string) => {
        // Prepare search parameters
        const params = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
        };
        return getCommand({
          method: "service_show",
          params: [[serviceName], params],
        });
      },
      transformResponse: (response: FindRPCResponse): Service => {
        return apiToService(response.result.result);
      },
      providesTags: ["FullService"],
    }),
    addService: build.mutation<FindRPCResponse, ServiceAddPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["service"]],
          {
            version: API_VERSION_BACKUP,
            force: payloadData["force"],
            skip_host_check: payloadData["skip_host_check"],
          },
        ];
        return getCommand({
          method: "service_add",
          params: params,
        });
      },
    }),
    removeServices: build.mutation<BatchRPCResponse, Service[]>({
      query: (services) => {
        const servicesToDeletePayload: Command[] = [];
        services.map((service) => {
          const payloadItem = {
            method: "service_del",
            params: [[service.krbcanonicalname], {}],
          } as Command;
          servicesToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(servicesToDeletePayload, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const useGettingServicesQuery = (payloadData) => {
  payloadData["objName"] = "service";
  payloadData["objAttr"] = "krbprincipalname";
  return useGettingGenericQuery(payloadData);
};
export const {
  useGetServicesFullDataQuery,
  useAddServiceMutation,
  useRemoveServicesMutation,
} = extendedApi;
