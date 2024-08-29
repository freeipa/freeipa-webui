import React from "react";
// PatternFly
import {
  Button,
  HelperText,
  HelperTextItem,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
// Modals
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Components
import PasswordInput from "src/components/layouts/PasswordInput";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  PasswordChangePayload,
  useChangePasswordMutation,
} from "src/services/rpcUsers";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import { useAppSelector } from "src/store/hooks";

interface PropsToResetPassword {
  uid: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const ResetPassword = (props: PropsToResetPassword) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Get current logged-in user info
  const loggedInUser = useAppSelector(
    (state) => state.global.loggedUserInfo.arguments[0]
  );

  // RPC hooks
  const [resetPassword] = useChangePasswordMutation();

  // Passwords
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");

  const [passwordHidden, setPasswordHidden] = React.useState(true);
  const [currentPasswordHidden, setCurrentPasswordHidden] =
    React.useState(true);
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
  const notLoggedInfields = [
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

  const loggedInfields = [
    {
      id: "current-password",
      name: "Current Password",
      pfComponent: (
        <PasswordInput
          id="reset-password-current-password"
          name="current_password"
          value={currentPassword}
          aria-label="current password text input"
          onFocus={resetVerifyPassword}
          onChange={setCurrentPassword}
          onRevealHandler={setCurrentPasswordHidden}
          passwordHidden={currentPasswordHidden}
        />
      ),
    },
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
    {
      id: "otp",
      name: "OTP",
      pfComponent: (
        <TextInput
          id="reset-password-otp"
          name="otp"
          value={otp}
          aria-label="otp text input"
          onChange={(_event, newValue) => setOtp(newValue)}
        />
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
      let payload = {
        uid: props.uid,
        password: newPassword,
      } as PasswordChangePayload;

      if (props.uid === loggedInUser) {
        payload = {
          ...payload,
          currentPassword: currentPassword,
        };
        if (otp !== "") {
          payload = {
            ...payload,
            otp: otp,
          };
        }
      }

      resetPassword(payload).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Close modal
            resetFieldsAndCloseModal();
            // Refresh data
            props.onRefresh();
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
        fields={
          props.uid && props.uid === loggedInUser
            ? loggedInfields
            : notLoggedInfields
        }
        show={props.isOpen}
        onClose={resetFieldsAndCloseModal}
        actions={actions}
      />
    </>
  );
};

export default ResetPassword;
