/**
 * Ahdapa SAML2 endpoints.
 *
 * API:
 * - CRUD /api/admin/saml2/sp   → Service Providers
 * - CRUD /api/admin/saml2/idp  → Upstream Identity Providers
 */
import { ahdapaApi } from "./rpcAhdapa";
import {
  AhdapaSaml2Sp,
  AhdapaCreateSaml2SpRequest,
  AhdapaSaml2Idp,
  AhdapaCreateSaml2IdpRequest,
} from "src/utils/datatypes/ahdapaDataTypes";

const extendedApi = ahdapaApi.injectEndpoints({
  endpoints: (build) => ({
    // ── SAML2 Service Providers ──
    listAhdapaSaml2Sps: build.query<AhdapaSaml2Sp[], void>({
      query: () => ({ url: "/api/admin/saml2/sp" }),
      providesTags: ["AhdapaSaml2Sps"],
    }),

    getAhdapaSaml2Sp: build.query<AhdapaSaml2Sp, string>({
      query: (entityId) => ({
        url: `/api/admin/saml2/sp/${encodeURIComponent(entityId)}`,
      }),
      providesTags: (_result, _error, entityId) => [
        { type: "AhdapaSaml2Sp", id: entityId },
      ],
    }),

    createAhdapaSaml2Sp: build.mutation<
      AhdapaSaml2Sp,
      AhdapaCreateSaml2SpRequest
    >({
      query: (body) => ({
        url: "/api/admin/saml2/sp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AhdapaSaml2Sps"],
    }),

    updateAhdapaSaml2Sp: build.mutation<
      AhdapaSaml2Sp,
      { entityId: string; body: Partial<AhdapaCreateSaml2SpRequest> }
    >({
      query: ({ entityId, body }) => ({
        url: `/api/admin/saml2/sp/${encodeURIComponent(entityId)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { entityId }) => [
        "AhdapaSaml2Sps",
        { type: "AhdapaSaml2Sp", id: entityId },
      ],
    }),

    deleteAhdapaSaml2Sp: build.mutation<void, string>({
      query: (entityId) => ({
        url: `/api/admin/saml2/sp/${encodeURIComponent(entityId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaSaml2Sps"],
    }),

    // ── SAML2 Upstream IdPs ──
    listAhdapaSaml2Idps: build.query<AhdapaSaml2Idp[], void>({
      query: () => ({ url: "/api/admin/saml2/idp" }),
      providesTags: ["AhdapaSaml2Idps"],
    }),

    getAhdapaSaml2Idp: build.query<AhdapaSaml2Idp, string>({
      query: (localId) => ({
        url: `/api/admin/saml2/idp/${encodeURIComponent(localId)}`,
      }),
      providesTags: (_result, _error, localId) => [
        { type: "AhdapaSaml2Idp", id: localId },
      ],
    }),

    createAhdapaSaml2Idp: build.mutation<
      AhdapaSaml2Idp,
      AhdapaCreateSaml2IdpRequest
    >({
      query: (body) => ({
        url: "/api/admin/saml2/idp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AhdapaSaml2Idps"],
    }),

    updateAhdapaSaml2Idp: build.mutation<
      AhdapaSaml2Idp,
      { localId: string; body: Partial<AhdapaCreateSaml2IdpRequest> }
    >({
      query: ({ localId, body }) => ({
        url: `/api/admin/saml2/idp/${encodeURIComponent(localId)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { localId }) => [
        "AhdapaSaml2Idps",
        { type: "AhdapaSaml2Idp", id: localId },
      ],
    }),

    deleteAhdapaSaml2Idp: build.mutation<void, string>({
      query: (localId) => ({
        url: `/api/admin/saml2/idp/${encodeURIComponent(localId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaSaml2Idps"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAhdapaSaml2SpsQuery,
  useGetAhdapaSaml2SpQuery,
  useCreateAhdapaSaml2SpMutation,
  useUpdateAhdapaSaml2SpMutation,
  useDeleteAhdapaSaml2SpMutation,
  useListAhdapaSaml2IdpsQuery,
  useGetAhdapaSaml2IdpQuery,
  useCreateAhdapaSaml2IdpMutation,
  useUpdateAhdapaSaml2IdpMutation,
  useDeleteAhdapaSaml2IdpMutation,
} = extendedApi;
