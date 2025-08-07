import React from "react";
// PatternFly
import {
  Page,
  PageSection,
  Masthead,
  MastheadMain,
  MastheadLogo,
  MastheadBrand,
  Brand,
  List,
  ListComponent,
  OrderType,
  ListItem,
  ExpandableSection,
} from "@patternfly/react-core";
// Images
import HeaderLogo from "src/assets/images/header-logo-black.png";
// Components
import TextLayout from "src/components/layouts/TextLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
//
import { Link } from "react-router-dom";

const SetupBrowserConfig = () => {
  const [isFirefoxExpanded, setIsFirefoxExpanded] = React.useState(false);
  const onFirefoxToggle = () => {
    setIsFirefoxExpanded(!isFirefoxExpanded);
  };
  const [isChromeExpanded, setIsChromeExpanded] = React.useState(false);
  const onChromeToggle = () => {
    setIsChromeExpanded(!isChromeExpanded);
  };
  const [isIEExpanded, setIsIEExpanded] = React.useState(false);
  const onIEToggle = () => {
    setIsIEExpanded(!isIEExpanded);
  };

  const header = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <MastheadLogo>
            <Brand src={HeaderLogo} alt="FreeIPA" />
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const firefoxPanel = (
    <ExpandableSection
      toggleText={isFirefoxExpanded ? "Show less" : "Show more"}
      onToggle={onFirefoxToggle}
      isExpanded={isFirefoxExpanded}
      displaySize="lg"
    >
      You can configure Firefox to use Kerberos for Single Sign-on. The
      following instructions will guide you in configuring your web browser to
      send your Kerberos credentials to the appropriate Key Distribution Center
      which enables Single Sign-on.
      <List
        component={ListComponent.ol}
        type={OrderType.number}
        className="pf-v6-u-mt-md pf-v6-u-ml-md"
      >
        <ListItem>
          Import{" "}
          <a href="https://server.ipa.demo/ipa/config/ca.crt">
            Certificate Authority certificate
          </a>
        </ListItem>
        <ListItem>
          In the address bar of Firefox, type <code>about:config</code> to
          display the list of current configuration options
        </ListItem>
        <ListItem>
          <TextLayout component="p">
            In the Filter field, type <code>negotiate</code> to restrict the
            list of options
          </TextLayout>
        </ListItem>
        <ListItem>
          <TextLayout component="p">
            Double-click the <code>network.negotiate-auth.trusted-uris</code>{" "}
            entry to display the Enter string value dialog box
          </TextLayout>
        </ListItem>
        <ListItem>
          <TextLayout component="p">
            Enter the name of the domain against which you want to authenticate,
            for example, <code>.example.com</code>.
          </TextLayout>
        </ListItem>
        <ListItem>
          <TextLayout component="p">
            Return to <Link to="login">WebUI</Link>
          </TextLayout>
        </ListItem>
      </List>
    </ExpandableSection>
  );

  const chromePanel = (
    <ExpandableSection
      toggleText={isChromeExpanded ? "Show less" : "Show more"}
      onToggle={onChromeToggle}
      isExpanded={isChromeExpanded}
      displaySize="lg"
    >
      You can configure Chrome to use Kerberos for Single Sign-on. The following
      instructions will guide you in configuring your web browser to send your
      Kerberos credentials to the appropriate Key Distribution Center which
      enables Single Sign-on.
      <TextLayout component="h2" className="pf-v6-u-mt-md">
        Import CA certificate
      </TextLayout>
      <List
        component={ListComponent.ol}
        type={OrderType.number}
        className="pf-v6-u-mt-md pf-v6-u-ml-md"
      >
        <ListItem>
          Download the{" "}
          <a href="https://server.ipa.demo/ipa/config/ca.crt">CA certificate</a>
          . Alternatively, if the host is also an IdM client, you can find the
          certificate in <i>/etc/ipa/ca.crt</i>
        </ListItem>
        <ListItem>
          <TextLayout component="p">
            Click the menu button with the <i>Customize</i> and <i>control</i>{" "}
            Google Chrome tooltip, which is by default in the top right-hand
            corner of Chrome, and click <i>Settings</i>
          </TextLayout>
        </ListItem>
        <ListItem>
          <TextLayout component="p">
            Click Show <i>advanced settings</i> to display more options, and
            then click the <i>Manage certificates</i> button located under the
            HTTPS/SSL heading
          </TextLayout>
        </ListItem>
        <ListItem>
          <TextLayout component="p">
            In the Authorities tab, click the <i>Import</i> button at the bottom
          </TextLayout>
        </ListItem>
        <ListItem>
          <TextLayout component="p">
            Select the CA certificate file that you downloaded in the first step
          </TextLayout>
        </ListItem>
      </List>
      <TextLayout component="h2" className="pf-v6-u-mt-md">
        Enable SPNEGO (Simple and Protected GSSAPI Negotiation Mechanism) to Use
        Kerberos Authentication in Chrome
      </TextLayout>
      <List
        component={ListComponent.ol}
        type={OrderType.number}
        className="pf-v6-u-mt-md pf-v6-u-ml-md"
      >
        <ListItem>
          Make sure you have the necessary directory created by running: <br />
          <code>[root@client]# mkdir -p /etc/opt/chrome/policies/managed/</code>
        </ListItem>
        <ListItem>
          Create a new{" "}
          <code>/etc/opt/chrome/policies/managed/mydomain.json</code> file with
          write privileges limited to the system administrator or root, and
          include the following line:
          <br />
          <code>{'{ "AuthServerWhitelist": "*.example.com" }'}</code>
          <br />
          <br />
          Note: If using Chromium, use{" "}
          <code>/etc/chromium/policies/managed/</code> instead of{" "}
          <code>/etc/opt/chrome/policies/managed/</code> for the two SPNEGO
          Chrome configuration steps above.
        </ListItem>
      </List>
    </ExpandableSection>
  );

  const iePanel = (
    <ExpandableSection
      toggleText={isIEExpanded ? "Show less" : "Show more"}
      onToggle={onIEToggle}
      isExpanded={isIEExpanded}
      displaySize="lg"
    >
      <TextLayout component="p">
        <b>WARNING:</b> Internet Explorer is no longer a supported browser.
      </TextLayout>
      <TextLayout component="p">
        Once you are able to log into the workstation with your kerberos key you
        are now able to use that ticket in Internet Explorer.
      </TextLayout>
      <TextLayout component="p">
        <b>
          Log into the Windows machine using an account of your Kerberos realm
          (administrative domain)
        </b>
      </TextLayout>
      <TextLayout component="p">
        <b>
          In Internet Explorer, click Tools, and then click Internet Options.
        </b>
      </TextLayout>
      <List
        component={ListComponent.ol}
        type={OrderType.number}
        className="pf-v6-u-mt-md pf-v6-u-ml-md"
      >
        <ListItem>
          Click the <i>Security tab</i>
        </ListItem>
        <ListItem>
          Click <i>Local intranet</i>
        </ListItem>
        <ListItem>
          Click <i>Sites</i>
        </ListItem>
        <ListItem>
          Click <i>Advanced</i>
        </ListItem>
        <ListItem>Add your domain to the list</ListItem>
      </List>
      <List
        component={ListComponent.ol}
        type={OrderType.number}
        className="pf-v6-u-mt-md pf-v6-u-ml-md"
      >
        <ListItem>
          Click the <i>Security tab</i>
        </ListItem>
        <ListItem>
          Click <i>Local intranet</i>
        </ListItem>
        <ListItem>
          Click <i>Custom Level</i>
        </ListItem>
        <ListItem>
          Select <i>Automatic logon</i> only in Intranet zone
        </ListItem>
      </List>
      <List
        component={ListComponent.ol}
        type={OrderType.number}
        className="pf-v6-u-mt-md pf-v6-u-ml-md"
      >
        <ListItem>
          Visit a kerberized web site using IE (You must use the fully-qualified
          Domain Name in the URL)
        </ListItem>
        <ListItem>
          <b>You are all set</b>
        </ListItem>
      </List>
    </ExpandableSection>
  );

  return (
    <Page masthead={header}>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="page-title"
          headingLevel="h1"
          text="Browser Kerberos Setup"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <TextLayout component="h1" className="pf-v6-u-mb-md">
          Firefox
        </TextLayout>
        {firefoxPanel}
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <TextLayout component="h1" className="pf-v6-u-mb-md">
          Chrome
        </TextLayout>
        {chromePanel}
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <TextLayout component="h1" className="pf-v6-u-mb-md">
          Internet Explorer
        </TextLayout>
        {iePanel}
      </PageSection>
    </Page>
  );
};

export default SetupBrowserConfig;
