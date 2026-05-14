# Sub-Pages — Tabs Component

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Overview](01-overview.md) | [Data Hook](03-data-hook.md)

## ⚠️ MANDATORY: Create This BEFORE Settings

> **The Tabs component (`<Entity>Tabs.tsx`) must be created BEFORE any Settings component.**
>
> The Tabs component is the **parent** that:
> - Extracts the entity ID from the URL
> - Fetches entity data via the data hook
> - Passes props to the Settings component
>
> Without `<Entity>Tabs.tsx`, a `<Entity>Settings.tsx` file is useless — it cannot be rendered or receive data.
>
> **Creation order:**
> 1. `use<Entity>SettingsData.tsx` — Data hook (see [03-data-hook.md](03-data-hook.md))
> 2. `<Entity>Tabs.tsx` — Tabs component (this file)
> 3. `<Entity>Settings.tsx` — Settings component (see [04-settings-tab.md](04-settings-tab.md))

## Prerequisites

Creating a Tabs component alone is not enough for navigation to work. You must also:

1. **Register the route** in `AppRoutes.tsx`
2. **Enable `showLink={true}`** in the main page's `MainTable`

See [04-settings-tab.md](04-settings-tab.md#prerequisites--required-files-for-navigation) for the complete checklist.

---

## What is the Tabs Component?

The Tabs component (`<Entity>Tabs.tsx`) is the **entry point** for every sub-page. When a user clicks a row in a main page table, React Router navigates to this component. It acts as the "shell" that:

1. **Extracts the entity ID** from the URL (e.g., `/dns-zones/example.com.` → `example.com.`)
2. **Fetches entity data** using a custom data hook
3. **Renders breadcrumb navigation** so users know where they are
4. **Orchestrates tab switching** between Settings, membership, or custom tabs
5. **Handles loading and error states** (spinner while fetching, "Not Found" for missing entities)

Think of it as the "controller" that coordinates data flow between the URL, the API, and the individual tab components.

## Component Lifecycle

```
User clicks row in main page
       ↓
React Router loads <Entity>Tabs
       ↓
useSafeParams extracts entity ID from URL
       ↓
Custom data hook fetches entity from API
       ↓
While loading → show DataSpinner
       ↓
If not found → show NotFound page
       ↓
If found → render Tabs with entity data
```

## Required Imports

**Important:** Always use **absolute imports** (starting with `src/`) instead of relative imports (starting with `./` or `../`). This is the project convention for consistency and easier refactoring.

```tsx
import React from "react";
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
import { useNavigate } from "react-router";
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
import { use<Entity>Settings } from "src/hooks/use<Entity>SettingsData";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb/BreadCrumb";
import <Entity>Settings from "src/pages/<Entity>/<Entity>Settings";
import { useSafeParams } from "src/utils/paramsUtils";
```

## URL Parameter Extraction

Every sub-page needs to know which entity to display. The entity ID comes from the URL path. We use `useSafeParams` (a type-safe wrapper around React Router's `useParams`) to extract it.

```tsx
type <Entity>Params = { <primaryKey>: string };

const <Entity>Tabs = ({ section }: <Entity>TabsProps) => {
  const { <primaryKey> } = useSafeParams<<Entity>Params>(["<primaryKey>"]);
  // ...
};
```

**Common parameter names by entity type:**
| Entity Type | Parameter | Example URL |
|-------------|-----------|-------------|
| Users | `uid` | `/active-users/admin` |
| Groups/Rules | `cn` | `/user-groups/admins` |
| Hosts | `fqdn` | `/hosts/server.example.com` |
| DNS Zones | `idnsname` | `/dns-zones/example.com.` |
| Services | `id` | `/services/HTTP%2Fserver.example.com` |

## State Management

The component maintains several pieces of state:

```tsx
// Breadcrumb navigation items
const [breadcrumbItems, setBreadcrumbItems] = React.useState<BreadCrumbItem[]>([]);

// Local copy of entity ID (for convenience in navigation)
const [id, setId] = React.useState("");

// All entity data comes from the custom hook
const <entity>SettingsData = use<Entity>SettingsData(<primaryKey>);
```

The data hook (covered in [03-data-hook.md](03-data-hook.md)) handles all API communication and returns the entity data, loading state, and helper functions.

## Tab Navigation

For multi-tab sub-pages, you need a handler that updates the URL when users switch tabs. This keeps the browser URL in sync with the active tab, enabling direct linking and browser back/forward navigation.

```tsx
const handleTabClick = (
  _event: React.MouseEvent<HTMLElement, MouseEvent>,
  tabIndex: number | string
) => {
  if (tabIndex === "settings") {
    navigate("/" + pathname + "/" + id);
  } else if (tabIndex === "dns-records") {
    navigate("/" + pathname + "/" + id + "/dns-records");
  }
};
```

## Breadcrumb Setup

Breadcrumbs help users understand their location in the app hierarchy. They're updated via `useEffect` whenever the entity ID changes:

```tsx
React.useEffect(() => {
  setId(<primaryKey>);
  setBreadcrumbItems([
    { name: "<Entity display name>", url: URL_PREFIX + "/" + pathname },
    { name: <primaryKey>, url: URL_PREFIX + "/" + pathname + "/" + <primaryKey>, isActive: true },
  ]);
}, [<primaryKey>]);
```

## Loading and Error States

Always handle these states before rendering the main content:

```tsx
// Show spinner while data is being fetched
if (<entity>SettingsData.isLoading || !<entity>SettingsData.<entity>) {
  return <DataSpinner />;
}

// Show "Not Found" if the entity doesn't exist
if (!<entity>SettingsData.isLoading && Object.keys(<entity>SettingsData.<entity>).length === 0) {
  return <NotFound />;
}
```

## JSX Structure

The render output has two main sections:
1. **Header area** — breadcrumbs and page title
2. **Tabs area** — the PatternFly Tabs component with tab content

```tsx
return (
  <>
    <PageSection hasBodyWrapper={false}>
      <BreadCrumb breadcrumbItems={breadcrumbItems} />
      <TitleLayout id={id} preText="<Entity type>:" text={id} headingLevel="h1" />
    </PageSection>
    <PageSection hasBodyWrapper={false} type="tabs" isFilled>
      <Tabs
        activeKey={section}
        onSelect={handleTabClick}
        variant="secondary"
        isBox
        className="pf-v6-u-ml-lg"
        mountOnEnter
        unmountOnExit
      >
        <Tab eventKey={"settings"} title={<TabTitleText>Settings</TabTitleText>}>
          <<Entity>Settings
            <entity>={<entity>SettingsData.<entity>}
            original<Entity>={<entity>SettingsData.original<Entity>}
            metadata={<entity>SettingsData.metadata}
            on<Entity>Change={<entity>SettingsData.set<Entity>}
            onRefresh={<entity>SettingsData.refetch}
            isModified={<entity>SettingsData.modified}
            modifiedValues={<entity>SettingsData.modifiedValues}
            onResetValues={<entity>SettingsData.resetValues}
            pathname={pathname}
          />
        </Tab>
        {/* Additional tabs go here */}
      </Tabs>
    </PageSection>
  </>
);
```

**Key Tabs props:**
- `activeKey={section}` — which tab is currently active (from URL)
- `mountOnEnter` / `unmountOnExit` — lazy-load tabs for performance
- `variant="secondary"` / `isBox` — PatternFly styling

**Tab titles:** Use simple `<TabTitleText>` without `Badge` components. Badges (showing counts) are only used in the inner `TabLayout` within membership tab content components, not in the outer `<Entity>Tabs.tsx`.

## Single-Tab vs Multi-Tab

**Single-tab** (Settings only): The tab navigation handler only needs to handle one case. See `IdpReferencesTabs.tsx`.

**Multi-tab**: Add more `<Tab>` elements and extend the navigation handler. See `DnsZonesTabs.tsx` or `HostsTabs.tsx`.

## Examples

| Pattern | Example File |
|---------|--------------|
| Single-tab (Settings only) | `src/pages/IdPReferences/IdpReferencesTabs.tsx` |
| Multi-tab (Settings + Table) | `src/pages/DNSZones/DnsZonesTabs.tsx` |
| Multi-tab (Settings + Membership) | `src/pages/Hosts/HostsTabs.tsx` |
