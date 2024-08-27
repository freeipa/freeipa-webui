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
  useKrbLoginMutation,
  useUserPasswordLoginMutation,
  useX509LoginMutation,
} from "src/services/rpcAuth";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { setIsLogin } from "src/store/Global/auth-slice";
// Navigation
import { useNavigate } from "react-router-dom";

const LoginMainPage = () => {
  // Redux
  const dispatch = useAppDispatch();

  // Navigate
  const navigate = useNavigate();

  // Alerts to show in the UI
  const alerts = useAlerts();

  const [showHelperText, setShowHelperText] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isValidPassword, setIsValidPassword] = React.useState(true);

  // Authentication method (assumes user + password by default)
  // - This will help to get the user credentials if the user is logged in via Kerberos
  let isUserPwdAuthentication = true;

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

  /**
   * If no username is provided and krb enabled, try to login using Kerberos.
   * 1.- Check if Kerberos is enabled
   * 2.- Based on the result, authenticate using one method (Kerberos) or the other (via user + password)
   */
  const isKerberosEnabled = true;

  // API calls
  const [onUserPwdLogin] = useUserPasswordLoginMutation();
  const [onKrbLogin] = useKrbLoginMutation();
  const [onCertLogin] = useX509LoginMutation();

  // Kerberos login when loading the component
  React.useEffect(() => {
    if (!username && isKerberosEnabled) {
      onKrbLogin().then((response) => {
        if ("error" in response) {
          const receivedError = response.error as MetaResponse;
          const status = receivedError.response?.status;
          const wwwAuthenticateHeader =
            receivedError.response?.headers.get("www-authenticate");

          if (
            status === 200 &&
            wwwAuthenticateHeader?.startsWith("Negotiate")
          ) {
            // Success on Kerberos login
            isUserPwdAuthentication = false;
            onSuccessLogin();
          } else {
            // Set error without showing the modal
            setErrorMessage("Authentication with Kerberos failed");
          }
        } else {
          isUserPwdAuthentication = false;
          onSuccessLogin();
        }
      });
    }
  }, []);

  // Handling API errors
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  // Modal to show any received error
  const errorModal = (errorMessage: string) => {
    if (errorMessage !== "") {
      return (
        <Modal
          variant={ModalVariant.small}
          title="Authentication error"
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={() => setShowErrorModal(false)}
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
    if (isUserPwdAuthentication) {
      dispatch(setIsLogin({ loggedInUser: username, error: null }));
    } else {
      // TODO: Extract the username from the Kerberos ticket and store in Redux
    }

    // Forcing full page to reload and access the protected pages (Default: active users)
    window.location.reload();
    // TODO: Improve this mechanism and redirect to the last page visited
  };

  // Analyze the error reason
  const analyzeErrorReason = (reason: string | null) => {
    let returnMessage = "";
    switch (reason) {
      case "password-expired":
        returnMessage =
          "Your password has expired. Please enter a new password.";
        break;
      case "denied":
        // TODO: Specify what to do in this case
        break;
      case "krbprincipal-expired":
        // Show modal with the error
        setShowErrorModal(true);
        setErrorMessage("Kerberos Principal you entered is expired");
        break;
      case "invalid-password":
        // Show modal with the error
        setShowErrorModal(true);
        setErrorMessage("The password or username you entered is incorrect");
        break;
      case "user-locked":
        // Show modal with the error
        setShowErrorModal(true);
        setErrorMessage("The user account you entered is locked");
        break;
      case null:
        // Assume sucessful login
        onSuccessLogin();
        break;
      default:
        // Unknown error. This should not happen
        console.error("Unknown error reason: ", reason);
        break;
    }
    return returnMessage;
  };

  // On login handler
  const onLoginButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);

    if (!username && isKerberosEnabled) {
      onKrbLogin().then((response) => {
        if ("error" in response) {
          const receivedError = response.error as MetaResponse;

          const status = receivedError.response?.status;
          const wwwAuthenticateHeader =
            receivedError.response?.headers.get("www-authenticate");
          if (
            status === 200 &&
            wwwAuthenticateHeader?.startsWith("Negotiate")
          ) {
            // Success on Kerberos login
            isUserPwdAuthentication = false;
            onSuccessLogin();
          } else {
            // Set error without showing the modal
            setErrorMessage("Authentication with Kerberos failed");
          }
        } else {
          // Success on Kerberos login
          isUserPwdAuthentication = false;
          onSuccessLogin();
        }
      });
    } else {
      onUserPwdLogin({ username, password }).then((response) => {
        if ("error" in response) {
          const receivedError = response.error as MetaResponse;

          // Get the reason of the error
          const reason = receivedError.response?.headers.get(
            "x-ipa-rejection-reason"
          );

          const msg = analyzeErrorReason(reason);

          if (msg) {
            navigate("/reset-password/" + username, {
              state: username,
            });
          }
        } else {
          onSuccessLogin();
        }
      });
    }
  };

  // Login using certificate
  const onLoginWithCertClick = (_event) => {
    _event.preventDefault();
    onCertLogin(username).then((response) => {
      if ("error" in response) {
        const receivedError = response.error as MetaResponse;
        const status = receivedError.response?.status;
        const statusText = "Authentication with personal certificate failed";

        if (status === 200) {
          onSuccessLogin();
        } else {
          // Set error without showing the modal
          setErrorMessage(statusText);
          setShowHelperText(true);
        }
      } else {
        onSuccessLogin();
      }
    });
  };

  const socialMediaLoginContent = (
    <React.Fragment>
      <LoginMainFooterLinksItem
        href=""
        linkComponentProps={{
          "aria-label": "Login using personal Certificate",
        }}
      >
        <TextContent onClick={onLoginWithCertClick} name="cert_auth">
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
      helperText={errorMessage}
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
        {showErrorModal && errorModal(errorMessage)}
      </LoginPage>
    </>
  );
};

export default LoginMainPage;
