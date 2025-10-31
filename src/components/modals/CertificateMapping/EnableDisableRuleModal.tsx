import React from "react";
import { Button } from "@patternfly/react-core";
// Hooks
import { addAlert } from "src/store/alerts";
// RPC
import {
  useCertMapRuleDisableMutation,
  useCertMapRuleEnableMutation,
} from "src/services/rpcCertMapping";
import ConfirmationModal from "../ConfirmationModal";

interface EnableDisableRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruleId: string;
  operation: "enable" | "disable";
  setIsLoading: (value: boolean) => void;
  onRefresh: () => void;
}

const EnableDisableRuleModal = (props: EnableDisableRuleModalProps) => {
  // RPC calls
  const [enableRule] = useCertMapRuleEnableMutation();
  const [disableRule] = useCertMapRuleDisableMutation();

  // Enable/Disable operation
  const onEnableDisable = () => {
    const operation = props.operation === "enable" ? enableRule : disableRule;

    props.setIsLoading(true);
    operation(props.ruleId).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          addAlert("error", (data.error as Error).message, "danger");
        }
        if (data?.result) {
          addAlert("success", data.result.summary, "success");
          // Refresh data
          props.onRefresh();
          onClose();
        }
      }
    });
  };

  const onClose = () => {
    props.setIsLoading(false);
    props.onClose();
  };

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key={props.operation + "-" + props.ruleId}
      variant="primary"
      onClick={onEnableDisable}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-" + props.ruleId}
      variant="secondary"
      onClick={onClose}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <ConfirmationModal
        dataCy="enable-disable-rule-modal"
        title={"Confirmation"}
        isOpen={props.isOpen}
        onClose={onClose}
        actions={modalActions}
        messageText={
          "Are you sure you want to " +
          props.operation +
          " the following element?"
        }
        messageObj={props.ruleId}
      />
    </>
  );
};

export default EnableDisableRuleModal;
