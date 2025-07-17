import React from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
} from "@patternfly/react-core";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// RPC
import { useIdpDeleteMutation } from "src/services/rpcIdp";
import { BatchRPCResponse } from "src/services/rpc";
// Data types
import { ErrorData, IDPServer } from "src/utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedData {
  selectedElements: IDPServer[];
  clearSelectedElements: () => void;
}

export interface PropsToDelete {
  show: boolean;
  onClose: () => void;
  selectedData: SelectedData;
  buttonsData: ButtonsData;
  columnNames: string[]; // E.g. ["User ID", "Description"]
  keyNames: string[]; // E.g. for user.uid, user.description --> ["uid", "description"]
  onRefresh: () => void;
}

const DeleteModal = (props: PropsToDelete) => {
  // Alerts
  const alerts = useAlerts();

  // API calls
  const [deleteIdps] = useIdpDeleteMutation();

  // States
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to delete the selected Identity Provider(s)?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "deleted-elements-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.selectedData.selectedElements}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="IdP reference" // the final 's' is handled by the component
          idAttr="cn"
        />
      ),
    },
  ];

  // Handle API error data
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

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
      const errorCode = errorData.code;
      const errorName = errorData.name;
      const errorMessage = errorData.error;

      setErrorTitle("IPA error " + errorCode + ": " + errorName);
      setErrorMessage(errorMessage);
    }
    setIsModalErrorOpen(true);
  };

  const deleteIdpReferences = () => {
    setBtnSpinning(true);

    const elementsToDelete = props.selectedData.selectedElements.map(
      (element) => element.cn.toString()
    );

    deleteIdps(elementsToDelete).then((response) => {
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
            props.selectedData.clearSelectedElements();
            props.buttonsData.updateIsDeleteButtonDisabled(true);
            props.buttonsData.updateIsDeletion(true);

            alerts.addAlert(
              "remove-idpreferences-success",
              "Identity Providers removed",
              "success"
            );

            setBtnSpinning(false);
            props.onClose();
            // Refresh data
            props.onRefresh();
          }
        }
      }
    });
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-delete"
      key="delete-idpreferences"
      variant="danger"
      onClick={deleteIdpReferences}
      form="delete-idpreferences-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-delete-idpreferences"
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        dataCy="delete-idpreferences-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove Identity Provider references"
        formId="remove-idpreferences-modal"
        fields={fields}
        show={props.show}
        onClose={props.onClose}
        actions={modalActionsDelete}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-idpreferences-modal-error"
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

export default DeleteModal;
