# Sub-Pages

Guide for creating "sub-pages" (detail views) in the FreeIPA Modern WebUI. A sub-page is accessed by clicking a row in a main page table.

## Sub-Page Types

| Type | Description | Example |
|------|-------------|---------|
| **Settings** | Edit entity properties via form fields | `RolesSettings.tsx` |
| **Membership Tabs** | Tabs showing related entities (Members, Member Of) | `RolesMembers.tsx` |
| **Independent** | Entity-specific table with Add/Delete | `RolesPrivileges.tsx` |

See [11-visual-reference.md](sub-pages/11-visual-reference.md) for ASCII diagrams.

## CRITICAL: Ask Before Leaving Functionality Incomplete

> ⚠️ **MANDATORY:** When creating sub-pages, verify the prompt has ALL required information. **NEVER** create disabled Add/Delete buttons without asking.

**If information is missing, ASK:**
- "Which API lists available items to add?"
- "What `entityType` should be passed to `_add_member`?"
- "Should I use DualListSelector or TextInput for the Add modal?"

See [06c-membership-creating-new.md](sub-pages/06c-membership-creating-new.md) for required questions.

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
| [01-overview.md](sub-pages/01-overview.md) | Required inputs, inference rules |
| [02-tabs-component.md](sub-pages/02-tabs-component.md) | Tabs anatomy, URL params |
| [03-data-hook.md](sub-pages/03-data-hook.md) | Data hook pattern |
| [04-settings-tab.md](sub-pages/04-settings-tab.md) | Settings form, toolbar |
| [05-table-tab.md](sub-pages/05-table-tab.md) | Custom table tabs |
| [06-membership-tabs.md](sub-pages/06-membership-tabs.md) | Membership tabs |
| [07-routing.md](sub-pages/07-routing.md) | Route patterns |
| [08-checklist.md](sub-pages/08-checklist.md) | Validation checklist |

### Supplementary
| File | Contents |
|------|----------|
| [09-modals.md](sub-pages/09-modals.md) | Add/Delete modals |
| [10-prompt-writing-guide.md](sub-pages/10-prompt-writing-guide.md) | Prompt guidelines |
| [12-settings-patterns.md](sub-pages/12-settings-patterns.md) | UI patterns |
| [13-troubleshooting.md](sub-pages/13-troubleshooting.md) | Common issues |
| [17-independent-sub-pages.md](sub-pages/17-independent-sub-pages.md) | Independent sub-pages |
