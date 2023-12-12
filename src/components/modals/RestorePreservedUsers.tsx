import React, { useState } from "react";
// PatternFly
import {
  Button,
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
import { removeUser as removePreservedUser } from "src/store/Identity/preservedUsers-slice";
// RPC
import {
  Command,
  BatchRPCResponse,
  useBatchMutCommandMutation,
} from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Modals
import ErrorModal from "./ErrorModal";
// Data types
import { ErrorData } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface SelectedUsersData {
  selectedUsers: string[];
  updateSelectedUsers: (newSelectedUsers: string[]) => void;
}

export interface PropsToPreservedUsers {
  show: boolean;
  handleModalToggle: () => void;
  selectedUsersData: SelectedUsersData;
  onSuccess: () => void;
}

const RestorePreservedUsers = (props: PropsToPreservedUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts
  const alerts = useAlerts();

  // Define 'executeUserRestoreCommand' to restore a preserved user
  const [executeUserRestoreCommand] = useBatchMutCommandMutation();

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to restore the preserved entries?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "restore-users-table",
      pfComponent: (
        <UsersDisplayTable
          usersToDisplay={props.selectedUsersData.selectedUsers}
          from={"preserved-users"}
        />
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
    <Button key="cancel" variant="link" onClick={onCloseErrorModal}>
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

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // Restore preserved user
  const restoreUsers = () => {
    // Prepare user params
    const uidsToRestorePayload: Command[] = [];

    setBtnSpinning(true);

    props.selectedUsersData.selectedUsers.map((uid) => {
      const payloadItem = {
        method: "user_undel",
        params: [uid, {}],
      } as Command;
      uidsToRestorePayload.push(payloadItem);
    });

    // [API call] Restore elements
    executeUserRestoreCommand(uidsToRestorePayload).then((response) => {
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
            // Update data from Redux
            props.selectedUsersData.selectedUsers.map((user) => {
              dispatch(removePreservedUser(user[0]));
            });

            // Reset selected values
            props.selectedUsersData.updateSelectedUsers([]);

            // Refresh data or redirect
            props.onSuccess();

            // Show alert: success
            alerts.addAlert(
              "restore-users-success",
              "Users restored",
              "success"
            );

            closeModal();
          }
        } else if (error) {
          // Handle error
          handleAPIError(error);
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
    >
      {spinning ? "Restoring" : "Restore"}
    </Button>,
    <Button key="cancel-restore-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalRestore: JSX.Element = (
    <ModalWithFormLayout
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
  );

  return (
    <>
      <alerts.ManagedAlerts />
      {modalRestore}
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

export default RestorePreservedUsers;
