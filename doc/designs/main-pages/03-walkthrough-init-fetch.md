# Main Pages — Walkthrough: Init, State & Data Fetching

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Structure & Imports](02-structure-and-anatomy.md) | [Selection & Toolbar](04-walkthrough-selection-toolbar.md)

## Step 1: Route & Browser Title

```tsx
const MyEntities = () => {
  const dispatch = useAppDispatch();
  useUpdateRoute({ pathname: "my-entities" });
```

The `pathname` must be registered in `AppRoutes.tsx` and `NavRoutes.ts`.

## Step 2: API Version & URL Parameters

```tsx
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // page (`p`), perPage (`size`), and searchValue (`search`) are derived from the URL
  const { page, perPage, searchValue } = useListPageSearchParams();
```

`SearchInputLayout` and `PaginationLayout` update those URL params themselves. Pages
normally only **read** `page` / `perPage` / `searchValue` for the query; they do not
need local search submit handlers or pagination prop bundles for the list case.

## Step 3: Data Fetching Query

```tsx
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const dataResponse = useGettingMyEntitiesQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const { data: batchResponse, isLoading, isFetching, error } = dataResponse;
```

> **Important:** Always pass `searchValue` (not `""`) to the query hook. RTK Query
> auto-refetches whenever its parameters change (`searchValue`, `startIdx`, `stopIdx`),
> so both pagination and filtering are handled automatically. Using a hardcoded `""`
> causes a race condition where the unfiltered query response overwrites search results.

## Step 4: Derive State with useMemo (Recommended)

Use `useMemo` to derive `elementsList` and `totalCount` from the query response — **do not** use `useEffect` + `useState` to sync state.

```tsx
  const { elementsList, totalCount } = useMemo(() => {
    if (batchResponse?.result) {
      const results = batchResponse.result.results;
      const entities: MyEntity[] = [];
      for (let i = 0; i < batchResponse.result.count; i++) {
        entities.push(results[i].result);
      }
      return {
        elementsList: entities,
        totalCount: batchResponse.result.totalCount,
      };
    }

    return { elementsList: [], totalCount: 0 };
  }, [batchResponse]);

  // Derive showTableRows from loading states
  const showTableRows = useMemo(() => {
    return !isFetching && !isLoading;
  }, [isFetching, isLoading]);
```

This pattern avoids eslint warnings about calling `setState` in `useEffect`.

## Step 5: Error Handling

```tsx
  const globalErrors = useApiError([]);

  React.useEffect(() => {
    if (isFetching) {
      globalErrors.clear();
    }
  }, [isFetching]);

  React.useEffect(() => {
    if (!isLoading && !isFetching && dataResponse.isError) {
      window.location.reload();
    }
  }, [dataResponse.isError, isLoading, isFetching]);
```

## Step 6: Refresh Handler

```tsx
  const refreshData = () => {
    clearSelectedEntities();
    dataResponse.refetch();
  };
```

> **Note:** No manual `useEffect` for pagination or search is needed. RTK Query
> automatically re-fetches when `startIdx`/`stopIdx`/`searchValue` change (derived
> from URL params via `useListPageSearchParams`).

## Step 7: Search Behaviour (`SearchInputLayout`)

`SearchInputLayout` buffers keystrokes locally. It commits a search only when the
user presses Enter, clicks the search button, or clears the input — not on every
keystroke.

For list pages, omit `searchValueData`. The layout then:

1. Reads the committed value from the URL `search` param
2. Writes the new value to `search` on submit/clear
3. Deletes `p` so results start on page 1

```tsx
  <SearchInputLayout
    dataCy="search"
    name="search"
    ariaLabel="Search my entities"
    placeholder="Search"
  />
```

Non-list UIs that need local search state (for example `DualListLayout`) can pass an
optional override:

```tsx
  <SearchInputLayout
    dataCy="search"
    searchValueData={{
      searchValue,
      onSubmit: (value) => {
        /* update local state / run a custom search */
      },
    }}
  />
```

> **Do not** add search-as-you-type behaviour by writing the URL (or parent state) on
> every `onChange`. The component deliberately buffers input locally and only
> propagates on submit or clear.

## Legacy Pattern (Avoid)

The older pattern using `useEffect` + `setState` triggers eslint warnings:

```tsx
// AVOID: This pattern causes @eslint-react/hooks-extra/no-direct-set-state-in-use-effect warnings
useEffect(() => {
  if (dataResponse.isSuccess && batchResponse) {
    setEntitiesList(/* ... */);  // Warning!
    setTotalCount(/* ... */);    // Warning!
    setShowTableRows(true);      // Warning!
  }
}, [dataResponse]);
```

Use the `useMemo` pattern from Step 4 instead.
