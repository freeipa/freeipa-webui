import React from "react";
import { Pagination } from "@patternfly/react-core";
import { useSearchParams } from "react-router";
import { parsePage, parsePerPage } from "src/hooks/useListPageSearchParams";

/** Local override for non-list UIs (e.g. SettingsTableLayout). When omitted, uses URL `p`/`size`. */
export interface PaginationData {
  page: number;
  perPage: number;
  onUpdatePage: (newPage: number) => void;
  onUpdatePerPage: (newPerPage: number) => void;
}

interface PropsToPaginationPrep<T> {
  list: T[];
  totalCount: number;
  paginationData?: PaginationData;
  variant?: "top" | "bottom";
  widgetId?: string;
  className?: string;
  isCompact?: boolean;
  perPageSize?: "sm";
}

const DEFAULT_PER_PAGE_OPTIONS = [
  { title: "10", value: 10 },
  { title: "20", value: 20 },
  { title: "50", value: 50 },
  { title: "100", value: 100 },
];

const SMALL_PER_PAGE_OPTIONS = [
  { title: "5", value: 5 },
  { title: "10", value: 10 },
  { title: "20", value: 20 },
  { title: "50", value: 50 },
];

const PaginationLayout = <T,>(props: PropsToPaginationPrep<T>) => {
  const [params, setParams] = useSearchParams();
  const page = props.paginationData?.page ?? parsePage(params.get("p"));
  const perPage =
    props.paginationData?.perPage ?? parsePerPage(params.get("size"));

  const updatePage = (newPage: number) => {
    if (props.paginationData !== undefined) {
      props.paginationData.onUpdatePage(newPage);
      return;
    }

    const nextPage = Math.max(1, newPage);
    setParams(
      (currentParams) => {
        if (nextPage > 1) {
          currentParams.set("p", nextPage.toString());
        } else {
          currentParams.delete("p");
        }
        return currentParams;
      },
      { replace: true }
    );
  };

  const updatePageAndPerPage = (newPage: number, newPerPage: number) => {
    if (props.paginationData !== undefined) {
      props.paginationData.onUpdatePerPage(newPerPage);
      props.paginationData.onUpdatePage(newPage);
      return;
    }
    const nextPage = Math.max(1, newPage);
    const nextPerPage = Math.max(1, newPerPage);
    setParams(
      (currentParams) => {
        currentParams.set("size", nextPerPage.toString());
        if (nextPage > 1) {
          currentParams.set("p", nextPage.toString());
        } else {
          currentParams.delete("p");
        }
        return currentParams;
      },
      { replace: true }
    );
  };

  const handleSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number
  ) => {
    updatePage(newPage);
  };

  const handlePerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    updatePageAndPerPage(newPage, newPerPage);
  };

  // Ensure page is always at least 1 to prevent negative display values
  const safePage = Math.max(1, page);
  const itemCount = props.totalCount > 0 ? props.totalCount : props.list.length;

  return (
    <Pagination
      className={props.className}
      itemCount={itemCount}
      widgetId={props.widgetId}
      perPage={perPage}
      page={safePage}
      variant={props.variant}
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      isCompact={props.isCompact}
      perPageOptions={
        props.perPageSize === "sm"
          ? SMALL_PER_PAGE_OPTIONS
          : DEFAULT_PER_PAGE_OPTIONS
      }
    />
  );
};

export default PaginationLayout;
