import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Content,
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
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Components
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";
// Tables
import HostsTable from "./HostsTable";
// Modal
import AddHost from "src/components/modals/HostModals/AddHost";
import DeleteHosts from "src/components/modals/HostModals/DeleteHosts";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { updateHostsList } from "src/store/Identity/hosts-slice";
// Data types
import { Host, DNSZone } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isHostSelectable } from "src/utils/utils";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "../../services/rpc";
import {
  useGetDNSZonesQuery,
  useGettingHostQuery,
  useAutoMemberRebuildHostsMutation,
} from "../../services/rpcHosts";

const Hosts = () => {
  // Dispatch (Redux)
  const dispatch = useAppDispatch();

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "hosts" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Define 'executeCommand' to execute simple commands (via Mutation)
  const [executeAutoMemberRebuild] = useAutoMemberRebuildHostsMutation();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Initialize hosts list (Redux)
  const [hostsList, setHostsList] = useState<Host[]>([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // Table comps
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);
  const [totalCount, setHostsTotalCount] = useState<number>(0);
  const [dnsZones, setDNSZones] = useState<string[]>([]);
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

  // If some entries have been deleted, restore the selectedHosts list
  const [isDeletion, setIsDeletion] = useState(false);

  const updateIsDeletion = (value: boolean) => {
    setIsDeletion(value);
  };

  const updateShownHostsList = (newShownHostsList: Host[]) => {
    setHostsList(newShownHostsList);
  };

  // Button disabled due to error
  const [isDisabledDueError, setIsDisabledDueError] = useState<boolean>(false);

  // Page indexes
  const firstHostIdx = (page - 1) * perPage;
  const lastHostIdx = page * perPage;

  // Derived states - what we get from API
  const hostDataResponse = useGettingHostQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstHostIdx,
    stopIdx: lastHostIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = hostDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (hostDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected users on refresh
      setHostsTotalCount(0);
      globalErrors.clear();
      setIsDisabledDueError(false);
      return;
    }

    // API response: Success
    if (
      hostDataResponse.isSuccess &&
      hostDataResponse.data &&
      batchResponse !== undefined
    ) {
      const hostsListResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const hostsListSize = batchResponse.result.count;
      const hostsList: Host[] = [];

      for (let i = 0; i < hostsListSize; i++) {
        hostsList.push(hostsListResult[i].result);
      }

      // Update 'Hosts' slice data
      dispatch(updateHostsList(hostsList));
      setHostsList(hostsList);
      setHostsTotalCount(totalCount);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !hostDataResponse.isLoading &&
      hostDataResponse.isError &&
      hostDataResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [hostDataResponse]);

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  useEffect(() => {
    hostDataResponse.refetch();
  }, []);

  // Get dns zones
  const dnsZoneDataResponse = useGetDNSZonesQuery();

  // Handle data when the API call is finished
  useEffect(() => {
    if (dnsZoneDataResponse.isFetching) {
      return;
    }
    if (
      dnsZoneDataResponse.isSuccess &&
      dnsZoneDataResponse.data &&
      dnsZoneDataResponse.data.result
    ) {
      const dnsZoneListResult = dnsZoneDataResponse.data.result.result;
      const dnsZoneListSize = dnsZoneDataResponse.data.result.count;
      const dnsZones: string[] = [];
      for (let i = 0; i < dnsZoneListSize; i++) {
        const dnsZone = dnsZoneListResult[i] as DNSZone;
        dnsZones.push(dnsZone["idnsname"][0]["__dns_name__"]);
      }
      setDNSZones(dnsZones);
    }

    // API response: Error
    if (
      !hostDataResponse.isLoading &&
      hostDataResponse.isError &&
      hostDataResponse.error !== undefined
    ) {
      setIsDisabledDueError(true);
      globalErrors.addError(
        batchError,
        "Error when loading dns zones",
        "error-dns-zones"
      );
    }
  }, [dnsZoneDataResponse]);

  // Refresh button handling
  const refreshHostsData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected hosts on refresh
    setHostsTotalCount(0);
    clearSelectedHosts();

    hostDataResponse.refetch();
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [selectedHosts, setSelectedHostsList] = useState<Host[]>([]);
  const clearSelectedHosts = () => {
    const emptyList: Host[] = [];
    setSelectedHostsList(emptyList);
  };

  const [retrieveHost] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setHostsTotalCount(0);
    setSearchIsDisabled(true);
    retrieveHost({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstHostIdx,
      stopIdx: lastHostIdx,
      entryType: "host",
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
            error || "Error when searching for hosts",
            "danger"
          );
        } else {
          // Success
          const hostsListResult = result.data?.result.results || [];
          const hostsListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const hostsList: Host[] = [];

          for (let i = 0; i < hostsListSize; i++) {
            hostsList.push(hostsListResult[i].result);
          }

          // Update 'Hosts' slice data
          dispatch(updateHostsList(hostsList));
          setHostsList(hostsList);
          setHostsTotalCount(totalCount);
          // Show table elements
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  const updateSelectedHosts = (hosts: Host[], isSelected: boolean) => {
    let newSelectedHosts: Host[] = [];
    if (isSelected) {
      newSelectedHosts = JSON.parse(JSON.stringify(selectedHosts));
      for (let i = 0; i < hosts.length; i++) {
        if (
          selectedHosts.find(
            (selectedUser) => selectedUser.fqdn[0] === hosts[i].fqdn[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add user to list
        newSelectedHosts.push(hosts[i]);
      }
    } else {
      // Remove host
      for (let i = 0; i < selectedHosts.length; i++) {
        let found = false;
        for (let ii = 0; ii < hosts.length; ii++) {
          if (selectedHosts[i].fqdn[0] === hosts[ii].fqdn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedHosts.push(selectedHosts[i]);
        }
      }
    }
    setSelectedHostsList(newSelectedHosts);
    setIsDeleteButtonDisabled(newSelectedHosts.length === 0);
  };

  // - Helper method to set the selected users from the table
  const setHostSelected = (host: Host, isSelecting = true) => {
    if (isHostSelectable(host)) {
      updateSelectedHosts([host], isSelecting);
    }
  };

  // Show table rows only when data is fully retrieved
  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  // Dropdown kebab
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  // [API call] 'Rebuild auto membership'
  // TODO: Move this into a separate component
  const onRebuildAutoMembership = () => {
    // Task can potentially run for a very long time, give feed back that we
    // at least started the task
    alerts.addAlert(
      "rebuild-automember-start",
      "Starting automember rebuild membership task (this may take a long " +
        "time to complete) ...",
      "info"
    );
    executeAutoMemberRebuild(selectedHosts).then((result) => {
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

          alerts.addAlert(
            "rebuild-automember-error",
            error || "Error when rebuilding membership",
            "danger"
          );
        } else {
          // alert: success
          alerts.addAlert(
            "rebuild-automember-success",
            "Automember rebuild membership task completed",
            "success"
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

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableHostsTable = hostsList.filter(isHostSelectable); // elements per Table

  // Data wrappers
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownHostsList,
    totalCount,
  };

  // - 'BulkSelectorPrep'
  const hostsBulkSelectorData = {
    selected: selectedHosts,
    updateSelected: updateSelectedHosts,
    selectableTable: selectableHostsTable,
    nameAttr: "fqdn",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // - 'DeleteHosts'
  const deleteHostsButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedHostsData = {
    selectedHosts,
    clearSelectedHosts,
  };

  // - 'HostsTable'
  const hostsTableData = {
    isHostSelectable,
    selectedHosts,
    selectableHostsTable,
    setHostSelected,
    clearSelectedHosts,
  };

  const hostsTableButtonsData = {
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

  // Contextual links panel
  const [isContextualPanelExpanded, setIsContextualPanelExpanded] =
    React.useState(false);

  const onOpenContextualPanel = () => {
    setIsContextualPanelExpanded(!isContextualPanelExpanded);
  };

  const onCloseContextualPanel = () => {
    setIsContextualPanelExpanded(false);
  };

  // List of toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={hostsList}
          shownElementsList={hostsList}
          elementData={hostsBulkSelectorData}
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
          ariaLabel="Search hosts"
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
          onClickHandler={refreshHostsData}
          isDisabled={!showTableRows}
          dataCy="hosts-button-refresh"
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          onClickHandler={onDeleteHandler}
          dataCy="hosts-button-delete"
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          onClickHandler={onAddClickHandler}
          isDisabled={!showTableRows || isDisabledDueError}
          dataCy="hosts-button-add"
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <KebabLayout
          onDropdownSelect={onDropdownSelect}
          onKebabToggle={onKebabToggle}
          idKebab="main-dropdown-kebab"
          isKebabOpen={kebabIsOpen}
          dropdownItems={!showTableRows ? [] : dropdownItems}
          dataCy="hosts-kebab"
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
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={onOpenContextualPanel}
        />
      ),
    },
    {
      key: 9,
      element: (
        <PaginationLayout
          list={hostsList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <ContextualHelpPanel
      fromPage="hosts"
      isExpanded={isContextualPanelExpanded}
      onClose={onCloseContextualPanel}
    >
      <div>
        <alerts.ManagedAlerts />
        <PageSection hasBodyWrapper={false}>
          <TitleLayout id="Hosts title" headingLevel="h1" text="Hosts" />
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
                    <HostsTable
                      elementsList={hostsList}
                      shownElementsList={hostsList}
                      showTableRows={showTableRows}
                      hostsData={hostsTableData}
                      buttonsData={hostsTableButtonsData}
                      paginationData={selectedPerPageData}
                      searchValue={searchValue}
                    />
                  )}
                </InnerScrollContainer>
              </OuterScrollContainer>
            </FlexItem>
            <FlexItem
              style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}
            >
              <PaginationLayout
                list={hostsList}
                paginationData={paginationData}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
              />
            </FlexItem>
          </Flex>
        </PageSection>
        <ModalErrors errors={modalErrors.getAll()} dataCy="hosts-modal-error" />
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
          dnsZones={dnsZones}
          onRefresh={refreshHostsData}
        />
        <DeleteHosts
          show={showDeleteModal}
          handleModalToggle={onDeleteModalToggle}
          selectedHostsData={selectedHostsData}
          buttonsData={deleteHostsButtonsData}
          onRefresh={refreshHostsData}
        />
      </div>
    </ContextualHelpPanel>
  );
};

export default Hosts;
