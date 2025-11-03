import React from "react";
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
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
  const dispatch = useAppDispatch();

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
          dispatch(
            addAlert({
              name: "error",
              title: (data.error as Error).message,
              variant: "danger",
            })
          );
        }
        if (data?.result) {
          dispatch(
            addAlert({
              name: "success",
              title: data.result.summary,
              variant: "success",
            })
          );
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
