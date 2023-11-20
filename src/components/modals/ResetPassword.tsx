import React from "react";
// PatternFly
import {
  Button,
  HelperText,
  HelperTextItem,
  ValidatedOptions,
} from "@patternfly/react-core";
// Modals
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Components
import PasswordInput from "../layouts/PasswordInput";
// RPC
import {
  ErrorResult,
  PasswordChangePayload,
  useChangePasswordMutation,
} from "src/services/rpc";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface PropsToResetPassword {
  uid: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ResetPassword = (props: PropsToResetPassword) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC hooks
  const [resetPassword] = useChangePasswordMutation();

  // Passwords
  const [newPassword, setNewPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");
  const [passwordHidden, setPasswordHidden] = React.useState(true);
  const [verifyPasswordHidden, setVerifyPasswordHidden] = React.useState(true);

  // Verify password
  const [passwordValidationResult, setPasswordValidationResult] =
    React.useState({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });

  const resetVerifyPassword = () => {
    setPasswordValidationResult({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

  // Fields
  const fields = [
    {
      id: "new-password",
      name: "New Password",
      pfComponent: (
        <PasswordInput
          id="reset-password-new-password"
          name="password"
          value={newPassword}
          aria-label="new password text input"
          onFocus={resetVerifyPassword}
          onChange={setNewPassword}
          onRevealHandler={setPasswordHidden}
          passwordHidden={passwordHidden}
        />
      ),
    },
    {
      id: "reset-password",
      name: "Verify password",
      pfComponent: (
        <>
          <PasswordInput
            id="reset-password-verify-password"
            name="password2"
            value={verifyPassword}
            aria-label="verify password text input"
            onFocus={resetVerifyPassword}
            onChange={setVerifyPassword}
            onRevealHandler={setVerifyPasswordHidden}
            passwordHidden={verifyPasswordHidden}
            validated={passwordValidationResult.pfError}
          />
          <HelperText>
            <HelperTextItem variant="error">
              {passwordValidationResult.message}
            </HelperTextItem>
          </HelperText>
        </>
      ),
    },
  ];

  // Checks that the passwords are the same
  const validatePasswords = () => {
    if (newPassword !== verifyPassword) {
      const verifyPassVal = {
        isError: true,
        message: "Passwords must match",
        pfError: ValidatedOptions.error,
      };
      setPasswordValidationResult(verifyPassVal);
      return true; // is error
    }
    resetVerifyPassword();
    return false;
  };

  // Verify the passwords are the same when we update a password value
  React.useEffect(() => {
    validatePasswords();
  }, [newPassword, verifyPassword]);

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

  // on Reset Password
  const onResetPassword = () => {
    // API call to reset password
    if (props.uid === undefined) {
      // Alert error: no uid
      alerts.addAlert(
        "undefined-uid-error",
        "No user selected to reset password",
        "danger"
      );
    } else {
      const payload = {
        uid: props.uid,
        password: newPassword,
      } as PasswordChangePayload;

      resetPassword(payload).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Close modal
            resetFieldsAndCloseModal();
            // Set alert: success
            alerts.addAlert(
              "reset-password-success",
              "Changed password for user '" + props.uid + "'",
              "success"
            );
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert(
              "reset-password-error",
              errorMessage.message,
              "danger"
            );
          }
        }
      });
    }
  };

  const actions = [
    <Button
      key={"reset-password"}
      variant="primary"
      onClick={onResetPassword}
      isDisabled={
        passwordValidationResult.isError ||
        newPassword === "" ||
        verifyPassword === ""
      }
    >
      Reset password
    </Button>,
    <Button
      key={"cancel-reset-password"}
      variant="link"
      onClick={resetFieldsAndCloseModal}
    >
      Cancel
    </Button>,
  ];
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="small"
        modalPosition="top"
        title="Reset password"
        description="Reset the password for the selected user"
        formId="reset-password-form"
        fields={fields}
        show={props.isOpen}
        onClose={resetFieldsAndCloseModal}
        actions={actions}
      />
    </>
  );
};

export default ResetPassword;
