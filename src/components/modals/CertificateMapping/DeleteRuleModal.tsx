import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Hooks
import { addAlert } from "src/store/alerts";
// RPC
import { useCertMapRuleDeleteMutation } from "src/services/rpcCertMapping";
import ConfirmationModal from "../ConfirmationModal";
// React router
import { useNavigate } from "react-router";

interface DeleteRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruleId: string;
  setIsLoading: (value: boolean) => void;
  onRefresh: () => void;
  pathToMainPage: string;
}

const DeleteRuleModal = (props: DeleteRuleModalProps) => {
  const navigate = useNavigate();

  // RPC calls
  const [deleteRule] = useCertMapRuleDeleteMutation();

  // Delete operation
  const onDelete = () => {
    props.setIsLoading(true);
    deleteRule(props.ruleId).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          addAlert("error", (data.error as Error).message, "danger");
        }
        if (data?.result) {
          addAlert("success", data.result.summary, "success");
          props.onClose();
          // Redirect to the main page
          navigate("/" + props.pathToMainPage);
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
      key={"delete-" + props.ruleId}
      variant="primary"
      onClick={onDelete}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-delete-" + props.ruleId}
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
        dataCy="delete-rule-modal"
        title={"Confirmation"}
        isOpen={props.isOpen}
        onClose={onClose}
        actions={modalActions}
        messageText={"Are you sure you want to delete the following element?"}
        messageObj={props.ruleId}
      />
    </>
  );
};

export default DeleteRuleModal;
