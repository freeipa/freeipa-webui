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
  useDeleteDnsRecordFromSettingsMutation,
  DynamicDeleteDnsRecordPayload,
} from "src/services/rpcDnsZones";
// Data types
import { DNSRecord, ErrorData } from "src/utils/datatypes/globalDataTypes";
import { BatchRPCResponse, FindRPCResponse } from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "../ErrorModal";
import { API_VERSION_BACKUP } from "src/utils/utils";

interface DeleteDnsRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: DNSRecord[];
  clearSelectedElements: () => void;
  columnNames: string[]; // E.g. ["Record Name", "Record Type"]
  keyNames: string[]; // E.g. for dns_record.name, dns_record.type --> ["name", "type"]
  onRefresh: () => void;
  updateIsDeleteButtonDisabled?: (value: boolean) => void;
  updateIsDeletion?: (value: boolean) => void;
  dnsZoneId: string;
  recordName?: string;
  recordTypeName?: string;
}

const DeleteDnsRecordsModal = (props: DeleteDnsRecordsModalProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC calls
  const [deleteDnsRecords] = useDnsRecordDeleteMutation();
  const [deleteDnsRecordFromSettings] =
    useDeleteDnsRecordFromSettingsMutation();

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
      key="cancel"
      variant="link"
      onClick={closeAndCleanErrorParameters}
      data-cy="modal-button-error-modal-ok"
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
    } else if ("data" in error && error.data) {
      const errorData = error.data as ErrorData;
      const errorCode: string = errorData.code;
      const errorName: string = errorData.name;
      const errorMessage: string = errorData.error;

      setErrorTitle("IPA error " + errorCode + ": " + errorName);
      setErrorMessage(errorMessage);
    }
    setIsModalErrorOpen(true);
  };

  const onDelete = () => {
    setBtnSpinning(true);

    // Use conditional logic to call the correct API with the right payload type
    if (props.recordName && props.recordTypeName) {
      // Delete specific record data from settings page
      const payload: DynamicDeleteDnsRecordPayload = {
        dnsZoneId: props.dnsZoneId,
        recordName: props.recordName,
        recordTypeName: props.recordTypeName,
        dataToDelete: props.elementsToDelete.map((element) => element.dnsdata),
        version: API_VERSION_BACKUP,
      };

      deleteDnsRecordFromSettings(payload).then((response) => {
        if ("data" in response) {
          const data = response.data as FindRPCResponse;

          if (data.error) {
            // Handle error at the response level
            const errorData: ErrorData = {
              code:
                typeof data.error === "object"
                  ? data.error.code.toString()
                  : "500",
              name:
                typeof data.error === "object"
                  ? data.error.name
                  : "Unknown Error",
              error:
                typeof data.error === "string"
                  ? data.error
                  : data.error.message,
            };

            const error: FetchBaseQueryError = {
              error: "Custom error",
              status: "CUSTOM_ERROR",
              data: errorData,
            };

            handleAPIError(error);
          } else {
            props.updateIsDeleteButtonDisabled?.(true);
            props.updateIsDeletion?.(true);

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
      });
    } else {
      // Delete entire records
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
              if (props.updateIsDeleteButtonDisabled) {
                props.updateIsDeleteButtonDisabled(true);
              }
              if (props.updateIsDeletion) {
                props.updateIsDeletion(true);
              }

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
    }
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
    <Button
      key="delete"
      variant="danger"
      onClick={onDelete}
      isDisabled={spinning}
      data-cy="modal-button-delete"
    >
      {spinning ? <Spinner size="sm" /> : "Delete"}
    </Button>,
    <Button
      key="cancel"
      variant="secondary"
      onClick={props.onClose}
      data-cy="modal-button-cancel"
    >
      Cancel
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
        dataCy="modal-delete-dns-records"
      />
      {isModalErrorOpen && (
        <ErrorModal
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={closeAndCleanErrorParameters}
          actions={errorModalActions}
          errorMessage={errorMessage}
          dataCy="modal-error-modal"
        />
      )}
    </>
  );
};

export default DeleteDnsRecordsModal;
