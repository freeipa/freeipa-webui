import React from "react";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Layouts
import PaginationLayout from "src/components/layouts/PaginationLayout";

interface PaginationData {
  page: number;
  perPage: number;
  updatePage: (newPage: number) => void;
  updatePerPage: (newSetPerPage: number) => void;
  showTableRows: boolean;
  updateShowTableRows: (value: boolean) => void;
  updateSelectedPerPage: (selected: number) => void;
  updateShownHostsList: (newShownUsersList: Host[]) => void;
}

interface PropsToPaginationPrep {
  list: Host[];
  paginationData: PaginationData;
  variant?: "top" | "bottom";
  widgetId?: string | undefined;
  perPageComponent?: "div" | "button";
  className?: string;
  isCompact?: boolean;
}

const PaginationHostsPrep = (props: PropsToPaginationPrep) => {
  // Refresh displayed users every time users list changes (from Redux or somewhere else)
  React.useEffect(() => {
    props.paginationData.updatePage(1);
    if (props.paginationData.showTableRows)
      props.paginationData.updateShowTableRows(false);
    setTimeout(() => {
      props.paginationData.updateShownHostsList(
        props.list.slice(0, props.paginationData.perPage)
      );
      props.paginationData.updateShowTableRows(true);
      // Reset 'selectedPerPage'
      props.paginationData.updateSelectedPerPage(0);
    }, 2000);
  }, [props.list]);

  // Handle content on 'setPage'
  const handleSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    props.paginationData.updatePage(newPage);
    props.paginationData.updateShowTableRows(false);
    setTimeout(() => {
      props.paginationData.updateShownHostsList(
        props.list.slice(startIdx, endIdx)
      );
      props.paginationData.updateShowTableRows(true);
      // Reset 'selectedPerPage'
      props.paginationData.updateSelectedPerPage(0);
    }, 2000);
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
    props.paginationData.updateShowTableRows(false);
    setTimeout(() => {
      props.paginationData.updateShownHostsList(
        props.list.slice(startIdx, endIdx)
      );
      props.paginationData.updateShowTableRows(true);
      // Reset 'selectedPerPage'
      props.paginationData.updateSelectedPerPage(0);
    }, 2000);
  };

  return (
    <PaginationLayout
      list={props.list}
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

export default PaginationHostsPrep;
