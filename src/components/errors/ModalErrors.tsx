import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Hooks
import { ApiError } from "src/hooks/useApiError";
import ErrorModal from "../modals/ErrorModal";

interface ModalErrorProps {
  errors: ApiError[];
}

const ModalErrors = ({ errors }: ModalErrorProps) => {
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    if (errors.length > 0) {
      setIsModalErrorOpen(true);
      setErrorTitle(errors[0].title || "IPA error");
      setErrorMessage(errors[0].context);
    }
  }, [errors]);

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
  };

  const errorModalActions = [
    <Button key="cancel" variant="link" onClick={onCloseErrorModal}>
      Cancel
    </Button>,
  ];

  return (
    <>
      {isModalErrorOpen && (
        <ErrorModal
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default ModalErrors;
