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
import StagePreservedUsers from "src/components/modals/UserModals/StagePreservedUsers";
import RestorePreservedUsers from "src/components/modals/UserModals/RestorePreservedUsers";
// Utils
import { API_VERSION_BACKUP, isUserSelectable } from "src/utils/utils";
// RPC client
import { GenericPayload } from "../../services/rpc";
import { useGettingPreservedUserQuery } from "../../services/rpcUsers";
// Generic main page
import {
  useMainPageState,
  useDataResponseEffect,
  GenericMainPage,
} from "src/components/GenericMainPage";

const PreservedUsers = () => {
  const state = useMainPageState<User>({
    pathname: "preserved-users",
    searchEntryType: "preserved",
    nameAttr: "uid",
    getKeyValue: (user) => user.uid[0],
    isSelectable: isUserSelectable,
  });

  const userDataResponse = useGettingPreservedUserQuery({
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);

  const onDeleteHandler = () => {
    setShowDeleteModal(true);
  };
  const onDeleteModalToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const onRestoreHandler = () => {
    setShowRestoreModal(true);
  };
  const onRestoreModalToggle = () => {
    setShowRestoreModal(!showRestoreModal);
  };
  const onStageHandler = () => {
    setShowStageModal(true);
  };
  const onStageModalToggle = () => {
    setShowStageModal(!showStageModal);
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
      key: "restore",
      element: (
        <SecondaryButton
          isDisabled={
            !state.showTableRows || state.selectedElements.length === 0
          }
          onClickHandler={onRestoreHandler}
          dataCy="preserved-users-button-restore"
        >
          Restore
        </SecondaryButton>
      ),
    },
    {
      key: "stage",
      element: (
        <SecondaryButton
          isDisabled={
            !state.showTableRows || state.selectedElements.length === 0
          }
          onClickHandler={onStageHandler}
          dataCy="preserved-users-button-stage"
        >
          Stage
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
      pageTitle="Preserved users"
      batchError={userDataResponse.error}
      onRefresh={refreshData}
      onDeleteClick={onDeleteHandler}
      extraToolbarItems={extraToolbarItems}
      contextualPanelPage="preserved-users"
      renderTable={(s) => (
        <UsersTable
          shownElementsList={s.elementsList}
          from="preserved-users"
          showTableRows={s.showTableRows}
          usersData={usersTableData}
          buttonsData={usersTableButtonsData}
          paginationData={s.selectedPerPageData}
          searchValue={s.searchValue}
        />
      )}
    >
      <DeleteUsers
        show={showDeleteModal}
        from="preserved-users"
        handleModalToggle={onDeleteModalToggle}
        selectedUsersData={selectedUsersData}
        buttonsData={state.deleteButtonsData}
        onRefresh={refreshData}
      />
      <RestorePreservedUsers
        show={showRestoreModal}
        handleModalToggle={onRestoreModalToggle}
        selectedUsers={state.selectedElements}
        clearSelectedUsers={state.clearSelectedElements}
        onSuccess={refreshData}
      />
      <StagePreservedUsers
        show={showStageModal}
        handleModalToggle={onStageModalToggle}
        selectedUsers={state.selectedElements}
        clearSelectedUsers={state.clearSelectedElements}
        onSuccess={refreshData}
      />
    </GenericMainPage>
  );
};

export default PreservedUsers;
