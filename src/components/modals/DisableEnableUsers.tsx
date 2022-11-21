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
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  setIsEnableButtonDisabled,
  setIsDisableButtonDisabled,
  setIsDisableEnableOp,
} from "src/store/shared/activeUsersShared-slice";
import { changeStatus } from "src/store/Identity/users-slice";

export interface PropsToDisableEnableUsers {
  show: boolean;
  handleModalToggle: () => void;
  optionSelected: string; // 'enable' | 'disable'
}

const DisableEnableUsers = (props: PropsToDisableEnableUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Get shared props (Redux)
  const selectedUsers = useAppSelector(
    (state) => state.activeUsersShared.selectedUsers
  );

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

  const modifyStatus = (newStatus: string, selectedUsers: string[]) => {
    dispatch(
      changeStatus({
        newStatus,
        selectedUsers,
      })
    );
    // Update 'isDisbleEnableOp' to notify table that an updating operation is performed
    dispatch(setIsDisableEnableOp(true));
    // Update buttons
    if (props.optionSelected === "enable") {
      dispatch(setIsEnableButtonDisabled(true));
      dispatch(setIsDisableButtonDisabled(false));
    } else if (props.optionSelected === "disable") {
      dispatch(setIsEnableButtonDisabled(false));
      dispatch(setIsDisableButtonDisabled(true));
    }
    closeModal();
  };

  // Set the Modal and Action buttons for 'Disable' option
  const modalActionsDisable: JSX.Element[] = [
    <Button
      key="disable-users"
      variant="primary"
      onClick={() => modifyStatus(props.optionSelected, selectedUsers)}
      form="active-users-enable-disable-users-modal"
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
      formId="active-users-enable-disable-users-modal"
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
      onClick={() => modifyStatus(props.optionSelected, selectedUsers)}
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
      formId="active-users-enable-disable-users-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsEnable}
    />
  );

  // Render 'DisableEnableUsers'
  return (
    <>
      {props.optionSelected === "enable" && modalEnable}
      {props.optionSelected === "disable" && modalDisable}
    </>
  );
};

export default DisableEnableUsers;
