# Main Pages

Guide for creating list-style "main pages" in the FreeIPA Modern WebUI. A main page is the top-level landing page for an entity (e.g. Active Users, Hosts, DNS Zones). It displays a searchable, paginated table with bulk selection, toolbar actions, and modals for add/delete operations.

Main pages live under `src/pages/<EntityName>/` and are named after the entity itself (e.g. `Hosts.tsx`, `DnsZones.tsx`). Files with suffixes like `Settings`, `Tabs`, `Table`, or `PreSettings` are **not** main pages — they are sub-components consumed by main pages or detail views.

## Generating a New Main Page Using This Guide

This README is designed to be used as context in AI-assisted prompts. To generate a complete main page, provide the following input alongside this file.

### Required input

| Input | Description | Example |
|-------|-------------|---------|
| **Entity name** | Human-readable name (drives component names, file names, page title) | `HBAC Service Groups` |
| **FreeIPA API object** | The IPA command prefix (determines RPC methods like `*_find`, `*_show`, etc.). Look it up at the [IPA API commands list](https://freeipa.readthedocs.io/en/latest/api/commands.html) | `hbacsvcgroup` |
| **Primary key field** | LDAP attribute that uniquely identifies each entry | `cn` |
| **Table columns** | Fields to display and their labels | `cn` → "Name", `description` → "Description" |
| **Navigation placement** | Sidebar section and sub-group where the page appears | Policy > Host-based access control |
| **Route path** | Kebab-case URL segment | `hbac-service-groups` |
| **RPC service file** | The `src/services/rpc<Entity>.ts` file that defines the RTK Query endpoints for this entity. See "RPC Service file" below | `src/services/rpcHBACServiceGroups.ts` |
| **Add modal fields** | Fields shown in the Add modal, each with: field name (IPA attribute), label, data type, UI component, and whether it is required. See "Add Modal Field Types" below | `cn` → "Name" (string, InputRequiredText, required) |

### RPC service file

The RPC service file (`src/services/rpc<Entity>.ts`) **must be created manually before or alongside the main page**. It is not auto-generated from the prompt because each entity has its own custom `queryFn` implementations, typed payloads, and entity-specific logic that depend on the FreeIPA API behavior.

Every main page imports hooks from its RPC service file (e.g. `useGetDnsZonesFullDataQuery` from `src/services/rpcDnsZones.ts`, `useGettingHbacRulesQuery` from `src/services/rpcHBACRules.ts`). The main page component cannot function without them.

To create the RPC service file, follow the template and examples in the "RPC Service" section of this document. At minimum, you need:
- A **query** for listing entities (paginated, using the two-step `*_find` + `*_show` pattern)
- A **search mutation** for explicit search submissions (or use the generic `useSearchEntriesMutation` from `rpc.ts`)
- An **add mutation** and a **delete mutation** for the modals

Existing RPC service files to use as reference:
- `src/services/rpcTrusts.ts` — newer pattern with domain-specific query
- `src/services/rpcHosts.ts` — older pattern using the generic `useGettingGenericQuery`
- `src/services/rpcDnsZones.ts` — complex example with many endpoints

### Optional input

| Input | Description | Default if omitted |
|-------|-------------|-------------------|
| **Features** | Enable/Disable buttons, kebab menu, contextual help panel | Add + Delete only |
| **Entity fields** | Full list of LDAP attributes with their types. Can be extracted from the IPA command docs (e.g. parameters from `<entity>_show`) | Stub with `cn`, `description`, `dn` |
| **Data transformation** | Whether API data needs a mapper with `complexValues` (mainly DNS-related entities) | Simple conversion only |
| **Conditional rendering** | Whether the page depends on server configuration (e.g. DNS enabled) | Always visible |

### Example prompt

> Based on the `src/pages/README.md` doc, generate a main page for **HBAC Service Groups** with:
> - IPA API object: `hbacsvcgroup`
> - Primary key: `cn`
> - Table columns: `cn` ("Name"), `description` ("Description")
> - Nav placement: Policy > Host-based access control
> - Route path: `hbac-service-groups`
> - Features: Add, Delete (no enable/disable, no kebab)
> - Entity fields: `cn` (string), `description` (string), `dn` (string), `member_hbacsvc` (string[])
> - Add modal fields:
>   - `cn` → "Name" (string, InputRequiredText, required)
>   - `description` → "Description" (string, TextArea, optional)
> - RPC service file: `src/services/rpcHBACServiceGroups.ts` (already exists / to be created manually)

### What gets generated

A complete prompt with the input above and this README as context should produce:

| File | Content |
|------|---------|
| `src/pages/HBACServiceGroups/HBACServiceGroups.tsx` | Main page component |
| `src/utils/datatypes/globalDataTypes.ts` | `HBACServiceGroup` interface (addition) |
| `src/utils/utils.tsx` | `isHbacServiceGroupSelectable` function (addition) |
| `src/utils/hbacServiceGrpUtils.tsx` | `apiToHBACServiceGroup`, `createEmptyHBACServiceGroup`, `asRecord` |
| `src/navigation/AppRoutes.tsx` | `<Route>` entries (addition) |
| `src/navigation/NavRoutes.ts` | Nav group ref + `getNavigationRoutes` entry (addition) |
| `src/components/modals/.../AddHBACServiceGroupModal.tsx` | Add modal |
| `src/components/modals/.../DeleteHBACServiceGroupsModal.tsx` | Delete modal |

**Not generated** (must be created manually):

| File | Why |
|------|-----|
| `src/services/rpcHBACServiceGroups.ts` | Contains custom `queryFn` logic, typed payloads, and entity-specific API behavior. Use the "RPC Service" section template and existing files as reference |

## Folder Structure

Each entity gets its own folder under `src/pages/`:

```
src/pages/MyEntities/
├── MyEntities.tsx          # Main page (this guide)
├── MyEntitiesTabs.tsx      # Detail/settings tabs (separate concern, not covered here)
└── MyEntitiesSettings.tsx  # Settings tab content (separate concern)
```

**Note:** Do not create a custom table component (e.g. `MyEntitiesTable.tsx`) in this folder. New pages must use the shared `MainTable` component from `src/components/tables/MainTable.tsx` instead.

## Anatomy of a Main Page

Every main page follows the same structural pattern, in this order:

1. **Route & title setup** (`useUpdateRoute`)
2. **URL-synced pagination/search state** (`useListPageSearchParams`)
3. **API version retrieval** (Redux selector)
4. **Data fetching** (RTK Query hook for initial load)
5. **Search mutation** (RTK Query mutation for explicit search)
6. **Selection management** (selected items, bulk selector logic)
7. **Button state management** (delete, enable, disable disabled states)
8. **Data wrappers** (prop bundles for child components)
9. **Toolbar items array** (search, buttons, pagination, kebab, help)
10. **JSX render** (title, toolbar, table, bottom pagination, modals)

## Imports

Main pages share a consistent set of imports. Adapt as needed for your entity.

```tsx
import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
// Components
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Data types
import { MyEntity } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isMyEntitySelectable } from "src/utils/utils";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "src/services/rpc";
import { useGettingMyEntitiesQuery } from "src/services/rpcMyEntities";
// Tables
import MainTable from "src/components/tables/MainTable";
// Modals
import AddMyEntityModal from "src/components/modals/MyEntityModals/AddMyEntityModal";
import DeleteMyEntitiesModal from "src/components/modals/MyEntityModals/DeleteMyEntitiesModal";
```

### Optional imports (add only if the page needs them)

```tsx
// For kebab dropdown menus
import { DropdownItem, Button, Content } from "@patternfly/react-core";
import KebabLayout from "src/components/layouts/KebabLayout";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";

// For contextual help panel
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";

// For enable/disable operations
import DisableEnableMyEntitiesModal from "src/components/modals/MyEntityModals/DisableEnableMyEntitiesModal";
```

## Step-by-Step Walkthrough

### 1. Route & Browser Title

```tsx
const MyEntities = () => {
  const dispatch = useAppDispatch();

  // pathname must match the route segment in AppRoutes.tsx and NavRoutes.ts
  const { browserTitle } = useUpdateRoute({ pathname: "my-entities" });

  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);
```

The `pathname` value (e.g. `"my-entities"`) must be registered in:
- `src/navigation/AppRoutes.tsx` — the `<Route>` tree
- `src/navigation/NavRoutes.ts` — navigation metadata (group, breadcrumb, title)

### 2. API Version & URL Parameters

```tsx
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();
```

`useListPageSearchParams` keeps `page`, `perPage`, and `searchValue` in sync with URL query parameters (`?p=`, `?size=`, `?search=`).

### 3. Core State

```tsx
  const [entitiesList, setEntitiesList] = useState<MyEntity[]>([]);

  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Page indexes (for server-side pagination)
  const firstIdx = Math.max(0, (page - 1) * perPage);
  const lastIdx = page * perPage;
```

### 4. Data Fetching (Initial Load)

There are **two patterns** for the initial data query:

#### Pattern A: Generic query via `useGetting*Query` (most common)

Used by ActiveUsers, Hosts, HBACRules, Netgroups, Services, etc.

```tsx
  const dataResponse = useGettingMyEntitiesQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = dataResponse;
```

#### Pattern B: Domain-specific query (newer pattern)

Used by DnsZones, Trusts, etc. These have their own `useGet*FullDataQuery` with custom payloads.

```tsx
  const dataResponse = useGetMyEntitiesFullDataQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const { data, isLoading, error } = dataResponse;
```

### 5. Handle API Response

```tsx
  useEffect(() => {
    if (dataResponse.isFetching) {
      setShowTableRows(false);
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // Success
    if (dataResponse.isSuccess && dataResponse.data && batchResponse !== undefined) {
      const listResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const listSize = batchResponse.result.count;
      const entities: MyEntity[] = [];

      for (let i = 0; i < listSize; i++) {
        entities.push(listResult[i].result);
      }

      setTotalCount(totalCount);
      setEntitiesList(entities);
      setShowTableRows(true);
    }

    // Error
    if (!dataResponse.isLoading && dataResponse.isError && dataResponse.error !== undefined) {
      window.location.reload();
    }
  }, [dataResponse]);
```

**Note:** If the entity requires transformation from API format, use a mapper function (e.g. `apiToTrust`, `apiToDnsZone`) inside the loop instead of pushing raw results.

### 6. Refetch on Mount

```tsx
  React.useEffect(() => {
    dataResponse.refetch();
  }, []);
```

Some pages also refetch when `page` or `perPage` changes:

```tsx
  React.useEffect(() => {
    dataResponse.refetch();
  }, [page, perPage]);
```

### 7. Refresh Handler

```tsx
  const refreshData = () => {
    setShowTableRows(false);
    setTotalCount(0);
    clearSelectedEntities();
    dataResponse.refetch();
  };
```

### 8. Search (Explicit Submit)

Two patterns exist:

#### Pattern A: Using the generic `useSearchEntriesMutation`

```tsx
  const [retrieveEntries] = useSearchEntriesMutation({});

  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    setTotalCount(0);

    retrieveEntries({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: "myentity",  // Must be a valid entryType in GenericPayload
    } as GenericPayload).then((result) => {
      if ("data" in result) {
        const searchError = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          } else if ("message" in searchError) {
            error = searchError.message;
          }
          dispatch(
            addAlert({
              name: "submit-search-value-error",
              title: error || "Error when searching for my entities",
              variant: "danger",
            })
          );
        } else {
          const listResult = result.data?.result.results || [];
          const listSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const entities: MyEntity[] = [];

          for (let i = 0; i < listSize; i++) {
            entities.push(listResult[i].result);
          }

          setTotalCount(totalCount);
          setEntitiesList(entities);
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };
```

**Important:** The `entryType` value must be registered in `GenericPayload` (in `src/services/rpc.ts`) and have corresponding `*_find` / `*_show` method mappings in the `searchEntries` mutation.

#### Pattern B: Domain-specific search mutation

```tsx
  const [searchEntry] = useSearchMyEntitiesEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 200,
    }).then((result) => {
      // Same error handling pattern...
    });
  };
```

### 9. Show Table Rows

```tsx
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);
```

### 10. Selection Management

```tsx
  const [selectedEntities, setSelectedEntities] = useState<MyEntity[]>([]);

  const clearSelectedEntities = () => {
    setSelectedEntities([]);
  };

  // "pk" is the primary key field of the entity (e.g. "uid", "fqdn", "cn", "idnsname")
  const updateSelectedEntities = (entities: MyEntity[], isSelected: boolean) => {
    let newSelected: MyEntity[] = [];
    if (isSelected) {
      newSelected = JSON.parse(JSON.stringify(selectedEntities));
      for (let i = 0; i < entities.length; i++) {
        if (selectedEntities.find((s) => s.pk[0] === entities[i].pk[0])) {
          continue;
        }
        newSelected.push(entities[i]);
      }
    } else {
      for (let i = 0; i < selectedEntities.length; i++) {
        let found = false;
        for (let ii = 0; ii < entities.length; ii++) {
          if (selectedEntities[i].pk[0] === entities[ii].pk[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelected.push(selectedEntities[i]);
        }
      }
    }
    setSelectedEntities(newSelected);
    setIsDeleteButtonDisabled(newSelected.length === 0);
  };

  const setEntitySelected = (entity: MyEntity, isSelecting = true) => {
    if (isMyEntitySelectable(entity)) {
      updateSelectedEntities([entity], isSelecting);
    }
  };
```

### 11. Button State

At minimum, every main page has a delete button:

```tsx
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState<boolean>(true);
  const [isDeletion, setIsDeletion] = useState(false);
```

Pages with enable/disable also need:

```tsx
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] = useState<boolean>(true);
  const [isDisableButtonDisabled, setIsDisableButtonDisabled] = useState<boolean>(true);
  const [isDisableEnableOp, setIsDisableEnableOp] = useState(false);
```

### 12. Modal State

```tsx
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
```

Pages with enable/disable also need:

```tsx
  const [showEnableDisableModal, setShowEnableDisableModal] = useState(false);
  const [enableDisableOptionSelected, setEnableDisableOptionSelected] = useState(false);
```

### 13. Data Wrappers (Prop Bundles)

These objects group related props for child components:

```tsx
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  const paginationData = {
    page,
    perPage,
    updatePage: setPage,
    updatePerPage: setPerPage,
    updateSelectedPerPage: setSelectedPerPage,
    updateShownElementsList: setEntitiesList,
    totalCount,
  };

  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue,
  };

  const bulkSelectorData = {
    selected: selectedEntities,
    updateSelected: updateSelectedEntities,
    selectableTable: entitiesList.filter(isMyEntitySelectable),
    nameAttr: "pk",  // The primary key field name (e.g. "uid", "cn", "fqdn")
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };
```

### 14. Toolbar Items

The toolbar is built as an array of `ToolbarItem` objects. The standard order is:

| Key | Component | Purpose |
|-----|-----------|---------|
| 0 | `BulkSelectorPrep` | Select all / none / page checkboxes |
| 1 | `SearchInputLayout` | Search input field |
| 2 | Separator | Visual divider |
| 3 | Refresh button | Refetch data |
| 4 | Delete button | Delete selected items |
| 5 | Add button | Open add modal |
| 6+ | Enable/Disable buttons | (optional) Toggle entity status |
| N-2 | Kebab menu | (optional) Extra actions |
| N-1 | Separator | Visual divider |
| N | Help | Help text icon |
| N+1 | `PaginationLayout` (top) | Compact pagination, aligned right |

```tsx
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={entitiesList}
          shownElementsList={entitiesList}
          elementData={bulkSelectorData}
          buttonsData={{ updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled }}
          selectedPerPageData={selectedPerPageData}
        />
      ),
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search my entities"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 2,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          dataCy="my-entities-button-refresh"
          onClickHandler={refreshData}
          isDisabled={!showTableRows}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          dataCy="my-entities-button-delete"
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          onClickHandler={() => setShowDeleteModal(true)}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          dataCy="my-entities-button-add"
          onClickHandler={() => setShowAddModal(true)}
          isDisabled={!showTableRows}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 7,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={entitiesList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];
```

### 15. JSX Render

```tsx
  return (
    <div>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="my-entities title"
          headingLevel="h1"
          text="My Entities"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={false}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ToolbarLayout toolbarItems={toolbarItems} />
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto" }}>
            <OuterScrollContainer>
              <InnerScrollContainer style={{ height: "55vh", overflow: "auto" }}>
                {batchError !== undefined && batchError ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  /* Table goes here — see "Table" section below */
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={entitiesList}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      {/* Modals */}
      <ModalErrors errors={modalErrors.getAll()} dataCy="my-entities-modal-error" />
      <AddMyEntityModal
        show={showAddModal}
        handleModalToggle={() => setShowAddModal(!showAddModal)}
        onOpenAddModal={() => setShowAddModal(true)}
        onCloseAddModal={() => setShowAddModal(false)}
        onRefresh={refreshData}
      />
      <DeleteMyEntitiesModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedEntities}
        clearSelectedElements={() => clearSelectedEntities()}
        columnNames={columnNames}
        keyNames={keyNames}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
    </div>
  );
};

export default MyEntities;
```

## Table Component

New pages **must** use the `MainTable` component (`src/components/tables/MainTable.tsx`). **Do not** create custom table components (e.g. `MyEntitiesTable.tsx`) — some older pages (ActiveUsers, Hosts, Netgroups, HBACRules) use custom tables, but that pattern is legacy and should not be followed for new pages.

`MainTable` is a generic, reusable table component that handles checkboxes, shift+click multi-select, enable/disable status styling, skeleton loading, and linking to detail pages. It is used by DnsZones, Trusts, and all newer pages.

**Important:** When generating a new main page from scratch, `showLink` must default to `false` unless explicitly requested. This prevents linking to a settings/detail page that doesn't exist yet. Set it to `true` only when the corresponding `<Entity>Tabs`/`<Entity>Settings` components have been implemented.

```tsx
<MainTable
  tableTitle="My entities table"
  shownElementsList={entitiesList}
  pk="cn"                                  // Primary key field name
  keyNames={["cn", "description"]}         // Fields to display as columns
  columnNames={["Name", "Description"]}    // Column header labels
  hasCheckboxes={true}
  pathname="my-entities"                   // Route segment (no leading '/')
  showTableRows={showTableRows}
  showLink={false}                         // Default to false for new pages (no settings page yet)
  elementsData={{
    isElementSelectable: isMyEntitySelectable,
    selectedElements: selectedEntities,
    selectableElementsTable: selectableEntitiesTable,
    setElementsSelected: setEntitySelected,
    clearSelectedElements: clearSelectedEntities,
  }}
  buttonsData={{
    updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion: setIsDeletion,
    // Optional for enable/disable pages:
    updateIsEnableButtonDisabled: setIsEnableButtonDisabled,
    updateIsDisableButtonDisabled: setIsDisableButtonDisabled,
    isDisableEnableOp: true,
  }}
  paginationData={{
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  }}
  statusElementName="myStatusField"  // Optional: field name that determines row disabled styling
/>
```

## Optional Features

### Kebab Dropdown Menu

For extra actions like "Rebuild auto membership". Used by ActiveUsers and Hosts.

```tsx
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem
      data-cy="my-entities-kebab-some-action"
      key="some-action"
      component="button"
      onClick={() => { /* action handler */ }}
    >
      Some action
    </DropdownItem>,
  ];

  // Add to toolbar items:
  {
    key: N,
    element: (
      <KebabLayout
        dataCy="my-entities-kebab"
        onDropdownSelect={() => setKebabIsOpen(!kebabIsOpen)}
        onKebabToggle={() => setKebabIsOpen(!kebabIsOpen)}
        idKebab="main-dropdown-kebab"
        isKebabOpen={kebabIsOpen}
        dropdownItems={showTableRows ? dropdownItems : []}
        isDisabled={!showTableRows}
      />
    ),
  },
```

### Enable/Disable Buttons

For entities that support toggling status (Active Users, HBAC Rules, DNS Zones).

```tsx
  // Add buttons to toolbar:
  {
    key: N,
    element: (
      <SecondaryButton
        dataCy="my-entities-button-disable"
        isDisabled={isDisableButtonDisabled || !showTableRows}
        onClickHandler={() => onEnableDisableHandler(true)}
      >
        Disable
      </SecondaryButton>
    ),
  },
  {
    key: N+1,
    element: (
      <SecondaryButton
        dataCy="my-entities-button-enable"
        isDisabled={isEnableButtonDisabled || !showTableRows}
        onClickHandler={() => onEnableDisableHandler(false)}
      >
        Enable
      </SecondaryButton>
    ),
  },
```

### Contextual Help Panel

Used by ActiveUsers, Hosts. Wraps the entire page content.

```tsx
  const [isContextualPanelExpanded, setIsContextualPanelExpanded] = useState(false);

  // In the toolbar, pass onClick to HelpTextWithIconLayout:
  <HelpTextWithIconLayout
    textContent="Help"
    onClick={() => setIsContextualPanelExpanded(!isContextualPanelExpanded)}
  />

  // Wrap the return JSX:
  return (
    <ContextualHelpPanel
      fromPage="my-entities"
      isExpanded={isContextualPanelExpanded}
      onClose={() => setIsContextualPanelExpanded(false)}
    >
      <div>
        {/* ...normal page content... */}
      </div>
    </ContextualHelpPanel>
  );
```

## Checklist: Files to Create or Modify

When adding a brand-new main page, touch these files:

### Required new files

| File | Purpose |
|------|---------|
| `src/pages/MyEntities/MyEntities.tsx` | The main page component |
| `src/utils/datatypes/globalDataTypes.ts` | Add the `MyEntity` interface |
| `src/utils/utils.tsx` | Add `isMyEntitySelectable` function |
| `src/utils/myEntitiesUtils.tsx` | Entity utils: `apiToMyEntity`, `createEmptyMyEntity`, `asRecord` (see "Entity Utils File" section) |
| `src/services/rpcMyEntities.ts` | RTK Query hooks wrapping FreeIPA API commands (see "RPC Service" section) |
| `src/components/modals/MyEntityModals/AddMyEntityModal.tsx` | Add modal |
| `src/components/modals/MyEntityModals/DeleteMyEntitiesModal.tsx` | Delete modal |

### Required modifications

| File | Change |
|------|--------|
| `src/navigation/AppRoutes.tsx` | Import the new page component and add `<Route>` entries (see "Routing > AppRoutes.tsx" section) |
| `src/navigation/NavRoutes.ts` | Add group ref constant and register entry in `getNavigationRoutes` (see "Routing > NavRoutes.ts" section) |
| `src/services/rpc.ts` | Add `entryType` to `GenericPayload` union (if using generic search) and add cache tag to `tagTypes` (if needed). **Do not add entity-specific endpoints here** — those go in `src/services/rpc<Entity>.ts` |

### Optional new files

| File | When needed |
|------|------------|
| `src/components/modals/MyEntityModals/DisableEnableMyEntitiesModal.tsx` | If enable/disable is supported |

## Data Type Definition

Add the entity interface to `src/utils/datatypes/globalDataTypes.ts`:

```tsx
export interface MyEntity {
  cn: string;           // or string[] — depends on the IPA schema
  description: string;  // or string[]
  dn: string;
  // Add all relevant LDAP attributes...
}
```

**Important:** Do **not** add an index signature (`[key: string]: unknown`) to entity interfaces. Each field must be explicitly declared with its correct type. This preserves compile-time type safety — an index signature silently allows access to any arbitrary key, which defeats the purpose of having a typed interface.

To discover the full list of fields and their types for an entity, use the **API browser** built into the FreeIPA WebUI (navigate to *IPA Server > API browser* and look up the `<entity>_show` or `<entity>_find` command parameters). You can also consult the [FreeIPA API reference](https://freeipa.readthedocs.io/en/latest/api/commands.html).

Fields are typically `string` or `string[]` matching the IPA JSON-RPC response. Use `string[]` when the attribute is multi-valued in LDAP (most IPA attributes are arrays in the API).

## Selectability Function

Add to `src/utils/utils.tsx`:

```tsx
export const isMyEntitySelectable = (entity: MyEntity) => entity.cn !== "";
```

The pattern checks whether the primary key is non-empty (empty rows are placeholders/loading rows).

## Modal Naming Convention

All modal component files and their default exports **must** include the `Modal` suffix. This ensures consistency across the codebase and makes it immediately clear that the component is a modal.

| Modal type | File name pattern | Component name pattern |
|------------|------------------|----------------------|
| Add | `Add<Entity>Modal.tsx` | `Add<Entity>Modal` |
| Delete | `Delete<Entities>Modal.tsx` | `Delete<Entities>Modal` |
| Enable/Disable | `DisableEnable<Entities>Modal.tsx` | `DisableEnable<Entities>Modal` |

**Examples** from existing codebase:

- `src/components/modals/DnsZones/DeleteDnsZonesModal.tsx` → `DeleteDnsZonesModal`
- `src/pages/Trusts/AddTrustModal.tsx` → `AddTrustModal`
- `src/pages/Trusts/DeleteTrustModal.tsx` → `DeleteTrustModal`

## Add Modal Field Types

The Add modal (`src/components/modals/<EntityModals>/Add<Entity>Modal.tsx`) is built using `ModalWithFormLayout`, which accepts a `fields` array. Each field specifies an `id`, a `name` (label), a `pfComponent` (the PatternFly/custom UI component), and optionally `fieldRequired: true`.

When specifying **Add modal fields** in your prompt, provide each field as:

```
<ipa_attribute> → "<Label>" (<data_type>, <ui_component>, required|optional)
```

### Available UI components

| UI component | Import from | Data type | Use when |
|-------------|-------------|-----------|----------|
| `InputRequiredText` | `src/components/layouts/InputRequiredText` | `string` | Required single-line text (shows validation helper text). Use for the primary key and other mandatory string fields |
| `TextInput` | `@patternfly/react-core` | `string` | Optional or secondary single-line text input |
| `TextArea` | `@patternfly/react-core` | `string` | Multi-line text (e.g. description fields). Use `autoResize` prop |
| `Checkbox` | `@patternfly/react-core` | `boolean` | Boolean flags (e.g. "Force", "Generate OTP") |
| `Radio` | `@patternfly/react-core` | `string` | One-of-N choice from a small fixed set (e.g. authentication method, algorithm) |
| `Select` + `SelectList` + `SelectOption` | `@patternfly/react-core` | `string` | Dropdown selection from a list of options |
| `NumberSelector` | `src/components/Form/NumberInput` | `number` | Numeric input with increment/decrement (e.g. base ID, range size, priority) |
| `PasswordInput` | `src/components/layouts/PasswordInput` | `string` | Password/secret fields with show/hide toggle |
| `SimpleSelector` | `src/components/Form/SimpleSelector` | `string` | Simple dropdown selection (e.g. group picker) |
| `InputWithValidation` | `src/components/layouts/InputWithValidation` | `string` | Text input with inline validation rules. Use when a field needs real-time format validation (e.g. allowed characters, valid IP address) |

### Field validation with `InputWithValidation`

`InputWithValidation` is a text input that evaluates one or more validation rules as the user types and renders inline helper text showing pass/fail state for each rule. Use it instead of `TextInput` or `InputRequiredText` when the field has format constraints that should be validated before submission.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `dataCy` | `string` | Cypress test attribute |
| `id` | `string` | HTML id (should match the field's `id` in the `fields` array) |
| `name` | `string` | HTML name attribute |
| `value` | `string` | Controlled value |
| `onChange` | `(value: string) => void` | State setter (receives the new value directly, not the event) |
| `isRequired` | `boolean?` | Marks the input as required |
| `isDisabled` | `boolean?` | Disables the input and hides validation messages |
| `rules` | `Array<RuleProps>` | Validation rules (see below) |
| `showAlways` | `boolean?` | If `true`, show helper text even when the value is empty (default: hidden until the user types) |
| `type` | `TextInputProps["type"]?` | HTML input type (defaults to `"text"`) |

Each rule in the `rules` array has this shape (exported as `RuleProps`):

```tsx
{
  id: string;           // unique key for the rule (e.g. "valid-chars", "ruleIp")
  message: string;      // text shown to the user (e.g. "Must be a valid IPv4 or IPv6 address")
  validate: (value: string) => boolean;  // returns true if the value passes
}
```

The component renders each rule as a helper text item with three possible states:
- **indeterminate** — value is empty (no visual pass/fail indicator)
- **success** — `validate(value)` returned `true`
- **error** — `validate(value)` returned `false`

**Usage in a modal field:**

```tsx
{
  id: "modal-form-host-name",
  name: "Host name",
  pfComponent: (
    <InputWithValidation
      dataCy="modal-textbox-host-name"
      id="modal-form-host-name"
      name="modal-form-host-name"
      value={hostName}
      onChange={setHostName}
      isRequired
      rules={[
        {
          id: "valid-chars",
          message: "Allowed characters are a-z, A-Z, 0-9, and -",
          validate: (value: string) => /^[a-zA-Z0-9-]+$/.test(value),
        },
      ]}
    />
  ),
  fieldRequired: true,
}
```

Multiple rules can be specified — each renders its own helper text line:

```tsx
rules={[
  {
    id: "ruleCharacters",
    message: "Only alphanumeric and special characters _-.$",
    validate: (v: string) =>
      /^[a-zA-Z]/.test(v.charAt(0)) && /^[a-zA-Z0-9._-]+$/.test(v.substring(1)),
  },
  {
    id: "ruleLength",
    message: "Must be at most 32 characters",
    validate: (v: string) => v.length <= 32,
  },
]}
```

**When specifying fields in your prompt**, indicate validation with the `InputWithValidation` component and describe the constraint:

```
<ipa_attribute> → "<Label>" (string, InputWithValidation, required, validation: "a-z, A-Z, 0-9, and -")
```

**Existing examples:**

| Entity | Field | Validation |
|--------|-------|-----------|
| Hosts (`AddHost.tsx`) | Host name | Allowed characters: `a-z, A-Z, 0-9, -` |
| Hosts (`AddHost.tsx`) | IP address | Must be a valid IPv4 or IPv6 address |
| Users (`AddUser.tsx`) | User login | Only alphanumeric and `_-.$`, first char must be a letter |
| Users (`AddUser.tsx`) | First/Last name | No special characters or spaces |

### Template

```tsx
const fields = [
  {
    id: "modal-form-<field-name>",
    name: "<Label>",
    pfComponent: (
      <InputRequiredText                          // or TextInput, TextArea, Checkbox, etc.
        dataCy="modal-textbox-<field-name>"
        id="modal-form-<field-name>"
        name="modal-form-<field-name>"
        value={fieldState}
        onChange={setFieldState}
        requiredHelperText="Required value"       // only for InputRequiredText
      />
    ),
    fieldRequired: true,                          // omit for optional fields
  },
  // ...more fields
];
```

### Naming conventions

- `id`: `"modal-form-<field-name>"` (kebab-case)
- `data-cy` / `dataCy`: `"modal-textbox-<field-name>"` for text inputs, `"modal-checkbox-<field-name>"` for checkboxes, etc.
- State variables: one `useState` per field, named after the field (e.g. `const [description, setDescription] = useState("")`)

### Modal action buttons

The Add modal must only have two action buttons: **Add** and **Cancel**. Do **not** include an "Add and add another" button.

```tsx
const modalActions: JSX.Element[] = [
  <Button
    data-cy="modal-button-add"
    key="add-new-<entity>"
    isDisabled={buttonDisabled}
    onClick={onAdd}
  >
    Add
  </Button>,
  <Button
    data-cy="modal-button-cancel"
    key="cancel-new-<entity>"
    variant="link"
    onClick={cleanAndCloseModal}
  >
    Cancel
  </Button>,
];
```

### Button disabled logic

The Add button should be disabled until all **required** fields are non-empty:

```tsx
const [buttonDisabled, setButtonDisabled] = useState(true);

useEffect(() => {
  if (requiredField1 === "" || requiredField2 === "") {
    setButtonDisabled(true);
  } else {
    setButtonDisabled(false);
  }
}, [requiredField1, requiredField2]);
```

### Existing Add modal examples

| Entity | Modal file | Fields |
|--------|-----------|--------|
| HBAC Rules | `src/components/modals/HbacModals/AddHBACRule.tsx` | Rule name (InputRequiredText, required), Description (TextArea, optional) |
| Hosts | `src/components/modals/HostModals/AddHost.tsx` | Host name (InputWithValidation, required), Description (TextInput), Class (TextInput), IP Address (InputWithValidation), Force (Checkbox), Generate OTP (Checkbox) |
| Trusts | `src/pages/Trusts/AddTrustModal.tsx` | Domain name (TextInput, required), Two-way (Checkbox), External (Checkbox), Auth method (Radio), Admin account (TextInput), Passwords (PasswordInput), Range type (Radio), Base ID (NumberSelector), Range size (NumberSelector) |
| Users | `src/components/modals/UserModals/AddUser.tsx` | User login (InputRequiredText, required), First name (InputRequiredText, required), Last name (InputRequiredText, required), Class (TextInput), No private group (Checkbox), GID (TypeAheadSelectWithCreate), New password (PasswordInput), Verify password (PasswordInput) |

## Delete Modal

The Delete modal (`src/components/modals/<EntityModals>/Delete<Entities>Modal.tsx`) confirms bulk deletion with the user. It **must** receive `columnNames` and `keyNames` as props and pass them through to the `DeletedElementsTable` component so the table dynamically renders the correct columns.

### Props interface

```tsx
interface Delete<Entities>ModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: <Entity>[];
  clearSelectedElements: () => void;
  columnNames: string[];   // Human-readable column headers, e.g. ["Rule name", "Description"]
  keyNames: string[];      // Attribute keys matching the entity interface, e.g. ["cn", "description"]
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
  fromSettings?: boolean;
}
```

### DeletedElementsTable usage

The `fields` array inside the delete modal must use `DeletedElementsTable` with `columnNames` and `columnIds` props (not hardcoded columns):

```tsx
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

const fields = [
  {
    id: "question-text",
    pfComponent: (
      <Content component={ContentVariants.p}>
        Are you sure you want to delete the selected entries?
      </Content>
    ),
  },
  {
    id: "deleted-elements-table",
    pfComponent: (
      <DeletedElementsTable
        mode="passing_full_data"
        elementsToDelete={props.elementsToDelete}
        columnNames={props.columnNames}
        columnIds={props.keyNames}
        elementType="<entity type>"
        idAttr={"<primary_key>"}
      />
    ),
  },
];
```

### Calling from the main page

When rendering the delete modal from the main page, pass `columnNames` and `keyNames` explicitly:

```tsx
<Delete<Entities>Modal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  elementsToDelete={selectedEntities}
  clearSelectedElements={() => setSelectedEntities([])}
  columnNames={columnNames}       // Same column names used for MainTable
  keyNames={keyNames}             // Same key names used for MainTable
  onRefresh={refreshData}
  updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
  updateIsDeletion={setIsDeletion}
/>
```

### Existing examples

| Entity | Delete modal file | Props pattern |
|--------|------------------|---------------|
| DNS Zones | `src/components/modals/DnsZones/DeleteDnsZonesModal.tsx` | `columnNames`, `keyNames` → `DeletedElementsTable` |
| Trusts | `src/pages/Trusts/DeleteTrustModal.tsx` | `columnNames`, `keyNames` → `DeletedElementsTable` |

## Entity Utils File

Every entity needs a utils file at `src/utils/<entityName>Utils.tsx` (e.g. `hostUtils.tsx`, `trustsUtils.tsx`, `dnsZonesUtils.tsx`). This file provides:

1. **API-to-frontend conversion** (`apiToMyEntity`) — transforms the raw IPA JSON-RPC response into the typed frontend interface
2. **Empty object factory** (`createEmptyMyEntity`) — initializes all fields with safe defaults
3. **Record adapter** (`asRecord`) — wraps the entity for use with form components
4. **Entity-specific helpers** — any helper that operates exclusively on this entity's data type belongs here, **not** in `src/utils/utils.tsx`. For example, a `checkEqualStatusMyEntity` function that compares the enabled/disabled status of selected entries should be defined in the entity utils file, not in the shared utils.

`src/utils/utils.tsx` is reserved for **generic/shared** utilities (e.g. `isMyEntitySelectable` which follows a one-liner pattern shared by all entities, or `checkEqualStatusGen` which is generic over any type). Entity-specific logic that references entity fields or performs entity-specific comparisons must go in the entity's own utils file.

The conversion relies on `convertApiObj` from `src/utils/ipaObjectUtils.ts`, which classifies each field as a simple value (string), a date value, or a complex value (e.g. DNS names with nested `__dns_name__` keys).

### Template

```tsx
// src/utils/myEntitiesUtils.tsx
import { MyEntity } from "src/utils/datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

// Fields that the API returns as arrays but should be stored as simple strings
const simpleValues = new Set([
  "cn",
  "description",
  "dn",
  // Add all single-valued LDAP attributes here...
]);

// Fields that contain generalized time values and need date parsing
const dateValues = new Set([
  // e.g. "krbpasswordexpiration", "krblastpwdchange"
]);

// Fields with complex nested structures (rare, mainly DNS-related)
// Map of field name -> nested key to extract
// e.g. for DNS: ["idnsname", "__dns_name__"]
const complexValues = new Map([
  // e.g. ["idnsname", "__dns_name__"]
]);

export function apiToMyEntity(apiRecord: Record<string, unknown>): MyEntity {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues,
    complexValues // omit if not needed
  ) as Partial<MyEntity>;
  return partialMyEntityToMyEntity(converted);
}

export function partialMyEntityToMyEntity(
  partial: Partial<MyEntity>
): MyEntity {
  return {
    ...createEmptyMyEntity(),
    ...partial,
  };
}

export function createEmptyMyEntity(): MyEntity {
  return {
    cn: "",
    description: "",
    dn: "",
    // Initialize ALL fields from the interface with safe defaults:
    // - strings: ""
    // - string[]: []
    // - booleans: false (or true if that's the IPA default)
    // - numbers: 0
  };
}

// Optional: Record adapter for form components (Settings pages)
export const asRecord = (
  element: Partial<MyEntity>,
  onElementChange: (element: Partial<MyEntity>) => void
) => {
  const ipaObject = element as Record<string, any>;
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as MyEntity);
  }
  return { ipaObject, recordOnChange };
};
```

### Existing examples

| Entity | Utils file | Key functions |
|--------|-----------|---------------|
| Hosts | `src/utils/hostUtils.tsx` | `apiToHost`, `createEmptyHost`, `asRecord` |
| HBAC Rules | `src/utils/hbacRulesUtils.tsx` | `apiToHBACRule`, `createEmptyHBACRule` |
| Trusts | `src/utils/trustsUtils.tsx` | `apiToTrust`, `createEmptyTrust`, `asRecord` |
| DNS Zones | `src/utils/dnsZonesUtils.tsx` | `apiToDnsZone`, `createEmptyDnsZone` (uses `complexValues` for DNS names) |

## RPC Service

Create `src/services/rpcMyEntities.ts` with RTK Query endpoints. This file defines how the WebUI communicates with the FreeIPA JSON-RPC API.

**FreeIPA API reference:** The full list of API commands is at https://freeipa.readthedocs.io/en/latest/api/commands.html. Each entity typically provides a standard set of commands following the pattern `<entity>_<action>` (e.g. `host_find`, `host_show`, `host_add`, `host_del`, `host_mod`).

### Important: `rpc.ts` vs `rpc<Entity>.ts`

**All entity-specific endpoints must be defined in a dedicated `src/services/rpc<Entity>.ts` file**, never in `src/services/rpc.ts`. The base `rpc.ts` file is reserved for shared/generic infrastructure only:
- The base `createApi` definition and tag types
- Generic payloads (`GenericPayload`) and shared types (`Command`, `BatchRPCResponse`, etc.)
- The generic `useSearchEntriesMutation` and `useGettingGenericQuery` hooks
- Shared helper functions (`getCommand`, `getBatchCommand`)

When creating a new entity, the only changes to `rpc.ts` should be:
1. Adding the entity's `entryType` value to the `GenericPayload` union (if using the generic search mutation)
2. Adding a cache tag to `tagTypes` (if the entity-specific service file uses `providesTags` / `invalidatesTags`)

Entity-specific queries, mutations, and hooks are defined using `api.injectEndpoints()` in the entity's own file (e.g. `rpcHBACRules.ts`, `rpcTrusts.ts`, `rpcSelinuxUserMaps.ts`).

### Minimum endpoints for a main page

A main page needs at least a **query** for listing entries and either uses the generic `useSearchEntriesMutation` from `rpc.ts` or defines its own **search mutation**.

### Template

```tsx
// src/services/rpcMyEntities.ts
import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { MyEntity } from "../utils/datatypes/globalDataTypes";
import { apiToMyEntity } from "src/utils/myEntitiesUtils";

/**
 * MyEntity-related endpoints
 *
 * API commands:
 * - myentity_find: https://freeipa.readthedocs.io/en/latest/api/myentity_find.html
 * - myentity_show: https://freeipa.readthedocs.io/en/latest/api/myentity_show.html
 * - myentity_add:  https://freeipa.readthedocs.io/en/latest/api/myentity_add.html
 * - myentity_del:  https://freeipa.readthedocs.io/en/latest/api/myentity_del.html
 * - myentity_mod:  https://freeipa.readthedocs.io/en/latest/api/myentity_mod.html
 */

interface MyEntitiesFullDataPayload {
  searchValue: string;
  apiVersion?: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
}

export interface MyEntityAddPayload {
  cn: string;           // primary key
  description?: string;
  // Add fields matching the IPA `myentity_add` command parameters...
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List entities: two-step find+show pattern
     * 1. Call `myentity_find` with pkey_only to get IDs
     * 2. Batch call `myentity_show` for the paginated slice
     */
    getMyEntitiesFullData: build.query<BatchRPCResponse, MyEntitiesFullDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } = payloadData;
        const apiVersionUsed = apiVersion || API_VERSION_BACKUP;

        // Step 1: Find IDs
        const findCommand: Command = {
          method: "myentity_find",
          params: [[searchValue], { pkey_only: true, sizelimit, version: apiVersionUsed }],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));
        if (findResult.error) return { error: findResult.error };

        const findResponse = findResult.data as FindRPCResponse;
        const totalCount = findResponse.result.result.length;
        const ids: string[] = [];

        for (let i = startIdx; i < totalCount && i < stopIdx; i++) {
          const item = findResponse.result.result[i] as Record<string, unknown>;
          ids.push((item.cn as string[])[0]); // Use the entity's PK field
        }

        // Step 2: Batch show
        const showCommands: Command[] = ids.map((id) => ({
          method: "myentity_show",
          params: [[id], {}],
        }));

        const showResult = await fetchWithBQ(getBatchCommand(showCommands, apiVersionUsed));
        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalCount;
        }

        return { data: response };
      },
    }),

    /**
     * Search entities (mutation variant for explicit search submit)
     */
    searchMyEntitiesEntries: build.mutation<BatchRPCResponse, MyEntitiesFullDataPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        // Same two-step pattern as the query above
        // ...
      },
    }),

    /**
     * Add a new entity via `myentity_add`
     */
    addMyEntity: build.mutation<FindRPCResponse, MyEntityAddPayload>({
      query: (payload) => {
        const params: Record<string, unknown> = {
          version: API_VERSION_BACKUP,
        };
        if (payload.description) params.description = payload.description;
        // Map additional optional fields...

        return getCommand({
          method: "myentity_add",
          params: [[payload.cn], params],
        });
      },
    }),

    /**
     * Delete entities via batch `myentity_del`
     */
    deleteMyEntities: build.mutation<BatchRPCResponse, string[]>({
      query: (payload) => {
        const commands: Command[] = payload.map((id) => ({
          method: "myentity_del",
          params: [[id], {}],
        }));
        return getBatchCommand(commands, API_VERSION_BACKUP);
      },
    }),

    /**
     * Show a single entity via `myentity_show` (for detail/settings pages)
     */
    myEntityShow: build.query<FindRPCResponse, string>({
      query: (entityId) => {
        return getCommand({
          method: "myentity_show",
          params: [[entityId], { all: true, rights: true }],
        });
      },
    }),

    /**
     * Modify an entity via `myentity_mod` (for settings pages)
     */
    myEntityMod: build.mutation<FindRPCResponse, Record<string, unknown>>({
      query: (payload) => {
        const { cn, ...rest } = payload;
        return getCommand({
          method: "myentity_mod",
          params: [[cn], { ...rest, all: true, rights: true, version: API_VERSION_BACKUP }],
        });
      },
    }),
  }),
  overrideExisting: false,
});

// Export the generated hooks
export const {
  useGetMyEntitiesFullDataQuery,
  useSearchMyEntitiesEntriesMutation,
  useAddMyEntityMutation,
  useDeleteMyEntitiesMutation,
  useMyEntityShowQuery,
  useMyEntityModMutation,
} = extendedApi;
```

### FreeIPA API command naming convention

Most IPA entities follow a standard set of commands. Replace `<entity>` with the IPA object name (e.g. `host`, `hbacrule`, `trust`, `dnszone`):

| Command | Purpose | Used by |
|---------|---------|---------|
| `<entity>_find` | Search/list entries | Main page (list query) |
| `<entity>_show` | Get single entry details | Main page (batch show) + Settings page |
| `<entity>_add` | Create a new entry | Add modal |
| `<entity>_del` | Delete entries | Delete modal |
| `<entity>_mod` | Modify an entry | Settings page save |
| `<entity>_enable` | Enable an entry | Enable/Disable modal (optional) |
| `<entity>_disable` | Disable an entry | Enable/Disable modal (optional) |

The full list of available commands is at: https://freeipa.readthedocs.io/en/latest/api/commands.html

Each command's individual documentation (parameters, return values) is at `https://freeipa.readthedocs.io/en/latest/api/<entity>_<action>.html`.

### Existing RPC service examples

| Entity | Service file | Key hooks |
|--------|-------------|-----------|
| Hosts | `src/services/rpcHosts.ts` | `useGettingHostQuery`, `useAutoMemberRebuildHostsMutation` |
| Trusts | `src/services/rpcTrusts.ts` | `useGetTrustsFullDataQuery`, `useSearchTrustsEntriesMutation`, `useAddTrustMutation` |
| DNS Zones | `src/services/rpcDnsZones.ts` | `useGetDnsZonesFullDataQuery`, `useSearchDnsZonesEntriesMutation` |
| HBAC Rules | `src/services/rpcHBACRules.ts` | `useGettingHbacRulesQuery` |

## Routing

Both files below **must** be updated for the new page to appear in the WebUI and be accessible via the navigation bar. Missing either one is the most common cause of "my page doesn't show up."

### AppRoutes.tsx (`src/navigation/AppRoutes.tsx`)

This file defines the React Router `<Route>` tree. Every main page needs at least two entries: one for the list view and one for the detail/settings view.

**Step 1:** Import the new components at the top of the file:

```tsx
import MyEntities from "src/pages/MyEntities/MyEntities";
import MyEntitiesTabs from "src/pages/MyEntities/MyEntitiesTabs";
```

**Step 2:** Add the `<Route>` block inside the logged-in section (`{userLoggedIn ? ( ... )}`). The route path segment must use kebab-case and match the `pathname` passed to `useUpdateRoute`:

```tsx
<Route path="my-entities">
  <Route path="" element={<MyEntities />} />
  <Route path=":cn">
    <Route path="" element={<MyEntitiesTabs section="settings" />} />
    {/* Add more sub-routes for member/memberof tabs as needed */}
  </Route>
</Route>
```

The `:cn` parameter name should match the primary key field (e.g. `:uid` for users, `:fqdn` for hosts, `:cn` for most other entities, `:idnsname` for DNS zones, `:ipauniqueid` for subordinate IDs).

**Note on conditional routes:** Some routes are conditionally rendered based on configuration. For example, DNS zones are only shown when DNS is enabled:

```tsx
{dnsIsEnabled && (
  <Route path="dns-zones">
    ...
  </Route>
)}
```

### NavRoutes.ts (`src/navigation/NavRoutes.ts`)

This file controls what appears in the **sidebar navigation**, the **breadcrumb trail**, and the **browser tab title**. Without an entry here, the page will be routable but invisible in the nav.

**Step 1:** Define a group reference constant at the top of the file:

```tsx
const MyEntitiesGroupRef = "my-entities";
```

**Step 2:** Add the page entry inside `getNavigationRoutes`. The structure depends on where the page belongs in the navigation hierarchy. Pages can be top-level items, items inside a sub-group, or items nested two levels deep.

**Example A: Direct child of a top-level section** (like Hosts or Services under "Identity"):

```tsx
{
  label: "My Entities",
  group: MyEntitiesGroupRef,
  title: `${BASE_TITLE} - My Entities`,
  items: [],
  path: "my-entities",
},
```

**Example B: Nested inside a sub-group** (like "Active users" inside "Users" under "Identity"):

```tsx
{
  label: "My Category",
  group: MyCategoryGroupRef,
  title: `${BASE_TITLE} - My Category`,
  path: "",
  items: [
    {
      label: "My Entities",
      group: MyEntitiesGroupRef,
      title: `${BASE_TITLE} - My Entities`,
      path: "my-entities",
    },
  ],
},
```

Each entry has:

| Field | Purpose |
|-------|---------|
| `label` | Text shown in the sidebar navigation link |
| `group` | Kebab-case identifier matching the route path — used for highlighting the active link |
| `title` | Full browser tab title (convention: `"Identity Management - <Page name>"`) |
| `path` | Route path segment (must match `AppRoutes.tsx` and the `pathname` in `useUpdateRoute`) |
| `items` | Nested children (settings pages, etc.) — use `[]` if there are no children |

**Important:** The `path` value here, the route `path` in `AppRoutes.tsx`, and the `pathname` argument to `useUpdateRoute({ pathname: "my-entities" })` must all be the **same string**.

## `data-cy` Naming Convention

Follow the project's kebab-case naming convention for test attributes:

```
{page-name}-button-{action}      →  my-entities-button-add
{page-name}-button-{action}      →  my-entities-button-delete
{page-name}-button-{action}      →  my-entities-button-refresh
{page-name}-kebab                →  my-entities-kebab
{page-name}-kebab-{action}       →  my-entities-kebab-some-action
{page-name}-modal-error          →  my-entities-modal-error
search                           →  search (always just "search")
```

See `cypress/README.md` for the full naming guide.

## Post-Generation Validation

After generating a new main page, it is highly recommended to run the following checks to catch formatting issues, lint violations, and unused exports before committing:

```bash
npx prettier --write .     # Fix code formatting
npm run lint               # ESLint (max-warnings threshold)
npm run knip               # Detect unused files, exports, and dependencies
```

These are the same checks that run in CI, so catching them locally avoids failed pipelines.

## Common Pitfalls

1. **Forgetting to register the route**: The page won't render if not added to both `AppRoutes.tsx` and `NavRoutes.ts`.
2. **Missing `entryType`**: If using `useSearchEntriesMutation`, the `entryType` must exist in `GenericPayload`'s union type **and** be handled in the mutation's switch logic.
3. **Wrong `pathname` in `useUpdateRoute`**: Must exactly match the route key in `NavRoutes.ts`.
4. **Not calling `refetch()` on mount**: Include the `useEffect(() => { dataResponse.refetch(); }, [])` pattern to ensure fresh data.
5. **Primary key mismatch**: The `pk` / `nameAttr` in `MainTable` and `BulkSelectorPrep` must match the actual field name in the data type (e.g. `"cn"`, `"uid"`, `"fqdn"`, `"idnsname"`).
