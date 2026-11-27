/**
 * Base RTK Query API for ahdapa REST endpoints.
 *
 * Ahdapa exposes a standard REST/JSON API at /idp/api/ (in co-deployed setups)
 * or at the configured ahdapa base URL. This service provides the foundational
 * createApi instance that all ahdapa endpoint modules inject into.
 *
 * Unlike the IPA JSON-RPC API (src/services/rpc.ts), ahdapa uses
 * GET/POST/PUT/PATCH/DELETE with JSON request/response bodies.
 */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base query for the ahdapa REST API.
 *
 * In a co-deployed FreeIPA + ahdapa setup, Apache proxies /idp/* to the
 * ahdapa process. The API lives at /idp/api/.
 */
const ahdapaBaseQuery = fetchBaseQuery({ baseUrl: "/idp" });

/**
 * Custom base query that handles ahdapa auth (SPNEGO negotiation on 401)
 * and error formatting.
 */
const ahdapaBaseQueryWithAuth: typeof ahdapaBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await ahdapaBaseQuery(args, api, extraOptions);

  // On 401, attempt SPNEGO negotiation and retry
  if (result.error && result.error.status === 401) {
    const negotiateResult = await ahdapaBaseQuery(
      {
        url: "/api/auth/negotiate",
        method: "GET",
        credentials: "include",
      },
      api,
      extraOptions
    );

    if (!negotiateResult.error) {
      // SPNEGO succeeded, retry original request
      result = await ahdapaBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

/**
 * Ahdapa RTK Query API instance.
 *
 * All ahdapa service modules (rpcAhdapaClients, rpcAhdapaHbac, etc.)
 * inject their endpoints into this API using `ahdapaApi.injectEndpoints()`.
 */
export const ahdapaApi = createApi({
  reducerPath: "ahdapaApi",
  baseQuery: ahdapaBaseQueryWithAuth,
  keepUnusedDataFor: 0,
  tagTypes: [
    "AhdapaClients",
    "AhdapaClient",
    "AhdapaScopes",
    "AhdapaKeys",
    "AhdapaNodes",
    "AhdapaAudit",
    "AhdapaHBACRules",
    "AhdapaHBACRule",
    "AhdapaRefreshFamilies",
    "AhdapaFederatedAccounts",
    "AhdapaFederationPolicies",
    "AhdapaFederationPolicy",
    "AhdapaIpaIdps",
    "AhdapaIpaIdp",
    "AhdapaSpiffeEntries",
    "AhdapaSpiffeEntry",
    "AhdapaSpiffeStatus",
    "AhdapaSpiffeFederation",
    "AhdapaSaml2Sps",
    "AhdapaSaml2Sp",
    "AhdapaSaml2Idps",
    "AhdapaSaml2Idp",
    "AhdapaUsers",
    "AhdapaGroups",
    "AhdapaAuthInfo",
    "AhdapaProfile",
    "AhdapaRegistrationTokens",
    "AhdapaNodeStats",
  ],
  endpoints: (build) => ({
    /**
     * Probe ahdapa availability.
     * Calls GET /api/auth/info which does not require authentication.
     */
    getAhdapaAuthInfo: build.query<
      { display_name: string; realm: string; gssapi?: boolean },
      void
    >({
      query: () => ({ url: "/api/auth/info" }),
      providesTags: ["AhdapaAuthInfo"],
    }),

    /**
     * Get the current user's ahdapa profile (roles, permissions).
     */
    getAhdapaProfile: build.query<
      {
        sub: string;
        username: string;
        roles: string[];
        permissions: string[];
      },
      void
    >({
      query: () => ({ url: "/api/auth/profile" }),
      providesTags: ["AhdapaProfile"],
    }),
  }),
});

export const { useGetAhdapaAuthInfoQuery } = ahdapaApi;
