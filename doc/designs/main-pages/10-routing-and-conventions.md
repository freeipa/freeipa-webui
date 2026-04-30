# Main Pages — Routing, Naming Conventions & Common Pitfalls

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Checklist](06-checklist-and-types.md) | [RPC Service](09-rpc-service.md)

## Routing

Both files below **must** be updated for the new page to appear in the WebUI and be accessible via the navigation bar. Missing either one is the most common cause of "my page doesn't show up."

### AppRoutes.tsx (`src/navigation/AppRoutes.tsx`)

This file defines the React Router `<Route>` tree. Every main page needs at least two entries: one for the list view and one for the detail/settings view.

**Step 1:** Import the new components at the top of the file:

```tsx
import MyEntities from "src/pages/MyEntities/MyEntities";
import MyEntitiesTabs from "src/pages/MyEntities/MyEntitiesTabs";
```

**Step 2:** Add the `<Route>` block inside the logged-in section (`{userLoggedIn ? ( ... )}`). The route path segment must use kebab-case and match the `pathname` passed to `useUpdateRoute`:

```tsx
<Route path="my-entities">
  <Route path="" element={<MyEntities />} />
  <Route path=":cn">
    <Route path="" element={<MyEntitiesTabs section="settings" />} />
    {/* Add more sub-routes for member/memberof tabs as needed */}
  </Route>
</Route>
```

The `:cn` parameter name should match the primary key field (e.g. `:uid` for users, `:fqdn` for hosts, `:cn` for most other entities, `:idnsname` for DNS zones, `:ipauniqueid` for subordinate IDs).

**Note on conditional routes:** Some routes are conditionally rendered based on configuration. For example, DNS zones are only shown when DNS is enabled:

```tsx
{dnsIsEnabled && (
  <Route path="dns-zones">
    ...
  </Route>
)}
```

### NavRoutes.ts (`src/navigation/NavRoutes.ts`)

This file controls what appears in the **sidebar navigation**, the **breadcrumb trail**, and the **browser tab title**. Without an entry here, the page will be routable but invisible in the nav.

**Step 1:** Define a group reference constant at the top of the file:

```tsx
const MyEntitiesGroupRef = "my-entities";
```

**Step 2:** Add the page entry inside `getNavigationRoutes`. The structure depends on where the page belongs in the navigation hierarchy.

**Example A: Direct child of a top-level section** (like Hosts or Services under "Identity"):

```tsx
{
  label: "My Entities",
  group: MyEntitiesGroupRef,
  title: `${BASE_TITLE} - My Entities`,
  items: [],
  path: "my-entities",
},
```

**Example B: Nested inside a sub-group** (like "Active users" inside "Users" under "Identity"):

```tsx
{
  label: "My Category",
  group: MyCategoryGroupRef,
  title: `${BASE_TITLE} - My Category`,
  path: "",
  items: [
    {
      label: "My Entities",
      group: MyEntitiesGroupRef,
      title: `${BASE_TITLE} - My Entities`,
      path: "my-entities",
    },
  ],
},
```

Each entry has:

| Field | Purpose |
|-------|---------|
| `label` | Text shown in the sidebar navigation link |
| `group` | Kebab-case identifier matching the route path — used for highlighting the active link |
| `title` | Full browser tab title (convention: `"Identity Management - <Page name>"`) |
| `path` | Route path segment (must match `AppRoutes.tsx` and the `pathname` in `useUpdateRoute`) |
| `items` | Nested children (settings pages, etc.) — use `[]` if there are no children |

**Important:** The `path` value here, the route `path` in `AppRoutes.tsx`, and the `pathname` argument to `useUpdateRoute({ pathname: "my-entities" })` must all be the **same string**.

## `data-cy` Naming Convention

Follow the project's kebab-case naming convention for test attributes:

```
{page-name}-button-{action}      →  my-entities-button-add
{page-name}-button-{action}      →  my-entities-button-delete
{page-name}-button-{action}      →  my-entities-button-refresh
{page-name}-kebab                →  my-entities-kebab
{page-name}-kebab-{action}       →  my-entities-kebab-some-action
{page-name}-modal-error          →  my-entities-modal-error
search                           →  search (always just "search")
```

See `cypress/README.md` for the full naming guide.

## Post-Generation Validation

After generating a new main page, run the following checks to catch formatting issues, lint violations, and unused exports before committing:

```bash
npx prettier --write .     # Fix code formatting
npm run lint               # ESLint (max-warnings threshold)
npm run knip               # Detect unused files, exports, and dependencies
```

These are the same checks that run in CI, so catching them locally avoids failed pipelines.

## Common Pitfalls

1. **Forgetting to register the route**: The page won't render if not added to both `AppRoutes.tsx` and `NavRoutes.ts`.
2. **Missing `entryType`**: If using `useSearchEntriesMutation`, the `entryType` must exist in `GenericPayload`'s union type **and** be handled in the mutation's switch logic.
3. **Wrong `pathname` in `useUpdateRoute`**: Must exactly match the route key in `NavRoutes.ts`.
4. **Not calling `refetch()` on mount**: Include the `useEffect(() => { dataResponse.refetch(); }, [])` pattern to ensure fresh data.
5. **Primary key mismatch**: The `pk` / `nameAttr` in `MainTable` and `BulkSelectorPrep` must match the actual field name in the data type (e.g. `"cn"`, `"uid"`, `"fqdn"`, `"idnsname"`).
