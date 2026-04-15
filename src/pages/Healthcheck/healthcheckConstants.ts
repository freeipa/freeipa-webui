import type { CSSProperties } from "react";
import {
  c_scroll_outer_wrapper_MaxHeight,
  c_scroll_outer_wrapper_MinHeight,
} from "@patternfly/react-tokens";

/** Default path passed to ``healthcheck_log_show`` on the IPA server. */
export const DEFAULT_HEALTHCHECK_REPORT_FILE =
  "/var/log/ipa/healthcheck/healthcheck.log";

/** Sentinel value for the checks multi-select “select all / clear all” row. */
export const CHECKS_ALL_OPTION = "__all_checks__";

/** Sentinel value for the severities multi-select “select all / clear all” row. */
export const SEVERITY_SELECT_ALL_OPTION = "__all_severities__";

/** Shared PatternFly layout classes for severity summary bar segment buttons. */
export const SEVERITY_BAR_BUTTON_CLASSNAME =
  "pf-v5-u-flex-grow-1 pf-v5-u-display-flex pf-v5-u-flex-direction-column " +
  "pf-v5-u-align-items-center pf-v5-u-justify-content-center pf-v5-u-py-md " +
  "pf-v5-u-px-md";

export const SORT_HEADER_BUTTON_CLASSNAME =
  "pf-v5-u-background-color-transparent pf-v5-u-border-0 pf-v5-u-p-0 " +
  "pf-v5-u-font-size-md pf-v5-u-font-weight-bold";

/**
 * PatternFly ``Table`` scroll outer wrapper token overrides (see table-scrollable).
 * Uses official variable names from ``@patternfly/react-tokens`` — no ad-hoc
 * ``height`` / ``overflow`` rules that fight the component stylesheet.
 */
export const HEALTHCHECK_TABLE_SCROLL_OUTER_VARS = {
  [c_scroll_outer_wrapper_MaxHeight.name]: "65vh",
  [c_scroll_outer_wrapper_MinHeight.name]: "0",
} as CSSProperties;

const DETAILS_NEWLINE_RE = /\s*\n+\s*/g;
const DETAILS_BRACES_RE = /[{}]/g;
const DETAILS_MULTI_SPACE_RE = /\s{2,}/g;

/**
 * Collapses newlines, strips braces, and normalizes spaces so the Details column
 * fits one readable line in the compact table.
 */
export function formatDetailsForDisplay(details: string): string {
  return details
    .replace(DETAILS_NEWLINE_RE, " | ")
    .replace(DETAILS_BRACES_RE, "")
    .replace(DETAILS_MULTI_SPACE_RE, " ")
    .replace(/\s*\|\s*/g, " | ")
    .trim();
}
