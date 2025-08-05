import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  PageSection,
  PaginationVariant,
  Tooltip,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Hooks
import useApiError from "src/hooks/useApiError";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { useAlerts } from "src/hooks/useAlerts";
// Layouts
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
// Errors
import GlobalErrors from "src/components/errors/GlobalErrors";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Utils
import { isGroupOverrideSelectable } from "src/utils/utils";
import IDViewsOverrideGroupsTable from "src/pages/IDViews/IDViewsOverrideGroupsTable";
// Modals
import AddIdOverrideGroupModal from "src/components/modals/IdOverrideModals/AddIdOverrideGroup";
import DeleteIdOverrideGroupsModal from "src/components/modals/IdOverrideModals/DeleteIdOverrideGroups";
// Data types
import { IDViewOverrideGroup } from "src/utils/datatypes/globalDataTypes";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  IDOverridePayload,
  useGettingIDOverrideGroupsQuery,
  useSearchOverrideEntriesMutation,
} from "src/services/rpcIdOverrides";

interface PropsToOverrides {
  idview: string;
  groups: string[];
  onRefresh: () => void;
}

const IDViewsOverrideGroups = (props: PropsToOverrides) => {
  const alerts = useAlerts();
  const globalErrors = useApiError([]);

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [groupsList, setGroupsList] = useState<IDViewOverrideGroup[]>([]);
  const [selectedGroups, setSelectedGroupsList] = useState<string[]>([]);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  const clearSelectedGroups = () => {
    const emptyList: string[] = [];
    setSelectedGroupsList(emptyList);
  };

  const selectedData = {
    selectedGroups,
    clearSelectedGroups,
  };

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selected list
  const [isDeletion, setIsDeletion] = useState(false);

  const updateIsDeletion = (value: boolean) => {
    setIsDeletion(value);
  };

  // Elements selected (per page)
  //  - This will help to calculate the remaining elements on a specific page (bulk selector)
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  const updateSelectedPerPage = (selected: number) => {
    setSelectedPerPage(selected);
  };
  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  const selectableTable = groupsList.filter(isGroupOverrideSelectable);

  const groupsTableData = {
    isSelectable: isGroupOverrideSelectable,
    selected: selectedGroups,
    selectableTable,
    setSelectedGroups: setSelectedGroupsList,
    clearSelected: clearSelectedGroups,
  };

  const viewsTableButtonsData = {
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
  };

  // Pagination
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  const updateShownGroupsList = (newShownGroupsList: IDViewOverrideGroup[]) => {
    setGroupsList(newShownGroupsList);
  };

  // Update search input valie
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [retrieveEntries] = useSearchOverrideEntriesMutation({});

  const submitSearchValue = () => {
    setShowTableRows(false);
    setTotalCount(0);
    setSearchIsDisabled(true);
    retrieveEntries({
      idView: props.idview,
      searchValue: searchValue,
      sizeLimit: 0,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: "idoverridegroup",
    } as IDOverridePayload).then((result) => {
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
            error || "Error when searching for override groups",
            "danger"
          );
        } else {
          // Success
          const groupsListResult = result.data?.result.results || [];
          const groupsListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const groupList: IDViewOverrideGroup[] = [];

          for (let i = 0; i < groupsListSize; i++) {
            groupList.push(groupsListResult[i].result);
          }
          setGroupsList(groupList);
          setTotalCount(totalCount);
          // Show table elements
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  const dataResponse = useGettingIDOverrideGroupsQuery(props.idview);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = dataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (dataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      dataResponse.isSuccess &&
      dataResponse.data &&
      batchResponse !== undefined
    ) {
      setGroupsList(batchResponse);
      setTotalCount(batchResponse.length);
      setShowTableRows(true);
    }
    // API response: Error
    if (
      !dataResponse.isLoading &&
      dataResponse.isError &&
      dataResponse.error !== undefined
    ) {
      alerts.addAlert(
        "add-group-error",
        "Failed to query override groups: " + dataResponse.error,
        "danger"
      );
    }
  }, [dataResponse]);

  const onRefresh = () => {
    props.onRefresh();
    dataResponse.refetch();
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  useEffect(() => {
    dataResponse.refetch();
  }, [page, perPage]);

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
    setShowAddModal(true);
  };
  const onCloseAddModal = () => {
    setShowAddModal(false);
  };
  const onAddModalToggle = () => {
    setShowAddModal(!showAddModal);
  };
  const onDeleteHandler = () => {
    setShowDeleteModal(true);
  };
  const onDeleteModalToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownGroupsList,
    totalCount,
  };

  // - 'Delete modal'
  const deleteGroupsButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const tooltipMsg = (
    <p>
      Searching only uses the <i>Group name</i>, <i>GID</i>, and{" "}
      <i>Description</i> to find override groups. <b>WARNING</b> searching by
      the <i>Group to override</i> value will not work
    </p>
  );

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Tooltip aria="none" aria-live="polite" content={tooltipMsg}>
          <Button
            icon={<OutlinedQuestionCircleIcon />}
            data-cy="search"
            aria-label="Search tips"
            variant="plain"
            id="search_tip"
          />
        </Tooltip>
      ),
      toolbarItemSpacer: { default: "spacerNone" },
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search groups"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
      toolbarItemVariant: "search-filter",
      toolbarItemSpacer: { default: "spacerMd" },
    },
    {
      key: 2,
      toolbarItemVariant: "separator",
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          dataCy="id-views-tab-override-groups-button-refresh"
          onClickHandler={props.onRefresh}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          dataCy="id-views-tab-override-groups-button-delete"
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
          dataCy="id-views-tab-override-groups-button-add"
          onClickHandler={onAddClickHandler}
          isDisabled={!showTableRows}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={props.groups}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  // Render component
  return (
    <PageSection hasBodyWrapper={false} isFilled={false}>
      <ToolbarLayout
        className="pf-v5-u-pt-0 pf-v5-u-pr-md"
        contentClassName="pf-v5-u-p-0"
        toolbarItems={toolbarItems}
      />
      <div className="pf-v5-u-ml-md pf-v5-u-mr-md">
        <OuterScrollContainer>
          <InnerScrollContainer>
            {batchError !== undefined && batchError ? (
              <GlobalErrors errors={globalErrors.getAll()} />
            ) : (
              <IDViewsOverrideGroupsTable
                elementsList={groupsList}
                shownElementsList={groupsList}
                showTableRows={showTableRows}
                overrideEntryData={groupsTableData}
                buttonsData={viewsTableButtonsData}
                paginationData={selectedPerPageData}
              />
            )}
          </InnerScrollContainer>
        </OuterScrollContainer>
      </div>
      <PaginationLayout
        list={groupsList}
        paginationData={paginationData}
        variant={PaginationVariant.bottom}
        widgetId="pagination-options-menu-bottom"
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
      />
      <AddIdOverrideGroupModal
        show={showAddModal}
        idview={props.idview}
        groups={groupsList}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={onRefresh}
      />
      <DeleteIdOverrideGroupsModal
        show={showDeleteModal}
        idview={props.idview}
        handleModalToggle={onDeleteModalToggle}
        selectedData={selectedData}
        buttonsData={deleteGroupsButtonsData}
        onRefresh={onRefresh}
      />
    </PageSection>
  );
};

export default IDViewsOverrideGroups;
