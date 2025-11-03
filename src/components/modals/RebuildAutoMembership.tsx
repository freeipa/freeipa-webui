import React from "react";
// PatternFly
import { Button, Content } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Modals
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
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
  const dispatch = useAppDispatch();

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
    dispatch(
      addAlert({
        name: "rebuild-automember-start",
        title:
          "Starting automember rebuild membership task (this may take a long " +
          "time to complete) ...",
        variant: "info",
      })
    );

    rebuildAutoMembership(props.entriesToRebuild).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Close modal
          props.onClose();
          // Set alert: success
          dispatch(
            addAlert({
              name: "rebuild-auto-membership-success",
              title: "Automember rebuild membership task completed",
              variant: "success",
            })
          );
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "rebuild-auto-membership-error",
              title: errorMessage.message,
              variant: "danger",
            })
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
        <Content component="p">
          <b>Warning</b> In case of a high number of users, hosts or groups, the
          rebuild task may require high CPU usage. This can severely impact
          server performance. Typically this only needs to be done once after
          importing raw data into the server. Are you sure you want to rebuild
          the auto memberships?
        </Content>
      ),
    },
  ];

  // Render component
  return (
    <>
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
