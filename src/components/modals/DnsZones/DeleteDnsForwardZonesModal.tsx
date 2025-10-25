import React from "react";
// PatternFly
import {
  Button,
  Content,
  ContentVariants,
  Spinner,
} from "@patternfly/react-core";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import { useDnsForwardZoneDeleteMutation } from "src/services/rpcDnsForwardZones";
// Data types
import { DNSForwardZone, ErrorData } from "src/utils/datatypes/globalDataTypes";
import { BatchRPCResponse } from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// React Router
import { useNavigate } from "react-router";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "../ErrorModal";
// Redux
import { useAppDispatch } from "src/store/hooks";

interface DeleteDnsForwardZonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: DNSForwardZone[];
  clearSelectedElements: () => void;
  columnNames: string[]; // E.g. ["DNS Forward Zone Name", "Reverse Zone IP"]
  keyNames: string[]; // E.g. for dns_forward_zone.name, dns_forward_zone.reverse_zone_ip --> ["name", "reverse_zone_ip"]
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
  fromSettings?: boolean; // Optional, used to determine if the modal is opened from settings
}

const DeleteDnsForwardZonesModal = (props: DeleteDnsForwardZonesModalProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // RPC calls
  const [deleteDnsForwardZones] = useDnsForwardZoneDeleteMutation();

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
    <Button
      data-cy="modal-button-ok"
      key="cancel"
      variant="link"
      onClick={closeAndCleanErrorParameters}
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

  const onDelete = () => {
    setBtnSpinning(true);

    const elementsToDelete = props.elementsToDelete.map((element) =>
      element.idnsname.toString()
    );

    deleteDnsForwardZones(elementsToDelete)
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

              dispatch(
                addAlert({
                  name: "remove-dnsforwardzones-success",
                  title: "DNS forward zones removed",
                  variant: "success",
                })
              );

              props.onClose();

              // Move to main page if the modal is opened from settings
              if (
                props.fromSettings !== undefined &&
                props.fromSettings === true
              ) {
                navigate("/dns-forward-zones");
              }
              // Refresh data
              props.onRefresh();
            }
          }
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
          mode="passing_full_data"
          elementsToDelete={props.elementsToDelete}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="DNS forward zone" // the final 's' is handled by the component
          idAttr={"idnsname"}
        />
      ),
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key="delete-dnsforwardzones"
      variant="danger"
      onClick={onDelete}
      form="delete-dnsforwardzones-modal"
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
      key="cancel-delete-dnsforwardzones"
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <ModalWithFormLayout
        dataCy="dns-forward-zones-delete-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove DNS forward zones"
        formId="remove-dnsforwardzones-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="dns-forward-zones-delete-modal-error"
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

export default DeleteDnsForwardZonesModal;
