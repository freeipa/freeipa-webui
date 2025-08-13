import React from "react";
// PatternFly
import { Content } from "@patternfly/react-core";
// Hooks
import { ApiError } from "src/hooks/useApiError";
// Utils
import { apiErrorToJsXError } from "src/utils/utils";

interface GlobalErrorProps {
  errors: ApiError[];
}

const GlobalErrors = ({ errors }: GlobalErrorProps) => {
  return (
    <div style={{ alignSelf: "center", marginTop: "16px" }}>
      <Content component="h3">An error has occurred</Content>
      <>
        {errors.map((error: ApiError, idx: number) => {
          return apiErrorToJsXError(error.error, error.context, idx.toString());
        })}
      </>
    </div>
  );
};

export default GlobalErrors;
