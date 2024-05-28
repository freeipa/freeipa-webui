import { api, getCommand, FindRPCResponse } from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";

/**
 * Settings-related endpoints: updateKeyTab
 *
 * API commands:
 * - host_allow_create_keytab: https://freeipa.readthedocs.io/en/latest/api/host_allow_create_keytab.html
 * - host_disallow_create_keytab: https://freeipa.readthedocs.io/en/latest/api/host_disallow_create_keytab.html
 * - host_allow_retrieve_keytab: https://freeipa.readthedocs.io/en/latest/api/host_allow_retrieve_keytab.html
 * - host_disallow_retrieve_keytab: https://freeipa.readthedocs.io/en/latest/api/host_disallow_retrieve_keytab.html
 * - service_allow_create_keytab: https://freeipa.readthedocs.io/en/latest/api/service_allow_create_keytab.html
 * - service_disallow_create_keytab: https://freeipa.readthedocs.io/en/latest/api/service_disallow_create_keytab.html
 * - service_allow_retrieve_keytab: https://freeipa.readthedocs.io/en/latest/api/service_allow_retrieve_keytab.html
 * - service_disallow_retrieve_keytab: https://freeipa.readthedocs.io/en/latest/api/service_disallow_retrieve_keytab.html
 */

export interface KeyTabPayload {
  id: string;
  entryType: "user" | "host" | "usergroup" | "hostgroup";
  entries: string[];
  method:
    | "host_allow_create_keytab"
    | "host_disallow_create_keytab"
    | "host_allow_retrieve_keytab"
    | "host_disallow_retrieve_keytab"
    | "service_allow_create_keytab"
    | "service_disallow_create_keytab"
    | "service_allow_retrieve_keytab"
    | "service_disallow_retrieve_keytab";
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateKeyTab: build.mutation<FindRPCResponse, KeyTabPayload>({
      query: (payload: KeyTabPayload) => {
        const params = { version: API_VERSION_BACKUP };
        if (payload.entryType === "user") {
          params["user"] = payload.entries;
        } else if (payload.entryType === "host") {
          params["host"] = payload.entries;
        } else if (payload.entryType === "usergroup") {
          params["group"] = payload.entries;
        } else {
          // hostgroup
          params["hostgroup"] = payload.entries;
        }

        return getCommand({
          method: payload.method,
          params: [[payload.id], params],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUpdateKeyTabMutation } = extendedApi;
