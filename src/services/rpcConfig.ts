import { api, getCommand, FindRPCResponse } from "./rpc";
import { apiToConfig } from "src/utils/configUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Config } from "../utils/datatypes/globalDataTypes";

/**
 * Configuration endpoints: getConfig, saveConfig
 *
 * API commands:
 * - config_show: https://freeipa.readthedocs.io/en/latest/api/config_show.html
 * - config_mod: https://freeipa.readthedocs.io/en/latest/api/config_mod.html
 */

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Add entity to roles
     * @param {string} toId - ID of the entity to add to roles
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the roles
     */
    getConfig: build.query<Config, void>({
      query: () => {
        return getCommand({
          method: "config_show",
          params: [
            [],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse): Config =>
        apiToConfig(response.result.result),
    }),
    saveConfig: build.mutation<FindRPCResponse, Partial<Config>>({
      query: (config) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...config,
        };
        delete params["cn"];
        return getCommand({
          method: "config_mod",
          params: [[], params],
        });
      },
      invalidatesTags: ["FullConfig"],
    }),
  }),
  overrideExisting: false,
});

export const { useSaveConfigMutation, useGetConfigQuery } = extendedApi;
