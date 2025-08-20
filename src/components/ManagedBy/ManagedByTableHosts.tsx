import React from "react";
// PatternFly
import { Table, Tr, Th, Td, Thead, Tbody } from "@patternfly/react-table";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Components
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
import EmptyBodyTable from "../tables/EmptyBodyTable";

export interface ManagedByHostsTableProps {
  hosts: Host[];
  checkedItems?: string[];
  onCheckItemsChange?: (checkedItems: string[]) => void;
  showTableRows: boolean;
}

// Body
const HostsTableBody = (props: {
  hosts: Host[];
  showCheckboxColumn: boolean;
  checkedItems: string[];
  onCheckboxChange: (checked: boolean, groupName: string) => void;
}) => {
  const { hosts } = props;
  return (
    <>
      {hosts.map((host, index) => (
        <Tr key={index} id={host.fqdn}>
          {props.showCheckboxColumn && (
            <Td
              select={{
                rowIndex: index,
                onSelect: (_e, isSelected) =>
                  props.onCheckboxChange(isSelected, host.fqdn),
                isSelected: props.checkedItems.includes(host.fqdn),
              }}
            />
          )}
          <Td>{host.fqdn}</Td>
          <Td>{host.description}</Td>
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
        className={"pf-v6-u-mt-md"}
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
      className={"pf-v6-u-mt-md"}
      id="managed-by-table"
      isStickyHeader
    >
      <Thead>
        <Tr>
          {props.onCheckItemsChange && <Th />}
          <Th modifier="wrap">Host name</Th>
          <Th modifier="wrap">Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {!props.showTableRows ? (
          skeleton
        ) : hosts.length === 0 ? (
          <EmptyBodyTable />
        ) : (
          <HostsTableBody
            hosts={hosts}
            showCheckboxColumn={showCheckboxColumn}
            onCheckboxChange={onCheckboxChange}
            checkedItems={props.checkedItems || []}
          />
        )}
      </Tbody>
    </Table>
  );
}
