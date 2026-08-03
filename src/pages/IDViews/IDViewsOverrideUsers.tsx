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
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useApiError from "src/hooks/useApiError";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { addAlert } from "src/store/Global/alerts-slice";
// Layouts
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
// Errors
import GlobalErrors from "src/components/errors/GlobalErrors";
// Utils
import { isUserOverrideSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
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
} from "src/services/rpcIdOverrides";

interface PropsToOverrides {
  idview: string;
  users: string[];
  onRefresh: () => void;
}

const IDViewsOverrideUsers = (props: PropsToOverrides) => {
  const dispatch = useAppDispatch();

  const globalErrors = useApiError([]);

  const { page, perPage, searchValue } = useListPageSearchParams();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [usersList, setUsersList] = useState<IDViewOverrideUser[]>([]);
  const [selectedUsers, setSelectedUsersList] = useState<string[]>([]);

  const clearSelectedUsers = () => {
    const emptyList: string[] = [];
    setSelectedUsersList(emptyList);
  };

  const selectedData = {
    selectedUsers,
    clearSelectedUsers,
  };

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

  const selectedPerPageData = getSelectedPerPageData(
    usersList,
    selectedUsers,
    (user) => ipaPrimaryKey(user.ipaanchoruuid)
  );

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

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const dataResponse = useGettingIDOverrideUsersQuery({
    idView: props.idview,
    searchValue,
    sizeLimit: 0,
    startIdx: firstIdx,
    stopIdx: lastIdx,
    entryType: "idoverrideuser",
  } as IDOverridePayload);

  const {
    data: batchResponse,
    isFetching: isBatchFetching,
    error: batchError,
  } = dataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (dataResponse.isFetching) {
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
      const usersListResult = batchResponse.result.results || [];
      const usersListSize = batchResponse.result.count || 0;
      const total = batchResponse.result.totalCount || 0;
      const userList: IDViewOverrideUser[] = [];

      for (let i = 0; i < usersListSize; i++) {
        userList.push(usersListResult[i].result);
      }
      setUsersList(userList);
      setTotalCount(total);
    }
    // API response: Error
    if (
      !dataResponse.isLoading &&
      dataResponse.isError &&
      dataResponse.error !== undefined
    ) {
      dispatch(
        addAlert({
          name: "add-user-error",
          title: "Failed to query override users: " + dataResponse.error,
          variant: "danger",
        })
      );
    }
  }, [dataResponse]);

  const onRefresh = () => {
    props.onRefresh();
    dataResponse.refetch();
  };

  // Show table rows
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
          placeholder="Search users"
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
          isDisabled={isDeleteButtonDisabled || isBatchFetching}
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
          isDisabled={isBatchFetching}
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
          totalCount={totalCount}
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
        className="pf-v6-u-pt-0 pf-v6-u-pr-md"
        contentClassName="pf-v6-u-p-0"
        toolbarItems={toolbarItems}
      />
      <div className="pf-v6-u-ml-md pf-v6-u-mr-md">
        <OuterScrollContainer>
          <InnerScrollContainer>
            {batchError !== undefined && batchError ? (
              <GlobalErrors errors={globalErrors.getAll()} />
            ) : (
              <IDViewsOverrideUsersTable
                elementsList={usersList}
                shownElementsList={usersList}
                showTableRows={!isBatchFetching}
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
        totalCount={totalCount}
        variant={PaginationVariant.bottom}
        widgetId="pagination-options-menu-bottom"
        className="pf-v6-u-pb-0 pf-v6-u-pr-md"
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
