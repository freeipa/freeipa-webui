import React from "react";
import { Th, Td } from "@patternfly/react-table";
import { Tooltip } from "@patternfly/react-core";
import { HostGroup } from "src/utils/datatypes/globalDataTypes";

interface HostGroupDNColumnProps {
  // for header cell
  isHeader?: boolean;

  // for data cell
  hostGroup?: HostGroup;
  rowIndex?: number;
}

/**
 * Component that renders a DN (Distinguished Name) column for the Host Groups table
 */
export const HostGroupDNColumn = (props: HostGroupDNColumnProps) => {
  const { isHeader, hostGroup } = props;

  // header cell rendering
  if (isHeader) {
    return <Th modifier="wrap">Distinguished Name</Th>;
  }

  // render data cell (if hostGroup is provided)
  if (hostGroup && hostGroup.dn) {
    // DN is long, so shortenned version is displayed + tooltip
    const fullDN = hostGroup.dn;
    const displayDN =
      fullDN.length > 40 ? `${fullDN.substring(0, 37)}...` : fullDN;

    return (
      <Td dataLabel="Distinguished Name">
        <Tooltip content={fullDN} maxWidth="500px">
          <span>{displayDN}</span>
        </Tooltip>
      </Td>
    );
  }

  // empty cell fallback
  return <Td dataLabel="Distinguished Name">-</Td>;
};
