import React from "react";
import {
  Button,
  TextContent,
  Text,
  TextVariants,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { changeStatus as changeStatusActiveUser } from "src/store/Identity/activeUsers-slice";
import { changeStatus as changeStatusStageUser } from "src/store/Identity/stageUsers-slice";
import { changeStatus as changeStatusPreservedUser } from "src/store/Identity/preservedUsers-slice";

interface ButtonsData {
  updateIsEnableButtonDisabled: (value: boolean) => void;
  updateIsDisableButtonDisabled: (value: boolean) => void;
  updateIsDisableEnableOp: (value: boolean) => void;
}

interface SelectedUsersData {
  selectedUsers: string[];
  updateSelectedUsers: (newSelectedUsers: string[]) => void;
}

export interface PropsToDisableEnableUsers {
  show: boolean;
  from: "active-users" | "stage-users" | "preserved-users";
  handleModalToggle: () => void;
  optionSelected: boolean; // 'enable': false | 'disable': true
  selectedUsersData: SelectedUsersData;
  buttonsData: ButtonsData;
}

const DisableEnableUsers = (props: PropsToDisableEnableUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to {props.optionSelected} selected entries?
          </Text>
        </TextContent>
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  const modifyStatus = (newStatus: boolean, selectedUsers: string[]) => {
    if (props.from === "active-users") {
      dispatch(
        changeStatusActiveUser({
          newStatus,
          selectedUsers,
        })
      );
    } else if (props.from === "stage-users") {
      dispatch(
        changeStatusStageUser({
          newStatus,
          selectedUsers,
        })
      );
    } else if (props.from === "preserved-users") {
      dispatch(
        changeStatusPreservedUser({
          newStatus,
          selectedUsers,
        })
      );
    }
    // Update 'isDisbleEnableOp' to notify table that an updating operation is performed
    props.buttonsData.updateIsDisableEnableOp(true);
    // Update buttons
    if (!props.optionSelected) {
      // Enable
      props.buttonsData.updateIsEnableButtonDisabled(true);
      props.buttonsData.updateIsDisableButtonDisabled(false);
    } else if (props.optionSelected) {
      // Disable
      props.buttonsData.updateIsEnableButtonDisabled(false);
      props.buttonsData.updateIsDisableButtonDisabled(true);
    }

    props.selectedUsersData.updateSelectedUsers([]);
    closeModal();
  };

  // Set the Modal and Action buttons for 'Disable' option
  const modalActionsDisable: JSX.Element[] = [
    <Button
      key="disable-users"
      variant="primary"
      onClick={() =>
        modifyStatus(
          props.optionSelected,
          props.selectedUsersData.selectedUsers
        )
      }
      form="users-enable-disable-users-modal"
    >
      Disable
    </Button>,
    <Button key="cancel-disable-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalDisable: JSX.Element = (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Disable confirmation"
      formId="users-enable-disable-users-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsDisable}
    />
  );

  // Set the Modal and Action buttons for 'Enable' option
  const modalActionsEnable: JSX.Element[] = [
    <Button
      key="enable-users"
      variant="primary"
      onClick={() =>
        modifyStatus(
          props.optionSelected,
          props.selectedUsersData.selectedUsers
        )
      }
      form="active-users-enable-disable-users-modal"
    >
      Enable
    </Button>,
    <Button key="cancel-enable-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalEnable: JSX.Element = (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Enable confirmation"
      formId="users-enable-disable-users-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsEnable}
    />
  );

  // Render 'DisableEnableUsers'
  return (
    <>
      {!props.optionSelected && modalEnable}
      {props.optionSelected && modalDisable}
    </>
  );
};

export default DisableEnableUsers;
