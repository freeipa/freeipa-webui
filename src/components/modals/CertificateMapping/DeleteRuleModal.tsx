import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
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
  const dispatch = useAppDispatch();
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
