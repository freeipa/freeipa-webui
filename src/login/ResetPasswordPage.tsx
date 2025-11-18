import React from "react";
// PatternFly
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  LoginPage,
  ListVariant,
} from "@patternfly/react-core";
// Images
import BrandImg from "src/assets/images/product-name.png";
import BackgroundImg from "src/assets/images/login-screen-background.jpg";
// RPC
import {
  ResponseOnPwdReset,
  ResetPasswordPayload,
  useResetPasswordMutation,
} from "src/services/rpcAuth";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Components
import PasswordInput from "src/components/layouts/PasswordInput";
import { useLocation, useNavigate } from "react-router";

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();

  // Get user Id
  const location = useLocation();
  const uid = location.state.username as string;
  const msg = location.state.msg as string;

  // Show error message from login page when the page is loaded the first time
  React.useEffect(() => {
    if (msg) {
      dispatch(
        addAlert({
          name: "reset-password-error",
          title: msg,
          variant: "danger",
        })
      );
    }
  }, []);

  // Navigate
  const navigate = useNavigate();

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
            dispatch(
              addAlert({
                name: "reset-password-error",
                title: errorMessage,
                variant: "danger",
              })
            );
            setBtnSpinning(false);
          } else if (reason === "invalid-password") {
            dispatch(
              addAlert({
                name: "reset-password-error",
                title: "The password or username you entered is incorrect",
                variant: "danger",
              })
            );
            clearFields();
            setBtnSpinning(false);
          } else if (reason !== "ok" && reason !== "invalid-password") {
            dispatch(
              addAlert({
                name: "reset-password-error",
                title: reason,
                variant: "danger",
              })
            );
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
          rules={[
            {
              id: "verify-match",
              message: "Passwords must match",
              validate: (v: string) => v === newPassword,
            },
          ]}
        />
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
