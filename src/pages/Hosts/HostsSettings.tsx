import React, { SyntheticEvent, useState } from "react";
// PatternFly
import {
  Flex,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  PageSectionVariants,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  TextVariants,
} from "@patternfly/react-core";
import {
  DropdownDirection,
  DropdownItem,
} from "@patternfly/react-core/deprecated";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Layouts
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
// Field sections
import HostSettings from "src/components/HostsSections/HostSettings";
import Enrollment from "src/components/HostsSections/Enrollment";
import HostCertificate from "src/components/HostsSections/HostCertificate";
import AllowedRetrieveKeytab from "src/components/HostsSections/AllowedRetrieveKeytab";
import AllowedCreateKeytab from "src/components/HostsSections/AllowedCreateKeytab";

interface PropsToHostsSettings {
  host: Host;
}

const HostsSettings = (props: PropsToHostsSettings) => {
  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem key="rebuild auto membership">
      Rebuild auto membership
    </DropdownItem>,
    <DropdownItem key="unprovision">Unprovision</DropdownItem>,
    <DropdownItem key="set-one-time-password">
      Set one-time password
    </DropdownItem>,
    <DropdownItem key="new certificate">New certificate</DropdownItem>,
  ];

  const onKebabToggle = () => {
    setIsKebabOpen(!isKebabOpen);
  };

  const onKebabSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: SyntheticEvent<HTMLDivElement, Event> | undefined
  ) => {
    setIsKebabOpen(!isKebabOpen);
  };
  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: <SecondaryButton>Refresh</SecondaryButton>,
    },
    {
      key: 1,
      element: <SecondaryButton isDisabled={true}>Revert</SecondaryButton>,
    },
    {
      key: 2,
      element: <SecondaryButton isDisabled={true}>Save</SecondaryButton>,
    },
    {
      key: 3,
      element: (
        <KebabLayout
          direction={DropdownDirection.up}
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          isPlain={true}
          dropdownItems={dropdownItems}
        />
      ),
    },
  ];
  return (
    <>
      <PageSection
        id="settings-page"
        variant={PageSectionVariants.light}
        className="pf-v5-u-pr-0 pf-v5-u-ml-lg pf-v5-u-mr-sm"
        style={{ overflowY: "scroll", height: `calc(100vh - 319px)` }}
      >
        <Sidebar isPanelRight className="pf-v5-u-mt-lg">
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textComponent={TextVariants.p}
              textClassName="pf-v5-u-mb-md"
              subTextComponent={TextVariants.a}
              subTextIsVisitedLink={true}
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
              }
            />
            <JumpLinks
              isVertical
              label="Jump to section"
              scrollableSelector="#settings-page"
              offset={220} // for masthead
              expandable={{ default: "expandable", md: "nonExpandable" }}
            >
              <JumpLinksItem key={0} href="#host-settings">
                Host settings
              </JumpLinksItem>
              <JumpLinksItem key={1} href="#enrollment">
                Enrollment
              </JumpLinksItem>
              <JumpLinksItem key={2} href="#host-certificate">
                Host certificate
              </JumpLinksItem>
              <JumpLinksItem key={3} href="#allow-retrieve-keytab">
                Allow to retrieve keytab
              </JumpLinksItem>
              <JumpLinksItem key={4} href="#allow-create-keytab">
                Allow to create keytab
              </JumpLinksItem>
            </JumpLinks>
          </SidebarPanel>

          <SidebarContent className="pf-v5-u-mr-xl">
            <Flex
              direction={{ default: "column" }}
              flex={{ default: "flex_1" }}
            >
              <TitleLayout
                key={0}
                headingLevel="h2"
                id="host-settings"
                text="Host settings"
              />
              <HostSettings host={props.host} />
              <TitleLayout
                key={1}
                headingLevel="h2"
                id="enrollment"
                text="Enrollment"
              />
              <Enrollment />
              <TitleLayout
                key={2}
                headingLevel="h2"
                id="host-certificate"
                text="Host certificate"
              />
              <HostCertificate />
              <TitleLayout
                key={3}
                headingLevel="h2"
                id="allow-retrieve-keytab"
                text="Allow to retrieve keytab"
              />
              <AllowedRetrieveKeytab host={props.host} />
              <TitleLayout
                key={4}
                headingLevel="h2"
                id="allow-create-keytab"
                text="Allow to create keytab"
              />
              <AllowedCreateKeytab host={props.host} />
            </Flex>
          </SidebarContent>
        </Sidebar>
      </PageSection>
      <ToolbarLayout
        isSticky={true}
        className={"pf-v5-u-p-md pf-v5-u-ml-lg pf-v5-u-mr-lg"}
        toolbarItems={toolbarFields}
      />
    </>
  );
};

export default HostsSettings;
