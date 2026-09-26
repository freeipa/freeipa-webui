import React from "react";
// PatternFly
import { Button, Checkbox, TextArea } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
import PasswordInput from "src/components/layouts/PasswordInput";
// RPC
import { useAddSysAccountMutation } from "src/services/rpcSystemAccounts";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddSysAccountModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addSysAccount] = useAddSysAccountMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [accountId, setAccountId] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [privileged, setPrivileged] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");
  const [passwordHidden, setPasswordHidden] = React.useState(true);
  const [verifyPasswordHidden, setVerifyPasswordHidden] = React.useState(true);

  // Clear fields
  const clearFields = () => {
    setAccountId("");
    setDescription("");
    setPrivileged(false);
    setNewPassword("");
    setVerifyPassword("");
    setPasswordHidden(true);
    setVerifyPasswordHidden(true);
  };

  // Passwords must match when both are filled
  const verifiedPasswords =
    newPassword === verifyPassword &&
    newPassword.length > 0 &&
    verifyPassword.length > 0;

  // Buttons disabled until required fields are valid
  const mandatoryEmpty = accountId === "" || !verifiedPasswords;

  // 'Add' button handler
  const onAddSysAccount = () => {
    setIsAddButtonSpinning(true);

    addSysAccount({
      cn: accountId,
      description: description || undefined,
      userpassword: newPassword,
      privileged: privileged || undefined,
    })
      .then((response) => {
        if ("data" in response) {
          const data = response.data?.result;
          const error = response.data?.error as SerializedError;

          if (error) {
            dispatch(
              addAlert({
                name: "add-sysaccount-error",
                title: error.message,
                variant: "danger",
              })
            );
          }

          if (data) {
            dispatch(
              addAlert({
                name: "add-sysaccount-success",
                title: "New system account added",
                variant: "success",
              })
            );
            clearFields();
            props.onRefresh();
            props.onClose();
          }
        }
      })
      .finally(() => {
        setIsAddButtonSpinning(false);
      });
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "modal-form-sysaccount-id",
      name: "System account ID",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-sysaccount-id"
          id="modal-form-sysaccount-id"
          name="cn"
          value={accountId}
          onChange={setAccountId}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-description",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-description"
          id="modal-form-description"
          name="description"
          value={description}
          aria-label="System account description"
          onChange={(_event, value: string) => setDescription(value)}
          autoResize
        />
      ),
    },
    {
      id: "modal-form-privileged",
      pfComponent: (
        <Checkbox
          data-cy="modal-checkbox-privileged"
          label="Change passwords without reset"
          id="modal-form-privileged"
          isChecked={privileged}
          onChange={(_event, checked: boolean) => setPrivileged(checked)}
        />
      ),
    },
    {
      id: "modal-form-new-password",
      name: "New password",
      pfComponent: (
        <PasswordInput
          dataCy="modal-textbox-new-password"
          id="modal-form-new-password"
          name="userpassword"
          value={newPassword}
          onChange={setNewPassword}
          onRevealHandler={setPasswordHidden}
          passwordHidden={passwordHidden}
          isRequired
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-verify-password",
      name: "Verify password",
      pfComponent: (
        <PasswordInput
          dataCy="modal-textbox-verify-password"
          id="modal-form-verify-password"
          name="userpassword2"
          value={verifyPassword}
          onChange={setVerifyPassword}
          onRevealHandler={setVerifyPasswordHidden}
          passwordHidden={verifyPasswordHidden}
          isRequired
          rules={[
            {
              id: "verify-match",
              message: "Passwords must match",
              validate: (v: string) => v === newPassword,
            },
          ]}
        />
      ),
      fieldRequired: true,
    },
  ];

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={isAddButtonSpinning || mandatoryEmpty}
      form="add-modal-form"
      type="submit"
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-sysaccount-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title={props.title}
      formId="add-modal-form"
      fields={fields}
      show={props.isOpen}
      onSubmit={() => onAddSysAccount()}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddSysAccountModal;
