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
  PaginationVariant,
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
  onSearchChange: (value: string) => void;
  searchValue: string;
  // pagination
  paginationData: PaginationData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any[];
  entryCount: number;
  entryType: string;
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
  return (
    <>
      <Flex>
        <FlexItem>
          {props.entryCount > 0 && (
            <SearchInput
              placeholder={"Filter by ..."}
              value={props.searchValue}
              onChange={(_event, value: string) => props.onSearchChange(value)}
              onClear={() => props.onSearchChange("")}
            />
          )}
        </FlexItem>
        {props.paginationData.totalCount > 0 && (
          <>
            <FlexItem>
              <SecondaryButton
                classname="pf-v5-u-mr-sm"
                isDisabled={props.isDeleteDisabled}
                onClickHandler={props.onDeleteModal}
              >
                Delete
              </SecondaryButton>
              <SecondaryButton
                classname="pf-v5-u-mr-sm"
                onClickHandler={props.onAddModal}
              >
                Add {props.entryType}
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
          <PaginationLayout
            list={props.list}
            paginationData={props.paginationData}
            variant={PaginationVariant.bottom}
            widgetId="pagination-options-menu-bottom"
            className="pf-v5-u-pb-0 pf-v5-u-pr-md"
            perPageSize="sm"
          />
        </>
      ) : (
        <EmptyState variant={EmptyStateVariant.xs}>
          <EmptyStateHeader
            titleText={
              "No " +
              props.entryType +
              "s" +
              (props.entryCount > 0 ? " found" : "")
            }
            headingLevel="h6"
          />
          <EmptyStateBody>
            <EmptyStateActions>
              <SecondaryButton onClickHandler={props.onAddModal}>
                Add {props.entryType}
              </SecondaryButton>
            </EmptyStateActions>
          </EmptyStateBody>
        </EmptyState>
      )}
    </>
  );
};

export default SettingsTableLayout;
