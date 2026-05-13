import React, { useState } from "react";
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
import { ErrorData, Role } from "src/utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
import { BatchRPCResponse } from "src/services/rpc";
import { useDeleteRolesMutation } from "src/services/rpcRoles";

interface PropsToDeleteRoles {
  show: boolean;
  handleModalToggle: () => void;
  elementsToDelete: Role[];
  clearSelectedElements: () => void;
  columnNames: string[];
  keyNames: string[];
  onRefresh?: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeleteRolesModal = (props: PropsToDeleteRoles) => {
  const dispatch = useAppDispatch();

  const [executeRolesDelCommand] = useDeleteRolesMutation();

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to remove the selected roles?
        </Content>
      ),
    },
    {
      id: "deleted-roles-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.elementsToDelete}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="Role"
          idAttr="cn"
        />
      ),
    },
  ];

  const closeModal = () => {
    props.handleModalToggle();
  };

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

  const deleteRoles = () => {
    setBtnSpinning(true);

    executeRolesDelCommand(props.elementsToDelete).then((response) => {
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
            setBtnSpinning(false);
          } else {
            props.clearSelectedElements();
            props.updateIsDeleteButtonDisabled(true);
            props.updateIsDeletion(true);

            dispatch(
              addAlert({
                name: "remove-roles-success",
                title: "Roles removed",
                variant: "success",
              })
            );

            setBtnSpinning(false);
            closeModal();
            if (props.onRefresh !== undefined) {
              props.onRefresh();
            }
          }
        }
      }
    });
  };

  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-roles"
      variant="danger"
      onClick={deleteRoles}
      form="delete-roles-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
      data-cy="modal-button-delete"
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      key="cancel-delete-roles"
      variant="link"
      onClick={closeModal}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="delete-roles-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove roles"
        formId="delete-roles-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalActionsDelete}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-roles-modal-error"
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

export default DeleteRolesModal;
