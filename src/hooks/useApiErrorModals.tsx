import React from "react";
import { Button } from "@patternfly/react-core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "src/components/modals/ErrorModal";
import { ErrorData } from "src/utils/datatypes/globalDataTypes";

const useApiError = () => {
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("code" in error) {
      setErrorTitle("IPA error " + error.code + ": " + error.name);
      if (error.message !== undefined) {
        setErrorMessage(error.message);
      }
    } else if ("data" in error) {
      const errorData = error.data as ErrorData;
      const errorCode = errorData.code;
      const errorName = errorData.name;
      const errorMessageContent = errorData.error;

      setErrorTitle("IPA error " + errorCode + ": " + errorName);
      setErrorMessage(errorMessageContent);
    } else {
      setErrorTitle("Unexpected error");
      setErrorMessage(JSON.stringify(error));
    }
    setIsModalErrorOpen(true);
  };

  const errorModalActions = [
    <Button
      data-cy="modal-button-ok"
      key="cancel"
      variant="link"
      onClick={closeAndCleanErrorParameters}
    >
      OK
    </Button>,
  ];

  const ErrorModalComponent = (
    <>
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="api-error-modal"
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={closeAndCleanErrorParameters}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );

  return {
    handleAPIError,
    ErrorModalComponent,
  };
};

export default useApiError;
