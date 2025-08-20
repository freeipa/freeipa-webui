import { Table, TableVariant, Tbody, Thead } from "@patternfly/react-table";
import React from "react";
import EmptyBodyTable from "../../tables/EmptyBodyTable";

export interface PropsToTable {
  ariaLabel: string;
  name?: string;
  variant: TableVariant | "compact";
  hasBorders: boolean;
  classes?: string;
  tableId: string;
  isStickyHeader: boolean;
  tableHeader?: JSX.Element;
  tableBody: JSX.Element[] | JSX.Element;
}

const TableLayout = (props: PropsToTable) => {
  let body = props.tableBody;
  if (Array.isArray(props.tableBody) && props.tableBody.length === 0) {
    body = <EmptyBodyTable />;
  }

  return (
    <Table
      aria-label={props.ariaLabel}
      name={props.name}
      variant={props.variant}
      borders={props.hasBorders}
      className={props.classes}
      id={props.tableId}
      isStickyHeader={props.isStickyHeader}
    >
      <Thead>{props.tableHeader}</Thead>
      <Tbody>{body}</Tbody>
    </Table>
  );
};

export default TableLayout;
