import React from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppSelector } from "src/store/hooks";

export interface PropsToDeletedUsersTable {
  usersToDelete: string[];
  from: "active-users" | "stage-users" | "preserved-users";
}

const DeletedUsersTable = (props: PropsToDeletedUsersTable) => {
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
  const usersToDelete: User[] = [];
  switch (props.from) {
    case "active-users":
      activeUsersListCopy.map((user) => {
        props.usersToDelete.map((selected) => {
          if (user.userId === selected) {
            usersToDelete.push(user);
          }
        });
      });
      break;
    case "stage-users":
      stageUsersListCopy.map((user) => {
        props.usersToDelete.map((selected) => {
          if (user.userId === selected) {
            usersToDelete.push(user);
          }
        });
      });
      break;
    case "preserved-users":
      preservedUsersListCopy.map((user) => {
        props.usersToDelete.map((selected) => {
          if (user.userId === selected) {
            usersToDelete.push(user);
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
    uid: "UID",
    emailAddress: "Email address",
  };

  // Define table header and body
  const header = (
    <Tr>
      <Th>{columnNames.userLogin}</Th>
      <Th modifier="wrap">{columnNames.firstName}</Th>
      <Th modifier="wrap">{columnNames.lastName}</Th>
      <Th modifier="wrap">{columnNames.uid}</Th>
      <Th modifier="wrap">{columnNames.emailAddress}</Th>
    </Tr>
  );

  const body = usersToDelete.map((user) => (
    <Tr key={user.userLogin} id={user.userLogin}>
      <Td dataLabel={columnNames.userLogin}>{user.userLogin}</Td>
      <Td dataLabel={columnNames.firstName}>{user.firstName}</Td>
      <Td dataLabel={columnNames.lastName}>{user.lastName}</Td>
      <Td dataLabel={columnNames.uid}>{user.uid}</Td>
      <Td dataLabel={columnNames.emailAddress}>{user.emailAddress}</Td>
    </Tr>
  ));

  // Render 'DeletedUsersTable'
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

export default DeletedUsersTable;
