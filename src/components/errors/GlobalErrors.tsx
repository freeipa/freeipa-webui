import React from "react";
// Hooks
import { ApiError } from "src/hooks/useApiError";
// Utils
import { apiErrorToJsXError } from "src/utils/utils";
// Component
import TextLayout from "../layouts/TextLayout";

interface GlobalErrorProps {
  errors: ApiError[];
}

const GlobalErrors = ({ errors }: GlobalErrorProps) => {
  return (
    <div style={{ alignSelf: "center", marginTop: "16px" }}>
      <TextLayout component="h3">An error has occurred</TextLayout>
      <>
        {errors.map((error: ApiError, idx: number) => {
          return apiErrorToJsXError(error.error, error.context, idx.toString());
        })}
      </>
    </div>
  );
};

export default GlobalErrors;
