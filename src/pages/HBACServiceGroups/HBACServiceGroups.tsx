import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { HBACServiceGroup } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Redux
import { useAppSelector } from "src/store/hooks";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import HBACServiceGroupsTable from "./HBACServiceGroupsTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Modals
import AddHBACServiceGroup from "src/components/modals/HbacModals/AddHBACServiceGroup";
import DeleteHBACServiceGroup from "src/components/modals/HbacModals/DeleteHBACServiceGroup";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Utils
import {
  API_VERSION_BACKUP,
  isHbacServiceGroupSelectable,
} from "src/utils/utils";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "src/services/rpc";
import { useGettingHbacServiceGroupQuery } from "src/services/rpcHBACSvcGroups";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const HBACServiceGroups = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "hbac-service-groups" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [servicesList, setServicesList] = useState<HBACServiceGroup[]>([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // Main states
  const [searchValue, setSearchValue] = React.useState("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalCount, setServicesTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // Derived states - what we get from API
  const servicesDataResponse = useGettingHbacServiceGroupQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
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
      setServicesTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      servicesDataResponse.isSuccess &&
      servicesDataResponse.data &&
      batchResponse !== undefined
    ) {
      const servicesListResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const servicesListSize = batchResponse.result.count;
      const servicesList: HBACServiceGroup[] = [];

      for (let i = 0; i < servicesListSize; i++) {
        servicesList.push(servicesListResult[i].result);
      }

      setServicesTotalCount(totalCount);
      // Update the list
      setServicesList(servicesList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !servicesDataResponse.isLoading &&
      servicesDataResponse.isError &&
      servicesDataResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [servicesDataResponse]);

  // Refresh button handling
  const refreshServicesData = () => {
    setShowTableRows(false);
    setServicesTotalCount(0);
    clearSelectedServices();
    servicesDataResponse.refetch();
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    servicesDataResponse.refetch();
  }, [page, perPage]);

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selectedRules list
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
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Services displayed on the first page
  const updateShownServicesList = (
    newShownServicesList: HBACServiceGroup[]
  ) => {
    setServicesList(newShownServicesList);
  };

  // Update search input value
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [selectedServices, setSelectedServices] = useState<HBACServiceGroup[]>(
    []
  );

  const clearSelectedServices = () => {
    const emptyList: HBACServiceGroup[] = [];
    setSelectedServices(emptyList);
  };

  const [retrieveServices] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    setServicesTotalCount(0);
    retrieveServices({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: "hbacsvcgroup",
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
            error || "Error when searching for HBAC service groups",
            "danger"
          );
        } else {
          // Success
          const servicesListResult = result.data?.result.results || [];
          const servicesListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const servicesList: HBACServiceGroup[] = [];

          for (let i = 0; i < servicesListSize; i++) {
            servicesList.push(servicesListResult[i].result);
          }
          setServicesTotalCount(totalCount);
          setServicesList(servicesList);
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

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

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableServicesTable = servicesList.filter(
    isHbacServiceGroupSelectable
  ); // elements per Table

  const updateSelectedServices = (
    services: HBACServiceGroup[],
    isSelected: boolean
  ) => {
    let newSelectedServices: HBACServiceGroup[] = [];
    if (isSelected) {
      newSelectedServices = JSON.parse(JSON.stringify(selectedServices));
      for (let i = 0; i < services.length; i++) {
        if (
          selectedServices.find(
            (selectedServices) => selectedServices.cn[0] === services[i].cn[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add to list
        newSelectedServices.push(services[i]);
      }
    } else {
      // Remove user
      for (let i = 0; i < selectedServices.length; i++) {
        let found = false;
        for (let ii = 0; ii < services.length; ii++) {
          if (selectedServices[i].cn[0] === services[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedServices.push(selectedServices[i]);
        }
      }
    }
    setSelectedServices(newSelectedServices);
    setIsDeleteButtonDisabled(newSelectedServices.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setServicesSelected = (
    service: HBACServiceGroup,
    isSelecting = true
  ) => {
    if (isHbacServiceGroupSelectable(service)) {
      updateSelectedServices([service], isSelecting);
    }
  };

  // Data wrappers
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownServicesList,
    totalCount,
  };

  // - 'BulkSelectorPrep'
  const svcGroupBulkSelectorData = {
    selected: selectedServices,
    updateSelected: updateSelectedServices,
    selectableTable: selectableServicesTable,
    nameAttr: "cn",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // 'DeleteServices'
  const deleteServicesButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedServicesData = {
    selectedServices,
    clearSelectedServices,
  };

  // 'ServicesTable'
  const servicesTableData = {
    isHbacServiceSelectable: isHbacServiceGroupSelectable,
    selectedServices,
    selectableServicesTable,
    setServicesSelected,
    clearSelectedServices,
  };

  const servicesTableButtonsData = {
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={servicesList}
          shownElementsList={servicesList}
          elementData={svcGroupBulkSelectorData}
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
          ariaLabel="Search services"
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
          onClickHandler={refreshServicesData}
          isDisabled={!showTableRows}
          dataCy="hbac-service-groups-button-refresh"
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
          dataCy="hbac-service-groups-button-delete"
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
          isDisabled={!showTableRows}
          dataCy="hbac-service-groups-button-add"
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 7,
      element: <HelpTextWithIconLayout textContent="Help" />,
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
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <div>
      <alerts.ManagedAlerts />
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="hbacservicegroups title"
          headingLevel="h1"
          text="HBAC service groups"
        />
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
                  <HBACServiceGroupsTable
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
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={servicesList}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddHBACServiceGroup
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshServicesData}
      />
      <DeleteHBACServiceGroup
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedServicesData={selectedServicesData}
        buttonsData={deleteServicesButtonsData}
        onRefresh={refreshServicesData}
      />
      <ModalErrors
        errors={modalErrors.getAll()}
        dataCy="hbac-service-groups-modal-error"
      />
    </div>
  );
};

export default HBACServiceGroups;
