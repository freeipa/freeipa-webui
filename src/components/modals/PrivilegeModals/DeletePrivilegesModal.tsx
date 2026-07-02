import React from "react";
// PatternFly
import { Content, ContentVariants, Button } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Data types
import { ErrorData, Privilege } from "src/utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
import { BatchRPCResponse } from "src/services/rpc";
import { useDeletePrivilegesMutation } from "src/services/rpcPrivileges";

interface DeletePrivilegesModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: Privilege[];
  clearSelectedElements: () => void;
  columnNames: string[];
  keyNames: string[];
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeletePrivilegesModal = (props: DeletePrivilegesModalProps) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [executePrivilegesDelCommand] = useDeletePrivilegesMutation();

  // States
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to remove the selected privileges?
        </Content>
      ),
    },
    {
      id: "deleted-privileges-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.elementsToDelete}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="Privilege"
          idAttr="cn"
        />
      ),
    },
  ];

  // Handle API error data
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

  // Delete handler
  const onDeletePrivileges = () => {
    setBtnSpinning(true);

    executePrivilegesDelCommand(props.elementsToDelete).then((response) => {
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

            handleAPIError(error);
          } else {
            props.clearSelectedElements();
            props.updateIsDeleteButtonDisabled(true);
            props.updateIsDeletion(true);

            dispatch(
              addAlert({
                name: "remove-privileges-success",
                title: "Privileges removed",
                variant: "success",
              })
            );

            props.onClose();
            props.onRefresh();
          }
        }
      }
      setBtnSpinning(false);
    });
  };

  // Modal actions
  const modalActions: JSX.Element[] = [
    <Button
      key="delete-privileges"
      variant="danger"
      onClick={onDeletePrivileges}
      form="delete-privileges-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
      data-cy="modal-button-delete"
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      key="cancel-delete-privileges"
      variant="link"
      onClick={props.onClose}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  // Error modal actions
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
        dataCy="delete-privileges-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove privileges"
        formId="delete-privileges-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-privileges-modal-error"
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

export default DeletePrivilegesModal;
