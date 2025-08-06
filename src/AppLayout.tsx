import {
  Avatar,
  Masthead,
  MastheadLogo,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  MastheadBrand,
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
    <DropdownItem
      key="profile"
      component="button"
      data-cy="toolbar-button-profile"
    >
      <UserIcon /> Profile
    </DropdownItem>,
    <DropdownItem
      key="change-password"
      component="button"
      data-cy="toolbar-button-change-password"
    >
      <KeyIcon /> Change password
    </DropdownItem>,
    <DropdownItem
      key="customization"
      component="button"
      data-cy="toolbar-button-customization"
    >
      <CogIcon /> Customization
    </DropdownItem>,
    <DropdownItem key="about" component="button" data-cy="toolbar-button-about">
      <UnknownIcon /> About
    </DropdownItem>,
    <DropdownItem
      key="logout"
      component="button"
      onClick={onLogout}
      data-cy="toolbar-button-logout"
    >
      <ShareSquareIcon /> Log out
    </DropdownItem>,
  ];

  // TODO: Show the proper user login
  const dropdown = (
    <Dropdown
      data-cy="toolbar-dropdown"
      onSelect={onDropdownSelect}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          data-cy="toolbar-username"
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
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            isHamburgerButton
            data-cy="toolbar-button-toggle"
            variant="plain"
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand data-codemods>
          <MastheadLogo data-codemods component="a">
            <img src={headerLogo} alt="FreeIPA Logo" />
          </MastheadLogo>
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
      masthead={Header}
      sidebar={Sidebar}
      isManagedSidebar={true}
      skipToContent={PageSkipToContent}
      className="--pf-t--global--text--color--regular"
    >
      {props.children}
    </Page>
  );
};

export { AppLayout };
