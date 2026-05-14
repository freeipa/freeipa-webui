# Sub-Pages — Overview & Generating a New Sub-Page

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Tabs Component](02-tabs-component.md) | [Checklist](08-checklist.md)

A sub-page is a detail view for a single entity instance, accessed by clicking a row in a main page table. It can contain one or more tabs of different types.

## Tab Types

| Type | Description | Required? |
|------|-------------|-----------|
| **Settings** | Form with editable entity properties | Optional |
| **Member Of** | Tables showing groups/rules entity belongs to | Optional |
| **Members** | Tables showing entities that belong to this one | Optional |
| **Managed By** | Tables showing entities that manage this one | Optional |
| **Independent Sub-Page** | Entity-specific table with Add/Delete (not membership) | Optional |

### Sub-Page Categories

1. **Settings pages** — Edit entity properties via form fields
2. **Membership tab pages** — Show related entities (Members, Member Of, Managed By)
3. **Independent sub-pages** — Entity-specific data with dedicated Add/Delete APIs

You can combine any of these. Common patterns:
- **Settings only**: `IdpReferencesTabs.tsx`, `RolesTabs.tsx`
- **Settings + independent page**: `DnsZonesTabs.tsx` (Settings + DNS Records)
- **Settings + membership**: `HostsTabs.tsx` (Settings + Member Of + Managed By)
- **Settings + membership + independent**: `TrustsTabs.tsx` (Settings + Trusted Domains)
- **Membership only**: `UserMemberOf.tsx`, `HostsMemberOf.tsx`

### Independent Sub-Pages

Independent sub-pages are **NOT** Settings and **NOT** Membership tabs. They display entity-specific data from the parent's `_show` API response with dedicated Add/Delete operations.

**Examples:**
| Entity | Sub-Page | Data Field | File |
|--------|----------|------------|------|
| Roles | Privileges | `memberof_privilege` | `RolesPrivileges.tsx` |
| DNS Zones | Resource Records | Custom from `dnsrecord_find` | `DnsResourceRecords.tsx` |

See [17-independent-sub-pages.md](17-independent-sub-pages.md) for implementation details.

## Generating a Sub-Page

### Required input

| Input | Description | Example |
|-------|-------------|---------|
| **Entity name** | Human-readable name | `OTP Token` |
| **IPA API object** | The IPA command prefix | `otptoken` |
| **Primary key** | Attribute that uniquely identifies entries | `ipatokenuniqueid` |
| **Parent pathname** | URL path of the main page | `otp-tokens` |
| **Tabs** | What tabs to include (see shorthand below) | `settings`, `managedby_user` |

### Conditional input

| Input | When needed |
|-------|-------------|
| **Settings title** | If including a Settings tab (e.g., "OTP token settings") |
| **Settings fields** | If including a Settings tab |
| **Select options** | For `IpaSelect` fields that need options from another entity (e.g., "options from: user_find → uid") |
| **Column distribution** | Optional: specify which fields go in which column (default: auto-split into 2 columns) |
| **Kebab menu** | If Settings tab needs extra actions |
| **Table columns** | If including a custom table tab |

### Optional input (defaults applied if omitted)

| Input | Default |
|-------|---------|
| **Entity data type** | Located in `src/utils/datatypes/globalDataTypes.ts` (specify only if different) |
| **URL parameter** | Same as primary key |
| **RPC service file** | `src/services/rpc<Entity>.ts` |

## Tab Shorthand Notation

### Membership tabs (use existing components)

| Shorthand | Tab Name | Component Used |
|-----------|----------|----------------|
| `memberof_group` | User groups | `MemberOfUserGroups` |
| `memberof_hostgroup` | Host groups | `MemberOfHostGroups` |
| `memberof_netgroup` | Netgroups | `MemberOfNetgroups` |
| `memberof_role` | Roles | `MemberOfRoles` |
| `memberof_hbacrule` | HBAC rules | `MemberOfHbacRules` |
| `memberof_sudorule` | Sudo rules | `MemberOfSudoRules` |
| `member_user` | Users | `MembersUsers` |
| `member_group` | Groups | `MembersUserGroups` |
| `member_host` | Hosts | `MembersHosts` |
| `managedby_host` | Hosts | `ManagedByHosts` |
| `manager_user` | Member managers (users) | `ManagersUsers` |
| `manager_usergroup` | Member managers (groups) | `ManagersUserGroups` |

### Custom tabs

| Shorthand | Meaning |
|-----------|---------|
| `managedby_user` | Managed by users (custom, needs implementation) |
| `<name>` (table: col1, col2) | Custom table with specified columns |
| `settings` | Settings tab (implied if Settings fields provided) |

## Example Prompts

### Settings-only

```
Based on the `sub-pages` guide, generate a sub-page for 'RADIUS Servers' with:
- IPA API object: `radiusproxy`
- Primary key: `cn`
- Parent pathname: `radius-servers`
- Settings title: "RADIUS server settings"
- Settings fields: `cn` → "Name" (read-only), `ipatokenradiusserver` → "Server" (required), `description` → "Description"
- Kebab menu: Delete
```

### Settings + Membership

```
Based on the `sub-pages` guide, generate a sub-page for 'OTP Tokens' with:
- IPA API object: `otptoken`
- Primary key: `ipatokenuniqueid`
- Parent pathname: `otp-tokens`
- Settings title: "OTP token settings"
- Settings fields: 
  - `ipatokenuniqueid` → "Unique ID" (read-only)
  - `ipatokenowner` → "Owner" (options from: user_find → uid)
  - `description` → "Description"
- Tabs: `managedby_user` (Managed by users)
- Kebab menu: Enable, Disable, Delete
```

### Membership-only (no Settings)

```
Based on the `sub-pages` guide, generate a Member Of sub-page for 'Active Users' with:
- IPA API object: `user`
- Primary key: `uid`
- Parent pathname: `active-users`
- Tabs: `memberof_group`, `memberof_netgroup`, `memberof_role`, `memberof_hbacrule`, `memberof_sudorule`
```

### Settings + Custom table

```
Based on the `sub-pages` guide, generate a sub-page for 'DNS Zones' with:
- IPA API object: `dnszone`
- Primary key: `idnsname`
- Parent pathname: `dns-zones`
- Settings title: "DNS zone settings"
- Settings fields: `idnsname` → "Zone name", `idnssoamname` → "Nameserver" (required)
- Tabs: `dns-records` (table: Record name, Type, Data)
- Kebab menu: Enable, Disable, Delete
```

### Managed By only (no Settings)

```
Based on the `sub-pages` guide, generate a Managed By sub-page for 'Hosts' with:
- IPA API object: `host`
- Primary key: `fqdn`
- Parent pathname: `hosts`
- Tabs: `managedby_host`
```

### Independent Sub-Page (Privileges)

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

## Inference Rules

1. **Settings tab**: Included if `Settings fields` are provided
2. **URL parameter**: Uses primary key unless specified
3. **RPC service**: `src/services/rpc<Entity>.ts`
4. **Tab routes**: Derived from shorthand (e.g., `managedby_user` → `/<id>/managedby_user`)
5. **API commands**: 
   - Membership: `<entity>_add_member`, `<entity>_remove_member`
   - Settings: `<entity>_show`, `<entity>_mod`

## What gets generated

| Condition | Files Generated |
|-----------|-----------------|
| Settings tab requested | `<Entity>Tabs.tsx`, `<Entity>Settings.tsx`, `use<Entity>SettingsData.tsx` |
| Membership tabs requested | `<Entity>MemberOf.tsx`, `<Entity>Members.tsx`, or `<Entity>ManagedBy.tsx` |
| Independent sub-page requested | `<Entity><SubPage>.tsx` (e.g., `RolesPrivileges.tsx`) |
| Custom table tab requested | `<Entity><TabName>.tsx` + modals |
| Always | Route entries in `AppRoutes.tsx` |

## Files Modified

### Always required

| File | Change |
|------|--------|
| `src/navigation/AppRoutes.tsx` | Add nested routes for the sub-page |

### Enable clicking from main page ⚠️ FREQUENTLY FORGOTTEN

> **This is the most commonly skipped step when creating a new sub-page.**

The main page's `MainTable` must have `showLink={true}` to make rows clickable. Without this, users cannot navigate to the sub-page — it exists but is unreachable.

In `src/pages/<Entity>/<Entity>.tsx`, find the `MainTable` component and change:

```tsx
<MainTable
  // ... other props
  showLink={true}  // ← REQUIRED: enables clicking rows to navigate to sub-page
  pathname="<parent-pathname>"
/>
```

See [04-settings-tab.md](04-settings-tab.md#prerequisites--required-files-for-navigation) for the complete prerequisites checklist.

### If needed

| File | Change |
|------|--------|
| `src/services/rpc<Entity>.ts` | Add `*_show`, `*_mod` endpoints for Settings tab |
| `src/utils/<entity>Utils.tsx` | Add `asRecord`, `apiTo<Entity>` functions |
| `src/utils/datatypes/globalDataTypes.ts` | Add entity type interface |

## RPC Endpoints for Sub-Pages

Sub-pages require these IPA API commands (add to `src/services/rpc<Entity>.ts`):

| Tab Type | Commands Needed | Purpose |
|----------|-----------------|---------|
| Settings | `<entity>_show`, `<entity>_mod` | Load and save entity data |
| Membership | `<entity>_add_member`, `<entity>_remove_member` | Manage relationships |
| Independent | `<entity>_show` (with `all: true`), `<entity>_add_<relation>`, `<entity>_remove_<relation>` | Display data, add/remove relations |
| Custom table | `<child>_find`, `<child>_add`, `<child>_del` | CRUD for child entities |

**Note:** Independent sub-pages use entity-specific commands (e.g., `role_add_privilege`) rather than generic `_add_member` commands.

For complete RPC service templates, see [main-pages/09-rpc-service.md](../main-pages/09-rpc-service.md) — the `*_show` and `*_mod` examples are directly applicable to sub-pages.
