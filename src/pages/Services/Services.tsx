import React, { useEffect, useState } from "react";
// PatternFly
import {
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
import TitleLayout from "../../components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "../../components/layouts/ToolbarLayout";
import SearchInputLayout from "../../components/layouts/SearchInputLayout";
import SecondaryButton from "../../components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "../../components/layouts/HelpTextWithIconLayout";
// Components
import BulkSelectorServicesPrep from "../../components/BulkSelectorServicesPrep";
import PaginationLayout from "../../components/layouts/PaginationLayout";
// Tables
import ServicesTable from "./ServicesTable";
// Redux
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateServicesList } from "../../store/Identity/services-slice";
// Data types
import { Host, Service } from "../../utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isServiceSelectable } from "../../utils/utils";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Modals
import AddService from "../../components/modals/AddService";
import DeleteServices from "../../components/modals/DeleteServices";
// Hooks
import { useAlerts } from "../../hooks/useAlerts";
// Errors
import useApiError from "../../hooks/useApiError";
import GlobalErrors from "../../components/errors/GlobalErrors";
import ModalErrors from "../../components/errors/ModalErrors";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// RPC client
import {
  useGetHostsListQuery,
  useGettingServicesQuery,
  useSearchEntriesMutation,
  GenericPayload,
} from "../../services/rpc";

const Services = () => {
  // Initialize services list (Redux)
  const [servicesList, setServicesList] = useState<Service[]>([]);

  // Dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // Selected services state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const updateSelectedServices = (newSelectedServices: string[]) => {
    setSelectedServices(newSelectedServices);
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);
  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selectedServices list
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

  // Pagination
  const [page, setPage] = useState<number>(1);
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const [perPage, setPerPage] = useState<number>(10);
  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };
  const [totalCount, setServicesTotalCount] = useState<number>(0);

  // Page indexes
  const firstServiceIdx = (page - 1) * perPage;
  const lastServiceIdx = page * perPage;

  // Filter (Input search)
  const [searchValue, setSearchValue] = React.useState("");
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [retrieveServices] = useSearchEntriesMutation({});

  // Issue search with filter
  const submitSearchValue = () => {
    setShowTableRows(false);
    setServicesTotalCount(0);
    setSearchIsDisabled(true);
    retrieveServices({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstServiceIdx,
      stopIdx: lastServiceIdx,
      entryType: "service",
    } as GenericPayload).then((result) => {
      // Manage new response here
      if ("data" in result) {
        const searchError = result.data.error as
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
            error || "Error when searching for services",
            "danger"
          );
        } else {
          // Success
          const serviceListResult = result.data.result.results;
          const serviceListSize = result.data.result.count;
          const totalCount = result.data.result.totalCount;
          const serviceList: Service[] = [];

          for (let i = 0; i < serviceListSize; i++) {
            serviceList.push(serviceListResult[i].result);
          }

          // Update slice data
          dispatch(updateServicesList(serviceList));
          setServicesList(serviceList);
          setServicesTotalCount(totalCount);
          // Show table elements
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(false);

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

  // Get a list of the hosts
  const [hostsList, setHostsList] = useState<string[]>([]);
  const hostDataResponse = useGetHostsListQuery();

  useEffect(() => {
    if (hostDataResponse === undefined || hostDataResponse.isFetching) {
      return;
    }
    if (hostDataResponse.isSuccess && hostDataResponse.data) {
      const hostsListResult = hostDataResponse.data.result.result;
      const hostCount = hostDataResponse.data.result.count;
      const hosts: Host[] = [];
      for (let i = 0; i < hostCount; i++) {
        const hostObj = hostsListResult[i] as Host;
        hosts.push(hostObj);
      }
      setHostsList(hosts.map((hostName) => hostName.fqdn));
    }

    // API response: Error
    if (
      !hostDataResponse.isLoading &&
      hostDataResponse.isError &&
      hostDataResponse.error !== undefined
    ) {
      alerts.addAlert(
        "get-host-list-error",
        "Failed to get host list",
        "danger"
      );
    }
  }, [hostDataResponse]);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableServicesTable = servicesList.filter(isServiceSelectable); // elements per Table

  // - Selected rows are tracked. Primary key: service Id
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const changeSelectedServiceIds = (selectedServiceIds: string[]) => {
    setSelectedServiceIds(selectedServiceIds);
  };

  // Button disabled due to error
  const [isDisabledDueError, setIsDisabledDueError] = useState<boolean>(false);

  // - Helper method to set the selected services from the table
  const setServiceSelected = (service: Service, isSelecting = true) =>
    setSelectedServiceIds((prevSelected) => {
      const otherSelectedServiceIds = prevSelected.filter(
        (r) => r !== service.krbcanonicalname
      );
      return isSelecting && isServiceSelectable(service)
        ? [...otherSelectedServiceIds, service.krbcanonicalname]
        : otherSelectedServiceIds;
    });

  // Derived states - what we get from API
  const servicesDataResponse = useGettingServicesQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstServiceIdx,
    stopIdx: lastServiceIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = servicesDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (servicesDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected users on refresh
      setServicesTotalCount(0);
      setSelectedServices([]);
      setSelectedServiceIds([]);
      globalErrors.clear();
      setIsDisabledDueError(false);
      return;
    }

    // API response: Success
    if (
      servicesDataResponse.isSuccess &&
      servicesDataResponse.data &&
      batchResponse !== undefined
    ) {
      const servicesListResult = batchResponse.result.results;
      const servicesListSize = batchResponse.result.count;
      const totalCount = batchResponse.result.totalCount;
      const servicesList: Service[] = [];

      for (let i = 0; i < servicesListSize; i++) {
        servicesList.push(servicesListResult[i].result);
      }

      // Update slice data
      dispatch(updateServicesList(servicesList));
      setServicesList(servicesList);
      setServicesTotalCount(totalCount);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !servicesDataResponse.isLoading &&
      servicesDataResponse.isError &&
      servicesDataResponse.error !== undefined
    ) {
      setIsDisabledDueError(true);
      globalErrors.addError(
        batchError,
        "Error when loading data",
        "error-batch-hosts"
      );
    }
  }, [servicesDataResponse]);

  // Show table rows only when data is fully retrieved
  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  // Refresh button handling
  const refreshServicesData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected hosts on refresh
    setServicesTotalCount(0);
    setSelectedServices([]);
    setSelectedServiceIds([]);

    servicesDataResponse.refetch();
  };

  // Data wrappers
  // - 'SearchInputLayout'
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // - 'BulkSelectorPrep'
  const servicesData = {
    selectedServices,
    updateSelectedServices,
    changeSelectedServiceIds,
    selectableServicesTable,
    isServiceSelectable,
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: setHostsList,
    totalCount,
  };

  // - 'ServicesTable'
  const servicesTableData = {
    isServiceSelectable,
    selectedServiceIds,
    changeSelectedServiceIds,
    selectableServicesTable,
    setServiceSelected,
    updateSelectedServices,
  };

  const servicesTableButtonsData = {
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
  };

  // - 'DeleteServices'
  const deleteElementsButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedElementsData = {
    selectedElements: selectedServices,
    updateSelectedElements: updateSelectedServices,
  };

  // List of toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorServicesPrep
          list={servicesList}
          shownElementsList={servicesList}
          elementData={servicesData}
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
          ariaLabel="Search services"
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
          onClickHandler={refreshServicesData}
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
          isDisabled={isDeleteButtonDisabled}
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
          isDisabled={!showTableRows || isDisabledDueError}
          onClickHandler={onAddClickHandler}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      toolbarItemVariant: "separator",
    },
    {
      key: 7,
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
      key: 8,
      element: (
        <PaginationLayout
          list={servicesList}
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
    <Page>
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout id="Services title" headingLevel="h1" text="Services" />
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
                <ServicesTable
                  elementsList={servicesList}
                  shownElementsList={servicesList}
                  showTableRows={showTableRows}
                  servicesData={servicesTableData}
                  buttonsData={servicesTableButtonsData}
                  paginationData={selectedPerPageData}
                  searchValue={searchValue}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={servicesList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <ModalErrors errors={modalErrors.getAll()} />
      <AddService
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshServicesData}
        hostsList={hostsList}
      />
      <DeleteServices
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedServicesData={selectedElementsData}
        buttonsData={deleteElementsButtonsData}
        onRefresh={refreshServicesData}
      />
    </Page>
  );
};

export default Services;
