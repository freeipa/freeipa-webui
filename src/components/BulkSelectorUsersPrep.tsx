/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
// Utils
import { checkEqualStatus } from "src/utils/utils";

interface UsersData {
  selectedUsers: string[];
  updateSelectedUsers: (newSelectedUsers: string[]) => void;
  updateSelectedUserIds: (newSelectedUserIds: string[]) => void;
  selectedUserNames: string[];
  changeSelectedUserNames: (selectedUsernames: string[]) => void;
  selectableUsersTable: User[];
  isUserSelectable: (user: User) => boolean;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsEnableButtonDisabled?: (value: boolean) => void;
  updateIsDisableButtonDisabled?: (value: boolean) => void;
  updateIsDisableEnableOp?: (value: boolean) => void;
}

interface SelectedPerPageData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

interface PropsToBulkSelectorPrep {
  list: User[];
  shownElementsList: User[];
  usersData: UsersData;
  buttonsData: ButtonsData;
  selectedPerPageData: SelectedPerPageData;
}

const BulkSelectorPrep = (props: PropsToBulkSelectorPrep) => {
  // Table functionality (from parent component) to manage the bulk selector functionality
  // - Menu
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const toggleRefMenu = useRef<any>(null);
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
    props.usersData.isUserSelectable
  );

  // - Methods to manage the Bulk selector options
  // -- Unselect all items on the table
  const unselectAllItems = () => {
    props.usersData.updateSelectedUserIds([]);
    props.usersData.updateSelectedUsers([]);
    props.buttonsData.updateIsDeleteButtonDisabled(true);
    props.usersData.changeSelectedUserNames([]);
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
    props.usersData.changeSelectedUserNames(
      isSelecting ? selectableUsersList.map((r) => r.uid) : []
    );
    // Check if all selected users have the same status
    const firstStatus = selectableUsersList[0].nsaccountlock;
    const areAllStatusEqual = checkEqualStatus(
      firstStatus,
      selectableUsersList
    );
    if (areAllStatusEqual) {
      // Update selected users
      const userNamesArray: string[] = [];
      selectableUsersList.map((user) => {
        userNamesArray.push(user.uid);
      });
      props.usersData.updateSelectedUsers(userNamesArray);
      if (
        props.buttonsData.updateIsDisableEnableOp !== undefined &&
        props.buttonsData.updateIsDisableButtonDisabled !== undefined &&
        props.buttonsData.updateIsEnableButtonDisabled !== undefined
      ) {
        // Resetting 'isDisableEnableOp'
        props.buttonsData.updateIsDisableEnableOp(false);
        // Enable or disable buttons depending on the status
        if (!firstStatus) {
          // Enabled
          props.buttonsData.updateIsDisableButtonDisabled(false);
          props.buttonsData.updateIsEnableButtonDisabled(true);
        } else if (firstStatus) {
          // Disabled
          props.buttonsData.updateIsDisableButtonDisabled(true);
          props.buttonsData.updateIsEnableButtonDisabled(false);
        }
      }
    } else {
      if (
        props.buttonsData.updateIsDisableButtonDisabled !== undefined &&
        props.buttonsData.updateIsEnableButtonDisabled !== undefined
      ) {
        props.buttonsData.updateIsDisableButtonDisabled(true);
        props.buttonsData.updateIsEnableButtonDisabled(true);
      }
    }

    // Enable/disable 'Delete' button
    if (isSelecting) {
      let usersIdArray: string[] = [];

      // if all page selected, the original 'selectedUsers' data is preserved
      if (
        selectableUsersList.length <=
        props.usersData.selectableUsersTable.length
      ) {
        props.usersData.selectedUsers.map((user) => {
          usersIdArray.push(user);
        });
        selectableUsersList.map((user) => {
          usersIdArray.push(user.uid);
        });
      }
      // Correct duplicates (if any)
      usersIdArray = removeDuplicates(usersIdArray);
      props.usersData.updateSelectedUsers(usersIdArray);

      // Update data
      props.usersData.updateSelectedUserIds(usersIdArray);
      props.usersData.updateSelectedUsers(usersIdArray);
      props.usersData.changeSelectedUserNames(usersIdArray);
      // Enable delete button
      props.buttonsData.updateIsDeleteButtonDisabled(false);
      // Update the 'selectedPerPage' counter
      props.selectedPerPageData.updateSelectedPerPage(
        selectableUsersList.length
      );
    } else {
      props.usersData.updateSelectedUserIds([]);
      props.usersData.updateSelectedUsers([]);
      props.usersData.changeSelectedUserNames([]);
      props.buttonsData.updateIsDeleteButtonDisabled(true);
      // Restore the 'selectedPerPage' counter
      props.selectedPerPageData.updateSelectedPerPage(0);
    }
  };

  // Selects all users (Table)
  const selectAllUsersTable = (
    isSelecting = true,
    selectableUsersList: User[]
  ) => {
    if (selectableUsersList.length === 0) {
      return;
    }
    props.usersData.changeSelectedUserNames(
      isSelecting ? selectableUsersList.map((r) => r.uid) : []
    );
    // Check if all users have the same status
    const firstStatus = selectableUsersList[0].nsaccountlock;
    const areAllStatusEqual = checkEqualStatus(
      firstStatus,
      selectableUsersList
    );
    if (areAllStatusEqual) {
      // Update selected users
      const userNamesArray: string[] = [];
      selectableUsersList.map((user) => {
        userNamesArray.push(user.uid);
      });
      props.usersData.updateSelectedUsers(userNamesArray);
      if (
        props.buttonsData.updateIsDisableEnableOp !== undefined &&
        props.buttonsData.updateIsDisableButtonDisabled !== undefined &&
        props.buttonsData.updateIsEnableButtonDisabled !== undefined
      ) {
        // Resetting 'isDisableEnableOp'
        props.buttonsData.updateIsDisableEnableOp(false);
        // Enable or disable buttons depending on the status
        if (!firstStatus) {
          // Enabled
          props.buttonsData.updateIsDisableButtonDisabled(false);
          props.buttonsData.updateIsEnableButtonDisabled(true);
        } else if (firstStatus) {
          // Disabled
          props.buttonsData.updateIsDisableButtonDisabled(true);
          props.buttonsData.updateIsEnableButtonDisabled(false);
        }
      }
    } else {
      if (
        props.buttonsData.updateIsDisableButtonDisabled !== undefined &&
        props.buttonsData.updateIsEnableButtonDisabled !== undefined
      ) {
        props.buttonsData.updateIsDisableButtonDisabled(true);
        props.buttonsData.updateIsEnableButtonDisabled(true);
      }
    }

    // Enable/disable 'Delete' button
    if (isSelecting) {
      const usersIdArray: string[] = [];
      selectableUsersList.map((user) => usersIdArray.push(user.uid));
      props.usersData.updateSelectedUserIds(usersIdArray);
      props.usersData.updateSelectedUsers(usersIdArray);
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    } else {
      props.usersData.updateSelectedUserIds([]);
      props.usersData.updateSelectedUsers([]);
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  };

  // Helper method to manage the checkbox icon symbol
  // - All rows selected: true (full check)
  // - Some rows selected: null (-)
  // - None selected: false (empty)
  const areAllUsersSelected: boolean | null =
    props.usersData.selectedUserNames.length ===
    props.usersData.selectableUsersTable.length
      ? true
      : props.usersData.selectedUserNames.length > 0
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
            ) =>
              selectAllUsersTable(
                isSelecting,
                props.usersData.selectableUsersTable
              )
            }
            isChecked={areAllUsersSelected}
          >
            {props.usersData.selectedUsers.length > 0 && (
              <p>{props.usersData.selectedUsers.length + " selected"}</p>
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
      (user) => props.usersData.selectedUsers.indexOf(user.uid) >= 0
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
          (user) => props.usersData.selectedUsers.indexOf(user.uid) >= 0
        )
      ) {
        props.selectedPerPageData.updateSelectedPerPage(0);
      }
    }
  }, [props.usersData.selectedUsers.length, props.shownElementsList]);

  // Set the messages displayed in the 'Select page' option (bulk selector)
  const getSelectedElements = () => {
    let msg =
      "Select page (" + props.usersData.selectedUsers.length + " items)";
    const remainingElements = Math.min(
      props.usersData.selectedUsers.length +
        props.shownElementsList.length -
        props.selectedPerPageData.selectedPerPage,
      props.list.length
    );

    if (
      props.list.length > props.usersData.selectedUsers.length &&
      !currentPageAlreadySelected
    ) {
      msg = "Select page (" + remainingElements + " items)";
    }

    return msg;
  };

  // Menu options
  const menuToolbar = (
    <Menu
      ref={menuRef}
      style={{ minWidth: "fit-content" }}
      onSelect={(_ev) => {
        setIsOpenMenu(!isOpenMenu);
        toggleRefMenu.current?.querySelector("button").focus();
      }}
    >
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
              selectAllUsersTable(true, props.usersData.selectableUsersTable)
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
