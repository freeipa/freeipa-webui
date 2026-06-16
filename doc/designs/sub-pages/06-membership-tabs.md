# Sub-Pages — Membership Tabs

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Table Tab](05-table-tab.md) | [Routing](07-routing.md)

## Prompt Template for Membership Tabs

Copy this template and fill in the values:

```
Based on the sub-pages guide, generate a '<TAB_SECTION_NAME>' tab section for '<ENTITY_NAME>' with:
- IPA API object: `<entity>`
- Primary key: `<pk>`
- Parent pathname: `<entity-pathname>`
- Entity data type: `<EntityType>`
- Tab 1: "<Tab Title>" (<member_type>)
    - Component: `<ComponentName>` [standard|custom]
    - Membership disabled: [yes|no]
- Tab 2: ...
```

**Template placeholders:**

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `<TAB_SECTION_NAME>` | Main tab name | `Members`, `Member Of` |
| `<ENTITY_NAME>` | Entity display name | `Roles`, `User Groups` |
| `<entity>` | IPA API object (lowercase) | `role`, `group` |
| `<pk>` | Primary key field | `cn`, `uid` |
| `<entity-pathname>` | URL path segment | `roles`, `user-groups` |
| `<EntityType>` | TypeScript interface | `Role`, `UserGroup` |
| `<Tab Title>` | Tab display name | `Users`, `Host groups` |
| `<member_type>` | Data field name | `member_user`, `memberof_group` |
| `<ComponentName>` | Reusable component | `MembersUsers`, `MemberOfUserGroups` |
| `[standard\|custom]` | Whether component exists | `standard` = exists, `custom` = create new |

### What the Agent Infers

| Information | How It's Inferred |
|-------------|-------------------|
| Routes | Pattern: `/<pathname>/:pk/<member_type>` |
| Component imports | Pattern: `src/components/Members/<ComponentName>` |
| Tab titles (standard) | From component: `MembersUsers` → "Users" |
| API mutations | Pattern: `<entity>_add_member`, `<entity>_remove_member` |

### What Must Be Specified

| Information | Why Required |
|-------------|--------------|
| Member types | IPA-specific: which relationships exist for this entity |
| Custom components | Agent needs to know if `MembersUserIdOverride` exists or must be created |
| Membership disabled | Whether Add/Delete buttons should be enabled |

### Simplified Prompt (Standard Components Only)

When using only existing standard components, you can simplify:

```
Based on the sub-pages guide, generate a 'Members' tab section for 'Roles' with:
- IPA API object: `role`
- Primary key: `cn`
- Parent pathname: `roles`
- Entity data type: `Role`
- Tabs (all standard components, membership disabled):
    - "Users" (member_user) → MembersUsers
    - "User groups" (member_group) → MembersUserGroups
    - "Hosts" (member_host) → MembersHosts
    - "Host groups" (member_hostgroup) → MembersHostGroups
    - "Services" (member_service) → MembersServices
```

### Full Prompt (With Custom Components)

When custom components are needed, specify them explicitly:

```
Based on the sub-pages guide, generate a 'Members' tab section for 'Roles' with:
- IPA API object: `role`
- Primary key: `cn`
- Parent pathname: `roles`
- Entity data type: `Role`
- Tab 1: "Users" (member_user)
    - Component: `MembersUsers` [standard]
    - Membership disabled: yes
- Tab 2: "User ID override" (member_idoverrideuser)
    - Component: `MembersUserIdOverride` [custom - create new]
    - Membership disabled: yes
    - Add modal: TextInput (manual entry, no _find API)
    - entityType for role_add_member: `idoverrideuser`
```

> **Note:** For custom components, specify the Add modal pattern and `entityType` to avoid follow-up questions.

---

## Quick Navigation: Which File Do I Need?

| Task | Read This File |
|------|----------------|
| **Use an existing component** (most common) | This file (`06-membership-tabs.md`) |
| **Create a new component from scratch** | [06c-membership-creating-new.md](06c-membership-creating-new.md) |
| **Customize an existing component** | [06a-membership-custom.md](06a-membership-custom.md) |
| **Understand generic table components** | [06b-membership-tables.md](06b-membership-tables.md) |

---

## What are Membership Tabs?

Membership tabs display **relationships between entities**. Unlike custom table tabs, they show how the current entity relates to other entities in the system.

## Relationship Types

| Tab Type | Direction | What It Shows | Example |
|----------|-----------|---------------|---------|
| `member_*` | Contains | Entities inside this one | User Group → Users in group |
| `memberof_*` | Belongs to | Groups/rules this entity is in | User → Groups user is in |
| `managedby_*` | Is managed by | Entities that manage this one | Service → Managing hosts |
| `manager_*` | Can manage | Users/groups who can edit membership | User Group → Who can edit |

## Reusable Components

Membership tabs use **shared components** that handle UI and API logic.

### `src/components/MemberOf/` — "Is a member of"

| Component | Shows | Use when entity belongs to... |
|-----------|-------|-------------------------------|
| `MemberOfUserGroups` | User groups | User groups |
| `MemberOfHostGroups` | Host groups | Host groups |
| `MemberOfNetgroups` | Netgroups | Netgroups |
| `MemberOfRoles` | Roles | Roles |
| `MemberOfHbacRules` | HBAC rules | HBAC rules |
| `MemberOfSudoRules` | Sudo rules | Sudo rules |
| `MemberOfHbacServiceGroups` | HBAC service groups | HBAC service groups |
| `MemberOfSudoCmdGroups` | Sudo command groups | Sudo command groups |
| `MemberOfSubIds` | Subordinate IDs | Subordinate IDs |

**Shared utilities:** `MemberOfToolbar`, `MemberOfAddModal`, `MemberOfDeleteModal`

### `src/components/Members/` — "Members" (entities inside this one)

| Component | Shows | Use for entities containing... |
|-----------|-------|--------------------------------|
| `MembersUsers` | User members | Users |
| `MembersUserGroups` | User group members | User groups |
| `MembersHosts` | Host members | Hosts |
| `MembersHostGroups` | Host group members | Host groups |
| `MembersServices` | Service members | Services |
| `MembersNetgroups` | Netgroup members | Netgroups |
| `MembersHbacServices` | HBAC service members | HBAC services |
| `MembersSudoCommands` | Sudo command members | Sudo commands |
| `MembersExternal` | External members | External entities |

### `src/components/MemberManagers/` — "Member managers" (who can edit membership)

| Component | Shows |
|-----------|-------|
| `ManagersUsers` | User managers |
| `ManagersUserGroups` | User group managers |

### `src/components/ManagedBy/` — "Is managed by"

| Component | Shows |
|-----------|-------|
| `ManagedByHosts` | Managing hosts |
| `ManagedByTableHosts` | Table variant for hosts |

### Handling Unknown Component Names

When a prompt specifies a component that is not listed above:

1. **Verify the component exists** — Check if there's a typo or case mismatch (e.g., `Membersuser` vs `MembersUsers`)

2. **If a similar component exists** — Do NOT assume. Ask for confirmation:
   > "You specified `Membersuser`. Did you mean `MembersUsers`?"

3. **If no similar component exists** — See **[06c-membership-creating-new.md](06c-membership-creating-new.md)** for:
   - Required questions to ask before creating
   - Default assumptions if user doesn't know details
   - Component creation checklist
   - Add modal pattern selection

> ⚠️ **CRITICAL:** Do NOT create a new membership component without first asking the user for required information. See [06c-membership-creating-new.md](06c-membership-creating-new.md).

### Using a Shared Component

```tsx
import MemberOfUserGroups from "src/components/MemberOf/MemberOfUserGroups";

<Tab eventKey={"memberof_group"} title={<TabTitleText>User groups</TabTitleText>}>
  <MemberOfUserGroups
    entity={entity}
    id={entity.<pk>}
    from="<entity-type>"  // e.g., "user", "host", "service"
    isDataLoading={isDataLoading}
    onRefreshData={onRefreshData}
  />
</Tab>
```

## URL Structure

```
/<entity-path>/<entity-id>/<relationship>_<target-entity>
```

**Examples:**
- `/active-users/admin/memberof_group` — Groups user "admin" belongs to
- `/user-groups/admins/member_user` — Users inside "admins" group
- `/hosts/server.example.com/managedby_host` — Hosts that manage this server

## Adding Membership Tabs

### 1. Register Routes in AppRoutes.tsx

```tsx
<Route path="user-groups">
  <Route path="" element={<UserGroups />} />
  <Route path=":cn">
    <Route path="" element={<UserGroupsTabs section="settings" />} />
    <Route path="member_user" element={<UserGroupsTabs section="member_user" />} />
    <Route path="memberof_usergroup" element={<UserGroupsTabs section="memberof_usergroup" />} />
  </Route>
</Route>
```

### 2. Handle Tab Navigation

```tsx
const handleTabClick = (_event: React.MouseEvent, tabIndex: number | string) => {
  if (tabIndex === "settings") {
    navigate("/" + pathname + "/" + id);
  } else if (tabIndex === "member_user") {
    navigate("/" + pathname + "/" + id + "/member_user");
  }
};
```

### 3. Render the Tabs

```tsx
<Tabs activeKey={section} onSelect={handleTabClick}>
  <Tab eventKey={"settings"} title={<TabTitleText>Settings</TabTitleText>}>
    <EntitySettings ... />
  </Tab>
  <Tab eventKey={"member_user"} title={<TabTitleText>Users</TabTitleText>}>
    <MembersUsers entity={entity} ... />
  </Tab>
</Tabs>
```

## Common Patterns by Entity

### Active Users
| Tab | Section Value |
|-----|---------------|
| User groups | `memberof_group` |
| Netgroups | `memberof_netgroup` |
| Roles | `memberof_role` |
| HBAC rules | `memberof_hbacrule` |
| Sudo rules | `memberof_sudorule` |

### User Groups
| Tab | Section Value |
|-----|---------------|
| User members | `member_user` |
| Group members | `member_group` |
| Member of | `memberof_usergroup` |
| User managers | `manager_user` |

### Hosts
| Tab | Section Value |
|-----|---------------|
| Host groups | `memberof_hostgroup` |
| Managed by | `managedby` |

## API Attributes

Membership data comes from entity API response as arrays:

```tsx
interface User {
  uid: string;
  memberof_group?: string[];
  memberof_netgroup?: string[];
  memberof_role?: string[];
}
```

## Add/Remove Operations

| Operation | Command Pattern |
|-----------|-----------------|
| Add member | `<entity>_add_member` |
| Remove member | `<entity>_remove_member` |

RTK Query mutations: `useAdd<Entity>MemberMutation`, `useRemove<Entity>MemberMutation`

## Data-Cy Naming Convention

```
<entity>-tab-<membership-type>-<target-entity>
```

Examples: `user-groups-tab-member-user`, `hosts-tab-memberof-hostgroup`

## Custom Implementation

When a shared component doesn't exist, create a custom tab following patterns in:
- [06a-membership-custom.md](06a-membership-custom.md) — Implementation patterns, state management
- [06b-membership-tables.md](06b-membership-tables.md) — Generic table components

## Examples

| Entity | Example File |
|--------|--------------|
| Active Users | `src/pages/ActiveUsers/UserMemberOf.tsx` |
| User Groups | `src/pages/UserGroups/UserGroupsTabs.tsx` |
| Hosts | `src/pages/Hosts/HostsTabs.tsx`, `src/pages/Hosts/HostsManagedBy.tsx` |
| OTP Tokens | `src/pages/OtpTokens/OtpTokensManagedBy.tsx` |
