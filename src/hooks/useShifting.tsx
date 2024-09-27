import React from "react";

export const useShifting = (
  tableEntryList,
  changeRowSelected: (newValue) => void
) => {
  const [shifting, setShifting] = React.useState(false);
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = React.useState<
    number | null
  >(null);

  // - Helper method to set the selected users from the table
  const setRowSelected = (user: string, isSelecting = true) =>
    changeRowSelected((prevSelected) => {
      const otherSelectedUsers = prevSelected.filter((r) => r !== user);
      return isSelecting ? [...otherSelectedUsers, user] : otherSelectedUsers;
    });

  // Keyboard event to select rows
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // - On selecting one single row
  const onSelectRow = (row: string, rowIndex: number, isSelecting: boolean) => {
    // If the element is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(
              new Array(numberSelected + 1),
              (_x, i) => i + recentSelectedRowIndex
            )
          : Array.from(
              new Array(Math.abs(numberSelected) + 1),
              (_x, i) => i + rowIndex
            );
      intermediateIndexes.forEach((index) =>
        setRowSelected(tableEntryList[index], isSelecting)
      );
    } else {
      setRowSelected(row, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
  };

  return onSelectRow;
};

export default useShifting;
