import React, { useEffect, useState } from "react";
// PatternFly
import {
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
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
import { isUserOverrideSelectable } from "src/utils/utils";
import IDViewsOverrideUsersTable from "src/pages/IDViews/IDViewsOverrideUsersTable";
// Modals
import AddIdOverrideUserModal from "src/components/modals/IdOverrideModals/AddIdOverrideUser";
import DeleteIdOverrideUsersModal from "src/components/modals/IdOverrideModals/DeleteIdOverrideUsers";
// Data types
import { IDViewOverrideUser } from "src/utils/datatypes/globalDataTypes";
// RPC
import {
  IDOverridePayload,
  useGettingIDOverrideUsersQuery,
  useSearchOverrideEntriesMutation,
} from "src/services/rpcIdOverrides";

interface PropsToOverrides {
  idview: string;
  users: string[];
  onRefresh: () => void;
}

const IDViewsOverrideUsers = (props: PropsToOverrides) => {
  const alerts = useAlerts();
  const globalErrors = useApiError([]);

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [usersList, setUsersList] = useState<IDViewOverrideUser[]>([]);
  const [selectedUsers, setSelectedUsersList] = useState<string[]>([]);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  const clearSelectedUsers = () => {
    const emptyList: string[] = [];
    setSelectedUsersList(emptyList);
  };

  const selectedData = {
    selectedUsers,
    clearSelectedUsers,
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

  const selectableTable = usersList.filter(isUserOverrideSelectable);

  const usersTableData = {
    isSelectable: isUserOverrideSelectable,
    selected: selectedUsers,
    selectableTable,
    setSelectedUsers: setSelectedUsersList,
    clearSelected: clearSelectedUsers,
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

  const updateShownUsersList = (newShownUsersList: IDViewOverrideUser[]) => {
    setUsersList(newShownUsersList);
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
      entryType: "idoverrideuser",
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
            error || "Error when searching for override users",
            "danger"
          );
        } else {
          // Success
          const usersListResult = result.data?.result.results || [];
          const usersListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const userList: IDViewOverrideUser[] = [];

          for (let i = 0; i < usersListSize; i++) {
            userList.push(usersListResult[i].result);
          }
          setUsersList(userList);
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

  const dataResponse = useGettingIDOverrideUsersQuery(props.idview);

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
      setUsersList(batchResponse);
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
        "add-user-error",
        "Failed to query override users: " + dataResponse.error,
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
    updateShownElementsList: updateShownUsersList,
    totalCount,
  };

  // - 'Delete modal'
  const deleteUsersButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 1,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search users"
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
          dataCy="id-views-tab-override-users-button-refresh"
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
          dataCy="id-views-tab-override-users-button-delete"
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
          dataCy="id-views-tab-override-users-button-add"
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
          list={props.users}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
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
              <IDViewsOverrideUsersTable
                elementsList={usersList}
                shownElementsList={usersList}
                showTableRows={showTableRows}
                overrideEntryData={usersTableData}
                buttonsData={viewsTableButtonsData}
                paginationData={selectedPerPageData}
              />
            )}
          </InnerScrollContainer>
        </OuterScrollContainer>
      </div>
      <PaginationLayout
        list={usersList}
        paginationData={paginationData}
        variant={PaginationVariant.bottom}
        widgetId="pagination-options-menu-bottom"
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
      />
      <AddIdOverrideUserModal
        show={showAddModal}
        idview={props.idview}
        users={usersList}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={onRefresh}
      />
      <DeleteIdOverrideUsersModal
        show={showDeleteModal}
        idview={props.idview}
        handleModalToggle={onDeleteModalToggle}
        selectedData={selectedData}
        buttonsData={deleteUsersButtonsData}
        onRefresh={onRefresh}
      />
    </PageSection>
  );
};

export default IDViewsOverrideUsers;
