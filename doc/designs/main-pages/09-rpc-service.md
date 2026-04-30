# Main Pages — RPC Service File

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Overview](01-overview.md) | [Routing & Conventions](10-routing-and-conventions.md)

Create `src/services/rpcMyEntities.ts` with RTK Query endpoints. This file defines how the WebUI communicates with the FreeIPA JSON-RPC API.

**FreeIPA API reference:** https://freeipa.readthedocs.io/en/latest/api/commands.html. Each entity typically provides a standard set of commands following the pattern `<entity>_<action>` (e.g. `host_find`, `host_show`, `host_add`, `host_del`, `host_mod`).

## Important: `rpc.ts` vs `rpc<Entity>.ts`

**All entity-specific endpoints must be defined in a dedicated `src/services/rpc<Entity>.ts` file**, never in `src/services/rpc.ts`. The base `rpc.ts` file is reserved for shared/generic infrastructure only:
- The base `createApi` definition and tag types
- Generic payloads (`GenericPayload`) and shared types (`Command`, `BatchRPCResponse`, etc.)
- The generic `useSearchEntriesMutation` and `useGettingGenericQuery` hooks
- Shared helper functions (`getCommand`, `getBatchCommand`)

When creating a new entity, the only changes to `rpc.ts` should be:
1. Adding the entity's `entryType` value to the `GenericPayload` union (if using the generic search mutation)
2. Adding a cache tag to `tagTypes` (if the entity-specific service file uses `providesTags` / `invalidatesTags`)

Entity-specific queries, mutations, and hooks are defined using `api.injectEndpoints()` in the entity's own file (e.g. `rpcHBACRules.ts`, `rpcTrusts.ts`, `rpcSelinuxUserMaps.ts`).

## Minimum Endpoints for a Main Page

A main page needs at least a **query** for listing entries and either uses the generic `useSearchEntriesMutation` from `rpc.ts` or defines its own **search mutation**.

## Template

```tsx
// src/services/rpcMyEntities.ts
import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { MyEntity } from "../utils/datatypes/globalDataTypes";
import { apiToMyEntity } from "src/utils/myEntitiesUtils";

/**
 * MyEntity-related endpoints
 *
 * API commands:
 * - myentity_find: https://freeipa.readthedocs.io/en/latest/api/myentity_find.html
 * - myentity_show: https://freeipa.readthedocs.io/en/latest/api/myentity_show.html
 * - myentity_add:  https://freeipa.readthedocs.io/en/latest/api/myentity_add.html
 * - myentity_del:  https://freeipa.readthedocs.io/en/latest/api/myentity_del.html
 * - myentity_mod:  https://freeipa.readthedocs.io/en/latest/api/myentity_mod.html
 */

interface MyEntitiesFullDataPayload {
  searchValue: string;
  apiVersion?: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

export interface MyEntityAddPayload {
  cn: string;           // primary key
  description?: string;
  // Add fields matching the IPA `myentity_add` command parameters...
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List entities: two-step find+show pattern
     * 1. Call `myentity_find` with pkey_only to get IDs
     * 2. Batch call `myentity_show` for the paginated slice
     */
    getMyEntitiesFullData: build.query<BatchRPCResponse, MyEntitiesFullDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } = payloadData;
        const apiVersionUsed = apiVersion || API_VERSION_BACKUP;

        // Step 1: Find IDs
        const findCommand: Command = {
          method: "myentity_find",
          params: [[searchValue], { pkey_only: true, sizelimit, version: apiVersionUsed }],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));
        if (findResult.error) return { error: findResult.error };

        const findResponse = findResult.data as FindRPCResponse;
        const totalCount = findResponse.result.result.length;
        const ids: string[] = [];

        for (let i = startIdx; i < totalCount && i < stopIdx; i++) {
          const item = findResponse.result.result[i] as Record<string, unknown>;
          ids.push((item.cn as string[])[0]); // Use the entity's PK field
        }

        // Step 2: Batch show
        const showCommands: Command[] = ids.map((id) => ({
          method: "myentity_show",
          params: [[id], {}],
        }));

        const showResult = await fetchWithBQ(getBatchCommand(showCommands, apiVersionUsed));
        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalCount;
        }

        return { data: response };
      },
    }),

    /**
     * Search entities (mutation variant for explicit search submit)
     */
    searchMyEntitiesEntries: build.mutation<BatchRPCResponse, MyEntitiesFullDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        // Same two-step pattern as the query above
        // ...
      },
    }),

    /**
     * Add a new entity via `myentity_add`
     */
    addMyEntity: build.mutation<FindRPCResponse, MyEntityAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };
        if (payload.description) params.description = payload.description;
        // Map additional optional fields...

        return getCommand({
          method: "myentity_add",
          params: [[payload.cn], params],
        });
      },
    }),

    /**
     * Delete entities via batch `myentity_del`
     */
    deleteMyEntities: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = payload.map((id) => ({
          method: "myentity_del",
          params: [[id], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    /**
     * Show a single entity via `myentity_show` (for detail/settings pages)
     */
    myEntityShow: build.query<FindRPCResponse, string>({
      query: (entityId) => {
        return getCommand({
          method: "myentity_show",
          params: [[entityId], { all: true, rights: true }],
        });
      },
    }),

    /**
     * Modify an entity via `myentity_mod` (for settings pages)
     */
    myEntityMod: build.mutation<FindRPCResponse, Record<string, unknown>>({
      query: (payload) => {
        const { cn, ...rest } = payload;
        return getCommand({
          method: "myentity_mod",
          params: [[cn], { ...rest, all: true, rights: true, version: API_VERSION_BACKUP }],
        });
      },
    }),
  }),
  overrideExisting: false,
});

// Export the generated hooks
export const {
  useGetMyEntitiesFullDataQuery,
  useSearchMyEntitiesEntriesMutation,
  useAddMyEntityMutation,
  useDeleteMyEntitiesMutation,
  useMyEntityShowQuery,
  useMyEntityModMutation,
} = extendedApi;
```

## FreeIPA API Command Naming Convention

Most IPA entities follow a standard set of commands. Replace `<entity>` with the IPA object name (e.g. `host`, `hbacrule`, `trust`, `dnszone`):

| Command | Purpose | Used by |
|---------|---------|---------|
| `<entity>_find` | Search/list entries | Main page (list query) |
| `<entity>_show` | Get single entry details | Main page (batch show) + Settings page |
| `<entity>_add` | Create a new entry | Add modal |
| `<entity>_del` | Delete entries | Delete modal |
| `<entity>_mod` | Modify an entry | Settings page save |
| `<entity>_enable` | Enable an entry | Enable/Disable modal (optional) |
| `<entity>_disable` | Disable an entry | Enable/Disable modal (optional) |

Full command list: https://freeipa.readthedocs.io/en/latest/api/commands.html
Individual command docs: `https://freeipa.readthedocs.io/en/latest/api/<entity>_<action>.html`

## Existing RPC Service Examples

| Entity | Service file | Key hooks |
|--------|-------------|-----------|
| Hosts | `src/services/rpcHosts.ts` | `useGettingHostQuery`, `useAutoMemberRebuildHostsMutation` |
| Trusts | `src/services/rpcTrusts.ts` | `useGetTrustsFullDataQuery`, `useSearchTrustsEntriesMutation`, `useAddTrustMutation` |
| DNS Zones | `src/services/rpcDnsZones.ts` | `useGetDnsZonesFullDataQuery`, `useSearchDnsZonesEntriesMutation` |
| HBAC Rules | `src/services/rpcHBACRules.ts` | `useGettingHbacRulesQuery` |
