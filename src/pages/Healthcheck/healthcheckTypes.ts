/**
 * Types for the Healthcheck results table sort controls (column + direction).
 */

/** Sortable table column keys (must match header buttons). */
export type HealthcheckSortColumn =
  | "timestamp"
  | "check"
  | "source"
  | "result"
  | "details";

/** Sort direction for column headers. */
export type HealthcheckSortDirection = "asc" | "desc";
