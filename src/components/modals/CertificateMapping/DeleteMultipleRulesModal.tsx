import React from "react";
// PatternFly
import {
  Button,
  TextContent,
  Text,
  TextVariants,
} from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import { useMultipleCertMapRuleDeleteMutation } from "src/services/rpcCertMapping";
// Data types
import {
  CertificateMapping,
  ErrorData,
} from "src/utils/datatypes/globalDataTypes";
import { BatchRPCResponse } from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "../ErrorModal";

interface DeleteMultipleRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: CertificateMapping[];
  clearSelectedElements: () => void;
  columnNames: string[]; // E.g. ["User ID", "Description"]
  keyNames: string[]; // E.g. for user.uid, user.description --> ["uid", "description"]
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeleteMultipleRulesModal = (props: DeleteMultipleRulesModalProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC calls
  const [deleteRules] = useMultipleCertMapRuleDeleteMutation();

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
    <Button key="cancel" variant="link" onClick={closeAndCleanErrorParameters}>
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

  // Delete operation
  const onDelete = () => {
    setBtnSpinning(true);

    const elementsToDelete = props.elementsToDelete.map((element) =>
      element.cn.toString()
    );

    deleteRules(elementsToDelete).then((response) => {
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

            alerts.addAlert(
              "remove-certrules-success",
              "Certificate identity provider rules removed",
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

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to delete the selected entries?
          </Text>
        </TextContent>
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
          elementType="certificate mapping rule" // the final 's' is handled by the component
          idAttr={"cn"}
        />
      ),
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button
      key="delete-certmaprules"
      variant="danger"
      onClick={onDelete}
      form="delete-certmaprules-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      key="cancel-delete-certmaprules"
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove certificate identity mapping rules"
        formId="remove-certmaprule-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
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

export default DeleteMultipleRulesModal;
