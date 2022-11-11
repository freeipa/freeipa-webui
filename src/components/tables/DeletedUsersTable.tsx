// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

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
}

const DeletedUsersTable = (props: PropsToDeletedUsersTable) => {
  // Retrieve active users list from Store
  const activeUsersList = useAppSelector((state) => state.users.usersList);
  // Make a copy to work with it
  const activeUsersListCopy = [...activeUsersList];

  // Given userIds, retrieve full user info to display into table
  const usersToDelete: User[] = [];
  activeUsersListCopy.map((user) => {
    props.usersToDelete.map((selected) => {
      if (user.userId === selected) {
        usersToDelete.push(user);
      }
    });
  });

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
