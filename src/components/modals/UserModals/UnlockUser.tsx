import React from "react";
// PatternFly
import { Button, Content, ContentVariants } from "@patternfly/react-core";
// Modals
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useUnlockUserMutation } from "src/services/rpcUsers";
// Hooks
import { addAlert } from "src/store/alerts";

interface propsToUnlockUser {
  uid: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const UnlockUser = (props: propsToUnlockUser) => {
  // RPC hooks
  const [unlockUser] = useUnlockUserMutation();

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          {"Are you sure you want to unlock user '" + props.uid + "'?"}
        </Content>
      ),
    },
  ];

  // on unlock user
  const onUnlockUser = () => {
    // API call to reset password
    if (props.uid === undefined) {
      // Alert error: no uid
      addAlert("undefined-uid-error", "No user selected to unlock", "danger");
    } else {
      unlockUser(props.uid).then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Close modal
            props.onClose();
            // Set alert: success
            addAlert(
              "unlock-user-success",
              "Unlocked account '" + props.uid + "'",
              "success"
            );
            // Refresh data
            props.onRefresh();
          } else if (response.data?.error) {
            // Set alert: error
            const errorMessage = response.data.error as ErrorResult;
            addAlert("unlock-user-error", errorMessage.message, "danger");
          }
        }
      });
    }
  };

  // Actions
  const actions: JSX.Element[] = [
    <Button
      key="unlock-user"
      variant="primary"
      onClick={onUnlockUser}
      form="unlock-user-modal"
      data-cy="modal-button-ok"
    >
      Ok
    </Button>,
    <Button
      key="cancel-unlock-user"
      variant="link"
      onClick={props.onClose}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="unlock-user-modal"
        variantType="small"
        modalPosition="top"
        title="Unlock user"
        formId="unlock-user-form"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={actions}
      />
    </>
  );
};

export default UnlockUser;
