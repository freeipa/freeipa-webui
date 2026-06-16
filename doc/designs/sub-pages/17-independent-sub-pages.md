# Independent Sub-Pages

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Tab](04-settings-tab.md) | [Membership Tabs](06-membership-tabs.md)

Independent sub-pages are tabs that display entity-specific data in a table format, separate from Settings and Membership tabs.

## What is an Independent Sub-Page?

An independent sub-page is:
- **NOT** a Settings page (which edits entity properties via forms)
- **NOT** a Membership tab page (Members, Member Of, Managed By)
- A **standalone tab** displaying entity-specific data in a table
- Has its own **Add/Delete operations** with dedicated API calls

## Examples

| Entity | Sub-Page Name | Data Source | Example File |
|--------|--------------|-------------|--------------|
| Roles | Privileges | `memberof_privilege` from `role_show` | `RolesPrivileges.tsx` |
| DNS Zones | Resource Records | `dnsrecord_find` | `DnsResourceRecords.tsx` |
| ID Views | Applied To | `idview_show` | `IDViewsAppliedTo.tsx` |

## Required Prompt Information

When requesting an independent sub-page, provide:

```
Based on the sub-pages guide, generate a '<SubPageName>' page for '<Entity>' with:
- IPA API object: `<entity>`
- Primary key: `<field_name>` (field containing the data to display)
- Data source: `<entity>_show` API response (with `all: true` if needed)
- Table columns: "<Column Name>" (`<field_name>`)
- Parent pathname: `<entity-pathname>`
- Entity data type: `<EntityType>`
- Operations: 'Refresh', 'Delete', 'Add'
- 'Add' modal:
    - Fields: data provided by DualListSelector
    - IPA call for available options: `<related_entity>_find`. Parameters: `no_members: true`
    - IPA command: `<entity>_add_<relation>`
- 'Delete' modal:
    - IPA command: `<entity>_remove_<relation>`
```

### Example Prompt

```
Based on the sub-pages guide, generate a 'Privileges' page for 'Roles' with:
- IPA API object: `role`
- Primary key: `memberof_privilege`
- Data source: `role_show` API response (with `all: true` to include memberof fields)
- Table columns: "Privilege name" (`memberof_privilege`)
- Parent pathname: `roles`
- Entity data type: `Role`
- Operations: 'Refresh', 'Delete', 'Add'
- 'Add' modal:
    - Fields: data provided by DualListSelector
    - IPA call for available options: `privilege_find`. Parameters: `no_members: true`
    - IPA command: `role_add_privilege`
- 'Delete' modal:
    - IPA command: `role_remove_privilege`
```

### Simplified Prompt Template (Recommended)

The agent can infer implementation details from the codebase. Copy this template and fill in the IPA-specific information:

```
Based on the sub-pages guide, generate a '<SUB_PAGE_NAME>' independent page for '<ENTITY_NAME>' with:
- IPA API object: `<entity>`
- Data field: `<field_name>` (<data_format>)
- Table column: "<Column Display Name>"
- Parent pathname: `<entity-pathname>`
- Entity data type: `<EntityType>`
- Operations: 'Refresh', 'Delete', 'Add'
- 'Add' modal:
    - IPA call for available options: `<related_entity>_find` with `<parameters>`
    - IPA command: `<entity>_add_<relation>`
- 'Delete' modal:
    - IPA command: `<entity>_remove_<relation>`
```

**Template placeholders:**

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `<SUB_PAGE_NAME>` | Name of the new tab | `Privileges` |
| `<ENTITY_NAME>` | Parent entity name | `Roles` |
| `<entity>` | IPA API object name (lowercase) | `role` |
| `<field_name>` | Field from `_show` response containing data | `memberof_privilege` |
| `<data_format>` | Data type hint (helps agent with transformations) | `string[]`, `object[]` |
| `<Column Display Name>` | Human-readable column header | `Privilege name` |
| `<entity-pathname>` | URL path segment | `roles` |
| `<EntityType>` | TypeScript interface name | `Role` |
| `<related_entity>_find` | API to list available items | `privilege_find` |
| `<parameters>` | API parameters for the find call | `no_members: true` |
| `<entity>_add_<relation>` | API to add items | `role_add_privilege` |
| `<entity>_remove_<relation>` | API to remove items | `role_remove_privilege` |

### Simplified Prompt Example

```
Based on the sub-pages guide, generate a 'Privileges' independent page for 'Roles' with:
- IPA API object: `role`
- Data field: `memberof_privilege` (string[] of privilege names)
- Table column: "Privilege name"
- Parent pathname: `roles`
- Entity data type: `Role`
- Operations: 'Refresh', 'Delete', 'Add'
- 'Add' modal:
    - IPA call for available options: `privilege_find` with `no_members: true`
    - IPA command: `role_add_privilege`
- 'Delete' modal:
    - IPA command: `role_remove_privilege`
```

### What the Agent Should Infer

| Information | How Agent Infers It |
|-------------|---------------------|
| Data transformation | Check `MemberTable` - it accesses `item[idKey]`, so `string[]` must become `{cn: string}[]` |
| Type definitions | Check `MembershipTable.tsx` - add new types to `EntryDataTypes`/`FromTypes` if needed |
| `from` type for table | If entity has no dedicated page, create a descriptive new type (e.g., `"privileges"`) |
| Component patterns | Follow existing `MemberOf*` and similar components in the codebase |
| API response handling | Check how similar queries transform API responses |

### What Must Be Specified

| Information | Why It's Required |
|-------------|-------------------|
| Data field name | FreeIPA-specific: `memberof_privilege`, `member_user`, etc. |
| Data format hint | `(string[])` helps agent know transformation is needed |
| API commands | FreeIPA-specific: `privilege_find`, `role_add_privilege`, etc. |
| API parameters | FreeIPA-specific: `no_members: true`, etc. |

## Implementation Structure

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/<Entity>/<Entity><SubPage>.tsx` | Main component (e.g., `RolesPrivileges.tsx`) |

### Files to Modify

| File | Changes |
|------|---------|
| `src/utils/datatypes/globalDataTypes.ts` | Add data field to entity interface (if not present) |
| `src/utils/<entity>Utils.tsx` | Add field to `createEmpty<Entity>()` |
| `src/services/rpc<Entity>.ts` | Add queries: list available items, add, remove |
| `src/pages/<Entity>/<Entity>Tabs.tsx` | Add new tab |
| `src/navigation/AppRoutes.tsx` | Add route |

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ <Entity>Tabs.tsx                                                │
│   └── useGet<Entity>ByIdQuery (with all: true)                  │
│         └── Returns entity with <data_field> (e.g., memberof_privilege) │
│               └── Passed as prop to <Entity><SubPage>.tsx       │
└─────────────────────────────────────────────────────────────────┘
```

### API Requirements

**Parent entity query (`<entity>_show`):**
- Must include `all: true` parameter to return all fields
- The response contains the data field (e.g., `memberof_privilege`)

```typescript
getRoleById: build.query<Role, SingleRoleShowPayload>({
  query: (payload) => {
    const params = {
      no_members: payload.no_members || false,
      all: true,  // Required to get memberof_* fields
      version: payload.version || API_VERSION_BACKUP,
    };
    return getCommand({
      method: "role_show",
      params: [[payload.cn], params],
    });
  },
  // ...
}),
```

**Available items query (for Add modal):**
```typescript
getPrivileges: build.query<FindRPCResponse, string>({
  query: (searchValue) => {
    return getCommand({
      method: "privilege_find",
      params: [[searchValue], { no_members: true, version: API_VERSION_BACKUP }],
    });
  },
}),
```

**Add/Remove mutations:**
```typescript
addPrivilegeToRole: build.mutation<FindRPCResponse, { roleCn: string; privileges: string[] }>({
  query: (payload) => {
    return getCommand({
      method: "role_add_privilege",
      params: [[payload.roleCn], { privilege: payload.privileges }],
    });
  },
}),

removePrivilegeFromRole: build.mutation<FindRPCResponse, { roleCn: string; privileges: string[] }>({
  query: (payload) => {
    return getCommand({
      method: "role_remove_privilege",
      params: [[payload.roleCn], { privilege: payload.privileges }],
    });
  },
}),
```

## Component Structure

```tsx
import React, { useEffect, useState } from "react";
// PatternFly
import { PageSection, Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "src/components/MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "src/components/MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";

interface PropsTo<Entity><SubPage> {
  <entity>: <EntityType>;
  isDataLoading: boolean;
  onRefreshData: () => void;
}

const <Entity><SubPage> = (props: PropsTo<Entity><SubPage>) => {
  // CRITICAL: Update navigation bar highlighting on page refresh
  useUpdateRoute({ pathname: "<parent-pathname>", noBreadcrumb: true });

  // States for selection, modals, pagination
  // API hooks for available items, add, remove
  // Handlers for add/delete operations
  
  return (
    <>
      <PageSection hasBodyWrapper={false} isFilled={false}>
        <MemberOfToolbar ... />
        <MemberTable ... />
        <Pagination ... />
      </PageSection>
      {showAddModal && <MemberOfAddModal ... />}
      {showDeleteModal && <MemberOfDeleteModal ... />}
    </>
  );
};
```

**IMPORTANT:** The `useUpdateRoute` hook is required to ensure the navigation bar highlights the parent entity when the page is refreshed or accessed directly via URL.

## Differences from Membership Tabs

| Aspect | Membership Tabs | Independent Sub-Pages |
|--------|----------------|----------------------|
| **Data source** | `member_*` or `memberof_*` fields | Any field from `_show` response |
| **Add API** | `<parent>_add_member` with entityType | Custom API (e.g., `role_add_privilege`) |
| **Remove API** | `<parent>_remove_member` with entityType | Custom API (e.g., `role_remove_privilege`) |
| **Reusable component** | Yes (e.g., `MembersUsers`) | Usually entity-specific |
| **Multiple nested tabs** | Yes (Users, Groups, Hosts, etc.) | Usually single table |

## Reference Implementations

- **Roles Privileges:** `src/pages/Roles/RolesPrivileges.tsx`
- **DNS Resource Records:** `src/pages/DNSZones/DnsResourceRecords.tsx`
