# Sub-Pages — Settings Kebab Menu and Modals

> **Part of:** [Settings Tab](04-settings-tab.md)
> **See also:** [Checklist](08-checklist.md)

How to implement kebab menu actions with confirmation modals in Settings tabs.

## Kebab Menu Actions

The kebab menu provides Enable, Disable, and Delete actions. **Important:** Always show a confirmation modal before executing.

### Using Existing Modals

When creating a Settings page, check if modals already exist in `src/pages/<Entity>/`. If they do:

1. **Make modal props optional** for settings-page usage
2. **Add a `from` prop** to distinguish main-page vs settings-page usage
3. **Add an `onSuccess` callback** for post-operation navigation

**Adapting a modal for both contexts:**

```tsx
interface EnableDisable<Entity>ModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsList: string[];
  setElementsList?: (elementsList: <Entity>[]) => void;  // Optional for settings
  operation: "enable" | "disable";
  setShowTableRows?: (value: boolean) => void;           // Optional for settings
  onRefresh: () => void;
  from?: "main-page" | "settings-page";                  // Context
}
```

### Settings Page Modal Integration

1. **Add modal state variables:**

```tsx
const [showEnableDisableModal, setShowEnableDisableModal] = React.useState(false);
const [showDeleteModal, setShowDeleteModal] = React.useState(false);
const [enableDisableOperation, setEnableDisableOperation] = React.useState<"enable" | "disable">("enable");
```

2. **Create handlers that open modals:**

```tsx
const onOpenEnableDisableModal = (operation: "enable" | "disable") => {
  setEnableDisableOperation(operation);
  setShowEnableDisableModal(true);
};

const onOpenDeleteModal = () => setShowDeleteModal(true);

const onDeleteSuccess = () => navigate("/<entity-path>");
```

3. **Wire kebab items to modal handlers:**

```tsx
const kebabItems = [
  <DropdownItem key="enable" onClick={() => onOpenEnableDisableModal("enable")}>
    Enable <entity>
  </DropdownItem>,
  <DropdownItem key="disable" onClick={() => onOpenEnableDisableModal("disable")}>
    Disable <entity>
  </DropdownItem>,
  <DropdownItem key="delete" onClick={onOpenDeleteModal}>Delete</DropdownItem>,
];
```

4. **Render modals OUTSIDE TabLayout:**

```tsx
return (
  <>
    <TabLayout>{/* ... form content ... */}</TabLayout>
    <EnableDisable<Entity>Modal
      isOpen={showEnableDisableModal}
      onClose={() => setShowEnableDisableModal(false)}
      elementsList={[props.<entity>.<primaryKey> as string]}
      operation={enableDisableOperation}
      onRefresh={props.onRefresh}
      from="settings-page"
    />
    <Delete<Entity>Modal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      elementsToDelete={[props.<entity> as <Entity>]}
      onRefresh={props.onRefresh}
      from="settings-page"
      onSuccess={onDeleteSuccess}
    />
  </>
);
```

**Important:** Modals must be placed outside `<TabLayout>` or they won't be visible.

### Refreshing Main Page After Delete

Pass a `refresh` state with navigation:

**In Settings component:**
```tsx
const onDeleteSuccess = () => {
  navigate("/<entity-path>", { state: { refresh: true } });
};
```

**In main page component:**
```tsx
React.useEffect(() => {
  const state = location.state as { refresh?: boolean } | null;
  if (state?.refresh) {
    refreshData();
    window.history.replaceState({}, document.title);
  }
}, [location.state]);
```

### Status-Based Conditional Enabling

Disable irrelevant actions based on current entity status:

```tsx
const isEntityDisabled = props.<entity>.<statusField> === true;

const kebabItems = [
  <DropdownItem
    key="enable"
    onClick={() => onOpenEnableDisableModal("enable")}
    isDisabled={!isEntityDisabled}  // Disabled when already enabled
  >Enable</DropdownItem>,
  <DropdownItem
    key="disable"
    onClick={() => onOpenEnableDisableModal("disable")}
    isDisabled={isEntityDisabled}   // Disabled when already disabled
  >Disable</DropdownItem>,
];
```

**Common status fields:**

| Entity | Status Field | `true` Means |
|--------|--------------|--------------|
| OTP Token | `ipatokendisabled` | Token is disabled |
| User | `nsaccountlock` | User is disabled |
| Host | `has_keytab` | Host has keytab |

**Important:** The `convertApiObj` utility converts booleans to strings. Use:

```tsx
const isEntityDisabled =
  props.<entity>.<statusField> === true ||
  String(props.<entity>.<statusField>) === "true";
```
