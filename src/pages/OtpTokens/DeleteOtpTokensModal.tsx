import React from "react";
// PatternFly
import {
  Button,
  Content,
  ContentVariants,
  Spinner,
} from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import { useDeleteOtpTokensMutation } from "src/services/rpcOtpTokens";
// Data types
import { OtpToken, ErrorData } from "src/utils/datatypes/globalDataTypes";
import { BatchRPCResponse } from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "src/components/modals/ErrorModal";

interface DeleteOtpTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: OtpToken[];
  clearSelectedElements: () => void;
  columnNames: string[]; // E.g. ["OTP Token Name", "OTP Token Type"]
  keyNames: string[]; // E.g. for otp_token.name, otp_token.type --> ["name", "type"]
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeleteOtpTokensModal = (props: DeleteOtpTokensModalProps) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [deleteOtpTokens] = useDeleteOtpTokensMutation();

  // States
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // Handle API error data
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
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
      const errorMessage = errorData.error;

      setErrorTitle("IPA error " + errorCode + ": " + errorName);
      setErrorMessage(errorMessage);
    }
    setIsModalErrorOpen(true);
  };

  const onDelete = () => {
    setBtnSpinning(true);

    const elementsToDelete = props.elementsToDelete.map((element) =>
      element.ipatokenuniqueid?.toString()
    );

    deleteOtpTokens(elementsToDelete)
      .then((response) => {
        if ("data" in response) {
          const data = response.data as BatchRPCResponse;
          const result = data.result;

          if (result) {
            if ("error" in result.results[0] && result.results[0].error) {
              const errorData = {
                code: result.results[0].error_code,
                name: result.results[0].error_name,
                error: result.results[0].error,
              } as ErrorData;

              const error = {
                status: "CUSTOM_ERROR",
                data: errorData,
              } as FetchBaseQueryError;

              // Handle error
              handleAPIError(error);
            } else {
              props.clearSelectedElements();
              props.updateIsDeleteButtonDisabled(true);
              props.updateIsDeletion(true);

              dispatch(
                addAlert({
                  name: "remove-otp-tokens-success",
                  title: "OTP tokens removed",
                  variant: "success",
                })
              );
            }
          }
        }
      })
      .finally(() => {
        setBtnSpinning(false);
        props.onClose();
        props.onRefresh();
      });
  };

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to delete the selected entries?
        </Content>
      ),
    },
    {
      id: "deleted-elements-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.elementsToDelete}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="OTP token" // the final 's' is handled by the component
          idAttr={"ipatokenuniqueid"}
        />
      ),
    },
  ];

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key="delete-otp-tokens"
      variant="danger"
      onClick={onDelete}
      form="delete-otp-tokens-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? (
        <>
          <Spinner size="sm" />
          {"Deleting"}
        </>
      ) : (
        "Delete"
      )}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-delete-otp-tokens"
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="delete-otp-tokens-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove OTP tokens"
        formId="delete-otp-tokens-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActionsDelete}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-otp-tokens-modal-error"
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={closeAndCleanErrorParameters}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default DeleteOtpTokensModal;
