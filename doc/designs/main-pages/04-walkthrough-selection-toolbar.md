# Main Pages — Walkthrough: Steps 9–14 (Selection, State & Toolbar)

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Steps 1–8: Init & Fetching](03-walkthrough-init-fetch.md) | [Step 15: Render, Table & Features](05-walkthrough-render-table-features.md)

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
