import React from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";

export interface PropsToDisplayUsersTable {
  usersToDisplay: User[];
}

const UsersDisplayTable = (props: PropsToDisplayUsersTable) => {
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

  const body = props.usersToDisplay.map((user) => (
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
