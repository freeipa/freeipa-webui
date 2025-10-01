import React, { useEffect, useState } from "react";
// PatternFly
import {
  DropdownItem,
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
// Layouts
import DualListLayout from "src/components/layouts/DualListLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
// Components
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import PaginationLayout from "src/components/layouts/PaginationLayout/PaginationLayout";
// Tables
import IDViewsTable from "src/pages/IDViews/IDViewsTable";
// Modal
import AddIDViewModal from "src/components/modals/AddIDView";
import DeleteIDViewsModal from "src/components/modals/DeleteIDViews";
// Redux
import { useAppSelector } from "src/store/hooks";
// Data types
import { IDView } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isViewSelectable } from "src/utils/utils";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// RPC client
import {
  ErrorResult,
  GenericPayload,
  useSearchEntriesMutation,
} from "../../services/rpc";
import {
  useGettingIDViewsQuery,
  useUnapplyHostsMutation,
  useUnapplyHostgroupsMutation,
} from "../../services/rpcIDViews";

const IDViews = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "id-views" });

  // API
  const [executeUnapplyHosts] = useUnapplyHostsMutation();
  const [executeUnapplyHostgroups] = useUnapplyHostgroupsMutation();

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Initialize views (Redux)
  const [viewsList, setViewsList] = useState<IDView[]>([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // Table comps
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);
  const [totalCount, setViewsTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  const updateSelectedPerPage = (selected: number) => {
    setSelectedPerPage(selected);
  };
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selected views list
  const [isDeletion, setIsDeletion] = useState(false);

  const updateIsDeletion = (value: boolean) => {
    setIsDeletion(value);
  };

  const updateShownViewsList = (newShownViewsList: IDView[]) => {
    setViewsList(newShownViewsList);
  };

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // Derived states - what we get from API
  const viewsDataResponse = useGettingIDViewsQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = viewsDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (viewsDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected ID views on refresh
      setViewsTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      viewsDataResponse.isSuccess &&
      viewsDataResponse.data &&
      batchResponse !== undefined
    ) {
      const viewsListResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const viewsListSize = batchResponse.result.count;
      const idViewsList: IDView[] = [];

      for (let i = 0; i < viewsListSize; i++) {
        idViewsList.push(viewsListResult[i].result);
      }

      setViewsList(idViewsList);
      setViewsTotalCount(totalCount);
      setIsKebabOpen(false);
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !viewsDataResponse.isLoading &&
      viewsDataResponse.isError &&
      viewsDataResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [viewsDataResponse]);

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  useEffect(() => {
    viewsDataResponse.refetch();
    setIsKebabOpen(false);
  }, [page, perPage]);

  // Refresh button handling
  const refreshViewsData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected views on refresh
    setViewsTotalCount(0);
    clearSelectedViews();
    setPage(1);
    viewsDataResponse.refetch();
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [selectedViews, setSelectedViewsList] = useState<IDView[]>([]);
  const clearSelectedViews = () => {
    const emptyList: IDView[] = [];
    setSelectedViewsList(emptyList);
  };

  const [retrieveViews] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setViewsTotalCount(0);
    setSearchIsDisabled(true);
    retrieveViews({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: "idview",
    } as GenericPayload).then((result) => {
      // Manage new response here
      if ("data" in result) {
        const searchError = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          // Error
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          } else if ("message" in searchError) {
            error = searchError.message;
          }
          alerts.addAlert(
            "submit-search-value-error",
            error || "Error when searching for ID views",
            "danger"
          );
        } else {
          // Success
          const viewsListResult = result.data?.result.results || [];
          const viewsListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const idViewsList: IDView[] = [];

          for (let i = 0; i < viewsListSize; i++) {
            idViewsList.push(viewsListResult[i].result);
          }

          setPage(1);
          setViewsList(idViewsList);
          setViewsTotalCount(totalCount);
          setIsKebabOpen(false);
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  const updateSelectedViews = (views: IDView[], isSelected: boolean) => {
    let newSelectedViews: IDView[] = [];
    if (isSelected) {
      newSelectedViews = JSON.parse(JSON.stringify(selectedViews));
      for (let i = 0; i < views.length; i++) {
        if (
          selectedViews.find(
            (selectedView) => selectedView.cn[0] === views[i].cn[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add view to list
        newSelectedViews.push(views[i]);
      }
    } else {
      // Remove view
      for (let i = 0; i < selectedViews.length; i++) {
        let found = false;
        for (let ii = 0; ii < views.length; ii++) {
          if (selectedViews[i].cn[0] === views[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedViews.push(selectedViews[i]);
        }
      }
    }
    setIsKebabOpen(false);
    setSelectedViewsList(newSelectedViews);
    setIsDeleteButtonDisabled(newSelectedViews.length === 0);
  };

  // - Helper method to set the selected views from the table
  const setViewSelected = (view: IDView, isSelecting = true) => {
    if (isViewSelectable(view)) {
      updateSelectedViews([view], isSelecting);
    }
  };

  // Show table rows only when data is fully retrieved
  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  // Modals functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onAddClickHandler = () => {
    setIsKebabOpen(false);
    setShowAddModal(true);
  };
  const onCloseAddModal = () => {
    setShowAddModal(false);
  };
  const onAddModalToggle = () => {
    setShowAddModal(!showAddModal);
  };

  const onDeleteHandler = () => {
    setIsKebabOpen(false);
    setShowDeleteModal(true);
  };
  const onDeleteModalToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // Unapply functions
  const [showHostModal, setShowHostModal] = useState(false);
  const [showHostgroupModal, setShowHostgroupModal] = useState(false);
  const [unapplySpinning, setUnapplySpinning] = useState(false);
  const openUnapplyHostModal = () => {
    setShowHostModal(true);
  };
  const closeUnapplyHostModal = () => {
    setShowHostModal(false);
  };
  const openUnapplyHostgroupModal = () => {
    setShowHostgroupModal(true);
  };
  const closeUnapplyHostgroupModal = () => {
    setShowHostgroupModal(false);
  };

  const onUnapplyHosts = (selectedHosts: string[]) => {
    setUnapplySpinning(true);

    // unapply views from hosts
    executeUnapplyHosts(selectedHosts).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          alerts.addAlert(
            "unapply-id-views-hosts-success",
            "ID views unapplied from " +
              response.data.result["completed"] +
              " hosts",
            "success"
          );
          // Refresh data
          refreshViewsData();
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "unapply-id-views-hosts-error",
            "ID views unapplied from hosts failed: " + errorMessage.message,
            "danger"
          );
        }
      }
      setIsKebabOpen(false);
      setUnapplySpinning(false);
      closeUnapplyHostModal();
    });
  };

  const onUnapplyHostgroups = (selectedHostgroups: string[]) => {
    setUnapplySpinning(true);

    // unapply views from host groups
    executeUnapplyHostgroups(selectedHostgroups).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          alerts.addAlert(
            "unapply-id-views-hosts-success",
            "ID views unapplied from " +
              response.data.result["completed"] +
              " hosts",
            "success"
          );
          // Refresh data
          refreshViewsData();
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "unapply-id-views-hosts-error",
            "ID views unapplied from host groups failed: " +
              errorMessage.message,
            "danger"
          );
        }
      }
      setIsKebabOpen(false);
      setUnapplySpinning(false);
      closeUnapplyHostgroupModal();
    });
  };

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableViewsTable = viewsList.filter(isViewSelectable); // elements per Table

  // Data wrappers
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownViewsList,
    totalCount,
  };

  // - 'BulkSelectorIDViewPrep'
  const viewsBulkSelectorData = {
    selected: selectedViews,
    updateSelected: updateSelectedViews,
    selectableTable: selectableViewsTable,
    nameAttr: "cn",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // - 'Delete Views'
  const deleteViewsButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedViewsData = {
    selectedViews,
    clearSelectedViews,
  };

  // - 'Views Table'
  const viewsTableData = {
    isViewSelectable,
    selectedViews,
    selectableViewsTable,
    setViewSelected,
    clearSelectedViews,
  };

  const viewsTableButtonsData = {
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
  };

  // - 'SearchInputLayout'
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // Keybob for un-apply actions
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);
  const onKebabToggle = () => {
    setIsKebabOpen(!isKebabOpen);
  };
  const onKebabSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    setIsKebabOpen(!isKebabOpen);
  };
  const dropdownItems = [
    <DropdownItem
      data-cy="id-views-kebab-unapply-hosts"
      key="unapply-hosts"
      onClick={openUnapplyHostModal}
      isDisabled={!showTableRows || totalCount === 0}
    >
      Unapply from hosts
    </DropdownItem>,
    <DropdownItem
      data-cy="id-views-kebab-unapply-hostgroups"
      key="unapply-hostgroups"
      onClick={openUnapplyHostgroupModal}
      isDisabled={!showTableRows || totalCount === 0}
    >
      Unapply from host groups
    </DropdownItem>,
  ];

  // List of toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={viewsList}
          shownElementsList={viewsList}
          elementData={viewsBulkSelectorData}
          buttonsData={buttonsData}
          selectedPerPageData={selectedPerPageData}
        />
      ),
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search ID views"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 2,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          dataCy="id-views-button-refresh"
          onClickHandler={refreshViewsData}
          isDisabled={!showTableRows}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          dataCy="id-views-button-delete"
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          onClickHandler={onDeleteHandler}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          dataCy="id-views-button-add"
          onClickHandler={onAddClickHandler}
          isDisabled={!showTableRows}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <KebabLayout
          dataCy="id-views-kebab"
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={dropdownItems}
          isDisabled={!showTableRows}
        />
      ),
    },
    {
      key: 7,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 8,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 9,
      element: (
        <PaginationLayout
          list={viewsList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <div>
      <alerts.ManagedAlerts />
      <PageSection hasBodyWrapper={false}>
        <TitleLayout id="Views title" headingLevel="h1" text="ID views" />
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
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <IDViewsTable
                    elementsList={viewsList}
                    shownElementsList={viewsList}
                    showTableRows={showTableRows}
                    idViewsData={viewsTableData}
                    buttonsData={viewsTableButtonsData}
                    paginationData={selectedPerPageData}
                    searchValue={searchValue}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={viewsList}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <ModalErrors
        errors={modalErrors.getAll()}
        dataCy="id-views-modal-error"
      />
      <AddIDViewModal
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshViewsData}
      />
      <DeleteIDViewsModal
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedViewsData={selectedViewsData}
        buttonsData={deleteViewsButtonsData}
        onRefresh={refreshViewsData}
      />
      <DualListLayout
        entry={""}
        target={"host"}
        showModal={showHostModal}
        onCloseModal={closeUnapplyHostModal}
        onOpenModal={openUnapplyHostModal}
        tableElementsList={[]}
        action={onUnapplyHosts}
        title={"Unapply ID views from hosts"}
        spinning={unapplySpinning}
        addBtnName="Unapply"
        addSpinningBtnName="Unappling"
      />
      <DualListLayout
        entry={""}
        target={"hostgroup"}
        showModal={showHostgroupModal}
        onCloseModal={closeUnapplyHostgroupModal}
        onOpenModal={openUnapplyHostgroupModal}
        tableElementsList={[]}
        action={onUnapplyHostgroups}
        title={"Unapply ID views from host groups"}
        spinning={unapplySpinning}
        addBtnName="Unapply"
        addSpinningBtnName="Unapplying"
      />
    </div>
  );
};

export default IDViews;
