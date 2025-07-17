import React, { useState } from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Data types
import { ErrorData, SudoCmd } from "src/utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
import { BatchRPCResponse } from "src/services/rpc";
import { useRemoveSudoCmdsMutation } from "src/services/rpcSudoCmds";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedCmdsData {
  selectedCmds: SudoCmd[];
  clearSelectedCmds: () => void;
}

export interface PropsToDeleteRules {
  show: boolean;
  handleModalToggle: () => void;
  selectedCmdsData: SelectedCmdsData;
  buttonsData: ButtonsData;
  onRefresh?: () => void;
}

const DeleteSudoCmd = (props: PropsToDeleteRules) => {
  // Alerts
  const alerts = useAlerts();

  // Define the column names that will be displayed on the confirmation table.
  // - NOTE: Camel-case should match with the property to show as it is defined in the data.
  //    This variable will be coverted into word.
  const deleteColumnNames = ["sudocmd", "description"];

  const [executeRulesDelCommand] = useRemoveSudoCmdsMutation();

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to remove the selected sudo commands?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "deleted-rules-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.selectedCmdsData.selectedCmds}
          columnNames={deleteColumnNames}
          elementType="Sudo command"
          idAttr="sudocmd"
        />
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  // Handle API error data
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
  };

  const errorModalActions = [
    <Button
      key="cancel"
      variant="link"
      onClick={onCloseErrorModal}
      data-cy="modal-button-ok"
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
      const errorCode = errorData.code as string;
      const errorName = errorData.name as string;
      const errorMessage = errorData.error as string;

      setErrorTitle("IPA error " + errorCode + ": " + errorName);
      setErrorMessage(errorMessage);
    }
    setIsModalErrorOpen(true);
  };

  const deleteRules = () => {
    setBtnSpinning(true);

    // Delete elements
    executeRulesDelCommand(props.selectedCmdsData.selectedCmds).then(
      (response) => {
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
              props.selectedCmdsData.clearSelectedCmds();
              props.buttonsData.updateIsDeleteButtonDisabled(true);
              props.buttonsData.updateIsDeletion(true);

              alerts.addAlert(
                "remove-sudo-commands-success",
                "Sudo commands removed",
                "success"
              );

              setBtnSpinning(false);
              closeModal();
              // Refresh data
              if (props.onRefresh !== undefined) {
                props.onRefresh();
              }
            }
          }
        }
      }
    );
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-sudo-commands"
      variant="danger"
      onClick={deleteRules}
      form="delete-sudo-commands-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
      data-cy="modal-button-delete"
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      key="cancel-delete-sudo-commands"
      variant="link"
      onClick={closeModal}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  const modalDelete: JSX.Element = (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        dataCy="delete-sudo-commands-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove sudo commands"
        formId="remove-sudo-commands-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalActionsDelete}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-sudo-commands-modal-error"
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );

  return modalDelete;
};

export default DeleteSudoCmd;
