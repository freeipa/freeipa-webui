# Sub-Pages

Guide for creating "sub-pages" (detail views) in the FreeIPA Modern WebUI. A sub-page is accessed by clicking a row in a main page table.

## Sub-Page Types

| Type | Description | Example |
|------|-------------|---------|
| **Settings** | Edit entity properties via form fields | `RolesSettings.tsx` |
| **Membership Tabs** | Tabs showing related entities (Members, Member Of) | `RolesMembers.tsx` |
| **Independent** | Entity-specific table with Add/Delete | `RolesPrivileges.tsx` |

See [11-visual-reference.md](sub-pages/11-visual-reference.md) for ASCII diagrams and [10-prompt-writing-guide.md](sub-pages/10-prompt-writing-guide.md) for how to write effective prompts.

## CRITICAL: Read Best Practices First

> ⚠️ **MANDATORY:** Before creating any sub-page, read [00-best-practices.md](sub-pages/00-best-practices.md).

Key rules:
- **Never** create disabled buttons or empty handlers without asking
- **Always** ask for missing information before implementing
- **Always** run post-generation validation commands

See [00-best-practices.md](sub-pages/00-best-practices.md) for the complete guide.

---

## Required Steps for Sub-Page Navigation

| Step | File | Change |
|------|------|--------|
| 1 | `<Entity>Tabs.tsx` | Create Tabs component (entry point) |
| 2 | `<Entity>.tsx` | Set `showLink={true}` in MainTable |
| 3 | `AppRoutes.tsx` | Add nested routes |

### File Creation Order

1. `use<Entity>SettingsData.tsx` — Data hook
2. `<Entity>Tabs.tsx` — Tabs component with `ContextualHelpPanel`
3. `<Entity>Settings.tsx` — Settings form with `Sidebar` + Help button
4. `rpc<Entity>.ts` — Add queries/mutations
5. `<entity>Utils.tsx` — Add `asRecord` helper
6. `AppRoutes.tsx` — Register route
7. `<Entity>.tsx` — Enable `showLink={true}`

See [02-tabs-component.md](sub-pages/02-tabs-component.md) for Tabs details.

## Navigation Bar Highlighting

**Every sub-page** must call `useUpdateRoute`:

```tsx
useUpdateRoute({ pathname: "parent-pathname", noBreadcrumb: true });
```

## Contextual Help Panel

**Every Settings page must include Help link.** Add entry in `documentation-links.json`:

```json
{ "entity-settings": [] }
```

> ⚠️ Missing entries cause runtime crash. See [12-settings-patterns.md](sub-pages/12-settings-patterns.md).

## Post-Generation Checks

```bash
npm run prettier:fix && npm run lint && npm run knip && npm run build
```

See [08-checklist.md](sub-pages/08-checklist.md) for full validation.

## Guide Files

### Core
| File | Contents |
|------|----------|
| [00-best-practices.md](sub-pages/00-best-practices.md) | **Read first** — Golden rules, anti-patterns, required practices |
| [01-overview.md](sub-pages/01-overview.md) | Required inputs, inference rules |
| [02-tabs-component.md](sub-pages/02-tabs-component.md) | Tabs anatomy, URL params |
| [03-data-hook.md](sub-pages/03-data-hook.md) | Data hook pattern |
| [04-settings-tab.md](sub-pages/04-settings-tab.md) | Settings form, toolbar |
| ↳ [04a-settings-kebab-modals.md](sub-pages/04a-settings-kebab-modals.md) | Kebab menu actions, modals |
| ↳ [04b-settings-form-fields.md](sub-pages/04b-settings-form-fields.md) | Form components, field config |
| [05-table-tab.md](sub-pages/05-table-tab.md) | Custom table tabs |
| [06-membership-tabs.md](sub-pages/06-membership-tabs.md) | Membership tabs |
| ↳ [06a-membership-custom.md](sub-pages/06a-membership-custom.md) | Custom membership implementation |
| ↳ [06b-membership-tables.md](sub-pages/06b-membership-tables.md) | Generic membership tables |
| ↳ [06c-membership-creating-new.md](sub-pages/06c-membership-creating-new.md) | Creating new membership components |
| [07-routing.md](sub-pages/07-routing.md) | Route patterns |
| [08-checklist.md](sub-pages/08-checklist.md) | Validation checklist |
| ↳ [08a-common-issues.md](sub-pages/08a-common-issues.md) | Common implementation issues |

### Supplementary
| File | Contents |
|------|----------|
| [09-modals.md](sub-pages/09-modals.md) | Add/Delete modals |
| [10-prompt-writing-guide.md](sub-pages/10-prompt-writing-guide.md) | Prompt guidelines |
| [11-visual-reference.md](sub-pages/11-visual-reference.md) | ASCII layout diagrams |
| [12-settings-patterns.md](sub-pages/12-settings-patterns.md) | UI patterns |
| [13-troubleshooting.md](sub-pages/13-troubleshooting.md) | Troubleshooting overview |
| ↳ [13a-troubleshooting-forms.md](sub-pages/13a-troubleshooting-forms.md) | Form issues |
| ↳ [13b-troubleshooting-api.md](sub-pages/13b-troubleshooting-api.md) | API issues |
| ↳ [13c-troubleshooting-save-revert.md](sub-pages/13c-troubleshooting-save-revert.md) | Save/Revert issues |
| [14-entity-types.md](sub-pages/14-entity-types.md) | TypeScript interfaces, metadata |
| [15-category-toggle-sections.md](sub-pages/15-category-toggle-sections.md) | Category toggle overview |
| ↳ [15a-category-toggle-basics.md](sub-pages/15a-category-toggle-basics.md) | RPC mutations, hook config |
| ↳ [15b-category-toggle-advanced.md](sub-pages/15b-category-toggle-advanced.md) | Clearing members, API naming |
| [16-component-catalog.md](sub-pages/16-component-catalog.md) | Component catalog overview |
| ↳ [16a-component-catalog-inputs.md](sub-pages/16a-component-catalog-inputs.md) | Input components |
| ↳ [16b-component-catalog-lists.md](sub-pages/16b-component-catalog-lists.md) | List components |
| ↳ [16c-component-catalog-layouts.md](sub-pages/16c-component-catalog-layouts.md) | Layout components |
| [17-independent-sub-pages.md](sub-pages/17-independent-sub-pages.md) | Independent sub-pages |
