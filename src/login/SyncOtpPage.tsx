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
import BackgroundImg from "src/assets/images/login-screen-background-3.jpg";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import {
  MetaResponse,
  SyncOtpPayload,
  useSyncOtpMutation,
} from "src/services/rpcAuth";
// React router DOM
import { useNavigate } from "react-router-dom";
// Components
import PasswordInput from "src/components/layouts/PasswordInput";

const SyncOtpPage = () => {
  // Navigate
  const navigate = useNavigate();

  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [syncOtpToken] = useSyncOtpMutation();

  // Main states
  const [uid, setUid] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [firstOtp, setFirstOtp] = React.useState<string>("");
  const [secondOtp, setSecondOtp] = React.useState<string>("");
  const [tokenId, setTokenId] = React.useState<string>("");
  const [btnSpinning, setBtnSpinning] = React.useState<boolean>(false);

  // Visibility of fields
  const [passwordHidden, setPasswordHidden] = React.useState<boolean>(true);
  const [newFirstOtpHidden, setFirstOtpHidden] = React.useState<boolean>(true);
  const [secondOtpHidden, setSecondOtpHidden] = React.useState<boolean>(true);

  // Sync button should be disabled if some conditions are met
  const evaluateSyncButtonDisabled = () => {
    if (
      uid === undefined ||
      password === "" ||
      firstOtp === "" ||
      secondOtp === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isSyncButtonDisabled = evaluateSyncButtonDisabled();

  // Clear fields when the sync operation failed
  const clearFields = () => {
    setUid("");
    setPassword("");
    setFirstOtp("");
    setSecondOtp("");
    setTokenId("");
  };

  // Sync API call
  const onSyncOtp = () => {
    const payload: SyncOtpPayload = {
      user: uid,
      password: password,
      first_code: firstOtp,
      second_code: secondOtp,
      token: tokenId,
    };

    setBtnSpinning(true);

    syncOtpToken(payload).then((response) => {
      if ("error" in response) {
        const receivedError = response.error as MetaResponse;
        const reason = receivedError.response?.headers.get(
          "x-ipa-tokensync-result"
        );

        if (reason === "invalid-credentials") {
          alerts.addAlert(
            "sync-otp-error",
            "Token sync rejected. The username, password or token codes are not correct.",
            "danger"
          );
          clearFields();
        } else if (reason === "ok") {
          alerts.addAlert(
            "sync-otp-success",
            "OTP token synced successfully",
            "success"
          );
          navigate("/login", {
            replace: true,
            state: {
              alertMessage: "OTP token synced successfully",
            },
          });
        }
        setBtnSpinning(false);
      }
    });
  };

  // Form fields
  const formFields = (
    <Form isHorizontal>
      <FormGroup label="Username" fieldId="username" required>
        <TextInput
          data-cy="sync-otp-textbox-username"
          id="username"
          name="user"
          type="text"
          value={uid}
          onChange={(_ev, newUid) => setUid(newUid)}
          isRequired={true}
        />
      </FormGroup>
      <FormGroup label="Password" fieldId="password" required>
        <PasswordInput
          dataCy="sync-otp-textbox-password"
          id="form-password"
          name="password"
          value={password}
          onChange={setPassword}
          onRevealHandler={setPasswordHidden}
          passwordHidden={passwordHidden}
          isRequired={true}
        />
      </FormGroup>
      <FormGroup label="First OTP" fieldId="firstotp" required>
        <PasswordInput
          dataCy="sync-otp-textbox-first-otp"
          id="form-first-otp"
          name="first_code"
          value={firstOtp}
          onChange={setFirstOtp}
          onRevealHandler={setFirstOtpHidden}
          passwordHidden={newFirstOtpHidden}
          isRequired={true}
        />
      </FormGroup>
      <FormGroup label="Second OTP" fieldId="secondotp" required>
        <PasswordInput
          dataCy="sync-otp-textbox-second-otp"
          id="form-second-otp"
          name="second_code"
          value={secondOtp}
          onChange={setSecondOtp}
          onRevealHandler={setSecondOtpHidden}
          passwordHidden={secondOtpHidden}
          isRequired={true}
        />
      </FormGroup>
      <FormGroup label="Token ID" fieldId="tokenid">
        <TextInput
          data-cy="sync-otp-textbox-token-id"
          id="form-token-id"
          name="token"
          value={tokenId}
          onChange={(_ev, newToken) => setTokenId(newToken)}
        />
      </FormGroup>
      <ActionGroup>
        <Button
          data-cy="sync-otp-button-cancel"
          variant="link"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          data-cy="sync-otp-button-sync"
          variant="primary"
          isDisabled={isSyncButtonDisabled || btnSpinning}
          onClick={onSyncOtp}
          isLoading={btnSpinning}
        >
          {btnSpinning ? "Syncing OTP token " : "Sync OTP token"}
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
          "OTP (One-Time Password): Generate new OTP code for each OTP field."
        }
        loginTitle="Sync OTP token"
      >
        {formFields}
      </LoginPage>
    </>
  );
};

export default SyncOtpPage;
