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
  AddRemoveToSudoRulesPayload,
  AddRemoveToSudoRulesResult,
  useRemoveFromSudoRuleMutation,
  useSaveSudoRuleMutation,
} from "src/services/rpcSudoRules";
import { ErrorResult } from "src/services/rpc";
// Utils
import { asRecord } from "src/utils/sudoRulesUtils";
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
import { containsAny } from "src/utils/utils";

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
  const [onRemove] = useRemoveFromSudoRuleMutation();

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

  // When the 'Anyone' option in the 'Who' category is selected, the API calls when saving should be different.
  // It should:
  // - Remove all users + groups from the 'Who' category
  // - Save the sudo rule
  // Thus, a flag is needed to determine if the 'Anyone' option is selected
  const [isWhoAnyoneSelected, setIsWhoAnyoneSelected] = React.useState(false);

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

    onRemove(payload).then((response) => {
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

  const onDeleteAllAndSave = (
    usersToDelete: string[],
    groupsToDelete: string[]
  ) => {
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "user",
      listOfMembers: usersToDelete,
    };

    onRemove(payload).then((response) => {
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

  // 'Save' handle method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.rule.cn;
    setSaving(true);

    // If 'Anyone' is selected, remove all users and groups
    if (isWhoAnyoneSelected) {
      const usersToRemove = (props.rule.memberuser_user || []).concat(
        props.rule.externaluser || []
      );
      const groupsToRemove = props.rule.memberuser_group || [];
      onDeleteAllAndSave(usersToRemove, groupsToRemove);
    } else {
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
  const itemNames = ["General", "Options", "Who"];

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
            setIsAnyoneSelected={setIsWhoAnyoneSelected}
            onSave={onSave}
            modifiedValues={props.modifiedValues}
          />
        </Flex>
      </SidebarLayout>
    </TabLayout>
  );
};

export default SudoRulesSettings;
