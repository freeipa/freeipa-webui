import React from "react";
// Redux toolkit
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

type RawApiError = FetchBaseQueryError | SerializedError;

export interface ApiError {
  error: RawApiError;
  context: string;
  key: string;
  title?: string;
}

const useApiError = (errors: ApiError[]) => {
  const [errorsList, setErrorsList] = React.useState<ApiError[]>(errors);

  // - Catch API errors and write them in the error's list ('apiErrors')
  const addError = (
    errorFromApiCall: FetchBaseQueryError | SerializedError | undefined,
    contextMessage: string,
    key: string,
    title?: string
  ) => {
    if (errorFromApiCall !== undefined) {
      setErrorsList((prevErrors) => {
        const errors = prevErrors.filter((error) => error.key !== key);
        return [
          ...errors,
          {
            error: errorFromApiCall,
            key: key,
            context: contextMessage,
            title: title || "",
          },
        ];
      });
    }
  };

  // Remove error by key
  const removeError = (key: string) => {
    setErrorsList(errorsList.filter((error) => error.key !== key));
  };

  // - Remove all errors
  const clear = () => {
    setErrorsList([]);
  };

  // Get all errors
  const getAll = () => {
    return errorsList;
  };

  // Get error by key
  const get = (key: string) => {
    return errorsList.filter((error) => error.key === key)[0];
  };

  return {
    addError,
    removeError,
    clear,
    getAll,
    get,
  };
};

export default useApiError;
