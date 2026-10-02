/**
 * Ahdapa Identity HBAC Policy endpoints.
 *
 * API:
 * - GET    /api/admin/hbac           → list HBAC rules
 * - POST   /api/admin/hbac           → create rule
 * - GET    /api/admin/hbac/:id       → get rule detail
 * - PUT    /api/admin/hbac/:id       → patch rule
 * - DELETE /api/admin/hbac/:id       → delete rule
 * - GET    /api/admin/hbac/lookup/*  → lookup users/groups/hosts/services/clients
 */
import { ahdapaApi } from "./rpcAhdapa";
import {
  AhdapaHBACRuleInfo,
  AhdapaHBACRuleDetail,
  AhdapaHBACPatchRequest,
  AhdapaLookupEntry,
} from "src/utils/datatypes/ahdapaDataTypes";

const extendedApi = ahdapaApi.injectEndpoints({
  endpoints: (build) => ({
    listAhdapaHBACRules: build.query<AhdapaHBACRuleInfo[], void>({
      query: () => ({ url: "/api/admin/hbac" }),
      providesTags: ["AhdapaHBACRules"],
    }),

    getAhdapaHBACRule: build.query<AhdapaHBACRuleDetail, string>({
      query: (id) => ({
        url: `/api/admin/hbac/${encodeURIComponent(id)}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "AhdapaHBACRule", id }],
    }),

    createAhdapaHBACRule: build.mutation<
      { id: string },
      { name: string; description: string }
    >({
      query: (body) => ({
        url: "/api/admin/hbac",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AhdapaHBACRules"],
    }),

    patchAhdapaHBACRule: build.mutation<
      AhdapaHBACRuleDetail,
      { id: string; body: AhdapaHBACPatchRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/admin/hbac/${encodeURIComponent(id)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AhdapaHBACRules",
        { type: "AhdapaHBACRule", id },
      ],
    }),

    deleteAhdapaHBACRule: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/hbac/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaHBACRules"],
    }),

    // Lookup endpoints for HBAC rule membership editing
    lookupAhdapaHBACUsers: build.query<AhdapaLookupEntry[], string>({
      query: (q) => ({
        url: `/api/admin/hbac/lookup/users?q=${encodeURIComponent(q)}`,
      }),
    }),

    lookupAhdapaHBACGroups: build.query<AhdapaLookupEntry[], string>({
      query: (q) => ({
        url: `/api/admin/hbac/lookup/groups?q=${encodeURIComponent(q)}`,
      }),
    }),

    lookupAhdapaHBACHosts: build.query<AhdapaLookupEntry[], string>({
      query: (q) => ({
        url: `/api/admin/hbac/lookup/hosts?q=${encodeURIComponent(q)}`,
      }),
    }),

    lookupAhdapaHBACServices: build.query<AhdapaLookupEntry[], string>({
      query: (q) => ({
        url: `/api/admin/hbac/lookup/services?q=${encodeURIComponent(q)}`,
      }),
    }),

    lookupAhdapaHBACClients: build.query<AhdapaLookupEntry[], string>({
      query: (q) => ({
        url: `/api/admin/hbac/lookup/clients?q=${encodeURIComponent(q)}`,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAhdapaHBACRulesQuery,
  useGetAhdapaHBACRuleQuery,
  useCreateAhdapaHBACRuleMutation,
  usePatchAhdapaHBACRuleMutation,
  useDeleteAhdapaHBACRuleMutation,
} = extendedApi;
