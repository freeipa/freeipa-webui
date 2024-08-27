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
import BrandImg from "src/assets/images/login-screen-logo.png";
import BackgroundImg from "src/assets/images/login-screen-background.jpg";
// RPC
import {
  MetaResponse,
  ResetPasswordPayload,
  useResetPasswordMutation,
  useUserPasswordLoginMutation,
} from "src/services/rpcAuth";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { setIsLogin } from "src/store/Global/auth-slice";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Components
import PasswordInput from "src/components/layouts/PasswordInput";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  // Get user Id
  const location = useLocation();
  const uid = location.state as string;

  // Redux
  const dispatch = useAppDispatch();

  // Navigate
  const navigate = useNavigate();

  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [resetPassword] = useResetPasswordMutation();
  const [onUserPwdLogin] = useUserPasswordLoginMutation();

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
      verifyPassword === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isResetButtonDisabled = evaluateResetButtonDisabled();

  // Login function
  const onLogin = () => {
    onUserPwdLogin({ username: uid, password: newPassword }).then(() => {
      dispatch(setIsLogin({ loggedInUser: uid, error: null }));
      setBtnSpinning(false);
      // Assuming sucessful login. Refresh page
      window.location.reload();
    });
  };

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
      if ("error" in response) {
        const receivedError = response.error as MetaResponse;
        const reason = receivedError.response?.headers.get(
          "x-ipa-pwchange-result"
        );

        if (reason === "invalid-password") {
          alerts.addAlert(
            "reset-password-error",
            "The password or username you entered is incorrect",
            "danger"
          );
          clearFields();
          setBtnSpinning(false);
        } else {
          // Login with the new credentials
          onLogin();
        }
      }
    });
  };

  // Form fields
  const formFields = (
    <Form isHorizontal>
      <FormGroup label="username" fieldId="username">
        <TextInput
          id="username"
          name="username"
          type="text"
          value={uid}
          readOnlyVariant="plain"
        />
      </FormGroup>
      <FormGroup label="Current password" fieldId="currentPassword">
        <PasswordInput
          id="form-current-password"
          name="current_password"
          value={currentPassword}
          onChange={setCurrentPassword}
          onRevealHandler={setCurrentPasswordHidden}
          passwordHidden={currentPasswordHidden}
          isDisabled={!uid}
        />
      </FormGroup>
      <FormGroup label="New password" fieldId="newPassword">
        <PasswordInput
          id="form-new-password"
          name="new_password"
          value={newPassword}
          onChange={setNewPassword}
          onRevealHandler={setNewPasswordHidden}
          passwordHidden={newPasswordHidden}
          isRequired={true}
          isDisabled={!uid}
        />
      </FormGroup>
      <FormGroup label="Verify password" fieldId="verifyPassword">
        <PasswordInput
          id="form-verify-password"
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
          id="form-otp"
          name="otp"
          value={otp}
          onChange={setOtp}
          onRevealHandler={setOtpHidden}
          passwordHidden={otpHidden}
          isDisabled={!uid}
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="link" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          isDisabled={isResetButtonDisabled || spinning}
          onClick={onResetPwd}
          isLoading={spinning}
        >
          {spinning ? "Resetting and login" : "Reset password and Log in"}
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
