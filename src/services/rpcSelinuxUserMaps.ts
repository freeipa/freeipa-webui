import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";

/**
 * SELinux user map-related endpoints
 *
 * API commands:
 * - selinuxusermap_find:    https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_find.html
 * - selinuxusermap_show:    https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_show.html
 * - selinuxusermap_add:     https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_add.html
 * - selinuxusermap_del:     https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_del.html
 * - selinuxusermap_enable:  https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_enable.html
 * - selinuxusermap_disable: https://freeipa.readthedocs.io/en/latest/api/selinuxusermap_disable.html
 */

interface SelinuxUserMapsFullDataPayload {
  searchValue: string;
  apiVersion?: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

interface FindSelinuxUserMapArgs {
  cn: string[];
}

export interface SelinuxUserMapAddPayload {
  cn: string;
  ipaselinuxuser: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSelinuxUserMapsFullData: build.query<
      BatchRPCResponse,
      SelinuxUserMapsFullDataPayload
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
          method: "selinuxusermap_find",
          params: [[searchValue], findParams],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));

        if (findResult.error) {
          return { error: findResult.error };
        }

        const findResponse = findResult.data as FindRPCResponse;
        const ids: string[] = [];
        const totalCount = findResponse.result.result.length as number;

        for (let i = startIdx; i < totalCount && i < stopIdx; i++) {
          const item = findResponse.result.result[
            i
          ] as unknown as FindSelinuxUserMapArgs;
          ids.push(item.cn[0]);
        }

        const showCommands: Command[] = ids.map((id) => ({
          method: "selinuxusermap_show",
          params: [[id], {}],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersionUsed)
        );

        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalCount;
        }

        return { data: response };
      },
    }),

    searchSelinuxUserMapsEntries: build.mutation<
      BatchRPCResponse,
      SelinuxUserMapsFullDataPayload
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
          method: "selinuxusermap_find",
          params: [[searchValue], findParams],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));

        if (findResult.error) {
          return { error: findResult.error };
        }

        const findResponse = findResult.data as FindRPCResponse;
        const ids: string[] = [];
        const totalCount = findResponse.result.result.length as number;

        for (let i = startIdx; i < totalCount && i < stopIdx; i++) {
          const item = findResponse.result.result[
            i
          ] as unknown as FindSelinuxUserMapArgs;
          ids.push(item.cn[0]);
        }

        const showCommands: Command[] = ids.map((id) => ({
          method: "selinuxusermap_show",
          params: [[id], {}],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersionUsed)
        );

        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalCount;
        }

        return { data: response };
      },
    }),

    addSelinuxUserMap: build.mutation<
      FindRPCResponse,
      SelinuxUserMapAddPayload
    >({
      query: (payload) => {
        const params: Record<string, unknown> = {
          ipaselinuxuser: payload.ipaselinuxuser,
          version: API_VERSION_BACKUP,
        };

        return getCommand({
          method: "selinuxusermap_add",
          params: [[payload.cn], params],
        });
      },
    }),

    deleteSelinuxUserMaps: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = payload.map((id) => ({
          method: "selinuxusermap_del",
          params: [[id], {}],
        }));

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    enableSelinuxUserMaps: build.mutation<BatchRPCResponse, string[]>({
      query: (ids) => {
        const commands: Command[] = ids.map((id) => ({
          method: "selinuxusermap_enable",
          params: [[id], {}],
        }));

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    disableSelinuxUserMaps: build.mutation<BatchRPCResponse, string[]>({
      query: (ids) => {
        const commands: Command[] = ids.map((id) => ({
          method: "selinuxusermap_disable",
          params: [[id], {}],
        }));

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSelinuxUserMapsFullDataQuery,
  useSearchSelinuxUserMapsEntriesMutation,
  useAddSelinuxUserMapMutation,
  useDeleteSelinuxUserMapsMutation,
  useEnableSelinuxUserMapsMutation,
  useDisableSelinuxUserMapsMutation,
} = extendedApi;
