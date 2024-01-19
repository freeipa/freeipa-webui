import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  DropdownItem,
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
  TextVariants,
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
import TextLayout from "src/components/layouts/TextLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
// Components
import BulkSelectorHostsPrep from "src/components/BulkSelectorHostsPrep";
import PaginationPrep from "src/components/PaginationPrep";
// Tables
import HostsTable from "./HostsTable";
// Modal
import AddHost from "src/components/modals/AddHost";
import DeleteHosts from "src/components/modals/DeleteHosts";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { updateHostsList } from "src/store/Identity/hosts-slice";
// Data types
import { Host, DNSZone } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isHostSelectable } from "src/utils/utils";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// RPC client
import {
  useGettingHostQuery,
  useGetDNSZonesQuery,
  useAutoMemberRebuildHostsMutation,
  HostsPayload,
} from "src/services/rpc";

const Hosts = () => {
  // Dispatch (Redux)
  const dispatch = useAppDispatch();

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
  const [searchValue, setSearchValue] = React.useState("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);
  const [dnsZones, setDNSZones] = useState<string[]>([]);
  const updateSelectedPerPage = (selected: number) => {
    setSelectedPerPage(selected);
  };
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  const updateSelectedHosts = (newSelectedHosts: string[]) => {
    setSelectedHosts(newSelectedHosts);
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

  // Hosts displayed on the first page
  const [shownHostsList, setShownHostsList] = useState(
    hostsList.slice(0, perPage)
  );

  const updateShownHostsList = (newShownHostsList: Host[]) => {
    setShownHostsList(newShownHostsList);
  };

  // Button disabled due to error
  const [isDisabledDueError, setIsDisabledDueError] = useState<boolean>(false);

  // Derived states - what we get from API
  const hostDataResponse = useGettingHostQuery({
    searchValue: "",
    sizelimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
  } as HostsPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = hostDataResponse;

  // Page indexes
  const firstHostIdx = (page - 1) * perPage;
  const lastHostIdx = page * perPage;

  // Handle data when the API call is finished
  useEffect(() => {
    if (hostDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected users on refresh
      setSelectedHosts([]);
      setSelectedHostIds([]);
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
      const hostsListSize = batchResponse.length;
      const hostsList: Host[] = [];
      for (let i = 0; i < hostsListSize; i++) {
        hostsList.push(batchResponse[i]);
      }

      // Update 'Hosts' slice data
      dispatch(updateHostsList(hostsList));
      setHostsList(hostsList);
      // Update the shown users list
      setShownHostsList(hostsList.slice(firstHostIdx, lastHostIdx));
      // Show table elements
      setShowTableRows(true);
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
        "Error when loading data",
        "error-batch-hosts"
      );
    }
  }, [hostDataResponse]);

  // Get dns zones
  const dnsZoneDataResponse = useGetDNSZonesQuery();

  // Handle data when the API call is finished
  useEffect(() => {
    if (dnsZoneDataResponse.isFetching) {
      return;
    }
    if (dnsZoneDataResponse.isSuccess && dnsZoneDataResponse.data) {
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
    setSelectedHosts([]);
    setSelectedHostIds([]);

    hostDataResponse.refetch();
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  // Show table rows only when data is fully retrieved
  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  const updateShowTableRows = (value: boolean) => {
    setShowTableRows(value);
  };

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
        const automemberError = result.data.error as
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
      key="rebuild-auto-membership"
      variant="primary"
      onClick={onRebuildAutoMembership}
      form="rebuild-auto-membership-modal"
    >
      OK
    </Button>,
    <Button
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
        <TextLayout component="p">
          <b>Warning</b> In case of a high number of users, hosts or groups, the
          rebuild task may require high CPU usage. This can severely impact
          server performance. Typically this only needs to be done once after
          importing raw data into the server. Are you sure you want to rebuild
          the auto memberships?
        </TextLayout>
      ),
    },
  ];

  const dropdownItems = [
    <DropdownItem
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

  // - Selected rows are tracked. Primary key: host Id
  const [selectedHostIds, setSelectedHostIds] = useState<string[]>([]);

  const changeSelectedHostIds = (selectedHostIds: string[]) => {
    setSelectedHostIds(selectedHostIds);
  };

  // - Helper method to set the selected hosts from the table
  const setHostSelected = (host: Host, isSelecting = true) =>
    setSelectedHostIds((prevSelected) => {
      const otherSelectedHostIds = prevSelected.filter((r) => r !== host.fqdn);
      return isSelecting && isHostSelectable(host)
        ? [...otherSelectedHostIds, host.fqdn]
        : otherSelectedHostIds;
    });

  // Data wrappers
  // - 'PaginationPrep'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    showTableRows,
    updateShowTableRows,
    updateSelectedPerPage,
    updateShownElementsList: updateShownHostsList,
  };

  // - 'BulkSelectorPrep'
  const hostsData = {
    selectedHosts,
    updateSelectedHosts,
    changeSelectedHostIds,
    selectableHostsTable,
    isHostSelectable,
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
    updateSelectedHosts,
  };

  // - 'HostsTable'
  const hostsTableData = {
    isHostSelectable,
    selectedHostIds,
    changeSelectedHostIds,
    selectableHostsTable,
    setHostSelected,
    updateSelectedHosts,
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
  };

  // List of toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorHostsPrep
          list={hostsList}
          shownElementsList={shownHostsList}
          elementData={hostsData}
          buttonsData={buttonsData}
          selectedPerPageData={selectedPerPageData}
        />
      ),
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          name="search"
          ariaLabel="Search hosts"
          placeholder="Search"
          searchValueData={searchValueData}
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
          onClickHandler={refreshHostsData}
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
          onClickHandler={onAddClickHandler}
          isDisabled={!showTableRows || isDisabledDueError}
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
        />
      ),
    },
    {
      key: 7,
      toolbarItemVariant: "separator",
    },
    {
      key: 8,
      element: (
        <HelpTextWithIconLayout
          textComponent={TextVariants.p}
          subTextComponent={TextVariants.a}
          subTextIsVisitedLink={true}
          textContent="Help"
          icon={
            <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
          }
        />
      ),
    },
    {
      key: 9,
      element: (
        <PaginationPrep
          list={hostsList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  return (
    <Page>
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout id="Hosts title" headingLevel="h1" text="Hosts" />
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg pf-v5-u-pb-md pf-v5-u-pl-0 pf-v5-u-pr-0"
      >
        <ToolbarLayout
          className="pf-v5-u-pt-0 pf-v5-u-pl-lg pf-v5-u-pr-md"
          contentClassName="pf-v5-u-p-0"
          toolbarItems={toolbarItems}
        />
        <div style={{ height: `calc(100vh - 350px)` }}>
          <OuterScrollContainer>
            <InnerScrollContainer>
              {batchError !== undefined && batchError ? (
                <GlobalErrors errors={globalErrors.getAll()} />
              ) : (
                <HostsTable
                  elementsList={hostsList}
                  shownElementsList={shownHostsList}
                  showTableRows={showTableRows}
                  hostsData={hostsTableData}
                  buttonsData={hostsTableButtonsData}
                  paginationData={selectedPerPageData}
                  searchValue={searchValue}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationPrep
          list={hostsList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          perPageComponent="button"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <ModalErrors errors={modalErrors.getAll()} />
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
    </Page>
  );
};

export default Hosts;
