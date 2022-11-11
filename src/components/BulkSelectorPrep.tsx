// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { FormEvent, useEffect, useRef, useState } from "react";
// PatternFly
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
  MenuToggleCheckbox,
} from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import BulkSelectorLayout from "src/components/layouts/BulkSelectorLayout";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
import {
  setSelectedUsers,
  setIsDeleteButtonDisabled,
  setIsEnableButtonDisabled,
  setIsDisableButtonDisabled,
  setIsDisableEnableOp,
  setSelectedUserIds,
  setSelectedPerPage,
} from "src/store/shared/shared-slice";
// Utils
import { checkEqualStatus } from "src/utils/utils";

interface PropsToBulkSelectorPrep {
  list: User[];
  shownElementsList: User[];
  changeSelectedUserNames: (selectedUsernames: string[]) => void;
  selectableUsersTable: User[];
  selectedUserNames: string[];
  isUserSelectable: (user: User) => boolean;
}

const BulkSelectorPrep = (props: PropsToBulkSelectorPrep) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve shared variables (Redux)
  const selectedUsers = useAppSelector((state) => state.shared.selectedUsers);
  const selectedPerPage = useAppSelector(
    (state) => state.shared.selectedPerPage
  );

  // Table functionality (from parent component) to manage the bulk selector functionality
  // - Menu
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const toggleRefMenu = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRefMenu = useRef<HTMLDivElement>(null);

  const handleMenuKeys = (event: KeyboardEvent) => {
    if (!isOpenMenu) {
      return;
    }
    if (
      menuRef.current?.contains(event.target as Node) ||
      toggleRefMenu.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsOpenMenu(!isOpenMenu);
        toggleRefMenu.current?.focus();
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isOpenMenu && !menuRef.current?.contains(event.target as Node)) {
      setIsOpenMenu(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleMenuKeys);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpenMenu, menuRef]);

  // - When a bulk selector element is selected, it remains highlighted
  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    setIsOpenMenu(!isOpenMenu);
  };

  // - Selectable checkboxes on table (elements per page)
  const selectableUsersPage = props.shownElementsList.filter(
    props.isUserSelectable
  );

  // - Methods to manage the Bulk selector options
  // -- Unselect all items on the table
  const unselectAllItems = () => {
    dispatch(setSelectedUserIds([]));
    dispatch(setSelectedUsers([]));
    dispatch(setIsDeleteButtonDisabled(true));
    props.changeSelectedUserNames([]);
  };

  // - Helper method: Remove duplicates in a list
  const removeDuplicates = (usersList: string[]) => {
    return usersList.filter((user, index) => usersList.indexOf(user) === index);
  };

  // Select all users (Page)
  const selectAllUsersPage = (
    isSelecting = true,
    selectableUsersList: User[]
  ) => {
    props.changeSelectedUserNames(
      isSelecting ? selectableUsersList.map((r) => r.userLogin) : []
    );
    // Check if all selected users have the same status
    const firstStatus = selectableUsersList[0].status;
    const areAllStatusEqual = checkEqualStatus(
      firstStatus,
      selectableUsersList
    );
    if (areAllStatusEqual) {
      // Update selected users
      const userNamesArray: string[] = [];
      selectableUsersList.map((user) => {
        userNamesArray.push(user.userId);
      });
      dispatch(setSelectedUsers(userNamesArray));
      // Resetting 'isDisableEnableOp'
      dispatch(setIsDisableEnableOp(false));
      // Enable or disable buttons depending on the status
      if (firstStatus === "Enabled") {
        dispatch(setIsDisableButtonDisabled(false));
        dispatch(setIsEnableButtonDisabled(true));
      } else if (firstStatus === "Disabled") {
        dispatch(setIsDisableButtonDisabled(true));
        dispatch(setIsEnableButtonDisabled(false));
      }
    } else {
      dispatch(setIsDisableButtonDisabled(true));
      dispatch(setIsEnableButtonDisabled(true));
    }

    // Enable/disable 'Delete' button
    if (isSelecting) {
      let usersIdArray: string[] = [];

      // if all page selected, the original 'selectedUsers' data is preserved
      if (selectableUsersList.length < props.selectableUsersTable.length) {
        selectedUsers.map((user) => {
          usersIdArray.push(user);
        });
        selectableUsersList.map((user) => {
          usersIdArray.push(user.userId);
        });
      }
      // Correct duplicates (if any)
      usersIdArray = removeDuplicates(usersIdArray);
      dispatch(setSelectedUsers(usersIdArray));

      // Update data
      dispatch(setSelectedUserIds(usersIdArray));
      dispatch(setSelectedUsers(usersIdArray));
      props.changeSelectedUserNames(usersIdArray);
      // Enable delete button
      dispatch(setIsDeleteButtonDisabled(false));
      // Update the 'selectedPerPage' counter
      dispatch(setSelectedPerPage(selectableUsersList.length));
    } else {
      dispatch(setSelectedUserIds([]));
      dispatch(setSelectedUsers([]));
      props.changeSelectedUserNames([]);
      dispatch(setIsDeleteButtonDisabled(true));
      // Restore the 'selectedPerPage' counter
      dispatch(setSelectedPerPage(0));
    }
  };

  // Selects all users (Table)
  const selectAllUsersTable = (
    isSelecting = true,
    selectableUsersList: User[]
  ) => {
    props.changeSelectedUserNames(
      isSelecting ? selectableUsersList.map((r) => r.userLogin) : []
    );
    // Check if all users have the same status
    const firstStatus = selectableUsersList[0].status;
    const areAllStatusEqual = checkEqualStatus(
      firstStatus,
      selectableUsersList
    );
    if (areAllStatusEqual) {
      // Update selected users
      const userNamesArray: string[] = [];
      selectableUsersList.map((user) => {
        userNamesArray.push(user.userId);
      });
      dispatch(setSelectedUsers(userNamesArray));
      // Resetting 'isDisableEnableOp'
      dispatch(setIsDisableEnableOp(false));
      // Enable or disable buttons depending on the status
      if (firstStatus === "Enabled") {
        dispatch(setIsDisableButtonDisabled(false));
        dispatch(setIsEnableButtonDisabled(true));
      } else if (firstStatus === "Disabled") {
        dispatch(setIsDisableButtonDisabled(true));
        dispatch(setIsEnableButtonDisabled(false));
      }
    } else {
      dispatch(setIsDisableButtonDisabled(true));
      dispatch(setIsEnableButtonDisabled(true));
    }

    // Enable/disable 'Delete' button
    if (isSelecting) {
      const usersIdArray: string[] = [];
      selectableUsersList.map((user) => usersIdArray.push(user.userId));
      dispatch(setSelectedUserIds(usersIdArray));
      dispatch(setSelectedUsers(usersIdArray));
      dispatch(setIsDeleteButtonDisabled(false));
    } else {
      dispatch(setSelectedUserIds([]));
      dispatch(setSelectedUsers([]));
      dispatch(setIsDeleteButtonDisabled(true));
    }
  };

  // Helper method to manage the checkbox icon symbol
  // - All rows selected: true (full check)
  // - Some rows selected: null (-)
  // - None selected: false (empty)
  const areAllUsersSelected: boolean | null =
    props.selectedUserNames.length === props.selectableUsersTable.length
      ? true
      : props.selectedUserNames.length > 0
      ? null
      : false;

  // Menu toggle element with checkbox
  const toggle = (
    <MenuToggle
      ref={toggleRefMenu}
      onClick={onToggleClick}
      isExpanded={isOpenMenu}
      splitButtonOptions={{
        items: [
          <MenuToggleCheckbox
            id="split-button-checkbox-with-text-disabled-example"
            key="split-checkbox-with-text-disabled"
            aria-label="Select all"
            onChange={(
              isSelecting: boolean | undefined,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              event: FormEvent<HTMLInputElement>
            ) => selectAllUsersTable(isSelecting, props.selectableUsersTable)}
            isChecked={areAllUsersSelected}
          >
            {selectedUsers.length > 0 && (
              <p>{selectedUsers.length + " selected"}</p>
            )}
          </MenuToggleCheckbox>,
        ],
      }}
      aria-label="Menu toggle with checkbox split button and text"
    />
  );

  // Checks wether all the elements on the currect page have been selected or not
  const [currentPageAlreadySelected, setCurrentPageAlreadySelected] =
    useState(false);

  // The 'currectPageAlreadySelected' should be set when elements are selected
  useEffect(() => {
    const found = props.shownElementsList.every(
      (user) => selectedUsers.indexOf(user.userId) >= 0
    );

    if (found) {
      // All the elements on that page are been selected
      setCurrentPageAlreadySelected(true);
    } else {
      // The elements on that page are not been selected (yet)
      setCurrentPageAlreadySelected(false);
      // If there is no elements selected on the page yet, reset 'selectedPerPage'
      if (
        !props.shownElementsList.some(
          (user) => selectedUsers.indexOf(user.userId) >= 0
        )
      ) {
        dispatch(setSelectedPerPage(0));
      }
    }
  }, [selectedUsers.length, props.shownElementsList]);

  // Set the messages displayed in the 'Select page' option (bulk selector)
  const getSelectedElements = () => {
    let msg = "Select page (" + selectedUsers.length + " items)";
    const remainingElements = Math.min(
      selectedUsers.length + props.shownElementsList.length - selectedPerPage,
      props.list.length
    );

    if (
      props.list.length > selectedUsers.length &&
      !currentPageAlreadySelected
    ) {
      msg = "Select page (" + remainingElements + " items)";
    }

    return msg;
  };

  // Menu options
  const menuToolbar = (
    <Menu ref={menuRef} style={{ minWidth: "fit-content" }}>
      <MenuContent>
        <MenuList>
          <MenuItem itemId={0} onClick={unselectAllItems}>
            Select none (0 items)
          </MenuItem>
          <MenuItem
            itemId={1}
            onClick={() => selectAllUsersPage(true, selectableUsersPage)}
            // NOTE: The line below disables this BS option when all the page rows have been selected.
            // This can benefit the user experience as it provides extra context of the already selected elements.
            // isDisabled={currentPageAlreadySelected}
          >
            {getSelectedElements()}
          </MenuItem>
          <MenuItem
            itemId={2}
            onClick={() =>
              selectAllUsersTable(true, props.selectableUsersTable)
            }
          >
            Select all ({props.list.length} items)
          </MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  return (
    <BulkSelectorLayout
      menuKey="menu-all-active-users-table"
      containerRefMenu={containerRefMenu}
      toggle={toggle}
      menuToolbar={menuToolbar}
      appendTo={containerRefMenu.current || undefined}
      isOpenMenu={isOpenMenu}
      ariaLabel="Menu toggle with checkbox split button"
    />
  );
};

export default BulkSelectorPrep;
