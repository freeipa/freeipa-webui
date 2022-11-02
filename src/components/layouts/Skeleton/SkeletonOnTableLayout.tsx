import React from "react";
// PatternFly
import { Td, Tr } from "@patternfly/react-table";
// Layouts
import SkeletonLayout from "./SkeletonLayout";

interface PropsToSkeletonTable {
  // Table-specific variables
  rows: number;
  colSpan?: number;
  // Skeleton-specific variables
  className?: string;
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  height?: string;
  screenreaderText?: string;
  shape?: "circle" | "square";
  width?: string;
}

const SkeletonOnTableLayout = (propsToSkeletonTable: PropsToSkeletonTable) => {
  // Generating rows to JSX
  const prepareRows = () => {
    const rows: JSX.Element[] = [];

    for (let i = 0; i < propsToSkeletonTable.rows; i++) {
      rows.push(
        <Tr key={"row" + (i + 1)}>
          <Td colSpan={propsToSkeletonTable.colSpan}>
            <SkeletonLayout
              className={propsToSkeletonTable.className}
              fontSize={propsToSkeletonTable.fontSize}
              height={propsToSkeletonTable.height}
              screenreaderText={propsToSkeletonTable.screenreaderText}
              shape={propsToSkeletonTable.shape}
              width={propsToSkeletonTable.width}
            />
          </Td>
        </Tr>
      );
    }
    return rows;
  };

  const rowsStructure = prepareRows();

  // Render 'SkeletonOnTableLayout'
  return <>{rowsStructure.map((row) => row)}</>;
};

export default SkeletonOnTableLayout;
