import React from "react";
// PatternFly
import {
  Button,
  TextContent,
  Text,
  TextVariants,
  Spinner,
} from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import {
  DeleteDnsRecordPayload,
  useDnsRecordDeleteMutation,
} from "src/services/rpcDnsZones";
// Data types
import { DNSRecord, ErrorData } from "src/utils/datatypes/globalDataTypes";
import { BatchRPCResponse } from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "../ErrorModal";

interface DeleteDnsRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: DNSRecord[];
  clearSelectedElements: () => void;
  columnNames: string[]; // E.g. ["Record Name", "Record Type"]
  keyNames: string[]; // E.g. for dns_record.name, dns_record.type --> ["name", "type"]
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
  dnsZoneId: string;
}

const DeleteDnsRecordsModal = (props: DeleteDnsRecordsModalProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC calls
  const [deleteDnsRecords] = useDnsRecordDeleteMutation();

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

  const onDelete = () => {
    setBtnSpinning(true);

    const payload: DeleteDnsRecordPayload = {
      dnsZoneId: props.dnsZoneId,
      recordNames: props.elementsToDelete.map((element) =>
        element.idnsname.toString()
      ),
    };

    deleteDnsRecords(payload).then((response) => {
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
              "remove-dnsrecords-success",
              "DNS records removed",
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
          elementType="DNS record" // the final 's' is handled by the component
          idAttr={"idnsname"}
        />
      ),
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button key="cancel" variant="secondary" onClick={props.onClose}>
      Cancel
    </Button>,
    <Button
      key="delete"
      variant="danger"
      onClick={onDelete}
      isDisabled={spinning}
    >
      {spinning ? <Spinner size="sm" /> : "Delete"}
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove DNS records"
        formId="remove-dnsrecords-modal"
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

export default DeleteDnsRecordsModal;
