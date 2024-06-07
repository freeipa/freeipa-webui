/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
  useGetGenericListQuery,
} from "./rpc";
import { apiToHost } from "../utils/hostUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Host } from "../utils/datatypes/globalDataTypes";

/**
 * Hosts-related endpoints: getHostsFullData, addHost, removeHosts, saveHost,
 *   addHostPrincipalAlias, removeHostPrincipalAlias, autoMemberRebuildHosts
 *   setHostPassword, getHostById
 *
 * API commands:
 * - host_show: https://freeipa.readthedocs.io/en/latest/api/host_show.html
 * - cert_find: https://freeipa.readthedocs.io/en/latest/api/cert_find.html
 * - host_add: https://freeipa.readthedocs.io/en/latest/api/host_add.html
 * - host_mod: https://freeipa.readthedocs.io/en/latest/api/host_mod.html
 * - host_del: https://freeipa.readthedocs.io/en/latest/api/host_del.html
 * - host_disable: https://freeipa.readthedocs.io/en/latest/api/host_disable.html
 * - host_add_principal: https://freeipa.readthedocs.io/en/latest/api/host_add_principal.html
 * - host_remove_principal: https://freeipa.readthedocs.io/en/latest/api/host_remove_principal.html
 * - automember_rebuild: https://freeipa.readthedocs.io/en/latest/api/automember_rebuild.html
 */

export interface HostAddPayload {
  fqdn: string;
  userclass?: string;
  ip_address?: string;
  force: boolean; // skip DNS check
  random: boolean; // otp generation
  description?: string;
}

export type HostFullData = {
  host?: Partial<Host>;
  cert?: Record<string, unknown>;
};

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHostsFullData: build.query<HostFullData, string>({
      query: (hostId) => {
        // Prepare search parameters
        const host_params = {
          all: true,
          rights: true,
        };

        const hostShowCommand: Command = {
          method: "host_show",
          params: [[hostId], host_params],
        };

        const certFindCommand: Command = {
          method: "cert_find",
          params: [[], { host: hostId, sizelimit: 0, all: true }],
        };

        const batchPayload: Command[] = [hostShowCommand, certFindCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): HostFullData => {
        const [hostResponse, certResponse] = response.result.results;

        // Initialize user data (to prevent 'undefined' values)
        const hostData = hostResponse.result;
        const certData = certResponse.result;

        let hostObject = {};
        if (!hostResponse.error) {
          hostObject = apiToHost(hostData);
        }

        return {
          host: hostObject,
          cert: certData,
        };
      },
      providesTags: ["FullHost"],
    }),
    addHost: build.mutation<FindRPCResponse, HostAddPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["fqdn"]],
          {
            version: API_VERSION_BACKUP,
            userclass: payloadData["userclass"],
            ip_address: payloadData["ip_address"],
            force: payloadData["force"],
            description: payloadData["description"],
            random: payloadData["random"],
          },
        ];
        return getCommand({
          method: "host_add",
          params: params,
        });
      },
    }),
    saveHost: build.mutation<FindRPCResponse, Partial<Host>>({
      query: (host) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...host,
        };
        delete params["fqdn"];
        delete params["krbcanonicalname"];
        const fqdn = host.fqdn !== undefined ? host.fqdn : "";
        return getCommand({
          method: "host_mod",
          params: [[fqdn], params],
        });
      },
      invalidatesTags: ["FullHost"],
    }),
    removeHosts: build.mutation<BatchRPCResponse, Host[]>({
      query: (hosts) => {
        const hostsToDeletePayload: Command[] = [];
        hosts.map((host) => {
          const payloadItem = {
            method: "host_del",
            params: [[host.fqdn[0]], {}],
          } as Command;
          hostsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(hostsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    addHostPrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "host_add_principal",
          params: params,
        });
      },
    }),
    removeHostPrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "host_remove_principal",
          params: params,
        });
      },
    }),
    // Automember Hosts
    autoMemberRebuildHosts: build.mutation<FindRPCResponse, any[]>({
      query: (hosts) => {
        const paramArgs =
          hosts.length === 0
            ? { type: "group", version: API_VERSION_BACKUP }
            : {
                hosts: hosts.map((h) => h.fqdn),
                version: API_VERSION_BACKUP,
              };
        return getCommand({
          method: "automember_rebuild",
          params: [[], paramArgs],
        });
      },
    }),
    // Set one-time password
    setHostPassword: build.mutation<FindRPCResponse, [string, string]>({
      query: (payload) => {
        return getCommand({
          method: "host_mod",
          params: [
            [payload[0]],
            {
              userpassword: payload[1],
              version: API_VERSION_BACKUP,
            },
          ],
        });
      },
    }),
    // Unprovision host
    unprovisionHost: build.mutation<FindRPCResponse, string>({
      query: (host) => {
        return getCommand({
          method: "host_disable",
          params: [[host], { version: API_VERSION_BACKUP }],
        });
      },
    }),
    getHostById: build.query<Host, string>({
      query: (hostId) => {
        return getCommand({
          method: "host_show",
          params: [[hostId], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): Host =>
        apiToHost(response.result.result),
    }),
  }),
  overrideExisting: false,
});

export const useGettingHostQuery = (payloadData) => {
  payloadData["objName"] = "host";
  payloadData["objAttr"] = "fqdn";
  return useGettingGenericQuery(payloadData);
};

export const useGetHostsListQuery = () => {
  return useGetGenericListQuery("host");
};

export const useGetDNSZonesQuery = () => {
  return useGetGenericListQuery("dnszone");
};

export const {
  useRemoveHostPrincipalAliasMutation,
  useAddHostPrincipalAliasMutation,
  useAutoMemberRebuildHostsMutation,
  useAddHostMutation,
  useRemoveHostsMutation,
  useSaveHostMutation,
  useGetHostsFullDataQuery,
  useSetHostPasswordMutation,
  useUnprovisionHostMutation,
  useGetHostByIdQuery,
} = extendedApi;
