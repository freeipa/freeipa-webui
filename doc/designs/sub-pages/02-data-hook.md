# Sub-Pages — Data Hook

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Tabs Component](03-tabs-component.md) | [Settings Tab](04-settings-tab.md)

## What is a Data Hook?

A data hook (`use<Entity>SettingsData.tsx`) encapsulates data-fetching logic for a sub-page's Settings tab.

## Prerequisites

- **RPC service** with `*_show` endpoint — see [main-pages/09-rpc-service.md](../main-pages/09-rpc-service.md)
- **Entity type interface** in `globalDataTypes.ts`
- **Entity utils** with `apiTo<Entity>` — see [main-pages/08-delete-modal-and-utils.md](../main-pages/08-delete-modal-and-utils.md)

> ⚠️ **CRITICAL:** The RPC `*_show` endpoint **must** use `apiTo<Entity>` in `transformResponse`. Without this, form fields will be **read-only**.

## Location and Naming

- **File:** `src/hooks/use<Entity>SettingsData.tsx`
- **Hook function:** `use<Entity>Settings`

## What the Hook Returns

```tsx
type <Entity>SettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  <entity>: Partial<<Entity>>;
  original<Entity>: Partial<<Entity>>;
  metadata: Metadata;
  modified: boolean;
  setModified: (value: boolean) => void;
  set<Entity>: (<entity>: Partial<<Entity>>) => void;
  refetch: () => void;
  resetValues: () => void;
  modifiedValues: () => Partial<<Entity>>;
};
```

## Implementation Template

```tsx
const use<Entity>Settings = (<entityId>: string): <Entity>SettingsData => {
  // 1. API Calls
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const <entity>Query = use<Entity>ShowQuery(<entityId>);

  // 2. Local State
  const [modified, setModified] = React.useState(false);
  const [<entity>, set<Entity>] = React.useState<Partial<<Entity>>>({});
  const [original<Entity>, setOriginal<Entity>] = React.useState<Partial<<Entity>>>({});

  // 3. Sync API Data (include fulfilledTimeStamp for cache detection)
  React.useEffect(() => {
    if (<entity>Query.data && !<entity>Query.isFetching) {
      set<Entity>({ ...<entity>Query.data });
      setOriginal<Entity>({ ...<entity>Query.data });
    }
  }, [<entity>Query.data, <entity>Query.isFetching, <entity>Query.fulfilledTimeStamp]);

  // 4. Change Detection
  React.useEffect(() => {
    if (!original<Entity>) return;
    let isModified = false;
    for (const [key, value] of Object.entries(<entity>)) {
      const originalVal = original<Entity>[key];
      const isDifferent = Array.isArray(value)
        ? JSON.stringify(originalVal) !== JSON.stringify(value)
        : originalVal !== value;
      if (isDifferent) { isModified = true; break; }
    }
    setModified(isModified);
  }, [<entity>, original<Entity>]);

  // 5. Modified Values Helper
  const getModifiedValues = (): Partial<<Entity>> => {
    const result = {};
    for (const [key, value] of Object.entries(<entity>)) {
      const originalVal = original<Entity>[key];
      const isDifferent = Array.isArray(value)
        ? JSON.stringify(originalVal) !== JSON.stringify(value)
        : originalVal !== value;
      if (isDifferent) result[key] = value;
    }
    return result;
  };

  // 6. Reset Values (CRITICAL: update original to match current)
  const onResetValues = () => {
    setOriginal<Entity>({ ...<entity> });
    setModified(false);
  };

  // 7. Return
  return {
    isLoading: metadataQuery.isLoading || <entity>Query.isLoading,
    isFetching: <entity>Query.isFetching,
    modified, setModified, metadata, resetValues: onResetValues,
    original<Entity>, set<Entity>, refetch: <entity>Query.refetch,
    <entity>, modifiedValues: getModifiedValues,
  };
};

export { use<Entity>Settings };
```

## Reset Values — Critical Note

> ⚠️ **CRITICAL:** `resetValues` must update `original<Entity>` to match `<entity>`. Otherwise, change detection will recalculate `modified` back to `true`. See [Troubleshooting](13-troubleshooting.md).

## Fetching Options for Select Fields

```tsx
const usersQuery = useGetActiveUsersQuery();
const userOptions = React.useMemo(() => {
  if (!usersQuery.data) return [];
  return usersQuery.data.map((user) => Array.isArray(user.uid) ? user.uid[0] : user.uid);
}, [usersQuery.data]);

// Include in loading state and return
isLoading: metadataQuery.isLoading || <entity>Query.isLoading || usersQuery.isLoading,
return { ...otherProps, userOptions };
```

## API-Specific Limitations

Not all API commands support the same options. Verify by checking:
- [FreeIPA API docs](https://freeipa.readthedocs.io/en/latest/api/) — General documentation
- [API.txt](https://codeberg.org/freeipa/freeipa/src/branch/master/API.txt) — Complete command specifications (options, inputs, outputs for every IPA command). This file is auto-generated from the FreeIPA source tree and updated with every release, so it is always in sync with the actual server API.

| Entity | `_find` limitations | `_show` limitations |
|--------|---------------------|---------------------|
| `delegation` | No `sizelimit` | No `rights` |

When unsupported option used, API returns: `{"error": {"code": 3005, "message": "Unknown option: rights"}}`

## Required Imports

```tsx
import React from "react";
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { use<Entity>ShowQuery } from "src/services/rpc<Entity>";
import { <Entity>, Metadata } from "src/utils/datatypes/globalDataTypes";
```

## Examples

| Complexity | Example File |
|------------|--------------|
| Simple | `src/hooks/useIdpRefSettingsData.tsx` |
| With transformation | `src/hooks/useDnsZonesData.tsx` |
