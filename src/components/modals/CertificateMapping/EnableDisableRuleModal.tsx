import React from "react";
import { Button } from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
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
  // Alerts to show in the UI
  const alerts = useAlerts();

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
          alerts.addAlert("error", (data.error as Error).message, "danger");
        }
        if (data?.result) {
          alerts.addAlert("success", data.result.summary, "success");
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
      key={props.operation + "-" + props.ruleId}
      variant="primary"
      onClick={onEnableDisable}
    >
      OK
    </Button>,
    <Button
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
      <alerts.ManagedAlerts />
      <ConfirmationModal
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
