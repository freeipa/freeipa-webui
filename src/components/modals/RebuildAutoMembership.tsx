import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Modals
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Components
import TextLayout from "../layouts/TextLayout";
// RPC
import {
  ErrorResult,
  useAutoMembershipRebuildMutation,
} from "src/services/rpc";
// Utils
import { API_VERSION_BACKUP } from "src/utils/utils";

interface PropsToRebuildAutoMembership {
  isOpen: boolean;
  onClose: () => void;
  entriesToRebuild: string[];
  entity: "users" | "hosts" | "groups";
}

// TODO: Use this component in those places where the Rebuild auto membership modal is used
const RebuildAutoMembership = (props: PropsToRebuildAutoMembership) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC hook
  const [rebuildAutoMembership] = useAutoMembershipRebuildMutation();

  // [API call] 'Rebuild auto membership'
  const onRebuildAutoMembership = () => {
    // The operation will be made depending on the selected users & entity type
    // - Types: 'users' | 'hosts' | 'groups'

    const paramArgs =
      props.entriesToRebuild.length === 0
        ? { type: "group", version: API_VERSION_BACKUP }
        : {
            [props.entity]: props.entriesToRebuild.map((uid) => uid),
            version: API_VERSION_BACKUP,
          };
    const payload = [paramArgs];

    rebuildAutoMembership(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          props.onClose();
          // Set alert: success
          alerts.addAlert(
            "rebuild-auto-membership-success",
            "Automember rebuild membership task completed",
            "success"
          );
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "rebuild-auto-membership-error",
            errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  // Actions
  const membershipModalActions: JSX.Element[] = [
    <Button
      key="rebuild-auto-membership"
      variant="primary"
      onClick={onRebuildAutoMembership}
      form="rebuild-auto-membership-modal"
    >
      OK
    </Button>,
    <Button
      key="cancel-rebuild-auto-membership"
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  // 'Rebuild auto membership' modal fields: Confirmation question
  const confirmationQuestion = [
    {
      id: "question-text",
      pfComponent: (
        <TextLayout component="p">
          Are you sure you want to rebuild auto membership? In case of a high
          number of users, hosts or groups, the operation may require high CPU
          usage.
        </TextLayout>
      ),
    },
  ];

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Confirmation"
        formId="rebuild-auto-membership-modal"
        fields={confirmationQuestion}
        show={props.isOpen}
        onClose={props.onClose}
        actions={membershipModalActions}
      />
    </>
  );
};

export default RebuildAutoMembership;
