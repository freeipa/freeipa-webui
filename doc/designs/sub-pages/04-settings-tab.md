# Sub-Pages — Settings Tab

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Data Hook](02-data-hook.md) | [Settings Patterns](12-settings-patterns.md) | [Component Catalog](../components/00-overview.md)

## Prompt Template

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

### What Agent Infers

| Inferred | From |
|----------|------|
| Entity data type | `role` → `Role` |
| Form component | `string` → `IpaTextInput` |
| Form pattern | 1-4 fields → Horizontal Form |
| API mutation | `<entity>_mod` |

### Example

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

---

## ⚠️ MANDATORY: Create Tabs Component First

Before `<Entity>Settings.tsx`, create:
1. `use<Entity>SettingsData.tsx` — Data hook
2. `<Entity>Tabs.tsx` — Entry point (renders Settings)

See [03-tabs-component.md](03-tabs-component.md) and [02-data-hook.md](02-data-hook.md).

## Prerequisites Checklist

- [ ] `<Entity>Settings.tsx` — Settings component
- [ ] `<Entity>Tabs.tsx` — Tabs component (wraps Settings)
- [ ] `use<Entity>SettingsData.tsx` — Data hook
- [ ] `AppRoutes.tsx` — Route added
- [ ] `<Entity>.tsx` — `showLink={true}` in MainTable
- [ ] `rpc<Entity>.ts` — `<entity>Show` + `<entity>Mod`
- [ ] `<entity>Utils.tsx` — `asRecord` helper
- [ ] Help icon with `HelpTextWithIconLayout`

## Props from Parent

```tsx
interface PropsTo<Entity>Settings {
  <entity>: Partial<<Entity>>;
  original<Entity>: Partial<<Entity>>;
  metadata: Metadata;
  on<Entity>Change: (entity: Partial<<Entity>>) => void;
  onRefresh: () => void;
  isModified: boolean;
  modifiedValues: () => Partial<<Entity>>;
  onResetValues: () => void;
  pathname: string;
  onOpenContextualPanel: () => void;  // REQUIRED
}
```

## Core Functions

```tsx
const { ipaObject, recordOnChange } = asRecord(props.<entity>, props.on<Entity>Change);

const onSave = () => {
  setSaving(true);
  save<Entity>(props.modifiedValues()).then((response) => {
    if (response.data?.result) {
      dispatch(addAlert({ name: "save-success", title: "Modified", variant: "success" }));
    }
    props.onResetValues();
    setSaving(false);
  });
};

const onRevert = () => {
  props.on<Entity>Change(props.original<Entity>);
  props.onRefresh();
};
```

## Toolbar (Fixed at Bottom)

```tsx
const toolbarFields = [
  { key: 0, element: <Button variant="secondary" onClick={props.onRefresh}>Refresh</Button> },
  { key: 1, element: <Button isDisabled={!props.isModified} onClick={onRevert}>Revert</Button> },
  { key: 2, element: <Button variant="primary" isDisabled={!props.isModified} onClick={onSave}>Save</Button> },
  { key: 3, element: <KebabLayout direction="up" dropdownItems={kebabItems} /> },
];
```

## JSX Structure (Simple Form)

```tsx
return (
  <TabLayout id="settings-page" toolbarItems={toolbarFields}>
    <Sidebar isPanelRight>
      <SidebarPanel variant="sticky">
        <HelpTextWithIconLayout textContent="Help" onClick={props.onOpenContextualPanel} />
      </SidebarPanel>
      <SidebarContent className="pf-v6-u-mr-xl">
        <TitleLayout headingLevel="h2" id="general" text="Entity settings" />
        <Form isHorizontal>{/* Form fields */}</Form>
      </SidebarContent>
    </Sidebar>
  </TabLayout>
);
```

For complex forms with JumpLinks, see [12-settings-patterns.md](12-settings-patterns.md).

## Related Files

| Topic | File |
|-------|------|
| Kebab menu modals | [04a-settings-kebab-modals.md](04a-settings-kebab-modals.md) |
| Form field components | [04b-settings-form-fields.md](04b-settings-form-fields.md) |
| Troubleshooting | [13-troubleshooting.md](13-troubleshooting.md) |

## Examples

| Type | File |
|------|------|
| Simple | `src/pages/IdPReferences/IdpReferencesSettings.tsx` |
| Complex | `src/pages/DNSZones/DnsZonesSettings.tsx` |
