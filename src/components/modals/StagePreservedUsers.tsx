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
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "./ErrorModal";
// Data types
import { ErrorData } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";

export interface PropsToStagePreservedUsers {
  show: boolean;
  handleModalToggle: () => void;
  selectedUsers: User[];
  clearSelectedUsers: () => void;
  onSuccess: () => void;
}

const StagePreservedUsers = (props: PropsToStagePreservedUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts
  const alerts = useAlerts();

  // Define 'executeUserStageCommand' to stage a preserved user
  const [executeUserStageCommand] = useBatchMutCommandMutation();

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to stage the selected preserved entries?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "stage-users-table",
      pfComponent: <UsersDisplayTable usersToDisplay={props.selectedUsers} />,
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

  // Stage preserved user
  const stageUsers = () => {
    // Prepare users params
    const uidsToStagePayload: Command[] = [];

    setBtnSpinning(true);

    props.selectedUsers.map((user) => {
      const payloadItem = {
        method: "user_stage",
        params: [[user.uid], {}],
      } as Command;
      uidsToStagePayload.push(payloadItem);
    });

    // [API call] Stage elements
    executeUserStageCommand(uidsToStagePayload).then((response) => {
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
            props.selectedUsers.map((user) => {
              dispatch(removePreservedUser(user[0]));
            });

            // Reset selected values
            props.clearSelectedUsers();

            // Show alert: success
            alerts.addAlert("stage-users-success", "Users staged", "success");

            // Close modal
            closeModal();

            // Navigate to selected page
            props.onSuccess();
          }
        } else if (error) {
          // Handle error
          handleAPIError(error);
        }
      }
      setBtnSpinning(false);
    });
  };

  // Set the Modal and Action buttons for 'Stage' option
  const modalStageActions: JSX.Element[] = [
    <Button
      key="stage-users"
      variant="primary"
      onClick={stageUsers}
      form="stage-users-modal"
      spinnerAriaValueText="Staging"
      spinnerAriaLabel="Staging"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Staging" : "Stage"}
    </Button>,
    <Button key="cancel-stage-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalStage: JSX.Element = (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Stage preserved user"
      formId="preserved-users-stage-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalStageActions}
    />
  );

  return (
    <>
      <alerts.ManagedAlerts />
      {modalStage}
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

export default StagePreservedUsers;
