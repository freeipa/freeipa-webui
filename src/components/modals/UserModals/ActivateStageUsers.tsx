import React, { useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Content,
  ContentVariants,
} from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import UsersDisplayTable from "src/components/tables/UsersDisplayTable";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useActivateUserMutation } from "src/services/rpcUsers";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface PropsToActivateUsers {
  show: boolean;
  handleModalToggle: () => void;
  selectedUsers: User[];
  onSuccess: () => void;
}

const ActivateStageUsers = (props: PropsToActivateUsers) => {
  // Alerts
  const alerts = useAlerts();

  // Define 'executeUserStageCommand' to activate user data to IPA server
  const [activateUsersCommand] = useActivateUserMutation();

  const [noMembersChecked, setNoMembers] = useState<boolean>(false);

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to activate the selected stage users?
        </Content>
      ),
    },
    {
      id: "activate-users-table",
      pfComponent: <UsersDisplayTable usersToDisplay={props.selectedUsers} />,
    },
    {
      id: "no-members",
      pfComponent: (
        <Checkbox
          data-cy="modal-checkbox-suppress-membership"
          label="Suppress processing of membership attributes"
          isChecked={noMembersChecked}
          onChange={() => {
            setNoMembers(!noMembersChecked);
          }}
          id="no-members-checkbox"
          name="no-members"
        />
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  // Stage user
  const activateUsers = () => {
    // Prepare users params
    const usersToActivatePayload = props.selectedUsers;

    // [API call] activate elements
    activateUsersCommand(usersToActivatePayload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Close modal
          props.handleModalToggle();
          // Set alert: success
          alerts.addAlert(
            "activate-users-success",
            response.data.result.count + " users activated",
            "success"
          );
          // Refresh data ('Stage users' main page) or redirect ('Settings' page)
          props.onSuccess();
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "activate-users-error",
            errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  // Set the Modal and Action buttons for 'Stage' option
  const modalStageActions: JSX.Element[] = [
    <Button
      key="stage-users"
      variant="primary"
      onClick={activateUsers}
      form="stage-users-modal"
      data-cy="modal-button-activate"
    >
      Activate
    </Button>,
    <Button
      key="cancel-stage-user"
      variant="link"
      onClick={closeModal}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  // Render 'ActivateStageUsers'
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        dataCy="activate-stage-users-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Activate Stage User"
        formId="stage-user-activate-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalStageActions}
      />
    </>
  );
};

export default ActivateStageUsers;
