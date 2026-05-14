# Sub-Pages — Prompt Writing Guide

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Patterns](12-settings-patterns.md)

This guide helps you write effective prompts for generating sub-pages.

## Prompt Structure

```
Based on the `sub-pages` guide, generate a [Tab Type] page for '[Entity Name]' with:
- IPA API object: `<api_object_name>`
- Primary key: `<primary_key_field>`
- Parent pathname: `<url-path>`
- Entity data type: `<TypeScriptInterface>`

[Section definitions...]

- Kebab menu: [actions]
```

## Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **IPA API object** | FreeIPA API object name (lowercase) | `selinuxusermap`, `user` |
| **Primary key** | Field for routing/identification | `cn`, `uid` |
| **Parent pathname** | URL path segment (kebab-case) | `selinux-user-maps` |
| **Entity data type** | TypeScript interface | `SELinuxUserMap` |

## Defining Sections

### Horizontal Form Pattern

```
- Settings section: "General" (Horizontal Form pattern)
  - Fields:
    - `cn` → "Rule name" (read-only)
    - `description` → "Description" (IpaTextArea)
    - `ipaselinuxuser` → "SELinux user" (required)
```

**Field modifiers:** `read-only`, `required`, `IpaTextArea`, `IpaNumberInput`, `IpaSelect`, `IpaCalendar`

### Category Toggle + Tables Pattern

For sections with toggle and always-visible tables:

```
- Settings section: "User" (Category Toggle + Tables pattern)
  - Toggle: `usercategory` ("Anyone" / "Specified users and groups")
  - Tab 1: Users (`memberuser_user`)
  - Tab 2: User groups (`memberuser_group`)
```

### Category Checkbox + Tables Pattern

For sections with checkbox and conditionally hidden tables:

```
- Settings section: "Who" (Category Checkbox + Tables pattern)
  - Checkbox: `usercategory` ("Allow anyone")
  - Tab 1: Users (`memberuser_user`)
  - Tab 2: User groups (`memberuser_group`)
```

### Two-Column Form Pattern

```
- Settings section: "Token settings" (Two-Column Form pattern)
  - Column 1: `field1`, `field2`
  - Column 2: `field3`, `field4`
```

## Pattern Reference

| ❌ Don't Write | ✅ Write Instead |
|----------------|------------------|
| "Table as in Sudo rules 'Who' section" | `(Category Toggle + Tables pattern)` |
| "Checkbox with hidden tables" | `(Category Checkbox + Tables pattern)` |
| "Form split into two columns" | `(Two-Column Form pattern)` |
| "Simple form with fields" | `(Horizontal Form pattern)` |

## Complete Example

### ✅ Clear Prompt

```
Based on the `sub-pages` guide, generate a Settings page for 'SELinux user maps' with:
- IPA API object: `selinuxusermap`
- Primary key: `cn`
- Parent pathname: `selinux-user-maps`
- Entity data type: `SELinuxUserMap`

- Settings section: "General" (Horizontal Form pattern)
  - Fields:
    - `cn` → "Rule name" (read-only)
    - `description` → "Description" (IpaTextArea)
    - `ipaselinuxuser` → "SELinux user" (required)

- Settings section: "User" (Category Toggle + Tables pattern)
  - Toggle: `usercategory` ("Anyone" / "Specified users and groups")
  - Tab 1: Users (`memberuser_user`)
  - Tab 2: User groups (`memberuser_group`)

- Sidebar sections: "General", "User", "Host"
- Kebab menu: Enable, Disable, Delete
```

## Independent Sub-Pages

Independent sub-pages display entity-specific data (not Settings, not Membership tabs).

### Template

```
Based on the `sub-pages` guide, generate a '<SubPageName>' page for '<Entity>' with:
- IPA API object: `<entity>`
- Primary key: `<field_name>` (field containing the data to display)
- Data source: `<entity>_show` API response (with `all: true` if needed)
- Table columns: "<Column Name>" (`<field_name>`)
- Parent pathname: `<entity-pathname>`
- Entity data type: `<EntityType>`
- Operations: 'Refresh', 'Delete', 'Add'
- 'Add' modal:
    - Fields: data provided by DualListSelector
    - IPA call for available options: `<related_entity>_find`. Parameters: `no_members: true`
    - IPA command: `<entity>_add_<relation>`
- 'Delete' modal:
    - IPA command: `<entity>_remove_<relation>`
```

### Example: Privileges Page for Roles

```
Based on the sub-pages guide, generate a 'Privileges' page for 'Roles' with:
- IPA API object: `role`
- Primary key: `memberof_privilege`
- Data source: `role_show` API response (with `all: true` to include memberof fields)
- Table columns: "Privilege name" (`memberof_privilege`)
- Parent pathname: `roles`
- Entity data type: `Role`
- Operations: 'Refresh', 'Delete', 'Add'
- 'Add' modal:
    - Fields: data provided by DualListSelector
    - IPA call for available options: `privilege_find`. Parameters: `no_members: true`
    - IPA command: `role_add_privilege`
- 'Delete' modal:
    - IPA command: `role_remove_privilege`
```

**Key differences from Membership tabs:**
- Data source explicitly specified (e.g., `role_show` with `all: true`)
- API commands are entity-specific (e.g., `role_add_privilege` not `role_add_member`)

See [17-independent-sub-pages.md](17-independent-sub-pages.md) for implementation details.

## Optional Features

```
- Sidebar sections: "General", "Options", "User"
- Help panel: "entity-settings"
```

## Finding Field Names

1. **Check the TypeScript interface** in `globalDataTypes.ts`
2. **Check the API metadata** — fields in `takes_params`
3. **Look at similar entities** — Sudo rules and HBAC rules share patterns

## Common Mistakes

### 1. Wrong Primary Key
```
❌ Primary key: `ipatokenuniqueid`  (wrong for SELinux user maps)
✅ Primary key: `cn`
```

### 2. Missing Pattern Name
```
❌ - Settings title: "User"
     - Table as in Sudo rules...

✅ - Settings section: "User" (Category Toggle + Tables pattern)
     - Toggle: `usercategory`...
```

### 3. Inconsistent Naming
```
❌ - Settings title 1: "General"
✅ - Settings section: "General"
```

### 4. Missing Toggle/Checkbox Field
```
❌ - Tab 1: Users (`memberuser_user`)

✅ - Toggle: `usercategory` ("Anyone" / "Specified")
   - Tab 1: Users (`memberuser_user`)
```

### 5. Forgetting Member Field Names
```
❌ - Tab 1: Users
✅ - Tab 1: Users (`memberuser_user`)
```

## Quick Reference

```
REQUIRED:           PATTERNS:                       MODIFIERS:
- IPA API object    Horizontal Form                 (read-only)
- Primary key       Two-Column Form                 (required)
- Parent pathname   Category Toggle + Tables        (IpaTextArea)
- Entity data type  Category Checkbox + Tables      (IpaNumberInput)
                    Sidebar Navigation              (IpaSelect)
                    Contextual Help Panel           (IpaCalendar)
```
