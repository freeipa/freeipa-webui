import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import { HBACRule } from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "../tables/EmptyBodyTable";
// Utils
import { parseEmptyString } from "src/utils/utils";

export interface MemberOfHbacRulesTableProps {
  hbacRules: HBACRule[];
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Body
const HbacRulesTableBody = (props: {
  hbacRules: HBACRule[];
  showCheckboxColumn: boolean;
  checkedItems: string[];
  onCheckboxChange: (checked: boolean, hbacRuleName: string) => void;
}) => {
  const { hbacRules } = props;
  return (
    <>
      {hbacRules.map((hbacRule, index) => (
        <Tr key={index}>
          {props.showCheckboxColumn && (
            <Td
              select={{
                rowIndex: index,
                onSelect: (_e, isSelected) =>
                  props.onCheckboxChange(isSelected, hbacRule.cn),
                isSelected: props.checkedItems.includes(hbacRule.cn),
              }}
            />
          )}
          <Td>{hbacRule.cn}</Td>
          <Td>{hbacRule.ipaenabledflag ? "Enabled" : "Disabled"}</Td>
          <Td>{parseEmptyString(hbacRule.description)}</Td>
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

export default function MemberOfHbacRulesTable(
  props: MemberOfHbacRulesTableProps
) {
  const { hbacRules } = props;

  if (!hbacRules || hbacRules.length <= 0) {
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

  const onCheckboxChange = (checked: boolean, hbacRules: string) => {
    const originalItems = props.checkedItems || [];
    let newItems: string[] = [];
    if (checked) {
      newItems = [...originalItems, hbacRules];
    } else {
      newItems = originalItems.filter((name) => name !== hbacRules);
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
          <Th modifier="wrap">Rule name</Th>
          <Th modifier="wrap">Status</Th>
          <Th modifier="wrap">Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {!props.showTableRows ? (
          skeleton
        ) : hbacRules.length === 0 ? (
          <EmptyBodyTable />
        ) : (
          <HbacRulesTableBody
            hbacRules={hbacRules}
            showCheckboxColumn={showCheckboxColumn}
            onCheckboxChange={onCheckboxChange}
            checkedItems={props.checkedItems || []}
          />
        )}
      </Tbody>
    </Table>
  );
}
