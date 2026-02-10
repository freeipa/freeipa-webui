/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Pagination } from "@patternfly/react-core";

interface PaginationData {
  page: number;
  perPage: number;
  updatePage: (newPage: number) => void;
  updatePerPage: (newSetPerPage: number) => void;
  updateSelectedPerPage?: (selected: number) => void;
  updateShownElementsList?: (newShownElementsList: any[]) => void;
  totalCount: number;
}

interface PropsToPaginationPrep {
  list: any[];
  paginationData: PaginationData;
  variant?: "top" | "bottom";
  widgetId?: string | undefined;
  className?: string;
  isCompact?: boolean;
  perPageSize?: "sm" | "default";
}

const PaginationLayout = (props: PropsToPaginationPrep) => {
  let perPageOptions = [
    { title: "10", value: 10 },
    { title: "20", value: 20 },
    { title: "50", value: 50 },
    { title: "100", value: 100 },
  ];

  const handleSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    props.paginationData.updatePage(newPage);
    if (props.paginationData.updateShownElementsList) {
      props.paginationData.updateShownElementsList(
        props.list.slice(startIdx, endIdx)
      );
    }
    // Reset 'selectedPerPage'
    if (props.paginationData.updateSelectedPerPage) {
      props.paginationData.updateSelectedPerPage(0);
    }
  };

  // Handle content on 'perPageSelect'
  const handlePerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    props.paginationData.updatePerPage(newPerPage);
    props.paginationData.updatePage(newPage);
    if (props.paginationData.updateShownElementsList) {
      props.paginationData.updateShownElementsList(
        props.list.slice(startIdx, endIdx)
      );
    }
    // Reset 'selectedPerPage'
    if (props.paginationData.updateSelectedPerPage) {
      props.paginationData.updateSelectedPerPage(0);
    }
  };

  if (props.perPageSize !== undefined && props.perPageSize === "sm") {
    perPageOptions = [
      { title: "5", value: 5 },
      { title: "10", value: 10 },
      { title: "20", value: 20 },
      { title: "50", value: 50 },
    ];
  }

  // Ensure page is always at least 1 to prevent negative display values
  const safePage = Math.max(1, props.paginationData.page);

  const itemCount =
    props.paginationData.totalCount > 0
      ? props.paginationData.totalCount
      : props.list.length;

  return (
    <Pagination
      className={props.className}
      itemCount={itemCount}
      widgetId={props.widgetId}
      perPage={props.paginationData.perPage}
      page={safePage}
      variant={props.variant}
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      isCompact={props.isCompact}
      perPageOptions={perPageOptions}
    />
  );
};

export default PaginationLayout;
