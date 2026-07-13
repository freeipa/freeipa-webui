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

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();
```

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

The `SearchDataResultType<T>` generic type (from `src/utils/datatypes/globalDataTypes.ts`) standardizes the search state structure:

```tsx
export interface SearchDataResultType<T> {
  elementsList: T[];
  totalCount: number;
}
```

Use it to type the search data state:

```tsx
  // Search state (for mutation-based search)
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchData, setSearchData] =
    useState<SearchDataResultType<MyEntity> | null>(null);

  // Derive elementsList and totalCount
  const { elementsList, totalCount } = useMemo(() => {
    // Search results are fetched with stopIdx: 100 (all matches at once),
    // so paginate them client-side using page/perPage.
    if (isSearchActive && searchData) {
      const start = (page - 1) * perPage;
      const end = start + perPage;
      return {
        elementsList: searchData.elementsList.slice(start, end),
        totalCount: searchData.elementsList.length,
      };
    }

    if (batchResponse?.result) {
      const results = batchResponse.result.results;
      const entities: MyEntity[] = [];
      for (let i = 0; i < batchResponse.result.count; i++) {
        entities.push(results[i].result);
      }
      return { elementsList: entities, totalCount: batchResponse.result.totalCount };
    }

    return { elementsList: [], totalCount: 0 };
  }, [batchResponse, isSearchActive, searchData, page, perPage]);

  // Derive showTableRows from loading states
  const showTableRows = useMemo(() => {
    if (isSearchActive) return !searchResult.isLoading;
    return !isFetching && !isLoading;
  }, [isFetching, isLoading, isSearchActive, searchResult.isLoading]);
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
    setIsSearchActive(false);
    setSearchData(null);
    clearSelectedEntities();
    dataResponse.refetch();
  };
```

> **Note:** No manual `useEffect` for pagination is needed. RTK Query automatically
> re-fetches when `startIdx`/`stopIdx` change (derived from `page`/`perPage`).

## Step 7: Search Value Update Handler

The search input fires `updateSearchValue` on every keystroke. It must reset pagination
to page 1 so the user always sees results from the first page:

```tsx
  const updateSearchValue = (value: string) => {
    setPage(1);
    setSearchValue(value);
  };
```

## Step 8: Search Submit Handler

The search input fires `submitSearchValue` when the user presses Enter or clicks the
search button. This uses a mutation to fetch results independently of the query hook.

```tsx
  const [searchEntities, searchResult] = useSearchMyEntitiesEntriesMutation({});
  const [searchDisabled, setSearchIsDisabled] = useState(false);

  const submitSearchValue = () => {
    setPage(1);
    setSearchIsDisabled(true);
    setIsSearchActive(true);

    searchEntities({
      searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: 0,
      stopIdx: 100,
    }).then((result) => {
      if ("data" in result) {
        const searchError = result.data?.error;

        if (searchError) {
          dispatch(addAlert({
            name: "submit-search-value-error",
            title: searchError.message || "Error when searching",
            variant: "danger",
          }));
          setIsSearchActive(false);
          setSearchData(null);
        } else {
          const results = result.data?.result.results || [];
          const searchTotalCount = result.data?.result.totalCount || 0;
          const entities: MyEntity[] = [];
          for (let i = 0; i < results.length; i++) {
            entities.push(results[i].result);
          }
          setSearchData({
            elementsList: entities,
            totalCount: searchTotalCount,
          });
        }
        setSearchIsDisabled(false);
      }
    });
  };
```

> **Important — `stopIdx: 100`:** Use a fixed upper bound (100) instead of `perPage`.
> The LDAP backend has a size limit close to this value, and using `perPage` (e.g. 10)
> would miss entries beyond the first page of results when searching from a page other
> than page 1.

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
