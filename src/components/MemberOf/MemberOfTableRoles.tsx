import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import { Role } from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "../tables/EmptyBodyTable";
// Utils
import { parseEmptyString } from "src/utils/utils";

export interface MemberOfRolesTableProps {
  roles: Role[];
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Body
const RolesTableBody = (props: {
  roles: Role[];
  showCheckboxColumn: boolean;
  checkedItems: string[];
  onCheckboxChange: (checked: boolean, roleName: string) => void;
}) => {
  const { roles } = props;
  return (
    <>
      {roles.map((role, index) => (
        <Tr key={index} id={role.cn}>
          {props.showCheckboxColumn && (
            <Td
              select={{
                rowIndex: index,
                onSelect: (_e, isSelected) =>
                  props.onCheckboxChange(isSelected, role.cn),
                isSelected: props.checkedItems.includes(role.cn),
              }}
            />
          )}
          <Td>{role.cn}</Td>
          <Td>{parseEmptyString(role.description)}</Td>
        </Tr>
      ))}
    </>
  );
};

// Define skeleton
const skeleton = (
  <SkeletonOnTableLayout
    rows={4}
    colSpan={3}
    screenreaderText={"Loading table rows"}
  />
);

export default function MemberOfRolesTable(props: MemberOfRolesTableProps) {
  const { roles } = props;

  if (!roles || roles.length <= 0) {
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

  const onCheckboxChange = (checked: boolean, role: string) => {
    const originalItems = props.checkedItems || [];
    let newItems: string[] = [];
    if (checked) {
      newItems = [...originalItems, role];
    } else {
      newItems = originalItems.filter((name) => name !== role);
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
          <Th modifier="wrap">Role name</Th>
          <Th modifier="wrap">Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {!props.showTableRows ? (
          skeleton
        ) : roles.length === 0 ? (
          <EmptyBodyTable />
        ) : (
          <RolesTableBody
            roles={roles}
            showCheckboxColumn={showCheckboxColumn}
            onCheckboxChange={onCheckboxChange}
            checkedItems={props.checkedItems || []}
          />
        )}
      </Tbody>
    </Table>
  );
}
