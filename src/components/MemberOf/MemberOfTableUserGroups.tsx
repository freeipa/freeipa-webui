import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "../tables/EmptyBodyTable";
// Utils
import { parseEmptyString } from "src/utils/utils";
// React Router DOM
import { Link } from "react-router-dom";

export interface MemberOfUserGroupsTableProps {
  userGroups: UserGroup[];
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Body
const UserGroupsTableBody = (props: {
  userGroups: UserGroup[];
  showCheckboxColumn: boolean;
  checkedItems: string[];
  onCheckboxChange: (checked: boolean, groupName: string) => void;
}) => {
  const { userGroups } = props;
  return (
    <>
      {userGroups.map((userGroup, index) => (
        <Tr key={index} id={userGroup.cn}>
          {props.showCheckboxColumn && (
            <Td
              select={{
                rowIndex: index,
                onSelect: (_e, isSelected) =>
                  props.onCheckboxChange(isSelected, userGroup.cn),
                isSelected: props.checkedItems.includes(userGroup.cn),
              }}
            />
          )}
          <Td>
            <Link to={"/user-groups/" + userGroup.cn} state={userGroup}>
              {userGroup.cn}
            </Link>
          </Td>
          <Td>{parseEmptyString(userGroup.gidnumber)}</Td>
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

export default function MemberOfUserGroupsTable(
  props: MemberOfUserGroupsTableProps
) {
  const { userGroups } = props;

  if (!userGroups || userGroups.length <= 0) {
    // Return empty placeholder
    return (
      <Table
        aria-label="member of table"
        name="cn"
        variant="compact"
        borders
        className={"pf-v5-u-mt-md"}
        id="member-of-table"
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
      aria-label="member of table"
      name="cn"
      variant="compact"
      borders
      className={"pf-v5-u-mt-md"}
      id="member-of-table"
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
        ) : userGroups.length === 0 ? (
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
