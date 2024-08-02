import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "../tables/EmptyBodyTable";
// Utils
import { parseEmptyString } from "src/utils/utils";
// React Router DOM
import { Link } from "react-router-dom";

export interface MemberOfNetgroupsTableProps {
  netgroups: Netgroup[];
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Body
const NetgroupsTableBody = (props: {
  netgroups: Netgroup[];
  showCheckboxColumn: boolean;
  checkedItems: string[];
  onCheckboxChange: (checked: boolean, groupName: string) => void;
}) => {
  const { netgroups } = props;
  return (
    <>
      {netgroups.map((netgroup, index) => (
        <Tr key={index} id={netgroup.cn}>
          {props.showCheckboxColumn && (
            <Td
              select={{
                rowIndex: index,
                onSelect: (_e, isSelected) =>
                  props.onCheckboxChange(isSelected, netgroup.cn),
                isSelected: props.checkedItems.includes(netgroup.cn),
              }}
            />
          )}
          <Td>
            <Link to={"/netgroups/" + netgroup.cn} state={netgroup}>
              {netgroup.cn}
            </Link>
          </Td>
          <Td>{parseEmptyString(netgroup.description)}</Td>
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

export default function MemberOfNetgroupsTable(
  props: MemberOfNetgroupsTableProps
) {
  const { netgroups } = props;

  if (!netgroups || netgroups.length <= 0) {
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

  const onCheckboxChange = (checked: boolean, netgroup: string) => {
    const originalItems = props.checkedItems || [];
    let newItems: string[] = [];
    if (checked) {
      newItems = [...originalItems, netgroup];
    } else {
      newItems = originalItems.filter((name) => name !== netgroup);
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
          <Th modifier="wrap">Netgroup name</Th>
          <Th modifier="wrap">Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {!props.showTableRows ? (
          skeleton
        ) : netgroups.length === 0 ? (
          <EmptyBodyTable />
        ) : (
          <NetgroupsTableBody
            netgroups={netgroups}
            showCheckboxColumn={showCheckboxColumn}
            onCheckboxChange={onCheckboxChange}
            checkedItems={props.checkedItems || []}
          />
        )}
      </Tbody>
    </Table>
  );
}
