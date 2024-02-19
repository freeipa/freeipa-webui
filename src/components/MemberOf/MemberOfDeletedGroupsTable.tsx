import React, { useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import {
  UserGroup,
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
} from "src/utils/datatypes/globalDataTypes";

// Interface for Column names
// All variables are defined as optional as it won't need to be explicitely defined when
//   generating the column names (on 'generateColumnNames()')
interface ColumnNames {
  name?: string;
  gid?: string;
  status?: string;
  description?: string;
}

interface PropsToDeleteOnTable {
  groupsToDelete:
    | UserGroup[]
    | Netgroup[]
    | Roles[]
    | HBACRules[]
    | SudoRules[];
  tabName: string;
}

const MemberOfDeletedGroupsTable = (props: PropsToDeleteOnTable) => {
  // Function to generate the column names
  const generateColumnNames = () => {
    switch (props.tabName) {
      case "User groups":
        return {
          name: "Role name",
          gid: "GID",
          description: "Description",
        } as ColumnNames;
      case "Netgroups":
        return {
          name: "Netgroup name",
          description: "Description",
        } as ColumnNames;
      case "Roles":
        return {
          name: "Role name",
          description: "Description",
        } as ColumnNames;
      case "HBAC rules":
        return {
          name: "Rule name",
          status: "Status",
          description: "Description",
        } as ColumnNames;
      case "Sudo rules":
        return {
          name: "Rule name",
          status: "Status",
          description: "Description",
        } as ColumnNames;
      default:
        return {};
    }
  };

  // Column names state
  const [columnNames] = useState<ColumnNames>(generateColumnNames());

  // Define table header and body
  const header = (
    <Tr>
      {columnNames.name && <Th modifier="wrap">{columnNames.name}</Th>}
      {columnNames.gid && <Th modifier="wrap">{columnNames.gid}</Th>}
      {columnNames.status && <Th modifier="wrap">{columnNames.status}</Th>}
      {columnNames.description && (
        <Th modifier="wrap">{columnNames.description}</Th>
      )}
    </Tr>
  );

  const body = props.groupsToDelete.map((group) => (
    <Tr key={group.cn} id={group.cn}>
      {group.cn && <Td dataLabel={group.cn}>{group.cn}</Td>}
      {group.gidnumber && (
        <Td dataLabel={group.gidnumber}>{group.gidnumber}</Td>
      )}
      {group.dn && <Td dataLabel={group.dn}>{group.dn}</Td>}
      {group.description && (
        <Td dataLabel={group.description}>{group.description}</Td>
      )}
    </Tr>
  ));

  // Render 'MemberOfDeletedGroupsTable'
  return (
    <TableLayout
      ariaLabel={"Remove groups table"}
      name="cn"
      variant={"compact"}
      hasBorders={true}
      tableId={"remove-groups-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={body}
    />
  );
};

export default MemberOfDeletedGroupsTable;
