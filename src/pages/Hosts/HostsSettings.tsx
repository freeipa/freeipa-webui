import React, { useState } from "react";
// PatternFly
import {
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
import { Host, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
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
// RPC
import { ErrorResult, useSaveHostMutation } from "src/services/rpc";

interface PropsToHostsSettings {
  host: Partial<Host>;
  originalHost: Partial<Host>;
  metadata: Metadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  certData: any;
  onHostChange: (host: Partial<Host>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Host>;
  onResetValues: () => void;
}

const HostsSettings = (props: PropsToHostsSettings) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // API save the host
  const [saveHost] = useSaveHostMutation();

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);

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
    _event: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    setIsKebabOpen(!isKebabOpen);
  };

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    modifiedValues.fqdn = props.host.fqdn;
    setSaving(true);

    saveHost(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Host modified", "success");
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
        }
        // Reset values. Disable 'revert' and 'save' buttons
        props.onResetValues();
        setSaving(false);
      }
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onHostChange(props.originalHost);
    alerts.addAlert("revert-success", "Host data reverted", "success");
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton onClickHandler={props.onRefresh}>
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          isDisabled={!props.isModified}
          onClickHandler={onRevert}
        >
          Revert
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          isDisabled={!props.isModified || isSaving}
          onClickHandler={onSave}
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabelledBy="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      element: (
        <KebabLayout
          direction={"up"}
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={dropdownItems}
        />
      ),
    },
  ];

  return (
    <>
      <alerts.ManagedAlerts />
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
              <HostSettings
                host={props.host}
                metadata={props.metadata}
                onHostChange={props.onHostChange}
                onRefresh={props.onRefresh}
              />
              <TitleLayout
                key={1}
                headingLevel="h2"
                id="enrollment"
                text="Enrollment"
              />
              <Enrollment host={props.host} />
              <TitleLayout
                key={2}
                headingLevel="h2"
                id="host-certificate"
                text="Host certificate"
              />
              <HostCertificate
                host={props.host}
                metadata={props.metadata}
                onHostChange={props.onHostChange}
                onRefresh={props.onRefresh}
                certData={props.certData}
              />
              <TitleLayout
                key={3}
                headingLevel="h2"
                id="allow-retrieve-keytab"
                text="Allow to retrieve keytab"
              />
              <AllowedRetrieveKeytab
                host={props.host}
                onRefresh={props.onRefresh}
              />
              <TitleLayout
                key={4}
                headingLevel="h2"
                id="allow-create-keytab"
                text="Allow to create keytab"
              />
              <AllowedCreateKeytab
                host={props.host}
                onRefresh={props.onRefresh}
              />
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
