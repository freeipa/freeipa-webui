import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  useDnsZoneDisableMutation,
  useDnsZoneEnableMutation,
} from "src/services/rpcDnsZones";
// Components
import ConfirmationModal from "../ConfirmationModal";
// Utils
import capitalizeFirstLetter from "src/utils/utils";
// Data types
import { DNSZone } from "src/utils/datatypes/globalDataTypes";

interface EnableDisableDnsZonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsList: string[];
  setElementsList: (elementsList: DNSZone[]) => void;
  operation: "enable" | "disable";
  setShowTableRows: (value: boolean) => void;
  onRefresh: () => void;
}

const EnableDisableDnsZonesModal = (props: EnableDisableDnsZonesModalProps) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [disableRule] = useDnsZoneDisableMutation();
  const [enableRule] = useDnsZoneEnableMutation();

  // Enable/Disable operation
  const onEnableDisable = () => {
    const operation = props.operation === "enable" ? enableRule : disableRule;

    operation(props.elementsList).then((response) => {
      if ("data" in response) {
        const { data } = response;
        if (data?.error) {
          dispatch(
            addAlert({ name: "error", title: data.error, variant: "danger" })
          );
        }
        if (data?.result) {
          dispatch(
            addAlert({
              name: "success",
              title: "DNS zone status changed",
              variant: "success",
            })
          );
          // Clear selected elements
          props.setElementsList([]);
          // Refresh data
          props.onRefresh();
          onClose();
        }
      }
    });
  };

  const onClose = () => {
    props.setElementsList([]);
    props.onClose();
  };

  const onCloseWithoutClearingElements = () => {
    props.onClose();
  };

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key={props.operation + "-dnszones"}
      variant="primary"
      onClick={onEnableDisable}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-dnszones"}
      variant="secondary"
      onClick={onCloseWithoutClearingElements}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <ConfirmationModal
        dataCy="dns-zones-enable-disable-modal"
        title={capitalizeFirstLetter(props.operation) + " confirmation"}
        isOpen={props.isOpen}
        onClose={onClose}
        actions={modalActions}
        messageText={
          "Are you sure you want to " +
          props.operation +
          " the following element(s)?"
        }
        messageObj={props.elementsList.join(", ")}
      />
    </>
  );
};

export default EnableDisableDnsZonesModal;
