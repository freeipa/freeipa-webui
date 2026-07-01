# Sub-Pages — Category Toggle Sections: Advanced

> **Part of:** [Category Toggle Sections](15-category-toggle-sections.md)
> **See also:** [Basics](15a-category-toggle-basics.md) | [Membership Tabs](06-membership-tabs.md)

## Critical: Clearing Members When Switching to "Anyone"

**The most important implementation detail:** When the user switches from "Specified members" to "Anyone" (setting `*category` to `"all"`), all existing members must be removed before saving. The API does **NOT** automatically clear members.

### Implementation in onSave

```typescript
// Helper to remove all users and groups, then save
const onDeleteAllUsersAndSave = (
  usersToDelete: string[],
  groupsToDelete: string[]
) => {
  if (usersToDelete.length === 0 && groupsToDelete.length === 0) {
    onSaveRule();
    return;
  }

  // Remove users first
  if (usersToDelete.length > 0) {
    const payload: AddRemoveUserToEntityPayload = {
      toId: props.entity.cn as string,
      type: "user",
      listOfMembers: usersToDelete,
    };

    removeUserMutation(payload).then((response) => {
      if ("data" in response) {
        // Then remove groups
        if (groupsToDelete.length > 0) {
          const groupPayload = { ...payload, type: "group", listOfMembers: groupsToDelete };
          removeUserMutation(groupPayload).then(() => {
            props.onRefresh();
            onSaveRule();
          });
        } else {
          props.onRefresh();
          onSaveRule();
        }
      }
    });
  } else if (groupsToDelete.length > 0) {
    const payload = { toId: props.entity.cn as string, type: "group", listOfMembers: groupsToDelete };
    removeUserMutation(payload).then(() => {
      props.onRefresh();
      onSaveRule();
    });
  }
};

// Main save handler
const onSave = () => {
  setSaving(true);
  const modifiedValues = props.modifiedValues();
  const keysInObject = Object.keys(modifiedValues);

  // Check if category is being changed to "all" (Anyone)
  if (
    keysInObject.includes("usercategory") &&
    modifiedValues.usercategory === "all"
  ) {
    const usersToRemove = props.entity.memberuser_user || [];
    const groupsToRemove = props.entity.memberuser_group || [];
    onDeleteAllUsersAndSave(usersToRemove, groupsToRemove);
  } else if (
    keysInObject.includes("hostcategory") &&
    modifiedValues.hostcategory === "all"
  ) {
    const hostsToRemove = props.entity.memberhost_host || [];
    const hostGroupsToRemove = props.entity.memberhost_hostgroup || [];
    onDeleteAllHostsAndSave(hostsToRemove, hostGroupsToRemove);
  } else {
    // Regular save without category changes
    onSaveRule();
  }
};
```

## API Method Naming Conventions

Different IPA entities use different API method naming conventions:

### SELinux User Maps
- Users/Groups: `selinuxusermap_add_user`, `selinuxusermap_remove_user`
  - Parameter `user` for users, `group` for user groups
- Hosts/Host Groups: `selinuxusermap_add_host`, `selinuxusermap_remove_host`
  - Parameter `host` for hosts, `hostgroup` for host groups

### Sudo Rules
- Users/Groups: `sudorule_add_user`, `sudorule_remove_user`
- Hosts/Host Groups: `sudorule_add_host`, `sudorule_remove_host`
- Commands: `sudorule_add_allow_command`, `sudorule_add_deny_command`, etc.

### HBAC Rules
- Users/Groups: `hbacrule_add_user`, `hbacrule_remove_user`
- Hosts/Host Groups: `hbacrule_add_host`, `hbacrule_remove_host`

## Checklist for Category Toggle Sections

- [ ] Membership fields typed as `string[]` in `globalDataTypes.ts`
- [ ] Membership fields NOT in `simpleValues` in entity utils
- [ ] Membership fields initialized as `[]` in `createEmpty<Entity>()`
- [ ] Membership fields filtered out in save mutation (NOT sent to `*_mod`)
- [ ] Separate RPC mutations for add/remove operations
- [ ] `onSave` handles category change to "all" by removing members first
- [ ] `CategoryToggleSection` component configured with correct props
- [ ] `useCategoryMembershipOperations` hook configured with correct extractors

## Reference Files

- **Generic Components:**
  - `src/components/CategoryToggleSection/CategoryToggleSection.tsx`
  - `src/hooks/useCategoryMembershipOperations.ts`
  
- **Example Implementations:**
  - `src/pages/SELinuxUserMaps/SELinuxUserMapsSettings.tsx`
  - `src/pages/SudoRules/SudoRulesSettings.tsx`
  - `src/components/SudoRuleSections/SudoRulesWho.tsx`
  - `src/components/SudoRuleSections/AccessThisHost.tsx`
