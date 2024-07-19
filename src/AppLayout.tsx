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
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import UserIcon from "@patternfly/react-icons/dist/esm/icons/user-icon";
import KeyIcon from "@patternfly/react-icons/dist/esm/icons/key-icon";
import CogIcon from "@patternfly/react-icons/dist/esm/icons/cog-icon";
import UnknownIcon from "@patternfly/react-icons/dist/esm/icons/unknown-icon";
import ShareSquareIcon from "@patternfly/react-icons/dist/esm/icons/share-square-icon";
// Navigation
import Navigation from "./navigation/Nav";
// Images
import headerLogo from "public/images/header-logo.png";
import avatarImg from "public/images/avatarImg.svg";
// Redux
import { useAppDispatch } from "./store/hooks";
import { setIsLogout } from "./store/Global/auth-slice";
import { useLogoutMutation } from "./services/rpcAuth";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  // RPC
  const [logout] = useLogoutMutation();

  // Toolbar
  const headerToolbar = <Toolbar id="toolbar" />;

  // On logout handler
  const onLogout = () => {
    logout().then((response) => {
      if ("data" in response && !response.data.error) {
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
          Administrator
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

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        console.log("primaryContentContainer");
        console.log(primaryContentContainer);
        primaryContentContainer && primaryContentContainer.focus();
      }}
      href={`#${pageId}`}
    >
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
      {children}
    </Page>
  );
};

export { AppLayout };
