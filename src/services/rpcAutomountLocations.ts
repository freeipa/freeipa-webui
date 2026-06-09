import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  getCommand,
} from "./rpc";
import { API_VERSION_BACKUP } from "src/utils/utils";
import { AutomountLocation } from "src/utils/datatypes/globalDataTypes";
import { apiToAutomountLocation } from "src/utils/automountLocationUtils";

/**
 * Automount location-related endpoints
 *
 * API commands:
 * - automountlocation_find: https://freeipa.readthedocs.io/en/latest/api/automountlocation_find.html
 * - automountlocation_show: https://freeipa.readthedocs.io/en/latest/api/automountlocation_show.html
 * - automountlocation_add: https://freeipa.readthedocs.io/en/latest/api/automountlocation_add.html
 * - automountlocation_del: https://freeipa.readthedocs.io/en/latest/api/automountlocation_del.html
 */

interface AutomountLocationsFullDataPayload {
  searchValue: string;
  apiVersion?: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

interface FindLocationArgs {
  cn: string[];
}

export interface AutomountLocationAddPayload {
  locationName: string;
  version?: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAutomountLocationsFullData: build.query<
      BatchRPCResponse,
      AutomountLocationsFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;
        const apiVersionUsed = apiVersion || API_VERSION_BACKUP;

        // Step 1: Find location IDs via automountlocation_find
        const findParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersionUsed,
        };

        const findCommand: Command = {
          method: "automountlocation_find",
          params: [[searchValue], findParams],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));

        if (findResult.error) {
          return { error: findResult.error };
        }

        const findResponse = findResult.data as FindRPCResponse;
        const totalItemsCount = findResponse.result.count as number;
        const pageItemsCount = findResponse.result.result.length as number;

        const locationIds: string[] = [];
        for (let i = startIdx; i < pageItemsCount && i < stopIdx; i++) {
          const loc = findResponse.result.result[i] as FindLocationArgs;
          locationIds.push(loc.cn[0]);
        }

        // Step 2: Show each location via automountlocation_show
        const showCommands: Command[] = locationIds.map((locId) => ({
          method: "automountlocation_show",
          params: [[locId], {}],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersionUsed)
        );

        if (showResult.error) {
          return { error: showResult.error };
        }

        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalItemsCount;
        }

        return { data: response };
      },
    }),
    searchAutomountLocationsEntries: build.mutation<
      BatchRPCResponse,
      AutomountLocationsFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;
        const apiVersionUsed = apiVersion || API_VERSION_BACKUP;

        const findParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersionUsed,
        };

        const findCommand: Command = {
          method: "automountlocation_find",
          params: [[searchValue], findParams],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));

        if (findResult.error) {
          return { error: findResult.error };
        }

        const findResponse = findResult.data as FindRPCResponse;
        const totalItemsCount = findResponse.result.count as number;
        const pageItemsCount = findResponse.result.result.length as number;

        const locationIds: string[] = [];
        for (let i = startIdx; i < pageItemsCount && i < stopIdx; i++) {
          const loc = findResponse.result.result[i] as FindLocationArgs;
          locationIds.push(loc.cn[0]);
        }

        const showCommands: Command[] = locationIds.map((locId) => ({
          method: "automountlocation_show",
          params: [[locId], {}],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersionUsed)
        );

        if (showResult.error) {
          return { error: showResult.error };
        }

        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalItemsCount;
        }

        return { data: response };
      },
    }),
    addAutomountLocation: build.mutation<
      FindRPCResponse,
      AutomountLocationAddPayload
    >({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: payload.version || API_VERSION_BACKUP,
        };

        return getCommand({
          method: "automountlocation_add",
          params: [[payload.locationName], params],
        });
      },
    }),
    deleteAutomountLocations: build.mutation<BatchRPCResponse, string[]>({
      query: (locationNames) => {
        const commands: Command[] = locationNames.map((name) => ({
          method: "automountlocation_del",
          params: [[name], {}],
        }));

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    automountLocationShow: build.query<AutomountLocation, string>({
      query: (locationName) => {
        return getCommand({
          method: "automountlocation_show",
          params: [[locationName], { all: true, rights: true }],
        });
      },
      transformResponse: (response: FindRPCResponse): AutomountLocation =>
        apiToAutomountLocation(response.result.result),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAutomountLocationsFullDataQuery,
  useSearchAutomountLocationsEntriesMutation,
  useAddAutomountLocationMutation,
  useDeleteAutomountLocationsMutation,
} = extendedApi;
