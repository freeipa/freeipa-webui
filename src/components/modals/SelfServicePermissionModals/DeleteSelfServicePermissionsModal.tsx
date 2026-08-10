import React from "react";
import { Content, ContentVariants, Button } from "@patternfly/react-core";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
import { addAlert } from "src/store/Global/alerts-slice";
import { useAppDispatch } from "src/store/hooks";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import {
  ErrorData,
  SelfServicePermission,
} from "src/utils/datatypes/globalDataTypes";
import ErrorModal from "src/components/modals/ErrorModal";
import { BatchRPCResponse } from "src/services/rpc";
import { useDeleteSelfServicePermissionsMutation } from "src/services/rpcSelfServicePermissions";

interface DeleteSelfServicePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: SelfServicePermission[];
  clearSelectedElements: () => void;
  columnNames: string[];
  keyNames: string[];
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeleteSelfServicePermissionsModal = (
  props: DeleteSelfServicePermissionsModalProps
) => {
  const dispatch = useAppDispatch();

  const [executeDeleteCommand] = useDeleteSelfServicePermissionsMutation();

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to remove the selected self-service permissions?
        </Content>
      ),
    },
    {
      id: "deleted-self-service-permissions-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.elementsToDelete}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="SelfServicePermission"
          idAttr="aciname"
        />
      ),
    },
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
      const errorMsg = errorData.error as string;

      setErrorTitle("IPA error " + errorCode + ": " + errorName);
      setErrorMessage(errorMsg);
    }
    setIsModalErrorOpen(true);
  };

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onDelete = () => {
    setBtnSpinning(true);

    executeDeleteCommand(props.elementsToDelete)
      .then((response) => {
        if ("data" in response) {
          const data = response.data as BatchRPCResponse;
          const result = data.result;

          if (result) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const results = result.results as unknown as any[];
            const errors = results.filter((r) => "error" in r && r.error);

            if (errors.length > 0) {
              const firstError = errors[0];
              const errorData = {
                code: firstError.error_code,
                name: firstError.error_name,
                error: firstError.error,
              } as ErrorData;

              const error = {
                status: "CUSTOM_ERROR",
                data: errorData,
              } as FetchBaseQueryError;

              handleAPIError(error);
            } else {
              props.clearSelectedElements();
              props.updateIsDeleteButtonDisabled(true);
              props.updateIsDeletion(true);

              dispatch(
                addAlert({
                  name: "remove-self-service-permissions-success",
                  title: "Self-service permissions removed",
                  variant: "success",
                })
              );

              props.onClose();
              props.onRefresh();
            }
          }
        }
      })
      .finally(() => {
        setBtnSpinning(false);
      });
  };

  const modalActions: JSX.Element[] = [
    <Button
      key="delete-self-service-permissions"
      variant="danger"
      onClick={onDelete}
      form="delete-self-service-permissions-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
      data-cy="modal-button-delete"
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      key="cancel-delete-self-service-permissions"
      variant="link"
      onClick={props.onClose}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  const errorModalActions = [
    <Button
      key="cancel"
      variant="link"
      onClick={closeAndCleanErrorParameters}
      data-cy="modal-button-ok"
    >
      OK
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="delete-self-service-permissions-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove self-service permissions"
        formId="delete-self-service-permissions-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-self-service-permissions-modal-error"
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

export default DeleteSelfServicePermissionsModal;
