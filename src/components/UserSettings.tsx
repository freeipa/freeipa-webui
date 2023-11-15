import React, { SyntheticEvent, useState } from "react";
// PatternFly
import {
  PageSection,
  PageSectionVariants,
  JumpLinks,
  JumpLinksItem,
  TextVariants,
  Flex,
  DropdownItem,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  DropdownDirection,
} from "@patternfly/react-core";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import {
  Metadata,
  User,
  IDPServer,
  RadiusServer,
} from "src/utils/datatypes/globalDataTypes";
// Layouts
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
// Field sections
import UsersIdentity from "src/components/UsersSections/UsersIdentity";
import UsersAccountSettings from "src/components/UsersSections/UsersAccountSettings";
import UsersPasswordPolicy from "src/components/UsersSections/UsersPasswordPolicy";
import UsersKerberosTicket from "src/components/UsersSections/UsersKerberosTicket";
import UsersContactSettings from "src/components/UsersSections/UsersContactSettings";
import UsersMailingAddress from "src/components/UsersSections/UsersMailingAddress";
import UsersEmployeeInfo from "src/components/UsersSections/UsersEmployeeInfo";
import UsersAttributesSMB from "src/components/UsersSections/UsersAttributesSMB";
// RPC
import {
  ErrorResult,
  useSaveUserMutation,
  useSaveStageUserMutation,
} from "src/services/rpc";
// Hooks
import useAlerts from "src/hooks/useAlerts";

export interface PropsToUserSettings {
  originalUser: Partial<User>;
  user: Partial<User>; // TODO: Replace with `userData` in all subsections
  onUserChange: (user: Partial<User>) => void;
  metadata: Metadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pwPolicyData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  krbPolicyData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  certData: any;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<User>;
  onResetValues: () => void;
  radiusProxyData?: RadiusServer[];
  idpData?: IDPServer[];
  from: "active-users" | "stage-users" | "preserved-users";
}

const UserSettings = (props: PropsToUserSettings) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RTK hook: save user (acive/preserved and stage)
  let [saveUser] = useSaveUserMutation();
  if (props.from === "stage-users") {
    [saveUser] = useSaveStageUserMutation();
  }

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem key="reset password">Reset password</DropdownItem>,
    <DropdownItem key="enable" isDisabled>
      Enable
    </DropdownItem>,
    <DropdownItem key="disable">Disable</DropdownItem>,
    <DropdownItem key="delete">Delete</DropdownItem>,
    <DropdownItem key="unlock" isDisabled>
      Unlock
    </DropdownItem>,
    <DropdownItem key="add otp token">Add OTP token</DropdownItem>,
    <DropdownItem key="rebuild auto membership">
      Rebuild auto membership
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

  // 'Revert' handler method
  const onRevert = () => {
    props.onUserChange(props.originalUser);
    alerts.addAlert("revert-success", "User data reverted", "success");
  };

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    // Assign uid
    modifiedValues.uid = props.user.uid;

    // Make API call
    saveUser(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "User modified", "success");
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
        }
        // Reset values. Disable 'revert' and 'save' buttons
        props.onResetValues();
      }
    });
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
        <SecondaryButton isDisabled={!props.isModified} onClickHandler={onSave}>
          Save
        </SecondaryButton>
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

  // 'UserSettings' render
  return (
    <>
      <alerts.ManagedAlerts />
      <PageSection
        id="settings-page"
        variant={PageSectionVariants.light}
        className="pf-u-pr-0 pf-u-ml-lg pf-u-mr-sm"
        style={{ overflowY: "scroll", height: `calc(100vh - 319.2px)` }}
      >
        <Sidebar isPanelRight className="pf-u-mt-lg">
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textComponent={TextVariants.p}
              textClassName="pf-u-mb-md"
              subTextComponent={TextVariants.a}
              subTextIsVisitedLink={true}
              textContent="Help"
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
              <JumpLinksItem key={0} href="#identity-settings">
                Identity settings
              </JumpLinksItem>
              <JumpLinksItem key={1} href="#account-settings">
                Account settings
              </JumpLinksItem>
              <JumpLinksItem key={2} href="#password-policy">
                Password policy
              </JumpLinksItem>
              <JumpLinksItem key={3} href="#kerberos-ticket">
                Kerberos ticket policy
              </JumpLinksItem>
              <JumpLinksItem key={4} href="#contact-settings">
                Contact settings
              </JumpLinksItem>
              <JumpLinksItem key={5} href="#mailing-address">
                Mailing address
              </JumpLinksItem>
              <JumpLinksItem key={6} href="#employee-information">
                Employee information
              </JumpLinksItem>
              <JumpLinksItem key={7} href="#smb-services">
                User attributes for SMB services
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
                id="identity-settings"
                text="Identity settings"
              />
              <UsersIdentity
                user={props.user}
                onUserChange={props.onUserChange}
                metadata={props.metadata}
              />
              <TitleLayout
                key={1}
                headingLevel="h2"
                id="account-settings"
                text="Account settings"
              />
              <UsersAccountSettings
                user={props.user}
                onUserChange={props.onUserChange}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                radiusProxyConf={props.radiusProxyData || []}
                idpConf={props.idpData || []}
                certData={props.certData}
                from={props.from}
              />
              <TitleLayout
                key={2}
                headingLevel="h2"
                id="password-policy"
                text="Password policy"
              />
              <UsersPasswordPolicy pwdPolicyData={props.pwPolicyData || []} />
              <TitleLayout
                key={3}
                headingLevel="h2"
                id="kerberos-ticket"
                text="Kerberos ticket"
              />
              <UsersKerberosTicket krbPolicyData={props.krbPolicyData || []} />
              <TitleLayout
                key={4}
                headingLevel="h2"
                id="contact-settings"
                text="Contact settings"
              />
              <UsersContactSettings user={props.user} />
              <TitleLayout
                key={5}
                headingLevel="h2"
                id="mailing-address"
                text="Mailing address"
              />
              <UsersMailingAddress
                user={props.user}
                onUserChange={props.onUserChange}
                metadata={props.metadata}
              />
              <TitleLayout
                key={6}
                headingLevel="h2"
                id="employee-information"
                text="Employee information"
              />
              <UsersEmployeeInfo />
              <TitleLayout
                key={7}
                headingLevel="h2"
                id="smb-services"
                text="User attributes for SMB services"
              />
              <UsersAttributesSMB
                user={props.user}
                onUserChange={props.onUserChange}
                metadata={props.metadata}
              />
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

export default UserSettings;
