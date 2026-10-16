import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { RadiusServer, cnType } from "../utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * RADIUS server-related endpoints
 *
 * API commands:
 * - radiusproxy_find: https://freeipa.readthedocs.io/en/latest/api/radiusproxy_find.html
 * - radiusproxy_show: https://freeipa.readthedocs.io/en/latest/api/radiusproxy_show.html
 * - radiusproxy_add:  https://freeipa.readthedocs.io/en/latest/api/radiusproxy_add.html
 * - radiusproxy_del:  https://freeipa.readthedocs.io/en/latest/api/radiusproxy_del.html
 * - radiusproxy_mod:  https://freeipa.readthedocs.io/en/latest/api/radiusproxy_mod.html
 */

interface RadiusServersFullDataPayload {
  searchValue: string;
  sizeLimit: number;
  apiVersion: string;
  startIdx: number;
  stopIdx: number;
}

interface RadiusServerAddPayload {
  cn: string;
  ipatokenradiusserver: string;
  ipatokenradiussecret: string;
  ipatokenusermapattribute?: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List RADIUS servers: two-step find+show pattern
     * 1. Call `radiusproxy_find` with pkey_only to get IDs
     * 2. Batch call `radiusproxy_show` for the paginated slice
     */
    getRadiusServersFullData: build.query<
      BatchRPCResponse,
      RadiusServersFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, apiVersion, startIdx, stopIdx } =
          payloadData;

        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: apiVersion,
        };

        // Step 1: Find RADIUS server IDs
        const findCommand: Command = {
          method: "radiusproxy_find",
          params: [[searchValue], params],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));
        if (findResult.error) {
          return { error: findResult.error as FetchBaseQueryError };
        }

        const findResponse = findResult.data as FindRPCResponse;
        const totalCount = findResponse.result.count as number;
        const pageItemsCount = findResponse.result.result.length as number;
        const ids: string[] = [];

        for (let i = startIdx; i < pageItemsCount && i < stopIdx; i++) {
          const item = findResponse.result.result[i] as cnType;
          ids.push(item.cn[0] as string);
        }

        // Step 2: Batch show for each RADIUS server
        if (ids.length === 0) {
          return {
            data: {
              error: "",
              id: "",
              principal: "",
              version: "",
              result: {
                count: 0,
                totalCount: totalCount,
                results: [],
              },
            } as unknown as BatchRPCResponse,
          };
        }

        const showCommands: Command[] = ids.map((id) => ({
          method: "radiusproxy_show",
          params: [[id], {}],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersion)
        );

        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalCount;
        }

        return response
          ? { data: response }
          : { error: showResult.error as FetchBaseQueryError };
      },
    }),

    /**
     * Add a new RADIUS server via `radiusproxy_add`
     */
    addRadiusServer: build.mutation<FindRPCResponse, RadiusServerAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
          ipatokenradiusserver: payload.ipatokenradiusserver,
          ipatokenradiussecret: payload.ipatokenradiussecret,
        };
        if (payload.ipatokenusermapattribute) {
          params.ipatokenusermapattribute = payload.ipatokenusermapattribute;
        }
        return getCommand({
          method: "radiusproxy_add",
          params: [[payload.cn], params],
        });
      },
    }),

    /**
     * Delete RADIUS servers via batch `radiusproxy_del`
     */
    deleteRadiusServers: build.mutation<BatchRPCResponse, RadiusServer[]>({
      query: (servers) => {
        const commands: Command[] = servers.map((server) => ({
          method: "radiusproxy_del",
          params: [[server.cn], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRadiusServersFullDataQuery,
  useAddRadiusServerMutation,
  useDeleteRadiusServersMutation,
} = extendedApi;
