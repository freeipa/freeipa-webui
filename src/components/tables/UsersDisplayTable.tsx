import React from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppSelector } from "src/store/hooks";

export interface PropsToDisplayUsersTable {
  usersToDisplay: string[];
  from: "active-users" | "stage-users" | "preserved-users";
}

const UsersDisplayTable = (props: PropsToDisplayUsersTable) => {
  // Retrieve all users list from Store
  // - Active users
  const activeUsersList = useAppSelector(
    (state) => state.activeUsers.usersList
  );
  const activeUsersListCopy = [...activeUsersList];

  // - Stage users
  const stageUsersList = useAppSelector((state) => state.stageUsers.usersList);
  const stageUsersListCopy = [...stageUsersList];

  // - Preserved users
  const preservedUsersList = useAppSelector(
    (state) => state.preservedUsers.usersList
  );
  const preservedUsersListCopy = [...preservedUsersList];

  // Given userIds, retrieve full user info to display into table
  const usersToDisplay: User[] = [];
  switch (props.from) {
    case "active-users":
      activeUsersListCopy.map((user) => {
        props.usersToDisplay.map((selected) => {
          if (user.uid[0] === selected[0]) {
            usersToDisplay.push(user);
          }
        });
      });
      break;
    case "stage-users":
      stageUsersListCopy.map((user) => {
        props.usersToDisplay.map((selected) => {
          if (user.uid === selected) {
            usersToDisplay.push(user);
          }
        });
      });
      break;
    case "preserved-users":
      preservedUsersListCopy.map((user) => {
        props.usersToDisplay.map((selected) => {
          if (user.uid === selected) {
            usersToDisplay.push(user);
          }
        });
      });
      break;
  }

  // Define column names
  const columnNames = {
    userLogin: "User login",
    firstName: "First name",
    lastName: "Last name",
    uidnumber: "UID",
    emailAddress: "Email address",
  };

  // Define table header and body
  const header = (
    <Tr>
      <Th>{columnNames.userLogin}</Th>
      <Th modifier="wrap">{columnNames.firstName}</Th>
      <Th modifier="wrap">{columnNames.lastName}</Th>
      <Th modifier="wrap">{columnNames.uidnumber}</Th>
      <Th modifier="wrap">{columnNames.emailAddress}</Th>
    </Tr>
  );

  const body = usersToDisplay.map((user) => (
    <Tr key={user.uid} id={user.uid}>
      <Td dataLabel={columnNames.userLogin}>{user.uid}</Td>
      <Td dataLabel={columnNames.firstName}>{user.givenname}</Td>
      <Td dataLabel={columnNames.lastName}>{user.sn}</Td>
      <Td dataLabel={columnNames.uidnumber}>{user.uidnumber}</Td>
      <Td dataLabel={columnNames.emailAddress}>{user.mail}</Td>
    </Tr>
  ));

  // Render 'UsersDisplayTable'
  return (
    <TableLayout
      ariaLabel={"Remove users table"}
      variant={"compact"}
      hasBorders={true}
      tableId={"remove-users-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={body}
    />
  );
};

export default UsersDisplayTable;
