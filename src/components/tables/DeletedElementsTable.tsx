/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableLayout from "src/components/layouts/TableLayout";

export interface PropsToDeletedElementsTable {
  elementsList: any[];
  elementsToDelete: string[];
  columnNames: string[];
  elementType: string;
}

const DeletedElementsTable = (props: PropsToDeletedElementsTable) => {
  // TODO: Check the columnNames against the actual variable name
  //   when retrieving data from the RPC server.

  // Given the id, retrieve full element info to display into table
  const elementsToDelete: any = [];
  props.elementsList.map((element) => {
    props.elementsToDelete.map((selected) => {
      if (element.id === selected) {
        elementsToDelete.push(element);
      }
    });
  });

  // Generate the actual column names
  // - Given the 'columnNames' provided via props, infer to get
  //    the actual values that will be display in the table headers.
  const [columnNames, setColumnNames] = useState<string[]>([]);
  useEffect(() => {
    const colNamesArray: string[] = [];
    props.columnNames.map((column) => {
      const result = column.replace(/([A-Z])/g, " $1");
      const simplifiedName = result.charAt(0).toUpperCase() + result.slice(1);
      colNamesArray.push(simplifiedName);
    });
    setColumnNames(colNamesArray);
  }, []);

  // Define table header and body
  const header = (
    <Tr>
      {columnNames.map((columnName, idx) => (
        <Th modifier="wrap" key={idx}>
          {columnName}
        </Th>
      ))}
    </Tr>
  );

  const body = elementsToDelete.map((element) => (
    <Tr key={element.id} id={element.id}>
      {props.columnNames.map((columnName, idx) => (
        <Td key={idx} dataLabel={columnName}>
          {element[columnName]}
        </Td>
      ))}
    </Tr>
  ));

  // Render 'DeletedUsersTable'
  return (
    <TableLayout
      ariaLabel={"Remove " + props.elementType + " table"}
      variant={"compact"}
      hasBorders={true}
      tableId={"remove-" + props.elementType + "-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={body}
    />
  );
};

export default DeletedElementsTable;
