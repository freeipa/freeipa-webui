import React from "react";
import { Button, Flex, Label } from "@patternfly/react-core";
import {
  type HealthcheckKnownSeverity,
  type HealthcheckSeverityCounts,
  healthcheckResultLabelColor,
} from "./healthcheckUtils";
import { SEVERITY_BAR_BUTTON_CLASSNAME } from "./healthcheckConstants";

const SEVERITY_SUMMARY_ORDER: {
  key: keyof HealthcheckSeverityCounts;
  label: string;
}[] = [
  { key: "SUCCESS", label: "SUCCESS" },
  { key: "ERROR", label: "ERROR" },
  { key: "WARNING", label: "WARNING" },
  { key: "CRITICAL", label: "CRITICAL" },
];

type HealthcheckSeverityBarProps = {
  counts: HealthcheckSeverityCounts;
  /** Invoked with one severity so the page can narrow the checkbox filter quickly. */
  onSelectSeverity: (value: HealthcheckKnownSeverity) => void;
};

/**
 * Horizontal summary of SUCCESS/ERROR/WARNING/CRITICAL counts; each segment is
 * a button that calls ``onSelectSeverity`` with that level.
 */
export function HealthcheckSeverityBar({
  counts,
  onSelectSeverity,
}: HealthcheckSeverityBarProps) {
  return (
    <div
      role="region"
      aria-label="Results by severity"
      data-cy="healthcheck-severity-summary"
    >
      <Flex gap={{ default: "gapSm" }} flexWrap={{ default: "nowrap" }}>
        {SEVERITY_SUMMARY_ORDER.map(({ key, label }) => (
          <Button
            key={key}
            variant="secondary"
            className={SEVERITY_BAR_BUTTON_CLASSNAME}
            data-cy={`healthcheck-severity-count-${key}`}
            onClick={() => onSelectSeverity(key)}
            aria-label={`Show ${label} checks`}
            title={`Show ${label} checks`}
          >
            <Label color={healthcheckResultLabelColor(label)} isCompact>
              {label}
            </Label>
            <span className="pf-v5-u-font-size-xl pf-v5-u-font-weight-bold pf-v5-u-mt-sm">
              {counts[key]}
            </span>
          </Button>
        ))}
      </Flex>
    </div>
  );
}
