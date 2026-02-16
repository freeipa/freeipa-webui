/**
 * GenericMainPage - A reusable layout component for WebUI's main pages.
 *
 * This component extracts the common patterns found across all main page
 * components (e.g.: ActiveUsers, Hosts, Services, UserGroups, HostGroups,
 * Netgroups, IDViews, HBACRules, SubordinateIDs, AutoMemRules, etc.)
 * and provides:
 *
 * 1. `useMainPageState<T>` - A custom hook encapsulating all common state logic
 * 2. `GenericMainPage<T>` - A layout component providing the common UI structure
 *
 * USAGE EXAMPLE:
 * ```tsx
 * const MyPage = () => {
 *   const state = useMainPageState<MyType>({
 *     pathname: "my-items",
 *     searchEntryType: "myitem",
 *     nameAttr: "cn",
 *     getKeyValue: (item) => item.cn,
 *     isSelectable: isMyItemSelectable,
 *   });
 *
 *   // Use your own RTK Query hook
 *   const dataResponse = useGettingMyItemsQuery({
 *     searchValue: state.searchValue,
 *     sizeLimit: 0,
 *     apiVersion: state.apiVersion,
 *     startIdx: state.firstIdx,
 *     stopIdx: state.lastIdx,
 *   } as GenericPayload);
 *
 *   // Connect the query response to the state
 *   useDataResponseEffect(dataResponse, state);
 *
 *   return (
 *     <GenericMainPage
 *       state={state}
 *       pageTitle="My Items"
 *       batchError={dataResponse.error}
 *       onRefresh={() => state.refreshData(() => dataResponse.refetch())}
 *       onAddClick={() => setShowAddModal(true)}
 *       onDeleteClick={() => setShowDeleteModal(true)}
 *       renderTable={(s) => <MyTable elementsList={s.elementsList} ... />}
 *     >
 *       <AddMyItem show={...} />
 *       <DeleteMyItems show={...} />
 *     </GenericMainPage>
 *   );
 * };
 * ```
 */

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Components
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";
// Hooks
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useApiError from "src/hooks/useApiError";
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// Utils
import { API_VERSION_BACKUP } from "src/utils/utils";
// RPC
import {
  BatchRPCResponse,
  GenericPayload,
  useSearchEntriesMutation,
} from "src/services/rpc";
// Types
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

// ============================================================================
// Type definitions
// ============================================================================

/**
 * Configuration required to initialize `useMainPageState`.
 * Each main page provides its own configuration values.
 */
export interface MainPageConfig<T> {
  /** Route pathname used by `useUpdateRoute` (e.g., "active-users", "hosts") */
  pathname: string;

  /**
   * Entry type used for the `useSearchEntriesMutation` search call.
   * Corresponds to `GenericPayload.entryType`.
   * For pages that use a custom search mutation, this can be left empty.
   */
  searchEntryType?: GenericPayload["entryType"];

  /**
   * The attribute name used to identify each item in the list.
   * Used by BulkSelectorPrep and the selection logic.
   * Examples: "uid" (users), "fqdn" (hosts), "cn" (groups), "krbcanonicalname" (services)
   */
  nameAttr: string;

  /**
   * Function to extract the primary key value from an item.
   * Used for comparing items during selection.
   * Example: `(user) => user.uid` or `(host) => host.fqdn`
   */
  getKeyValue: (item: T) => string;

  /**
   * Predicate function to determine if an item can be selected.
   * Example: `isUserSelectable`, `isHostSelectable`
   */
  isSelectable: (item: T) => boolean;
}

/**
 * The complete state object returned by `useMainPageState`.
 * Provides all state values and callbacks needed by the generic page
 * and by page-specific components (tables, modals, etc.).
 */
export interface MainPageState<T> {
  // -- API --
  /** Current API version string from Redux store */
  apiVersion: string;
  /** Redux dispatch function */
  dispatch: ReturnType<typeof useAppDispatch>;

  // -- List data --
  /** Current list of elements displayed in the table */
  elementsList: T[];
  /** Setter for the elements list */
  setElementsList: React.Dispatch<React.SetStateAction<T[]>>;
  /** Total count of elements matching the current query */
  totalCount: number;
  /** Setter for the total count */
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  /** Whether the table rows should be visible */
  showTableRows: boolean;
  /** Setter for showTableRows */
  setShowTableRows: React.Dispatch<React.SetStateAction<boolean>>;

  // -- Pagination --
  /** Current page number (1-based) */
  page: number;
  /** Setter for page */
  setPage: (page: number) => void;
  /** Number of items per page */
  perPage: number;
  /** Setter for perPage */
  setPerPage: (perPage: number) => void;
  /** Index of first item on current page */
  firstIdx: number;
  /** Index of last item on current page */
  lastIdx: number;

  // -- Search --
  /** Current search input value */
  searchValue: string;
  /** Setter for search value */
  setSearchValue: (value: string) => void;
  /** Whether the search input is disabled (e.g., during a search request) */
  searchDisabled: boolean;
  /** Submit the current search value using the search mutation */
  submitSearchValue: () => void;

  // -- Selection --
  /** Currently selected elements */
  selectedElements: T[];
  /** Filtered list of selectable elements from the current page */
  selectableElements: T[];
  /** Toggle selection of a single element */
  setElementSelected: (element: T, isSelecting?: boolean) => void;
  /** Update selection for multiple elements at once */
  updateSelectedElements: (elements: T[], isSelected: boolean) => void;
  /** Clear all selected elements */
  clearSelectedElements: () => void;

  // -- Button states --
  /** Whether the delete button is disabled */
  isDeleteButtonDisabled: boolean;
  /** Update the delete button disabled state */
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  /** Whether a deletion operation just occurred */
  isDeletion: boolean;
  /** Update the isDeletion state */
  updateIsDeletion: (value: boolean) => void;

  // -- Per-page selection tracking --
  /** Number of elements selected on the current page */
  selectedPerPage: number;
  /** Update the per-page selection count */
  updateSelectedPerPage: (selected: number) => void;

  // -- Actions --
  /** Refresh handler: hides table, clears selection, triggers refetch */
  refreshData: (refetchFn: () => void) => void;

  // -- Contextual help panel --
  /** Whether the contextual help panel is expanded */
  isContextualPanelExpanded: boolean;
  /** Toggle the contextual help panel open/closed */
  toggleContextualPanel: () => void;
  /** Close the contextual help panel */
  closeContextualPanel: () => void;

  // -- Errors --
  /** Global error handler for API responses */
  globalErrors: ReturnType<typeof useApiError>;
  /** Modal error handler */
  modalErrors: ReturnType<typeof useApiError>;

  // -- Pre-built data wrappers (for child components) --

  /** Pre-built pagination data object for PaginationLayout */
  paginationData: {
    page: number;
    perPage: number;
    updatePage: (newPage: number) => void;
    updatePerPage: (newSetPerPage: number) => void;
    updateSelectedPerPage: (selected: number) => void;
    updateShownElementsList: (newShownElementsList: T[]) => void;
    totalCount: number;
  };

  /** Pre-built search value data object for SearchInputLayout */
  searchValueData: {
    searchValue: string;
    updateSearchValue: (value: string) => void;
    submitSearchValue: () => void;
  };

  /** Pre-built bulk selector data object for BulkSelectorPrep */
  bulkSelectorData: {
    selected: T[];
    updateSelected: (elements: T[], isSelected: boolean) => void;
    selectableTable: T[];
    nameAttr: string;
  };

  /** Pre-built selected per page data object */
  selectedPerPageData: {
    selectedPerPage: number;
    updateSelectedPerPage: (selected: number) => void;
  };

  /** Pre-built buttons data (for BulkSelectorPrep) */
  buttonsData: {
    updateIsDeleteButtonDisabled: (value: boolean) => void;
  };

  /** Pre-built delete buttons data (for delete modals) */
  deleteButtonsData: {
    updateIsDeleteButtonDisabled: (value: boolean) => void;
    updateIsDeletion: (value: boolean) => void;
  };

  // -- Configuration --
  /** Original configuration passed to the hook */
  config: MainPageConfig<T>;
}

// ============================================================================
// Custom Hook: useMainPageState
// ============================================================================

/**
 * Custom hook that encapsulates all common state management logic
 * shared across main page components.
 *
 * This hook manages:
 * - Page routing and browser title
 * - API version from Redux store
 * - Pagination state (page, perPage, indexes)
 * - Search state and submit logic
 * - Element list and total count
 * - Selection state and logic
 * - Button states (delete, deletion tracking)
 * - Error handling
 * - Pre-built data wrapper objects for child components
 *
 * @param config - Configuration specific to each page
 * @returns Complete state object with values and callbacks
 */
export function useMainPageState<T>(
  config: MainPageConfig<T>
): MainPageState<T> {
  const dispatch = useAppDispatch();

  // Stabilize config callbacks with refs to avoid unnecessary re-renders.
  // This prevents `useMemo`/`useCallback` invalidation when the consumer
  // passes an inline config object (new reference every render).
  const getKeyValueRef = useRef(config.getKeyValue);
  getKeyValueRef.current = config.getKeyValue;

  const isSelectableRef = useRef(config.isSelectable);
  isSelectableRef.current = config.isSelectable;

  const nameAttrRef = useRef(config.nameAttr);
  nameAttrRef.current = config.nameAttr;

  // Route (useUpdateRoute already sets document.title internally)
  useUpdateRoute({ pathname: config.pathname });

  // API version
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // URL parameters
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Error handling
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // List data
  const [elementsList, setElementsList] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showTableRows, setShowTableRows] = useState<boolean>(false);

  // Search
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Selection
  const [selectedElements, setSelectedElements] = useState<T[]>([]);
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  // Button states
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);
  const [isDeletion, setIsDeletion] = useState<boolean>(false);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // -- Callbacks --

  const updateSelectedPerPage = useCallback(
    (selected: number) => setSelectedPerPage(selected),
    []
  );
  const updateIsDeleteButtonDisabled = useCallback(
    (value: boolean) => setIsDeleteButtonDisabled(value),
    []
  );
  const updateIsDeletion = useCallback(
    (value: boolean) => setIsDeletion(value),
    []
  );

  const clearSelectedElements = useCallback(() => {
    setSelectedElements([]);
  }, []);

  // Selectable elements (filtered from current list)
  // Uses ref for `isSelectable` to avoid invalidating on every render
  const selectableElements = useMemo(
    () => elementsList.filter((item) => isSelectableRef.current(item)),
    [elementsList]
  );

  // Update selection for multiple elements.
  // Uses functional setState to avoid capturing `selectedElements` in the
  // closure (which would cause this callback to be recreated on every
  // selection change). Uses refs for config functions for the same reason.
  const updateSelectedElements = useCallback(
    (elements: T[], isSelected: boolean) => {
      setSelectedElements((prevSelected) => {
        const getKey = getKeyValueRef.current;
        let newSelected: T[];

        if (isSelected) {
          newSelected = structuredClone(prevSelected);
          for (const elem of elements) {
            const alreadySelected = prevSelected.some(
              (sel) => getKey(sel) === getKey(elem)
            );
            if (!alreadySelected) {
              newSelected.push(elem);
            }
          }
        } else {
          const keysToRemove = new Set(elements.map(getKey));
          newSelected = prevSelected.filter(
            (sel) => !keysToRemove.has(getKey(sel))
          );
        }

        setIsDeleteButtonDisabled(newSelected.length === 0);
        return newSelected;
      });
    },
    [] // stable: no external dependencies thanks to refs + functional update
  );

  // Toggle selection for a single element.
  // Stable callback: uses ref for `isSelectable`, and `updateSelectedElements`
  // is itself stable.
  const setElementSelected = useCallback(
    (element: T, isSelecting = true) => {
      if (isSelectableRef.current(element)) {
        updateSelectedElements([element], isSelecting);
      }
    },
    [updateSelectedElements]
  );

  // Search mutation
  const [retrieveEntries] = useSearchEntriesMutation({});

  const submitSearchValue = useCallback(() => {
    if (!config.searchEntryType) return;

    setShowTableRows(false);
    setTotalCount(0);
    setSearchIsDisabled(true);

    retrieveEntries({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: config.searchEntryType,
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
              title:
                error ||
                `Error when searching for ${config.searchEntryType || "entries"}`,
              variant: "danger",
            })
          );
        } else {
          const listResult = result.data?.result.results || [];
          const listSize = result.data?.result.count || 0;
          const resultTotalCount = result.data?.result.totalCount || 0;
          const items: T[] = [];

          for (let i = 0; i < listSize; i++) {
            items.push(listResult[i].result);
          }

          setPage(1);
          setElementsList(items);
          setTotalCount(resultTotalCount);
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  }, [
    searchValue,
    apiVersion,
    firstIdx,
    lastIdx,
    config.searchEntryType,
    dispatch,
    retrieveEntries,
    setPage,
  ]);

  // Refresh — does NOT reset page to 1 (user expects to stay on current page)
  const refreshData = useCallback(
    (refetchFn: () => void) => {
      setShowTableRows(false);
      setTotalCount(0);
      clearSelectedElements();
      refetchFn();
    },
    [clearSelectedElements]
  );

  // Contextual help panel
  const [isContextualPanelExpanded, setIsContextualPanelExpanded] =
    useState<boolean>(false);

  const toggleContextualPanel = useCallback(() => {
    setIsContextualPanelExpanded((prev) => !prev);
  }, []);

  const closeContextualPanel = useCallback(() => {
    setIsContextualPanelExpanded(false);
  }, []);

  // -- Pre-built data wrapper objects --
  // These provide the exact shapes expected by child components
  // (PaginationLayout, SearchInputLayout, BulkSelectorPrep, etc.)

  const paginationData = useMemo(
    () => ({
      page,
      perPage,
      updatePage: setPage,
      updatePerPage: setPerPage,
      updateSelectedPerPage,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateShownElementsList: setElementsList as (list: any[]) => void,
      totalCount,
    }),
    [page, perPage, setPage, setPerPage, updateSelectedPerPage, totalCount]
  );

  const searchValueData = useMemo(
    () => ({
      searchValue,
      updateSearchValue: setSearchValue,
      submitSearchValue,
    }),
    [searchValue, setSearchValue, submitSearchValue]
  );

  const bulkSelectorData = useMemo(
    () => ({
      selected: selectedElements,
      updateSelected: updateSelectedElements,
      selectableTable: selectableElements,
      nameAttr: nameAttrRef.current,
    }),
    [selectedElements, updateSelectedElements, selectableElements]
  );

  const selectedPerPageData = useMemo(
    () => ({
      selectedPerPage,
      updateSelectedPerPage,
    }),
    [selectedPerPage, updateSelectedPerPage]
  );

  const buttonsData = useMemo(
    () => ({
      updateIsDeleteButtonDisabled,
    }),
    [updateIsDeleteButtonDisabled]
  );

  const deleteButtonsData = useMemo(
    () => ({
      updateIsDeleteButtonDisabled,
      updateIsDeletion,
    }),
    [updateIsDeleteButtonDisabled, updateIsDeletion]
  );

  return {
    apiVersion,
    dispatch,
    elementsList,
    setElementsList,
    totalCount,
    setTotalCount,
    showTableRows,
    setShowTableRows,
    page,
    setPage,
    perPage,
    setPerPage,
    firstIdx,
    lastIdx,
    searchValue,
    setSearchValue,
    searchDisabled,
    submitSearchValue,
    selectedElements,
    selectableElements,
    setElementSelected,
    updateSelectedElements,
    clearSelectedElements,
    isDeleteButtonDisabled,
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
    selectedPerPage,
    updateSelectedPerPage,
    refreshData,
    isContextualPanelExpanded,
    toggleContextualPanel,
    closeContextualPanel,
    globalErrors,
    modalErrors,
    paginationData,
    searchValueData,
    bulkSelectorData,
    selectedPerPageData,
    buttonsData,
    deleteButtonsData,
    config,
  };
}

// ============================================================================
// Helper: useDataResponseEffect
// ============================================================================

/**
 * Helper hook that connects an RTK Query response to the GenericMainPage state.
 * This handles the common pattern of:
 * - Hiding the table during fetch
 * - Parsing the batch response on success
 * - Dispatching an error alert on failure
 *
 * @param dataResponse - The RTK Query hook return value
 * @param state - The MainPageState from useMainPageState
 * @param onSuccess - Optional callback after successful data load
 */
export function useDataResponseEffect<T>(
  dataResponse: {
    data?: BatchRPCResponse;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
    isError: boolean;
    error?: unknown;
    refetch: () => void;
  },
  state: MainPageState<T>,
  onSuccess?: (items: T[]) => void
) {
  // Stabilize the onSuccess callback with a ref so it doesn't
  // need to be in the dependency array
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // Destructure primitive/stable values for use as dependencies
  const {
    data: batchResponse,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = dataResponse;

  // Process API response — dependencies are primitive values (booleans),
  // plus `batchResponse` which is reference-stable from RTK Query when unchanged.
  useEffect(() => {
    if (isFetching) {
      state.setShowTableRows(false);
      state.setTotalCount(0);
      state.globalErrors.clear();
      return;
    }

    // Success
    if (isSuccess && batchResponse !== undefined) {
      // BatchRPCResponse.result.results is typed as a single object but is
      // actually an array at runtime. Cast to the expected shape.
      const listResult = batchResponse.result.results as unknown as {
        result: T;
      }[];
      const resultTotalCount = batchResponse.result.totalCount;
      const listSize = batchResponse.result.count;
      const items: T[] = [];

      for (let i = 0; i < listSize; i++) {
        items.push(listResult[i].result);
      }

      state.setElementsList(items);
      state.setTotalCount(resultTotalCount);
      state.setShowTableRows(true);

      onSuccessRef.current?.(items);
    }

    // Error — dispatch an alert instead of forcing a full page reload,
    // which would bypass React error boundaries and lose client-side state.
    if (!isLoading && isError && error !== undefined) {
      state.dispatch(
        addAlert({
          name: "batch-query-error",
          title: "An error occurred while loading data. Please try refreshing.",
          variant: "danger",
        })
      );
    }
  }, [isFetching, isSuccess, isError, batchResponse]);

  // Sync showTableRows with loading state
  useEffect(() => {
    state.setShowTableRows(!isLoading);
  }, [isLoading]);
}

// ============================================================================
// Component: GenericMainPage
// ============================================================================

/**
 * Props for the GenericMainPage layout component.
 *
 * Most props are optional and derived from `state.config` by default.
 * Only `state`, `pageTitle`, `onRefresh`, and `renderTable` are required.
 *
 * Feature buttons (Add, Delete) are shown automatically when their
 * click handlers are provided — no separate boolean flag needed.
 */
export interface GenericMainPageProps<T> {
  // ---- Required ----

  /** The state object from `useMainPageState` */
  state: MainPageState<T>;

  /** Page title displayed at the top of the page */
  pageTitle: string;

  /** Handler for the Refresh button click */
  onRefresh: () => void;

  /**
   * Render function for the table component.
   * The function receives the current page state.
   */
  renderTable: (state: MainPageState<T>) => React.ReactNode;

  // ---- Feature toggles (presence-based) ----

  /**
   * Handler for the Add button click.
   * If provided, the Add button is shown; if omitted, it is hidden.
   */
  onAddClick?: () => void;

  /**
   * Handler for the Delete button click.
   * If provided, the Delete button is shown; if omitted, it is hidden.
   */
  onDeleteClick?: () => void;

  /**
   * The `fromPage` identifier for the ContextualHelpPanel.
   * If provided, the contextual help panel is enabled.
   * If omitted, no help panel is rendered.
   */
  contextualPanelPage?: string;

  // ---- Optional ----

  /** Error from the batch data query (to show GlobalErrors) */
  batchError?: unknown;

  /**
   * Additional toolbar items to insert after the standard buttons.
   * Useful for Enable/Disable buttons, Kebab menus, etc.
   */
  extraToolbarItems?: ToolbarItem[];

  /**
   * Whether the Add button should be disabled due to an error.
   * @default false
   */
  isAddDisabledDueError?: boolean;

  /**
   * Whether to show the bulk selector.
   * @default true
   */
  hasBulkSelector?: boolean;

  /**
   * Children to render after the page sections (modals, etc.)
   */
  children?: React.ReactNode;

  // ---- Overrides (derived by default, pass only to customize) ----

  /**
   * Override the page title ID.
   * @default derived from `pageTitle` as `${pageTitle.toLowerCase()} title`
   */
  pageTitleId?: string;

  /**
   * Override the data-cy prefix for toolbar elements.
   * @default `state.config.pathname`
   */
  dataCyPrefix?: string;

  /**
   * Override the aria label for the search input.
   * @default `"Search " + pageTitle.toLowerCase()`
   */
  searchAriaLabel?: string;

  /**
   * Override the data-cy value for the modal errors component.
   * @default `${dataCyPrefix}-modal-error`
   */
  modalErrorsDataCy?: string;
}

/**
 * GenericMainPage - Layout component for main list pages.
 *
 * Provides the common UI structure shared by all main pages:
 * - Page title section
 * - Toolbar with BulkSelector, Search, Refresh, Delete, Add, Help, Pagination
 * - Table area with error handling
 * - Bottom pagination
 * - Modal error display
 *
 * Page-specific elements (table, modals, extra buttons) are provided via
 * render props and children.
 *
 * @typeParam T - The data type for the page's list items
 */
const EMPTY_TOOLBAR_ITEMS: ToolbarItem[] = [];

export function GenericMainPage<T>(props: GenericMainPageProps<T>) {
  const {
    state,
    pageTitle,
    onRefresh,
    renderTable,
    onAddClick,
    onDeleteClick,
    contextualPanelPage,
    batchError,
    extraToolbarItems = EMPTY_TOOLBAR_ITEMS,
    isAddDisabledDueError = false,
    hasBulkSelector = true,
    children,
  } = props;

  // Derive defaults from state.config and pageTitle
  const dataCyPrefix = props.dataCyPrefix ?? state.config.pathname;
  const pageTitleId = props.pageTitleId ?? pageTitle.toLowerCase() + " title";
  const searchAriaLabel =
    props.searchAriaLabel ?? "Search " + pageTitle.toLowerCase();
  const modalErrorsDataCy =
    props.modalErrorsDataCy ?? dataCyPrefix + "-modal-error";

  // Feature flags derived from handler presence
  const hasContextualPanel = !!contextualPanelPage;

  // Build toolbar items — uses stable string keys instead of a mutable counter
  // to prevent unnecessary unmount/remount when items are conditionally shown.
  const toolbarItems = useMemo(() => {
    const items: ToolbarItem[] = [];

    // 1. Bulk Selector
    if (hasBulkSelector) {
      items.push({
        key: "bulk-selector",
        element: (
          <BulkSelectorPrep
            list={state.elementsList}
            shownElementsList={state.elementsList}
            elementData={state.bulkSelectorData}
            buttonsData={state.buttonsData}
            selectedPerPageData={state.selectedPerPageData}
          />
        ),
      });
    }

    // 2. Search Input
    items.push({
      key: "search",
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel={searchAriaLabel}
          placeholder="Search"
          searchValueData={state.searchValueData}
          isDisabled={state.searchDisabled}
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    });

    // 3. Separator
    items.push({
      key: "separator-1",
      toolbarItemVariant: ToolbarItemVariant.separator,
    });

    // 4. Refresh button
    items.push({
      key: "refresh",
      element: (
        <SecondaryButton
          dataCy={`${dataCyPrefix}-button-refresh`}
          onClickHandler={onRefresh}
          isDisabled={!state.showTableRows}
        >
          Refresh
        </SecondaryButton>
      ),
    });

    // 5. Delete button (shown when onDeleteClick handler is provided)
    if (onDeleteClick) {
      items.push({
        key: "delete",
        element: (
          <SecondaryButton
            dataCy={`${dataCyPrefix}-button-delete`}
            isDisabled={state.isDeleteButtonDisabled || !state.showTableRows}
            onClickHandler={onDeleteClick}
          >
            Delete
          </SecondaryButton>
        ),
      });
    }

    // 6. Add button (shown when onAddClick handler is provided)
    if (onAddClick) {
      items.push({
        key: "add",
        element: (
          <SecondaryButton
            dataCy={`${dataCyPrefix}-button-add`}
            onClickHandler={onAddClick}
            isDisabled={!state.showTableRows || isAddDisabledDueError}
          >
            Add
          </SecondaryButton>
        ),
      });
    }

    // 7. Extra toolbar items (Enable/Disable, Kebab, Separator, Help,
    //    Pagination, etc.) — provided by each page via extraToolbarItems
    for (let i = 0; i < extraToolbarItems.length; i++) {
      items.push({
        ...extraToolbarItems[i],
        key: extraToolbarItems[i].key ?? `extra-${i}`,
      });
    }

    return items;
  }, [
    hasBulkSelector,
    searchAriaLabel,
    dataCyPrefix,
    isAddDisabledDueError,
    onRefresh,
    onDeleteClick,
    onAddClick,
    extraToolbarItems,
    state.elementsList,
    state.bulkSelectorData,
    state.buttonsData,
    state.selectedPerPageData,
    state.searchValueData,
    state.searchDisabled,
    state.showTableRows,
    state.isDeleteButtonDisabled,
  ]);

  // Page content
  const pageContent = (
    <div>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout id={pageTitleId} headingLevel="h1" text={pageTitle} />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={false}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ToolbarLayout toolbarItems={toolbarItems} />
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto" }}>
            <OuterScrollContainer>
              <InnerScrollContainer
                style={{ height: "60vh", overflow: "auto" }}
              >
                {batchError !== undefined && batchError ? (
                  <GlobalErrors errors={state.globalErrors.getAll()} />
                ) : (
                  renderTable(state)
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={state.elementsList}
              paginationData={state.paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <ModalErrors
        errors={state.modalErrors.getAll()}
        dataCy={modalErrorsDataCy}
      />
      {children}
    </div>
  );

  // Wrap with contextual panel if enabled
  if (hasContextualPanel && contextualPanelPage) {
    return (
      <ContextualHelpPanel
        fromPage={contextualPanelPage}
        isExpanded={state.isContextualPanelExpanded}
        onClose={state.closeContextualPanel}
      >
        {pageContent}
      </ContextualHelpPanel>
    );
  }

  return pageContent;
}

export default GenericMainPage;
