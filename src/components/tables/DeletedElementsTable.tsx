/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import {
  HBACRule,
  HBACService,
  HBACServiceGroup,
  Host,
  HostGroup,
  IDView,
  Netgroup,
  Service,
  SudoCmd,
  SudoCmdGroup,
  SudoRule,
  UserGroup,
} from "src/utils/datatypes/globalDataTypes";
import { Condition } from "src/services/rpcAutomember";

/*
 * Goal: Show already selected elements ready to delete in a table.
 *
 * Parameters:
 *  - 'mode':
 *     · "passing_id": When the passed data are id names. When using this
 *        mode, there is no need to pass the 'elementsList' (this is meant for
 *        managing the whole data). Instead, the elements to delete can be passed
 *        via 'elementsToDelete' variable.
 *             Eg: ['user123', 'user456', 'user789']: string[]
 *     · "passing_full_data": When the passed data has more complexity
 *        than only a few strings. When using this mode, the 'elementsList'
 *        variable (to pass the full data) must be used.
 *             Eg: [{ userID: 'user123', first: "John", last: "Snow", ...}, {...}]: User[]
 *  - 'elementsList':
 *     · List of full-data elements. This will be compared against the 'elementsToDelete'
 *       to retrieve the whole element.
 *  - 'elementsToDelete':
 *     · List of elements to delete (by ID).
 *  - 'columnNames':
 *     · Column names to show in the table.
 *  - 'elementType':
 *     · String used to set the 'ariaLabel' and the table ID.
 *  - 'idAttr':
 *     · The attribute in the entry that is used as its identifier.
 */

export interface PropsToDeletedElementsTable {
  mode: "passing_id" | "passing_full_data";
  elementsToDelete:
    | string[]
    | HBACRule[]
    | HBACService[]
    | HBACServiceGroup[]
    | Host[]
    | HostGroup[]
    | Netgroup[]
    | Service[]
    | SudoCmdGroup[]
    | SudoRule[]
    | UserGroup[]
    | IDView[]
    | SudoCmd[]
    | Condition[];
  columnNames: string[];
  columnIds?: string[];
  elementType: string;
  idAttr: string;
}

const DeletedElementsTable = (props: PropsToDeletedElementsTable) => {
  // TODO: Check the columnNames against the actual variable name
  //   when retrieving data from the RPC server.
  let elementsToDelete: any = [];
  switch (props.mode) {
    case "passing_full_data":
      // We already have our list of objs to delete
      elementsToDelete = props.elementsToDelete;
      break;
    case "passing_id":
      props.elementsToDelete.map((userName) => {
        elementsToDelete.push(userName);
      });
  }

  // Generate the actual column names
  // - Given the 'columnNames' provided via props, infer to get
  //    the actual values that will be display in the table headers.
  const [columnNames, setColumnNames] = useState<string[]>([]);
  useEffect(() => {
    const colNamesArray: string[] = [];
    if (props.mode === "passing_full_data") {
      props.columnNames.map((column) => {
        const result = column.replace(/([A-Z])/g, " $1");
        const simplifiedName = result.charAt(0).toUpperCase() + result.slice(1);
        colNamesArray.push(simplifiedName);
      });
      setColumnNames(colNamesArray);
    } else {
      // In passing_id mode the comlumn names do not require adjusting
      setColumnNames(props.columnNames);
    }
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

  const getBody = () => {
    if (props.mode === "passing_full_data") {
      return elementsToDelete.map((element) => {
        return (
          <Tr key={element[props.idAttr]} id={element[props.idAttr]}>
            {props.columnIds === undefined
              ? props.columnNames.map((columnName, idx) => {
                  // Tr elements will be based on columnNames (that should match with the object keys)
                  return (
                    <Td key={idx} dataLabel={columnName}>
                      {element[columnName]}
                    </Td>
                  );
                })
              : props.columnIds.map((columnId, idx) => {
                  // Tr elements will be based on columnId.
                  // This is useful when don't want to show the column names
                  //   with a customized name (and not based on its ID)
                  return (
                    <Td key={idx} dataLabel={columnId}>
                      {element[columnId]}
                    </Td>
                  );
                })}
          </Tr>
        );
      });
    } else if (props.mode === "passing_id") {
      return elementsToDelete.map((element) => (
        <Tr key={element} id={element}>
          {element && <Td dataLabel={element}>{element}</Td>}
        </Tr>
      ));
    }
  };

  const body = getBody();

  // Parse 'elementType' to not have spaces and have lowercase
  const elementTypeNoSpaces = props.elementType
    .replace(/\s/g, "-")
    .toLowerCase();

  // Render 'DeletedElementsTable'
  return (
    <TableLayout
      ariaLabel={"Remove " + props.elementType + "s table"}
      variant={"compact"}
      hasBorders={true}
      tableId={"remove-" + elementTypeNoSpaces + "s-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={body}
    />
  );
};

export default DeletedElementsTable;
