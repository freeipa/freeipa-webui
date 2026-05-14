# Sub-Pages — Table-Based Tabs

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Tab](04-settings-tab.md) | [Membership Tabs](06-membership-tabs.md)

## What is a Table Tab?

A table tab displays a **list of related child entities** within a sub-page. Unlike the Settings tab (which shows one entity's properties), a table tab shows multiple items in a tabular format with full CRUD capabilities.

**Examples in the codebase:**
- **DNS Records** tab in DNS Zones — shows all DNS records within a zone
- **Applied To** tab in ID Views — shows hosts where the view is applied
- **Overrides** tab in ID Views — shows user/group overrides

## When to Use

Use a table tab when:
- The parent entity has a **one-to-many relationship** with child entities
- Users need to **search, filter, and paginate** through the items
- Users need to **add or delete** child entities
- The relationship is more complex than standard membership (for membership, see [06-membership-tabs.md](06-membership-tabs.md))

## Features Provided

A table tab typically includes:

| Feature | Description |
|---------|-------------|
| **Bulk selection** | Checkbox column for selecting multiple rows |
| **Search** | Filter items by keyword |
| **Pagination** | Navigate through large lists |
| **Add button** | Opens modal to create new child entities |
| **Delete button** | Removes selected items |
| **Refresh button** | Reloads the list from API |

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  <ChildEntity>Tab.tsx                   │
│  (manages state, handles API calls, coordinates UI)     │
└─────────────────────────────────────────────────────────┘
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
┌──────────┐ ┌──────────┐ ┌──────────────────┐
│ MainTable│ │ AddModal │ │ DeleteModal      │
│ (list)   │ │ (create) │ │ (bulk delete)    │
└──────────┘ └──────────┘ └──────────────────┘
```

## Props Interface

Table tabs receive the parent entity ID as a prop:

```tsx
interface <ChildEntity>TabProps {
  <parentId>: string;  // e.g., dnsZoneId, idViewId
}
```

## State Management

The component manages several pieces of state:

```tsx
// Data from API
const [<childEntities>, set<ChildEntities>] = React.useState<<ChildEntity>[]>([]);
const [totalCount, setTotalCount] = React.useState(0);

// Selection state
const [selectedElements, setSelectedElements] = React.useState<<ChildEntity>[]>([]);
const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = React.useState(true);

// Modal visibility
const [showAddModal, setShowAddModal] = React.useState(false);
const [showDeleteModal, setShowDeleteModal] = React.useState(false);
```

## Pagination and Search

Use the `useListPageSearchParams` hook to manage pagination and search state in the URL:

```tsx
const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
  useListPageSearchParams();

// Calculate API query range
const startIdx = (page - 1) * perPage;
const stopIdx = startIdx + perPage;
```

This keeps pagination state in the URL, so users can bookmark or share specific pages.

## API Integration

Fetch child entities using an RTK Query hook:

```tsx
const response = use<ChildEntity>FindQuery({
  <parentId>: props.<parentId>,
  searchValue,
  sizeLimit: perPage,
  startIdx,
  stopIdx,
});

// Update local state when data arrives
React.useEffect(() => {
  if (response.isSuccess && response.data) {
    set<ChildEntities>(response.data.result);
    setTotalCount(response.data.count);
  }
}, [response]);
```

## Selection Management

Handle row selection for bulk operations:

```tsx
// Filter to only selectable items (some rows may be protected)
const selectable = <childEntities>.filter(is<ChildEntity>Selectable);

const updateSelected = (items: <ChildEntity>[], isSelected: boolean) => {
  if (isSelected) {
    setSelectedElements([...selectedElements, ...items]);
  } else {
    setSelectedElements(selectedElements.filter(item => !items.includes(item)));
  }
  // Enable delete button when items are selected
  setIsDeleteButtonDisabled(selectedElements.length === 0);
};
```

## Toolbar Configuration

Build the toolbar with all the action buttons:

```tsx
const toolbarItems: ToolbarItem[] = [
  { key: 0, element: <BulkSelectorPrep bulkSelectorData={bulkSelectorData} /> },
  { key: 1, element: <SearchInputLayout searchValueData={searchValueData} />, toolbarItemVariant: ToolbarItemVariant.label },
  { key: 2, toolbarItemVariant: ToolbarItemVariant.separator },
  { key: 3, element: <SecondaryButton onClickHandler={refreshData}>Refresh</SecondaryButton> },
  { key: 4, element: <SecondaryButton isDisabled={isDeleteButtonDisabled} onClickHandler={() => setShowDeleteModal(true)}>Delete</SecondaryButton> },
  { key: 5, element: <SecondaryButton onClickHandler={() => setShowAddModal(true)}>Add</SecondaryButton> },
  { key: 6, toolbarItemVariant: ToolbarItemVariant.separator },
  { key: 7, element: <HelpTextWithIconLayout textContent="Help" /> },
  { key: 8, element: <PaginationLayout paginationData={paginationData} />, toolbarItemAlignment: { default: "alignEnd" } },
];
```

## JSX Structure

```tsx
return (
  <div style={{ height: `var(--subsettings-calc)` }} data-cy={"<entity>-<child-entities>"}>
    <PageSection hasBodyWrapper={false} isFilled={false}>
      <Flex direction={{ default: "column" }}>
        <FlexItem>
          <ToolbarLayout toolbarItems={toolbarItems} />
        </FlexItem>
        <FlexItem>
          <OuterScrollContainer>
            <InnerScrollContainer style={{ height: "60vh", overflow: "auto" }}>
              <MainTable
                tableTitle="<Child entities> table"
                shownElementsList={<childEntities>}
                pk="<pk>"
                keyNames={["<pk>", "field2", ...]}
                columnNames={["Column 1", "Column 2", ...]}
                hasCheckboxes={true}
                pathname="<child-pathname>"
                showTableRows={!isLoading}
                showLink={false}
                elementsData={{...}}
                buttonsData={{...}}
              />
            </InnerScrollContainer>
          </OuterScrollContainer>
        </FlexItem>
        <FlexItem style={{ position: "sticky", bottom: 0 }}>
          <PaginationLayout list={<childEntities>} paginationData={paginationData} variant={PaginationVariant.bottom} />
        </FlexItem>
      </Flex>
    </PageSection>
    
    {/* Modals */}
    <Add<ChildEntity>Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onRefresh={refreshData} <parentId>={props.<parentId>} />
    <Delete<ChildEntity>Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} elementsToDelete={selectedElements} ... />
  </div>
);
```

## Required Files

When creating a table tab, you'll need to create:

| File | Purpose |
|------|---------|
| `src/pages/<Entity>/<ChildEntity>.tsx` | The table tab component itself |
| `src/components/modals/<Entity>/Add<ChildEntity>Modal.tsx` | Modal for creating new items |
| `src/components/modals/<Entity>/Delete<ChildEntity>Modal.tsx` | Modal for confirming deletion |

For Add and Delete modal templates, see [09-modals.md](09-modals.md).

## Required Imports

```tsx
import React from "react";
import { PageSection, PaginationVariant, ToolbarItemVariant, Flex, FlexItem } from "@patternfly/react-core";
import { InnerScrollContainer, OuterScrollContainer } from "@patternfly/react-table";
import { useAppDispatch } from "src/store/hooks";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import ToolbarLayout, { ToolbarItem } from "src/components/layouts/ToolbarLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import MainTable from "src/components/tables/MainTable";
```

## Examples

| Pattern | Example File |
|---------|--------------|
| DNS Records in DNS Zone | `src/pages/DNSZones/DnsResourceRecords.tsx` |
| Applied To in ID Views | `src/pages/IDViews/IDViewsAppliedTo.tsx` |
| Overrides in ID Views | `src/pages/IDViews/IDViewsOverrides.tsx` |
