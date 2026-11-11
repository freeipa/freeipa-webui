/**
 * Ahdapa OAuth2 Scope endpoints.
 *
 * API:
 * - GET    /api/admin/scopes           → list scopes
 * - PUT    /api/admin/scopes/:name     → update scope
 * - DELETE /api/admin/scopes/:name     → delete scope
 */
import { ahdapaApi } from "./rpcAhdapa";
import { AhdapaScopeDefinition } from "src/utils/datatypes/ahdapaDataTypes";

const extendedApi = ahdapaApi.injectEndpoints({
  endpoints: (build) => ({
    listAhdapaScopes: build.query<AhdapaScopeDefinition[], void>({
      query: () => ({ url: "/api/admin/scopes" }),
      providesTags: ["AhdapaScopes"],
    }),

    updateAhdapaScope: build.mutation<
      AhdapaScopeDefinition,
      { name: string; description: string; claims: string[] }
    >({
      query: ({ name, ...body }) => ({
        url: `/api/admin/scopes/${encodeURIComponent(name)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AhdapaScopes"],
    }),

    deleteAhdapaScope: build.mutation<void, string>({
      query: (name) => ({
        url: `/api/admin/scopes/${encodeURIComponent(name)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaScopes"],
    }),
  }),
  overrideExisting: false,
});

export const { useListAhdapaScopesQuery, useDeleteAhdapaScopeMutation } =
  extendedApi;
