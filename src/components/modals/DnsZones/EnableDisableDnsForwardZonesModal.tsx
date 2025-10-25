import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  useDnsForwardZoneDisableMutation,
  useDnsForwardZoneEnableMutation,
} from "src/services/rpcDnsForwardZones";
// Components
import ConfirmationModal from "../ConfirmationModal";
// Utils
import capitalizeFirstLetter from "src/utils/utils";
// Redux
import { useAppDispatch } from "src/store/hooks";

interface EnableDisableDnsForwardZonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsList: string[];
  setElementsList: (elementsList: string[]) => void;
  operation: "enable" | "disable";
  setShowTableRows: (value: boolean) => void;
  onRefresh: () => void;
}

const EnableDisableDnsForwardZonesModal = (
  props: EnableDisableDnsForwardZonesModalProps
) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [disableRule] = useDnsForwardZoneDisableMutation();
  const [enableRule] = useDnsForwardZoneEnableMutation();

  // Enable/Disable operation
  const onEnableDisable = () => {
    const operation = props.operation === "enable" ? enableRule : disableRule;

    props.setShowTableRows(false);
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
              title: "DNS forward zone status changed",
              variant: "success",
            })
          );
          // Clear selected elements
          props.setElementsList([]);
          // Refresh data
          props.onRefresh();
          onClose();
        }
        props.setShowTableRows(true);
      }
    });
  };

  const onClose = () => {
    props.setShowTableRows(true);
    props.setElementsList([]);
    props.onClose();
  };

  const onCloseWithoutClearingElements = () => {
    props.setShowTableRows(true);
    props.onClose();
  };

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key={props.operation + "-dnsforwardzones"}
      variant="primary"
      onClick={onEnableDisable}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-dnsforwardzones"}
      variant="secondary"
      onClick={onCloseWithoutClearingElements}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <ConfirmationModal
      dataCy="dns-forward-zones-enable-disable-modal"
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
  );
};

export default EnableDisableDnsForwardZonesModal;
