import {
  api,
  Command,
  ErrorResult,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { apiToDelegation } from "src/utils/delegationsUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Delegation } from "../utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Delegation-related endpoints
 *
 * API commands:
 * - delegation_find: https://freeipa.readthedocs.io/en/latest/api/delegation_find.html
 * - delegation_show: https://freeipa.readthedocs.io/en/latest/api/delegation_show.html
 * - delegation_add:  https://freeipa.readthedocs.io/en/latest/api/delegation_add.html
 * - delegation_del:  https://freeipa.readthedocs.io/en/latest/api/delegation_del.html
 * - delegation_mod:  https://freeipa.readthedocs.io/en/latest/api/delegation_mod.html
 */

interface DelegationsFullDataPayload {
  searchValue: string;
  sizeLimit?: number;
  apiVersion: string;
  startIdx: number;
  stopIdx: number;
}

export interface DelegationAddPayload {
  aciname: string;
  attrs: string[];
  memberof: string;
  group: string;
  permissions?: string[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDelegationsFullData: build.query<
      BatchRPCResponse,
      DelegationsFullDataPayload
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
          method: "delegation_find",
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
              : String(ipaError || "delegation_find returned no result");

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
          method: "delegation_show",
          params: [[id], {}],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersion)
        );

        const response = showResult.data as BatchRPCResponse;
        if (response?.result) {
          response.result.totalCount = totalCount;
          return { data: response };
        }

        return { error: showResult.error as FetchBaseQueryError };
      },
    }),

    addDelegation: build.mutation<FindRPCResponse, DelegationAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          attrs: payload.attrs,
          memberof: payload.memberof,
          group: payload.group,
          version: API_VERSION_BACKUP,
        };
        if (payload.permissions) {
          params.permissions = payload.permissions;
        }
        return getCommand({
          method: "delegation_add",
          params: [[payload.aciname], params],
        });
      },
    }),

    getDelegationById: build.query<Delegation, string>({
      query: (aciname) =>
        getCommand({
          method: "delegation_show",
          params: [
            [aciname],
            {
              all: true,
              version: API_VERSION_BACKUP,
            },
          ],
        }),
      transformResponse: (response: FindRPCResponse): Delegation => {
        return apiToDelegation(response.result?.result ?? {});
      },
    }),

    delegationMod: build.mutation<FindRPCResponse, Partial<Delegation>>({
      query: (delegation) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };

        if (delegation.permissions !== undefined) {
          params.permissions = delegation.permissions;
        }
        if (delegation.attrs !== undefined) {
          params.attrs = delegation.attrs;
        }
        if (delegation.memberof !== undefined) {
          params.memberof =
            delegation.memberof === "" ? [] : delegation.memberof;
        }
        if (delegation.group !== undefined) {
          params.group = delegation.group === "" ? [] : delegation.group;
        }

        return getCommand({
          method: "delegation_mod",
          params: [[delegation.aciname], params],
        });
      },
    }),

    deleteDelegations: build.mutation<BatchRPCResponse, Delegation[]>({
      query: (delegations) => {
        const commands: Command[] = delegations.map((del) => ({
          method: "delegation_del",
          params: [[del.aciname], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDelegationsFullDataQuery,
  useAddDelegationMutation,
  useGetDelegationByIdQuery,
  useDelegationModMutation,
  useDeleteDelegationsMutation,
} = extendedApi;
