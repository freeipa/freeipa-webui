# Main Pages — Step 15: JSX Render, MainTable & Optional Features

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Steps 9–14: Selection & Toolbar](04-walkthrough-selection-toolbar.md) | [Checklist & Types](06-checklist-and-types.md)

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
