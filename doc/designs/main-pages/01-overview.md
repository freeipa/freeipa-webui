# Main Pages — Overview & Generating a New Page

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Structure & Anatomy](02-structure-and-anatomy.md) | [Checklist](06-checklist-and-types.md)

A main page is the top-level landing page for an entity (e.g. Active Users, Hosts, DNS Zones). It displays a searchable, paginated table with bulk selection, toolbar actions, and modals for add/delete operations.

Main pages live under `src/pages/<EntityName>/` and are named after the entity itself (e.g. `Hosts.tsx`, `DnsZones.tsx`). Files with suffixes like `Settings`, `Tabs`, `Table`, or `PreSettings` are **not** main pages — they are sub-components consumed by main pages or detail views.

## Generating a New Main Page Using This Guide

This guide is designed to be used as context in AI-assisted prompts. To generate a complete main page, provide the following input alongside this file.

### Required input

| Input | Description | Example |
|-------|-------------|---------|
| **Entity name** | Human-readable name (drives component names, file names, page title) | `HBAC Service Groups` |
| **FreeIPA API object** | The IPA command prefix (determines RPC methods like `*_find`, `*_show`, etc.). Look it up at the [IPA API commands list](https://freeipa.readthedocs.io/en/latest/api/commands.html) | `hbacsvcgroup` |
| **Primary key field** | LDAP attribute that uniquely identifies each entry | `cn` |
| **Table columns** | Fields to display and their labels | `cn` → "Name", `description` → "Description" |
| **Navigation placement** | Sidebar section and sub-group where the page appears | Policy > Host-based access control |
| **Route path** | Kebab-case URL segment | `hbac-service-groups` |
| **RPC service file** | The `src/services/rpc<Entity>.ts` file that defines the RTK Query endpoints for this entity. See "RPC Service file" below | `src/services/rpcHBACServiceGroups.ts` |
| **Add modal fields** | Fields shown in the Add modal, each with: field name (IPA attribute), label, data type, UI component, and whether it is required. See [Add Modal](07-add-modal.md) | `cn` → "Name" (string, InputRequiredText, required) |

### RPC service file

The RPC service file (`src/services/rpc<Entity>.ts`) **must be created manually before or alongside the main page**. It is not auto-generated from the prompt because each entity has its own custom `queryFn` implementations, typed payloads, and entity-specific logic that depend on the FreeIPA API behavior.

Every main page imports hooks from its RPC service file (e.g. `useGetDnsZonesFullDataQuery` from `src/services/rpcDnsZones.ts`, `useGettingHbacRulesQuery` from `src/services/rpcHBACRules.ts`). The main page component cannot function without them.

To create the RPC service file, follow the template in [09-rpc-service.md](09-rpc-service.md). At minimum, you need:
- A **query** for listing entities (paginated, using the two-step `*_find` + `*_show` pattern)
- A **search mutation** for explicit search submissions (or use the generic `useSearchEntriesMutation` from `rpc.ts`)
- An **add mutation** and a **delete mutation** for the modals

Existing RPC service files to use as reference:
- `src/services/rpcTrusts.ts` — newer pattern with domain-specific query
- `src/services/rpcHosts.ts` — older pattern using the generic `useGettingGenericQuery`
- `src/services/rpcDnsZones.ts` — complex example with many endpoints

### Optional input

| Input | Description | Default if omitted |
|-------|-------------|-------------------|
| **Features** | Enable/Disable buttons, kebab menu, contextual help panel | Add + Delete only |
| **Entity fields** | Full list of LDAP attributes with their types. Can be extracted from the IPA command docs (e.g. parameters from `<entity>_show`) | Stub with `cn`, `description`, `dn` |
| **Data transformation** | Whether API data needs a mapper with `complexValues` (mainly DNS-related entities) | Simple conversion only |
| **Conditional rendering** | Whether the page depends on server configuration (e.g. DNS enabled) | Always visible |

### Example prompt

> Based on the `src/pages/README.md` doc, generate a main page for **HBAC Service Groups** with:
> - IPA API object: `hbacsvcgroup`
> - Primary key: `cn`
> - Table columns: `cn` ("Name"), `description` ("Description")
> - Nav placement: Policy > Host-based access control
> - Route path: `hbac-service-groups`
> - Features: Add, Delete (no enable/disable, no kebab)
> - Entity fields: `cn` (string), `description` (string), `dn` (string), `member_hbacsvc` (string[])
> - Add modal fields:
>   - `cn` → "Name" (string, InputRequiredText, required)
>   - `description` → "Description" (string, TextArea, optional)
> - RPC service file: `src/services/rpcHBACServiceGroups.ts` (already exists / to be created manually)

### What gets generated

A complete prompt with the input above and this guide as context should produce:

| File | Content |
|------|---------|
| `src/pages/HBACServiceGroups/HBACServiceGroups.tsx` | Main page component |
| `src/utils/datatypes/globalDataTypes.ts` | `HBACServiceGroup` interface (addition) |
| `src/utils/utils.tsx` | `isHbacServiceGroupSelectable` function (addition) |
| `src/utils/hbacServiceGrpUtils.tsx` | `apiToHBACServiceGroup`, `createEmptyHBACServiceGroup`, `asRecord` |
| `src/navigation/AppRoutes.tsx` | `<Route>` entries (addition) |
| `src/navigation/NavRoutes.ts` | Nav group ref + `getNavigationRoutes` entry (addition) |
| `src/components/modals/.../AddHBACServiceGroupModal.tsx` | Add modal |
| `src/components/modals/.../DeleteHBACServiceGroupsModal.tsx` | Delete modal |

**Not generated** (must be created manually):

| File | Why |
|------|-----|
| `src/services/rpcHBACServiceGroups.ts` | Contains custom `queryFn` logic, typed payloads, and entity-specific API behavior. Use [09-rpc-service.md](09-rpc-service.md) and existing files as reference |
