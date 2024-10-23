import React from "react";
// PatternFly
import { DropdownItem, Flex } from "@patternfly/react-core";
// Data types
import { Metadata, SudoRule } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import {
  AddRemoveHostToSudoRulesResult,
  AddRemoveToSudoRulesPayload,
  AddRemoveToSudoRulesResult,
  BatchDeleteAllCommandsResult,
  RemoveAllCommandsFromSudoRulesPayload,
  useRemoveAllCommandsAndSaveFromSudoRuleMutation,
  useRemoveFromSudoRuleMutation,
  useRemoveHostFromSudoRuleMutation,
  useSaveSudoRuleMutation,
} from "src/services/rpcSudoRules";
import { ErrorResult } from "src/services/rpc";
// Utils
import { asRecord } from "src/utils/sudoRulesUtils";
import { containsAny } from "src/utils/utils";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
import TabLayout from "src/components/layouts/TabLayout";
import SudoRuleGeneral from "src/components/SudoRuleSections/SudoRuleGeneral";
import SidebarLayout from "src/components/layouts/SidebarLayout";
import SudoRuleOptions from "src/components/SudoRuleSections/SudoRuleOptions";
import SudoRulesWho from "src/components/SudoRuleSections/SudoRulesWho";
import { TableEntry } from "src/components/tables/KeytabTableWithFilter";
import AccessThisHost from "./AccessThisHost";
import RunCommands from "src/components/SudoRuleSections/RunCommands";

interface PropsToSudoRulesSettings {
  rule: Partial<SudoRule>;
  originalRule: Partial<SudoRule>;
  metadata: Metadata;
  onRuleChange: (rule: Partial<SudoRule>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<SudoRule>;
  onResetValues: () => void;
}

const SudoRulesSettings = (props: PropsToSudoRulesSettings) => {
  const alerts = useAlerts();

  // API calls
  const [saveService] = useSaveSudoRuleMutation();
  const [onRemoveFromUsers] = useRemoveFromSudoRuleMutation();
  const [onRemoveFromHosts] = useRemoveHostFromSudoRuleMutation();
  const [onRemoveAllCommands] =
    useRemoveAllCommandsAndSaveFromSudoRuleMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "sudo-rules" });

  const [isSaving, setSaving] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.rule,
    props.onRuleChange
  );

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);

  const dropdownItems = [
    <DropdownItem key="enable-sudo-rule" onClick={() => onChangeEnableModal()}>
      Enable
    </DropdownItem>,
    <DropdownItem
      key="disable-sudo-rule"
      onClick={() => onChangeDisableModal()}
    >
      Disable
    </DropdownItem>,
    <DropdownItem key="delete-sudo-rule" onClick={() => onChangeDeleteModal()}>
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

  // Confirmation modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = React.useState(false);
  const [isEnableModalOpen, setIsEnableModalOpen] = React.useState(false);
  const onChangeDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };
  const onChangeDisableModal = () => {
    setIsDisableModalOpen(!isDisableModalOpen);
  };
  const onChangeEnableModal = () => {
    setIsEnableModalOpen(!isEnableModalOpen);
  };

  const onSaveRule = () => {
    // Save the rule
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.rule.cn;
    setSaving(true);
    saveService(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Sudo rule modified", "success");
          props.onRefresh();
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
          // Reset values. Disable 'revert' and 'save' buttons
          props.onResetValues();
        }
        setSaving(false);
      }
    });
  };

  const onRemoveUserGroups = (userGroupsToDelete: string[]) => {
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "group",
      listOfMembers: userGroupsToDelete,
    };

    onRemoveFromUsers(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result as unknown as AddRemoveToSudoRulesResult;
        if (results) {
          // Some values can be undefined after deletion
          const usersFromResponse = results.result.memberuser_group || [];
          if (!containsAny(usersFromResponse, userGroupsToDelete)) {
            // Set alert: success
            alerts.addAlert(
              "remove-who-group-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
            // SAVE RULE
            onSaveRule();
          }
          // Check if any errors
          else if (
            results.error ||
            results.failed.memberuser.group.length > 0
          ) {
            alerts.addAlert(
              "remove-who-group-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
    });
  };

  const onRemoveHostGroups = (hostGroupsToDelete: string[]) => {
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "hostgroup",
      listOfMembers: hostGroupsToDelete,
    };

    onRemoveFromHosts(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results =
          data.result as unknown as AddRemoveHostToSudoRulesResult;
        if (results) {
          // Some values can be undefined after deletion
          const hostGroupsFromResponse =
            results.result.memberhost_hostgroup || [];
          if (!containsAny(hostGroupsFromResponse, hostGroupsToDelete)) {
            // Set alert: success
            alerts.addAlert(
              "remove-acces-host-hostgroup-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
            // SAVE RULE
            onSaveRule();
          }
          // Check if any errors
          else if (
            results.error ||
            results.failed.memberhost.hostgroup.length > 0
          ) {
            alerts.addAlert(
              "remove-acces-host-hostgroup-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
    });
  };

  const onDeleteAllUsersAndSave = (
    usersToDelete: string[],
    groupsToDelete: string[]
  ) => {
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "user",
      listOfMembers: usersToDelete,
    };

    onRemoveFromUsers(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result as unknown as AddRemoveToSudoRulesResult;
        if (results) {
          // Some values can be undefined after deletion
          const usersFromResponse = results.result.memberuser_user || [];
          const externalsFromResponse = results.result.externaluser || [];
          if (
            !containsAny(usersFromResponse, usersToDelete) ||
            !containsAny(externalsFromResponse, usersToDelete)
          ) {
            // Set alert: success
            alerts.addAlert(
              "remove-who-user-external-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
            // Remove user groups
            onRemoveUserGroups(groupsToDelete);
          }
          // Check if any errors
          else if (results.error || results.failed.memberuser.user.length > 0) {
            alerts.addAlert(
              "remove-who-user-external-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
    });
  };

  const onDeleteAllHostsAndSave = (
    hostsToDelete: string[],
    hostGroupsToDelete: string[]
  ) => {
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "host",
      listOfMembers: hostsToDelete,
    };

    onRemoveFromHosts(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results =
          data.result as unknown as AddRemoveHostToSudoRulesResult;
        if (results) {
          // Some values can be undefined after deletion
          const hostsFromResponse = results.result.memberhost_host || [];
          const externalsFromResponse = results.result.externalhost || [];
          if (
            !containsAny(hostsFromResponse, hostsToDelete) ||
            !containsAny(externalsFromResponse, hostsToDelete)
          ) {
            // Set alert: success
            alerts.addAlert(
              "remove-who-user-external-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
            // Remove user groups
            onRemoveHostGroups(hostGroupsToDelete);
          }
          // Check if any errors
          else if (results.error || results.failed.memberhost.host.length > 0) {
            alerts.addAlert(
              "remove-who-host-external-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
    });
  };

  const onDeleteAllCommandsAndSave = (
    allowCommandsToDelete: string[],
    allowCommandGroupsToDelete: string[],
    denyCommandsToDelete: string[],
    denyCommandGroupsToDelete: string[]
  ) => {
    const payload: RemoveAllCommandsFromSudoRulesPayload = {
      sudoRuleId: props.rule.cn as string,
      allowCommands: allowCommandsToDelete,
      denyCommands: allowCommandGroupsToDelete,
      allowCommandGroups: denyCommandsToDelete,
      denyCommandGroups: denyCommandGroupsToDelete,
    };

    onRemoveAllCommands(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result
          .results as unknown as BatchDeleteAllCommandsResult[];
        if (results) {
          results.map((result) => {
            // Look for individual errors
            if (
              result.error ||
              (result.failed &&
                (("memberallowcmd" in result.failed &&
                  result.failed.memberallowcmd.sudocmd.length > 0) ||
                  ("memberallowcmd" in result.failed &&
                    result.failed.memberallowcmd.sudocmdgroup.length > 0) ||
                  ("memberdenycmd" in result.failed &&
                    result.failed.memberdenycmd.sudocmd.length > 0) ||
                  ("memberdenycmd" in result.failed &&
                    result.failed.memberdenycmd.sudocmdgroup.length > 0)))
            ) {
              alerts.addAlert(
                "remove-run-commands-error",
                "Error: " + result.error,
                "danger"
              );
            }
          });
          // Set alert: success
          if (!data.error) {
            props.onRefresh();
            alerts.addAlert(
              "remove-run-commands-success",
              "Removed item(s) from '" + props.rule.cn + "' and saved",
              "success"
            );
          }
          setSaving(false);
        }
      }
    });
  };

  // 'Save' handle method
  const onSave = () => {
    setSaving(true);

    // Check which keys from object have been modified
    const modifiedValues = props.modifiedValues();
    const keysInObject = Object.keys(modifiedValues);

    if (
      (keysInObject.includes("usercategory") &&
        modifiedValues.usercategory === "all") ||
      (keysInObject.includes("hostcategory") &&
        modifiedValues.hostcategory === "all") ||
      (keysInObject.includes("cmdcategory") &&
        modifiedValues.cmdcategory === "all")
    ) {
      // If 'Anyone' is selected, remove all users and groups
      const usersToRemove = (props.rule.memberuser_user || []).concat(
        props.rule.externaluser || []
      );
      const groupsToRemove = props.rule.memberuser_group || [];
      if (keysInObject.includes("usercategory")) {
        onDeleteAllUsersAndSave(usersToRemove, groupsToRemove);
      }

      // If 'Anyone' is selected, remove all hosts and host groups
      const hostsToRemove = (props.rule.memberhost_host || []).concat(
        props.rule.externalhost || []
      );
      const hostGroupsToRemove = props.rule.memberhost_hostgroup || [];
      if (keysInObject.includes("hostcategory")) {
        onDeleteAllHostsAndSave(hostsToRemove, hostGroupsToRemove);
      }
      keysInObject.includes("usercategory") ||
        keysInObject.includes("hostcategory") ||
        keysInObject.includes("cmdcategory");

      // If 'Any command' is selected, remove all commands and command groups
      const allowCommandsToRemove = props.rule.memberallowcmd_sudocmd || [];
      const denyCommandsToRemove = props.rule.memberdenycmd_sudocmd || [];
      const allowCommandGroupsToRemove =
        props.rule.memberallowcmd_sudocmdgroup || [];
      const denyCommandGroupsToRemove =
        props.rule.memberdenycmd_sudocmdgroup || [];

      if (keysInObject.includes("cmdcategory")) {
        onDeleteAllCommandsAndSave(
          allowCommandsToRemove,
          denyCommandsToRemove,
          allowCommandGroupsToRemove,
          denyCommandGroupsToRemove
        );
      }
    } else {
      // Regular save
      modifiedValues.cn = props.rule.cn;
      saveService(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Show toast notification: success
            alerts.addAlert("save-success", "Sudo rule modified", "success");
            props.onRefresh();
          } else if (response.data.error) {
            // Show toast notification: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert("save-error", errorMessage.message, "danger");
            // Reset values. Disable 'revert' and 'save' buttons
            props.onResetValues();
          }
          setSaving(false);
        }
      });
    }
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onRuleChange(props.originalRule);
    alerts.addAlert("revert-success", "Sudo rule data reverted", "success");
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

  // Sidebar items
  const itemNames = [
    "General",
    "Options",
    "Who",
    "Access this host",
    "Run commands",
  ];

  // Options
  const sudoOptions = props.rule.ipasudoopt || [];

  // Who section - Users should also contain external users
  const [usersAndExternalsList, setUsersAndExternalsList] = React.useState<
    TableEntry[]
  >([]);
  const [usergroupsList, setUsergroupsList] = React.useState<TableEntry[]>([]);

  React.useEffect(() => {
    // - Users list
    const usersAndExternalsListTemp: TableEntry[] =
      props.rule.memberuser_user?.map((entry) => {
        return { entry: entry, showLink: true };
      }) || [];
    // Add externals into 'usersList' without showing link
    usersAndExternalsListTemp.push(
      ...((props.rule.externaluser || []).map((entry) => {
        return { entry: entry, showLink: false };
      }) || [])
    );
    setUsersAndExternalsList(usersAndExternalsListTemp);

    // - User groups list
    const usergroupsListTemp: TableEntry[] =
      props.rule.memberuser_group?.map((entry) => {
        return { entry: entry, showLink: true };
      }) || [];
    setUsergroupsList(usergroupsListTemp);
  }, [props.rule]);

  // Access this host section - Users should also contain external users
  const [hostsAndExternalsList, setHostsAndExternalsList] = React.useState<
    TableEntry[]
  >([]);
  const [hostgroupsList, setHostgroupsList] = React.useState<TableEntry[]>([]);

  React.useEffect(() => {
    // - Hosts list
    const hostsAndExternalsListTemp: TableEntry[] =
      props.rule.memberhost_host?.map((entry) => {
        return { entry: entry, showLink: true };
      }) || [];
    // Add externals into 'hostsList' without showing link
    hostsAndExternalsListTemp.push(
      ...((props.rule.externalhost || []).map((entry) => {
        return { entry: entry, showLink: false };
      }) || [])
    );
    setHostsAndExternalsList(hostsAndExternalsListTemp);

    // - User groups list
    const hostgroupsListTemp: TableEntry[] =
      props.rule.memberhost_hostgroup?.map((entry) => {
        return { entry: entry, showLink: true };
      }) || [];
    setHostgroupsList(hostgroupsListTemp);
  }, [props.rule]);

  // 'Run commands' section
  const [allowCommandsList, setAllowCommandsList] = React.useState<
    TableEntry[]
  >([]);
  const [allowCommandGroupsList, setAllowCommandGroupsList] = React.useState<
    TableEntry[]
  >([]);
  const [denyCommandsList, setDenyCommandsList] = React.useState<TableEntry[]>(
    []
  );
  const [denyCommandGroupsList, setDenyCommandGroupsList] = React.useState<
    TableEntry[]
  >([]);

  React.useEffect(() => {
    // - Allow commands list
    const allowCommandsListTemp: TableEntry[] =
      props.rule.memberallowcmd_sudocmd?.map((entry) => {
        return { entry: entry, showLink: true };
      }) || [];
    setAllowCommandsList(allowCommandsListTemp);

    // - Allow command groups list
    const allowCommandGroupsListTemp: TableEntry[] =
      props.rule.memberallowcmd_sudocmdgroup?.map((entry) => {
        return { entry: entry, showLink: true };
      }) || [];
    setAllowCommandGroupsList(allowCommandGroupsListTemp);

    // - Deny commands list
    const denyCommandsListTemp: TableEntry[] =
      props.rule.memberdenycmd_sudocmd?.map((entry) => {
        return { entry: entry, showLink: true };
      }) || [];
    setDenyCommandsList(denyCommandsListTemp);

    // - Deny command groups list
    const denyCommandGroupsListTemp: TableEntry[] =
      props.rule.memberdenycmd_sudocmdgroup?.map((entry) => {
        return { entry: entry, showLink: true };
      }) || [];
    setDenyCommandGroupsList(denyCommandGroupsListTemp);
  }, [props.rule]);

  // Render component
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
      <SidebarLayout itemNames={itemNames}>
        {/* General */}
        <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
          <TitleLayout headingLevel="h2" id="general" text="General" />
          <SudoRuleGeneral
            ipaObject={ipaObject}
            recordOnChange={recordOnChange}
            metadata={props.metadata}
          />
        </Flex>
        {/* Options */}
        <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
          <TitleLayout headingLevel="h2" id="options" text="Options" />
          <SudoRuleOptions
            sudoRuleId={props.rule.cn as string}
            options={sudoOptions}
          />
        </Flex>
        {/* Who */}
        <Flex
          direction={{ default: "column" }}
          flex={{ default: "flex_1" }}
          className="pf-v5-u-mt-lg"
        >
          <TitleLayout headingLevel="h2" id="who" text="Who" />
          <SudoRulesWho
            rule={props.rule}
            ipaObject={ipaObject}
            onRefresh={props.onRefresh}
            usersList={usersAndExternalsList}
            userGroupsList={usergroupsList}
            recordOnChange={recordOnChange}
            metadata={props.metadata}
            onSave={onSave}
            modifiedValues={props.modifiedValues}
          />
        </Flex>
        {/* Access this host */}
        <Flex
          direction={{ default: "column" }}
          flex={{ default: "flex_1" }}
          className="pf-v5-u-mt-lg"
        >
          <TitleLayout headingLevel="h2" id="who" text="Access this host" />
          <AccessThisHost
            rule={props.rule}
            ipaObject={ipaObject}
            onRefresh={props.onRefresh}
            hostsList={hostsAndExternalsList}
            hostGroupsList={hostgroupsList}
            recordOnChange={recordOnChange}
            metadata={props.metadata}
            onSave={onSave}
            modifiedValues={props.modifiedValues}
          />
        </Flex>
        {/* Run commands */}
        <Flex
          direction={{ default: "column" }}
          flex={{ default: "flex_1" }}
          className="pf-v5-u-mt-lg"
        >
          <TitleLayout
            headingLevel="h2"
            id="run-commands"
            text="Run commands"
          />
          <RunCommands
            rule={props.rule}
            ipaObject={ipaObject}
            onRefresh={props.onRefresh}
            allowCommandsList={allowCommandsList}
            allowCommandGroupsList={allowCommandGroupsList}
            denyCommandsList={denyCommandsList}
            denyCommandGroupsList={denyCommandGroupsList}
            recordOnChange={recordOnChange}
            metadata={props.metadata}
            onSave={onSave}
            modifiedValues={props.modifiedValues}
          />
        </Flex>
      </SidebarLayout>
    </TabLayout>
  );
};

export default SudoRulesSettings;
