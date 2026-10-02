/**
 * Ahdapa Federation endpoints.
 *
 * API:
 * - Federated Accounts: CRUD /api/admin/federated-accounts
 * - Federation Policies: CRUD /api/admin/federation-policies
 * - IPA Upstream IdPs:   GET/PUT /api/admin/federation/ipa-idps
 */
import { ahdapaApi } from "./rpcAhdapa";
import {
  AhdapaFederatedAccount,
  AhdapaCreateFederatedAccountRequest,
  AhdapaFederationPolicy,
  AhdapaCreateFederationPolicyRequest,
  AhdapaIpaIdp,
  AhdapaIpaIdpOverrideRequest,
} from "src/utils/datatypes/ahdapaDataTypes";

const extendedApi = ahdapaApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Federated Accounts ──
    listAhdapaFederatedAccounts: build.query<AhdapaFederatedAccount[], void>({
      query: () => ({ url: "/api/admin/federated-accounts" }),
      providesTags: ["AhdapaFederatedAccounts"],
    }),

    createAhdapaFederatedAccount: build.mutation<
      AhdapaFederatedAccount,
      AhdapaCreateFederatedAccountRequest
    >({
      query: (body) => ({
        url: "/api/admin/federated-accounts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AhdapaFederatedAccounts"],
    }),

    deleteAhdapaFederatedAccount: build.mutation<void, number>({
      query: (id) => ({
        url: `/api/admin/federated-accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaFederatedAccounts"],
    }),

    // ── Federation Policies ──
    listAhdapaFederationPolicies: build.query<AhdapaFederationPolicy[], void>({
      query: () => ({ url: "/api/admin/federation-policies" }),
      providesTags: ["AhdapaFederationPolicies"],
    }),

    getAhdapaFederationPolicy: build.query<AhdapaFederationPolicy, string>({
      query: (key) => ({
        url: `/api/admin/federation-policies/${encodeURIComponent(key)}`,
      }),
      providesTags: (_result, _error, key) => [
        { type: "AhdapaFederationPolicy", id: key },
      ],
    }),

    createAhdapaFederationPolicy: build.mutation<
      AhdapaFederationPolicy,
      AhdapaCreateFederationPolicyRequest
    >({
      query: (body) => ({
        url: "/api/admin/federation-policies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AhdapaFederationPolicies"],
    }),

    updateAhdapaFederationPolicy: build.mutation<
      AhdapaFederationPolicy,
      { key: string; body: AhdapaCreateFederationPolicyRequest }
    >({
      query: ({ key, body }) => ({
        url: `/api/admin/federation-policies/${encodeURIComponent(key)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { key }) => [
        "AhdapaFederationPolicies",
        { type: "AhdapaFederationPolicy", id: key },
      ],
    }),

    deleteAhdapaFederationPolicy: build.mutation<void, string>({
      query: (key) => ({
        url: `/api/admin/federation-policies/${encodeURIComponent(key)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaFederationPolicies"],
    }),

    // ── IPA Upstream IdPs ──
    listAhdapaIpaIdps: build.query<AhdapaIpaIdp[], void>({
      query: () => ({ url: "/api/admin/federation/ipa-idps" }),
      providesTags: ["AhdapaIpaIdps"],
    }),

    getAhdapaIpaIdp: build.query<AhdapaIpaIdp, string>({
      query: (id) => ({
        url: `/api/admin/federation/ipa-idps/${encodeURIComponent(id)}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "AhdapaIpaIdp", id }],
    }),

    updateAhdapaIpaIdpOverrides: build.mutation<
      AhdapaIpaIdp,
      { id: string; body: AhdapaIpaIdpOverrideRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/admin/federation/ipa-idps/${encodeURIComponent(id)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AhdapaIpaIdps",
        { type: "AhdapaIpaIdp", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAhdapaFederatedAccountsQuery,
  useCreateAhdapaFederatedAccountMutation,
  useDeleteAhdapaFederatedAccountMutation,
  useListAhdapaFederationPoliciesQuery,
  useGetAhdapaFederationPolicyQuery,
  useCreateAhdapaFederationPolicyMutation,
  useUpdateAhdapaFederationPolicyMutation,
  useDeleteAhdapaFederationPolicyMutation,
  useListAhdapaIpaIdpsQuery,
  useGetAhdapaIpaIdpQuery,
  useUpdateAhdapaIpaIdpOverridesMutation,
} = extendedApi;
