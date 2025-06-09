import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "src/components/layouts/Skeleton/SkeletonOnTableLayout/SkeletonOnTableLayout";
// Utils
import { checkEqualStatus } from "src/utils/utils";
// React Router DOM
import { Link } from "react-router-dom";
// Icons
import { CheckIcon } from "@patternfly/react-icons";
import { MinusIcon } from "@patternfly/react-icons";

interface UsersData {
  isUserSelectable: (user: User) => boolean;
  selectedUsers: User[];
  selectableUsersTable: User[];
  setUserSelected: (user: User, isSelecting?: boolean) => void;
  clearSelectedUsers: () => void;
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

  // When user status is updated, unselect selected rows
  useEffect(() => {
    if (props.buttonsData.isDisableEnableOp) {
      props.usersData.clearSelectedUsers();
    }
  }, [props.buttonsData.isDisableEnableOp]);

  const isUserSelected = (user: User) => {
    if (
      props.usersData.selectedUsers.find(
        (selectedUser) => selectedUser.uid[0] === user.uid[0]
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

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

    if (isSelecting) {
      // Increment the elements selected per page (++)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage + 1
      );
    } else {
      // Decrement the elements selected per page (--)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage - 1
      );
    }
  };

  // Reset 'selectedUsers' array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.usersData.clearSelectedUsers();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' and 'Enable|Disable' option buttons (if any user selected)
  useEffect(() => {
    if (props.usersData.selectedUsers.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
      const selectedUsers: User[] = props.usersData.selectedUsers;
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

    if (props.usersData.selectedUsers.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
      if (
        props.buttonsData.updateIsEnableButtonDisabled !== undefined &&
        props.buttonsData.updateIsDisableButtonDisabled !== undefined
      ) {
        props.buttonsData.updateIsDisableButtonDisabled(true);
        props.buttonsData.updateIsEnableButtonDisabled(true);
      }
    }
  }, [props.usersData.selectedUsers]);

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
      <Th modifier="wrap">{columnNames.uid}</Th>
      <Th modifier="wrap">{columnNames.givenname}</Th>
      <Th modifier="wrap">{columnNames.sn}</Th>
      {props.from !== "stage-users" ? (
        <Th modifier="wrap">{columnNames.nsaccountlock}</Th>
      ) : null}
      <Th modifier="wrap">{columnNames.uidnumber}</Th>
      <Th modifier="wrap">{columnNames.mail}</Th>
      <Th modifier="wrap">{columnNames.telephonenumber}</Th>
      <Th modifier="wrap">{columnNames.title}</Th>
    </Tr>
  );

  const body = shownUsersList.map((user, rowIndex) => (
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
        <Link to={"/" + props.from + "/" + user.uid} state={user}>
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
