import React, { useState } from "react";
// PatternFly
import {
  PageSection,
  PageSectionVariants,
  JumpLinks,
  JumpLinksItem,
  TextVariants,
  Flex,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  DropdownItem,
} from "@patternfly/react-core";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import {
  Metadata,
  User,
  IDPServer,
  RadiusServer,
  PwPolicy,
  KrbPolicy,
} from "src/utils/datatypes/globalDataTypes";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
import TabLayout from "src/components/layouts/TabLayout";
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
import { ErrorResult } from "src/services/rpc";
import {
  useGenerateSubIdsMutation,
  useSaveUserMutation,
  useSaveStageUserMutation,
} from "src/services/rpcUsers";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Modals
import DisableEnableUsers from "./modals/DisableEnableUsers";
import DeleteUsers from "./modals/DeleteUsers";
import RebuildAutoMembership from "./modals/RebuildAutoMembership";
import UnlockUser from "./modals/UnlockUser";

export interface PropsToUserSettings {
  originalUser: Partial<User>;
  user: Partial<User>; // TODO: Replace with `userData` in all subsections
  onUserChange: (user: Partial<User>) => void;
  metadata: Metadata;
  pwPolicyData: Partial<PwPolicy>;
  krbPolicyData: Partial<KrbPolicy>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  certData: any;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<User>;
  onResetValues: () => void;
  radiusProxyData?: RadiusServer[];
  idpData?: IDPServer[];
  activeUsersList?: Partial<User>[];
  from: "active-users" | "stage-users" | "preserved-users";
}

const UserSettings = (props: PropsToUserSettings) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Navigate
  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.from, noBreadcrumb: true });

  // RTK hook: save user (acive/preserved and stage)
  let [saveUser] = useSaveUserMutation();
  if (props.from === "stage-users") {
    [saveUser] = useSaveStageUserMutation();
  }

  // To handle the logic of the selectedUsersData (from
  //   the 'Disable / Enable' modal), lets use the 'selectedUsers' state
  const clearSelectedUsers = () => {
    // Do nothing
  };

  const [selectedUsersData, setSelectedUsersData] = React.useState({
    selectedUsers: [] as User[],
    clearSelectedUsers,
  });

  // Data is updated on 'props.user' changes
  React.useEffect(() => {
    if (props.user.nsaccountlock !== undefined) {
      setOptionSelected(!props.user.nsaccountlock);
    }

    if (props.user.uid !== undefined) {
      setSelectedUsersData({
        selectedUsers: [props.user] as User[],
        clearSelectedUsers,
      });
    }
  }, [props.user]);

  // 'Enable / disable' option
  const [isDisableEnableModalOpen, setIsDisableEnableModalOpen] =
    React.useState(false);
  const [optionSelected, setOptionSelected] = React.useState<boolean>(
    !props.user.nsaccountlock || false
  ); // 'enable': false | 'disable': true

  const onCloseDisableEnableModal = () => {
    setIsDisableEnableModalOpen(false);
  };

  // 'Delete' modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const onCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // 'Rebuild auto membership' option
  const [
    isRebuildAutoMembershipModalOpen,
    setIsRebuildAutoMembershipModalOpen,
  ] = useState(false);
  const onCloseRebuildAutoMembershipModal = () => {
    setIsRebuildAutoMembershipModalOpen(false);
  };
  const userToRebuild = props.user.uid ? [props.user.uid] : [];

  // 'Unlock' option
  const [isUnlockModalOpen, setIsUnlockModalOpen] = React.useState(false);
  const onCloseUnlockModal = () => {
    setIsUnlockModalOpen(false);
  };

  // Get the status of the 'Unlock' option
  // - locked: true | unlocked: false
  const getUnlockStatus = (): boolean => {
    let isLocked = false;
    if (
      props.user.krbloginfailedcount &&
      props.pwPolicyData.krbpwdmaxfailure !== undefined
    ) {
      // In case there is no permission to check password policy we
      // allow to unlock user even if he has only one failed login.
      const max_failure = props.pwPolicyData
        ? props.pwPolicyData.krbpwdmaxfailure[0]
        : 1;

      if (props.user.krbloginfailedcount[0] >= max_failure) {
        isLocked = true;
      }
    }
    return isLocked;
  };

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);

  const activeDropdownItems = [
    <DropdownItem key="reset password">Reset password</DropdownItem>,
    <DropdownItem
      key="enable"
      isDisabled={!props.user.nsaccountlock}
      onClick={() => setIsDisableEnableModalOpen(true)}
    >
      Enable
    </DropdownItem>,
    <DropdownItem
      key="disable"
      isDisabled={props.user.nsaccountlock}
      onClick={() => setIsDisableEnableModalOpen(true)}
    >
      Disable
    </DropdownItem>,
    <DropdownItem key="delete" onClick={() => setIsDeleteModalOpen(true)}>
      Delete
    </DropdownItem>,
    <DropdownItem
      key="unlock"
      isDisabled={!getUnlockStatus()}
      onClick={() => setIsUnlockModalOpen(true)}
    >
      Unlock
    </DropdownItem>,
    <DropdownItem key="add otp token">Add OTP token</DropdownItem>,
    <DropdownItem
      key="rebuild auto membership"
      onClick={() => setIsRebuildAutoMembershipModalOpen(true)}
    >
      Rebuild auto membership
    </DropdownItem>,
    <DropdownItem
      key="new certificate"
      onClick={() => setIsNewCertificateModalOpen(true)}
    >
      New certificate
    </DropdownItem>,
    <DropdownItem
      key="auto assign subordinate ids"
      isDisabled={isDisabledAutoAssignSubIds}
      onClick={onClickAutoAssignSubIds}
    >
      Auto assign subordinate IDs
    </DropdownItem>,
  ];

  const stageDropdownItems = [
    <DropdownItem key="activate">Activate</DropdownItem>,
    <DropdownItem key="delete" onClick={() => setIsDeleteModalOpen(true)}>
      Delete
    </DropdownItem>,
  ];

  const preservedDropdownItems = [
    <DropdownItem key="stage">Stage</DropdownItem>,
    <DropdownItem key="restore">Restore</DropdownItem>,
    <DropdownItem key="delete" onClick={() => setIsDeleteModalOpen(true)}>
      Delete
    </DropdownItem>,
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
          direction={"up"}
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={
            props.from === "active-users"
              ? activeDropdownItems
              : props.from === "stage-users"
              ? stageDropdownItems
              : preservedDropdownItems
          }
        />
      ),
    },
  ];

  // 'UserSettings' render
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
      <Sidebar isPanelRight>
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
        <SidebarContent className="pf-v5-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
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
            <UsersContactSettings
              user={props.user}
              onUserChange={props.onUserChange}
              metadata={props.metadata}
            />
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
            <UsersEmployeeInfo
              user={props.user}
              onUserChange={props.onUserChange}
              metadata={props.metadata}
              activeUsersList={props.activeUsersList || []}
            />
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
      <DisableEnableUsers
        show={isDisableEnableModalOpen}
        from={props.from}
        handleModalToggle={onCloseDisableEnableModal}
        optionSelected={optionSelected}
        selectedUsersData={selectedUsersData}
        singleUser={true}
      />
      <UnlockUser
        uid={props.user.uid}
        isOpen={isUnlockModalOpen}
        onClose={onCloseUnlockModal}
        onRefresh={props.onRefresh}
      />
      <DeleteUsers
        show={isDeleteModalOpen}
        from={props.from}
        handleModalToggle={onCloseDeleteModal}
        selectedUsersData={selectedUsersData}
        fromSettings={true}
        onRefresh={props.onRefresh}
      />
      <RebuildAutoMembership
        isOpen={isRebuildAutoMembershipModalOpen}
        onClose={onCloseRebuildAutoMembershipModal}
        entriesToRebuild={userToRebuild}
        entity="users"
      />
    </>
  );
};

export default UserSettings;
