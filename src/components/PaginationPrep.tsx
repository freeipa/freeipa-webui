/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// Layouts
import PaginationLayout from "src/components/layouts/PaginationLayout";

interface PaginationData {
  page: number;
  perPage: number;
  updatePage: (newPage: number) => void;
  updatePerPage: (newSetPerPage: number) => void;
  showTableRows: boolean;
  updateSelectedPerPage: (selected: number) => void;
  updateShownElementsList: (newShownElementsList: any[]) => void;
  totalCount: number;
}

interface PropsToPaginationPrep {
  list: any[];
  paginationData: PaginationData;
  variant?: "top" | "bottom";
  widgetId?: string | undefined;
  perPageComponent?: "div" | "button";
  className?: string;
  isCompact?: boolean;
}

const PaginationPrep = (props: PropsToPaginationPrep) => {
  // Handle content on 'setPage'
  const handleSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    props.paginationData.updatePage(newPage);
    if (props.paginationData.showTableRows) {
      // Load is finished. Data must show.
      props.paginationData.updateShownElementsList(
        props.list.slice(startIdx, endIdx)
      );
      // Reset 'selectedPerPage'
      props.paginationData.updateSelectedPerPage(0);
    } else {
      // Loading. Still no data.
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
    if (props.paginationData.showTableRows) {
      // Load is finished. Data must show.
      props.paginationData.updateShownElementsList(
        props.list.slice(startIdx, endIdx)
      );
      // Reset 'selectedPerPage'
      props.paginationData.updateSelectedPerPage(0);
    } else {
      // Loading. Still no data.
    }
  };

  return (
    <PaginationLayout
      list={props.list}
      totalCount={props.paginationData.totalCount}
      perPage={props.paginationData.perPage}
      page={props.paginationData.page}
      handleSetPerPage={handlePerPageSelect}
      handleSetPage={handleSetPage}
      variant={props.variant}
      perPageComponent={props.perPageComponent}
      widgetId={props.widgetId}
      className={props.className}
      isCompact={props.isCompact}
    />
  );
};

export default PaginationPrep;
