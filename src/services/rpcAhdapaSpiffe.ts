/**
 * Ahdapa SPIFFE Workload endpoints.
 *
 * API:
 * - CRUD /api/admin/spiffe/entries
 * - GET  /api/admin/spiffe/status
 * - CRUD /api/admin/spiffe/federation
 * - Lookups: /api/admin/spiffe/lookup/*
 */
import { ahdapaApi } from "./rpcAhdapa";
import {
  AhdapaSpiffeEntry,
  AhdapaSpiffeEntryRequest,
  AhdapaSpiffeStatus,
  AhdapaSpiffeFederationRelationship,
  AhdapaSpiffeFederationRequest,
  AhdapaLookupEntry,
} from "src/utils/datatypes/ahdapaDataTypes";

interface SpiffeLookupUser {
  value: string;
  label: string;
  uid_number: number | null;
}

interface SpiffeLookupGroup {
  value: string;
  label: string;
  gid_number: number | null;
}

const extendedApi = ahdapaApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Entries ──
    listAhdapaSpiffeEntries: build.query<AhdapaSpiffeEntry[], void>({
      query: () => ({ url: "/api/admin/spiffe/entries" }),
      providesTags: ["AhdapaSpiffeEntries"],
    }),

    getAhdapaSpiffeEntry: build.query<AhdapaSpiffeEntry, string>({
      query: (id) => ({
        url: `/api/admin/spiffe/entries/${encodeURIComponent(id)}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "AhdapaSpiffeEntry", id },
      ],
    }),

    createAhdapaSpiffeEntry: build.mutation<
      AhdapaSpiffeEntry,
      AhdapaSpiffeEntryRequest
    >({
      query: (body) => ({
        url: "/api/admin/spiffe/entries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AhdapaSpiffeEntries"],
    }),

    updateAhdapaSpiffeEntry: build.mutation<
      AhdapaSpiffeEntry,
      { id: string; body: AhdapaSpiffeEntryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/admin/spiffe/entries/${encodeURIComponent(id)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AhdapaSpiffeEntries",
        { type: "AhdapaSpiffeEntry", id },
      ],
    }),

    deleteAhdapaSpiffeEntry: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/spiffe/entries/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaSpiffeEntries"],
    }),

    // ── Status ──
    getAhdapaSpiffeStatus: build.query<AhdapaSpiffeStatus, void>({
      query: () => ({ url: "/api/admin/spiffe/status" }),
      providesTags: ["AhdapaSpiffeStatus"],
    }),

    // ── Federation Relationships ──
    listAhdapaSpiffeFederation: build.query<
      AhdapaSpiffeFederationRelationship[],
      void
    >({
      query: () => ({ url: "/api/admin/spiffe/federation" }),
      providesTags: ["AhdapaSpiffeFederation"],
    }),

    createAhdapaSpiffeFederation: build.mutation<
      AhdapaSpiffeFederationRelationship,
      AhdapaSpiffeFederationRequest
    >({
      query: (body) => ({
        url: "/api/admin/spiffe/federation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AhdapaSpiffeFederation"],
    }),

    deleteAhdapaSpiffeFederation: build.mutation<void, string>({
      query: (trustDomain) => ({
        url: `/api/admin/spiffe/federation/${encodeURIComponent(trustDomain)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaSpiffeFederation"],
    }),

    // ── Lookups ──
    lookupAhdapaSpiffeUsers: build.query<SpiffeLookupUser[], string>({
      query: (q) => ({
        url: `/api/admin/spiffe/lookup/users?q=${encodeURIComponent(q)}`,
      }),
    }),

    lookupAhdapaSpiffeGroups: build.query<SpiffeLookupGroup[], string>({
      query: (q) => ({
        url: `/api/admin/spiffe/lookup/groups?q=${encodeURIComponent(q)}`,
      }),
    }),

    lookupAhdapaSpiffeHostgroups: build.query<AhdapaLookupEntry[], string>({
      query: (q) => ({
        url: `/api/admin/spiffe/lookup/hostgroups?q=${encodeURIComponent(q)}`,
      }),
    }),

    lookupAhdapaSpiffeHostnames: build.query<AhdapaLookupEntry[], string>({
      query: (q) => ({
        url: `/api/admin/spiffe/lookup/hostnames?q=${encodeURIComponent(q)}`,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAhdapaSpiffeEntriesQuery,
  useGetAhdapaSpiffeEntryQuery,
  useCreateAhdapaSpiffeEntryMutation,
  useUpdateAhdapaSpiffeEntryMutation,
  useDeleteAhdapaSpiffeEntryMutation,
  useGetAhdapaSpiffeStatusQuery,
} = extendedApi;
