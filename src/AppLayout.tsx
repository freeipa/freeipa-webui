import {
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
} from "@patternfly/react-core";
import React from "react";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
// Navigation
import Navigation from "./navigation/Nav";
// Images
import headerLogo from "public/images/header-logo.png";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const headerToolbar = <Toolbar id="toolbar" />;

  const Header = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton variant="plain" aria-label="Global navigation">
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          <img src={headerLogo} alt="FreeIPA Logo" />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>{headerToolbar}</MastheadContent>
    </Masthead>
  );

  const Sidebar = <PageSidebar nav={<Navigation />} />;

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
