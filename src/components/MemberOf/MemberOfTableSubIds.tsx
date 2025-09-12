import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import { SubId } from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "../tables/EmptyBodyTable";

interface MemberOfSubIdsTableProps {
  subIds: SubId[];
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
  showCheckboxColumn?: boolean;
}

// Body
const SubIdsTableBody = (props: {
  subIds: SubId[];
  showCheckboxColumn: boolean;
  checkedItems: string[];
  onCheckboxChange: (checked: boolean, subIdName: string) => void;
}) => {
  const { subIds } = props;
  return (
    <>
      {subIds.map((subId, index) => (
        <Tr key={index} id={subId.ipauniqueid}>
          {props.showCheckboxColumn && (
            <Td
              select={{
                rowIndex: index,
                onSelect: (_e, isSelected) =>
                  props.onCheckboxChange(isSelected, subId.ipauniqueid),
                isSelected: props.checkedItems.includes(subId.ipauniqueid),
              }}
            />
          )}
          <Td>{subId.ipauniqueid}</Td>
          <Td>{subId.ipasubuidnumber}</Td>
          <Td>{subId.ipasubgidnumber}</Td>
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

export default function MemberOfSubIdsTable(props: MemberOfSubIdsTableProps) {
  const { subIds } = props;
  if (!subIds || subIds.length <= 0) {
    // Return empty placeholder
    return (
      <Table
        aria-label="member of table"
        name="cn"
        variant="compact"
        borders
        className={"pf-v6-u-mt-md"}
        id="member-of-table"
        isStickyHeader
      >
        <Tbody>
          <EmptyBodyTable />
        </Tbody>
      </Table>
    );
  }

  const showCheckboxes = props.showCheckboxColumn || false;

  const showCheckboxColumn =
    props.onCheckItemsChange !== undefined && showCheckboxes;

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
      className={"pf-v6-u-mt-md"}
      id="member-of-table"
      isStickyHeader
    >
      <Thead>
        <Tr>
          {showCheckboxes && props.onCheckItemsChange && <Th />}
          <Th modifier="wrap">Unique ID</Th>
          <Th modifier="wrap">SubUID range start</Th>
          <Th modifier="wrap">SubGID range start</Th>
        </Tr>
      </Thead>
      <Tbody>
        {!props.showTableRows ? (
          skeleton
        ) : subIds.length === 0 ? (
          <EmptyBodyTable />
        ) : (
          <SubIdsTableBody
            subIds={subIds}
            showCheckboxColumn={showCheckboxColumn}
            onCheckboxChange={onCheckboxChange}
            checkedItems={props.checkedItems || []}
          />
        )}
      </Tbody>
    </Table>
  );
}
