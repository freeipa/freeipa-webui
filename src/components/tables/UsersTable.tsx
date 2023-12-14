import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, ThProps, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "src/components/layouts/Skeleton/SkeletonOnTableLayout";
// Utils
import { checkEqualStatus } from "src/utils/utils";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
// React Router DOM
import { Link } from "react-router-dom";
// Icons
import { CheckIcon } from "@patternfly/react-icons";
import { MinusIcon } from "@patternfly/react-icons";

interface UsersData {
  isUserSelectable: (user: User) => boolean;
  selectedUserNames: string[];
  changeSelectedUserNames: (selectedUsernames: string[]) => void;
  selectedUserIds: string[];
  updateSelectedUserIds: (newSelectedUserIds: string[]) => void;
  selectableUsersTable: User[];
  setUserSelected: (user: User, isSelecting?: boolean) => void;
  updateSelectedUsers: (newSelectedUsers: string[]) => void;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsEnableButtonDisabled?: (value: boolean) => void;
  updateIsDisableButtonDisabled?: (value: boolean) => void;
  isDeletion: boolean;
  updateIsDeletion: (value: boolean) => void;
  isDisableEnableOp?: boolean;
  updateIsDisableEnableOp?: (value: boolean) => void;
}

interface PaginationData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

export interface PropsToTable {
  elementsList: User[];
  shownElementsList: User[];
  from: "active-users" | "stage-users" | "preserved-users";
  showTableRows: boolean;
  usersData: UsersData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const UsersTable = (props: PropsToTable) => {
  // Retrieve users data from props
  const usersList = [...props.elementsList];
  const shownUsersList = [...props.shownElementsList];

  const columnNames = {
    uid: "User login",
    givenname: "First name",
    sn: "Last name",
    nsaccountlock: "Status",
    uidnumber: "UID",
    mail: "Email address",
    telephonenumber: "Phone",
    title: "Job title",
  };

  // Filter (SearchInput)
  // - When a user is search using the Search Input
  const onFilter = (user: User) => {
    if (props.searchValue === "") {
      return true;
    }

    let input: RegExp;
    try {
      // Find matches that begin with the pattern
      input = new RegExp("^" + props.searchValue, "i");
    } catch (err) {
      input = new RegExp(
        props.searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
    }

    for (const attr of Object.keys(columnNames)) {
      if (
        attr !== "nsaccountlock" &&
        user[attr] !== undefined &&
        user[attr][0].search(input) >= 0
      ) {
        return true;
      }
    }
    return false;
  };

  const filteredShownUsers =
    props.searchValue === ""
      ? shownUsersList
      : props.elementsList.filter(onFilter);

  // Index of the currently sorted column
  // Note: if you intend to make columns reorderable, you may instead want to use a non-numeric key
  // as the identifier of the sorted column. See the "Compound expandable" example.
  const [activeSortIndex, setActiveSortIndex] = useState<number | null>(null);

  // Sort direction of the currently sorted column
  const [activeSortDirection, setActiveSortDirection] = useState<
    "asc" | "desc" | null
  >(null);

  // Since OnSort specifies sorted columns by index, we need sortable values for our object by column index.
  const getSortableRowValues = (user: User): (string | number)[] => {
    const {
      uid,
      givenname,
      sn,
      nsaccountlock,
      uidnumber,
      mail,
      telephonenumber,
      title,
    } = user;

    // Process array data
    let givennameString = "";
    if (givenname !== undefined) {
      givennameString = givenname[0];
    }

    const nsaccountlockString = nsaccountlock.toString();

    let mailString = "";
    if (mail !== undefined) {
      mailString = mail.toString();
    }

    let telephoneNumberString = "";
    if (telephonenumber !== undefined) {
      telephoneNumberString = telephonenumber.toString();
    }

    let titleString = "";
    if (title !== undefined) {
      titleString = title[0];
    }

    return [
      uid[0],
      givennameString,
      sn[0],
      nsaccountlockString,
      uidnumber[0],
      mailString,
      telephoneNumberString,
      titleString,
    ];
  };

  let sortedUsers = [...shownUsersList];
  if (activeSortIndex !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sortedUsers = shownUsersList.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];
      if (typeof aValue === "number") {
        // Numeric sort
        if (activeSortDirection === "asc") {
          return (aValue as number) - (bValue as number);
        }
        return (bValue as number) - (aValue as number);
      } else {
        // String sort
        if (activeSortDirection === "asc") {
          return (aValue as string).localeCompare(bValue as string);
        }
        return (bValue as string).localeCompare(aValue as string);
      }
    });
  }

  const getSortParams = (columnIndex: number): ThProps["sort"] => ({
    sortBy: {
      index: activeSortIndex as number,
      direction: activeSortDirection as "asc" | "desc",
      defaultDirection: "asc", // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  // When user status is updated, unselect selected rows
  useEffect(() => {
    if (props.buttonsData.isDisableEnableOp) {
      props.usersData.changeSelectedUserNames([]);
    }
  }, [props.buttonsData.isDisableEnableOp]);

  const isUserSelected = (user: User) =>
    props.usersData.selectedUserNames.includes(user.uid);

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // On selecting one single row
  const onSelectUser = (user: User, rowIndex: number, isSelecting: boolean) => {
    // If the user is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(
              new Array(numberSelected + 1),
              (_x, i) => i + recentSelectedRowIndex
            )
          : Array.from(
              new Array(Math.abs(numberSelected) + 1),
              (_x, i) => i + rowIndex
            );
      intermediateIndexes.forEach((index) =>
        props.usersData.setUserSelected(shownUsersList[index], isSelecting)
      );
    } else {
      props.usersData.setUserSelected(user, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Resetting 'isDisableEnableOp'
    if (props.buttonsData.updateIsDisableEnableOp !== undefined) {
      props.buttonsData.updateIsDisableEnableOp(false);
    }

    // Update userIdsSelected array
    let userIdsSelectedArray = props.usersData.selectedUserNames;
    if (isSelecting) {
      userIdsSelectedArray.push(user.uid);
      // Increment the elements selected per page (++)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage + 1
      );
    } else {
      userIdsSelectedArray = userIdsSelectedArray.filter(
        (userId) => userId !== user.uid
      );
      // Decrement the elements selected per page (--)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage - 1
      );
    }

    props.usersData.updateSelectedUserIds(userIdsSelectedArray);
    props.usersData.updateSelectedUsers(userIdsSelectedArray);
  };

  // Given userId, returns full User
  const getUserById = (userId: string) => {
    const res = usersList.filter((user) => user.uid[0] === userId);
    return res[0];
  };

  // Reset 'selectedUserIds' and 'selectedUserNames' arrays if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.usersData.updateSelectedUserIds([]);
      props.usersData.changeSelectedUserNames([]);
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' and 'Enable|Disable' option buttons (if any user selected)
  useEffect(() => {
    if (props.usersData.selectedUserIds.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);

      const selectedUsers: User[] = props.usersData.selectedUserIds.map(
        (userId) => {
          return getUserById(userId[0]);
        }
      );

      if (
        props.buttonsData.updateIsDisableButtonDisabled !== undefined &&
        props.buttonsData.updateIsEnableButtonDisabled !== undefined
      ) {
        // Check if selected users have the same status
        if (selectedUsers.length > 0) {
          const equalStatus = checkEqualStatus(
            selectedUsers[0].nsaccountlock,
            selectedUsers
          );
          if (equalStatus) {
            if (!selectedUsers[0].nsaccountlock) {
              // Enabled
              props.buttonsData.updateIsDisableButtonDisabled(false);
              props.buttonsData.updateIsEnableButtonDisabled(true);
            } else if (selectedUsers[0].nsaccountlock) {
              // Disabled
              props.buttonsData.updateIsDisableButtonDisabled(true);
              props.buttonsData.updateIsEnableButtonDisabled(false);
            }
          } else {
            // Different status selected -> Disable all buttons
            props.buttonsData.updateIsDisableButtonDisabled(true);
            props.buttonsData.updateIsEnableButtonDisabled(true);
          }
        }
      }
    }

    if (props.usersData.selectedUserIds.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
      if (
        props.buttonsData.updateIsEnableButtonDisabled !== undefined &&
        props.buttonsData.updateIsDisableButtonDisabled !== undefined
      ) {
        props.buttonsData.updateIsDisableButtonDisabled(true);
        props.buttonsData.updateIsEnableButtonDisabled(true);
      }
    }
  }, [props.usersData.selectedUserIds]);

  // Keyboard event
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Helper method: Set styles depending on the status
  const setStyleOnStatus = (status: boolean) => {
    return status ? { color: "grey" } : { color: "black" };
  };

  // Defining table header and body from here to avoid passing specific names to the Table Layout
  const header = (
    <Tr>
      <Th modifier="wrap"></Th>
      <Th modifier="wrap" sort={getSortParams(0)}>
        {columnNames.uid}
      </Th>
      <Th modifier="wrap" sort={getSortParams(1)}>
        {columnNames.givenname}
      </Th>
      <Th modifier="wrap" sort={getSortParams(2)}>
        {columnNames.sn}
      </Th>
      {props.from !== "stage-users" ? (
        <Th modifier="wrap" sort={getSortParams(3)}>
          {columnNames.nsaccountlock}
        </Th>
      ) : null}
      <Th modifier="wrap" sort={getSortParams(4)}>
        {columnNames.uidnumber}
      </Th>
      <Th modifier="wrap" sort={getSortParams(5)}>
        {columnNames.mail}
      </Th>
      <Th modifier="wrap" sort={getSortParams(6)}>
        {columnNames.telephonenumber}
      </Th>
      <Th modifier="wrap" sort={getSortParams(7)}>
        {columnNames.title}
      </Th>
    </Tr>
  );

  const body = filteredShownUsers.map((user, rowIndex) => (
    <Tr key={user.uid} id={user.uid}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectUser(user, rowIndex, isSelecting),
          isSelected: isUserSelected(user),
          isDisabled: !props.usersData.isUserSelectable(user),
        }}
      />
      <Td
        style={setStyleOnStatus(user.nsaccountlock)}
        dataLabel={columnNames.uid}
      >
        <Link to={URL_PREFIX + "/" + props.from + "/settings"} state={user}>
          {user.uid}
        </Link>
      </Td>
      <Td
        style={setStyleOnStatus(user.nsaccountlock)}
        dataLabel={columnNames.givenname}
      >
        {user.givenname}
      </Td>
      <Td
        style={setStyleOnStatus(user.nsaccountlock)}
        dataLabel={columnNames.sn}
      >
        {user.sn}
      </Td>
      {props.from !== "stage-users" ? (
        <Td
          style={setStyleOnStatus(user.nsaccountlock)}
          dataLabel={columnNames.nsaccountlock}
        >
          {user.nsaccountlock ? (
            <>
              <MinusIcon /> {" Disabled"}
            </>
          ) : (
            <>
              <CheckIcon /> {" Enabled"}
            </>
          )}
        </Td>
      ) : null}
      <Td
        style={setStyleOnStatus(user.nsaccountlock)}
        dataLabel={columnNames.uidnumber}
      >
        {user.uidnumber}
      </Td>
      <Td
        style={setStyleOnStatus(user.nsaccountlock)}
        dataLabel={columnNames.mail}
      >
        {user.mail !== undefined && user.mail.join(", ")}
      </Td>
      <Td
        style={setStyleOnStatus(user.nsaccountlock)}
        dataLabel={columnNames.telephonenumber}
      >
        {user.telephonenumber !== undefined && user.telephonenumber.join(", ")}
      </Td>
      <Td
        style={setStyleOnStatus(user.nsaccountlock)}
        dataLabel={columnNames.title}
      >
        {user.title}
      </Td>
    </Tr>
  ));

  const skeleton = (
    <SkeletonOnTableLayout
      rows={4}
      colSpan={9}
      screenreaderText={"Loading table rows"}
    />
  );

  return (
    <TableLayout
      ariaLabel={props.from.replace("-", " ") + " table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v5-u-mt-md"}
      tableId={props.from + "-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default UsersTable;
