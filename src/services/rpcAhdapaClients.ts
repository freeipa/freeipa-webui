/**
 * Ahdapa OAuth2 Client endpoints.
 *
 * API:
 * - GET    /api/admin/clients           → list all clients
 * - POST   /api/admin/clients           → create client
 * - GET    /api/admin/clients/:id       → get single client
 * - PUT    /api/admin/clients/:id       → update client
 * - DELETE /api/admin/clients/:id       → delete client
 */
import { ahdapaApi } from "./rpcAhdapa";
import {
  AhdapaClient,
  AhdapaCreateClientRequest,
} from "src/utils/datatypes/ahdapaDataTypes";

const extendedApi = ahdapaApi.injectEndpoints({
  endpoints: (build) => ({
    listAhdapaClients: build.query<AhdapaClient[], void>({
      query: () => ({ url: "/api/admin/clients" }),
      providesTags: ["AhdapaClients"],
    }),

    getAhdapaClient: build.query<AhdapaClient, string>({
      query: (clientId) => ({
        url: `/api/admin/clients/${encodeURIComponent(clientId)}`,
      }),
      providesTags: (_result, _error, clientId) => [
        { type: "AhdapaClient", id: clientId },
      ],
    }),

    createAhdapaClient: build.mutation<AhdapaClient, AhdapaCreateClientRequest>(
      {
        query: (body) => ({
          url: "/api/admin/clients",
          method: "POST",
          body,
        }),
        invalidatesTags: ["AhdapaClients"],
      }
    ),

    updateAhdapaClient: build.mutation<
      AhdapaClient,
      { clientId: string; body: AhdapaCreateClientRequest }
    >({
      query: ({ clientId, body }) => ({
        url: `/api/admin/clients/${encodeURIComponent(clientId)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { clientId }) => [
        "AhdapaClients",
        { type: "AhdapaClient", id: clientId },
      ],
    }),

    deleteAhdapaClient: build.mutation<void, string>({
      query: (clientId) => ({
        url: `/api/admin/clients/${encodeURIComponent(clientId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaClients"],
    }),

    deleteAhdapaClients: build.mutation<void, string[]>({
      async queryFn(clientIds, _queryApi, _extraOptions, fetchWithBQ) {
        for (const id of clientIds) {
          const result = await fetchWithBQ({
            url: `/api/admin/clients/${encodeURIComponent(id)}`,
            method: "DELETE",
          });
          if (result.error) {
            return { error: result.error };
          }
        }
        return { data: undefined };
      },
      invalidatesTags: ["AhdapaClients"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAhdapaClientsQuery,
  useGetAhdapaClientQuery,
  useUpdateAhdapaClientMutation,
  useDeleteAhdapaClientsMutation,
} = extendedApi;
