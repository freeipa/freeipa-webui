import React, { useState } from "react";
// PatternFly
import {
  Button,
  DropdownItem,
  Content,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import UsersTable from "../../components/tables/UsersTable";
// Modals
import AddUser from "src/components/modals/UserModals/AddUser";
import DeleteUsers from "src/components/modals/UserModals/DeleteUsers";
import DisableEnableUsers from "src/components/modals/UserModals/DisableEnableUsers";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Utils
import { API_VERSION_BACKUP, isUserSelectable } from "src/utils/utils";
// RPC
import { GenericPayload } from "src/services/rpc";
import {
  useGettingActiveUserQuery,
  useAutoMemberRebuildUsersMutation,
} from "src/services/rpcUsers";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Generic main page
import {
  useMainPageState,
  useDataResponseEffect,
  GenericMainPage,
} from "src/components/GenericMainPage";

const ActiveUsers = () => {
  // Common state via generic hook
  const state = useMainPageState<User>({
    pathname: "active-users",
    searchEntryType: "user",
    nameAttr: "uid",
    getKeyValue: (user) => user.uid[0],
    isSelectable: isUserSelectable,
  });

  const [executeAutoMemberRebuild] = useAutoMemberRebuildUsersMutation();

  const userDataResponse = useGettingActiveUserQuery({
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
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] =
    useState<boolean>(true);

  const updateIsEnableButtonDisabled = (value: boolean) => {
    setIsEnableButtonDisabled(value);
  };

  const [isDisableButtonDisabled, setIsDisableButtonDisabled] =
    useState<boolean>(true);

  const updateIsDisableButtonDisabled = (value: boolean) => {
    setIsDisableButtonDisabled(value);
  };

  // If some entries' status has been updated, unselect selected rows
  const [isDisableEnableOp, setIsDisableEnableOp] = useState(false);

  const updateIsDisableEnableOp = (value: boolean) => {
    setIsDisableEnableOp(value);
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEnableDisableModal, setShowEnableDisableModal] = useState(false);
  const [enableDisableOptionSelected, setEnableDisableOptionSelected] =
    useState(false);

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

  const onOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const onDeleteModalToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const onEnableDisableHandler = (optionClicked: boolean) => {
    state.updateIsDeleteButtonDisabled(true);
    setIsEnableButtonDisabled(true);
    setIsDisableButtonDisabled(true);
    setEnableDisableOptionSelected(optionClicked);
    setShowEnableDisableModal(true);
  };

  const onEnableDisableModalToggle = () => {
    setIsEnableButtonDisabled(true);
    setIsDisableButtonDisabled(true);
    setShowEnableDisableModal(!showEnableDisableModal);
  };

  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  const onRebuildAutoMembership = () => {
    // Task can potentially run for a very long time, give feed back that we
    // at least started the task
    state.dispatch(
      addAlert({
        name: "rebuild-automember-start",
        title:
          "Starting automember rebuild membership task (this may take a long time to complete) ...",
        variant: "info",
      })
    );

    // Prepare payload
    const userList = state.selectedElements.map((user) => user.uid[0]);

    executeAutoMemberRebuild(userList).then((result) => {
      if ("data" in result) {
        const automemberError = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (automemberError) {
          // alert: error
          let error: string | undefined = "";
          if ("error" in automemberError) {
            error = automemberError.error;
          } else if ("message" in automemberError) {
            error = automemberError.message;
          }

          state.dispatch(
            addAlert({
              name: "rebuild-automember-error",
              title: error || "Error when rebuilding membership",
              variant: "danger",
            })
          );
        } else {
          // alert: success
          state.dispatch(
            addAlert({
              name: "rebuild-automember-success",
              title: "Automember rebuild membership task completed",
              variant: "success",
            })
          );
        }
        // Hide modal
        setIsMembershipModalOpen(!isMembershipModalOpen);
      }
    });
  };

  // 'Rebuild auto membership' modal
  const membershipModalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key="rebuild-auto-membership"
      variant="primary"
      onClick={onRebuildAutoMembership}
      form="rebuild-auto-membership-modal"
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-rebuild-auto-membership"
      variant="link"
      onClick={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
    >
      Cancel
    </Button>,
  ];

  // 'Rebuild auto membership' modal fields: Confirmation question
  const confirmationQuestion = [
    {
      id: "question-text",
      pfComponent: (
        <Content component="p">
          <b>Warning</b> In case of a high number of users, hosts or groups, the
          rebuild task may require high CPU usage. This can severely impact
          server performance. Typically this only needs to be done once after
          importing raw data into the server. Are you sure you want to rebuild
          the auto memberships?
        </Content>
      ),
    },
  ];

  // Dropdown kebab
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem
      data-cy="active-users-kebab-rebuild-auto-membership"
      key="action"
      component="button"
      onClick={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
    >
      Rebuild auto membership
    </DropdownItem>,
  ];

  const onKebabToggle = () => {
    setKebabIsOpen(!kebabIsOpen);
  };

  const onDropdownSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    setKebabIsOpen(!kebabIsOpen);
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
    updateIsEnableButtonDisabled,
    updateIsDisableButtonDisabled,
    isDeletion: state.isDeletion,
    updateIsDeletion: state.updateIsDeletion,
    isDisableEnableOp,
    updateIsDisableEnableOp,
  };

  const disableEnableButtonsData = {
    updateIsEnableButtonDisabled,
    updateIsDisableButtonDisabled,
    updateIsDisableEnableOp,
  };

  // Toolbar items
  const extraToolbarItems: ToolbarItem[] = [
    {
      key: "disable",
      element: (
        <SecondaryButton
          dataCy="active-users-button-disable"
          isDisabled={isDisableButtonDisabled || !state.showTableRows}
          onClickHandler={() => onEnableDisableHandler(true)}
        >
          Disable
        </SecondaryButton>
      ),
    },
    {
      key: "enable",
      element: (
        <SecondaryButton
          dataCy="active-users-button-enable"
          isDisabled={isEnableButtonDisabled || !state.showTableRows}
          onClickHandler={() => onEnableDisableHandler(false)}
        >
          Enable
        </SecondaryButton>
      ),
    },
    {
      key: "kebab",
      element: (
        <KebabLayout
          dataCy="active-users-kebab"
          onDropdownSelect={onDropdownSelect}
          onKebabToggle={onKebabToggle}
          idKebab="main-dropdown-kebab"
          isKebabOpen={kebabIsOpen}
          dropdownItems={state.showTableRows ? dropdownItems : []}
          isDisabled={!state.showTableRows}
        />
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
      pageTitle="Active Users"
      batchError={userDataResponse.error}
      onRefresh={refreshData}
      onAddClick={onAddClickHandler}
      onDeleteClick={onDeleteHandler}
      extraToolbarItems={extraToolbarItems}
      contextualPanelPage="active-users"
      renderTable={(s) => (
        <UsersTable
          shownElementsList={s.elementsList}
          from="active-users"
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
        from="active-users"
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshData}
      />
      <DeleteUsers
        show={showDeleteModal}
        from="active-users"
        handleModalToggle={onDeleteModalToggle}
        selectedUsersData={selectedUsersData}
        buttonsData={state.deleteButtonsData}
        onRefresh={refreshData}
        onCloseDeleteModal={onCloseDeleteModal}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <DisableEnableUsers
        show={showEnableDisableModal}
        from="active-users"
        handleModalToggle={onEnableDisableModalToggle}
        optionSelected={enableDisableOptionSelected}
        selectedUsersData={selectedUsersData}
        buttonsData={disableEnableButtonsData}
        onRefresh={refreshData}
      />
      {isMembershipModalOpen && (
        <ModalWithFormLayout
          dataCy="rebuild-auto-membership-modal"
          variantType="medium"
          modalPosition="top"
          offPosition="76px"
          title="Confirmation"
          formId="rebuild-auto-membership-modal"
          fields={confirmationQuestion}
          show={isMembershipModalOpen}
          onClose={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
          actions={membershipModalActions}
        />
      )}
    </GenericMainPage>
  );
};

export default ActiveUsers;
