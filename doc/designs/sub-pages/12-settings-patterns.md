# Sub-Pages — Settings Section Patterns

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Tab](04-settings-tab.md) | [Prompt Writing Guide](10-prompt-writing-guide.md)

Settings pages use reusable UI patterns. When writing prompts, **reference these patterns by name**.

## Pattern Catalog

| Pattern Name | Description | Example Files |
|--------------|-------------|---------------|
| **Horizontal Form** | Simple form with labeled fields | `HostGroupsSettings.tsx`, `UserGroupsSettings.tsx` |
| **Two-Column Form** | Responsive form split into 2 columns | `OtpTokensSettings.tsx`, `DnsZonesSettings.tsx` |
| **Category Toggle + Tables** | Toggle (Anyone/Specified) with always-visible tabbed tables | `SudoRulesWho.tsx`, `AccessThisHost.tsx` |
| **Category Checkbox + Tables** | Checkbox (Allow anyone) with conditionally hidden tables | `HBACRulesSettings.tsx`, `NetgroupsSettings.tsx` |
| **Sidebar Navigation** | Jump links for multi-section pages | `SudoRulesSettings.tsx`, `HBACRulesSettings.tsx` |
| **Contextual Help Panel** | Help button that opens documentation drawer | `UserSettings.tsx`, `HostsSettings.tsx` |

## Horizontal Form

Simple horizontal form. **Components:** `Form` (isHorizontal), `FormGroup`, `IpaTextInput`, plus mandatory `Sidebar` with Help button.

**When to use:** Settings with 1-4 fields.

```
- Settings section: "General"
  - Fields: `description` → "Description" (IpaTextArea)
```

**Required structure:**
```tsx
<TabLayout id="settings-page" toolbarItems={toolbarFields}>
  <Sidebar isPanelRight>
    <SidebarPanel variant="sticky">
      <HelpTextWithIconLayout textContent="Help" onClick={props.onOpenContextualPanel} />
    </SidebarPanel>
    <SidebarContent className="pf-v6-u-mr-xl">
      <TitleLayout ... />
      <Form isHorizontal>{/* Form fields */}</Form>
    </SidebarContent>
  </Sidebar>
</TabLayout>
```

> ⚠️ **Note:** The Help button (`HelpTextWithIconLayout` in `Sidebar`) is **mandatory** for all Settings pages, including simple Horizontal Form layouts.

**Reference:** `IdpReferencesSettings.tsx`, `RolesSettings.tsx`

## Two-Column Form

Responsive form in two columns. **Components:** `Form`, `Flex`, `FlexItem`, `FormGroup`

**When to use:** Settings with 5+ fields.

```
- Settings section: "Token settings"
  - Column 1: `field1`, `field2`, `field3`
  - Column 2: `field4`, `field5`, `field6`
```

**Reference:** `OtpTokensSettings.tsx`

## Category Toggle + Tables

Toggle ("Anyone" vs "Specified") with **always-visible** tabbed tables. Tables show empty when "Anyone" is selected.

**Components:** `IpaToggleGroup`, `Tabs`, `Tab`, `KeytabTableWithFilter`

**When to use:** Rule-based entities (Sudo rules, SELinux user maps).

```
- Settings section: "User" (Category Toggle + Tables pattern)
  - Toggle: `usercategory` ("Anyone" / "Specified users and groups")
  - Tab 1: Users (`memberuser_user`)
  - Tab 2: User groups (`memberuser_group`)
```

**Key props:**
- `IpaToggleGroup`: `options`, `optionSelected`, `setOptionSelected`
- `KeytabTableWithFilter`: `entityType`, `tableEntryList`, `onAdd`, `onDelete`, `checkboxesDisabled`

**Critical implementation notes:**

1. **Membership fields must be typed as arrays** — See [Entity Utils](../main-pages/08-delete-modal-and-utils.md#critical-membership-array-fields). Fields like `memberuser_user`, `memberhost_host` must be:
   - Typed as `string[]` in `globalDataTypes.ts`
   - NOT included in `simpleValues` (so they remain arrays)
   - Initialized as `[]` in `createEmpty<Entity>()`

2. **Tables show empty when "Anyone" is selected** — use `useMemo` with the toggle state:
   ```typescript
   const anyUserOptionSelected = userOptionSelected === "Anyone";
   
   const usersList = React.useMemo<TableEntry[]>(() => {
     if (anyUserOptionSelected) return [];  // Empty when "Anyone"
     const members = props.map.memberuser_user;
     if (!members || !Array.isArray(members)) return [];
     return members.map((entry) => ({ entry, showLink: true }));
   }, [props.map.memberuser_user, anyUserOptionSelected]);
   ```

3. **Member fields are managed via separate API endpoints** — NOT via `*_mod`:
   - Add members: `*_add_user`, `*_add_host`
   - Remove members: `*_remove_user`, `*_remove_host`

4. **Filter member fields in the save mutation** — The `*_mod` API does NOT accept member fields:
   ```typescript
   saveEntity: build.mutation({
     query: (entity) => {
       const params = { ...entity };
       delete params["cn"];
       // Member fields managed via separate endpoints
       delete params["memberuser_user"];
       delete params["memberuser_group"];
       delete params["memberhost_host"];
       delete params["memberhost_hostgroup"];
       return getCommand({ method: "entity_mod", params: [[entity.cn], params] });
     },
   }),
   ```

5. **Clear members when switching to "Anyone"** — When the category is changed from "Specified" to "All" (Anyone), all existing members in that category must be removed before saving. The `*_mod` API with `*category=all` does NOT automatically remove members:
   ```typescript
   const onSave = () => {
     setSaving(true);
     const modifiedValues = props.modifiedValues();
     const keysInObject = Object.keys(modifiedValues);

     // Check if category is being changed to "all" (Anyone)
     if (
       (keysInObject.includes("usercategory") &&
         modifiedValues.usercategory === "all") ||
       (keysInObject.includes("hostcategory") &&
         modifiedValues.hostcategory === "all")
     ) {
       // Remove all users and groups first, then save
       const usersToRemove = props.map.memberuser_user || [];
       const groupsToRemove = props.map.memberuser_group || [];
       if (keysInObject.includes("usercategory") && modifiedValues.usercategory === "all") {
         onDeleteAllUsersAndSave(usersToRemove, groupsToRemove);
       }

       // Remove all hosts and host groups first, then save
       const hostsToRemove = props.map.memberhost_host || [];
       const hostGroupsToRemove = props.map.memberhost_hostgroup || [];
       if (keysInObject.includes("hostcategory") && modifiedValues.hostcategory === "all") {
         onDeleteAllHostsAndSave(hostsToRemove, hostGroupsToRemove);
       }
     } else {
       // Regular save without category changes
       onSaveRule();
     }
   };
   ```

   The helper functions (`onDeleteAllUsersAndSave`, `onDeleteAllHostsAndSave`) should:
   - Remove users/hosts first via `*_remove_user` or `*_remove_host` API
   - Then remove groups/hostgroups via the same API (with different `type` parameter)
   - Call `props.onRefresh()` to update local state
   - Finally call the regular save function

**Reference:** `SudoRulesSettings.tsx`, `SELinuxUserMapsSettings.tsx`

## Category Checkbox + Tables

Checkbox ("Allow anyone") with **conditionally visible** tables. Tables only appear when unchecked.

**Components:** `IpaCheckbox` (`altTrue="all"`, `altFalse=""`), `Tabs`, `Tab`

**When to use:** HBAC rules, Netgroups.

```
- Settings section: "Who" (Category Checkbox + Tables pattern)
  - Checkbox: `usercategory` ("Allow anyone")
  - Tab 1: Users (`memberuser_user`)
```

**Reference:** `HBACRulesSettings.tsx`, `NetgroupsSettings.tsx`

## Sidebar Navigation

Sticky sidebar with jump links. **Components:** `SidebarLayout` or manual `Sidebar` + `JumpLinks`

**When to use:** Settings pages with 3+ sections.

```
- Sidebar sections: "General", "User", "Host", "Options"
```

**Reference:** `SudoRulesSettings.tsx`

## Contextual Help Panel

> ⚠️ **MANDATORY:** The Help button is required for **ALL** Settings pages, not just those with documentation links.

Help button opens slide-out drawer with documentation links.

**Components:**
- `ContextualHelpPanel` — drawer wrapper (in parent Tabs)
- `HelpTextWithIconLayout` — help button (in Settings, inside `SidebarPanel`)

**Implementation (in Tabs component):**
```tsx
// State
const [isContextualPanelExpanded, setIsContextualPanelExpanded] = React.useState(false);

// Handlers
const onOpenContextualPanel = () => setIsContextualPanelExpanded(!isContextualPanelExpanded);
const onCloseContextualPanel = () => setIsContextualPanelExpanded(false);

// JSX - wrap page content
<ContextualHelpPanel
  fromPage="entity-settings"
  isExpanded={isContextualPanelExpanded}
  onClose={onCloseContextualPanel}
>
  {/* PageSection content here */}
</ContextualHelpPanel>
```

**Implementation (in Settings component):**
```tsx
// Props interface must include:
onOpenContextualPanel: () => void;

// JSX - inside TabLayout, use Sidebar pattern:
<Sidebar isPanelRight>
  <SidebarPanel variant="sticky">
    <HelpTextWithIconLayout textContent="Help" onClick={props.onOpenContextualPanel} />
  </SidebarPanel>
  <SidebarContent>{/* Form content */}</SidebarContent>
</Sidebar>
```

**MANDATORY:** Add an entry for the `fromPage` value in `src/assets/documentation/documentation-links.json`. Use an empty array `[]` if no links are available. Missing entries cause runtime crashes.

**Reference:** `HostsTabs.tsx` + `HostsSettings.tsx`, `RolesTabs.tsx` + `RolesSettings.tsx`

## Pattern Decision Guide

| Scenario | Recommended Pattern |
|----------|---------------------|
| Simple form (1-4 fields) | Horizontal Form |
| Many fields (5+) | Two-Column Form |
| "Apply to all" with visible disabled tables | Category Toggle + Tables |
| "Apply to all" with hidden tables | Category Checkbox + Tables |
| Multiple sections | Add Sidebar Navigation |
| Provide documentation links | Add Contextual Help Panel |

## Using Patterns in Prompts

Instead of:
```
- Table as in Sudo rules settings page > 'Who' section
```

Use:
```
- Settings section: "User" (Category Toggle + Tables pattern)
  - Toggle: `usercategory`
  - Tab 1: Users (`memberuser_user`)
```
