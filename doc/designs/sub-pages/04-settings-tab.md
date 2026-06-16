# Sub-Pages — Settings Tab

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Data Hook](03-data-hook.md) | [Settings Patterns](12-settings-patterns.md)

## Prompt Template for Settings Page

Copy this template and fill in the values:

```
Based on the sub-pages guide, generate a 'Settings' page for '<ENTITY_NAME>' with:
- IPA API object: `<entity>`
- Primary key: `<pk>`
- Parent pathname: `<entity-pathname>`
- Settings section: "<Section Title>"
  - Fields:
    - `<field1>` → "<Label 1>" (<type>)
    - `<field2>` → "<Label 2>" (<type>)
```

**Template placeholders:**

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `<ENTITY_NAME>` | Entity display name | `Roles` |
| `<entity>` | IPA API object (lowercase) | `role` |
| `<pk>` | Primary key field | `cn`, `uid`, `fqdn` |
| `<entity-pathname>` | URL path segment | `roles` |
| `<Section Title>` | Form section heading | `Role settings` |
| `<field>` → `<Label>` | Field name and display label | `cn` → `"Role name"` |
| `<type>` | Field data type | `string`, `string[]`, `boolean` |

### What the Agent Infers

| Information | How It's Inferred |
|-------------|-------------------|
| Entity data type | Capitalize IPA object: `role` → `Role` |
| Form component | From type: `string` → `IpaTextInput`, `string` (long) → `IpaTextArea` |
| Form pattern | From field count: 1-4 fields → Horizontal Form |
| API mutations | From IPA object: `<entity>_mod` for saving |
| Read-only fields | Primary key fields are typically read-only |

### Example Prompt

```
Based on the sub-pages guide, generate a 'Settings' page for 'Roles' with:
- IPA API object: `role`
- Primary key: `cn`
- Parent pathname: `roles`
- Settings section: "Role settings"
  - Fields:
    - `cn` → "Role name" (string)
    - `description` → "Description" (string)
```

> **Note:** You don't need to specify `IpaTextInput` or `IpaTextArea` — the agent infers the component from the field type.

---

## ⚠️ MANDATORY: Create Tabs Component First

> **STOP!** Before creating any `<Entity>Settings.tsx` file, you **MUST** first create:
>
> 1. **`<Entity>Tabs.tsx`** — The entry point that renders Settings (see [02-tabs-component.md](02-tabs-component.md))
> 2. **`use<Entity>SettingsData.tsx`** — The data hook that fetches entity data (see [03-data-hook.md](03-data-hook.md))
>
> **The Settings component is a child of the Tabs component.** Without `<Entity>Tabs.tsx`, the Settings page has no way to:
> - Extract the entity ID from the URL
> - Fetch entity data from the API
> - Be rendered by React Router
>
> **Example reference implementations:**
> - `src/pages/SudoRules/SudoRulesTabs.tsx` + `SudoRulesSettings.tsx`
> - `src/pages/Trusts/TrustsTabs.tsx` + `TrustsSettings.tsx`
> - `src/pages/AutoMemUserRules/AutoMemRulesTabs.tsx` + `AutoMemSettings.tsx`

## Prerequisites — Required Files for Navigation

> ⚠️ **CRITICAL:** A Settings page alone is NOT enough. The following files are **required** for the sub-page to be accessible:

| # | File | Purpose | Without it... |
|---|------|---------|---------------|
| 1 | `<Entity>Tabs.tsx` | Entry point that loads Settings component | Sub-page won't render |
| 2 | `use<Entity>SettingsData.tsx` | Data hook providing entity data to Tabs | No data passed to Settings |
| 3 | `AppRoutes.tsx` | Route registration for `/:primaryKey` | URL won't resolve |
| 4 | `<Entity>.tsx` (main page) | `showLink={true}` in MainTable | **Rows not clickable!** |

### Enabling Clickable Rows in Main Page

**This is the most commonly forgotten step.** In the main page's `MainTable`, set `showLink={true}`:

```tsx
// In <Entity>.tsx (main page)
<MainTable
  ...
  showLink={true}  // ← REQUIRED: enables navigation to sub-page
  pathname="entity-pathname"
/>
```

If `showLink={false}` (or omitted), clicking a table row does **nothing** — the Settings page exists but users cannot reach it.

### Quick Checklist

Before considering a Settings page complete:

- [ ] `<Entity>Settings.tsx` — Settings component created
- [ ] `<Entity>Tabs.tsx` — Tabs component created (wraps Settings)
- [ ] `use<Entity>SettingsData.tsx` — Data hook created
- [ ] `AppRoutes.tsx` — Route added with `<Entity>Tabs`
- [ ] `<Entity>.tsx` — `showLink={true}` in MainTable
- [ ] `rpc<Entity>.ts` — `<entity>Show` query and `<entity>Mod` mutation added
- [ ] `<entity>Utils.tsx` — `asRecord` helper added
- [ ] **Help icon** — `Sidebar` with `HelpTextWithIconLayout` in Settings component
- [ ] **ContextualHelpPanel** — Wrapper in Tabs component with `onOpenContextualPanel` passed to Settings

See [Required Steps for Sub-Page Navigation](../sub-pages.md#required-steps-for-sub-page-navigation) in the main guide.

---

## What is a Settings Tab?

The Settings tab (`<Entity>Settings.tsx`) displays a **form** for viewing and editing entity properties with Refresh, Revert, Save buttons and optional kebab menu.

## Props from Parent

```tsx
interface PropsTo<Entity>Settings {
  <entity>: Partial<<Entity>>;                    // Current entity data
  original<Entity>: Partial<<Entity>>;            // Original data (for revert)
  metadata: Metadata;                             // Field metadata from API
  on<Entity>Change: (<entity>: Partial<<Entity>>) => void;
  onRefresh: () => void;
  isModified: boolean;
  modifiedValues: () => Partial<<Entity>>;
  onResetValues: () => void;
  pathname: string;
  onOpenContextualPanel: () => void;             // REQUIRED: Opens help panel
}
```

> ⚠️ **CRITICAL:** The `onOpenContextualPanel` prop is **mandatory**. Every Settings page must include the Help button. See [Contextual Help Panel](#contextual-help-panel) section below.
```

## Core Functions

### The `asRecord` Helper

```tsx
const { ipaObject, recordOnChange } = asRecord(props.<entity>, props.on<Entity>Change);
```

### Save Handler

> ⚠️ **CRITICAL:** Do NOT call `props.on<Entity>Change()` with the API response — this causes buttons to stay enabled. See [Troubleshooting](13-troubleshooting.md).

```tsx
const [isSaving, setSaving] = React.useState(false);

const onSave = () => {
  const modifiedValues = props.modifiedValues();
  const payload = buildPayload(modifiedValues, ["field1", "field2"]);
  
  setSaving(true);
  save<Entity>(payload).then((response) => {
    if ("data" in response) {
      if (response.data?.result) {
        dispatch(addAlert({ name: "save-success", title: "<Entity> modified", variant: "success" }));
      } else if (response.data?.error) {
        dispatch(addAlert({ name: "save-error", title: response.data.error.message, variant: "danger" }));
      }
      props.onResetValues();
      setSaving(false);
    }
  });
};
```

### Revert Handler

```tsx
const onRevert = () => {
  props.on<Entity>Change(props.original<Entity>);
  props.onRefresh();
  dispatch(addAlert({ name: "revert-success", title: "<Entity> data reverted", variant: "success" }));
};
```

## Toolbar

**CRITICAL:** The toolbar must be **fixed at the bottom** using `TabLayout` with `toolbarItems` prop.

```tsx
const toolbarFields = [
  { key: 0, element: <Button variant="secondary" onClick={props.onRefresh}>Refresh</Button> },
  { key: 1, element: <Button variant="secondary" isDisabled={!props.isModified || isSaving} onClick={onRevert}>Revert</Button> },
  { key: 2, element: (
    <Button variant="primary" isDisabled={!props.isModified || isSaving} isLoading={isSaving} onClick={onSave}>
      {isSaving ? "Saving" : "Save"}
    </Button>
  ) },
  { key: 3, element: <KebabLayout direction="up" dropdownItems={kebabItems} isDisabled={isSaving} /> },
];
```

**Button states:**
- **Refresh** — always enabled
- **Revert/Save** — enabled only when `isModified` and not saving
- **Save** — shows spinner when saving
- **Kebab** — `direction="up"` (opens upward), disabled during save

## Kebab Menu Actions

See [04a-settings-kebab-modals.md](04a-settings-kebab-modals.md) for modal integration.

## JSX Structure

### Simple Settings (1-4 fields, Horizontal Form)

Layout hierarchy: `TabLayout` → `Sidebar` (with Help) → `SidebarContent` → Form

```tsx
import { Sidebar, SidebarContent, SidebarPanel } from "@patternfly/react-core";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";

return (
  <TabLayout id="settings-page" toolbarItems={toolbarFields}>
    <Sidebar isPanelRight>
      <SidebarPanel variant="sticky">
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={props.onOpenContextualPanel}
        />
      </SidebarPanel>
      <SidebarContent className="pf-v6-u-mr-xl">
        <TitleLayout headingLevel="h2" id="general" text="Entity settings" />
        <Form isHorizontal>{/* Form fields */}</Form>
      </SidebarContent>
    </Sidebar>
  </TabLayout>
);
```

### Complex Settings (Multiple sections with Jump Links)

Layout hierarchy: `TabLayout` → `Sidebar` (with Help + JumpLinks) → `SidebarContent` → Sections

```tsx
const itemNames = ["General", "User", "Host"];

return (
  <>
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            onClick={props.onOpenContextualPanel}
          />
          <JumpLinks isVertical label="Jump to section" scrollableSelector="#settings-page">
            {itemNames.map((name, idx) => (
              <JumpLinksItem key={idx} href={`#${name.toLowerCase()}`}>{name}</JumpLinksItem>
            ))}
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <TitleLayout headingLevel="h2" id="general" text="General" />
            <Form isHorizontal>{/* Form fields */}</Form>
          </Flex>
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }} className="pf-v6-u-mt-xl">
            <TitleLayout headingLevel="h2" id="user" text="User" />
          </Flex>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
    {/* Modals outside TabLayout */}
    <DeleteModal ... />
  </>
);
```

> ⚠️ **CRITICAL:** The `Sidebar` with `HelpTextWithIconLayout` is **mandatory** for all Settings pages. See [Contextual Help Panel](#contextual-help-panel) below.

## Contextual Help Panel

Every Settings page **must** include a Help button using the `Sidebar` pattern shown above.

### Required Imports (Settings component)

```tsx
import { Sidebar, SidebarContent, SidebarPanel } from "@patternfly/react-core";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
```

### Required in Tabs Component

The parent Tabs component must provide `onOpenContextualPanel`. See [02-tabs-component.md](02-tabs-component.md) and [../sub-pages.md#contextual-help-panel](../sub-pages.md#contextual-help-panel) for full Tabs integration.

## Form Fields and Components

See [04b-settings-form-fields.md](04b-settings-form-fields.md) for form components, editability rules, and data-cy naming.

## Examples

| Complexity | Example File |
|------------|--------------|
| Simple form | `src/pages/IdPReferences/IdpReferencesSettings.tsx` |
| Complex | `src/pages/DNSZones/DnsZonesSettings.tsx` |
