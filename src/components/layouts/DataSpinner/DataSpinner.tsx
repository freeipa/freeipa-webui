import React from "react";

import { Spinner } from "@patternfly/react-core";

function DataSpinner() {
  return (
    <Spinner
      style={{ alignSelf: "center", marginTop: "15%", marginLeft: "50%" }}
      aria-label="Loading Data..."
    />
  );
}

export default DataSpinner;
