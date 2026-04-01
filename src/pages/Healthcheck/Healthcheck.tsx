import React from "react";
// PatternFly
import {
  Button,
  Divider,
  Flex,
  FlexItem,
  FormGroup,
  Popover,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  Select,
  SelectList,
  SelectOption,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";
// Redux — route/title only; data via hook
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { useHealthcheckData } from "src/hooks/useHealthcheckData";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";

import {
  type HealthcheckKnownSeverity,
  buildHealthcheckTableRows,
  collectHealthcheckItems,
  filterHealthcheckBySeverities,
  hasAnyCriticalHealthcheckResult,
  hasAnyKnownSeverityMessages,
  HEALTHCHECK_KNOWN_RESULT_LEVELS,
  HEALTHCHECK_SEVERITY_DISPLAY_ORDER,
  healthcheckSeveritySortRank,
  isEmptyHealthcheckJsonArray,
  type HealthcheckTableRow,
} from "./healthcheckUtils";
import {
  CHECKS_ALL_OPTION,
  SEVERITY_SELECT_ALL_OPTION,
} from "./healthcheckConstants";
import type {
  HealthcheckSortColumn,
  HealthcheckSortDirection,
} from "./healthcheckTypes";
import { HealthcheckResultsTable } from "./HealthcheckResultsTable";
import { HealthcheckSeverityBar } from "./HealthcheckSeverityBar";

/** Initial severity multi-select: all known levels selected. */
const DEFAULT_SELECTED_SEVERITIES: HealthcheckKnownSeverity[] = [
  ...HEALTHCHECK_SEVERITY_DISPLAY_ORDER,
];

/**
 * Healthcheck report page: loads JSON via ``useHealthcheckData``, filters by
 * severity and check-name multi-selects, and shows a sortable results table.
 */
const Healthcheck = () => {
  const { browserTitle } = useUpdateRoute({ pathname: "healthcheck" });

  const {
    checksData,
    meta,
    isLoading,
    cachedSeverityCounts,
    reload: onApply,
  } = useHealthcheckData();

  const [selectedSeverities, setSelectedSeverities] = React.useState<
    HealthcheckKnownSeverity[]
  >(() => [...DEFAULT_SELECTED_SEVERITIES]);
  const [isSeverityOpen, setIsSeverityOpen] = React.useState(false);
  const [isChecksOpen, setIsChecksOpen] = React.useState(false);
  const [selectedChecks, setSelectedChecks] = React.useState<string[]>([]);
  const [sortColumn, setSortColumn] =
    React.useState<HealthcheckSortColumn>("timestamp");
  const [sortDirection, setSortDirection] =
    React.useState<HealthcheckSortDirection>("desc");

  const displayPayload = React.useMemo(() => {
    if (checksData === null) {
      return { kind: "none" as const };
    }
    if (selectedSeverities.length === 0) {
      return { kind: "no-severity" as const };
    }
    const filtered = filterHealthcheckBySeverities(
      checksData,
      new Set(selectedSeverities)
    );
    if (isEmptyHealthcheckJsonArray(filtered)) {
      return { kind: "empty" as const };
    }
    if (!hasAnyKnownSeverityMessages(filtered)) {
      return { kind: "empty" as const };
    }
    return {
      kind: "table" as const,
      filtered,
    };
  }, [checksData, selectedSeverities]);

  const tableRows = React.useMemo(() => {
    if (displayPayload.kind !== "table") {
      return [];
    }
    return buildHealthcheckTableRows(displayPayload.filtered);
  }, [displayPayload]);

  /** Distinct check names in the full report (ignores severity). */
  const allReportCheckNames = React.useMemo(() => {
    if (checksData === null) {
      return [];
    }
    const seen = new Set<string>();
    for (const item of collectHealthcheckItems(checksData)) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const c = (item as Record<string, unknown>).check;
      if (typeof c === "string" && c.trim() !== "" && c.trim() !== "—") {
        seen.add(c.trim());
      }
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [checksData]);

  /**
   * Check names present under the current severity filter; if that set is empty
   * (e.g. no rows match) fall back to all report checks so the Checks control stays usable.
   */
  const availableChecks = React.useMemo(() => {
    if (checksData === null || selectedSeverities.length === 0) {
      return [];
    }
    const filtered = filterHealthcheckBySeverities(
      checksData,
      new Set(selectedSeverities)
    );
    const seen = new Set<string>();
    for (const item of collectHealthcheckItems(filtered)) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const c = (item as Record<string, unknown>).check;
      if (typeof c === "string" && c.trim() !== "" && c.trim() !== "—") {
        seen.add(c.trim());
      }
    }
    const fromFilter = Array.from(seen).sort((a, b) => a.localeCompare(b));
    return fromFilter.length > 0 ? fromFilter : allReportCheckNames;
  }, [checksData, selectedSeverities, allReportCheckNames]);

  const sortedRows = React.useMemo(() => {
    const copy: HealthcheckTableRow[] = [...tableRows];
    const dir = sortDirection === "asc" ? 1 : -1;
    const valueFor = (row: HealthcheckTableRow): string => {
      if (sortColumn === "timestamp") {
        return row.timestampRaw;
      }
      if (sortColumn === "check") {
        return row.check;
      }
      if (sortColumn === "source") {
        return row.source;
      }
      if (sortColumn === "result") {
        return row.result;
      }
      return row.details;
    };
    copy.sort((a, b) => {
      if (sortColumn === "result") {
        const ra = healthcheckSeveritySortRank(a.result);
        const rb = healthcheckSeveritySortRank(b.result);
        if (ra !== rb) {
          return sortDirection === "desc" ? ra - rb : rb - ra;
        }
      } else {
        const av = valueFor(a);
        const bv = valueFor(b);
        if (av !== bv) {
          return av > bv ? dir : -dir;
        }
      }
      const ra = healthcheckSeveritySortRank(a.result);
      const rb = healthcheckSeveritySortRank(b.result);
      if (ra !== rb) {
        return ra - rb;
      }
      return 0;
    });
    return copy;
  }, [tableRows, sortColumn, sortDirection]);

  const availableChecksSet = React.useMemo(
    () => new Set(availableChecks),
    [availableChecks]
  );

  /** After load failure clears data, allow the next successful load to select all checks again. */
  const hasAutoSelectedChecksRef = React.useRef(false);
  React.useEffect(() => {
    if (checksData === null) {
      hasAutoSelectedChecksRef.current = false;
    }
  }, [checksData]);

  React.useEffect(() => {
    setSelectedChecks((prev) =>
      prev.filter((check) => availableChecksSet.has(check))
    );
  }, [availableChecksSet]);

  /** First successful load (or load after error): select all checks so the table is not empty by default. */
  React.useEffect(() => {
    if (availableChecks.length === 0) {
      return;
    }
    if (!hasAutoSelectedChecksRef.current && selectedChecks.length === 0) {
      setSelectedChecks([...availableChecks]);
      hasAutoSelectedChecksRef.current = true;
    }
  }, [availableChecks, selectedChecks.length]);

  const visibleRows = React.useMemo(() => {
    if (selectedChecks.length === 0) {
      return [];
    }
    const selected = new Set(selectedChecks);
    return sortedRows.filter((row) => selected.has(row.check));
  }, [sortedRows, selectedChecks]);

  /**
   * Table header click: toggles asc/desc when the same column is active; otherwise
   * switches column (timestamp defaults to desc, others to asc).
   */
  const onSortColumn = (column: HealthcheckSortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(column);
    setSortDirection(column === "timestamp" ? "desc" : "asc");
  };

  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  const allSeveritiesSelected =
    selectedSeverities.length === HEALTHCHECK_KNOWN_RESULT_LEVELS.size;

  const severityToggleLabel =
    selectedSeverities.length === 0
      ? "Severities (none selected)"
      : allSeveritiesSelected
        ? "Severities (all selected)"
        : `Severities (${selectedSeverities.length} selected)`;

  const applyDisabled = isLoading;

  const showChecksFilter =
    checksData !== null && selectedSeverities.length > 0;

  return (
    <>
      <PageSection
        id="healthcheck-header"
        hasBodyWrapper={false}
        isWidthLimited
      >
        <Flex
          alignItems={{ default: "alignItemsFlexStart" }}
          justifyContent={{ default: "justifyContentSpaceBetween" }}
          gap={{ default: "gapMd" }}
          flexWrap={{ default: "wrap" }}
        >
          <FlexItem>
            <Flex
              alignItems={{ default: "alignItemsCenter" }}
              gap={{ default: "gapSm" }}
            >
              <TitleLayout
                id="healthcheck-page"
                headingLevel="h1"
                text="Healthcheck"
                size="3xl"
                className="pf-v5-u-font-weight-bold"
              />
              <Popover
                aria-label="Healthcheck report source information"
                maxWidth="32rem"
                bodyContent={
                  <div>
                    <p>
                      Load the IPA Healthcheck JSON report generated on this
                      server.
                    </p>
                    <p className="pf-v5-u-mt-sm pf-v5-u-mb-0">
                      <code> /var/log/ipa/healthcheck/healthcheck.log</code>
                    </p>
                  </div>
                }
              >
                <Button
                  variant="plain"
                  hasNoPadding
                  icon={<InfoCircleIcon />}
                  aria-label="Healthcheck report source information"
                  data-cy="healthcheck-title-info"
                />
              </Popover>
            </Flex>
          </FlexItem>
          <FlexItem className="pf-v5-u-ml-auto">
            <p
              className="pf-v5-u-font-size-sm pf-v5-u-color-200 pf-v5-u-mt-xs pf-v5-u-mb-0"
              data-cy="healthcheck-version"
            >
              {`ipa-healthcheck: ${meta?.healthcheck_version ?? "unavailable"}`}
              <br />
              {`IPA: ${meta?.ipa_version ?? "unavailable"}`}
              <br />
              {`PKI: ${meta?.pki_version ?? "unavailable"}`}
            </p>
          </FlexItem>
        </Flex>
      </PageSection>
      <Divider />
      {cachedSeverityCounts !== null ? (
        <PageSection id="healthcheck-severity-bar">
          <HealthcheckSeverityBar
            counts={cachedSeverityCounts}
            onSelectSeverity={(value) => setSelectedSeverities([value])}
          />
        </PageSection>
      ) : null}
      <PageSection id="healthcheck-actions" isWidthLimited>
        <Stack hasGutter>
          <StackItem>
            <FormGroup fieldId="healthcheck-actions-toolbar" label="">
              <Flex
                alignItems={{ default: "alignItemsCenter" }}
                gap={{ default: "gapMd" }}
                flexWrap={{ default: "wrap" }}
              >
                <FlexItem>
                  <Flex gap={{ default: "gapSm" }}>
                    <Button
                      id="healthcheck-apply"
                      data-cy="healthcheck-button-apply"
                      variant="primary"
                      onClick={onApply}
                      isDisabled={applyDisabled}
                    >
                      Apply
                    </Button>
                    <Button
                      id="healthcheck-refresh"
                      data-cy="healthcheck-button-refresh"
                      variant="secondary"
                      onClick={onApply}
                      isDisabled={applyDisabled}
                      aria-label="Refresh healthcheck results"
                    >
                      Refresh
                    </Button>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <div data-cy="healthcheck-severity-select">
                    <Select
                      aria-label="Filter by result severity"
                      data-cy="healthcheck-select-severity"
                      isOpen={isSeverityOpen}
                      onOpenChange={setIsSeverityOpen}
                      selected={selectedSeverities}
                      onSelect={(_e, value) => {
                        const v = String(value) as
                          | HealthcheckKnownSeverity
                          | typeof SEVERITY_SELECT_ALL_OPTION;
                        if (v === SEVERITY_SELECT_ALL_OPTION) {
                          setSelectedSeverities((prev) => {
                            const everySelected =
                              prev.length ===
                                HEALTHCHECK_KNOWN_RESULT_LEVELS.size &&
                              DEFAULT_SELECTED_SEVERITIES.every((s) =>
                                prev.includes(s)
                              );
                            return everySelected
                              ? []
                              : [...DEFAULT_SELECTED_SEVERITIES];
                          });
                          return;
                        }
                        const sev = v as HealthcheckKnownSeverity;
                        setSelectedSeverities((prev) =>
                          prev.includes(sev)
                            ? prev.filter((s) => s !== sev)
                            : [...prev, sev]
                        );
                      }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsSeverityOpen(!isSeverityOpen)}
                          isExpanded={isSeverityOpen}
                          data-cy="healthcheck-select-severity-toggle"
                        >
                          {severityToggleLabel}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption
                          key={SEVERITY_SELECT_ALL_OPTION}
                          value={SEVERITY_SELECT_ALL_OPTION}
                          hasCheckbox
                          isSelected={allSeveritiesSelected}
                          data-cy="healthcheck-select-severity-all"
                        >
                          All severities
                        </SelectOption>
                        {HEALTHCHECK_SEVERITY_DISPLAY_ORDER.map((sev) => (
                          <SelectOption
                            key={sev}
                            value={sev}
                            hasCheckbox
                            isSelected={selectedSeverities.includes(sev)}
                            data-cy={`healthcheck-select-severity-${sev.toLowerCase()}`}
                          >
                            {sev}
                          </SelectOption>
                        ))}
                      </SelectList>
                    </Select>
                  </div>
                </FlexItem>
                {showChecksFilter ? (
                  <FlexItem>
                    <div data-cy="healthcheck-check-filter">
                      <Select
                        aria-label="Filter by checks"
                        data-cy="healthcheck-select-checks"
                        isOpen={isChecksOpen}
                        onOpenChange={setIsChecksOpen}
                        selected={selectedChecks}
                        onSelect={(_e, value) => {
                          const check = String(value);
                          if (check === CHECKS_ALL_OPTION) {
                            setSelectedChecks((prev) =>
                              prev.length === availableChecks.length
                                ? []
                                : [...availableChecks]
                            );
                            return;
                          }
                          setSelectedChecks((prev) =>
                            prev.includes(check)
                              ? prev.filter((item) => item !== check)
                              : [...prev, check]
                          );
                        }}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsChecksOpen(!isChecksOpen)}
                            isExpanded={isChecksOpen}
                            data-cy="healthcheck-select-checks-toggle"
                          >
                            {selectedChecks.length === 0
                              ? "Checks (none selected)"
                              : selectedChecks.length === availableChecks.length
                                ? "Checks (all selected)"
                                : `Checks (${selectedChecks.length} selected)`}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption
                            key={CHECKS_ALL_OPTION}
                            value={CHECKS_ALL_OPTION}
                            hasCheckbox
                            isSelected={
                              selectedChecks.length === availableChecks.length
                            }
                            data-cy="healthcheck-select-check-all"
                          >
                            All
                          </SelectOption>
                          {availableChecks.map((check) => (
                            <SelectOption
                              key={check}
                              value={check}
                              hasCheckbox
                              isSelected={selectedChecks.includes(check)}
                              data-cy={`healthcheck-select-check-${check}`}
                            >
                              {check}
                            </SelectOption>
                          ))}
                        </SelectList>
                      </Select>
                    </div>
                  </FlexItem>
                ) : null}
              </Flex>
            </FormGroup>
          </StackItem>
        </Stack>
      </PageSection>
      <PageSection id="healthcheck-content" isWidthLimited>
        {isLoading ? (
          <DataSpinner />
        ) : checksData !== null ? (
          <Flex direction={{ default: "column" }}>
            {displayPayload.kind === "no-severity" ? (
              <p
                className="pf-v5-u-color-200"
                data-cy="healthcheck-no-severity-selected"
              >
                Select at least one severity to show results.
              </p>
            ) : displayPayload.kind === "table" ? (
              <Flex direction={{ default: "column" }}>
                {!hasAnyCriticalHealthcheckResult(displayPayload.filtered) ? (
                  <FlexItem className="pf-v5-u-mb-md">
                    <p
                      className="pf-v5-u-font-weight-bold pf-v5-u-font-size-md"
                      data-cy="healthcheck-no-critical-banner"
                    >
                      No critical-severity findings in this report.
                    </p>
                  </FlexItem>
                ) : null}
                <FlexItem className="pf-v5-u-flex-grow-1 pf-v5-u-overflow-hidden">
                  <HealthcheckResultsTable
                    visibleRows={visibleRows}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSortColumn={onSortColumn}
                  />
                </FlexItem>
                {visibleRows.length === 0 ? (
                  <FlexItem className="pf-v5-u-mt-md">
                    <p
                      className="pf-v5-u-color-200"
                      data-cy="healthcheck-no-selected-checks"
                    >
                      No checks selected.
                    </p>
                  </FlexItem>
                ) : null}
              </Flex>
            ) : (
              <p
                className="pf-v5-u-color-200"
                data-cy="healthcheck-no-messages"
              >
                No messages.
              </p>
            )}
          </Flex>
        ) : (
          <p className="pf-v5-u-color-200">
            Click <strong>Apply</strong> or <strong>Refresh</strong> to load or
            refresh results.
          </p>
        )}
      </PageSection>
    </>
  );
};

/** Route-level default export wired from ``AppRoutes``. */
export default Healthcheck;
