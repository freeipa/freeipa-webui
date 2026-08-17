import {
  api,
  Command,
  ErrorResult,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SelfServicePermission } from "../utils/datatypes/globalDataTypes";
import { apiToSelfServicePermission } from "../utils/selfServicePermissionsUtils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Self-service permission-related endpoints
 *
 * API commands:
 * - selfservice_find: https://freeipa.readthedocs.io/en/latest/api/selfservice_find.html
 * - selfservice_show: https://freeipa.readthedocs.io/en/latest/api/selfservice_show.html
 * - selfservice_add:  https://freeipa.readthedocs.io/en/latest/api/selfservice_add.html
 * - selfservice_del:  https://freeipa.readthedocs.io/en/latest/api/selfservice_del.html
 * - selfservice_mod:  https://freeipa.readthedocs.io/en/latest/api/selfservice_mod.html
 */

interface SelfServicePermissionsFullDataPayload {
  searchValue: string;
  sizeLimit?: number;
  apiVersion: string;
  startIdx: number;
  stopIdx: number;
}

interface SelfServicePermissionAddPayload {
  aciname: string;
  attrs: string[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSelfServicePermissionsFullData: build.query<
      BatchRPCResponse,
      SelfServicePermissionsFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, startIdx, stopIdx, sizeLimit } =
          payloadData;

        const effectiveStopIdx =
          typeof sizeLimit === "number" && sizeLimit > 0
            ? Math.min(stopIdx, startIdx + sizeLimit)
            : stopIdx;

        const params = {
          pkey_only: true,
          version: apiVersion,
        };

        const findCommand: Command = {
          method: "selfservice_find",
          params: [[searchValue], params],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));
        if (findResult.error) {
          return { error: findResult.error as FetchBaseQueryError };
        }

        const findResponse = findResult.data as FindRPCResponse;

        if (!findResponse.result) {
          const ipaError = findResponse.error as ErrorResult | string;
          const errorMsg =
            typeof ipaError === "object" && ipaError?.message
              ? ipaError.message
              : String(ipaError || "selfservice_find returned no result");

          return {
            error: {
              status: "CUSTOM_ERROR",
              data: errorMsg,
              error: errorMsg,
            } as FetchBaseQueryError,
          };
        }

        const totalCount = findResponse.result.result.length as number;
        const ids: string[] = [];

        for (let i = startIdx; i < totalCount && i < effectiveStopIdx; i++) {
          const item = findResponse.result.result[i] as Record<string, unknown>;
          const aciname = item.aciname;
          ids.push(
            Array.isArray(aciname)
              ? (aciname[0] as string)
              : (aciname as string)
          );
        }

        const showCommands: Command[] = ids.map((id) => ({
          method: "selfservice_show",
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

    addSelfServicePermission: build.mutation<
      FindRPCResponse,
      SelfServicePermissionAddPayload
    >({
      query: (payload) => {
        const params: Record<string, unknown> = {
          attrs: payload.attrs,
          version: API_VERSION_BACKUP,
        };
        return getCommand({
          method: "selfservice_add",
          params: [[payload.aciname], params],
        });
      },
    }),

    deleteSelfServicePermissions: build.mutation<
      BatchRPCResponse,
      SelfServicePermission[]
    >({
      query: (permissions) => {
        const commands: Command[] = permissions.map((perm) => ({
          method: "selfservice_del",
          params: [[perm.aciname], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    getSelfServicePermissionById: build.query<SelfServicePermission[], string>({
      query: (aciname) => {
        return getCommand({
          method: "selfservice_show",
          params: [[aciname], {}],
        });
      },
      transformResponse: (
        response: FindRPCResponse
      ): SelfServicePermission[] => {
        if (response.result?.result) {
          return [
            apiToSelfServicePermission(
              response.result.result as unknown as Record<string, unknown>
            ),
          ];
        }
        return [];
      },
    }),

    saveSelfServicePermission: build.mutation<
      FindRPCResponse,
      Partial<SelfServicePermission>
    >({
      query: (permission) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };
        if (permission.attrs !== undefined) {
          params.attrs = permission.attrs;
        }
        if (permission.permissions !== undefined) {
          params.permissions = permission.permissions;
        }
        return getCommand({
          method: "selfservice_mod",
          params: [[permission.aciname], params],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSelfServicePermissionsFullDataQuery,
  useAddSelfServicePermissionMutation,
  useDeleteSelfServicePermissionsMutation,
  useGetSelfServicePermissionByIdQuery,
  useSaveSelfServicePermissionMutation,
} = extendedApi;
