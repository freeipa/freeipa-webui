import React, { useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import UsersDisplayTable from "src/components/tables/UsersDisplayTable";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { removeUser as removeStageUser } from "src/store/Identity/stageUsers-slice";
// RPC
import { useActivateUserMutation, ErrorResult } from "src/services/rpc";
// Hooks
import useAlerts from "src/hooks/useAlerts";

export interface PropsToActivateUsers {
  show: boolean;
  handleModalToggle: () => void;
  selectedUids: string[];
  onSuccess: () => void;
}

const ActivateStageUsers = (props: PropsToActivateUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

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
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to activate the selected stage users?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "activate-users-table",
      pfComponent: (
        <UsersDisplayTable
          usersToDisplay={props.selectedUids}
          from={"stage-users"}
        />
      ),
    },
    {
      id: "no-members",
      pfComponent: (
        <Checkbox
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
    const uidsToActivatePayload = props.selectedUids;

    // [API call] activate elements
    activateUsersCommand(uidsToActivatePayload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          props.handleModalToggle();
          // Update data from Redux
          props.selectedUids.map((user) => {
            dispatch(removeStageUser(user[0]));
          });
          // Set alert: success
          alerts.addAlert(
            "activate-users-success",
            response.data.result.count + " users activated",
            "success"
          );
          // Refresh data ('Stage users' main page) or redirect ('Settings' page)
          props.onSuccess();
        } else if (response.data.error) {
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
    >
      Activate
    </Button>,
    <Button key="cancel-stage-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  // Render 'ActivateStageUsers'
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
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
