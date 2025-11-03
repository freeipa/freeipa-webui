import React from "react";
// PatternFly
import { Button, Content, ContentVariants } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import UsersDisplayTable from "src/components/tables/UsersDisplayTable";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// RPC
import { BatchRPCResponse } from "src/services/rpc";
import { useRestoreUserMutation } from "src/services/rpcUsers";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";

interface PropsToPreservedUsers {
  show: boolean;
  handleModalToggle: () => void;
  selectedUsers: User[];
  clearSelectedUsers: () => void;
  onSuccess: () => void;
}

const RestorePreservedUsers = (props: PropsToPreservedUsers) => {
  const dispatch = useAppDispatch();

  // Define 'executeUserRestoreCommand' to restore a preserved user
  const [executeUserRestoreCommand] = useRestoreUserMutation();

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to restore the preserved entries?
        </Content>
      ),
    },
    {
      id: "restore-users-table",
      pfComponent: <UsersDisplayTable usersToDisplay={props.selectedUsers} />,
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // Restore preserved user
  const restoreUsers = () => {
    setBtnSpinning(true);

    // Prepare users params
    const uidsToRestorePayload = props.selectedUsers;

    // [API call] Restore elements
    executeUserRestoreCommand(uidsToRestorePayload).then((response) => {
      if ("data" in response) {
        const data = response.data as BatchRPCResponse;
        const result = data.result;
        const error = data.error;

        if (result) {
          // Close modal
          closeModal();

          // Reset selected values
          props.clearSelectedUsers();

          // Show alert: success
          let successMessage = "";
          if (result.count > 1) {
            successMessage = result.count + " users restored";
          } else if (result.count === 1) {
            successMessage = result.results[0].summary;
          }
          dispatch(
            addAlert({
              name: "restore-users-success",
              title: successMessage,
              variant: "success",
            })
          );

          // Refresh data or navigate
          props.onSuccess();
        } else if (error) {
          // Handle error
          dispatch(
            addAlert({
              name: "restore-users-error",
              title: error,
              variant: "danger",
            })
          );
        }
      }
      setBtnSpinning(false);
    });
  };

  // Set the Modal and Action buttons for 'Restore' option
  const modalRestoreActions: JSX.Element[] = [
    <Button
      key="restore-users"
      variant="primary"
      onClick={restoreUsers}
      form="restore-users-modal"
      spinnerAriaValueText="Restoring"
      spinnerAriaLabel="Restoring"
      isLoading={spinning}
      isDisabled={spinning}
      data-cy="modal-button-restore"
    >
      {spinning ? "Restoring" : "Restore"}
    </Button>,
    <Button
      key="cancel-restore-user"
      variant="link"
      onClick={closeModal}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="restore-preserved-users-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Restore preserved user"
        formId="restore-users-stage-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalRestoreActions}
      />
    </>
  );
};

export default RestorePreservedUsers;
