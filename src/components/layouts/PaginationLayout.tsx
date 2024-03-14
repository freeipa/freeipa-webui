/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Pagination } from "@patternfly/react-core";

interface PaginationData {
  page: number;
  perPage: number;
  updatePage: (newPage: number) => void;
  updatePerPage: (newSetPerPage: number) => void;
  updateSelectedPerPage: (selected: number) => void;
  updateShownElementsList: (newShownElementsList: any[]) => void;
  totalCount: number;
}

interface PropsToPaginationPrep {
  list: any[];
  paginationData: PaginationData;
  variant?: "top" | "bottom";
  widgetId?: string | undefined;
  className?: string;
  isCompact?: boolean;
}

const PaginationLayout = (props: PropsToPaginationPrep) => {
  // Handle content on 'setPage'
  const handleSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    props.paginationData.updatePage(newPage);
    props.paginationData.updateShownElementsList(
      props.list.slice(startIdx, endIdx)
    );
    // Reset 'selectedPerPage'
    props.paginationData.updateSelectedPerPage(0);
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
    props.paginationData.updateShownElementsList(
      props.list.slice(startIdx, endIdx)
    );
    // Reset 'selectedPerPage'
    props.paginationData.updateSelectedPerPage(0);
  };

  return (
    <Pagination
      className={props.className}
      itemCount={
        props.paginationData.totalCount
          ? props.paginationData.totalCount
          : props.list.length
      }
      widgetId={props.widgetId}
      perPage={props.paginationData.perPage}
      page={props.paginationData.page}
      variant={props.variant}
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      isCompact={props.isCompact}
    />
  );
};

export default PaginationLayout;
