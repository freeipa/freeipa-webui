# Sub-Pages — Overview

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Tabs Component](02-tabs-component.md) | [Checklist](08-checklist.md)

A sub-page is a detail view for a single entity, accessed by clicking a row in a main page table.

## Tab Types

| Type | Description | Example |
|------|-------------|---------|
| **Settings** | Form with editable properties | `RolesSettings.tsx` |
| **Member Of** | Groups entity belongs to | `UserMemberOf.tsx` |
| **Members** | Entities inside this one | `UserGroupsMembers.tsx` |
| **Managed By** | Entities that manage this | `HostsManagedBy.tsx` |
| **Independent** | Entity-specific table with Add/Delete | `RolesPrivileges.tsx` |

## Required Input

| Input | Example |
|-------|---------|
| **Entity name** | `OTP Token` |
| **IPA API object** | `otptoken` |
| **Primary key** | `ipatokenuniqueid` |
| **Parent pathname** | `otp-tokens` |
| **Tabs** | `settings`, `managedby_user` |

## Tab Shorthand

| Shorthand | Component |
|-----------|-----------|
| `memberof_group` | `MemberOfUserGroups` |
| `memberof_role` | `MemberOfRoles` |
| `member_user` | `MembersUsers` |
| `member_host` | `MembersHosts` |
| `managedby_host` | `ManagedByHosts` |

## Example Prompts

**Settings-only:**
```
Based on the sub-pages guide, generate a sub-page for 'Roles' with:
- IPA API object: `role`
- Primary key: `cn`
- Parent pathname: `roles`
- Settings title: "Role settings"
- Settings fields: `cn` → "Name" (read-only), `description` → "Description"
```

**Settings + Membership:**
```
- Tabs: `memberof_group`, `managedby_host`
```

**Independent Sub-Page:**
```
Based on the sub-pages guide, generate a 'Privileges' independent page for 'Roles' with:
- IPA API object: `role`
- Data field: `memberof_privilege` (string[])
- Table column: "Privilege name"
- 'Add' modal: `privilege_find` with `no_members: true`, `role_add_privilege`
- 'Delete' modal: `role_remove_privilege`
```

## Files Generated

| Condition | Files |
|-----------|-------|
| Settings | `<Entity>Tabs.tsx`, `<Entity>Settings.tsx`, `use<Entity>SettingsData.tsx` |
| Membership | `<Entity>MemberOf.tsx`, `<Entity>Members.tsx` |
| Independent | `<Entity><SubPage>.tsx` |
| Always | Routes in `AppRoutes.tsx` |

## ⚠️ Enable Clicking from Main Page

In `<Entity>.tsx`:
```tsx
<MainTable showLink={true} pathname="<parent-pathname>" />
```

Without `showLink={true}`, rows are not clickable!

## RPC Endpoints Needed

| Tab Type | Commands |
|----------|----------|
| Settings | `<entity>_show`, `<entity>_mod` |
| Membership | `<entity>_add_member`, `<entity>_remove_member` |
| Independent | `<entity>_add_<relation>`, `<entity>_remove_<relation>` |
