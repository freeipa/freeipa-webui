# Sub-Pages — Generic Membership Tables

> **Part of:** [Membership Tabs](06-membership-tabs.md)
> **See also:** [Table Tab](05-table-tab.md)

Creating and using generic table components for membership tabs.

## Decision Flow for Tables

### 1. Check for Existing Table Components

| Directory | Table Components |
|-----------|------------------|
| `src/components/ManagedBy/` | `ManagedByTable<T>`, `ManagedByTableHosts` |
| `src/components/MemberOf/` | `MemberOfTable` (if exists) |
| `src/components/Members/` | Check for entity-specific tables |
| `src/components/tables/` | `MembershipTable`, `MainTable` |

### 2. Use Generic Table if Available

```tsx
import ManagedByTable from "src/components/ManagedBy/ManagedByTable";
import { Host } from "src/utils/datatypes/globalDataTypes";

<ManagedByTable<Host>
  entityList={hosts}
  idKey="fqdn"
  columnNames={["Host name", "Description"]}
  propertyNames={["fqdn", "description"]}
  checkedItems={selectedItems}
  onCheckItemsChange={setSelectedItems}
/>
```

### 3. Create Generic Table if Missing

**Naming convention:** `<RelationshipType>Table.tsx`
- `ManagedByTable.tsx` — for "Managed by" tabs
- `MemberOfTable.tsx` — for "Is a member of" tabs  
- `MembersTable.tsx` — for "Members" tabs

## Generic Table Structure

```tsx
import React from "react";
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
import EmptyBodyTable from "../tables/EmptyBodyTable";

interface GenericTableProps<T> {
  entityList: T[];
  idKey: string;                    // Primary key property name
  columnNames: string[];            // Column headers
  propertyNames: string[];          // Entity properties to show
  checkedItems?: string[];          // Selected item IDs (optional)
  onCheckItemsChange?: (items: string[]) => void;
  tableId?: string;
  ariaLabel?: string;
}

function GenericTable<T>(props: GenericTableProps<T>) {
  const { entityList, idKey, columnNames, propertyNames } = props;
  const showCheckboxColumn = props.onCheckItemsChange !== undefined;

  const onCheckboxChange = (checked: boolean, id: string) => {
    const originalItems = props.checkedItems || [];
    const newItems = checked
      ? [...originalItems, id]
      : originalItems.filter((item) => item !== id);
    props.onCheckItemsChange?.(newItems);
  };

  return (
    <Table aria-label={props.ariaLabel || "table"} variant="compact" borders>
      <Thead>
        <Tr>
          {showCheckboxColumn && <Th />}
          {columnNames.map((col, i) => <Th key={i} modifier="wrap">{col}</Th>)}
        </Tr>
      </Thead>
      <Tbody>
        {entityList.length === 0 ? (
          <EmptyBodyTable />
        ) : (
          entityList.map((entity, index) => {
            const entityId = String(entity[idKey as keyof T]);
            return (
              <Tr key={index} id={entityId}>
                {showCheckboxColumn && (
                  <Td select={{
                    rowIndex: index,
                    onSelect: (_e, isSelected) => onCheckboxChange(isSelected, entityId),
                    isSelected: props.checkedItems?.includes(entityId) || false,
                  }} />
                )}
                {propertyNames.map((prop, i) => {
                  const value = entity[prop as keyof T];
                  return <Td key={i}>{Array.isArray(value) ? value.join(", ") : String(value ?? "")}</Td>;
                })}
              </Tr>
            );
          })
        )}
      </Tbody>
    </Table>
  );
}

export default GenericTable;
```

**Key features:**
- Uses TypeScript generics (`<T>`) for any entity type
- `idKey` specifies the primary key for selection
- Optional checkbox column via `onCheckItemsChange` presence
- Handles empty state with `EmptyBodyTable`

## Using ManagedByTable

```tsx
import ManagedByTable from "src/components/ManagedBy/ManagedByTable";
import { User } from "src/utils/datatypes/globalDataTypes";

<ManagedByTable<User>
  entityList={users}
  idKey="uid"
  columnNames={["User login", "First name", "Last name"]}
  propertyNames={["uid", "givenname", "sn"]}
  checkedItems={selectedItems}
  onCheckItemsChange={setSelectedItems}
  tableId="my-custom-table"
  ariaLabel="My custom table"
/>
```

**Props:**
- `entityList: T[]` — Array of entities
- `idKey: string` — Primary key property name
- `columnNames: string[]` — Column header labels
- `propertyNames: string[]` — Properties to display
- `checkedItems?: string[]` — Selected item IDs
- `onCheckItemsChange?: (items: string[]) => void` — Selection callback
- `tableId?: string` — HTML id
- `ariaLabel?: string` — Accessibility label

## ManagedByUsers Component

For entities with `managedby_user` relationships:

```tsx
import ManagedByUsers from "src/components/ManagedBy/ManagedByUsers";

<Tab eventKey={0} title={<TabTitleText>Users <Badge isRead>{count}</Badge></TabTitleText>}>
  <ManagedByUsers
    entity={entity}
    id={entity.<pk>}
    from="otptoken"  // Currently supports: "otptoken"
    isDataLoading={isDataLoading}
    onRefreshData={onRefreshData}
  />
</Tab>
```

**To add support for a new entity type:**
1. Add the entity type to `from` prop type union in `ManagedByUsersProps`
2. Add RPC endpoints for `<entity>_add_managedby` and `<entity>_remove_managedby`
3. Extend `onAddUser` and `onDeleteUser` handlers with new entity case

**Reference implementation:** `src/components/ManagedBy/ManagedByTable.tsx`
