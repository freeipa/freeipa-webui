# Sub-Pages — Routing

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Tabs Component](02-tabs-component.md) | [Main Pages Routing](../main-pages/10-routing-and-conventions.md)

## How Sub-Page Routing Works

When a user clicks a row in a main page table, the application navigates to a sub-page URL. React Router matches this URL to the appropriate component, which then loads and displays the entity.

**The routing flow:**

```
User clicks "example.com." in DNS Zones table
       ↓
URL changes to /dns-zones/example.com.
       ↓
React Router matches the route pattern /dns-zones/:idnsname
       ↓
DnsZonesTabs component loads with section="settings"
       ↓
useSafeParams extracts idnsname="example.com."
       ↓
Component fetches and displays the zone
```

For general routing concepts (`AppRoutes.tsx`, `NavRoutes.ts`, `data-cy` naming, common pitfalls), see [main-pages/10-routing-and-conventions.md](../main-pages/10-routing-and-conventions.md). This document covers sub-page specific patterns.

## Sub-Page Route Structure

Sub-page routes are **nested** inside their parent main page route. The key difference from main pages is the URL parameter (`:cn`, `:fqdn`, etc.) that identifies which entity to display.

```tsx
<Route path="<main-page-path>">
  {/* Main page (list view) */}
  <Route path="" element={<MainPage />} />
  
  {/* Sub-page (detail view) */}
  <Route path=":<primaryKey>">
    <Route path="" element={<EntityTabs section="settings" />} />
    {/* Additional tabs go here */}
  </Route>
</Route>
```

## Route Patterns by Complexity

### Single-Tab (Settings only)

The simplest case — just one Settings tab:

```tsx
<Route path="identity-provider-references">
  <Route path="" element={<IdpReferences />} />
  <Route path=":cn">
    <Route path="" element={<IdpReferencesTabs section="settings" />} />
  </Route>
</Route>
```

**URL examples:**
- `/identity-provider-references` → main page (list)
- `/identity-provider-references/my-idp` → Settings tab for "my-idp"

### Multi-Tab with Custom Table

When a sub-page has both Settings and a custom table tab:

```tsx
<Route path="dns-zones">
  <Route path="" element={<DnsZones />} />
  <Route path=":idnsname">
    <Route path="" element={<DnsZonesTabs section="settings" />} />
    <Route path="dns-records">
      <Route path="" element={<DnsZonesTabs section="dns-records" />} />
      {/* Nested detail for individual records */}
      <Route path=":recordName" element={<DnsResourceRecordsPreSettings />} />
    </Route>
  </Route>
</Route>
```

**URL examples:**
- `/dns-zones/example.com.` → Settings tab
- `/dns-zones/example.com./dns-records` → DNS Records tab
- `/dns-zones/example.com./dns-records/www` → Detail for "www" record

### With Membership Tabs

When a sub-page has membership tabs:

```tsx
<Route path="hosts">
  <Route path="" element={<Hosts />} />
  <Route path=":fqdn">
    <Route path="" element={<HostsTabs section="settings" />} />
    <Route path="memberof_hostgroup" element={<HostsTabs section="memberof_hostgroup" />} />
    <Route path="memberof_netgroup" element={<HostsTabs section="memberof_netgroup" />} />
    <Route path="memberof_role" element={<HostsTabs section="memberof_role" />} />
    <Route path="managedby_host" element={<HostsTabs section="managedby" />} />
  </Route>
</Route>
```

> **Note:** The `section` prop value may differ from the route path (e.g., `managedby_host` route uses `section="managedby"`). Check existing implementations for the correct section value.

**URL examples:**
- `/hosts/server.example.com` → Settings tab
- `/hosts/server.example.com/memberof_hostgroup` → Host Groups membership tab
- `/hosts/server.example.com/managedby_host` → Managed By tab

## URL Parameter Names

The parameter name should match the entity's primary key attribute. Use `useSafeParams` in the Tabs component to extract it.

| Entity Type | Parameter | Primary Key Attribute | Example URL |
|-------------|-----------|----------------------|-------------|
| Users | `:uid` | `uid` | `/active-users/admin` |
| Groups/Rules | `:cn` | `cn` | `/user-groups/admins` |
| Hosts | `:fqdn` | `fqdn` | `/hosts/server.example.com` |
| Services | `:id` | `krbcanonicalname` | `/services/HTTP%2Fserver.example.com` |
| DNS Zones | `:idnsname` | `idnsname` | `/dns-zones/example.com.` |

## NavRoutes.ts — Usually Not Needed

Sub-pages typically **don't need entries** in `NavRoutes.ts` because:

1. **No sidebar entry** — Sub-pages aren't shown in the navigation sidebar
2. **Dynamic breadcrumbs** — Built in the Tabs component, not from static config
3. **Parent highlighting** — The parent main page stays highlighted in the sidebar

Only add `NavRoutes.ts` entries if you need custom breadcrumb behavior or sidebar highlighting.

## Import Pattern in AppRoutes.tsx

Import both the main page and the Tabs component:

```tsx
// Main page (list view)
import DnsZones from "src/pages/DNSZones/DnsZones";

// Tabs component (sub-page entry point)
import DnsZonesTabs from "src/pages/DNSZones/DnsZonesTabs";
```

## Common Pitfalls

1. **Parameter mismatch** — The URL parameter (`:cn`) must match what `useSafeParams` expects
2. **Missing section** — Every route needs the correct `section` prop for tab highlighting
3. **Nested routes** — Sub-page routes must be nested inside the main page route
4. **URL encoding** — Some IDs contain special characters (services with `/`) and need URL encoding

## Examples in the Codebase

| Pattern | Example |
|---------|---------|
| Single-tab | `/identity-provider-references/:cn` |
| Multi-tab with table | `/dns-zones/:idnsname/dns-records` |
| Multiple membership tabs | `/hosts/:fqdn/memberof_*` |
| Three-level nesting | `/dns-zones/:idnsname/dns-records/:recordName` |
