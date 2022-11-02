import React from "react";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import PaginationLayout from "src/components/layouts/PaginationLayout";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  setSelectedPerPage,
  setShowTableRows,
} from "src/store/shared/shared-slice";

interface PropsToPaginationPrep {
  list: User[]; // TODO: Multi-type
  page: number;
  perPage: number;
  updatePage: (newPage: number) => void;
  updatePerPage: (newSetPerPage: number) => void;
  updateShownUsersList: (newShownUsersList: User[]) => void;
  variant?: "top" | "bottom";
  widgetId?: string | undefined;
  perPageComponent?: "div" | "button";
  className?: string;
  isCompact?: boolean;
}

const PaginationPrep = (props: PropsToPaginationPrep) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Get shared props
  const showTableRows = useAppSelector((state) => state.shared.showTableRows);

  // Refresh displayed users every time users list changes (from Redux or somewhere else)
  React.useEffect(() => {
    props.updatePage(1);
    if (showTableRows) dispatch(setShowTableRows(false));
    setTimeout(() => {
      props.updateShownUsersList(props.list.slice(0, props.perPage));
      dispatch(setShowTableRows(true));
      // Reset 'selectedPerPage'
      dispatch(setSelectedPerPage(0));
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
    props.updatePage(newPage);
    dispatch(setShowTableRows(false));
    setTimeout(() => {
      props.updateShownUsersList(props.list.slice(startIdx, endIdx));
      dispatch(setShowTableRows(true));
      // Reset 'selectedPerPage'
      dispatch(setSelectedPerPage(0));
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
    props.updatePerPage(newPerPage);
    props.updatePage(newPage);
    dispatch(setShowTableRows(false));
    setTimeout(() => {
      props.updateShownUsersList(props.list.slice(startIdx, endIdx));
      dispatch(setShowTableRows(true));
      // Reset 'selectedPerPage'
      dispatch(setSelectedPerPage(0));
    }, 2000);
  };

  return (
    <PaginationLayout
      list={props.list}
      perPage={props.perPage}
      page={props.page}
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
