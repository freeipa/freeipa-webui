# Sub-Pages — Membership Tabs

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Table Tab](05-table-tab.md) | [Routing](07-routing.md)

## Prompt Template

```
Based on the sub-pages guide, generate a '<TAB_SECTION_NAME>' tab section for '<ENTITY_NAME>' with:
- IPA API object: `<entity>`
- Primary key: `<pk>`
- Parent pathname: `<entity-pathname>`
- Entity data type: `<EntityType>`
- Tabs (all standard, membership disabled):
    - "<Tab Title>" (<member_type>) → <ComponentName>
```

### What Agent Infers vs Must Specify

| Inferred | Must Specify |
|----------|--------------|
| Routes: `/<pathname>/:pk/<member_type>` | Member types (IPA-specific) |
| Component imports | Custom components |
| API: `<entity>_add_member` | Membership disabled status |

### Example (Standard Components)

```
Based on the sub-pages guide, generate a 'Members' tab section for 'Roles' with:
- IPA API object: `role`
- Primary key: `cn`
- Parent pathname: `roles`
- Entity data type: `Role`
- Tabs (all standard, membership disabled):
    - "Users" (member_user) → MembersUsers
    - "User groups" (member_group) → MembersUserGroups
```

For custom components, see [06c-membership-creating-new.md](06c-membership-creating-new.md).

---

## Quick Navigation

| Task | File |
|------|------|
| Use existing component | This file |
| Create new component | [06c-membership-creating-new.md](06c-membership-creating-new.md) |
| Customize existing | [06a-membership-custom.md](06a-membership-custom.md) |

## Relationship Types

| Tab Type | Direction | Example |
|----------|-----------|---------|
| `member_*` | Contains | User Group → Users in group |
| `memberof_*` | Belongs to | User → Groups user is in |
| `managedby_*` | Is managed by | Service → Managing hosts |
| `manager_*` | Can manage | User Group → Who can edit |

## Reusable Components

### `src/components/Members/`
`MembersUsers`, `MembersUserGroups`, `MembersHosts`, `MembersHostGroups`, `MembersServices`, `MembersNetgroups`, `MembersExternal`

### `src/components/MemberOf/`
`MemberOfUserGroups`, `MemberOfHostGroups`, `MemberOfNetgroups`, `MemberOfRoles`, `MemberOfHbacRules`, `MemberOfSudoRules`

### `src/components/ManagedBy/`
`ManagedByHosts`, `ManagedByTableHosts`

### `src/components/MemberManagers/`
`ManagersUsers`, `ManagersUserGroups`

## Usage

```tsx
<Tab eventKey={"memberof_group"} title={<TabTitleText>User groups</TabTitleText>}>
  <MemberOfUserGroups
    entity={entity}
    id={entity.<pk>}
    from="<entity-type>"
    isDataLoading={isDataLoading}
    onRefreshData={onRefreshData}
  />
</Tab>
```

## URL Structure

```
/<entity-path>/<entity-id>/<relationship>_<target-entity>
```

Example: `/active-users/admin/memberof_group`

## Routes (AppRoutes.tsx)

```tsx
<Route path=":cn">
  <Route path="" element={<EntityTabs section="settings" />} />
  <Route path="member_user" element={<EntityTabs section="member_user" />} />
</Route>
```

## API Operations

| Operation | Command |
|-----------|---------|
| Add member | `<entity>_add_member` |
| Remove member | `<entity>_remove_member` |

## Reference Implementations

- `src/pages/ActiveUsers/UserMemberOf.tsx`
- `src/pages/UserGroups/UserGroupsTabs.tsx`
- `src/pages/Hosts/HostsTabs.tsx`
