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
import { HBACService } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";

import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import HBACServicesTable from "./HBACServicesTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Modals
import AddHBACService from "src/components/modals/HbacModals/AddHBACService";
import DeleteHBACService from "src/components/modals/HbacModals/DeleteHBACService";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { API_VERSION_BACKUP, isHbacServiceSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
// RPC client
import { GenericPayload } from "src/services/rpc";
import { useGettingHbacServicesQuery } from "src/services/rpcHBACServices";
// Errors
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const HBACServices = () => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("hbac-services");

  // Contextual help panel

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hbac-services" });

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [servicesList, setServicesList] = useState<HBACService[]>([]);

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // URL parameters: page number, page size, search value
  const { page, perPage, searchValue } = useListPageSearchParams();

  // Main states - what user can define / what we could use in page URL
  const [totalCount, setServicesTotalCount] = useState<number>(0);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // Derived states - what we get from API
  const servicesDataResponse = useGettingHbacServicesQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isFetching: isBatchFetching,
    error: batchError,
  } = servicesDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (servicesDataResponse.isFetching) {
      // Reset selected users on refresh
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
      const servicesList: HBACService[] = [];

      for (let i = 0; i < servicesListSize; i++) {
        servicesList.push(servicesListResult[i].result);
      }

      setServicesTotalCount(totalCount);
      // Update the list
      setServicesList(servicesList);
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
    // Reset selected users on refresh
    setServicesTotalCount(0);
    clearSelectedServices();

    servicesDataResponse.refetch();
  };

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

  const [selectedServices, setSelectedServices] = useState<HBACService[]>([]);

  const clearSelectedServices = () => {
    const emptyList: HBACService[] = [];
    setSelectedServices(emptyList);
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

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableServicesTable = servicesList.filter(isHbacServiceSelectable); // elements per Table

  const updateSelectedServices = (
    services: HBACService[],
    isSelected: boolean
  ) => {
    let newSelectedServices: HBACService[] = [];
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
        // Add rule to list
        newSelectedServices.push(services[i]);
      }
    } else {
      // Remove entry
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
  const setServicesSelected = (service: HBACService, isSelecting = true) => {
    if (isHbacServiceSelectable(service)) {
      updateSelectedServices([service], isSelecting);
    }
  };

  // Data wrappers
  // TODO: Better separation of concerts
  // - 'BulkSelectorHBACServicesPrep'
  const rulesBulkSelectorData = {
    selected: selectedServices,
    updateSelected: updateSelectedServices,
    selectableTable: selectableServicesTable,
    nameAttr: "cn",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = getSelectedPerPageData(
    servicesList,
    selectedServices.map((item) => ipaPrimaryKey(item.cn)),
    (item) => ipaPrimaryKey(item.cn)
  );

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
    isHbacServiceSelectable,
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

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={servicesList}
          shownElementsList={servicesList}
          elementData={rulesBulkSelectorData}
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
          ariaLabel="Search HBAC services"
          placeholder="Search HBAC services"
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
          isDisabled={isBatchFetching}
          dataCy="hbac-services-button-refresh"
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || isBatchFetching}
          onClickHandler={onDeleteHandler}
          dataCy="hbac-services-button-delete"
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
          isDisabled={isBatchFetching}
          dataCy="hbac-services-button-add"
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
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={() => dispatch(toggleHelpPanel())}
        />
      ),
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={servicesList}
          totalCount={totalCount}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <>
      <div>
        <PageSection hasBodyWrapper={false}>
          <TitleLayout
            id="hbacservices title"
            headingLevel="h1"
            text="HBAC services"
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
                    <HBACServicesTable
                      shownElementsList={servicesList}
                      showTableRows={!isBatchFetching}
                      servicesData={servicesTableData}
                      buttonsData={servicesTableButtonsData}
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
                list={servicesList}
                totalCount={totalCount}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
              />
            </FlexItem>
          </Flex>
        </PageSection>
        <AddHBACService
          show={showAddModal}
          handleModalToggle={onAddModalToggle}
          onOpenAddModal={onAddClickHandler}
          onCloseAddModal={onCloseAddModal}
          onRefresh={refreshServicesData}
        />
        <DeleteHBACService
          show={showDeleteModal}
          handleModalToggle={onDeleteModalToggle}
          selectedServicesData={selectedServicesData}
          buttonsData={deleteServicesButtonsData}
          onRefresh={refreshServicesData}
        />
        <ModalErrors
          errors={modalErrors.getAll()}
          dataCy="hbac-services-modal-error"
        />
      </div>
    </>
  );
};

export default HBACServices;
