import React, { useState } from "react";
// PatternFly
import {
  JumpLinks,
  JumpLinksItem,
  Flex,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  DropdownItem,
} from "@patternfly/react-core";
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
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Modals
import DisableEnableUsers from "src/components/modals/UserModals/DisableEnableUsers";
import DeleteUsers from "src/components/modals/UserModals/DeleteUsers";
import RebuildAutoMembership from "src/components/modals/RebuildAutoMembership";
import UnlockUser from "src/components/modals/UserModals/UnlockUser";
import ResetPassword from "src/components/modals/UserModals/ResetPassword";
import IssueNewCertificate from "src/components/modals/CertificateModals/IssueNewCertificate";
import AddOtpToken from "src/components/modals/UserModals/AddOtpToken";
import ActivateStageUsers from "src/components/modals/UserModals/ActivateStageUsers";
import StagePreservedUsers from "src/components/modals/UserModals/StagePreservedUsers";
import RestorePreservedUsers from "src/components/modals/UserModals/RestorePreservedUsers";
// Utils
import { API_VERSION_BACKUP } from "src/utils/utils";
// Navigate
import { useNavigate } from "react-router";

interface PropsToUserSettings {
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
  changeFromPage?: (from: string) => void;
  onOpenContextualPanel?: () => void;
}

const UserSettings = (props: PropsToUserSettings) => {
  const dispatch = useAppDispatch();

  // Navigate
  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.from, noBreadcrumb: true });

  // RTK hook: save user (acive/preserved and stage)
  let [saveUser] = useSaveUserMutation();
  if (props.from === "stage-users") {
    [saveUser] = useSaveStageUserMutation();
  }

  // Update page to show correct links info in Contextual panel
  React.useEffect(() => {
    if (props.changeFromPage !== undefined) {
      if (props.from === "active-users") {
        props.changeFromPage("active-users-settings");
      } else if (props.from === "stage-users") {
        props.changeFromPage("stage-users-settings");
      } else if (props.from === "preserved-users") {
        props.changeFromPage("preserved-users-settings");
      }
    }
  }, [props.changeFromPage]);

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

  // 'Reset password' option
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  // 'New certificate' option
  const [isNewCertificateModalOpen, setIsNewCertificateModalOpen] =
    useState(false);
  const onCloseNewCertificateModal = () => {
    setIsNewCertificateModalOpen(false);
  };

  // 'Add OTP token' option
  const [isAddOtpTokenModalOpen, setIsAddOtpTokenModalOpen] = useState(false);
  const onCloseAddOtpTokenModal = () => {
    setIsAddOtpTokenModalOpen(false);
  };

  // RTK hook: 'Auto assign subordinate IDs'
  const [generateSubIds] = useGenerateSubIdsMutation();

  // Data is updated on 'props.user' changes
  React.useEffect(() => {
    if (
      props.user.memberof_subid !== undefined &&
      props.user.memberof_subid.length > 0
    ) {
      setIsDisabledAutoAssignSubIds(true);
    }
  }, [props.user]);

  // 'Auto assign subordinate IDs' option
  const [isDisabledAutoAssignSubIds, setIsDisabledAutoAssignSubIds] =
    useState(false);

  // 'Auto assign subordinate IDs' handler method
  const onClickAutoAssignSubIds = () => {
    // Prepare payload (params)
    const payload = [
      {
        ipaowner: props.user.uid,
        version: API_VERSION_BACKUP,
      },
    ];

    // Make API call
    generateSubIds(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Disable kebab option
          setIsDisabledAutoAssignSubIds(true);
          // Refresh page
          props.onRefresh();
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "auto-assign-success",
              title: response.data.result.summary,
              variant: "success",
            })
          );
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "auto-assign-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
      }
    });
  };

  // Stage users - 'Activate' option
  const [isActivateModalOpen, setIsActivateModalOpen] = React.useState(false);
  const onCloseActivateModal = () => {
    setIsActivateModalOpen(false);
  };

  // Preserved users - 'Stage' option
  const [isStageModalOpen, setIsStageModalOpen] = React.useState(false);
  const onCloseStageModal = () => {
    setIsStageModalOpen(false);
  };

  // Preserved users - 'Restore' option
  const [isRestoreModalOpen, setIsRestoreModalOpen] = React.useState(false);
  const onCloseRestoreModal = () => {
    setIsRestoreModalOpen(false);
  };

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);

  const activeDropdownItems = [
    <DropdownItem
      data-cy="user-tab-settings-kebab-reset-password"
      key="reset password"
      onClick={() => setIsResetPasswordModalOpen(true)}
    >
      Reset password
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-enable"
      key="enable"
      isDisabled={!props.user.nsaccountlock}
      onClick={() => setIsDisableEnableModalOpen(true)}
    >
      Enable
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-disable"
      key="disable"
      isDisabled={props.user.nsaccountlock}
      onClick={() => setIsDisableEnableModalOpen(true)}
    >
      Disable
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-delete"
      key="delete"
      onClick={() => setIsDeleteModalOpen(true)}
    >
      Delete
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-unlock"
      key="unlock"
      isDisabled={!getUnlockStatus()}
      onClick={() => setIsUnlockModalOpen(true)}
    >
      Unlock
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-add-otp-token"
      key="add otp token"
      onClick={() => setIsAddOtpTokenModalOpen(true)}
    >
      Add OTP token
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-rebuild-auto-membership"
      key="rebuild auto membership"
      onClick={() => setIsRebuildAutoMembershipModalOpen(true)}
    >
      Rebuild auto membership
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-new-certificate"
      key="new certificate"
      onClick={() => setIsNewCertificateModalOpen(true)}
    >
      New certificate
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-auto-assign-subordinate-ids"
      key="auto assign subordinate ids"
      isDisabled={isDisabledAutoAssignSubIds}
      onClick={onClickAutoAssignSubIds}
    >
      Auto assign subordinate IDs
    </DropdownItem>,
  ];

  const stageDropdownItems = [
    <DropdownItem
      data-cy="user-tab-settings-kebab-activate"
      key="activate"
      onClick={() => setIsActivateModalOpen(true)}
    >
      Activate
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-delete"
      key="delete"
      onClick={() => setIsDeleteModalOpen(true)}
    >
      Delete
    </DropdownItem>,
  ];

  const preservedDropdownItems = [
    <DropdownItem
      data-cy="user-tab-settings-kebab-stage"
      key="stage"
      onClick={() => setIsStageModalOpen(true)}
    >
      Stage
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-restore"
      key="restore"
      onClick={() => setIsRestoreModalOpen(true)}
    >
      Restore
    </DropdownItem>,
    <DropdownItem
      data-cy="user-tab-settings-kebab-delete"
      key="delete"
      onClick={() => setIsDeleteModalOpen(true)}
    >
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
    dispatch(
      addAlert({
        name: "revert-success",
        title: "User data reverted",
        variant: "success",
      })
    );
  };

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    // Assign uid
    modifiedValues.uid = props.user.uid;

    // Make API call
    saveUser(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "save-success",
              title: "User modified",
              variant: "success",
            })
          );
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "save-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
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
        <SecondaryButton
          dataCy="user-tab-settings-button-refresh"
          onClickHandler={props.onRefresh}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="user-tab-settings-button-revert"
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
          dataCy="user-tab-settings-button-save"
          isDisabled={!props.isModified}
          onClickHandler={onSave}
        >
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
          dataCy="user-tab-settings-kebab"
          isDisabled={props.user.uid === undefined}
        />
      ),
    },
  ];

  // 'UserSettings' render
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            onClick={props.onOpenContextualPanel}
          />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
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
        <SidebarContent className="pf-v6-u-mr-xl">
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
      <ResetPassword
        uid={props.user.uid}
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onRefresh={props.onRefresh}
      />
      <IssueNewCertificate
        isOpen={isNewCertificateModalOpen}
        onClose={onCloseNewCertificateModal}
        id={props.user.uid}
        showPrincipalFields={false}
        onRefresh={props.onRefresh}
        principal={props.user.uid}
      />
      {props.user.uid !== undefined && (
        <AddOtpToken
          uid={props.user.uid}
          isOpen={isAddOtpTokenModalOpen}
          setIsOpen={setIsAddOtpTokenModalOpen}
          onClose={onCloseAddOtpTokenModal}
        />
      )}
      <ActivateStageUsers
        show={isActivateModalOpen}
        handleModalToggle={onCloseActivateModal}
        selectedUsers={[props.user] as User[]}
        onSuccess={() => navigate("/stage-users")}
      />
      <StagePreservedUsers
        show={isStageModalOpen}
        handleModalToggle={onCloseStageModal}
        selectedUsers={[props.user] as User[]}
        clearSelectedUsers={clearSelectedUsers}
        onSuccess={() => navigate("/preserved-users")}
      />
      <RestorePreservedUsers
        show={isRestoreModalOpen}
        handleModalToggle={onCloseRestoreModal}
        selectedUsers={[props.user] as User[]}
        clearSelectedUsers={clearSelectedUsers}
        onSuccess={() => navigate("/preserved-users")}
      />
    </TabLayout>
  );
};

export default UserSettings;
