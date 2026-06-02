# Main Pages

Guide for creating list-style "main pages" in the FreeIPA Modern WebUI. A main page is the top-level landing page for an entity (e.g. Active Users, Hosts, DNS Zones). It displays a searchable, paginated table with bulk selection, toolbar actions, and modals for add/delete operations.

Main pages live under `src/pages/<EntityName>/` and are named after the entity itself (e.g. `Hosts.tsx`, `DnsZones.tsx`). Files with suffixes like `Settings`, `Tabs`, `Table`, or `PreSettings` are **not** main pages — they are sub-components consumed by main pages or detail views.

## Guide Files

Each file below covers a specific, self-contained topic (~100–200 lines). Load only the file(s) relevant to your task.

| File | Contents | Lines |
|------|----------|-------|
| [01-overview.md](main-pages/01-overview.md) | What is a main page, required & optional inputs, example prompt, what gets generated | ~85 |
| [02-structure-and-anatomy.md](main-pages/02-structure-and-anatomy.md) | Folder structure, page anatomy (10-step pattern), required & optional imports | ~105 |
| [03-walkthrough-init-fetch.md](main-pages/03-walkthrough-init-fetch.md) | Route setup, API version, data fetching with `useMemo` pattern, `SearchDataResultType`, search handler | ~195 |
| [04-walkthrough-selection-toolbar.md](main-pages/04-walkthrough-selection-toolbar.md) | Selection management, button state, modal state, data wrappers, toolbar items | ~200 |
| [05-walkthrough-render-table-features.md](main-pages/05-walkthrough-render-table-features.md) | JSX render, `MainTable` usage, optional features (kebab menu, enable/disable, contextual help panel) | ~280 |
| [06-checklist-and-types.md](main-pages/06-checklist-and-types.md) | Files to create/modify checklist, `SearchDataResultType`, data type definition, selectability function | ~105 |
| [07-add-modal.md](main-pages/07-add-modal.md) | Add modal structure, props interface, code organization, error handling, template | ~175 |
| [07b-add-modal-fields.md](main-pages/07b-add-modal-fields.md) | Add modal field types, UI components, validation, naming conventions | ~130 |
| [08-delete-modal-and-utils.md](main-pages/08-delete-modal-and-utils.md) | Delete modal props, `DeletedElementsTable`, entity utils file template | ~195 |
| [09-rpc-service.md](main-pages/09-rpc-service.md) | RPC service file template (find+show pattern, add/delete/show/mod endpoints) | ~190 |
| [10-routing-and-conventions.md](main-pages/10-routing-and-conventions.md) | `AppRoutes.tsx` + `NavRoutes.ts` setup, `data-cy` naming, common pitfalls | ~130 |

## Component Catalog

See **[Component Catalog](components/00-overview.md)** for reusable components (inputs, lists, layouts) shared with sub-pages.

## Quick Reference

**To generate a new main page:** read [01-overview.md](main-pages/01-overview.md) for input requirements, then provide all required inputs alongside this index and the relevant sub-files as context.

**To implement a specific part:**
- Main page component scaffold → [02](main-pages/02-structure-and-anatomy.md), [03](main-pages/03-walkthrough-init-fetch.md), [04](main-pages/04-walkthrough-selection-toolbar.md), [05](main-pages/05-walkthrough-render-table-features.md)
- Add modal → [07-add-modal.md](main-pages/07-add-modal.md), [07b-add-modal-fields.md](main-pages/07b-add-modal-fields.md)
- Delete modal → [08-delete-modal-and-utils.md](main-pages/08-delete-modal-and-utils.md)
- Entity utils (`apiToEntity`, `createEmpty`) → [08-delete-modal-and-utils.md](main-pages/08-delete-modal-and-utils.md)
- RPC service file → [09-rpc-service.md](main-pages/09-rpc-service.md)
- Navigation registration → [10-routing-and-conventions.md](main-pages/10-routing-and-conventions.md)
- Contextual help panel (slice + hook) → [05-walkthrough-render-table-features.md](main-pages/05-walkthrough-render-table-features.md)
- Files checklist → [06-checklist-and-types.md](main-pages/06-checklist-and-types.md)
