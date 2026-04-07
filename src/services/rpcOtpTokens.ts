import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  getCommand,
} from "./rpc";
// utils
import { apiToOtpToken } from "../utils/otpTokensUtils";
// Data types
import { OtpToken, OtpTokenType } from "../utils/datatypes/globalDataTypes";
import { API_VERSION_BACKUP } from "src/utils/utils";

/**
 * Otp tokens-related endpoints:   useGetOtpTokensFullDataQuery,
 *   searchOtpTokensEntries
 *
 * API commands:
 * - otptoken_find: https://freeipa.readthedocs.io/en/latest/api/otptoken_find.html
 * - otptoken_show: https://freeipa.readthedocs.io/en/latest/api/otptoken_show.html
 */

interface OtpTokensFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

interface OtpTokensBatchResponse {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: OtpToken[];
  totalCount: number;
}

export interface OtpTokensModifyPayload {
  ipatokenuniqueid: string;
  ipatokenowner?: string;
  description?: string;
  ipatokennotbefore?: Date | string;
  ipatokennotafter?: Date | string;
  ipatokenvendor?: string;
  ipatokenmodel?: string;
  ipatokenserial?: string;
  ipatokendisabled?: boolean;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Find OTP tokens full data
     * @param {OtpTokensFullDataPayload} payload - The payload containing search parameters
     * @returns {BatchRPCResponse} - List of OTP tokens full data
     *
     */
    getOtpTokensFullData: build.query<
      BatchRPCResponse,
      OtpTokensFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            },
          };
        }

        // FETCH OTP TOKENS DATA VIA "otptoken_find" COMMAND
        // Prepare search parameters
        const otpTokensIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataOtpTokens: Command = {
          method: "otptoken_find",
          params: [[searchValue], otpTokensIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultOtpTokens = await fetchWithBQ(
          getCommand(payloadDataOtpTokens)
        );

        // Return possible errors
        if (getResultOtpTokens.error) {
          return { error: getResultOtpTokens.error };
        }

        // If no error: cast and assign 'ids'
        const responseDataOtpTokens =
          getResultOtpTokens.data as FindRPCResponse;

        const otpTokensIds: string[] = [];
        const otpTokensItemsCount = responseDataOtpTokens.result.result
          .length as number;

        for (let i = startIdx; i < otpTokensItemsCount && i < stopIdx; i++) {
          const otpTokenId = responseDataOtpTokens.result.result[
            i
          ] as OtpTokenType;
          const { ipatokenuniqueid } = otpTokenId;
          otpTokensIds.push(ipatokenuniqueid[0] as string);
        }

        // FETCH OTP TOKENS DATA VIA "otptoken_show" COMMAND
        const commands: Command[] = [];
        otpTokensIds.map((otpTokenId) => {
          commands.push({
            method: "otptoken_show",
            params: [[otpTokenId], {}],
          });
        });

        const batchShow = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );
        if (batchShow.error) {
          return { error: batchShow.error };
        }
        const response = batchShow.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = otpTokensItemsCount;
        }
        return { data: response };
      },
    }),
    /**
     * Search for a specific OTP token
     * @param {OtpTokensFullDataPayload} payload - The payload containing search parameters
     * @returns {OtpTokensBatchResponse} - List of OTP tokens full data
     *
     */
    searchOtpTokensEntries: build.mutation<
      OtpTokensBatchResponse,
      OtpTokensFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;
        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            },
          };
        }

        // FETCH OTP TOKENS DATA VIA "otptoken_find" COMMAND
        // Prepare search parameters
        const otpTokensIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };
        // Prepare payload
        const payloadDataOtpTokens: Command = {
          method: "otptoken_find",
          params: [[searchValue], otpTokensIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultOtpTokens = await fetchWithBQ(
          getCommand(payloadDataOtpTokens)
        );
        // Return possible errors
        if (getResultOtpTokens.error) {
          return { error: getResultOtpTokens.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataOtpTokens =
          getResultOtpTokens.data as FindRPCResponse;
        const otpTokensIds: string[] = [];
        const otpTokensItemsCount = responseDataOtpTokens.result.result
          .length as number;

        for (let i = startIdx; i < otpTokensItemsCount && i < stopIdx; i++) {
          const otpTokenId = responseDataOtpTokens.result.result[
            i
          ] as OtpTokenType;
          const { ipatokenuniqueid } = otpTokenId;
          otpTokensIds.push(ipatokenuniqueid[0] as string);
        }

        // FETCH OTP TOKENS DATA VIA "otptoken_show" COMMAND
        const commands: Command[] = [];
        otpTokensIds.map((otpTokenId) => {
          commands.push({
            method: "otptoken_show",
            params: [[otpTokenId], {}],
          });
        });

        const batchShow = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );
        if (batchShow.error) {
          return { error: batchShow.error };
        }
        const response = batchShow.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = otpTokensItemsCount;
        }

        // Handle the '__base64__' fields
        const otpTokens: OtpToken[] = [];
        const count = response.result.totalCount;
        for (let i = 0; i < count; i++) {
          const otpToken = response.result.results[i].result as Record<
            string,
            unknown
          >;
          // Convert API object to OtpToken type
          const convertedOtpToken: OtpToken = apiToOtpToken(otpToken);
          otpTokens.push(convertedOtpToken);
        }

        // Return results
        return {
          data: {
            ...response,
            result: otpTokens,
            totalCount: otpTokensItemsCount,
          },
        };
      },
    }),
    /**
     * Delete OTP tokens
     * @param {string[]} - OTP token IDs
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    deleteOtpTokens: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = [];
        payload.forEach((otpTokenId) => {
          commands.push({
            method: "otptoken_del",
            params: [[otpTokenId], {}],
          });
        });
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Modify OTP tokens
     * @param {OtpTokensModifyPayload[]} - Payload containing the OTP token IDs and the modifications
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    modifyOtpTokens: build.mutation<BatchRPCResponse, OtpTokensModifyPayload[]>(
      {
        query: (payload) => {
          const commands: Command[] = [];

          payload.forEach((otpToken) => {
            const params: Record<string, unknown> = {
              version: API_VERSION_BACKUP,
            };

            const optionalKeys: Array<
              keyof Omit<OtpTokensModifyPayload, "ipatokenuniqueid">
            > = [
              "ipatokenowner",
              "description",
              "ipatokennotbefore",
              "ipatokennotafter",
              "ipatokenvendor",
              "ipatokenmodel",
              "ipatokenserial",
              "ipatokendisabled",
            ];

            optionalKeys.forEach((key) => {
              const value = otpToken[key];
              if (value !== undefined) {
                params[key] = value;
              }
            });

            commands.push({
              method: "otptoken_mod",
              params: [[otpToken.ipatokenuniqueid], params],
            });
          });

          return getBatchCommand(commands, API_VERSION_BACKUP);
        },
      }
    ),
  }),
  overrideExisting: false,
});

export const {
  useGetOtpTokensFullDataQuery,
  useSearchOtpTokensEntriesMutation,
  useDeleteOtpTokensMutation,
  useModifyOtpTokensMutation,
} = extendedApi;
