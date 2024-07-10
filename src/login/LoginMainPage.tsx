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
} from "@patternfly/react-core";
// Icons
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
// Images
import BrandImg from "src/assets/images/login-screen-logo.png";
import BackgroundImg from "src/assets/images/login-screen-background.jpg";

const LoginMainPage = () => {
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

  const onLoginButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);
    // TODO: Add login logic here
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
    </LoginPage>
  );
};

export default LoginMainPage;
