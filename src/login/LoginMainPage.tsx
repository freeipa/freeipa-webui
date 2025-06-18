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
import { ExclamationCircleIcon } from "@patternfly/react-icons";
// Images
import FreeIPABrandImg from "src/assets/images/product-name.png";
import BackgroundImg from "src/assets/images/login-screen-background.jpg";
// Plugin system
import { ExtensionSlot } from "src/core/plugins/ExtensionSlot";
import { loginCustomization } from "src/core/plugins/extensionPoints";
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
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface StateFromSyncOtpPage {
  alertMessage: string;
}

const LoginMainPage = () => {
  // Redux
  const dispatch = useAppDispatch();

  // Navigate
  const navigate = useNavigate();
  const location = useLocation();

  const [logo, setLogo] = React.useState(FreeIPABrandImg);
  const [logoAlt, setLogoAlt] = React.useState("FreeIPA logo");
  const [loginPageText, setloginPageText] = React.useState(
    "FreeIPA provides centralized authentication, authorization and account " +
      "information by storing data about user, groups, hosts and other objects " +
      "necessary to manage the security aspects of a network of computers."
  );

  // Alerts to show in the UI
  const alerts = useAlerts();

  // There are some cases (e.g., sync OTP token) that the
  //   login page can receive a given state from navigate.
  //   This message must be shown as an alert.
  React.useEffect(() => {
    if (location.state) {
      const { alertMessage } = location.state as StateFromSyncOtpPage;
      alerts.addAlert("sync-otp-message", alertMessage, "success");
    }
  }, [location.state]);

  const [showHelperText, setShowHelperText] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [authenticating, setAuthenticating] = React.useState(false);

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
  // - A modal will be shown if the error should be shown in the same page
  // - Otherwise, the error will be sent to the redirected page (e.g., reset password)
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

    setAuthenticating(true);
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
              state: { username, msg },
            });
          }
        } else {
          onSuccessLogin();
        }
        setAuthenticating(false);
      });
    }
  };

  // Login using certificate
  const onLoginWithCertClick = (_event) => {
    _event.preventDefault();
    setAuthenticating(true);
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
      setAuthenticating(false);
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
      <Link aria-label="Synchronize otp token" to="/sync-otp">
        Sync OTP Token
      </Link>
    </React.Fragment>
  );

  const listItem = (
    <React.Fragment>
      <ListItem>
        <Link to="/browser-config">Browser Kerberos setup</Link>
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
      isLoginButtonDisabled={authenticating}
    />
  );

  return (
    <>
      {/* Extension slot for login customization */}
      <ExtensionSlot
        extensionPointId={loginCustomization}
        context={{
          setLogo,
          setLogoAlt,
          setloginPageText,
        }}
      />

      <alerts.ManagedAlerts />
      <LoginPage
        style={{ whiteSpace: "pre-line" }}
        footerListVariants={ListVariant.inline}
        brandImgSrc={logo}
        brandImgAlt={logoAlt}
        backgroundImgSrc={BackgroundImg}
        footerListItems={listItem}
        textContent={loginPageText}
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
