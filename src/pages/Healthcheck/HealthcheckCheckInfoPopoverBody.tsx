import React from "react";
import {
  FREEIPA_HEALTHCHECK_REPO_URL,
  getHealthcheckCheckDocumentation,
} from "./healthcheckCheckDocs";
import type { HealthcheckTableRow } from "./healthcheckUtils";

type HealthcheckCheckInfoPopoverBodyProps = {
  row: HealthcheckTableRow;
};

/**
 * Body content for the check info popover: optional text from ``healthcheckCheckDocs``,
 * the run’s user message (or fallback), and a link to the upstream repo.
 */
export function HealthcheckCheckInfoPopoverBody({
  row,
}: HealthcheckCheckInfoPopoverBodyProps) {
  const doc = getHealthcheckCheckDocumentation(row.source, row.check);
  return (
    <div className="pf-v5-u-white-space-pre-wrap">
      {doc ? (
        <>
          <p className="pf-v5-u-font-weight-bold pf-v5-u-mb-sm">
            How this check works
          </p>
          <p className="pf-v5-u-mb-md">{doc}</p>
        </>
      ) : null}
      <p className="pf-v5-u-font-weight-bold pf-v5-u-mb-sm">
        Message from this run
      </p>
      {row.userMessage !== "" ? (
        <p className="pf-v5-u-mb-md">{row.userMessage}</p>
      ) : (
        <p className="pf-v5-u-color-200 pf-v5-u-mb-md">
          No user message in this report entry. See the <strong>Details</strong>{" "}
          column for full output.
        </p>
      )}
      <p className="pf-v5-u-font-size-sm pf-v5-u-color-200 pf-v5-u-mb-0">
        Upstream check reference:{" "}
        <a href={FREEIPA_HEALTHCHECK_REPO_URL} target="_blank" rel="noreferrer">
          freeipa-healthcheck
        </a>{" "}
        on GitHub (sources, plugins, and interpreting results).
      </p>
    </div>
  );
}
