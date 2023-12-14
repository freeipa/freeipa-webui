import React, { useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
  TextVariants,
} from "@patternfly/react-core";
import { DropdownItem } from "@patternfly/react-core/deprecated";
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
import KebabLayout from "src/components/layouts/KebabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
// Components
import BulkSelectorServicesPrep from "src/components/BulkSelectorServicesPrep";
import PaginationPrep from "src/components/PaginationPrep";
// Tables
import ServicesTable from "./ServicesTable";
// Redux
import { useAppSelector } from "src/store/hooks";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";
// Utils
import { isServiceSelectable } from "src/utils/utils";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Modals
import AddService from "src/components/modals/AddService";
import DeleteServices from "src/components/modals/DeleteServices";

const Services = () => {
  // Initialize services list (Redux)
  const servicesList = useAppSelector((state) => state.services.servicesList);

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

  const [perPage, setPerPage] = useState<number>(15);

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Services displayed on the first page
  const [shownServicesList, setShownServicesList] = useState(
    servicesList.slice(0, perPage)
  );

  const updateShownServicesList = (newShownServicesList: Service[]) => {
    setShownServicesList(newShownServicesList);
  };

  // Filter (Input search)
  const [searchValue, setSearchValue] = React.useState("");

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(false);

  const updateShowTableRows = (value: boolean) => {
    setShowTableRows(value);
  };

  // Refresh displayed elements every time elements list changes (from Redux or somewhere else)
  React.useEffect(() => {
    updatePage(1);
    if (showTableRows) updateShowTableRows(false);
    setTimeout(() => {
      updateShownServicesList(servicesList.slice(0, perPage));
      updateShowTableRows(true);
      // Reset 'selectedPerPage'
      updateSelectedPerPage(0);
    }, 1000);
  }, [servicesList]);

  // Dropdown kebab
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem key="rebuild auto membership" component="button">
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
    _event: React.SyntheticEvent<HTMLDivElement, Event> | undefined
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
  const selectableServicesTable = servicesList.filter(isServiceSelectable); // elements per Table

  // - Selected rows are tracked. Primary key: service Id
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const changeSelectedServiceIds = (selectedServiceIds: string[]) => {
    setSelectedServiceIds(selectedServiceIds);
  };

  // - Helper method to set the selected services from the table
  const setServiceSelected = (service: Service, isSelecting = true) =>
    setSelectedServiceIds((prevSelected) => {
      const otherSelectedServiceIds = prevSelected.filter(
        (r) => r !== service.id
      );
      return isSelecting && isServiceSelectable(service)
        ? [...otherSelectedServiceIds, service.id]
        : otherSelectedServiceIds;
    });

  // Data wrappers
  // - 'SearchInputLayout'
  const searchValueData = {
    searchValue,
    updateSearchValue,
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

  // - 'PaginationPrep'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    showTableRows,
    updateShowTableRows,
    updateSelectedPerPage,
    updateShownElementsList: updateShownServicesList,
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
          shownElementsList={shownServicesList}
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
      element: <SecondaryButton>Refresh</SecondaryButton>,
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
        <SecondaryButton onClickHandler={onAddClickHandler}>
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
          isPlain={true}
          dropdownItems={dropdownItems}
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
              <ServicesTable
                elementsList={servicesList}
                shownElementsList={shownServicesList}
                showTableRows={showTableRows}
                servicesData={servicesTableData}
                buttonsData={servicesTableButtonsData}
                paginationData={selectedPerPageData}
                searchValue={searchValue}
              />
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationPrep
          list={servicesList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          perPageComponent="button"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <AddService show={showAddModal} handleModalToggle={onAddModalToggle} />
      <DeleteServices
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedElementsData={selectedElementsData}
        buttonsData={deleteElementsButtonsData}
      />
    </Page>
  );
};

export default Services;
