# Main Pages

Guide for creating list-style "main pages" in the FreeIPA Modern WebUI. A main page is the top-level landing page for an entity (e.g. Active Users, Hosts, DNS Zones). It displays a searchable, paginated table with bulk selection, toolbar actions, and modals for add/delete operations.

Main pages live under `src/pages/<EntityName>/` and are named after the entity itself (e.g. `Hosts.tsx`, `DnsZones.tsx`). Files with suffixes like `Settings`, `Tabs`, `Table`, or `PreSettings` are **not** main pages — they are sub-components consumed by main pages or detail views.

## Guide Files

Each file below covers a specific, self-contained topic (~150–230 lines). Load only the file(s) relevant to your task.

| File | Contents | Lines |
|------|----------|-------|
| [01-overview.md](main-pages/01-overview.md) | What is a main page, required & optional inputs, example prompt, what gets generated | ~100 |
| [02-structure-and-anatomy.md](main-pages/02-structure-and-anatomy.md) | Folder structure, page anatomy (10-step pattern), required & optional imports | ~90 |
| [03-walkthrough-init-fetch.md](main-pages/03-walkthrough-init-fetch.md) | Steps 1–8: route setup, API version, core state, data fetching patterns, response handling, refetch, search | ~210 |
| [04-walkthrough-selection-toolbar.md](main-pages/04-walkthrough-selection-toolbar.md) | Steps 9–14: show rows, selection management, button state, modal state, data wrappers, toolbar items array | ~200 |
| [05-walkthrough-render-table-features.md](main-pages/05-walkthrough-render-table-features.md) | Step 15: JSX render, `MainTable` usage, optional features (kebab menu, enable/disable, contextual help panel) | ~200 |
| [06-checklist-and-types.md](main-pages/06-checklist-and-types.md) | Files to create/modify checklist, data type definition, selectability function, modal naming convention | ~90 |
| [07-add-modal.md](main-pages/07-add-modal.md) | Add modal: available UI components, `InputWithValidation` details, field template, naming, action buttons, examples | ~185 |
| [08-delete-modal-and-utils.md](main-pages/08-delete-modal-and-utils.md) | Delete modal (props, `DeletedElementsTable`) and entity utils file (`apiToEntity`, `createEmpty`, `asRecord`) | ~160 |
| [09-rpc-service.md](main-pages/09-rpc-service.md) | RPC service file template (find+show pattern, add/delete/show/mod endpoints), API command naming, examples | ~190 |
| [10-routing-and-conventions.md](main-pages/10-routing-and-conventions.md) | `AppRoutes.tsx` + `NavRoutes.ts` setup, `data-cy` naming, post-generation validation, common pitfalls | ~130 |

## Quick Reference

**To generate a new main page:** read [01-overview.md](main-pages/01-overview.md) for input requirements, then provide all required inputs alongside this index and the relevant sub-files as context.

**To implement a specific part:**
- Main page component scaffold → [02](main-pages/02-structure-and-anatomy.md), [03](main-pages/03-walkthrough-init-fetch.md), [04](main-pages/04-walkthrough-selection-toolbar.md), [05](main-pages/05-walkthrough-render-table-features.md)
- Add modal → [07-add-modal.md](main-pages/07-add-modal.md)
- Delete modal → [08-delete-modal-and-utils.md](main-pages/08-delete-modal-and-utils.md)
- Entity utils (`apiToEntity`, `createEmpty`) → [08-delete-modal-and-utils.md](main-pages/08-delete-modal-and-utils.md)
- RPC service file → [09-rpc-service.md](main-pages/09-rpc-service.md)
- Navigation registration → [10-routing-and-conventions.md](main-pages/10-routing-and-conventions.md)
- Files checklist → [06-checklist-and-types.md](main-pages/06-checklist-and-types.md)
