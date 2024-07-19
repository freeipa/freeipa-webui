import React from "react";
// PatternFly
import {
  LoginFooterItem,
  LoginForm,
  LoginMainFooterLinksItem,
  LoginPage,
  ListItem,
  ListVariant,
  TextContent,
  Text,
  Modal,
  Button,
  ModalVariant,
} from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Icons
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
// Images
import BrandImg from "src/assets/images/login-screen-logo.png";
import BackgroundImg from "src/assets/images/login-screen-background.jpg";
// RPC
import {
  MetaResponse,
  useUserPasswordLoginMutation,
} from "src/services/rpcAuth";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { setIsLogin } from "src/store/Global/auth-slice";

const LoginMainPage = () => {
  // Redux
  const dispatch = useAppDispatch();

  // Alerts to show in the UI
  const alerts = useAlerts();

  const [showHelperText, setShowHelperText] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isValidPassword, setIsValidPassword] = React.useState(true);

  const handleUsernameChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setUsername(value);
  };

  const handlePasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setPassword(value);
  };

  // API call
  const [onUserPwdLogin] = useUserPasswordLoginMutation();

  // Handling API errors
  const [isError, setIsError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const getErrorMessageByType = (error: string) => {
    switch (error) {
      case "Unauthorized":
        return "Invalid username or password.";
      // TODO: Add more error messages here
      default:
        return "An error occurred. Please try again.";
    }
  };

  // Modal to show any received error
  const errorModal = (errorType: string) => {
    if (errorType !== "") {
      const errorMessage = getErrorMessageByType(errorType);

      return (
        <Modal
          variant={ModalVariant.small}
          title="Invalid authentication"
          isOpen={isError}
          onClose={() => setIsError(false)}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={() => setIsError(false)}
            >
              OK
            </Button>,
          ]}
        >
          {errorMessage}
        </Modal>
      );
    }
  };

  // Action on login success
  const onSuccessLogin = () => {
    // Sore data on Redux
    dispatch(setIsLogin({ loggedInUser: username, error: null }));
    // Forcing full page to reload and access the protected pages (Default: active users)
    window.location.reload();
    // TODO: Improve this mechanism and redirect to the last page visited
  };

  // On login handler
  const onLoginButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);

    onUserPwdLogin({ username, password }).then((response) => {
      if ("error" in response) {
        const receivedError = response.error as MetaResponse;
        const status = receivedError.response?.status;
        const statusText = receivedError.response?.statusText;

        if (status === 200) {
          onSuccessLogin();
        } else {
          // Handle other errors
          setIsError(true);
          setErrorMessage(statusText);
        }
      } else {
        onSuccessLogin();
      }
    });
  };

  const socialMediaLoginContent = (
    <React.Fragment>
      <LoginMainFooterLinksItem
        href="#"
        linkComponentProps={{
          "aria-label": "Login using personal Certificate",
        }}
      >
        <TextContent name="cert_auth">
          <Text>Login using Certificate</Text>
        </TextContent>
      </LoginMainFooterLinksItem>
      <LoginMainFooterLinksItem
        href="#"
        linkComponentProps={{ "aria-label": "Syncronize OTP Token" }}
      >
        <TextContent name="sync">
          <Text>Sync OTP Token</Text>
        </TextContent>
      </LoginMainFooterLinksItem>
    </React.Fragment>
  );

  const listItem = (
    <React.Fragment>
      <ListItem>
        <LoginFooterItem href="https://server.ipa.demo/ipa/config/ssbrowser.html">
          Browser Kerberos setup{" "}
        </LoginFooterItem>
      </ListItem>
      <ListItem>
        <LoginFooterItem href="https://www.freeipa.org/">
          FreeIPA website{" "}
        </LoginFooterItem>
      </ListItem>
    </React.Fragment>
  );

  const loginForm = (
    <LoginForm
      showHelperText={showHelperText}
      helperText="Invalid login credentials."
      helperTextIcon={<ExclamationCircleIcon />}
      usernameLabel="Username"
      usernameValue={username}
      onChangeUsername={handleUsernameChange}
      isValidUsername={isValidUsername}
      passwordLabel="Password"
      passwordValue={password}
      isShowPasswordEnabled
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonLabel="Log in"
    />
  );

  const placeHolderText =
    "· To log in with username and password, enter them in the corresponding fields, then click 'Log in'. \n\n" +
    "· To log in with Kerberos, please make sure you have valid tickets (obtainable via kinit) and configured the browser correctly, then click 'Log in'. \n\n" +
    "· To log in with certificate, please make sure you have valid personal certificate.";

  return (
    <>
      <alerts.ManagedAlerts />
      <LoginPage
        style={{ whiteSpace: "pre-line" }}
        footerListVariants={ListVariant.inline}
        brandImgSrc={BrandImg}
        brandImgAlt="FreeIPA logo"
        backgroundImgSrc={BackgroundImg}
        footerListItems={listItem}
        textContent={placeHolderText}
        loginTitle="Log in to your account"
        loginSubtitle="Enter your credentials."
        socialMediaLoginContent={socialMediaLoginContent}
        socialMediaLoginAriaLabel="Other options to log in"
      >
        {loginForm}
        {isError && errorModal(errorMessage)}
      </LoginPage>
    </>
  );
};

export default LoginMainPage;
