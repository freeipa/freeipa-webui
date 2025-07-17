import React from "react";
// PatternFly
import { Flex, FlexItem } from "@patternfly/react-core";
import { TableVariant } from "@patternfly/react-table";
// Layout
import SecondaryButton from "./SecondaryButton";
import TableLayout from "./TableLayout";

export interface PropsToTableWithButtons {
  // Table
  ariaLabel: string;
  name?: string;
  variant: TableVariant | "compact";
  hasBorders: boolean;
  tableClasses?: string;
  tableId: string;
  isStickyHeader: boolean;
  tableHeader?: JSX.Element;
  tableBody: JSX.Element[] | JSX.Element;
  // Buttons
  deleteButtonClasses?: string;
  onDeleteModal: () => void;
  isDeleteDisabled?: boolean;
  addButtonClasses?: string;
  onAddModal: () => void;
}

const TableWithButtonsLayout = (props: PropsToTableWithButtons) => {
  return (
    <>
      <Flex>
        <FlexItem>
          <SecondaryButton
            dataCy="table-button-delete"
            classname={props.deleteButtonClasses}
            isDisabled={props.isDeleteDisabled}
            onClickHandler={props.onDeleteModal}
          >
            Delete
          </SecondaryButton>
          <SecondaryButton
            dataCy="table-button-add"
            classname={props.addButtonClasses}
            onClickHandler={props.onAddModal}
          >
            Add
          </SecondaryButton>
        </FlexItem>
      </Flex>
      <TableLayout
        ariaLabel={props.ariaLabel}
        name={props.name}
        variant={props.variant}
        hasBorders={props.hasBorders}
        classes={props.tableClasses}
        tableId={props.tableId}
        isStickyHeader={props.isStickyHeader}
        tableHeader={props.tableHeader}
        tableBody={props.tableBody}
      />
    </>
  );
};

export default TableWithButtonsLayout;
