import React, { SyntheticEvent, useState } from "react";
// PatternFly
import {
  DropdownDirection,
  DropdownItem,
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
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";
// Layouts
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
// Field sections
import AllowedCreateKeytab from "src/components/ServicesSections/AllowedCreateKeytab";
import AllowedRetrieveKeytab from "src/components/ServicesSections/AllowedRetrieveKeytab";
import Provisioning from "src/components/ServicesSections/Provisioning";
import ServiceCertificate from "src/components/ServicesSections/ServiceCertificate";
import ServiceSettings from "src/components/ServicesSections/ServiceSettings";
import { getLabel } from "src/language";

interface PropsToServicesSettings {
  service: Service;
}

const ServicesSettings = (props: PropsToServicesSettings) => {
  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem key="delete-key-unprovision">
      Delete key, Unprovision
    </DropdownItem>,
    <DropdownItem key="set-one-time-password">
      Set one-time password
    </DropdownItem>,
    <DropdownItem key="new certificate">New certificate</DropdownItem>,
  ];

  const onKebabToggle = (isOpen: boolean) => {
    setIsKebabOpen(isOpen);
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
      element: <SecondaryButton>{getLabel("Refresh")}</SecondaryButton>,
    },
    {
      key: 1,
      element: (
        <SecondaryButton isDisabled={true}>
          {getLabel("Revert")}
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton isDisabled={true}>{getLabel("Save")}</SecondaryButton>
      ),
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

  // Render component
  return (
    <>
      <PageSection
        id="settings-page"
        variant={PageSectionVariants.light}
        className="pf-u-pr-0 pf-u-ml-lg pf-u-mr-sm"
        style={{ overflowY: "scroll", height: `calc(100vh - 319px)` }}
      >
        <Sidebar isPanelRight className="pf-u-mt-lg">
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textComponent={TextVariants.p}
              textClassName="pf-u-mb-md"
              subTextComponent={TextVariants.a}
              subTextIsVisitedLink={true}
              textContent={getLabel("Help")}
              icon={
                <OutlinedQuestionCircleIcon className="pf-u-primary-color-100 pf-u-mr-sm" />
              }
            />
            <JumpLinks
              isVertical
              label="Jump to section"
              scrollableSelector="#settings-page"
              offset={220} // for masthead
              expandable={{ default: "expandable", md: "nonExpandable" }}
            >
              <JumpLinksItem key={0} href="#service-settings">
                Service settings
              </JumpLinksItem>
              <JumpLinksItem key={1} href="#provisioning">
                Provisioning
              </JumpLinksItem>
              <JumpLinksItem key={2} href="#service-certificate">
                Service certificate
              </JumpLinksItem>
              <JumpLinksItem key={3} href="#allowed-retrieve-keytab">
                Allow to retrieve keytab
              </JumpLinksItem>
              <JumpLinksItem key={4} href="#allowed-create-keytab">
                Allow to create keytab
              </JumpLinksItem>
            </JumpLinks>
          </SidebarPanel>

          <SidebarContent className="pf-u-mr-xl">
            <Flex
              direction={{ default: "column" }}
              flex={{ default: "flex_1" }}
            >
              <TitleLayout
                key={0}
                headingLevel="h2"
                id="service-settings"
                text={getLabel("Service settings")}
              />
              <ServiceSettings service={props.service} />
              <TitleLayout
                key={1}
                headingLevel="h2"
                id="provisioning"
                text={getLabel("Provisioning")}
              />
              <Provisioning />
              <TitleLayout
                key={2}
                headingLevel="h2"
                id="service-certificate"
                text={getLabel("Service certificate")}
              />
              <ServiceCertificate />
              <TitleLayout
                key={3}
                headingLevel="h2"
                id="allowed-retrieve-keytab"
                text={getLabel("Allowed to retrieve keytab")}
              />
              <AllowedRetrieveKeytab service={props.service} />
              <TitleLayout
                key={4}
                headingLevel="h2"
                id="allowed-create-keytab"
                text={getLabel("Allowed to create keytab")}
              />
              <AllowedCreateKeytab service={props.service} />
            </Flex>
          </SidebarContent>
        </Sidebar>
      </PageSection>
      <ToolbarLayout
        isSticky={true}
        className={"pf-u-p-md pf-u-ml-lg pf-u-mr-lg"}
        toolbarItems={toolbarFields}
      />
    </>
  );
};

export default ServicesSettings;
