import React from "react";
// PatternFly
import {
  Button,
  Content,
  ContentVariants,
  Spinner,
} from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useApiError from "src/hooks/useApiErrorModals";
// RPC
import { useDeleteTrustsMutation } from "src/services/rpcTrusts";
// Data types
import { ErrorData, Trust } from "src/utils/datatypes/globalDataTypes";
import { BatchRPCResponse } from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

interface DeleteTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: Trust[];
  clearSelectedElements: () => void;
  columnNames: string[]; // E.g. ["Trust Name", "Trust Type"]
  keyNames: string[]; // E.g. for trust.name, trust.type --> ["name", "type"]
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeleteTrustModal = (props: DeleteTrustModalProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC calls
  const [deleteTrusts] = useDeleteTrustsMutation();

  // States
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);
  const { handleAPIError, ErrorModalComponent } = useApiError();

  const onDelete = () => {
    setBtnSpinning(true);

    const elementsToDelete = props.elementsToDelete.map((element) =>
      element.cn.toString()
    );

    deleteTrusts(elementsToDelete)
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

              alerts.addAlert(
                "remove-trusts-success",
                "Trusts removed",
                "success"
              );

              props.onClose();
              // Refresh data
              props.onRefresh();
            }
          }
        }
        if ("error" in response) {
          const error = response.error as FetchBaseQueryError;
          handleAPIError(error);
        }
      })
      .finally(() => {
        setBtnSpinning(false);
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
          mode="passing_id"
          elementsToDelete={props.elementsToDelete.map((element) =>
            element.cn.toString()
          )}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="Trust"
          idAttr="cn"
        />
      ),
    },
  ];

  // Modal actions
  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key="delete-trusts"
      variant="danger"
      onClick={onDelete}
      form="delete-trusts-modal"
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
      key="cancel-delete-trusts"
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
        dataCy="trusts-delete-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove Trusts"
        formId="remove-trusts-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActionsDelete}
      />
      {ErrorModalComponent}
    </>
  );
};

export default DeleteTrustModal;
