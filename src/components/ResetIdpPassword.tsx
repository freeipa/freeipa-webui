import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Data types
import { IDPServer } from "src/utils/datatypes/globalDataTypes";
// Modals
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Components
import PasswordInput from "src/components/layouts/PasswordInput";
// RPC
import { IdpModPayload, useIdpModMutation } from "src/services/rpcIdp";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";

interface PropsToResetIdpPassword {
  idpId: string;
  isOpen: boolean;
  onClose: () => void;
  onIdpRefChange: (idpRef: Partial<IDPServer>) => void;
  onRefresh: () => void;
}

const ResetIdpPassword = (props: PropsToResetIdpPassword) => {
  const dispatch = useAppDispatch();

  // RPC
  const [resetPassword] = useIdpModMutation();

  // States
  const [newPassword, setNewPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");
  const [passwordHidden, setPasswordHidden] = React.useState(true);
  const [verifyPasswordHidden, setVerifyPasswordHidden] = React.useState(true);

  // Fields
  const fields = [
    {
      id: "modal-form-reset-password-new-password",
      name: "New Password",
      pfComponent: (
        <PasswordInput
          id="modal-form-reset-password-new-password"
          name="password"
          value={newPassword}
          aria-label="new password text input"
          onChange={setNewPassword}
          onRevealHandler={setPasswordHidden}
          passwordHidden={passwordHidden}
          dataCy="modal-textbox-new-password"
        />
      ),
    },
    {
      id: "modal-form-reset-password-verify-password",
      name: "Verify password",
      pfComponent: (
        <>
          <PasswordInput
            id="modal-form-reset-password-verify-password"
            name="password2"
            value={verifyPassword}
            aria-label="verify password text input"
            onChange={setVerifyPassword}
            onRevealHandler={setVerifyPasswordHidden}
            passwordHidden={verifyPasswordHidden}
            dataCy="modal-textbox-verify-password"
            rules={[
              {
                id: "verify-match",
                message: "Passwords must match",
                validate: (v: string) => v === newPassword,
              },
            ]}
          />
        </>
      ),
    },
  ];

  // Reset fields and close modal
  const resetFieldsAndCloseModal = () => {
    // Reset fields
    setNewPassword("");
    setVerifyPassword("");
    setPasswordHidden(true);
    setVerifyPasswordHidden(true);
    // Close modal
    props.onClose();
  };

  // API call to reset password
  const onResetPassword = () => {
    const payload: IdpModPayload = {
      idpId: props.idpId,
      ipaidpclientsecret: newPassword,
    };

    resetPassword(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          dispatch(
            addAlert({
              name: "error",
              title: (data.error as Error).message,
              variant: "danger",
            })
          );
        }
        if (data?.result) {
          props.onIdpRefChange(data.result.result);
          dispatch(
            addAlert({
              name: "success",
              title: "Identity Provider password successfully updated",
              variant: "success",
            })
          );
          // Refresh the data
          props.onRefresh();
          // Reset values and close
          resetFieldsAndCloseModal();
        }
      }
    });
  };

  const actions = [
    <Button
      data-cy="modal-button-reset-password"
      key={"reset-password"}
      variant="primary"
      type="submit"
      form="reset-password-form"
      isDisabled={
        newPassword === "" ||
        verifyPassword === "" ||
        newPassword !== verifyPassword
      }
    >
      Reset password
    </Button>,
    <Button
      data-cy="modal-button-cancel-reset-password"
      key={"cancel-reset-password"}
      variant="link"
      onClick={resetFieldsAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Return component
  return (
    <ModalWithFormLayout
      dataCy="reset-password-modal"
      variantType="small"
      modalPosition="top"
      title="Reset password"
      formId="reset-password-form"
      fields={fields}
      show={props.isOpen}
      onSubmit={onResetPassword}
      onClose={resetFieldsAndCloseModal}
      actions={actions}
    />
  );
};

export default ResetIdpPassword;
