import React, { useState } from "react";
// PatternFly
import {
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
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
// Components
import BulkSelectorHostsPrep from "src/components/BulkSelectorHostsPrep";
import PaginationHostsPrep from "src/components/PaginationHostsPrep";
// Tables
import HostsTable from "./HostsTable";
// Modal
import AddHost from "src/components/modals/AddHost";
import DeleteHosts from "src/components/modals/DeleteHosts";
// Redux
import { useAppSelector } from "src/store/hooks";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Utils
import { isHostSelectable } from "src/utils/utils";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";

const Hosts = () => {
  // Initialize hosts list (Redux)
  const hostsList = useAppSelector((state) => state.hosts.hostsList);

  // Selected hosts state
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);

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

  // Hosts displayed on the first page
  const [shownHostsList, setShownHostsList] = useState(
    hostsList.slice(0, perPage)
  );

  const updateShownHostsList = (newShownHostsList: Host[]) => {
    setShownHostsList(newShownHostsList);
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

  // Dropdown kebab
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem key="rebuild auto membership" component="button">
      Rebuild auto membership
    </DropdownItem>,
  ];

  const onKebabToggle = (isOpen: boolean) => {
    setKebabIsOpen(isOpen);
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
  const selectableHostsTable = hostsList.filter(isHostSelectable); // elements per Table

  // - Selected rows are tracked. Primary key: host Id
  const [selectedHostIds, setSelectedHostIds] = useState<string[]>([]);

  const changeSelectedHostIds = (selectedHostIds: string[]) => {
    setSelectedHostIds(selectedHostIds);
  };

  // - Helper method to set the selected hosts from the table
  const setHostSelected = (host: Host, isSelecting = true) =>
    setSelectedHostIds((prevSelected) => {
      const otherSelectedHostIds = prevSelected.filter((r) => r !== host.id);
      return isSelecting && isHostSelectable(host)
        ? [...otherSelectedHostIds, host.id]
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
    updateShownHostsList,
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
            <OutlinedQuestionCircleIcon className="pf-u-primary-color-100 pf-u-mr-sm" />
          }
        />
      ),
    },
    {
      key: 9,
      element: (
        <PaginationHostsPrep
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
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout id="Hosts title" headingLevel="h1" text="Hosts" />
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-u-m-lg pf-u-pb-md pf-u-pl-0 pf-u-pr-0"
      >
        <ToolbarLayout
          className="pf-u-pt-0 pf-u-pl-lg pf-u-pr-md"
          contentClassName="pf-u-p-0"
          toolbarItems={toolbarItems}
        />
        <div style={{ height: `calc(100vh - 350px)` }}>
          <OuterScrollContainer>
            <InnerScrollContainer>
              <HostsTable
                elementsList={hostsList}
                shownElementsList={shownHostsList}
                showTableRows={showTableRows}
                hostsData={hostsTableData}
                buttonsData={hostsTableButtonsData}
                paginationData={selectedPerPageData}
                searchValue={searchValue}
              />
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationHostsPrep
          list={hostsList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          perPageComponent="button"
          className="pf-u-pb-0 pf-u-pr-md"
        />
      </PageSection>
      <AddHost show={showAddModal} handleModalToggle={onAddModalToggle} />
      <DeleteHosts
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedHostsData={selectedHostsData}
        buttonsData={deleteHostsButtonsData}
      />
    </Page>
  );
};

export default Hosts;
