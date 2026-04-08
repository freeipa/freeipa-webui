import React from "react";
import { Button, Content, Flex, Label, Popover } from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";
import {
  InnerScrollContainer,
  OuterScrollContainer,
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import {
  formatDetailsForDisplay,
  HEALTHCHECK_TABLE_SCROLL_OUTER_VARS,
  SORT_HEADER_BUTTON_CLASSNAME,
} from "./healthcheckConstants";
import type {
  HealthcheckSortColumn,
  HealthcheckSortDirection,
} from "./healthcheckTypes";
import { healthcheckResultLabelColor, type HealthcheckTableRow } from "./healthcheckUtils";
import { HealthcheckCheckInfoPopoverBody } from "./HealthcheckCheckInfoPopoverBody";

type HealthcheckResultsTableProps = {
  visibleRows: HealthcheckTableRow[];
  sortColumn: HealthcheckSortColumn;
  sortDirection: HealthcheckSortDirection;
  onSortColumn: (column: HealthcheckSortColumn) => void;
};

/**
 * Scrollable PatternFly table of healthcheck rows with sortable headers, severity
 * labels, formatted details, and per-row check info popovers.
 */
export function HealthcheckResultsTable({
  visibleRows,
  sortColumn,
  sortDirection,
  onSortColumn,
}: HealthcheckResultsTableProps) {
  /** Arrow or neutral glyph shown next to the active sort column label. */
  const sortArrow = (column: HealthcheckSortColumn) => {
    if (sortColumn !== column) {
      return "↕";
    }
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <OuterScrollContainer style={HEALTHCHECK_TABLE_SCROLL_OUTER_VARS}>
      <InnerScrollContainer>
        <Table
          id="healthcheck-results-table"
          aria-label="Healthcheck results"
          variant={TableVariant.compact}
          borders
          isStriped
        >
          <Thead>
            <Tr>
              <Th modifier="wrap" width={20}>
                <button
                  type="button"
                  className={SORT_HEADER_BUTTON_CLASSNAME}
                  onClick={() => onSortColumn("timestamp")}
                >
                  Timestamp {sortArrow("timestamp")}
                </button>
              </Th>
              <Th modifier="wrap" width={25}>
                <button
                  type="button"
                  className={SORT_HEADER_BUTTON_CLASSNAME}
                  onClick={() => onSortColumn("check")}
                >
                  Check {sortArrow("check")}
                </button>
              </Th>
              <Th modifier="wrap" width={20}>
                <button
                  type="button"
                  className={SORT_HEADER_BUTTON_CLASSNAME}
                  onClick={() => onSortColumn("source")}
                >
                  Source {sortArrow("source")}
                </button>
              </Th>
              <Th modifier="wrap" width={10}>
                <button
                  type="button"
                  className={SORT_HEADER_BUTTON_CLASSNAME}
                  onClick={() => onSortColumn("result")}
                >
                  Result {sortArrow("result")}
                </button>
              </Th>
              <Th modifier="wrap">
                <button
                  type="button"
                  className={SORT_HEADER_BUTTON_CLASSNAME}
                  onClick={() => onSortColumn("details")}
                >
                  Details {sortArrow("details")}
                </button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {visibleRows.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel="Timestamp">
                  <span className="pf-v5-u-font-size-sm">{row.timestamp}</span>
                </Td>
                <Td dataLabel="Check">
                  <Flex
                    alignItems={{ default: "alignItemsCenter" }}
                    gap={{ default: "gapSm" }}
                    flexWrap={{ default: "nowrap" }}
                  >
                    <span>{row.check}</span>
                    <Popover
                      aria-label={`Information for check ${row.check}`}
                      bodyContent={
                        <HealthcheckCheckInfoPopoverBody row={row} />
                      }
                    >
                      <Button
                        variant="plain"
                        hasNoPadding
                        icon={<InfoCircleIcon />}
                        aria-label={`Information for check ${row.check}`}
                        data-cy="healthcheck-check-user-info"
                      />
                    </Popover>
                  </Flex>
                </Td>
                <Td dataLabel="Source">
                  <span className="pf-v5-u-font-size-sm">{row.source}</span>
                </Td>
                <Td dataLabel="Result">
                  <Label
                    color={healthcheckResultLabelColor(row.result)}
                    isCompact
                  >
                    {row.result}
                  </Label>
                </Td>
                <Td dataLabel="Details">
                  {row.details ? (
                    <Content
                      component="pre"
                      className="pf-v5-u-font-size-sm pf-v5-u-white-space-pre-wrap pf-v5-u-m-0"
                    >
                      {formatDetailsForDisplay(row.details)}
                    </Content>
                  ) : (
                    "—"
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </InnerScrollContainer>
    </OuterScrollContainer>
  );
}
