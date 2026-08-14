# Independent Sub-Pages

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Tab](04-settings-tab.md) | [Membership Tabs](06-membership-tabs.md)

Independent sub-pages display entity-specific data in a table with Add/Delete operations, separate from Settings and Membership tabs.

## Prompt Template (Recommended)

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

### Placeholders

| Placeholder | Example |
|-------------|---------|
| `<SUB_PAGE_NAME>` | `Privileges` |
| `<entity>` | `role` |
| `<field_name>` (`<data_format>`) | `memberof_privilege` (`string[]`) |
| `<entity-pathname>` | `roles` |
| `<EntityType>` | `Role` |
| `<related_entity>_find` | `privilege_find` |
| `<entity>_add_<relation>` | `role_add_privilege` |

### Example

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

## What Agent Infers vs Must Specify

| Inferred | Must Specify |
|----------|--------------|
| Data transformation (`string[]` → `{cn: string}[]`) | Data field name |
| Type definitions in `MembershipTable.tsx` | Data format hint (`string[]`) |
| `from` type for table | IPA API commands |
| Component patterns | API parameters |

## Files to Modify

| File | Changes |
|------|---------|
| `globalDataTypes.ts` | Add field to entity interface |
| `<entity>Utils.tsx` | Add to `createEmpty<Entity>()` |
| `rpc<Entity>.ts` | Add queries/mutations |
| `<Entity>Tabs.tsx` | Add new tab |
| `AppRoutes.tsx` | Add route |

## API Requirements

**Parent entity query:** Must include `all: true` to return data fields.

```typescript
// Available items query
getPrivileges: build.query<FindRPCResponse, string>({
  query: (searchValue) => getCommand({
    method: "privilege_find",
    params: [[searchValue], { no_members: true }],
  }),
}),

// Add/Remove mutations
addPrivilegeToRole: build.mutation({
  query: (payload) => getCommand({
    method: "role_add_privilege",
    params: [[payload.roleCn], { privilege: payload.privileges }],
  }),
}),
```

## BulkSelectorPrep (Required)

Independent sub-pages **must** include a `BulkSelectorPrep` component to allow
bulk operations (select page / select all / unselect) on the table. Pass it to
`MemberOfToolbar` via the `bulkSelector` prop.

This requires tracking selected items as entity objects (not plain strings) so
`BulkSelectorPrep` can manage them. Derive a `string[]` for `MemberTable`
compatibility via `useMemo`.

```tsx
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import { getSelectedPerPageData } from "src/utils/selectedPerPage";

// Entity-based selection state
const [selectedItems, setSelectedItems] = React.useState<ItemType[]>([]);

// Derive string[] for MemberTable
const selectedNames = useMemo(() => selectedItems.map((i) => i.cn), [selectedItems]);

// Delete button disabled state (managed by BulkSelectorPrep and selection helpers)
const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = React.useState(true);

// Update handler for BulkSelectorPrep
const updateSelected = (items: ItemType[], isSelected: boolean) => {
  let newSelected: ItemType[];
  if (isSelected) {
    const currentNames = new Set(selectedNames);
    const toAdd = items.filter((item) => !currentNames.has(item.cn));
    newSelected = [...selectedItems, ...toAdd];
  } else {
    const removeNames = new Set(items.map((item) => item.cn));
    newSelected = selectedItems.filter((p) => !removeNames.has(p.cn));
  }
  setSelectedItems(newSelected);
  setIsDeleteButtonDisabled(newSelected.length === 0);
};

// Adapter for MemberTable's string-based onCheckItemsChange
const onCheckItemsChange = (checkedNames: string[]) => {
  setSelectedItems(checkedNames.map((name) => ({ cn: name })));
  setIsDeleteButtonDisabled(checkedNames.length === 0);
};

// BulkSelectorPrep data
const selectedPerPageData = getSelectedPerPageData(items, selectedNames, (i) => i.cn);
const bulkSelectorData = {
  selected: selectedItems,
  updateSelected,
  selectableTable: items,
  nameAttr: "cn",
};
```

## Component Structure

```tsx
const <Entity><SubPage> = (props) => {
  useUpdateRoute({ pathname: "<parent-pathname>", noBreadcrumb: true });
  
  return (
    <TabLayout id="subpage">
      <MemberOfToolbar
        bulkSelector={
          <BulkSelectorPrep
            list={data}
            shownElementsList={data}
            elementData={bulkSelectorData}
            buttonsData={{ updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled }}
            selectedPerPageData={selectedPerPageData}
          />
        }
        deleteButtonEnabled={!isDeleteButtonDisabled && isRefreshButtonEnabled}
        ...
      />
      <MemberTable
        entityList={data}
        idKey="cn"
        from="privileges"
        checkedItems={selectedNames}
        onCheckItemsChange={onCheckItemsChange}
        ...
      />
      <Pagination ... />
      {showAddModal && <MemberOfAddModal ... />}
      {showDeleteModal && <MemberOfDeleteModal ... />}
    </TabLayout>
  );
};
```

## Differences from Membership Tabs

| Aspect | Membership | Independent |
|--------|------------|-------------|
| Add API | `_add_member` + entityType | Custom (e.g., `role_add_privilege`) |
| Reusable | Yes | Usually entity-specific |

## Reference Implementations

- `src/pages/Privileges/PrivilegesPermissions.tsx` — uses `MemberOfToolbar` with `bulkSelector` prop
- `src/pages/Roles/RolesPrivileges.tsx`
- `src/pages/DNSZones/DnsResourceRecords.tsx` — uses `ToolbarLayout` with `BulkSelectorPrep` as first item
