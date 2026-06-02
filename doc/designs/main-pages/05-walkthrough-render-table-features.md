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

Used by ActiveUsers, Hosts, and many other pages. Wraps the entire page content and provides a slide-out panel with contextual documentation links.

#### Using the `useContextualHelpPanel` Hook

The `useContextualHelpPanel` hook encapsulates all the state and logic needed for the contextual help panel, reducing boilerplate and ensuring consistency.

```tsx
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";
import useContextualHelpPanel from "src/hooks/useContextualHelpPanel";

const MyEntities = () => {
  // Initialize the hook with an optional default page for documentation links
  const contextualPanel = useContextualHelpPanel({ defaultPage: "my-entities" });

  // In the toolbar, pass the toggle function to HelpTextWithIconLayout:
  <HelpTextWithIconLayout
    textContent="Help"
    onClick={contextualPanel.toggle}
  />

  // Wrap the return JSX using the spread panelProps:
  return (
    <ContextualHelpPanel {...contextualPanel.panelProps}>
      <div>
        {/* ...normal page content... */}
      </div>
    </ContextualHelpPanel>
  );
};
```

#### Hook API

The `useContextualHelpPanel` hook accepts an optional configuration object and returns:

```tsx
interface UseContextualHelpPanelOptions {
  defaultPage?: string;  // Initial page key for documentation links (maps to documentation-links.json)
}

interface UseContextualHelpPanelReturn {
  isExpanded: boolean;           // Whether the panel is currently open
  fromPage: string;              // Current page key for documentation links
  toggle: () => void;            // Toggle panel open/close
  close: () => void;             // Close the panel
  changePage: (page: string) => void;  // Change the documentation page
  panelProps: {                  // Props to spread on ContextualHelpPanel
    fromPage: string;
    isExpanded: boolean;
    onClose: () => void;
  };
}
```

#### Adding Documentation Links

Documentation links are defined in `src/assets/documentation/documentation-links.json`. Add an entry with your page key:

```json
{
  "my-entities": [
    {
      "title": "My Entities Overview",
      "link": "https://docs.example.com/my-entities"
    },
    {
      "title": "Managing My Entities",
      "link": "https://docs.example.com/managing-my-entities"
    }
  ]
}
```

If no links are defined for a page, the panel will display "No documentation links available for this page."

#### Usage in Nested Components

The hook can also be used in nested components (like `MembersUsers`, `MemberOfUserGroups`, etc.) that need their own contextual help panel. Simply initialize the hook in the component, wrap the content with `ContextualHelpPanel`, and pass `contextualPanel.toggle` to the toolbar's help button via the `onHelpIconClick` prop:

```tsx
const MembersUsers = (props: PropsToMembersUsers) => {
  const contextualPanel = useContextualHelpPanel();  // No defaultPage = empty panel

  return (
    <ContextualHelpPanel {...contextualPanel.panelProps}>
      <MemberOfToolbar
        // ...other props...
        helpIconEnabled={true}
        onHelpIconClick={contextualPanel.toggle}
      />
      {/* ...rest of component... */}
    </ContextualHelpPanel>
  );
};
```
