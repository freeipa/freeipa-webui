import React from "react";
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  useMultipleCertMapRuleDisableMutation,
  useMultipleCertMapRuleEnableMutation,
} from "src/services/rpcCertMapping";
import ConfirmationModal from "../ConfirmationModal";
import capitalizeFirstLetter from "src/utils/utils";

interface EnableDisableMultipleRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsList: string[];
  setElementsList: (elementsList: string[]) => void;
  operation: "enable" | "disable";
  setShowTableRows: (value: boolean) => void;
  onRefresh: () => void;
}

const EnableDisableMultipleRulesModal = (
  props: EnableDisableMultipleRulesModalProps
) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [enableRule] = useMultipleCertMapRuleEnableMutation();
  const [disableRule] = useMultipleCertMapRuleDisableMutation();

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
              title: "Rule status changed",
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
      key={props.operation + "-certmaprules"}
      variant="primary"
      onClick={onEnableDisable}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-certmaprules"}
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
        dataCy="enable-disable-multiple-rules-modal"
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

export default EnableDisableMultipleRulesModal;
