import React, { useState } from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
} from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "../../store/hooks";
import { removeService } from "../../store/Identity/services-slice";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "../../components/tables/DeletedElementsTable";
// Hooks
import useAlerts from "../../hooks/useAlerts";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Data types
import { ErrorData, Service } from "../../utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "./ErrorModal";
import { BatchRPCResponse } from "../../services/rpc";
import { useRemoveServicesMutation } from "../../services/rpcServices";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedElementsData {
  selectedElements: Service[];
  clearSelectedServices: () => void;
}

interface PropsToDeleteServices {
  show: boolean;
  handleModalToggle: () => void;
  selectedServicesData: SelectedElementsData;
  buttonsData: ButtonsData;
  onRefresh?: () => void;
}

const DeleteServices = (props: PropsToDeleteServices) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts
  const alerts = useAlerts();

  // Define the column names that will be displayed on the confirmation table.
  // - NOTE: Camel-case should match with the property to show as it is defined in the data.
  //    This variable will be coverted into word.
  const deleteServicesColumnNames = ["krbcanonicalname"];

  const [executeServicesDelCommand] = useRemoveServicesMutation();

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to remove the selected entries from Services?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "deleted-users-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.selectedServicesData.selectedElements}
          columnNames={deleteServicesColumnNames}
          elementType="services"
          idAttr="krbprincipalname"
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
    <Button key="cancel" variant="link" onClick={onCloseErrorModal}>
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

  const deleteServices = () => {
    setBtnSpinning(true);

    // Delete elements
    executeServicesDelCommand(props.selectedServicesData.selectedElements).then(
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
              // Update data from Redux
              props.selectedServicesData.selectedElements.map((service) => {
                dispatch(removeService(service.krbcanonicalname));
              });

              props.selectedServicesData.clearSelectedServices();
              props.buttonsData.updateIsDeleteButtonDisabled(true);
              props.buttonsData.updateIsDeletion(true);

              alerts.addAlert(
                "remove-services-success",
                "Services removed",
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
      key="delete-services"
      variant="danger"
      onClick={deleteServices}
      form="delete-services-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button key="cancel-delete-services" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalDelete: JSX.Element = (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Remove services"
        formId="remove-services-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalActionsDelete}
      />
      {isModalErrorOpen && (
        <ErrorModal
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );

  // Render component
  return modalDelete;
};

export default DeleteServices;
