import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, ThProps, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "src/components/layouts/Skeleton/SkeletonOnTableLayout";
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
  setIsDeletion,
} from "src/store/shared/shared-slice";
// Utils
import { checkEqualStatus } from "src/utils/utils";

export interface PropsToTable {
  elementsList: User[];
  shownElementsList: User[];
  isUserSelectable: (user: User) => boolean;
  selectedUserNames: string[];
  changeSelectedUserNames: (selectedUsernames: string[]) => void;
  selectableUsers: User[];
  setUserSelected: (user: User, isSelecting?: boolean) => void;
}

const ActiveUsersTable = (props: PropsToTable) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Get shared props
  const isDisableEnableOp = useAppSelector(
    (state) => state.shared.isDisableEnableOp
  );
  const selectedUserIds = useAppSelector(
    (state) => state.shared.selectedUserIds
  );
  const selectedPerPage = useAppSelector(
    (state) => state.shared.selectedPerPage
  );
  const showTableRows = useAppSelector((state) => state.shared.showTableRows);
  const isDeletion = useAppSelector((state) => state.shared.isDeletion);

  // Retrieve users data from props
  const activeUsersList = [...props.elementsList];
  const shownUsersList = [...props.shownElementsList];

  const columnNames = {
    userLogin: "User login",
    firstName: "First name",
    lastName: "Last name",
    status: "Status",
    uid: "UID",
    emailAddress: "Email address",
    phone: "Phone",
    jobTitle: "Job title",
  };

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
      userLogin,
      firstName,
      lastName,
      status,
      uid,
      emailAddress,
      phone,
      jobTitle,
    } = user;
    return [
      userLogin,
      firstName,
      lastName,
      status,
      uid,
      emailAddress,
      phone,
      jobTitle,
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
    if (isDisableEnableOp) {
      props.changeSelectedUserNames([]);
    }
  }, [isDisableEnableOp]);

  const isUserSelected = (user: User) =>
    props.selectedUserNames.includes(user.userLogin);

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
        props.setUserSelected(shownUsersList[index], isSelecting)
      );
    } else {
      props.setUserSelected(user, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Resetting 'isDisableEnableOp'
    dispatch(setIsDisableEnableOp(false));

    // Update userIdsSelected array
    let userIdsSelectedArray = props.selectedUserNames;
    if (isSelecting) {
      userIdsSelectedArray.push(user.userId);
      // Increment the elements selected per page (++)
      dispatch(setSelectedPerPage(selectedPerPage + 1));
    } else {
      userIdsSelectedArray = userIdsSelectedArray.filter(
        (userId) => userId !== user.userId
      );
      // Decrement the elements selected per page (--)
      dispatch(setSelectedPerPage(selectedPerPage - 1));
    }
    dispatch(setSelectedUserIds(userIdsSelectedArray));
    dispatch(setSelectedUsers(userIdsSelectedArray));
  };

  // Given userId, returns full User
  const getUserById = (userId: string) => {
    const res = activeUsersList.filter((user) => user.userId === userId);
    return res[0];
  };

  // Reset 'selectedUserIds' and 'selectedUserNames' arrays if a delete operation has been done
  useEffect(() => {
    if (isDeletion) {
      dispatch(setSelectedUserIds([]));
      props.changeSelectedUserNames([]);
      dispatch(setIsDeletion(false));
    }
  }, [isDeletion]);

  // // Enable 'Delete' and 'Enable|Disable' option buttons (if any user selected)
  useEffect(() => {
    if (selectedUserIds.length > 0) {
      dispatch(setIsDeleteButtonDisabled(false));
      const selectedUsers: User[] = selectedUserIds.map((userId) => {
        return getUserById(userId);
      });
      // Check if selected users have the same status
      if (selectedUsers.length > 0) {
        const equalStatus = checkEqualStatus(
          selectedUsers[0].status,
          selectedUsers
        );
        if (equalStatus) {
          if (selectedUsers[0].status === "Enabled") {
            dispatch(setIsDisableButtonDisabled(false));
            dispatch(setIsEnableButtonDisabled(true));
          } else if (selectedUsers[0].status === "Disabled") {
            dispatch(setIsDisableButtonDisabled(true));
            dispatch(setIsEnableButtonDisabled(false));
          }
        } else {
          // Different status selected -> Disable all buttons
          dispatch(setIsDisableButtonDisabled(true));
          dispatch(setIsEnableButtonDisabled(true));
        }
      }
    }

    if (selectedUserIds.length === 0) {
      dispatch(setIsDeleteButtonDisabled(true));
      dispatch(setIsDisableButtonDisabled(true));
      dispatch(setIsEnableButtonDisabled(true));
    }
  }, [selectedUserIds]);

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
  const setStyleOnStatus = (status: string) => {
    return status === "Disabled" ? { color: "grey" } : { color: "black" };
  };

  // Defining table header and body from here to avoid passing specific names to the Table Layout
  const header = (
    <Tr>
      <Th modifier="wrap"></Th>
      <Th modifier="wrap" sort={getSortParams(0)}>
        {columnNames.userLogin}
      </Th>
      <Th modifier="wrap" sort={getSortParams(1)}>
        {columnNames.firstName}
      </Th>
      <Th modifier="wrap" sort={getSortParams(2)}>
        {columnNames.lastName}
      </Th>
      <Th modifier="wrap" sort={getSortParams(3)}>
        {columnNames.status}
      </Th>
      <Th modifier="wrap" sort={getSortParams(4)}>
        {columnNames.uid}
      </Th>
      <Th modifier="wrap" sort={getSortParams(5)}>
        {columnNames.emailAddress}
      </Th>
      <Th modifier="wrap" sort={getSortParams(6)}>
        {columnNames.phone}
      </Th>
      <Th modifier="wrap" sort={getSortParams(7)}>
        {columnNames.jobTitle}
      </Th>
    </Tr>
  );

  const body = shownUsersList.map((user, rowIndex) => (
    <Tr key={user.userLogin} id={user.userLogin}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectUser(user, rowIndex, isSelecting),
          isSelected: isUserSelected(user),
          disable: !props.isUserSelectable(user),
        }}
      />
      <Td
        style={setStyleOnStatus(user.status)}
        dataLabel={columnNames.userLogin}
      >
        {user.userLogin}
      </Td>
      <Td
        style={setStyleOnStatus(user.status)}
        dataLabel={columnNames.firstName}
      >
        {user.firstName}
      </Td>
      <Td
        style={setStyleOnStatus(user.status)}
        dataLabel={columnNames.lastName}
      >
        {user.lastName}
      </Td>
      <Td style={setStyleOnStatus(user.status)} dataLabel={columnNames.status}>
        {user.status}
      </Td>
      <Td style={setStyleOnStatus(user.status)} dataLabel={columnNames.uid}>
        {user.uid}
      </Td>
      <Td
        style={setStyleOnStatus(user.status)}
        dataLabel={columnNames.emailAddress}
      >
        {user.emailAddress}
      </Td>
      <Td style={setStyleOnStatus(user.status)} dataLabel={columnNames.phone}>
        {user.phone}
      </Td>
      <Td
        style={setStyleOnStatus(user.status)}
        dataLabel={columnNames.jobTitle}
      >
        {user.jobTitle}
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
      ariaLabel={"Active users table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-u-mt-md"}
      tableId={"active-users-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!showTableRows ? skeleton : body}
    />
  );
};

export default ActiveUsersTable;
