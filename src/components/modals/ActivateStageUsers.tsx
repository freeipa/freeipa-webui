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

export interface PropsToActivateUsers {
  show: boolean;
  handleModalToggle: () => void;
  selectedUsersData: SelectedUsersData;
  //  NOTE: 'onRefresh' is handled as { (User) => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  onRefresh?: () => void;
  //  NOTE: 'onOpenAddModal' is handled as { () => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  onOpenDeleteModal?: () => void;
  //  NOTE: 'onCloseAddModal' is handled as { () => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  onCloseDeleteModal?: () => void;
}

const ActivateStageUsers = (props: PropsToActivateUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts
  const alerts = useAlerts();

  // Define 'executeUserStageCommand' to activate user data to IPA server
  const [executeUserActivateCommand] = useBatchMutCommandMutation();

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
          usersToDisplay={props.selectedUsersData.selectedUsers}
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

  // Stage user
  const activateUsers = () => {
    // Prepare users params
    const uidsToActivatePayload: Command[] = [];

    props.selectedUsersData.selectedUsers.map((uid) => {
      const payloadItem = {
        method: "stageuser_activate",
        params: [uid, { no_members: noMembersChecked }],
      } as Command;
      uidsToActivatePayload.push(payloadItem);
    });

    // [API call] activate elements
    executeUserActivateCommand(uidsToActivatePayload).then((response) => {
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
              dispatch(removeStageUser(user[0]));
            });

            // Reset selected values
            props.selectedUsersData.updateSelectedUsers([]);

            // Refresh data
            if (props.onRefresh !== undefined) {
              props.onRefresh();
            }

            // Show alert: success
            alerts.addAlert(
              "activate-users-success",
              "Users activated",
              "success"
            );

            closeModal();
          }
        } else if (error) {
          // Handle error
          handleAPIError(error);
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
      Stage
    </Button>,
    <Button key="cancel-stage-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalActivate: JSX.Element = (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Activate Stage User"
      formId="preserved-users-stage-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalStageActions}
    />
  );

  // Render 'ActivateStageUsers'
  return (
    <>
      <alerts.ManagedAlerts />
      {modalActivate}
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

export default ActivateStageUsers;
