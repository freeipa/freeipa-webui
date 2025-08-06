import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import {
  Host,
  Service,
  User,
  UserGroup,
  HostGroup,
  HBACRule,
  HBACService,
  Netgroup,
  Role,
  SudoRule,
  SudoCmd,
  SudoCmdGroup,
  SubId,
} from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "./EmptyBodyTable";
// Utils
import { parseEmptyString } from "src/utils/utils";
// Icons
import { CheckIcon } from "@patternfly/react-icons";
import { MinusIcon } from "@patternfly/react-icons";
// React Router DOM
import { Link } from "react-router-dom";

type EntryDataTypes =
  | HBACRule
  | HBACService
  | Host
  | HostGroup
  | Netgroup
  | Role
  | Service
  | SubId
  | SudoRule
  | SudoCmd
  | SudoCmdGroup
  | User
  | UserGroup
  | string; // external

type FromTypes =
  | "active-users"
  | "hbac-rules"
  | "hbac-services"
  | "hosts"
  | "host-groups"
  | "netgroups"
  | "roles" // Not in AppRoutes yet (no Link)
  | "services"
  | "sudo-rules"
  | "sudo-commands"
  | "user-groups"
  | "external";

export interface MemberTableProps {
  entityList: EntryDataTypes[]; // More types can be added here
  from: FromTypes;
  idKey: string; // Users: uid, Groups: cn, etc.
  columnNamesToShow: string[];
  propertiesToShow: string[]; // Users: uid, givenname, sn, description, etc.
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Body
const TableBody = (props: {
  list: EntryDataTypes[]; // More types can be added here
  from: string;
  idKey: string; // Users: uid, Groups: cn, etc.
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
        <Tr key={index} id={item[idKey]}>
          {props.showCheckboxColumn && (
            <Td
              select={{
                rowIndex: index,
                onSelect: (_e, isSelected) =>
                  props.onCheckboxChange(isSelected, item[idKey]),
                isSelected: props.checkedItems.includes(item[idKey]),
              }}
            />
          )}
          <Td>
            {props.from === "roles" ? (
              // Temporary until Roles are implemented
              item[idKey]
            ) : (
              <Link
                to={
                  "/" +
                  props.from +
                  "/" +
                  (props.from === "services"
                    ? encodeURIComponent(item[idKey])
                    : item[idKey])
                }
                state={item}
              >
                {item[idKey]}
              </Link>
            )}
          </Td>
          {propertiesToShow.map((propertyName, index) => {
            // Handle special cases: 'nsaccountlock' is a boolean
            if (
              propertyName === "nsaccountlock" ||
              propertyName === "ipaenabledflag"
            ) {
              if (
                (propertyName === "nsaccountlock" && item[propertyName]) ||
                (propertyName === "ipaenabledflag" && !item[propertyName])
              ) {
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
            } else if (propertyName !== idKey) {
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

export default function MemberTable(props: MemberTableProps) {
  const { entityList } = props;

  if (!entityList || entityList.length <= 0) {
    // Return empty placeholder
    return (
      <Table
        aria-label="membership table"
        name="cn"
        variant="compact"
        borders
        className={"pf-v6-u-mt-md"}
        id="membership-table"
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
      aria-label="membership table"
      name="cn"
      variant="compact"
      borders
      className={"pf-v6-u-mt-md"}
      id="membership-table"
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
            from={props.from}
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
