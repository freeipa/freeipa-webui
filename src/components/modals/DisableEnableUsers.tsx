import React, { useState } from "react";
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
// RPC
import {
  Command,
  BatchRPCResponse,
  useBatchMutCommandMutation,
} from "src/services/rpc";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "./ErrorModal";
import { ErrorData } from "src/utils/datatypes/globalDataTypes";

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
  //  NOTE: 'onRefresh' is handled as { (User) => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  onRefresh?: () => void;
}

const DisableEnableUsers = (props: PropsToDisableEnableUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Define 'executeEnableDisableCommand' to add user data to IPA server
  const [executeEnableDisableCommand] = useBatchMutCommandMutation();

  // Define which action (enable | disable) based on 'optionSelected'
  const action = !props.optionSelected ? "enable" : "disable";

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to {action} selected entries?
          </Text>
        </TextContent>
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  // Update changes in Redux
  const dispatchToRedux = (newStatus: boolean, selectedUsers: string[]) => {
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
  };

  // Handle API error data
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
  };

  const errorModalActions = [
    <Button key="ok" variant="link" onClick={onCloseErrorModal}>
      OK
    </Button>,
  ];

  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("code" in error) {
      setErrorTitle("IPA error " + error.code + ": " + error.name);
      if (error.message !== undefined) {
        setErrorMessage(error.message);
      }
    } else if ("data" in error) {
      const errorData = error.data as ErrorData;
      const errorCode = errorData.code as string;
      const errorName = errorData.name as string;
      const errorMessage = errorData.error as string;

      setErrorTitle("IPA error " + errorCode + ": " + errorName);
      setErrorMessage(errorMessage);
    }
    setIsModalErrorOpen(true);
  };

  // Modify user status for those pages not adapted to the C.L.
  // TODO: Remove this function when the C.L. is set in all user pages
  const oldModifyStatus = (newStatus: boolean, selectedUsers: string[]) => {
    // Update changes to Redux
    dispatchToRedux(newStatus, selectedUsers);

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

    // Reset selected users
    props.selectedUsersData.updateSelectedUsers([]);
    closeModal();
  };

  // Modify user status using IPA commands
  const modifyStatus = (newStatus: boolean, selectedUsers: string[]) => {
    // Prepare users params
    const uidsToChangeStatusPayload: Command[] = [];
    const changeStatusParams = {};
    const option = props.optionSelected ? "user_disable" : "user_enable";

    selectedUsers.map((uid) => {
      const payloadItem = {
        method: option,
        params: [uid, changeStatusParams],
      } as Command;

      uidsToChangeStatusPayload.push(payloadItem);
    });

    executeEnableDisableCommand(uidsToChangeStatusPayload).then((response) => {
      if ("data" in response) {
        const data = response.data as BatchRPCResponse;
        const result = data.result;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (result) {
          if ("error" in result.results[0] && result.results[0].error) {
            const errorData = {
              code: result.results[0].error_code,
              name: result.results[0].error_name,
              error: result.results[0].error,
            } as ErrorData;

            const error = {
              status: "CUSTOM_ERROR",
              data: errorData,
            } as FetchBaseQueryError;

            // Handle error
            handleAPIError(error);
          } else {
            // Update changes to Redux
            dispatchToRedux(newStatus, selectedUsers);

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

            // Reset selected users
            props.selectedUsersData.updateSelectedUsers([]);

            // Refresh data
            if (props.onRefresh !== undefined) {
              props.onRefresh();
            }
          }
        } else if (error) {
          // Handle error
          handleAPIError(error);
        }
        // Close modal
        closeModal();
      }
    });
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
        props.from === "active-users"
          ? modifyStatus(
              props.optionSelected,
              props.selectedUsersData.selectedUsers
            )
          : oldModifyStatus(
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
      {!props.optionSelected ? modalEnable : modalDisable}
      {isModalErrorOpen && (
        <ErrorModal
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default DisableEnableUsers;
