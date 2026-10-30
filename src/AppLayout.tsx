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
  ToolbarItem,
  ToolbarGroup,
  ToolbarContent,
  Brand,
} from "@patternfly/react-core";
import React from "react";
// Icons
import { ShareSquareIcon } from "@patternfly/react-icons";
// Navigation
import Navigation from "./navigation/Nav";
// Components
import ContextualHelpPanel from "./components/ContextualHelpPanel/ContextualHelpPanel";
// Images
import headerLogo from "/assets/images/header-logo.png";
import avatarImg from "/assets/images/avatarImg.svg";
// Redux
import { useAppDispatch, useAppSelector } from "./store/hooks";
// RPC
import { useLogoutMutation } from "./services/rpcAuth";
import { useGetUserByUidQuery } from "./services/rpcUsers";
import { Outlet } from "react-router";
import { logoutUser } from "./store/Global/global-slice";

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector((state) => state.global.loggedInUser);
  const ahdapaAvailable = useAppSelector(
    (state) => state.ahdapa?.available ?? false
  );

  // RPC
  const [logout] = useLogoutMutation();
  const { data: userDetails, isFetching } = useGetUserByUidQuery(
    loggedInUser!,
    {
      skip: !loggedInUser,
    }
  );

  // Retrieve and assign user full name
  const fullName = React.useMemo(() => {
    if (!userDetails) return "";
    if (userDetails.givenname) {
      return userDetails.givenname + " " + userDetails.sn;
    }

    return userDetails.sn;
  }, [userDetails]);

  // On logout handler
  const onLogout = () => {
    logout().then((response) => {
      if ("data" in response && !response.data?.error) {
        if (ahdapaAvailable) {
          fetch("/idp/api/auth/logout", {
            method: "POST",
            credentials: "include",
          }).finally(() => {
            window.location.href = "/ipa/modern-ui/";
          });
        } else {
          sessionStorage.setItem("isKerberosDisabled", "true");
          dispatch(logoutUser());
        }
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
      key="logout"
      component="button"
      onClick={onLogout}
      data-cy="toolbar-button-logout"
    >
      <ShareSquareIcon /> Log out
    </DropdownItem>,
  ];

  // Dropdown with user login
  const dropdown = (
    <Dropdown
      data-cy="toolbar-dropdown"
      onSelect={onDropdownSelect}
      popperProps={{ position: "right" }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          data-cy="toolbar-username"
          ref={toggleRef}
          id="toggle-plain-text"
          onClick={onDropdownToggle}
          isExpanded={isDropdownOpen}
          className="pf-v6-u-mr-md"
          icon={<Avatar src={avatarImg} alt="avatar" size="sm" />}
        >
          {isFetching ? "" : fullName}
        </MenuToggle>
      )}
      isOpen={isDropdownOpen}
    >
      {dropdownItems}
    </Dropdown>
  );

  // Header toolbar
  const headerToolbar = (
    <Toolbar id="toolbar" isStatic>
      <ToolbarContent>
        <ToolbarGroup
          variant="action-group-plain"
          align={{ default: "alignEnd" }}
          gap={{ default: "gapNone", md: "gapMd" }}
        >
          <ToolbarItem>{dropdown}</ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
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
        <MastheadBrand>
          <MastheadLogo className="pf-v6-u-display-flex">
            <Brand
              src={headerLogo}
              alt="IPA Logo"
              className="pf-v6-u-my-auto"
            />
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>{headerToolbar}</MastheadContent>
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
      isContentFilled
    >
      <ContextualHelpPanel>
        <Outlet />
      </ContextualHelpPanel>
    </Page>
  );
};

export { AppLayout };
