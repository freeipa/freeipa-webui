# Sub-Pages

Guide for creating "sub-pages" (detail views) in the FreeIPA Modern WebUI. A sub-page is accessed by clicking a row in a main page table.

## What is a Sub-Page?

A sub-page is accessed by clicking a row in a main page table (e.g., clicking a Role in the Roles list). Sub-pages can contain different types of content:

### Sub-Page Types

| Type | Description | Example |
|------|-------------|---------|
| **Settings** | Edit entity properties via form fields | `RolesSettings.tsx`, `DnsZonesSettings.tsx` |
| **Membership Tabs** | Tabs showing related entities (Members, Member Of, Managed By) | `RolesMembers.tsx`, `UserMemberOf.tsx` |
| **Independent Sub-Page** | Entity-specific data displayed in a table with Add/Delete operations | `RolesPrivileges.tsx`, `DnsResourceRecords.tsx` |

### Independent Sub-Pages

**Independent sub-pages** are sub-pages that:
- Are **NOT** Settings pages (which edit entity properties)
- Are **NOT** Membership tab pages (which show Members, Member Of, Managed By relationships)
- Display **entity-specific data** from the parent entity's `_show` API response
- Have their own **Add/Delete operations** (often using different API calls than membership)

**Examples:**
| Entity | Independent Sub-Page | Data Field | Add/Delete API |
|--------|---------------------|------------|----------------|
| Roles | Privileges | `memberof_privilege` from `role_show` | `role_add_privilege` / `role_remove_privilege` |
| DNS Zones | Resource Records | Custom data from `dnsrecord_find` | `dnsrecord_add` / `dnsrecord_del` |

**Key Characteristics:**
1. Data comes from the parent entity's `_show` API (e.g., `role_show` returns `memberof_privilege`)
2. The API may need `all: true` parameter to include all fields
3. Add/Delete operations often use entity-specific commands (not generic `_add_member` / `_remove_member`)
4. These pages are independent tabs alongside Settings and Membership tabs

See [17-independent-sub-pages.md](sub-pages/17-independent-sub-pages.md) for implementation details.

### Tab Types Summary

| Tab Type | Purpose | Example Files |
|----------|---------|---------------|
| **Settings** | Edit entity properties | `DnsZonesSettings.tsx`, `RolesSettings.tsx` |
| **Member Of** | Show groups/rules this entity belongs to | `UserMemberOf.tsx`, `HostsMemberOf.tsx` |
| **Managed By** | Show entities that manage this one | `HostsManagedBy.tsx` |
| **Members** | Show entities that belong to this one | `UserGroupsMembers.tsx`, `RolesMembers.tsx` |
| **Independent** | Entity-specific table with Add/Delete | `RolesPrivileges.tsx`, `DnsResourceRecords.tsx` |

See [11-visual-reference.md](sub-pages/11-visual-reference.md) for ASCII diagrams.

## CRITICAL: Ask Before Leaving Functionality Incomplete

> ⚠️ **MANDATORY RULE:** When creating any sub-page—especially tab sections in `src/components/Members/`, `src/components/MemberOf/`, `src/components/ManagedBy/`, or `src/components/MemberManagers/`—the agent **MUST** verify the prompt contains sufficient information to implement **ALL** required functionality.

### Required Information Checklist

Before implementing a membership or table tab, confirm you have:

| Feature | Required Information |
|---------|---------------------|
| **Add button** | API to fetch available items, entity type for `_add_member` |
| **Delete button** | Entity type for `_remove_member` |
| **Table display** | Column names, property fields, identifier key |
| **Modals** | UI pattern (DualListSelector vs TextInput) |

### If Information Is Missing: ASK, Don't Skip

**NEVER** create a component with disabled Add/Delete buttons or incomplete functionality without explicit user approval. Instead:

1. **Identify the gap** — What specific information is missing?
2. **Ask a targeted question** — Examples:
   - "Should I implement the 'Add' button functionality? If yes, which API lists available items to add?"
   - "Which fields do you want to display in the 'Add' modal? Should I use the same component (DualListSelector) as in other components, or do you want a different pattern (e.g., TextInput)?"
   - "Which API command is used to delete a [entity] from [parent]?"
   - "What `entityType` value should be passed to `role_add_member` for this member type?"
3. **Wait for the answer** before proceeding

### Example: What NOT to Do

```tsx
// ❌ BAD: Disabled buttons without asking user
<MemberOfToolbar
  addButtonEnabled={false}      // Why disabled? User wasn't asked!
  onAddButtonClick={() => {}}   // Empty handler - incomplete!
  deleteButtonEnabled={false}
  onDeleteButtonClick={() => {}}
/>
```

### Example: What TO Do

```
Agent: "To implement the 'System accounts' Members tab, I need additional information:
1. What API lists available system accounts? (e.g., `sysaccount_find`)
2. What `entityType` should be used for `role_add_member`? (e.g., `sysaccount`)
3. Should I use a DualListSelector (searchable list) or TextInput (manual entry) for the Add modal?"
```

See [06c-membership-creating-new.md](sub-pages/06c-membership-creating-new.md) for the complete list of required questions.

---

## Sub-Page Structure

Sub-pages live under `src/pages/<EntityName>/` and are composed of:
- A **Tabs component** (`<Entity>Tabs.tsx`) — entry point, orchestrates tab navigation
- **Tab content components** — one per tab type needed

**Import convention:** Always use **absolute imports** (e.g., `import X from "src/pages/Entity/Component"`).

## Required Steps for Sub-Page Navigation

**CRITICAL:** Creating a sub-page requires **three changes** to enable navigation from the main page:

### 1. Create the Tabs Component (`<Entity>Tabs.tsx`)

The Tabs component is the **entry point** for every sub-page. It:
- Extracts the entity ID from the URL
- Fetches entity data using a custom data hook
- Renders breadcrumb navigation
- Orchestrates tab switching between Settings, membership, or custom tabs

See [02-tabs-component.md](sub-pages/02-tabs-component.md) for details.

### 2. Enable Clickable Rows in Main Page Table

In the main page (`<Entity>.tsx`), the `MainTable` component must have `showLink={true}`:

```tsx
<MainTable
  ...
  showLink={true}  // REQUIRED: enables navigation to sub-page
  pathname="entity-pathname"
/>
```

**Without `showLink={true}`, clicking a row will NOT navigate to the sub-page.**

### 3. Register Routes in AppRoutes.tsx

Add the sub-page route in `src/navigation/AppRoutes.tsx`:

```tsx
import <Entity>Tabs from "src/pages/<Entity>/<Entity>Tabs";

// In the Routes:
<Route path="<entity-pathname>">
  <Route path="" element={<<Entity> />} />
  <Route path=":<primaryKey>">
    <Route path="" element={<<Entity>Tabs section="settings" />} />
    {/* Additional sub-page routes go here */}
  </Route>
</Route>
```

### Summary Checklist

| Step | File | Change |
|------|------|--------|
| 1 | `<Entity>Tabs.tsx` | Create the Tabs component (entry point) |
| 2 | `<Entity>.tsx` | Set `showLink={true}` in `MainTable` |
| 3 | `AppRoutes.tsx` | Import `<Entity>Tabs` and add nested routes |

### File Creation Order

**IMPORTANT:** When creating a new Settings sub-page, files must be created in this order:

1. **`use<Entity>SettingsData.tsx`** — Data hook that fetches entity data
2. **`<Entity>Tabs.tsx`** — Tabs component (entry point, renders Settings)
   - Must include `ContextualHelpPanel` wrapper
   - Must include `isContextualPanelExpanded` state
   - Must include `onOpenContextualPanel` and `onCloseContextualPanel` handlers
   - Must pass `onOpenContextualPanel` to Settings component
3. **`<Entity>Settings.tsx`** — Settings form component
   - Must include `onOpenContextualPanel` prop
   - Must include `Sidebar` with `HelpTextWithIconLayout` (Help button)
4. **`rpc<Entity>.ts`** — Add `<entity>Show` query and `<entity>Mod` mutation
5. **`<entity>Utils.tsx`** — Add `asRecord` helper
6. **`AppRoutes.tsx`** — Register route
7. **`<Entity>.tsx`** — Enable `showLink={true}`

The Tabs component is the **parent** of the Settings component. Without `<Entity>Tabs.tsx`, a Settings component cannot:
- Extract the entity ID from the URL
- Receive entity data from the API
- Be rendered by React Router

**Example implementations:**
- `src/pages/SudoRules/SudoRulesTabs.tsx` + `SudoRulesSettings.tsx`
- `src/pages/Trusts/TrustsTabs.tsx` + `TrustsSettings.tsx`
- `src/pages/AutoMemUserRules/AutoMemRulesTabs.tsx` + `AutoMemSettings.tsx`

## Quick Start — Example Prompts

See [10-prompt-writing-guide.md](sub-pages/10-prompt-writing-guide.md) for complete guidelines.

```
Based on the `sub-pages` guide, generate a sub-page for 'RADIUS Servers' with:
- IPA API object: `radiusproxy`
- Primary key: `cn`
- Parent pathname: `radius-servers`
- Settings title: "RADIUS server settings"
- Settings fields: `cn` → "Name" (read-only), `ipatokenradiusserver` → "Server" (required)
```

## Settings Toolbar Buttons

Every Settings tab must include these standard toolbar buttons:

| Key | Button | Variant | Behavior |
|-----|--------|---------|----------|
| 0 | **Refresh** | `secondary` | Always enabled; calls `props.onRefresh()` |
| 1 | **Revert** | `secondary` | Enabled when `isModified`; restores original values |
| 2 | **Save** | `primary` | Enabled when `isModified` and not saving |
| 3 | **Kebab** | — | Optional; Enable/Disable/Delete actions |

The toolbar must be **fixed at the bottom**. Use `TabLayout` wrapper. See [04-settings-tab.md](sub-pages/04-settings-tab.md) for implementation.

## Settings Section Patterns

| Pattern Name | Description |
|--------------|-------------|
| **Horizontal Form** | Simple form with labeled fields (1-4 fields) |
| **Two-Column Form** | Responsive form split into 2 columns (5+ fields) |
| **Category Toggle + Tables** | Toggle with always-visible tabbed tables |
| **Sidebar Navigation** | Jump links for multi-section pages |

See [12-settings-patterns.md](sub-pages/12-settings-patterns.md) for details.

## Navigation Bar Highlighting

**CRITICAL:** Every sub-page component (Settings, Members, Independent Sub-Pages) must call `useUpdateRoute` to highlight the parent entity in the navigation bar:

```tsx
import useUpdateRoute from "src/hooks/useUpdateRoute";

// Inside the component
useUpdateRoute({ pathname: "parent-pathname", noBreadcrumb: true });
```

This ensures the navigation bar correctly highlights the parent entity when:
- The page is refreshed
- The user navigates directly to a sub-page URL

**Required in:**
- Settings components (e.g., `RolesSettings.tsx`)
- Membership tab components (e.g., `RolesMembers.tsx`)
- Independent sub-page components (e.g., `RolesPrivileges.tsx`)

## Main Page Table Link

**CRITICAL:** Enable row clicks in the main page's `MainTable` to navigate to the sub-page. See [Required Steps for Sub-Page Navigation](#required-steps-for-sub-page-navigation) for the complete checklist.

```tsx
<MainTable
  ...
  showLink={true}  // Must be true to enable navigation to sub-page
  pathname="entity-pathname"
/>
```

If `showLink={false}`, clicking a row won't navigate to the sub-page. This is a common oversight when adding sub-pages to existing main pages.

## Contextual Help Panel

**CRITICAL:** Every Settings page must include a Help link that opens the contextual help panel.

### Implementation Steps

1. **In the Tabs component** (`<Entity>Tabs.tsx`):
   - Import `ContextualHelpPanel`
   - Add state: `isContextualPanelExpanded`
   - Add handlers: `onOpenContextualPanel`, `onCloseContextualPanel`
   - Wrap page content with `ContextualHelpPanel`
   - Pass `onOpenContextualPanel` to Settings component

2. **In the Settings component** (`<Entity>Settings.tsx`):
   - Add `onOpenContextualPanel` prop
   - Use `Sidebar` with `SidebarPanel` containing `HelpTextWithIconLayout`
   - Wrap form content in `SidebarContent`

### Documentation Links

**MANDATORY:** Every Settings page **must** have an entry in `src/assets/documentation/documentation-links.json`. The `ContextualHelpPanel` component requires this entry to exist.

#### Adding Documentation Links Entry

Add an entry using the `fromPage` value as the key:

```json
{
  "entity-settings": [
    {
      "name": "Link title",
      "url": "https://example.com/docs"
    }
  ]
}
```

If no documentation links are available, add an **empty array**:

```json
{
  "entity-settings": []
}
```

> ⚠️ **CRITICAL:** Missing entries will cause a runtime crash: `TypeError: can't access property "length", ... is undefined`. Always add the entry to `documentation-links.json`, even if empty.

**Do NOT modify `ContextualHelpPanel.tsx`** — new components must adapt to existing infrastructure by providing the required JSON entry.

See [12-settings-patterns.md](sub-pages/12-settings-patterns.md) for the "Contextual Help Panel" pattern details.

**Reference:** `HostsTabs.tsx` + `HostsSettings.tsx`

## Mandatory: API Data Verification

**IMPORTANT:** When implementing API calls, you MUST verify data flows correctly to the UI. Common issues:

1. **Check API response format** — Fields may be strings vs arrays
2. **Verify data extraction** — Array indexing on strings returns single characters
3. **Confirm UI displays data** — Empty forms often indicate data transformation issues

See [13-troubleshooting.md](sub-pages/13-troubleshooting.md) for solutions.

## Post-Generation Checks

```bash
npm run prettier:fix && npm run lint && npm run knip && npm run build
```

Then manually verify data displays in the browser. See [08-checklist.md](sub-pages/08-checklist.md).

## Guide Files

### Core Guides
| File | Contents |
|------|----------|
| [01-overview.md](sub-pages/01-overview.md) | Required inputs, tab shorthand, inference rules |
| [02-tabs-component.md](sub-pages/02-tabs-component.md) | Tabs component anatomy, URL params, breadcrumbs |
| [03-data-hook.md](sub-pages/03-data-hook.md) | Data hook pattern for Settings tabs |
| [04-settings-tab.md](sub-pages/04-settings-tab.md) | Settings tab, form layout, toolbar actions |
| [05-table-tab.md](sub-pages/05-table-tab.md) | Custom table tabs, pagination, search |
| [06-membership-tabs.md](sub-pages/06-membership-tabs.md) | Member Of / Members / Managed by tabs |
| [07-routing.md](sub-pages/07-routing.md) | Sub-page route patterns |
| [08-checklist.md](sub-pages/08-checklist.md) | Files checklist, validation |
| [09-modals.md](sub-pages/09-modals.md) | Add/Delete modal templates |
| [10-prompt-writing-guide.md](sub-pages/10-prompt-writing-guide.md) | How to write effective prompts |

### Supplementary Guides
| File | Contents |
|------|----------|
| [04a-settings-kebab-modals.md](sub-pages/04a-settings-kebab-modals.md) | Kebab menu, modal integration |
| [04b-settings-form-fields.md](sub-pages/04b-settings-form-fields.md) | Form components, field config |
| [06a-membership-custom.md](sub-pages/06a-membership-custom.md) | Custom membership implementation |
| [06b-membership-tables.md](sub-pages/06b-membership-tables.md) | Generic table components |
| [08a-common-issues.md](sub-pages/08a-common-issues.md) | Common implementation issues |
| [11-visual-reference.md](sub-pages/11-visual-reference.md) | ASCII diagrams by tab type |
| [12-settings-patterns.md](sub-pages/12-settings-patterns.md) | Settings section UI patterns |
| [13-troubleshooting.md](sub-pages/13-troubleshooting.md) | Common issues and solutions |
| [14-entity-types.md](sub-pages/14-entity-types.md) | Entity data types, tab shorthand |
| [15-category-toggle-sections.md](sub-pages/15-category-toggle-sections.md) | Category toggle + tables pattern |
| [16-component-catalog.md](sub-pages/16-component-catalog.md) | Complete component reference |
| [17-independent-sub-pages.md](sub-pages/17-independent-sub-pages.md) | Entity-specific table sub-pages (not Settings/Membership) |

## Shared with Main Pages

| File | Relevant for |
|------|--------------|
| [main-pages/07-add-modal.md](main-pages/07-add-modal.md) | Form components, field naming |
| [main-pages/08-delete-modal-and-utils.md](main-pages/08-delete-modal-and-utils.md) | Entity utils (`asRecord`, `apiTo<Entity>`) |
| [main-pages/09-rpc-service.md](main-pages/09-rpc-service.md) | RPC service templates |
| [main-pages/10-routing-and-conventions.md](main-pages/10-routing-and-conventions.md) | Routing, data-cy naming |
