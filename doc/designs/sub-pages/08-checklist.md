# Sub-Pages — Checklist

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Overview](01-overview.md) | [Main Pages Checklist](../main-pages/06-checklist-and-types.md)

Use this checklist when creating a new sub-page. Items marked with ✦ are always required.

## Files to Create

### For Settings Tab ✦

> ⚠️ **CREATION ORDER MATTERS:** Files must be created in this exact order:
> 1. `use<Entity>SettingsData.tsx` — Data hook (provides data to Tabs)
> 2. `<Entity>Tabs.tsx` — Tabs component (entry point, renders Settings)
> 3. `<Entity>Settings.tsx` — Settings form (child of Tabs)
>
> **The Settings component CANNOT exist without the Tabs component.** The Tabs component extracts the entity ID from the URL, fetches data, and passes props to Settings.

| File | Description |
|------|-------------|
| `src/hooks/use<Entity>SettingsData.tsx` | Data hook for API and state (create FIRST) |
| `src/pages/<Entity>/<Entity>Tabs.tsx` | Tabs component (entry point, create SECOND) |
| `src/pages/<Entity>/<Entity>Settings.tsx` | Settings tab content (create THIRD) |

### For Membership Tabs

| File | Description |
|------|-------------|
| `src/pages/<Entity>/<Entity>Members.tsx` | Members tab component |
| `src/pages/<Entity>/<Entity>MemberOf.tsx` | Member Of tab component |

### For Independent Sub-Pages

| File | Description |
|------|-------------|
| `src/pages/<Entity>/<Entity><SubPage>.tsx` | Independent sub-page (e.g., `RolesPrivileges.tsx`) |

### For Table-Based Tabs

| File | Description |
|------|-------------|
| `src/pages/<Entity>/<ChildEntity>.tsx` | Table tab component |
| `src/components/modals/<Entity>/Add<ChildEntity>Modal.tsx` | Add modal |
| `src/components/modals/<Entity>/Delete<ChildEntity>Modal.tsx` | Delete modal |

### Utility Files (If Needed)

| File | Description |
|------|-------------|
| `src/utils/<entity>Utils.tsx` | `asRecord`, `apiTo<Entity>` functions |

## Files to Modify ✦

| File | Change |
|------|--------|
| `src/navigation/AppRoutes.tsx` | Add route entries and imports |
| `src/pages/<Entity>/<Entity>.tsx` | **⚠️ Set `showLink={true}` in MainTable** |
| `src/utils/datatypes/globalDataTypes.ts` | Add entity interface (if missing) |
| `src/services/rpc<Entity>.ts` | Add RPC hooks |

> **⚠️ CRITICAL:** The `showLink={true}` change in the main page is **frequently forgotten**. Without it, table rows are not clickable and users cannot navigate to the sub-page. See [04-settings-tab.md](04-settings-tab.md#prerequisites--required-files-for-navigation) for details.

### Documentation Links (Optional)

| File | Change |
|------|--------|
| `src/assets/documentation/documentation-links.json` | **MANDATORY:** Add entry for `<entity>-settings` key (use empty array `[]` if no links provided) |

> ⚠️ **CRITICAL:** Missing entries cause runtime crashes. Always add the entry, even as an empty array. See [sub-pages.md](../sub-pages.md#documentation-links) for details.

## Naming Conventions

### File Names

| Component Type | Pattern | Example |
|----------------|---------|---------|
| Tabs | `<Entity>Tabs.tsx` | `DnsZonesTabs.tsx` |
| Settings | `<Entity>Settings.tsx` | `DnsZonesSettings.tsx` |
| Data hook | `use<Entity>SettingsData.tsx` | `useHostSettingsData.tsx` |

### URL Paths

| Type | Pattern | Example |
|------|---------|---------|
| Sub-page base | `/<parent-path>/<entity-id>` | `/dns-zones/example.com.` |
| Membership tab | `/<parent-path>/<entity-id>/<relation>_<target>` | `/hosts/server/memberof_hostgroup` |

### Import Conventions

**Always use absolute imports** starting with `src/`:

```tsx
// ✅ Correct:
import OtpTokensManagedBy from "src/pages/OtpTokens/OtpTokensManagedBy";

// ❌ Wrong:
import OtpTokensManagedBy from "./OtpTokensManagedBy";
```

## Data-Cy Attribute Conventions

```
<entity>-tab-<tab-name>
<entity>-tab-settings-button-<action>
<entity>-tab-settings-<field-type>-<field-name>
<entity>-tab-settings-kebab-<action>
```

**Examples:**
- `dns-zones-tab-settings`
- `dns-zones-tab-settings-button-save`
- `dns-zones-tab-settings-textbox-idnsname`

## Validation Checklist

### Functionality
- [ ] Tabs component loads without errors
- [ ] Data hook fetches entity data correctly
- [ ] Settings tab displays all required fields
- [ ] Save operation works with success/error alerts
- [ ] Revert button restores original values
- [ ] Refresh button reloads data
- [ ] Help link opens contextual help panel (links shown if configured)
- [ ] NotFound page shows for non-existent entities
- [ ] Kebab Enable/Disable conditionally enabled based on status
- [ ] Kebab actions show confirmation modals

### For Table Tabs
- [ ] Table displays data with correct columns
- [ ] Pagination and search work
- [ ] Add/Delete modals work

### For Independent Sub-Pages
- [ ] **`useUpdateRoute` hook called** with parent pathname (for nav bar highlighting on refresh)
- [ ] Data loads from parent entity's `_show` API (with `all: true` if needed)
- [ ] Table displays data with correct columns
- [ ] Pagination and search work
- [ ] Add modal fetches available items from correct API
- [ ] Add operation uses correct entity-specific API (not generic `_add_member`)
- [ ] Delete modal shows selected items
- [ ] Delete operation uses correct entity-specific API (not generic `_remove_member`)
- [ ] Success/error alerts display correctly
- [ ] Page wrapped in `PageSection` for proper alignment
- [ ] **If created from scratch:**
  - [ ] **ASKED USER** for required information (see [06-membership-tabs.md](06-membership-tabs.md#required-questions-for-new-components)):
    - [ ] Data source (API + field, e.g., `role_show` with `memberof_privilege`)
    - [ ] API call for listing available items (Add modal)
    - [ ] API response field for item identifier
    - [ ] Table column names
    - [ ] API call for Add operation (entity-specific)
    - [ ] API call for Delete operation (entity-specific)
    - [ ] Add modal UI pattern confirmation

### For Membership Tabs (Standard)
- [ ] **`useUpdateRoute` hook called** with parent pathname (for nav bar highlighting on refresh)
- [ ] Member lists load correctly from `member_*` or `memberof_*` fields
- [ ] Add/Remove operations use `_add_member` / `_remove_member` with correct entityType
- [ ] Entity ID fields handle array responses
- [ ] Direct/Indirect toggle works (if enabled) or is hidden (`membershipDisabled={true}`)
- [ ] **If new component created from scratch:**
  - [ ] **ASKED USER** for required information before creating (see [06-membership-tabs.md](06-membership-tabs.md#required-questions-for-new-components)):
    - [ ] Data source field (e.g., `member_sysaccount`)
    - [ ] API call for listing available items
    - [ ] API response field for item identifier
    - [ ] Table column names
    - [ ] Entity type for `_add_member`/`_remove_member` mutations
    - [ ] Direct/Indirect toggle visibility
    - [ ] Add modal UI pattern confirmation
  - [ ] Add button enabled and functional
  - [ ] Add modal uses standard pattern (`MemberOfAddModal` + `DualListSelectorGeneric`) **OR** user confirmed alternative
  - [ ] Delete button enabled when items selected
  - [ ] Delete modal opens and removes correctly
  - [ ] NO placeholder tabs or empty content

### Navigation
- [ ] **⚠️ Main page table rows clickable** — verify `showLink={true}` in `<Entity>.tsx` MainTable
- [ ] Clicking row navigates to sub-page (e.g., `/roles/admin`)
- [ ] Breadcrumb shows correct path
- [ ] Browser back/forward works
- [ ] Direct URL access works

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint errors (warnings ok if pre-existing)
- [ ] All `data-cy` attributes follow convention

## Post-Generation Validation ✦

**Run these checks in order:**

```bash
npm run prettier:fix   # Fix formatting
npm run knip           # Check unused exports
npm run lint           # Fix errors (warnings ok)
npm run build          # Catch TypeScript errors
```

**Quick combined check:**
```bash
npm run prettier:fix && npm run knip && npm run lint && npm run build
```

## Quick Reference: Settings Props

```tsx
<<Entity>Settings
  <entity>={settingsData.<entity>}
  original<Entity>={settingsData.original<Entity>}
  metadata={settingsData.metadata}
  on<Entity>Change={settingsData.set<Entity>}
  onRefresh={settingsData.refetch}
  isModified={settingsData.modified}
  isDataLoading={settingsData.isLoading}
  modifiedValues={settingsData.modifiedValues}
  onResetValues={settingsData.resetValues}
  pathname={pathname}
  onOpenContextualPanel={onOpenContextualPanel}  // REQUIRED: Help button handler
/>
```

> ⚠️ **CRITICAL:** The `onOpenContextualPanel` prop is **mandatory**. The Tabs component must define this handler and wrap content with `ContextualHelpPanel`.

## Common Issues

See [08a-common-issues.md](08a-common-issues.md) for detailed solutions to:
- MemberOfToolbar missing props
- Wrong table component imports
- API array response handling
- RTK Query skip option
- Modal integration issues
- Boolean status comparison failures
