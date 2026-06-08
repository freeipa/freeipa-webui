# Sub-Pages — Category Toggle Sections

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Patterns](12-settings-patterns.md) | [Membership Tabs](06-membership-tabs.md)

This guide covers the **Category Toggle Section** pattern — a reusable UI pattern for membership sections with a toggle between "Anyone" and "Specified members".

## Overview

The Category Toggle Section pattern combines:
1. A toggle group to switch between "Anyone" (all) and "Specified" (specific members)
2. Tabbed tables showing membership entries for different member types
3. Add/Remove operations for managing members

### Components Involved

- **`CategoryToggleSection`** (`src/components/CategoryToggleSection/CategoryToggleSection.tsx`) — The generic UI component
- **`useCategoryMembershipOperations`** (`src/hooks/useCategoryMembershipOperations.ts`) — The generic hook for membership operations

## Usage Pattern

### 1. Define the RPC Mutations

```typescript
// In src/services/rpc<Entity>.ts
export interface AddRemoveUserToEntityPayload {
  toId: string;
  type: "user" | "group";
  listOfMembers: string[];
}

export interface AddRemoveToEntityResult {
  completed: number;
  error: Record<string, unknown> | null;
  failed: {
    memberuser?: { user: string[]; group: string[] };
  };
  result: {
    cn: string;
    memberuser_user?: string[];
    memberuser_group?: string[];
  };
}

// Add mutations for user operations (both users AND groups use same API method)
addUserToEntity: build.mutation<BatchRPCResponse, AddRemoveUserToEntityPayload>({
  query: (payload) => {
    const commands: Command[] = payload.listOfMembers.map((member) => ({
      method: "entity_add_user",  // Same method for users AND groups
      params: [[payload.toId], { [payload.type]: member }],  // type determines param name
    }));
    return getBatchCommand(commands, API_VERSION_BACKUP);
  },
}),

removeUserFromEntity: build.mutation<FindRPCResponse, AddRemoveUserToEntityPayload>({
  query: (payload) => {
    const params = { [payload.type]: payload.listOfMembers };
    return getCommand({
      method: "entity_remove_user",  // Same method for users AND groups
      params: [[payload.toId], params],
    });
  },
}),
```

### 2. Configure the Settings Component

```typescript
// In <Entity>Settings.tsx

// API mutations
const [saveService] = useSaveEntityMutation();
const [addUserMutation] = useAddUserToEntityMutation();
const [removeUserMutation] = useRemoveUserFromEntityMutation();

// Define tab configurations for the hook
const userMembershipTabs: MembershipTabConfig<
  AddRemoveToEntityResult,
  AddRemoveToEntityResult
>[] = React.useMemo(
  () => [
    {
      name: "user",
      type: "user",
      addResultExtractor: (result) => ({
        primary: result.result.memberuser_user || [],
      }),
      removeResultExtractor: (result) => ({
        remaining: result.result.memberuser_user || [],
        failed: result.failed?.memberuser?.user || [],
        error: result.error,
      }),
    },
    {
      name: "group",
      type: "group",
      addResultExtractor: (result) => ({
        primary: result.result.memberuser_group || [],
      }),
      removeResultExtractor: (result) => ({
        remaining: result.result.memberuser_group || [],
        failed: result.failed?.memberuser?.group || [],
        error: result.error,
      }),
    },
  ],
  []
);

// Use the generic hook
const { isSpinning, onSaveAndAdd, onRemove } = useCategoryMembershipOperations<
  AddRemoveUserToEntityPayload,
  AddRemoveUserToEntityPayload,
  AddRemoveToEntityResult,
  AddRemoveToEntityResult,
  Entity
>({
  entityId: props.entity.cn as string,
  entityName: "Entity name",
  categoryFieldName: "usercategory",
  tabs: userMembershipTabs,
  addMutation: (payload) => addUserMutation(payload),
  removeMutation: (payload) => removeUserMutation(payload),
  saveMutation: (entity) => saveService(entity),
  createAddPayload: (type, members) => ({
    toId: props.entity.cn as string,
    type: type as "user" | "group",
    listOfMembers: members,
  }),
  createRemovePayload: (type, members) => ({
    toId: props.entity.cn as string,
    type: type as "user" | "group",
    listOfMembers: members,
  }),
  modifiedValues: props.modifiedValues,
  onRefresh: props.onRefresh,
});

// Define tab configurations for the UI component
const categoryTabs: CategoryTabConfig[] = React.useMemo(
  () => [
    {
      key: 0,
      name: "user",
      label: "Users",
      entityType: "user",
      fieldName: "memberuser_user",
      columnNames: ["User"],
      entries: (props.entity.memberuser_user || []).map((entry) => ({
        entry,
        showLink: true,
      })) as TableEntry[],
    },
    {
      key: 1,
      name: "group",
      label: "User groups",
      entityType: "group",
      fieldName: "memberuser_group",
      columnNames: ["User group"],
      entries: (props.entity.memberuser_group || []).map((entry) => ({
        entry,
        showLink: true,
      })) as TableEntry[],
    },
  ],
  [props.entity.memberuser_user, props.entity.memberuser_group]
);

// Render
<CategoryToggleSection
  categoryFieldName="usercategory"
  categoryLabel="User category the rule applies to:"
  categoryOptions={[
    { label: "Anyone", value: "all" },
    { label: "Specified users and groups", value: "" },
  ]}
  categoryValue={props.entity.usercategory || ""}
  ipaObject={ipaObject}
  recordOnChange={recordOnChange}
  metadata={props.metadata}
  objectName="entityname"
  dataCy="entity-toggle-group-user-category"
  tabs={categoryTabs}
  entityId={props.entity.cn as string}
  entityFrom="Entity name"
  isSpinning={isSpinning}
  onAdd={onSaveAndAdd}
  onDelete={onRemove}
  onRefresh={props.onRefresh}
/>
```

## Critical: Clearing Members When Switching to "Anyone"

**The most important implementation detail:** When the user switches from "Specified members" to "Anyone" (setting `*category` to `"all"`), all existing members must be removed before saving. The API does **NOT** automatically clear members when the category is set to "all".

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
          const groupPayload: AddRemoveUserToEntityPayload = {
            toId: props.entity.cn as string,
            type: "group",
            listOfMembers: groupsToDelete,
          };
          removeUserMutation(groupPayload).then((groupResponse) => {
            if ("data" in groupResponse) {
              props.onRefresh();
              onSaveRule();
            }
          });
        } else {
          props.onRefresh();
          onSaveRule();
        }
      }
    });
  } else if (groupsToDelete.length > 0) {
    // Only groups to delete
    const groupPayload: AddRemoveUserToEntityPayload = {
      toId: props.entity.cn as string,
      type: "group",
      listOfMembers: groupsToDelete,
    };
    removeUserMutation(groupPayload).then((response) => {
      if ("data" in response) {
        props.onRefresh();
        onSaveRule();
      }
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
    (keysInObject.includes("usercategory") &&
      modifiedValues.usercategory === "all") ||
    (keysInObject.includes("hostcategory") &&
      modifiedValues.hostcategory === "all")
  ) {
    // If 'Anyone' is selected for users, remove all users and groups first
    const usersToRemove = props.entity.memberuser_user || [];
    const groupsToRemove = props.entity.memberuser_group || [];
    if (
      keysInObject.includes("usercategory") &&
      modifiedValues.usercategory === "all"
    ) {
      onDeleteAllUsersAndSave(usersToRemove, groupsToRemove);
    }

    // If 'Any host' is selected, remove all hosts and host groups first
    const hostsToRemove = props.entity.memberhost_host || [];
    const hostGroupsToRemove = props.entity.memberhost_hostgroup || [];
    if (
      keysInObject.includes("hostcategory") &&
      modifiedValues.hostcategory === "all"
    ) {
      onDeleteAllHostsAndSave(hostsToRemove, hostGroupsToRemove);
    }
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
  - Parameter `user` for users
  - Parameter `group` for user groups
- Hosts/Host Groups: `selinuxusermap_add_host`, `selinuxusermap_remove_host`
  - Parameter `host` for hosts
  - Parameter `hostgroup` for host groups

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
