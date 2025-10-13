import React, { useState } from "react";
import { Button, Content, ContentVariants } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import { User } from "src/utils/datatypes/globalDataTypes";
// RPC
import {
  Command,
  BatchRPCResponse,
  useBatchMutCommandMutation,
  ErrorResult,
} from "src/services/rpc";
import {
  useEnableUserMutation,
  useDisableUserMutation,
} from "src/services/rpcUsers";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "src/components/modals/ErrorModal";
// Data types
import { ErrorData } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface ButtonsData {
  updateIsEnableButtonDisabled: (value: boolean) => void;
  updateIsDisableButtonDisabled: (value: boolean) => void;
  updateIsDisableEnableOp: (value: boolean) => void;
}

interface SelectedUsersData {
  selectedUsers: User[];
  clearSelectedUsers: () => void;
}

export interface PropsToDisableEnableUsers {
  show: boolean;
  from: "active-users" | "stage-users" | "preserved-users";
  handleModalToggle: () => void;
  optionSelected: boolean; // 'enable': false | 'disable': true
  selectedUsersData: SelectedUsersData;
  buttonsData?: ButtonsData;
  //  NOTE: 'onRefresh' is handled as { (User) => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  onRefresh?: () => void;
  // By default, the API call will be a batch operation (multiple users at once)
  // - If 'singleUser' is set to 'true', the API call will be a single operation
  singleUser?: boolean | false;
}

const DisableEnableUsers = (props: PropsToDisableEnableUsers) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Define 'executeEnableDisableCommand' to add user data to IPA server
  const [executeEnableDisableCommand] = useBatchMutCommandMutation();
  // Single user operations
  const [enableSingleUser] = useEnableUserMutation();
  const [disableSingleUser] = useDisableUserMutation();

  // Define which action (enable | disable) based on 'optionSelected'
  const action = !props.optionSelected ? "enable" : "disable";

  const users = props.selectedUsersData.selectedUsers.map((user) => user.uid);

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <>
          <Content component={ContentVariants.p}>
            Are you sure you want to {action} selected entries?
          </Content>
          <Content component={ContentVariants.p}>
            <i>{users.join(", ")}</i>
          </Content>
        </>
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
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
    <Button
      data-cy="modal-button-ok"
      key="ok"
      variant="link"
      onClick={onCloseErrorModal}
    >
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

  // Modify user status using IPA commands
  // TODO: Better Adapt this function to several use-cases
  const modifyStatus = (newStatus: boolean, selectedUsers: User[]) => {
    // Prepare users params
    const uidsToChangeStatusPayload: Command[] = [];
    const changeStatusParams = {};
    const option = props.optionSelected ? "user_disable" : "user_enable";

    // Make the API call (depending on 'singleUser' value)
    if (props.singleUser === undefined || !props.singleUser) {
      selectedUsers.map((user) => {
        const payloadItem = {
          method: option,
          params: [user.uid, changeStatusParams],
        } as Command;

        uidsToChangeStatusPayload.push(payloadItem);
      });

      executeEnableDisableCommand(uidsToChangeStatusPayload).then(
        (response) => {
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
                if (props.buttonsData !== undefined) {
                  // Update 'isDisbleEnableOp' to notify table that an updating operation is performed
                  props.buttonsData.updateIsDisableEnableOp(true);

                  // Update buttons
                  if (!props.optionSelected) {
                    // Enable
                    props.buttonsData.updateIsEnableButtonDisabled(true);
                    props.buttonsData.updateIsDisableButtonDisabled(false);
                    // Set alert: success
                    alerts.addAlert(
                      "enable-user-success",
                      "Users enabled",
                      "success"
                    );
                  } else if (props.optionSelected) {
                    // Disable
                    props.buttonsData.updateIsEnableButtonDisabled(false);
                    props.buttonsData.updateIsDisableButtonDisabled(true);
                    // Set alert: success
                    alerts.addAlert(
                      "disable-user-success",
                      "Users disabled",
                      "success"
                    );
                  }
                }

                // Reset selected users
                props.selectedUsersData.clearSelectedUsers();

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
        }
      );
    } else {
      // Single user operation
      let command;
      if (option === "user_disable") {
        command = disableSingleUser;
      } else {
        command = enableSingleUser;
      }

      const payload = props.selectedUsersData.selectedUsers[0];

      command(payload).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Close modal
            closeModal();
            // Set alert: success
            alerts.addAlert(
              "enable-user-success",
              "Enabled user account '" +
                props.selectedUsersData.selectedUsers[0].uid +
                "'",
              "success"
            );
            // Reset selected users
            props.selectedUsersData.clearSelectedUsers();
            // Refresh data
            if (props.onRefresh !== undefined) {
              props.onRefresh();
            }
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert(
              "enable-user-error",
              errorMessage.message,
              "danger"
            );
          }
        }
      });
    }
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
      data-cy="modal-button-disable"
    >
      Disable
    </Button>,
    <Button
      key="cancel-disable-user"
      variant="link"
      onClick={closeModal}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  const modalDisable: JSX.Element = (
    <ModalWithFormLayout
      dataCy="disable-users-modal"
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
      data-cy="modal-button-enable"
    >
      Enable
    </Button>,
    <Button
      key="cancel-enable-user"
      variant="link"
      onClick={closeModal}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  const modalEnable: JSX.Element = (
    <ModalWithFormLayout
      dataCy="enable-users-modal"
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
      <alerts.ManagedAlerts />
      {!props.optionSelected ? modalEnable : modalDisable}
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="disable-enable-users-modal-error"
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
