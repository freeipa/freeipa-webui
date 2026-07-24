/**
 * IPA attributes are often multi-valued string[]; the primary key is the first value.
 */
export function ipaPrimaryKey(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

/**
 * Count how many of the currently shown page elements are in the selection.
 */
export function countSelectedOnPage<T>(
  shownElements: T[],
  selectedKeys: Iterable<string>,
  getKey: (item: T) => string
): number {
  const keys =
    selectedKeys instanceof Set ? selectedKeys : new Set(selectedKeys);
  return shownElements.filter((el) => keys.has(getKey(el))).length;
}

/**
 * Derives selected-per-page count for bulk selector / table pagination data.
 * `updateSelectedPerPage` is a no-op kept for API compatibility with tables
 * that still call it after row selection.
 */
export function getSelectedPerPageData<T>(
  shownElements: T[],
  selectedKeys: Iterable<string>,
  getKey: (item: T) => string
) {
  return {
    selectedPerPage: countSelectedOnPage(shownElements, selectedKeys, getKey),
    updateSelectedPerPage: (selected: number) => {
      void selected;
    },
  };
}
