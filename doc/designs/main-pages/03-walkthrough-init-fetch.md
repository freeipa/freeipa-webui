# Main Pages — Walkthrough: Init, State & Data Fetching

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Structure & Imports](02-structure-and-anatomy.md) | [Selection & Toolbar](04-walkthrough-selection-toolbar.md)

## Step 1: Route & Browser Title

```tsx
const MyEntities = () => {
  const dispatch = useAppDispatch();
  const { browserTitle } = useUpdateRoute({ pathname: "my-entities" });

  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);
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
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const { data: batchResponse, isLoading, isFetching, error } = dataResponse;
```

## Step 4: Derive State with useMemo (Recommended)

Use `useMemo` to derive `entitiesList` and `totalCount` from the query response — **do not** use `useEffect` + `useState` to sync state:

```tsx
  // Search state (for mutation-based search)
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchData, setSearchData] = useState<{ entities: MyEntity[]; totalCount: number } | null>(null);

  // Derive entitiesList and totalCount
  const { entitiesList, totalCount } = useMemo(() => {
    if (isSearchActive && searchData) {
      return { entitiesList: searchData.entities, totalCount: searchData.totalCount };
    }

    if (batchResponse?.result) {
      const results = batchResponse.result.results;
      const entities: MyEntity[] = [];
      for (let i = 0; i < batchResponse.result.count; i++) {
        entities.push(results[i].result);
      }
      return { entitiesList: entities, totalCount: batchResponse.result.totalCount };
    }

    return { entitiesList: [], totalCount: 0 };
  }, [batchResponse, isSearchActive, searchData]);

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

  React.useEffect(() => {
    if (!isSearchActive) {
      dataResponse.refetch();
    }
  }, [page, perPage]);
```

## Step 7: Search Handler

```tsx
  const [searchEntities, searchResult] = useSearchMyEntitiesEntriesMutation({});
  const [searchDisabled, setSearchIsDisabled] = useState(false);

  const submitSearchValue = () => {
    setSearchIsDisabled(true);
    setIsSearchActive(true);

    searchEntities({
      searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
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
          const entities: MyEntity[] = [];
          for (let i = 0; i < results.length; i++) {
            entities.push(results[i].result);
          }
          setSearchData({
            entities,
            totalCount: result.data?.result.totalCount || 0,
          });
        }
        setSearchIsDisabled(false);
      }
    });
  };
```

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
