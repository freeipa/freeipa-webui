import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  getCommand,
} from "./rpc";
// Data types
import { cnType } from "src/utils/datatypes/globalDataTypes";
// Redux
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { API_VERSION_BACKUP } from "src/utils/utils";

/**
 * IdP-related endpoints: useGetIdpEntriesQuery, useSearchIdpEntriesMutation
 *                        useIdpAddMutation, useIdpDeleteMutation
 *
 * API commands:
 * - idp_find: https://freeipa.readthedocs.io/en/latest/api/idp_find.html
 * - idp_show: https://freeipa.readthedocs.io/en/latest/api/idp_show.html
 * - idp_add: https://freeipa.readthedocs.io/en/latest/api/idp_add.html
 * - idp_del: https://freeipa.readthedocs.io/en/latest/api/idp_del.html
 */

export interface IdpFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

export interface IdpFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

// Add payloads
export interface KeycloakOrRedHatSSOAddPayload extends AddParams {
  ipaidporg: string;
  ipaidpbaseurl: string;
}

export interface MicrosoftOrAzureAddPayload extends AddParams {
  ipaidporg: string;
}

export interface CustomIdpAddPayload extends AddParams {
  ipaidpauthendpoint: string;
  ipaidpdevauthendpoint: string;
  ipaidptokenendpoint: string;
  ipaidpuserinfoendpoint: string;
  ipaidpkeysendpoint: string;
}

export interface AddParams {
  ipaidpclientid: string;
  // Selector option
  ipaidpprovider?: string;
  // Other optional fields
  ipaidpscope?: string;
  ipaidpsub?: string;
  version?: string;
}

export interface IdpAddPayload {
  cn: string;
  ipaidpclientid: string;
  // Selector option
  ipaidpprovider?: "keycloak" | "microsoft" | "okta" | "google" | "github";
  // Pre-defined template fields
  // - Keycloak or Red Hat SSO
  keycloakRedHatData?: KeycloakOrRedHatSSOAddPayload;
  // - Microsoft or Azure
  microsoftAzureData?: MicrosoftOrAzureAddPayload;
  // Custom definition fields
  customFields?: CustomIdpAddPayload;
  // Other optional fields
  ipaidpscope?: string;
  ipaidpsub?: string;
  version?: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Find IdP servers full data.
     * @param IdpFullDataPayload
     * @returns List of IdP server entries
     *
     */
    getIdpEntries: build.query<BatchRPCResponse, IdpFullDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        // FETCH IDP DATA VIA "idp_find" COMMAND
        // Prepare search parameters
        const idpFindParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataIdpFind: Command = {
          method: "idp_find",
          params: [[searchValue], idpFindParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultIdpFind = await fetchWithBQ(
          getCommand(payloadDataIdpFind)
        );
        // Return possible errors
        if (getResultIdpFind.error) {
          return { error: getResultIdpFind.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataIdpFind = getResultIdpFind.data as FindRPCResponse;

        const idpIds: string[] = [];
        const idpItemsCount = responseDataIdpFind.result.result
          .length as number;

        for (let i = startIdx; i < idpItemsCount && i < stopIdx; i++) {
          const idpId = responseDataIdpFind.result.result[i] as cnType;
          const { cn } = idpId;
          idpIds.push(cn[0] as string);
        }

        // FETCH IDP DATA VIA "idp_show" COMMAND
        const commands: Command[] = [];
        idpIds.forEach((idpId) => {
          commands.push({
            method: "idp_show",
            params: [[idpId], {}],
          });
        });

        const idpShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = idpShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = idpItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Search for a specific IdP server.
     * @param IdpFullDataPayload
     * @returns IdP entries that match with the search criteria
     */
    searchIdpEntries: build.mutation<BatchRPCResponse, IdpFullDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        // FETCH IDP DATA VIA "idp_find" COMMAND
        // Prepare search parameters
        const idpFindParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataIdpFind: Command = {
          method: "idp_find",
          params: [[searchValue], idpFindParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultIdpFind = await fetchWithBQ(
          getCommand(payloadDataIdpFind)
        );
        // Return possible errors
        if (getResultIdpFind.error) {
          return { error: getResultIdpFind.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseDataIdpFind = getResultIdpFind.data as FindRPCResponse;

        const idpIds: string[] = [];
        const idpItemsCount = responseDataIdpFind.result.result
          .length as number;

        for (let i = startIdx; i < idpItemsCount && i < stopIdx; i++) {
          const idpId = responseDataIdpFind.result.result[i] as cnType;
          const { cn } = idpId;
          idpIds.push(cn[0] as string);
        }

        // FETCH IDP DATA VIA "idp_show" COMMAND
        const commands: Command[] = [];
        idpIds.forEach((idpId) => {
          commands.push({
            method: "idp_show",
            params: [[idpId], {}],
          });
        });

        const idpShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = idpShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = idpItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Add a new IdP reference
     * @param {IdpAddPayload} - Payload with the new IdP data
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    idpAdd: build.mutation<FindRPCResponse, IdpAddPayload>({
      query: (payload) => {
        const payloadReceived: AddParams = {
          // cn: payload.cn,
          ipaidpclientid: payload.ipaidpclientid,
          // ipaidpprovider: payload.ipaidpprovider,
          version: payload.version || API_VERSION_BACKUP,
        };

        // Add optional fields if not undefined
        if (payload.ipaidpscope) {
          payloadReceived.ipaidpscope = payload.ipaidpscope;
        }
        if (payload.ipaidpsub) {
          payloadReceived.ipaidpsub = payload.ipaidpsub;
        }

        let params:
          | KeycloakOrRedHatSSOAddPayload
          | MicrosoftOrAzureAddPayload
          | CustomIdpAddPayload
          | AddParams = { ...payloadReceived };

        // The type of the payload will be determined by the 'ipaidpprovider' field
        if (payload.ipaidpprovider !== undefined) {
          if (
            payload.ipaidpprovider === "keycloak" ||
            payload.ipaidpprovider === "okta"
          ) {
            params = {
              ...payloadReceived,
              ipaidpprovider: payload.ipaidpprovider,
              ipaidporg: payload.keycloakRedHatData?.ipaidporg,
              ipaidpbaseurl: payload.keycloakRedHatData?.ipaidpbaseurl,
            } as KeycloakOrRedHatSSOAddPayload;
          } else if (payload.ipaidpprovider === "microsoft") {
            params = {
              ...payloadReceived,
              ipaidpprovider: payload.ipaidpprovider,
              ipaidporg: payload.microsoftAzureData?.ipaidporg,
            } as MicrosoftOrAzureAddPayload;
          } else if (
            payload.ipaidpprovider === "google" ||
            payload.ipaidpprovider === "github"
          ) {
            params = payloadReceived as AddParams;
            params.ipaidpprovider = payload.ipaidpprovider;
          }
        } else {
          // Custom IdP
          params = {
            ...payloadReceived,
            ipaidpauthendpoint: payload.customFields?.ipaidpauthendpoint,
            ipaidpdevauthendpoint: payload.customFields?.ipaidpdevauthendpoint,
            ipaidptokenendpoint: payload.customFields?.ipaidptokenendpoint,
            ipaidpuserinfoendpoint:
              payload.customFields?.ipaidpuserinfoendpoint,
            ipaidpkeysendpoint: payload.customFields?.ipaidpkeysendpoint,
          } as CustomIdpAddPayload;
        }

        return getCommand({
          method: "idp_add",
          params: [[payload.cn], params],
        });
      },
    }),
    /**
     * Delete identity provider references
     * @param {string[]} - Payload with the identity provider references IDs to delete
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    idpDelete: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = [];
        payload.forEach((idp) => {
          commands.push({
            method: "idp_del",
            params: [[idp], {}],
          });
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIdpEntriesQuery,
  useSearchIdpEntriesMutation,
  useIdpAddMutation,
  useIdpDeleteMutation,
} = extendedApi;
