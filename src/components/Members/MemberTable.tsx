import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import { Service, User, UserGroup } from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "../tables/EmptyBodyTable";
// Utils
import { parseEmptyString } from "src/utils/utils";
// Icons
import { CheckIcon } from "@patternfly/react-icons";
import { MinusIcon } from "@patternfly/react-icons";

export interface MemberOfTableProps {
  entityList: User[] | UserGroup[] | Service[] | string[]; // More types can be added here
  idKey?: string; // Users: uid, Groups: cn, etc. If not provided, the entity itself (a single string) will be used
  columnNamesToShow: string[];
  propertiesToShow: string[]; // Users: uid, givenname, sn, description, etc.
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Body
const TableBody = (props: {
  list: User[] | UserGroup[] | Service[] | string[]; // More types can be added here
  idKey?: string; // Users: uid, Groups: cn, etc.
  columnNamesToShow: string[];
  propertiesToShow: string[]; // Users: uid, first, last, description, etc.
  showCheckboxColumn: boolean;
  checkedItems: string[];
  onCheckboxChange: (checked: boolean, entityName: string) => void;
}) => {
  const { list, idKey, propertiesToShow } = props;
  return (
    <>
      {list.map((item, index) => (
        <Tr key={index}>
          {props.showCheckboxColumn && (
            <>
              {idKey ? (
                <Td
                  select={{
                    rowIndex: index,
                    onSelect: (_e, isSelected) =>
                      props.onCheckboxChange(isSelected, item[idKey]),
                    isSelected: props.checkedItems.includes(item[idKey]),
                  }}
                />
              ) : (
                <Td
                  select={{
                    rowIndex: index,
                    onSelect: (_e, isSelected) =>
                      props.onCheckboxChange(isSelected, item),
                    isSelected: props.checkedItems.includes(item),
                  }}
                />
              )}
            </>
          )}
          {propertiesToShow.map((propertyName, index) => {
            // Handle special cases: 'nsaccountlock' is a boolean
            if (propertyName === "nsaccountlock") {
              if (item[propertyName]) {
                return (
                  <Td key={index}>
                    <MinusIcon /> {" Disabled"}
                  </Td>
                );
              } else {
                return (
                  <Td key={index}>
                    <CheckIcon /> {" Enabled"}
                  </Td>
                );
              }
            } else {
              // Rest of the cases
              return (
                <Td key={index}>{parseEmptyString(item[propertyName])}</Td>
              );
            }
          })}
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

export default function MemberOfTable(props: MemberOfTableProps) {
  const { entityList } = props;

  if (!entityList || entityList.length <= 0) {
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

  const onCheckboxChange = (checked: boolean, item: string) => {
    const originalItems = props.checkedItems || [];
    let newItems: string[] = [];
    if (checked) {
      newItems = [...originalItems, item];
    } else {
      newItems = originalItems.filter((name) => name !== item);
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
          {props.columnNamesToShow.map((columnName, index) => (
            <Th key={index} modifier="wrap">
              {columnName}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {!props.showTableRows ? (
          skeleton
        ) : entityList.length === 0 ? (
          <EmptyBodyTable />
        ) : (
          <TableBody
            list={entityList}
            idKey={props.idKey}
            columnNamesToShow={props.columnNamesToShow}
            propertiesToShow={props.propertiesToShow}
            showCheckboxColumn={showCheckboxColumn}
            onCheckboxChange={onCheckboxChange}
            checkedItems={props.checkedItems || []}
          />
        )}
      </Tbody>
    </Table>
  );
}
