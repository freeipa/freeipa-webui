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
import { ErrorResult } from "src/services/rpc";
import { useAutoMemberRebuildHostsMutation } from "src/services/rpcHosts";
import { useAutoMemberRebuildUsersMutation } from "src/services/rpcUsers";

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
  const [rebuildAutoMembership] =
    props.entity === "users"
      ? useAutoMemberRebuildUsersMutation()
      : useAutoMemberRebuildHostsMutation();
  // TODO: Adapt this to use it with 'Groups'.

  // [API call] 'Rebuild auto membership'
  const onRebuildAutoMembership = () => {
    // Task can potentially run for a very long time, give feed back that we
    // at least started the task
    alerts.addAlert(
      "rebuild-automember-start",
      "Starting automember rebuild membership task (this may take a long " +
        "time to complete) ...",
      "info"
    );

    rebuildAutoMembership(props.entriesToRebuild).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Close modal
          props.onClose();
          // Set alert: success
          alerts.addAlert(
            "rebuild-auto-membership-success",
            "Automember rebuild membership task completed",
            "success"
          );
        } else if (response.data?.error) {
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
      data-cy="modal-button-ok"
      key="rebuild-auto-membership"
      variant="primary"
      onClick={onRebuildAutoMembership}
      form="rebuild-auto-membership-modal"
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
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
          <b>Warning</b> In case of a high number of users, hosts or groups, the
          rebuild task may require high CPU usage. This can severely impact
          server performance. Typically this only needs to be done once after
          importing raw data into the server. Are you sure you want to rebuild
          the auto memberships?
        </TextLayout>
      ),
    },
  ];

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        dataCy="rebuild-auto-membership-modal"
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
