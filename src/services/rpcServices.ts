/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
  BatchResponse,
} from "./rpc";
import { apiToService } from "../utils/serviceUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Service } from "../utils/datatypes/globalDataTypes";

/**
 * Services-related endpoints: getServicesFullData, addService, removeServices, saveService,
 * addServicePrincipalAlias, removeServicePrincipalAlias, addServiceHost, removeServiceHost
 *
 * API commands:
 * - service_show: https://freeipa.readthedocs.io/en/latest/api/service_show.html
 * - service_add: https://freeipa.readthedocs.io/en/latest/api/service_add.html
 * - service_del: https://freeipa.readthedocs.io/en/latest/api/service_del.html
 * - service_mod: https://freeipa.readthedocs.io/en/latest/api/service_mod.html
 * - service_add_principal: https://freeipa.readthedocs.io/en/latest/api/service_add_principal.html
 * - service_remove_principal: https://freeipa.readthedocs.io/en/latest/api/service_remove_principal.html
 * - service_add_host: https://freeipa.readthedocs.io/en/latest/api/service_add_host.html
 * - service_remove_host: https://freeipa.readthedocs.io/en/latest/api/service_remove_host.html
 */

export interface ServiceAddPayload {
  service: string;
  skip_host_check: boolean;
  force: boolean; // skip DNS check
}

export type ServiceFullData = {
  service?: Partial<Service>;
  cert?: Record<string, unknown>;
};

export interface ServiceAddRemoveHostPayload {
  serviceId: string;
  hostsList: string[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getServicesFullData: build.query<ServiceFullData, string>({
      query: (serviceId) => {
        // Prepare search parameters
        const service_params = {
          all: true,
          rights: true,
        };

        const serviceShowCommand: Command = {
          method: "service_show",
          params: [[serviceId], service_params],
        };

        const certFindCommand: Command = {
          method: "cert_find",
          params: [[], { service: serviceId, sizelimit: 0, all: true }],
        };

        const batchPayload: Command[] = [serviceShowCommand, certFindCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): ServiceFullData => {
        const [serviceResponse, certResponse] = response.result.results;

        // Initialize service data (to prevent 'undefined' values)
        const serviceData = serviceResponse.result;
        const certData = certResponse.result;

        let serviceObject = {};
        if (!serviceResponse.error) {
          serviceObject = apiToService(serviceData);
        }

        return {
          service: serviceObject,
          cert: certData,
        };
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
    saveService: build.mutation<FindRPCResponse, Partial<Service>>({
      query: (service) => {
        const params = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
          ...service,
        };
        delete params["krbcanonicalname"];
        const id =
          service.krbcanonicalname !== undefined
            ? service.krbcanonicalname
            : "";
        return getCommand({
          method: "service_mod",
          params: [[id], params],
        });
      },
      invalidatesTags: ["FullService"],
    }),
    addServicePrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "service_add_principal",
          params: params,
        });
      },
    }),
    removeServicePrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "service_remove_principal",
          params: params,
        });
      },
    }),
    getServiceById: build.query<Service, string>({
      query: (serviceId) => {
        return getCommand({
          method: "service_show",
          params: [[serviceId], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): Service =>
        apiToService(response.result.result),
    }),
    addServiceHost: build.mutation<
      FindRPCResponse,
      ServiceAddRemoveHostPayload
    >({
      query: (payload) => {
        const serviceId = payload.serviceId;
        const hostsList = payload.hostsList;

        return getCommand({
          method: "service_add_host",
          params: [
            [serviceId],
            { all: true, host: hostsList, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    removeServiceHost: build.mutation<
      FindRPCResponse,
      ServiceAddRemoveHostPayload
    >({
      query: (payload) => {
        const serviceId = payload.serviceId;
        const hostsList = payload.hostsList;

        return getCommand({
          method: "service_remove_host",
          params: [
            [serviceId],
            { all: true, host: hostsList, version: API_VERSION_BACKUP },
          ],
        });
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
  useSaveServiceMutation,
  useAddServicePrincipalAliasMutation,
  useRemoveServicePrincipalAliasMutation,
  useGetServiceByIdQuery,
  useAddServiceHostMutation,
  useRemoveServiceHostMutation,
} = extendedApi;
