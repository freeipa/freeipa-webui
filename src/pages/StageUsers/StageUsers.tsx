import React, { useState } from "react";
// PatternFly
import { ToolbarItemVariant } from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
// Tables
import UsersTable from "../../components/tables/UsersTable";
// Modals
import DeleteUsers from "src/components/modals/UserModals/DeleteUsers";
import AddUser from "src/components/modals/UserModals/AddUser";
import ActivateStageUsers from "src/components/modals/UserModals/ActivateStageUsers";
// Utils
import { API_VERSION_BACKUP, isUserSelectable } from "src/utils/utils";
// RPC client
import { GenericPayload } from "../../services/rpc";
import { useGettingStageUserQuery } from "../../services/rpcUsers";
// Generic main page
import {
  useMainPageState,
  useDataResponseEffect,
  GenericMainPage,
} from "src/components/GenericMainPage";

const StageUsers = () => {
  const state = useMainPageState<User>({
    pathname: "stage-users",
    searchEntryType: "stage",
    nameAttr: "uid",
    getKeyValue: (user) => user.uid[0],
    isSelectable: isUserSelectable,
  });

  const userDataResponse = useGettingStageUserQuery({
    searchValue: state.searchValue,
    sizeLimit: 0,
    apiVersion: state.apiVersion || API_VERSION_BACKUP,
    startIdx: state.firstIdx,
    stopIdx: state.lastIdx,
  } as GenericPayload);

  useDataResponseEffect(userDataResponse, state);

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    userDataResponse.refetch();
  }, []);

  const refreshData = () => state.refreshData(() => userDataResponse.refetch());

  // Page-specific states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

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
  const onActivateHandler = () => {
    setShowActivateModal(true);
  };
  const onActivateModalToggle = () => {
    setShowActivateModal(!showActivateModal);
  };

  // Data wrappers for child components
  const selectedUsersData = {
    selectedUsers: state.selectedElements,
    clearSelectedUsers: state.clearSelectedElements,
  };

  const usersTableData = {
    isUserSelectable,
    selectedUsers: state.selectedElements,
    selectableUsersTable: state.selectableElements,
    setUserSelected: state.setElementSelected,
    clearSelectedUsers: state.clearSelectedElements,
  };

  const usersTableButtonsData = {
    updateIsDeleteButtonDisabled: state.updateIsDeleteButtonDisabled,
    isDeletion: state.isDeletion,
    updateIsDeletion: state.updateIsDeletion,
  };

  // Extra toolbar items
  const extraToolbarItems: ToolbarItem[] = [
    {
      key: "activate",
      element: (
        <SecondaryButton
          isDisabled={
            !state.showTableRows || state.selectedElements.length === 0
          }
          onClickHandler={onActivateHandler}
          dataCy="stage-users-button-activate"
        >
          Activate
        </SecondaryButton>
      ),
    },
    {
      key: "separator",
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: "help",
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={state.toggleContextualPanel}
        />
      ),
    },
    {
      key: "pagination-top",
      element: (
        <PaginationLayout
          list={state.elementsList}
          paginationData={state.paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <GenericMainPage
      state={state}
      pageTitle="Stage users"
      batchError={userDataResponse.error}
      onRefresh={refreshData}
      onAddClick={onAddClickHandler}
      onDeleteClick={onDeleteHandler}
      extraToolbarItems={extraToolbarItems}
      contextualPanelPage="stage-users"
      renderTable={(s) => (
        <UsersTable
          shownElementsList={s.elementsList}
          from="stage-users"
          showTableRows={s.showTableRows}
          usersData={usersTableData}
          buttonsData={usersTableButtonsData}
          paginationData={s.selectedPerPageData}
          searchValue={s.searchValue}
        />
      )}
    >
      <AddUser
        show={showAddModal}
        from="stage-users"
        setShowTableRows={state.setShowTableRows}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshData}
      />
      <DeleteUsers
        show={showDeleteModal}
        from="stage-users"
        handleModalToggle={onDeleteModalToggle}
        selectedUsersData={selectedUsersData}
        buttonsData={state.deleteButtonsData}
        onRefresh={refreshData}
      />
      <ActivateStageUsers
        show={showActivateModal}
        handleModalToggle={onActivateModalToggle}
        selectedUsers={state.selectedElements}
        onSuccess={refreshData}
      />
    </GenericMainPage>
  );
};

export default StageUsers;
