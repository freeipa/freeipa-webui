// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import {
  TableComposable,
  TableVariant,
  Tbody,
  Thead,
} from "@patternfly/react-table";
import React from "react";

export interface PropsToTable {
  ariaLabel: string;
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
    <TableComposable
      aria-label={props.ariaLabel}
      variant={props.variant}
      borders={props.hasBorders}
      className={props.classes}
      id={props.tableId}
      isStickyHeader={props.isStickyHeader}
    >
      <Thead>{props.tableHeader}</Thead>
      <Tbody>{props.tableBody}</Tbody>
    </TableComposable>
  );
};

export default TableLayout;
