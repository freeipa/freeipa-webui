# Main Pages — Walkthrough: Steps 1–8 (Init, State & Data Fetching)

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Structure & Imports](02-structure-and-anatomy.md) | [Steps 9–14: Selection & Toolbar](04-walkthrough-selection-toolbar.md)

## Step-by-Step Walkthrough

### 1. Route & Browser Title

```tsx
const MyEntities = () => {
  const dispatch = useAppDispatch();

  // pathname must match the route segment in AppRoutes.tsx and NavRoutes.ts
  const { browserTitle } = useUpdateRoute({ pathname: "my-entities" });

  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);
```

The `pathname` value (e.g. `"my-entities"`) must be registered in:
- `src/navigation/AppRoutes.tsx` — the `<Route>` tree
- `src/navigation/NavRoutes.ts` — navigation metadata (group, breadcrumb, title)

See [10-routing-and-conventions.md](10-routing-and-conventions.md) for the full routing setup.

### 2. API Version & URL Parameters

```tsx
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();
```

`useListPageSearchParams` keeps `page`, `perPage`, and `searchValue` in sync with URL query parameters (`?p=`, `?size=`, `?search=`).

### 3. Core State

```tsx
  const [entitiesList, setEntitiesList] = useState<MyEntity[]>([]);

  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Page indexes (for server-side pagination)
  const firstIdx = Math.max(0, (page - 1) * perPage);
  const lastIdx = page * perPage;
```

### 4. Data Fetching (Initial Load)

There are **two patterns** for the initial data query:

#### Pattern A: Generic query via `useGetting*Query` (most common)

Used by ActiveUsers, Hosts, HBACRules, Netgroups, Services, etc.

```tsx
  const dataResponse = useGettingMyEntitiesQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = dataResponse;
```

#### Pattern B: Domain-specific query (newer pattern)

Used by DnsZones, Trusts, etc. These have their own `useGet*FullDataQuery` with custom payloads.

```tsx
  const dataResponse = useGetMyEntitiesFullDataQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const { data, isLoading, error } = dataResponse;
```

### 5. Handle API Response

```tsx
  useEffect(() => {
    if (dataResponse.isFetching) {
      setShowTableRows(false);
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // Success
    if (dataResponse.isSuccess && dataResponse.data && batchResponse !== undefined) {
      const listResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const listSize = batchResponse.result.count;
      const entities: MyEntity[] = [];

      for (let i = 0; i < listSize; i++) {
        entities.push(listResult[i].result);
      }

      setTotalCount(totalCount);
      setEntitiesList(entities);
      setShowTableRows(true);
    }

    // Error
    if (!dataResponse.isLoading && dataResponse.isError && dataResponse.error !== undefined) {
      window.location.reload();
    }
  }, [dataResponse]);
```

**Note:** If the entity requires transformation from API format, use a mapper function (e.g. `apiToTrust`, `apiToDnsZone`) inside the loop instead of pushing raw results. See [Entity Utils](08-delete-modal-and-utils.md).

### 6. Refetch on Mount

```tsx
  React.useEffect(() => {
    dataResponse.refetch();
  }, []);
```

Some pages also refetch when `page` or `perPage` changes:

```tsx
  React.useEffect(() => {
    dataResponse.refetch();
  }, [page, perPage]);
```

### 7. Refresh Handler

```tsx
  const refreshData = () => {
    setShowTableRows(false);
    setTotalCount(0);
    clearSelectedEntities();
    dataResponse.refetch();
  };
```

### 8. Search (Explicit Submit)

Two patterns exist:

#### Pattern A: Using the generic `useSearchEntriesMutation`

```tsx
  const [retrieveEntries] = useSearchEntriesMutation({});

  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    setTotalCount(0);

    retrieveEntries({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: "myentity",  // Must be a valid entryType in GenericPayload
    } as GenericPayload).then((result) => {
      if ("data" in result) {
        const searchError = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          } else if ("message" in searchError) {
            error = searchError.message;
          }
          dispatch(
            addAlert({
              name: "submit-search-value-error",
              title: error || "Error when searching for my entities",
              variant: "danger",
            })
          );
        } else {
          const listResult = result.data?.result.results || [];
          const listSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const entities: MyEntity[] = [];

          for (let i = 0; i < listSize; i++) {
            entities.push(listResult[i].result);
          }

          setTotalCount(totalCount);
          setEntitiesList(entities);
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };
```

**Important:** The `entryType` value must be registered in `GenericPayload` (in `src/services/rpc.ts`) and have corresponding `*_find` / `*_show` method mappings in the `searchEntries` mutation.

#### Pattern B: Domain-specific search mutation

```tsx
  const [searchEntry] = useSearchMyEntitiesEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 200,
    }).then((result) => {
      // Same error handling pattern...
    });
  };
```
