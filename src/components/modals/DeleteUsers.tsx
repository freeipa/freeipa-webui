import React, { useState } from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Radio,
  Button,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import DeletedUsersTable from "src/components/tables/DeletedUsersTable";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { removeUser as removeActiveUser } from "src/store/Identity/activeUsers-slice";
import { removeUser as removeStageUser } from "src/store/Identity/stageUsers-slice";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedUsersData {
  selectedUsers: string[];
  updateSelectedUsers: (newSelectedUsers: string[]) => void;
}

export interface PropsToDeleteUsers {
  show: boolean;
  from: "active-users" | "stage-users" | "preserved-users";
  handleModalToggle: () => void;
  selectedUsersData: SelectedUsersData;
  buttonsData: ButtonsData;
}

const DeleteUsers = (props: PropsToDeleteUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Radio buttons states
  const [isDeleteChecked, setIsDeleteChecked] = useState(true);

  // Only one radio button must be checked
  const manageRadioButtons = () => {
    setIsDeleteChecked(!isDeleteChecked);
  };

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to remove the selected entries from Active
            users?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "deleted-users-table",
      pfComponent: (
        <DeletedUsersTable
          usersToDelete={props.selectedUsersData.selectedUsers}
          from={props.from}
        />
      ),
    },
    {
      id: "radio-buttons",
      pfComponent: (
        <>
          <TextContent>
            <Text component={TextVariants.p}>Remove mode</Text>
          </TextContent>
          <Radio
            id="radio-delete"
            label="Delete"
            name="radio-delete"
            isChecked={isDeleteChecked}
            onChange={manageRadioButtons}
          />
          <Radio
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

  // Redux: Delete user
  const deleteUsers = () => {
    props.selectedUsersData.selectedUsers.map((user) => {
      if (props.from === "active-users") {
        dispatch(removeActiveUser(user));
      } else if (props.from === "stage-users") {
        dispatch(removeStageUser(user));
      }
    });
    props.selectedUsersData.updateSelectedUsers([]);
    props.buttonsData.updateIsDeleteButtonDisabled(true);
    props.buttonsData.updateIsDeletion(true);
    closeModal();
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-users"
      variant="danger"
      onClick={deleteUsers}
      form="active-users-remove-users-modal"
    >
      Delete
    </Button>,
    <Button key="cancel-new-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalDelete: JSX.Element = (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Remove active users"
      formId="active-users-remove-users-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsDelete}
    />
  );

  // Set the Modal and Action buttons for 'Preserve' option
  const modalActionsPreserve: JSX.Element[] = [
    <Button
      key="preserve-users"
      variant="primary"
      onClick={() => alert("This functionality will be provided soon!")}
      form="active-users-remove-users-modal"
    >
      Preserve
    </Button>,
    <Button key="cancel-new-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalPreserve: JSX.Element = (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Remove active users"
      formId="active-users-remove-users-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsPreserve}
    />
  );

  // Render 'DeleteUsers'
  return <>{isDeleteChecked ? modalDelete : modalPreserve}</>;
};

export default DeleteUsers;
