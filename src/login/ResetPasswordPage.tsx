import React from "react";
// PatternFly
import {
  Form,
  FormGroup,
  TextInput,
  HelperText,
  HelperTextItem,
  ActionGroup,
  Button,
  LoginPage,
  ListVariant,
  ValidatedOptions,
} from "@patternfly/react-core";
// Images
import BrandImg from "src/assets/images/product-name.png";
import BackgroundImg from "src/assets/images/login-screen-background-3.jpg";
// RPC
import {
  ResponseOnPwdReset,
  ResetPasswordPayload,
  useResetPasswordMutation,
} from "src/services/rpcAuth";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Components
import PasswordInput from "src/components/layouts/PasswordInput";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  // Get user Id
  const location = useLocation();
  const uid = location.state.username as string;
  const msg = location.state.msg as string;

  // Show error message from login page when the page is loaded the first time
  React.useEffect(() => {
    if (msg) {
      alerts.addAlert("reset-password-error", msg, "danger");
    }
  }, []);

  // Navigate
  const navigate = useNavigate();

  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [resetPassword] = useResetPasswordMutation();

  // Main states
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [verifyPassword, setVerifyPassword] = React.useState<string>("");
  const [otp, setOtp] = React.useState<string>("");
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // Password visibility
  const [currentPasswordHidden, setCurrentPasswordHidden] =
    React.useState(true);
  const [newPasswordHidden, setNewPasswordHidden] = React.useState(true);
  const [verifyPasswordHidden, setVerifyPasswordHidden] = React.useState(true);
  const [otpHidden, setOtpHidden] = React.useState(true);

  // Verify passwords
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

  // Reset button should be disabled if some conditions are met
  const evaluateResetButtonDisabled = () => {
    if (
      uid === undefined ||
      currentPassword === "" ||
      newPassword === "" ||
      verifyPassword === "" ||
      newPassword !== verifyPassword
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isResetButtonDisabled = evaluateResetButtonDisabled();

  // Clear fields when the reset password operation failed
  const clearFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setVerifyPassword("");
    setOtp("");
  };

  // Reset password function
  const onResetPwd = () => {
    setBtnSpinning(true);

    const resetPwdData: ResetPasswordPayload = {
      username: uid,
      oldPassword: currentPassword,
      newPassword: newPassword,
    };
    if (otp !== "") {
      resetPwdData.otp = otp;
    }

    resetPassword(resetPwdData).then((response) => {
      const { response: resp, metaResponse } =
        response.error as ResponseOnPwdReset;

      if (resp !== undefined && metaResponse !== undefined) {
        const reason = metaResponse?.response?.headers.get(
          "x-ipa-pwchange-result"
        );
        const htmlMessage = resp.data as string;

        const match = htmlMessage.match(/<strong>(.*?)<\/strong>/);

        if (match && match[1]) {
          const errorMessage = match[1];
          if (errorMessage.includes("Password is too short")) {
            alerts.addAlert("reset-password-error", errorMessage, "danger");
            setBtnSpinning(false);
          } else if (reason === "invalid-password") {
            alerts.addAlert(
              "reset-password-error",
              "The password or username you entered is incorrect",
              "danger"
            );
            clearFields();
            setBtnSpinning(false);
          } else if (reason !== "ok" && reason !== "invalid-password") {
            alerts.addAlert("reset-password-error", reason, "danger");
            setBtnSpinning(false);
          } else {
            // Redirect to login page to allow the user to login with new credentials
            navigate("/login");
          }
        }
      }
    });
  };

  // Form fields
  const formFields = (
    <Form isHorizontal>
      <FormGroup label="username" fieldId="username">
        <TextInput
          data-cy="reset-password-textbox-username"
          id="username"
          name="username"
          type="text"
          value={uid}
          readOnlyVariant="plain"
        />
      </FormGroup>
      <FormGroup label="Current password" fieldId="current-password">
        <PasswordInput
          dataCy="reset-password-textbox-current-password"
          id="current-password"
          name="current_password"
          value={currentPassword}
          onChange={setCurrentPassword}
          onRevealHandler={setCurrentPasswordHidden}
          passwordHidden={currentPasswordHidden}
          isDisabled={!uid}
        />
      </FormGroup>
      <FormGroup label="New password" fieldId="new-password">
        <PasswordInput
          dataCy="reset-password-textbox-new-password"
          id="new-password"
          name="new_password"
          value={newPassword}
          onChange={setNewPassword}
          onRevealHandler={setNewPasswordHidden}
          passwordHidden={newPasswordHidden}
          isRequired={true}
          isDisabled={!uid}
        />
      </FormGroup>
      <FormGroup label="Verify password" fieldId="verify-password">
        <PasswordInput
          dataCy="reset-password-textbox-verify-password"
          id="verify-password"
          name="verify_password"
          value={verifyPassword}
          onChange={setVerifyPassword}
          onRevealHandler={setVerifyPasswordHidden}
          passwordHidden={verifyPasswordHidden}
          isRequired={true}
          isDisabled={!uid}
          validated={passwordValidationResult.pfError}
        />
        <HelperText>
          <HelperTextItem variant="error">
            {passwordValidationResult.message}
          </HelperTextItem>
        </HelperText>
      </FormGroup>
      <FormGroup label="OTP" fieldId="otp">
        <PasswordInput
          dataCy="reset-password-textbox-otp"
          id="otp"
          name="otp"
          value={otp}
          onChange={setOtp}
          onRevealHandler={setOtpHidden}
          passwordHidden={otpHidden}
          isDisabled={!uid}
        />
      </FormGroup>
      <ActionGroup>
        <Button
          data-cy="reset-password-button-cancel"
          variant="link"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          data-cy="reset-password-button-reset"
          variant="primary"
          isDisabled={isResetButtonDisabled || spinning}
          onClick={onResetPwd}
          isLoading={spinning}
        >
          {spinning ? "Resetting" : "Reset password"}
        </Button>
      </ActionGroup>
    </Form>
  );

  return (
    <>
      <alerts.ManagedAlerts />
      <LoginPage
        style={{ whiteSpace: "pre-line" }}
        footerListVariants={ListVariant.inline}
        brandImgSrc={BrandImg}
        brandImgAlt="FreeIPA logo"
        backgroundImgSrc={BackgroundImg}
        textContent={
          "OTP (One-Time Password): Leave blank if you are not using OTP tokens for authentication."
        }
        loginTitle="Reset password"
        loginSubtitle="Your password has expired. Please enter a new password"
      >
        {formFields}
      </LoginPage>
    </>
  );
};

export default ResetPasswordPage;
