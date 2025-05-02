import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  getCommand,
} from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
import { apiToCertificateMapping } from "src/utils/certMappingUtils";
// Data types
import {
  CertificateMapping,
  CertificateMappingConfig,
  cnType,
} from "src/utils/datatypes/globalDataTypes";

/**
 * Password policies-related endpoints: useCertMapRuleFindQuery, useGetCertMapRuleEntriesQuery,
 *                             useSearchCertMapRuleEntriesMutation, useCertMapConfigFindQuery,
 *                             useCertMapConfigModMutation, useMatchCertificateMutation,
 *                             useCertMapShowQuery, useCertMapRuleModMutation, useCertMapRuleDisableMutation,
 *                             useCertMapRuleEnableMutation
 *
 * API commands:
 * - certmaprule_find: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmaprule_find.html
 * - certmaprule_show: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmaprule_show.html
 * - certmapconfig_show: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmapconfig_show.html
 * - certmapconfig_mod: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmapconfig_mod.html
 * - certmap_match: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmap_match.html
 * - certmaprule_mod: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmaprule_mod.html
 * - cert_find: https://freeipa.readthedocs.io/en/ipa-4-11/api/cert_find.html
 * - certmaprule_show: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmaprule_show.html
 * - certmaprule_disable: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmaprule_disable.html
 * - certmaprule_enable: https://freeipa.readthedocs.io/en/ipa-4-11/api/certmaprule_enable.html
 */

export interface CertMapFindPayload {
  searchValue: string;
  pkeyOnly: boolean;
  sizeLimit: number;
  version?: string;
}

export interface CertMapFullDataPayload {
  searchValue: string;
  apiVersion: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

export interface CertMapConfigPayload {
  ipacertmappromptusername: boolean;
}

export interface CertModPayload {
  ruleId: string;
  description?: string;
  ipacertmapmaprule?: string;
  ipacertmapmatchrule?: string;
  associateddomain?: string[];
  ipacertmappriority?: number;
}

export interface CertMapRuleAddPayload {
  ruleId: string;
  description?: string;
  ipacertmapmaprule?: string;
  ipacertmapmatchrule?: string;
  associateddomain?: string[];
  ipacertmappriority?: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get certificate mapping IDs
     * @param {CertMapFindPayload} - Payload with search value and options
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     *
     */
    certMapRuleFind: build.query<FindRPCResponse, CertMapFindPayload>({
      query: (payload) => {
        const certmapruleParams = {
          pkey_only: payload.pkeyOnly,
          sizelimit: payload.sizeLimit,
          version: payload.version || API_VERSION_BACKUP,
        };

        return getCommand({
          method: "certmaprule_find",
          params: [[payload.searchValue], certmapruleParams],
        });
      },
    }),
    /**
     * Find certificate mapping full data.
     * @param CertMapFullDataPayload
     * @returns List of certificate mapping entries
     *
     */
    getCertMapRuleEntries: build.query<
      BatchRPCResponse,
      CertMapFullDataPayload
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

        // FETCH CERT. MAPPING DATA VIA "certmaprule_find" COMMAND
        // Prepare search parameters
        const certMapIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataCertMap: Command = {
          method: "certmaprule_find",
          params: [[searchValue], certMapIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultCertMap = await fetchWithBQ(
          getCommand(payloadDataCertMap)
        );
        // Return possible errors
        if (getResultCertMap.error) {
          return { error: getResultCertMap.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataCertMap = getResultCertMap.data as FindRPCResponse;

        const certMapIds: string[] = [];
        const certMapItemsCount = responseDataCertMap.result.result
          .length as number;

        for (let i = startIdx; i < certMapItemsCount && i < stopIdx; i++) {
          const certMapId = responseDataCertMap.result.result[i] as cnType;
          const { cn } = certMapId;
          certMapIds.push(cn[0] as string);
        }

        // FETCH CERT. MAPPING DATA VIA "certmaprule_show" COMMAND
        const commands: Command[] = [];
        certMapIds.forEach((certMapId) => {
          commands.push({
            method: "certmaprule_show",
            params: [[certMapId], {}],
          });
        });

        const certMapShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = certMapShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = certMapItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Search for a specific password policy.
     * @param CertMapFullDataPayload
     * @returns Certificate mapping entries that match with the search criteria
     */
    searchCertMapRuleEntries: build.mutation<
      BatchRPCResponse,
      CertMapFullDataPayload
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

        // FETCH CERT. MAPPING DATA VIA "certmaprule_find" COMMAND
        // Prepare search parameters
        const certMapIdsParams = {
          pkey_only: true,
          sizelimit: sizelimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataCertMap: Command = {
          method: "certmaprule_find",
          params: [[searchValue], certMapIdsParams],
        };

        // Make call using 'fetchWithBQ'
        const getResultCertMap = await fetchWithBQ(
          getCommand(payloadDataCertMap)
        );
        // Return possible errors
        if (getResultCertMap.error) {
          return { error: getResultCertMap.error };
        }
        // If no error: cast and assign 'ids'
        const responseDataCertMap = getResultCertMap.data as FindRPCResponse;

        const certMapIds: string[] = [];
        const certMapItemsCount = responseDataCertMap.result.result
          .length as number;

        for (let i = startIdx; i < certMapItemsCount && i < stopIdx; i++) {
          const certMapId = responseDataCertMap.result.result[i] as cnType;
          const { cn } = certMapId;
          certMapIds.push(cn[0] as string);
        }

        // FETCH CERT. MAPPING DATA VIA "certmaprule_show" COMMAND
        const commands: Command[] = [];
        certMapIds.forEach((certMapId) => {
          commands.push({
            method: "certmaprule_show",
            params: [[certMapId], {}],
          });
        });

        const certMapShowResult = await fetchWithBQ(
          getBatchCommand(commands, apiVersion)
        );

        const response = certMapShowResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = certMapItemsCount;
        }

        // Return results
        return { data: response };
      },
    }),
    /**
     * Get certificate mapping global configuration
     * @param {void} - No payload
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    certMapConfigFind: build.query<CertificateMappingConfig, void>({
      query: () => {
        return getCommand({
          method: "certmapconfig_show",
          params: [
            [],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse) => {
        // Create a new object with the converted value
        return response.result.result as unknown as CertificateMappingConfig;
      },
    }),
    /**
     * Modify certificate mapping global configuration
     * @param {CertMapConfigPayload} - Data to modify
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    certMapConfigMod: build.mutation<FindRPCResponse, CertMapConfigPayload>({
      query: (payload) => {
        const certMapConfigParams = {
          ipacertmappromptusername: payload.ipacertmappromptusername,
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
        };
        return getCommand({
          method: "certmapconfig_mod",
          params: [[], certMapConfigParams],
        });
      },
    }),
    /**
     * Match certificate
     * @param {string} - Certificate to match
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    matchCertificate: build.mutation<BatchRPCResponse, string>({
      query: (certificate) => {
        const matchCertificateCommands: Command[] = [
          {
            method: "certmap_match",
            params: [[certificate], {}],
          },
          {
            method: "cert_find",
            params: [[], { all: true, certificate: certificate }],
          },
        ];
        return getBatchCommand(matchCertificateCommands, API_VERSION_BACKUP);
      },
    }),
    /**
     * Show certificate mapping rule
     * @param {string} - Certificate mapping rule ID
     * @returns {CertificateMapping} - Certificate mapping rule data
     */
    certMapShow: build.query<CertificateMapping, string>({
      query: (certmapId) => {
        return getCommand({
          method: "certmaprule_show",
          params: [
            [certmapId],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse) => {
        const certMapping = apiToCertificateMapping(response.result.result);
        return certMapping;
      },
    }),
    /**
     * Update a specific Certificate mapping rule.
     * @param CertModPayload
     * @returns FindRPCResponse
     */
    certMapRuleMod: build.mutation<FindRPCResponse, CertModPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
        };

        const optionalKeys: Array<keyof Omit<CertModPayload, "ruleId">> = [
          "description",
          "ipacertmapmaprule",
          "ipacertmapmatchrule",
          "associateddomain",
          "ipacertmappriority",
        ];

        optionalKeys.forEach((key) => {
          const value = payload[key];
          if (value !== undefined) {
            params[key] = value.toString();
          }
        });

        return getCommand({
          method: "certmaprule_mod",
          params: [[payload.ruleId], params],
        });
      },
    }),
    /**
     * Disable certificate mapping rule
     * @param {string} - Certificate mapping rule ID
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    certMapRuleDisable: build.mutation<FindRPCResponse, string>({
      query: (certmapId) => {
        return getCommand({
          method: "certmaprule_disable",
          params: [[certmapId], { version: API_VERSION_BACKUP }],
        });
      },
    }),
    /**
     * Enable certificate mapping rule
     * @param {string} - Certificate mapping rule ID
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    certMapRuleEnable: build.mutation<FindRPCResponse, string>({
      query: (certmapId) => {
        return getCommand({
          method: "certmaprule_enable",
          params: [[certmapId], { version: API_VERSION_BACKUP }],
        });
      },
    }),
    /**
     * Delete certificate mapping rule
     * @param {string} - Certificate mapping rule ID
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    certMapRuleDelete: build.mutation<FindRPCResponse, string>({
      query: (certmapId) => {
        return getCommand({
          method: "certmaprule_del",
          params: [[certmapId], { version: API_VERSION_BACKUP }],
        });
      },
    }),
    /**
     * Add certificate mapping rule
     * @param {CertMapRuleAddPayload} - Add payload
     * @returns {Promise<FindRPCResponse>} - Promise with the response data
     */
    certMapRuleAdd: build.mutation<FindRPCResponse, CertMapRuleAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };

        const optionalKeys: Array<keyof Omit<CertMapRuleAddPayload, "ruleId">> =
          [
            "description",
            "ipacertmapmaprule",
            "ipacertmapmatchrule",
            "associateddomain",
            "ipacertmappriority",
          ];

        optionalKeys.forEach((key) => {
          const value = payload[key];
          if (value !== undefined) {
            params[key] = value.toString();
          }
        });

        return getCommand({
          method: "certmaprule_add",
          params: [[payload.ruleId], params],
        });
      },
    }),
    /**
     * Delete multiple certificate mapping rules
     * @param {string[]} - Certificate mapping rule IDs
     * @returns {Promise<BatchRPCResponse>} - Promise with the response data
     */
    multipleCertMapRuleDelete: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = [];
        payload.forEach((certmapId) => {
          commands.push({
            method: "certmaprule_del",
            params: [[certmapId], {}],
          });
        });

        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCertMapRuleFindQuery,
  useGetCertMapRuleEntriesQuery,
  useSearchCertMapRuleEntriesMutation,
  useCertMapConfigFindQuery,
  useCertMapConfigModMutation,
  useMatchCertificateMutation,
  useCertMapShowQuery,
  useCertMapRuleModMutation,
  useCertMapRuleDisableMutation,
  useCertMapRuleEnableMutation,
  useCertMapRuleDeleteMutation,
  useCertMapRuleAddMutation,
  useMultipleCertMapRuleDeleteMutation,
} = extendedApi;
