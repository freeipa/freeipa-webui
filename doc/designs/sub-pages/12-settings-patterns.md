# Sub-Pages — Settings Section Patterns

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Tab](04-settings-tab.md) | [Category Toggle](15-category-toggle-sections.md) | [Component Catalog](../components/00-overview.md)

Reference patterns by name in prompts.

## Pattern Catalog

| Pattern | When to Use | Example Files |
|---------|-------------|---------------|
| **Horizontal Form** | 1-4 fields | `RolesSettings.tsx` |
| **Two-Column Form** | 5+ fields | `OtpTokensSettings.tsx` |
| **Category Toggle + Tables** | Rule entities (Sudo, SELinux) | `SudoRulesWho.tsx` |
| **Category Checkbox + Tables** | HBAC rules, Netgroups | `HBACRulesSettings.tsx` |
| **Sidebar Navigation** | 3+ sections | `SudoRulesSettings.tsx` |
| **Contextual Help Panel** | All Settings (mandatory) | `HostsSettings.tsx` |

## Horizontal Form

Simple form with `Form isHorizontal`. **Mandatory:** `Sidebar` with Help button.

```tsx
<TabLayout id="settings-page" toolbarItems={toolbarFields}>
  <Sidebar isPanelRight>
    <SidebarPanel variant="sticky">
      <HelpTextWithIconLayout textContent="Help" onClick={props.onOpenContextualPanel} />
    </SidebarPanel>
    <SidebarContent className="pf-v6-u-mr-xl">
      <TitleLayout ... />
      <Form isHorizontal>{/* Fields */}</Form>
    </SidebarContent>
  </Sidebar>
</TabLayout>
```

## Category Toggle + Tables

Toggle ("Anyone" / "Specified") with always-visible tabbed tables.

**Critical notes:**
1. Member fields must be `string[]` (NOT in `simpleValues`)
2. Tables show empty when "Anyone" selected
3. Use separate APIs: `*_add_user`, `*_remove_user`
4. Filter member fields in `*_mod` mutation
5. Clear members when switching to "Anyone"

See [15-category-toggle-sections.md](15-category-toggle-sections.md) for implementation.

## Contextual Help Panel

> ⚠️ **MANDATORY** for ALL Settings pages.

**In Tabs component:**
```tsx
<ContextualHelpPanel fromPage="entity-settings" isExpanded={...} onClose={...}>
  {/* Page content */}
</ContextualHelpPanel>
```

**In Settings component:**
```tsx
<HelpTextWithIconLayout textContent="Help" onClick={props.onOpenContextualPanel} />
```

**MANDATORY:** Add entry in `documentation-links.json` (use `[]` if no links).

## Pattern Decision Guide

| Scenario | Pattern |
|----------|---------|
| Simple form (1-4 fields) | Horizontal Form |
| Many fields (5+) | Two-Column Form |
| "Apply to all" with visible tables | Category Toggle + Tables |
| "Apply to all" with hidden tables | Category Checkbox + Tables |
| Multiple sections | Add Sidebar Navigation |

## Using Patterns in Prompts

```
- Settings section: "User" (Category Toggle + Tables pattern)
  - Toggle: `usercategory`
  - Tab 1: Users (`memberuser_user`)
```
