# Sub-Pages — Category Toggle Sections: Basics

> **Part of:** [Category Toggle Sections](15-category-toggle-sections.md)
> **See also:** [Advanced](15b-category-toggle-advanced.md) | [Settings Patterns](12-settings-patterns.md)

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

// Add mutations for user operations
addUserToEntity: build.mutation<BatchRPCResponse, AddRemoveUserToEntityPayload>({
  query: (payload) => {
    const commands: Command[] = payload.listOfMembers.map((member) => ({
      method: "entity_add_user",
      params: [[payload.toId], { [payload.type]: member }],
    }));
    return getBatchCommand(commands, API_VERSION_BACKUP);
  },
}),

removeUserFromEntity: build.mutation<FindRPCResponse, AddRemoveUserToEntityPayload>({
  query: (payload) => {
    const params = { [payload.type]: payload.listOfMembers };
    return getCommand({
      method: "entity_remove_user",
      params: [[payload.toId], params],
    });
  },
}),
```

### 2. Configure the Hook

```typescript
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
```

### 3. Configure the UI Component

```typescript
// Define tab configurations for the UI
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
