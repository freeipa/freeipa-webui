// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useState } from "react";
// PatternFly
import {
  DropdownItem,
  Page,
  PageSection,
  PageSectionVariants,
  SearchInput,
  TextVariants,
  PaginationVariant,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
import {
  setIsDeleteButtonDisabled,
  setIsEnableButtonDisabled,
  setIsDisableButtonDisabled,
} from "src/store/shared/shared-slice";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
// Tables
import ActiveUsersTable from "./tables/ActiveUsersTable";
// Components
import PaginationPrep from "src/components/PaginationPrep";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Modals
import AddUser from "../../components/modals/AddUser";
import DeleteUsers from "../../components/modals/DeleteUsers";
import DisableEnableUsers from "../../components/modals/DisableEnableUsers";
// Utils
import { isUserSelectable } from "src/utils/utils";

const ActiveUsers = () => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Get shared variables (Redux)
  const isDeleteButtonDisabled = useAppSelector(
    (state) => state.shared.isDeleteButtonDisabled
  );
  const isEnableButtonDisabled = useAppSelector(
    (state) => state.shared.isEnableButtonDisabled
  );
  const isDisableButtonDisabled = useAppSelector(
    (state) => state.shared.isDisableButtonDisabled
  );

  // Initialize active users list (Redux)
  const activeUsersList = useAppSelector((state) => state.users.usersList);

  // Pagination
  const [page, setPage] = useState<number>(1);

  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const [perPage, setPerPage] = useState<number>(15);

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Users displayed on the first page
  const [shownUsersList, setShownUsersList] = useState(
    activeUsersList.slice(0, perPage)
  );

  const updateShownUsersList = (newShownUsersList: User[]) => {
    setShownUsersList(newShownUsersList);
  };

  // Dropdown kebab
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem key="action" component="button">
      Rebuild auto membership
    </DropdownItem>,
  ];

  const onKebabToggle = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    isOpen: boolean
  ) => {
    setKebabIsOpen(isOpen);
  };

  const onDropdownSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event?: React.SyntheticEvent<HTMLDivElement, Event> | undefined
  ) => {
    setKebabIsOpen(!kebabIsOpen);
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEnableDisableModal, setShowEnableDisableModal] = useState(false);
  const [enableDisableOptionSelected, setEnableDisableOptionSelected] =
    useState("");
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

  const onEnableDisableHandler = (optionClicked: string) => {
    dispatch(setIsDeleteButtonDisabled(true)); // prevents 'Delete' button to be enabled
    dispatch(setIsEnableButtonDisabled(true)); // prevents 'Enable' button to be enabled
    dispatch(setIsDisableButtonDisabled(true)); // prevents 'Disable' button to be enabled
    setEnableDisableOptionSelected(optionClicked);
    setShowEnableDisableModal(true);
  };

  const onEnableDisableModalToggle = () => {
    setIsEnableButtonDisabled(true); // prevents 'Enable' button to be enabled
    setIsDisableButtonDisabled(true); // prevents 'Disable' button to be enabled
    setShowEnableDisableModal(!showEnableDisableModal);
  };

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableUsersTable = activeUsersList.filter(isUserSelectable); // elements per Table

  // - Selected rows are tracked. Primary key: userLogin
  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);

  const changeSelectedUserNames = (selectedUsernames: string[]) => {
    setSelectedUserNames(selectedUsernames);
  };

  // - Helper method to set the selected users from the table
  const setUserSelected = (user: User, isSelecting = true) =>
    setSelectedUserNames((prevSelected) => {
      const otherSelectedUserNames = prevSelected.filter(
        (r) => r !== user.userLogin
      );
      return isSelecting && isUserSelectable(user)
        ? [...otherSelectedUserNames, user.userLogin]
        : otherSelectedUserNames;
    });

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={activeUsersList}
          shownElementsList={shownUsersList}
          selectedUserNames={selectedUserNames}
          changeSelectedUserNames={changeSelectedUserNames}
          selectableUsersTable={selectableUsersTable}
          isUserSelectable={isUserSelectable}
        />
      ),
    },
    {
      key: 1,
      element: <SearchInput aria-label="Search user" placeholder="Search" />,
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
        <SecondaryButton
          isDisabled={isDisableButtonDisabled}
          onClickHandler={() => onEnableDisableHandler("disable")}
        >
          Disable
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      element: (
        <SecondaryButton
          isDisabled={isEnableButtonDisabled}
          onClickHandler={() => onEnableDisableHandler("enable")}
        >
          Enable
        </SecondaryButton>
      ),
    },
    {
      key: 8,
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
      key: 9,
      toolbarItemVariant: "separator",
    },
    {
      key: 10,
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
      key: 11,
      element: (
        <PaginationPrep
          list={activeUsersList}
          perPage={perPage}
          page={page}
          updatePage={updatePage}
          updatePerPage={updatePerPage}
          updateShownUsersList={updateShownUsersList}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  // Render 'Active users'
  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout
          id="active users title"
          headingLevel="h1"
          text="Active users"
        />
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
        <div style={{ height: `calc(100vh - 352.2px)` }}>
          <OuterScrollContainer>
            <InnerScrollContainer>
              <ActiveUsersTable
                elementsList={activeUsersList}
                shownElementsList={shownUsersList}
                isUserSelectable={isUserSelectable}
                selectedUserNames={selectedUserNames}
                changeSelectedUserNames={changeSelectedUserNames}
                selectableUsers={selectableUsersTable}
                setUserSelected={setUserSelected}
              />
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationPrep
          list={activeUsersList}
          page={page}
          perPage={perPage}
          updatePage={updatePage}
          updatePerPage={updatePerPage}
          updateShownUsersList={updateShownUsersList}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          perPageComponent="button"
          className="pf-u-pb-0 pf-u-pr-md"
        />
      </PageSection>
      <AddUser show={showAddModal} handleModalToggle={onAddModalToggle} />
      <DeleteUsers
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
      />
      <DisableEnableUsers
        show={showEnableDisableModal}
        handleModalToggle={onEnableDisableModalToggle}
        optionSelected={enableDisableOptionSelected}
      />
    </Page>
  );
};

export default ActiveUsers;
