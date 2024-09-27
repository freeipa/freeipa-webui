import React from "react";

/**
 *
 * @param tableList List of items to be paginated
 * @param initialPerPage Number of items per page
 * @returns page, perPage, totalCount, firstIdx, lastIdx, setTotalCount, updateSelectedPerPage, updatePage, updatePerPage
 */
export const usePagination = (tableList, initialPerPage) => {
  const [page, setPage] = React.useState<number>(1);
  const [perPage, setPerPage] = React.useState<number>(initialPerPage);
  const [totalCount, setTotalCount] = React.useState<number>(tableList.length);

  const [firstIdx, setFirstIdx] = React.useState<number>((page - 1) * perPage);
  const [lastIdx, setLastIdx] = React.useState<number>(page * perPage);

  const updateSelectedPerPage = () => {
    // Nothing to do since we are not using bulk selector comp
    // TODO: Implement functionality to bulk selector component
    return;
  };
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  return {
    page,
    updatePage,
    perPage,
    updatePerPage,
    firstIdx,
    setFirstIdx,
    lastIdx,
    setLastIdx,
    totalCount,
    setTotalCount,
    updateSelectedPerPage,
  };
};
