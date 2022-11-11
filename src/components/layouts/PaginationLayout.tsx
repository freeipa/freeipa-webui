// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
// PatternFly
import { Pagination } from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";

interface PropsToPaginationLayout {
  list: User[];
  perPage: number;
  page: number;
  variant?: "top" | "bottom";
  handleSetPage: (
    _evt: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage?: number,
    startIdx?: number,
    endIdx?: number
  ) => void;
  handleSetPerPage: (
    _evt: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
    startIdx?: number,
    endIdx?: number
  ) => void;
  perPageComponent?: "div" | "button";
  widgetId: string | undefined;
  className?: string;
  isCompact?: boolean;
}

const PaginationLayout = (props: PropsToPaginationLayout) => {
  return (
    <Pagination
      perPageComponent={props.perPageComponent}
      className={props.className}
      itemCount={props.list.length}
      widgetId={props.widgetId}
      perPage={props.perPage}
      page={props.page}
      variant={props.variant}
      onSetPage={props.handleSetPage}
      onPerPageSelect={props.handleSetPerPage}
      isCompact={props.isCompact}
    />
  );
};

export default PaginationLayout;
