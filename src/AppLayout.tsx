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
	Toolbar, PageSidebarBody
} from '@patternfly/react-core';
import {
	Dropdown,
	DropdownItem,
	DropdownToggle
} from '@patternfly/react-core/deprecated';
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

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const headerToolbar = <Toolbar id="toolbar" />;

  // Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const onDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
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
    <DropdownItem key="logout" component="button">
      <ShareSquareIcon /> Log out
    </DropdownItem>,
  ];

  // TODO: Show the proper user login
  const dropdown = (
    <Dropdown
      isText
      isPlain
      onSelect={onDropdownSelect}
      toggle={
        <DropdownToggle id="toggle-plain-text" onToggle={(_event, isOpen: boolean) => onDropdownToggle(isOpen)}>
          Administrator
        </DropdownToggle>
      }
      isOpen={isDropdownOpen}
      dropdownItems={dropdownItems}
    />
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

  const Sidebar = <PageSidebar  >
<PageSidebarBody>
<Navigation />
</PageSidebarBody>
</PageSidebar>;

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
