import React from "react";

import { Spinner } from "@patternfly/react-core";

export function DataSpinner() {
  return (
    <Spinner
      
      style={{ alignSelf: "center", marginTop: "15%" }}
      aria-label="Loading Data..."
    />
  );
}

export default DataSpinner;
