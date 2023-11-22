import React from "react";
// PatternFly
import {
  Button,
  TextContent,
  Text,
  TextVariants,
} from "@patternfly/react-core";
// Modals
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// RPC
import { ErrorResult, useUnlockUserMutation } from "src/services/rpc";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface propsToUnlockUser {
  uid: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const UnlockUser = (props: propsToUnlockUser) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC hooks
  const [unlockUser] = useUnlockUserMutation();

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            {"Are you sure you want to unlock user '" + props.uid + "'?"}
          </Text>
        </TextContent>
      ),
    },
  ];

  // on unlock user
  const onUnlockUser = () => {
    // API call to reset password
    if (props.uid === undefined) {
      // Alert error: no uid
      alerts.addAlert(
        "undefined-uid-error",
        "No user selected to unlock",
        "danger"
      );
    } else {
      unlockUser(props.uid).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Close modal
            props.onClose();
            // Set alert: success
            alerts.addAlert(
              "unlock-user-success",
              "Unlocked account '" + props.uid + "'",
              "success"
            );
            // Refresh data
            props.onRefresh();
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert(
              "unlock-user-error",
              errorMessage.message,
              "danger"
            );
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
    >
      Ok
    </Button>,
    <Button key="cancel-unlock-user" variant="link" onClick={props.onClose}>
      Cancel
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
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
