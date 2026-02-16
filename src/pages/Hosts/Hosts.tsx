import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Content,
  DropdownItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// Layouts
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import HostsTable from "./HostsTable";
// Modal
import AddHost from "src/components/modals/HostModals/AddHost";
import DeleteHosts from "src/components/modals/HostModals/DeleteHosts";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isHostSelectable } from "src/utils/utils";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// RPC client
import { GenericPayload } from "../../services/rpc";
import {
  useGettingHostQuery,
  useAutoMemberRebuildHostsMutation,
} from "../../services/rpcHosts";
// Generic main page
import {
  useMainPageState,
  useDataResponseEffect,
  GenericMainPage,
} from "src/components/GenericMainPage";

const Hosts = () => {
  const dispatch = useAppDispatch();

  // Common state via generic hook
  const state = useMainPageState<Host>({
    pathname: "hosts",
    searchEntryType: "host",
    nameAttr: "fqdn",
    getKeyValue: (host) => host.fqdn[0],
    isSelectable: isHostSelectable,
  });

  // Define 'executeCommand' to execute simple commands (via Mutation)
  const [executeAutoMemberRebuild] = useAutoMemberRebuildHostsMutation();

  // Button disabled due to error
  const [isDisabledDueError, setIsDisabledDueError] = useState<boolean>(false);

  // Derived states - what we get from API
  const hostDataResponse = useGettingHostQuery({
    searchValue: state.searchValue,
    sizeLimit: 0,
    apiVersion: state.apiVersion || API_VERSION_BACKUP,
    startIdx: state.firstIdx,
    stopIdx: state.lastIdx,
  } as GenericPayload);

  // Connect query response to state
  useDataResponseEffect(hostDataResponse, state);

  // Reset isDisabledDueError when fetching
  useEffect(() => {
    if (hostDataResponse.isFetching) {
      setIsDisabledDueError(false);
    }
  }, [hostDataResponse.isFetching]);

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  useEffect(() => {
    hostDataResponse.refetch();
  }, []);

  // Refresh handler
  const refreshData = () => state.refreshData(() => hostDataResponse.refetch());

  // -- Page-specific state --

  // Dropdown kebab
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  // [API call] 'Rebuild auto membership'
  // TODO: Move this into a separate component
  const onRebuildAutoMembership = () => {
    // Task can potentially run for a very long time, give feed back that we
    // at least started the task
    dispatch(
      addAlert({
        name: "rebuild-automember-start",
        title:
          "Starting automember rebuild membership task (this may take a long " +
          "time to complete) ...",
        variant: "info",
      })
    );
    executeAutoMemberRebuild(state.selectedElements).then((result) => {
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

          dispatch(
            addAlert({
              name: "rebuild-automember-error",
              title: error || "Error when rebuilding membership",
              variant: "danger",
            })
          );
        } else {
          // alert: success
          dispatch(
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
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

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

  const dropdownItems = [
    <DropdownItem
      data-cy="hosts-kebab-rebuild-auto-membership"
      key="rebuild auto membership"
      component="button"
      onClick={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
    >
      Rebuild auto membership
    </DropdownItem>,
  ];

  const onKebabToggle = () => {
    setKebabIsOpen(!kebabIsOpen);
  };

  const onFocus = () => {
    const element = document.getElementById("main-dropdown-kebab");
    element?.focus();
  };

  const onDropdownSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    setKebabIsOpen(!kebabIsOpen);
    onFocus();
  };

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

  // -- Data wrappers for child components --

  const selectedHostsData = {
    selectedHosts: state.selectedElements,
    clearSelectedHosts: state.clearSelectedElements,
  };

  const hostsTableData = {
    isHostSelectable,
    selectedHosts: state.selectedElements,
    selectableHostsTable: state.selectableElements,
    setHostSelected: state.setElementSelected,
    clearSelectedHosts: state.clearSelectedElements,
  };

  const hostsTableButtonsData = {
    updateIsDeleteButtonDisabled: state.updateIsDeleteButtonDisabled,
    isDeletion: state.isDeletion,
    updateIsDeletion: state.updateIsDeletion,
  };

  // Extra toolbar items: Kebab, Separator, Help, Pagination
  const extraToolbarItems: ToolbarItem[] = [
    {
      key: "kebab",
      element: (
        <KebabLayout
          onDropdownSelect={onDropdownSelect}
          onKebabToggle={onKebabToggle}
          idKebab="main-dropdown-kebab"
          isKebabOpen={kebabIsOpen}
          dropdownItems={!state.showTableRows ? [] : dropdownItems}
          dataCy="hosts-kebab"
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
      pageTitle="Hosts"
      batchError={hostDataResponse.error}
      onRefresh={refreshData}
      onAddClick={onAddClickHandler}
      onDeleteClick={onDeleteHandler}
      extraToolbarItems={extraToolbarItems}
      contextualPanelPage="hosts"
      isAddDisabledDueError={isDisabledDueError}
      renderTable={(s) => (
        <HostsTable
          elementsList={s.elementsList}
          shownElementsList={s.elementsList}
          showTableRows={s.showTableRows}
          hostsData={hostsTableData}
          buttonsData={hostsTableButtonsData}
          paginationData={s.selectedPerPageData}
          searchValue={s.searchValue}
        />
      )}
    >
      {isMembershipModalOpen && (
        <ModalWithFormLayout
          variantType="medium"
          modalPosition="top"
          offPosition="76px"
          title="Confirmation"
          formId="rebuild-auto-membership-modal"
          fields={confirmationQuestion}
          show={isMembershipModalOpen}
          onClose={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
          actions={membershipModalActions}
          dataCy="hosts-rebuild-auto-membership-modal"
        />
      )}
      <AddHost
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshData}
      />
      <DeleteHosts
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedHostsData={selectedHostsData}
        buttonsData={state.deleteButtonsData}
        onRefresh={refreshData}
      />
    </GenericMainPage>
  );
};

export default Hosts;
