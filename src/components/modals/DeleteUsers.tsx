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
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  setIsDeleteButtonDisabled,
  setSelectedUsers,
  setIsDeletion,
} from "src/store/shared/shared-slice";
import { removeUser } from "src/store/Identity/users-slice";

export interface PropsToDeleteUsers {
  show: boolean;
  handleModalToggle: () => void;
}

const DeleteUsers = (props: PropsToDeleteUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Get shared props (Redux)
  const selectedUsers = useAppSelector((state) => state.shared.selectedUsers);

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
      pfComponent: <DeletedUsersTable usersToDelete={selectedUsers} />,
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
    selectedUsers.map((user) => {
      dispatch(removeUser(user));
    });
    dispatch(setSelectedUsers([]));
    dispatch(setIsDeleteButtonDisabled(true));
    dispatch(setIsDeletion(true));
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
