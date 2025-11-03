import React, { useState } from "react";
// PatternFly
import {
  Content,
  ContentVariants,
  Button,
  Checkbox,
} from "@patternfly/react-core";
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
import { ErrorData, Host } from "src/utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
import { BatchRPCResponse } from "src/services/rpc";
import { useRemoveHostsMutation } from "src/services/rpcHosts";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedHostsData {
  selectedHosts: Host[];
  clearSelectedHosts: () => void;
}

interface PropsToDeleteHosts {
  show: boolean;
  handleModalToggle: () => void;
  selectedHostsData: SelectedHostsData;
  buttonsData: ButtonsData;
  onRefresh?: () => void;
}

const DeleteHosts = (props: PropsToDeleteHosts) => {
  const dispatch = useAppDispatch();

  // Define the column names that will be displayed on the confirmation table.
  // - NOTE: Camel-case should match with the property to show as it is defined in the data.
  //    This variable will be coverted into word.
  const deleteHostsColumnNames = ["fqdn", "description"];

  const [executeHostsDelCommand] = useRemoveHostsMutation();

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);
  const [updateDns, setUpdateDns] = useState(false);

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to remove the selected entries from Hosts?
        </Content>
      ),
    },
    {
      id: "deleted-users-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.selectedHostsData.selectedHosts}
          columnNames={deleteHostsColumnNames}
          elementType="hosts"
          idAttr="fqdn"
        />
      ),
    },
    {
      id: "update-dns-checkbox",
      pfComponent: (
        <Checkbox
          data-cy="modal-checkbox-update-dns"
          id="update-dns-checkbox"
          label="Remove A, AAAA, SSHFP and PTR records of the host managed by IPA DNS"
          aria-label="update dns checkbox"
          name="update-dns"
          value="update-dns"
          onChange={(_event, checked) => setUpdateDns(checked)}
          isChecked={updateDns}
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

  const deleteHosts = () => {
    setBtnSpinning(true);
    // Delete elements
    executeHostsDelCommand({
      hosts: props.selectedHostsData.selectedHosts,
      updateDns,
    }).then((response) => {
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
            props.selectedHostsData.clearSelectedHosts();
            props.buttonsData.updateIsDeleteButtonDisabled(true);
            props.buttonsData.updateIsDeletion(true);

            dispatch(
              addAlert({
                name: "remove-hosts-success",
                title: "Hosts removed",
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
      setBtnSpinning(false);
    });
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-delete"
      key="delete-hosts"
      variant="danger"
      onClick={deleteHosts}
      form="delete-hosts-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-delete-hosts"
      variant="link"
      onClick={closeModal}
    >
      Cancel
    </Button>,
  ];

  const modalDelete: JSX.Element = (
    <>
      <ModalWithFormLayout
        dataCy="delete-hosts-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove hosts"
        formId="remove-hosts-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalActionsDelete}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-hosts-modal-error"
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );

  // Render 'DeleteUsers'
  return modalDelete;
};

export default DeleteHosts;
