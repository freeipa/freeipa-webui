import React, { useState } from "react";
// PatternFly
import { Content, ContentVariants, Button } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
// Hooks
import { addAlert } from "src/store/alerts";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Data types
import { ErrorData, SudoRule } from "src/utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
import { BatchRPCResponse } from "src/services/rpc";
import { useRemoveSudoRulesMutation } from "src/services/rpcSudoRules";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedRulesData {
  selectedRules: SudoRule[];
  clearSelectedRules: () => void;
}

interface PropsToDeleteRules {
  show: boolean;
  handleModalToggle: () => void;
  selectedRulesData: SelectedRulesData;
  buttonsData: ButtonsData;
  onRefresh?: () => void;
}

const DeleteSudoRule = (props: PropsToDeleteRules) => {
  // Alerts

  // Define the column names that will be displayed on the confirmation table.
  // - NOTE: Camel-case should match with the property to show as it is defined in the data.
  //    This variable will be coverted into word.
  const deleteColumnNames = ["cn", "description"];

  const [executeRulesDelCommand] = useRemoveSudoRulesMutation();

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to remove the selected rules?
        </Content>
      ),
    },
    {
      id: "deleted-rules-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.selectedRulesData.selectedRules}
          columnNames={deleteColumnNames}
          elementType="Hbac Rule"
          idAttr="cn"
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
      data-cy="modal-button-ok"
      key="cancel"
      variant="link"
      onClick={onCloseErrorModal}
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
    executeRulesDelCommand(props.selectedRulesData.selectedRules).then(
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
              setBtnSpinning(false);
            } else {
              props.selectedRulesData.clearSelectedRules();
              props.buttonsData.updateIsDeleteButtonDisabled(true);
              props.buttonsData.updateIsDeletion(true);

              addAlert(
                "remove-sudorules-success",
                "Sudo rules removed",
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
      data-cy="modal-button-delete"
      key="delete-sudorules"
      variant="danger"
      onClick={deleteRules}
      form="delete-sudorules-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-delete-sudorules"
      variant="link"
      onClick={closeModal}
    >
      Cancel
    </Button>,
  ];

  const modalDelete: JSX.Element = (
    <>
      <ModalWithFormLayout
        dataCy="delete-sudo-rules-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove sudo rules"
        formId="remove-sudorules-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalActionsDelete}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-sudo-rules-modal-error"
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

export default DeleteSudoRule;
