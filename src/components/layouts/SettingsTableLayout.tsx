import React from "react";
// PatternFly
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateVariant,
  Flex,
  FlexItem,
  SearchInput,
} from "@patternfly/react-core";
import { TableVariant } from "@patternfly/react-table";
// Layout
import SecondaryButton from "./SecondaryButton";
import TableLayout from "./TableLayout";
import PaginationLayout from "./PaginationLayout";

export interface PropsToSettingsTableLayout {
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
  onDeleteModal: () => void;
  isDeleteDisabled?: boolean;
  onAddModal: () => void;
  isAddDisabled?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  // pagination
  paginationData: PaginationData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any[];
  entryCount: number;
  entryType: string;
  extraID?: string;
}

interface PaginationData {
  page: number;
  perPage: number;
  updatePage: (newPage: number) => void;
  updatePerPage: (newSetPerPage: number) => void;
  updateSelectedPerPage: (selected: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateShownElementsList: (newShownElementsList: any[]) => void;
  totalCount: number;
}

// The settings table is meant to be used in the "settings" page for users,
// hosts, etc.  We need smaller sized pagination, and other differences that
// are ideal in a crowded page where space is limited

const SettingsTableLayout = (props: PropsToSettingsTableLayout) => {
  const extraId = props.extraID ? props.extraID : "";
  // Prepare ID for the Add buttons
  // - Should contain the entry type in lowercase and spaces replaced by dashes
  const addButtonId = extraId
    ? "add-" + extraId + "-" + props.entryType.toLowerCase().replace(" ", "-")
    : "add-" + props.entryType.toLowerCase().replace(" ", "-");

  return (
    <>
      <Flex>
        <FlexItem>
          {props.entryCount > 0 && props.onSearchChange !== undefined && (
            <SearchInput
              placeholder={"Filter by ..."}
              value={props.searchValue}
              onChange={(_event, value: string) =>
                props.onSearchChange && props.onSearchChange(value)
              }
              onClear={() => props.onSearchChange && props.onSearchChange("")}
            />
          )}
        </FlexItem>
        {props.paginationData.totalCount > 0 && (
          <>
            <FlexItem>
              <SecondaryButton
                classname="pf-v5-u-mr-sm"
                isDisabled={props.isDeleteDisabled || false}
                onClickHandler={props.onDeleteModal}
              >
                Delete
              </SecondaryButton>
              <SecondaryButton
                classname="pf-v5-u-mr-sm"
                isDisabled={props.isAddDisabled || false}
                onClickHandler={props.onAddModal}
                id={addButtonId}
              >
                Add {props.entryType.toLowerCase()}s
              </SecondaryButton>
            </FlexItem>
            <FlexItem align={{ default: "alignRight" }}>
              <PaginationLayout
                list={props.list}
                paginationData={props.paginationData}
                widgetId="pagination-options-menu-bottom"
                className="pf-v5-u-pb-0 pf-v5-u-pr-md"
                perPageSize="sm"
              />
            </FlexItem>
          </>
        )}
      </Flex>
      {props.paginationData.totalCount > 0 ? (
        <>
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
      ) : (
        <EmptyState variant={EmptyStateVariant.xs}>
          <EmptyStateHeader
            titleText={
              "No " +
              props.entryType.toLowerCase() +
              "s " +
              (props.entryCount > 0 ? " found" : "")
            }
            headingLevel="h6"
          />
          <EmptyStateBody>
            <EmptyStateActions>
              <SecondaryButton
                onClickHandler={props.onAddModal}
                isDisabled={props.isAddDisabled || false}
                id={addButtonId}
              >
                Add {props.entryType.toLowerCase()}s
              </SecondaryButton>
            </EmptyStateActions>
          </EmptyStateBody>
        </EmptyState>
      )}
    </>
  );
};

export default SettingsTableLayout;
