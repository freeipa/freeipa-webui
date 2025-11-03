import React, { useState } from "react";
// PatternFly
import {
  Content,
  ContentVariants,
  Radio,
  Button,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import UsersDisplayTable from "src/components/tables/UsersDisplayTable";
// RPC
import {
  Command,
  BatchRPCResponse,
  useBatchMutCommandMutation,
} from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
// Data types
import { ErrorData, User } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Routing
import { useNavigate } from "react-router";

interface ButtonsData {
  updateIsDeleteButtonDisabled?: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedUsersData {
  selectedUsers: User[];
  clearSelectedUsers: () => void;
}

interface PropsToDeleteUsers {
  show: boolean;
  from: "active-users" | "stage-users" | "preserved-users";
  handleModalToggle: () => void;
  selectedUsersData: SelectedUsersData;
  buttonsData?: ButtonsData;
  onRefresh: () => void;
  onOpenDeleteModal?: () => void;
  onCloseDeleteModal?: () => void;
  fromSettings?: boolean | false;
}

const DeleteUsers = (props: PropsToDeleteUsers) => {
  const dispatch = useAppDispatch();

  // Redirect
  const navigate = useNavigate();

  // Define 'executeUserDelCommand' to add user data to IPA server
  const [executeUserDelCommand] = useBatchMutCommandMutation();

  // Radio buttons states
  const [isDeleteChecked, setIsDeleteChecked] = useState(true);

  // Only one radio button must be checked
  const manageRadioButtons = () => {
    setIsDeleteChecked(!isDeleteChecked);
  };

  // Generate page name (based on 'from' text)
  // E.g.: 'active-users' --> 'Active users'
  const getUserPageName = () => {
    const capitalizedName =
      props.from.charAt(0).toUpperCase() + props.from.slice(1);
    return capitalizedName.replace("-", " ");
  };

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to remove the selected entries from{" "}
          {getUserPageName()}?
        </Content>
      ),
    },
    {
      id: "deleted-users-table",
      pfComponent: (
        <UsersDisplayTable
          usersToDisplay={props.selectedUsersData.selectedUsers}
        />
      ),
    },
    {
      id: "radio-buttons",
      pfComponent: (
        <>
          <Content component={ContentVariants.p}>Remove mode</Content>
          <Radio
            data-cy="modal-radio-delete"
            id="radio-delete"
            label="Delete"
            name="radio-delete"
            isChecked={isDeleteChecked}
            onChange={manageRadioButtons}
          />
          <Radio
            data-cy="modal-radio-preserve"
            id="radio-preserve"
            label="Preserve"
            name="radio-preserve"
            isChecked={!isDeleteChecked}
            onChange={manageRadioButtons}
          />
        </>
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    setIsDeleteChecked(true);
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
      key="cancel"
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

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // Delete user
  const deleteUsers = (usersToDelete: User[]) => {
    // Prepare users params
    const usersToDeletePayload: Command[] = [];

    setBtnSpinning(true);

    let deletionParams = {};
    if (props.from !== "stage-users") {
      deletionParams = { preserve: !isDeleteChecked };
    }
    usersToDelete.map((user) => {
      let method = "user_del";
      if (props.from === "stage-users") {
        method = "stageuser_del";
      }
      let id = user.uid;
      if (Array.isArray(user.uid)) {
        id = user.uid[0];
      }
      const payloadItem = {
        method: method,
        params: [[id], deletionParams],
      } as Command;
      usersToDeletePayload.push(payloadItem);
    });

    // [API call] Delete elements
    executeUserDelCommand(usersToDeletePayload).then((response) => {
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
            // Reset selected values
            props.selectedUsersData.clearSelectedUsers();

            // Disable 'Delete' button
            if (props.buttonsData !== undefined) {
              if (
                props.from === "active-users" &&
                props.buttonsData.updateIsDeleteButtonDisabled !== undefined
              ) {
                props.buttonsData.updateIsDeleteButtonDisabled(true);
              }
              props.buttonsData.updateIsDeletion(true);
            }

            // Refresh data
            props.onRefresh();

            // Show alert: success
            if (isDeleteChecked) {
              dispatch(
                addAlert({
                  name: "remove-users-success",
                  title: "Users removed",
                  variant: "success",
                })
              );
            } else {
              dispatch(
                addAlert({
                  name: "preserve-users-success",
                  title: "Users preserved",
                  variant: "success",
                })
              );
            }
            // Redirect to main page
            if (props.from === "active-users") {
              navigate("/active-users");
            } else if (props.from === "stage-users") {
              navigate("/stage-users");
            } else if (props.from === "preserved-users") {
              navigate("/preserved-users");
            }
            // Close modal
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

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-delete"
      key="delete-users"
      variant="danger"
      onClick={() => {
        deleteUsers(props.selectedUsersData.selectedUsers);
      }}
      form="remove-users-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-user"
      variant="link"
      onClick={closeModal}
    >
      Cancel
    </Button>,
  ];

  let title = "Remove Active Users";
  if (props.from === "stage-users") {
    title = "Remove Stage Users";
    // Drop last field (radio buttons with option to perserve)
    fields.splice(-1);
  } else if (props.from === "preserved-users") {
    title = "Remove Preserved Users";
    // Drop last field (radio buttons with option to perserve)
    fields.splice(-1);
  }

  const modalDelete: JSX.Element = (
    <ModalWithFormLayout
      dataCy="delete-users-modal"
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title={title}
      formId="remove-users-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsDelete}
    />
  );

  // Set the Modal and Action buttons for 'Preserve' option
  const modalActionsPreserve: JSX.Element[] = [
    <Button
      data-cy="modal-button-preserve"
      key="preserve-users"
      variant="primary"
      onClick={() => {
        deleteUsers(props.selectedUsersData.selectedUsers);
      }}
      form="remove-users-modal"
      spinnerAriaValueText="Preserving"
      spinnerAriaLabel="Preserving"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Preserving" : "Preserve"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-user"
      variant="link"
      onClick={closeModal}
    >
      Cancel
    </Button>,
  ];

  const modalPreserve: JSX.Element = (
    <ModalWithFormLayout
      dataCy="preserve-users-modal"
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title={title}
      formId="remove-users-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsPreserve}
    />
  );

  // Render 'DeleteUsers'
  return (
    <>
      {isDeleteChecked ? modalDelete : modalPreserve}
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-users-modal-error"
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

export default DeleteUsers;
