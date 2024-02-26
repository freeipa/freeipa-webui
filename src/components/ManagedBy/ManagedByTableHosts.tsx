import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import { UserGroupOld } from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "../tables/EmptyBodyTable";

export interface MemberOfUserGroupsTableProps {
  userGroups: UserGroupOld[];
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Body
const UserGroupsTableBody = (props: {
  userGroups: UserGroupOld[];
  showCheckboxColumn: boolean;
  checkedItems: string[];
  onCheckboxChange: (checked: boolean, groupName: string) => void;
}) => {
  const { hosts } = props;
  return (
    <>
      {userGroups.map((userGroup, index) => (
        <Tr key={index}>
          {props.showCheckboxColumn && (
            <Td
              select={{
                rowIndex: index,
                onSelect: (_e, isSelected) =>
                  props.onCheckboxChange(isSelected, userGroup.name),
                isSelected: props.checkedItems.includes(userGroup.name),
              }}
            />
          )}
          <Td>{userGroup.name}</Td>
          <Td>{userGroup.gid}</Td>
          <Td>{userGroup.description}</Td>
        </Tr>
      ))}
    </>
  );
};

// Define skeleton
const skeleton = (
  <SkeletonOnTableLayout
    rows={4}
    colSpan={4}
    screenreaderText={"Loading table rows"}
  />
);

export default function ManagedByHostsTable(props: ManagedByHostsTableProps) {
  const { hosts } = props;
  if (!hosts || hosts.length <= 0) {
    return (
      <Table
        aria-label="managed by table"
        name="cn"
        variant="compact"
        borders
        className={"pf-v5-u-mt-md"}
        id="managed-by-table"
        isStickyHeader
      >
        <Tbody>
          <EmptyBodyTable />
        </Tbody>
      </Table>
    );
  }

  const showCheckboxColumn = props.onCheckItemsChange !== undefined;

  const onCheckboxChange = (checked: boolean, groupName: string) => {
    const originalItems = props.checkedItems || [];
    let newItems: string[] = [];
    if (checked) {
      newItems = [...originalItems, groupName];
    } else {
      newItems = originalItems.filter((name) => name !== groupName);
    }
    if (props.onCheckItemsChange) {
      props.onCheckItemsChange(newItems);
    }
  };

  return (
    <Table
      aria-label="managed by table"
      name="cn"
      variant="compact"
      borders
      className={"pf-v5-u-mt-md"}
      id="managed-by-table"
      isStickyHeader
    >
      <Thead>
        <Tr>
          {props.onCheckItemsChange && <Th />}
          <Th modifier="wrap">Group name</Th>
          <Th modifier="wrap">GID</Th>
          <Th modifier="wrap">Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {!props.showTableRows ? (
          skeleton
        ) : hosts.length === 0 ? (
          <EmptyBodyTable />
        ) : (
          <UserGroupsTableBody
            userGroups={userGroups}
            showCheckboxColumn={showCheckboxColumn}
            onCheckboxChange={onCheckboxChange}
            checkedItems={props.checkedItems || []}
          />
        )}
      </Tbody>
    </Table>
  );
}
