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
  HBACServiceGroup,
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
import { Link } from "react-router";

type EntryDataTypes =
  | HBACRule
  | HBACService
  | HBACServiceGroup
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
  | "idoverrideuser"
  | "netgroups"
  | "roles"
  | "services"
  | "sudo-rules"
  | "sudo-commands"
  | "sysaccount"
  | "user-groups"
  | "external";

interface MemberTableProps {
  entityList: EntryDataTypes[]; // More types can be added here
  from: FromTypes;
  idKey: string; // Users: uid, Groups: cn, etc.
  columnNamesToShow: string[];
  propertiesToShow: string[]; // Users: uid, givenname, sn, description, etc.
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Types that use string arrays instead of objects
const STRING_ARRAY_TYPES = ["external", "sysaccount", "idoverrideuser"];

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

  // Check if this is a string array type (external, sysaccount, idoverrideuser)
  const isStringArray = STRING_ARRAY_TYPES.includes(props.from);

  return (
    <>
      {list.map((item, index) => {
        // For string arrays, the item itself is the identifier
        const itemId = isStringArray ? (item as string) : item[idKey];

        return (
          <Tr key={index} id={itemId}>
            {props.showCheckboxColumn && (
              <Td
                select={{
                  rowIndex: index,
                  onSelect: (_e, isSelected) =>
                    props.onCheckboxChange(isSelected, itemId),
                  isSelected: props.checkedItems.includes(itemId),
                }}
              />
            )}
            <Td>
              {props.from === "roles" || isStringArray ? (
                // String arrays and roles don't have links
                itemId
              ) : (
                <Link
                  to={
                    "/" +
                    props.from +
                    "/" +
                    (props.from === "services"
                      ? encodeURIComponent(itemId)
                      : itemId)
                  }
                  state={item}
                >
                  {itemId}
                </Link>
              )}
            </Td>
            {/* For string arrays, we don't show additional columns */}
            {!isStringArray &&
              propertiesToShow.map((propertyName, index) => {
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
        );
      })}
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
