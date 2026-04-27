import { api, FindRPCResponse, getCommand } from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
import { IpaServer } from "src/utils/datatypes/globalDataTypes";
import { apiToIpaServer } from "src/utils/ipaServerUtils";

/**
 * Topology-related endpoints: useServerFindQuery
 *
 * API commands:
 * - server_find: https://freeipa.readthedocs.io/en/latest/api/server_find.html
 */

interface ServerFindPayload {
  cn: string;
  ipamindomainlevel?: number;
  ipamaxdomainlevel?: number;
  no_members?: boolean;
  topologysuffix?: string[];
  no_topologysuffix?: string[];
  in_location?: string[];
  not_in_location?: string[];
  servrole?: string[];
  timelimit?: number;
  sizelimit?: number;
  pkey_only?: boolean;
  version?: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Find server
     * @param {ServerFindPayload} payload - The payload containing the search parameters
     * @returns {IpaServer} - The server
     */
    findServer: build.query<IpaServer[], ServerFindPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: payload.version || API_VERSION_BACKUP,
        };

        // Dynamically add all fields from payload except core ones
        const coreFields = new Set([
          "cn",
          "ipamindomainlevel",
          "ipamaxdomainlevel",
          "no_members",
          "topologysuffix",
          "no_topologysuffix",
          "in_location",
          "not_in_location",
          "servrole",
          "timelimit",
          "sizelimit",
          "pkey_only",
        ]);

        Object.entries(payload).forEach(([key, value]) => {
          if (!coreFields.has(key) && value !== undefined && value !== null) {
            params[key] = value;
          }
        });

        return getCommand({
          method: "server_find",
          params: [[payload.cn], params],
        });
      },
      transformResponse: (response: FindRPCResponse) => {
        const servers = response.result.result as unknown as Record<
          string,
          unknown
        >[];
        const serversList = servers.map((server) => apiToIpaServer(server));
        return serversList;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useFindServerQuery } = extendedApi;
