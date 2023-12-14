import {
  Table /* data-codemods */,
  TableVariant,
  Tbody,
  Thead,
} from "@patternfly/react-table";
import React from "react";

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
      <Tbody>{props.tableBody}</Tbody>
    </Table>
  );
};

export default TableLayout;
