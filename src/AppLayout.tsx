import {
  Avatar,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Page,
  PageSidebar,
  PageToggleButton,
  SkipToContent,
  Toolbar,
  PageSidebarBody,
  DropdownItem,
  Dropdown,
  MenuToggleElement,
  MenuToggle,
} from "@patternfly/react-core";
import React from "react";
// Icons
import { BarsIcon } from "@patternfly/react-icons";
import { UserIcon } from "@patternfly/react-icons";
import { KeyIcon } from "@patternfly/react-icons";
import { CogIcon } from "@patternfly/react-icons";
import { UnknownIcon } from "@patternfly/react-icons";
import { ShareSquareIcon } from "@patternfly/react-icons";
// Navigation
import Navigation from "./navigation/Nav";
// Images
import headerLogo from "src/assets/images/header-logo.png";
import avatarImg from "src/assets/images/avatarImg.svg";
// Redux
import { useAppDispatch } from "./store/hooks";
import { setIsLogout } from "./store/Global/auth-slice";
// RPC
import { useLogoutMutation } from "./services/rpcAuth";
import { useGetUserDetailsByUidMutation } from "./services/rpcUsers";

interface PropsToAppLayout {
  loggedInUser: string | null;
  children: React.ReactNode;
}

const AppLayout = (props: PropsToAppLayout) => {
  const dispatch = useAppDispatch();

  // RPC
  const [logout] = useLogoutMutation();
  const [getUserDetails] = useGetUserDetailsByUidMutation();

  // Retrieve and assign user full name
  const [fullName, setFullName] = React.useState<string>("");

  React.useEffect(() => {
    if (props.loggedInUser) {
      getUserDetails(props.loggedInUser).then((response) => {
        if ("data" in response) {
          const first = response.data?.result.result.givenname;
          const last = response.data?.result.result.sn;
          // Some users (e.g., admin) don't have first name
          if (!first) {
            setFullName(last as string);
          } else {
            setFullName(first + " " + last);
          }
        }
      });
    }
  }, [props.loggedInUser]);

  // Toolbar
  const headerToolbar = <Toolbar id="toolbar" />;

  // On logout handler
  const onLogout = () => {
    logout().then((response) => {
      if ("data" in response && !response.data?.error) {
        dispatch(setIsLogout());
        // Forcing full page to reload and redirect to login page
        window.location.reload();
      }
    });
  };

  // Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const onDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const onDropdownSelect = () => {
    setIsDropdownOpen(false);
  };

  const dropdownItems = [
    <DropdownItem key="profile" component="button">
      <UserIcon /> Profile
    </DropdownItem>,
    <DropdownItem key="change-password" component="button">
      <KeyIcon /> Change password
    </DropdownItem>,
    <DropdownItem key="customization" component="button">
      <CogIcon /> Customization
    </DropdownItem>,
    <DropdownItem key="about" component="button">
      <UnknownIcon /> About
    </DropdownItem>,
    <DropdownItem key="logout" component="button" onClick={onLogout}>
      <ShareSquareIcon /> Log out
    </DropdownItem>,
  ];

  // TODO: Show the proper user login
  const dropdown = (
    <Dropdown
      onSelect={onDropdownSelect}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          id="toggle-plain-text"
          onClick={onDropdownToggle}
          isExpanded={isDropdownOpen}
          className="pf-v5-u-mr-md"
          variant="plainText"
        >
          {fullName}
        </MenuToggle>
      )}
      isOpen={isDropdownOpen}
    >
      {dropdownItems}
    </Dropdown>
  );

  const Header = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton variant="plain" aria-label="Global navigation">
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand component="a">
          <img src={headerLogo} alt="FreeIPA Logo" />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <>
          {headerToolbar}
          {dropdown}
          <Avatar src={avatarImg} alt="avatar" size="md" />
        </>
      </MastheadContent>
    </Masthead>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <Navigation />
      </PageSidebarBody>
    </PageSidebar>
  );

  const pageId = "primary-app-container";

  const skipToContent = (event) => {
    event.preventDefault();
    const primaryContentContainer = document.getElementById(pageId);
    if (primaryContentContainer) {
      return primaryContentContainer.focus();
    }
  };

  const PageSkipToContent = (
    <SkipToContent onClick={skipToContent} href={`#${pageId}`}>
      Skip to Content
    </SkipToContent>
  );

  return (
    <Page
      mainContainerId={pageId}
      header={Header}
      sidebar={Sidebar}
      isManagedSidebar={true}
      skipToContent={PageSkipToContent}
    >
      {props.children}
    </Page>
  );
};

export { AppLayout };
