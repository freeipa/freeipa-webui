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
import { apiToHost, createEmptyHost } from "../utils/hostUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Host } from "../utils/datatypes/globalDataTypes";

/**
 * Hosts-related endpoints: getHostsFullData, addHost, removeHosts, saveHost,
 *   addHostPrincipalAlias, removeHostPrincipalAlias, autoMemberRebuildHosts
 *   setHostPassword, getHostById, addToHostsManagedBy, removeFromHostsManagedBy,
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
 * - host_add_managedby: https://freeipa.readthedocs.io/en/latest/api/host_add_managedby.html
 * - host_remove_managedby: https://freeipa.readthedocs.io/en/latest/api/host_remove_managedby.html
 *
 */

export interface HostAddPayload {
  fqdn: string;
  userclass?: string;
  ip_address?: string;
  force?: boolean; // skip DNS check
  random?: boolean; // otp generation
  description?: string;
}

export type HostFullData = {
  host?: Partial<Host>;
  cert?: Record<string, unknown>;
};

export interface HostShowPayload {
  hostNamesList: string[];
  no_members?: boolean;
  version: string;
}

export type RemoveHostsPayload = {
  hosts: Host[];
  updateDns: boolean;
};

export interface MemberPayload {
  host: string;
  idsToAdd: string[];
  entityType: string;
}

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
          },
        ];
        // Add the rest of parameters if they are not undefined
        Object.keys(payloadData).forEach((key) => {
          if (payloadData[key] !== undefined && key !== "fqdn") {
            params[1][key] = payloadData[key];
          }
        });

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
    removeHosts: build.mutation<BatchRPCResponse, RemoveHostsPayload>({
      query: (payload) => {
        const hostsToDeletePayload: Command[] = [];
        payload.hosts.map((host) => {
          const payloadItem = {
            method: "host_del",
            params: [[host.fqdn[0]], { updatedns: payload.updateDns }],
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
      transformResponse: (response: FindRPCResponse): Host => {
        if (response.result?.result !== undefined) {
          return apiToHost(response.result?.result);
        }
        return createEmptyHost();
      },
    }),
    /**
     * Add entity to hosts
     * @param {string} toId - ID of the entity to add to hosts
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the hosts
     */
    addToHostsManagedBy: build.mutation<
      FindRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const hostNames = payload[2];

        return getCommand({
          method: "host_add_managedby",
          params: [
            [memberId],
            { all: true, [memberType]: hostNames, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Remove entity from hosts
     * @param {string} toId - ID of the entity to add to hosts
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the hosts
     */
    removeFromHostsManagedBy: build.mutation<
      FindRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const hostNames = payload[2];

        return getCommand({
          method: "host_remove_managedby",
          params: [
            [memberId],
            { all: true, [memberType]: hostNames, version: API_VERSION_BACKUP },
          ],
        });
      },
    }),
    /**
     * Given a list of netgroup names, show the full data of those netgroups
     * @param {HostShowPayload} - Payload with netgroup names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getHostInfoByName: build.query<Host[], HostShowPayload>({
      query: (payload) => {
        const hostNames = payload.hostNamesList;
        const noMembers = payload.no_members || true;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const hostShowCommands: Command[] = hostNames.map((hostName) => ({
          method: "host_show",
          params: [[hostName], { no_members: noMembers }],
        }));
        return getBatchCommand(hostShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): Host[] => {
        const hostList: Host[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const hostData = apiToHost(results[i].result);
          hostList.push(hostData);
        }
        return hostList;
      },
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
  useAddToHostsManagedByMutation,
  useRemoveFromHostsManagedByMutation,
  useGetHostInfoByNameQuery,
} = extendedApi;
