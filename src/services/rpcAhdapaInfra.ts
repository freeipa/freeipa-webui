/**
 * Ahdapa Signing Keys, Cluster Nodes, and Audit endpoints.
 *
 * API:
 * - GET  /api/admin/keys              → list signing keys
 * - POST /api/admin/keys/rotate       → rotate keys
 * - GET  /api/admin/nodes             → list cluster nodes
 * - POST /api/admin/nodes/seed        → seed a peer node
 * - GET  /api/gossip/stats            → gossip runtime stats
 * - GET  /api/admin/audit             → list audit events
 * - GET  /api/admin/refresh-families  → list refresh families
 * - DELETE /api/admin/refresh-families/:id → revoke family
 */
import { ahdapaApi } from "./rpcAhdapa";
import {
  AhdapaSigningKey,
  AhdapaNode,
  AhdapaNodeStats,
  AhdapaAuditEvent,
  AhdapaRefreshFamily,
} from "src/utils/datatypes/ahdapaDataTypes";

const extendedApi = ahdapaApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Signing Keys ──
    listAhdapaKeys: build.query<AhdapaSigningKey[], void>({
      query: () => ({ url: "/api/admin/keys" }),
      providesTags: ["AhdapaKeys"],
    }),

    rotateAhdapaKey: build.mutation<AhdapaSigningKey, void>({
      query: () => ({
        url: "/api/admin/keys/rotate",
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["AhdapaKeys"],
    }),

    // ── Cluster Nodes ──
    listAhdapaNodes: build.query<AhdapaNode[], void>({
      query: () => ({ url: "/api/admin/nodes" }),
      providesTags: ["AhdapaNodes"],
    }),

    getAhdapaNodeStats: build.query<AhdapaNodeStats | null, void>({
      query: () => ({ url: "/api/gossip/stats" }),
      providesTags: ["AhdapaNodeStats"],
      transformErrorResponse: () => null,
    }),

    // ── Audit ──
    listAhdapaAuditEvents: build.query<AhdapaAuditEvent[], number | void>({
      query: (offset) => ({
        url: `/api/admin/audit${offset ? `?offset=${offset}` : ""}`,
      }),
      transformResponse: (
        response:
          | { events: AhdapaAuditEvent[]; total_since_startup: number }
          | AhdapaAuditEvent[]
      ) => {
        if (Array.isArray(response)) return response;
        return response.events;
      },
      providesTags: ["AhdapaAudit"],
    }),

    // ── Refresh Families ──
    listAhdapaRefreshFamilies: build.query<AhdapaRefreshFamily[], void>({
      query: () => ({ url: "/api/admin/refresh-families" }),
      providesTags: ["AhdapaRefreshFamilies"],
    }),

    revokeAhdapaRefreshFamily: build.mutation<void, string>({
      query: (familyId) => ({
        url: `/api/admin/refresh-families/${encodeURIComponent(familyId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AhdapaRefreshFamilies"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAhdapaKeysQuery,
  useRotateAhdapaKeyMutation,
  useListAhdapaNodesQuery,
  useGetAhdapaNodeStatsQuery,
  useListAhdapaAuditEventsQuery,
} = extendedApi;
