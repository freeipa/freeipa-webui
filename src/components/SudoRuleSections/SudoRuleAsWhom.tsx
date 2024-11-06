import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Label,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Data types
import { Metadata, SudoRule } from "src/utils/datatypes/globalDataTypes";
// Components
import KeytabTableWithFilter, {
  TableEntry,
} from "src/components/tables/KeytabTableWithFilter";
import IpaToggleGroup from "src/components/Form/IpaToggleGroup";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  AddRemoveAsRunToSudoRulesPayload,
  AddRemoveRunAsToSudoRulesResult,
  useAddRunAsMutation,
  useRemoveRunAsMutation,
  useSaveSudoRuleMutation,
} from "src/services/rpcSudoRules";
// Utils
import { containsAny } from "src/utils/utils";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface SudoRuleAsWhomProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  rule: Partial<SudoRule>;
  runasuser_users: TableEntry[]; // ipasudorunas_user + ipasudorunasextuser
  runasuser_groups: TableEntry[]; // ipasudorunas_group + ipasudorunasextgroup?
  runasgroup_group: TableEntry[]; // ipasudorunasgroup_group + ipasudorunasextusergroup?
  onRefresh: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
  // setIsAnyoneSelected: (value: boolean) => void;
  onSave: () => void;
  modifiedValues: () => Partial<SudoRule>;
}

const SudoRuleAsWhom = (props: SudoRuleAsWhomProps) => {
  const [activeRunAsUsersTabKey, setActiveRunAsUsersTabKey] = React.useState<
    string | number
  >(0);
  const [activeRunAsGroupsTabKey, setActiveRunAsGroupsTabKey] = React.useState<
    string | number
  >(0);

  const handleRunAsUsersTabClick = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveRunAsUsersTabKey(tabIndex);
  };

  const handleRunAsGroupsTabClick = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveRunAsGroupsTabKey(tabIndex);
  };

  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [addRunAs] = useAddRunAsMutation();
  const [removeRunAs] = useRemoveRunAsMutation();
  const [onSave] = useSaveSudoRuleMutation();

  // States
  const [modalSpinning, setModalSpinning] = React.useState(false);
  const [runAsUsersList, setRunAsUsersList] = React.useState<TableEntry[]>([]);
  const [runAsUsersGroupsList, setRunAsUsersGroupsList] = React.useState<
    TableEntry[]
  >([]);
  const [runAsGroupsList, setRunAsGroupsList] = React.useState<TableEntry[]>(
    []
  );

  React.useEffect(() => {
    setRunAsUsersList(props.runasuser_users);
  }, [props.runasuser_users]);

  React.useEffect(() => {
    setRunAsUsersGroupsList(props.runasuser_groups);
  }, [props.runasuser_groups]);

  React.useEffect(() => {
    setRunAsGroupsList(props.runasgroup_group);
  }, [props.runasgroup_group]);

  // 'RunAs user'
  // - On add
  const onAddRunAsUser = (newUsersToAdd: string[]) => {
    const payload: AddRemoveAsRunToSudoRulesPayload = {
      toId: props.rule.cn as string,
      runAsType: "user",
      type: "user",
      listOfMembers: newUsersToAdd,
    };

    addRunAs(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result
          .results as unknown as AddRemoveRunAsToSudoRulesResult[];
        results.forEach((result) => {
          // Check if any errors
          if (result.error !== null) {
            alerts.addAlert(
              "as-whom-add-user-external-error",
              "Error: " + result.error,
              "danger"
            );
          } else {
            // Some values can be undefined after addition
            const usersFromResponse = result.result.ipasudorunas_user || [];
            const externalsFromResponse =
              result.result.ipasudorunasextuser || [];
            if (
              containsAny(usersFromResponse, newUsersToAdd) ||
              containsAny(externalsFromResponse, newUsersToAdd)
            ) {
              // Set alert: success
              alerts.addAlert(
                "as-whom-add-user-external-success",
                "Added new item(s) to '" + props.rule.cn + "'",
                "success"
              );
              // Refresh page
              props.onRefresh();
            }
          }
        });
      } else {
        // Assume error
        alerts.addAlert(
          "as-whom-add-user-external-error",
          "Error: " + (response.error ? response.error : "Unknown error"),
          "danger"
        );
      }
      setModalSpinning(false);
    });
  };

  // - On save and add
  const onSaveAndAddRunAsUser = (newUsersToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.ipasudorunasusercategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Show toast notification: success
            alerts.addAlert("save-success", "Sudo rule modified", "success");
            props.onRefresh();
            // Add new runAs users
            onAddRunAsUser(newUsersToAdd);
          } else if (response.data.error) {
            // Show toast notification: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert("save-error", errorMessage.message, "danger");
          }
        }
      });
    } else {
      onAddRunAsUser(newUsersToAdd);
    }
  };

  // - On delete
  const onDeleteRunAsUser = (usersToDelete: string[]) => {
    const payload: AddRemoveAsRunToSudoRulesPayload = {
      toId: props.rule.cn as string,
      runAsType: "user",
      type: "user",
      listOfMembers: usersToDelete,
    };

    removeRunAs(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results =
          data.result as unknown as AddRemoveRunAsToSudoRulesResult;
        if (results) {
          // Some values can be undefined after deletion
          const userFromResponse = results.result.ipasudorunas_user || [];
          const externalsFromResponse =
            results.result.ipasudorunasextuser || [];
          if (
            !containsAny(userFromResponse, usersToDelete) ||
            !containsAny(externalsFromResponse, usersToDelete)
          ) {
            // Set alert: success
            alerts.addAlert(
              "as-whom-remove-user-external-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          else if (
            results.error ||
            results.failed.ipasudorunas.user.length > 0
          ) {
            alerts.addAlert(
              "as-whom-remove-user-external-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
      setModalSpinning(false);
    });
  };

  // 'group of RunAs users'
  // - On add
  const onAddRunAsUsersGroups = (newGroupsToAdd: string[]) => {
    const payload: AddRemoveAsRunToSudoRulesPayload = {
      toId: props.rule.cn as string,
      runAsType: "user",
      type: "group",
      listOfMembers: newGroupsToAdd,
    };

    addRunAs(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result
          .results as unknown as AddRemoveRunAsToSudoRulesResult[];
        results.forEach((result) => {
          // Check if any errors
          if (result.error !== null) {
            alerts.addAlert(
              "as-whom-add-user-group-external-error",
              "Error: " + result.error,
              "danger"
            );
          } else {
            // Some values can be undefined after addition
            const groupsFromResponse = result.result.ipasudorunas_group || [];
            const externalsFromResponse =
              result.result.ipasudorunasextusergroup || [];
            if (
              containsAny(groupsFromResponse, newGroupsToAdd) ||
              containsAny(externalsFromResponse, newGroupsToAdd)
            ) {
              // Set alert: success
              alerts.addAlert(
                "as-whom-add-user-group-external-success",
                "Added new item(s) to '" + props.rule.cn + "'",
                "success"
              );
              // Refresh page
              props.onRefresh();
            }
          }
        });
      } else {
        // Assume error
        alerts.addAlert(
          "as-whom-add-user-group-external-error",
          "Error: " + (response.error ? response.error : "Unknown error"),
          "danger"
        );
      }
      setModalSpinning(false);
    });
  };

  // // - On save and add
  const onSaveAndAddRunAsUsersGroups = (newGroupsToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.ipasudorunasusercategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Show toast notification: success
            alerts.addAlert("save-success", "Sudo rule modified", "success");
            props.onRefresh();
            // Add new runAs users
            onAddRunAsUsersGroups(newGroupsToAdd);
          } else if (response.data.error) {
            // Show toast notification: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert("save-error", errorMessage.message, "danger");
          }
        }
      });
    } else {
      onAddRunAsUsersGroups(newGroupsToAdd);
    }
  };

  // - On delete
  const onDeleteRunAsUsersGroups = (groupsToDelete: string[]) => {
    const payload: AddRemoveAsRunToSudoRulesPayload = {
      toId: props.rule.cn as string,
      runAsType: "user",
      type: "group",
      listOfMembers: groupsToDelete,
    };

    removeRunAs(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results =
          data.result as unknown as AddRemoveRunAsToSudoRulesResult;
        if (results) {
          // Some values can be undefined after deletion
          const groupsFromResponse = results.result.ipasudorunas_group || [];
          const externalsFromResponse =
            results.result.ipasudorunasextusergroup || [];
          if (
            !containsAny(groupsFromResponse, groupsToDelete) ||
            !containsAny(externalsFromResponse, groupsToDelete)
          ) {
            // Set alert: success
            alerts.addAlert(
              "as-whom-remove-user-group-external-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          else if (
            results.error ||
            results.failed.ipasudorunas.group.length > 0
          ) {
            alerts.addAlert(
              "as-whom-remove-user-group-external-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
      setModalSpinning(false);
    });
  };

  // 'RunAs group'
  // - On add
  const onAddRunAsGroups = (newGroupsToAdd: string[]) => {
    const payload: AddRemoveAsRunToSudoRulesPayload = {
      toId: props.rule.cn as string,
      runAsType: "group",
      type: "group",
      listOfMembers: newGroupsToAdd,
    };

    addRunAs(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result
          .results as unknown as AddRemoveRunAsToSudoRulesResult[];
        results.forEach((result) => {
          // Check if any errors
          if (result.error !== null) {
            alerts.addAlert(
              "as-whom-add-user-group-external-error",
              "Error: " + result.error,
              "danger"
            );
          } else {
            // Some values can be undefined after addition
            const groupsFromResponse =
              result.result.ipasudorunasgroup_group || [];
            const externalsFromResponse =
              result.result.ipasudorunasextgroup || [];
            if (
              containsAny(groupsFromResponse, newGroupsToAdd) ||
              containsAny(externalsFromResponse, newGroupsToAdd)
            ) {
              // Set alert: success
              alerts.addAlert(
                "as-whom-add-group-external-success",
                "Added new item(s) to '" + props.rule.cn + "'",
                "success"
              );
              // Refresh page
              props.onRefresh();
            }
          }
        });
      } else {
        // Assume error
        alerts.addAlert(
          "as-whom-add-group-external-error",
          "Error: " + (response.error ? response.error : "Unknown error"),
          "danger"
        );
      }
      setModalSpinning(false);
    });
  };

  // - On save and add
  const onSaveAndAddRunAsGroups = (newGroupsToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.ipasudorunasgroupcategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Show toast notification: success
            alerts.addAlert("save-success", "Sudo rule modified", "success");
            props.onRefresh();
            // Add new runAs users
            onAddRunAsGroups(newGroupsToAdd);
          } else if (response.data.error) {
            // Show toast notification: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert("save-error", errorMessage.message, "danger");
          }
        }
      });
    } else {
      onAddRunAsGroups(newGroupsToAdd);
    }
  };

  // - On delete
  const onDeleteRunAsGroups = (groupsToDelete: string[]) => {
    const payload: AddRemoveAsRunToSudoRulesPayload = {
      toId: props.rule.cn as string,
      runAsType: "group",
      type: "group",
      listOfMembers: groupsToDelete,
    };

    removeRunAs(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results =
          data.result as unknown as AddRemoveRunAsToSudoRulesResult;
        if (results) {
          // Some values can be undefined after deletion
          const groupsFromResponse =
            results.result.ipasudorunasgroup_group || [];
          const externalsFromResponse =
            results.result.ipasudorunasextgroup || [];
          if (
            !containsAny(groupsFromResponse, groupsToDelete) ||
            !containsAny(externalsFromResponse, groupsToDelete)
          ) {
            // Set alert: success
            alerts.addAlert(
              "as-whom-remove-group-external-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          else if (
            results.error ||
            results.failed.ipasudorunas.group.length > 0
          ) {
            alerts.addAlert(
              "as-whom-remove-group-external-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
      setModalSpinning(false);
    });
  };

  // Filter: toggle options
  const userOptions = [
    { label: "Anyone", value: "all" },
    { label: "Specified Groups", value: "" },
  ];

  const groupOptions = [
    { label: "Any Group", value: "all" },
    { label: "Specified Users and Groups", value: "" },
  ];

  // - RunAs Users
  const [runAsUserOptionSelected, setRunAsUserOptionSelected] =
    React.useState<string>(
      props.rule.ipasudorunasusercategory &&
        props.rule.ipasudorunasusercategory === "all"
        ? "Anyone"
        : "Specified Users and Groups"
    );

  // -- When 'ipasudorunasusercategory' is "all", disable checkboxes
  const runAsUserAnyoneOptionSelected = runAsUserOptionSelected === "Anyone";

  const filterRunAsUser = (
    <Flex>
      <FlexItem>RunAs User category the rule applies to: </FlexItem>
      <FlexItem>
        <IpaToggleGroup
          ipaObject={props.ipaObject}
          name="ipasudorunasusercategory"
          options={userOptions}
          optionSelected={runAsUserOptionSelected}
          setOptionSelected={setRunAsUserOptionSelected}
          onChange={props.recordOnChange}
          objectName="sudorule"
          metadata={props.metadata}
          isCompact
        />
      </FlexItem>
    </Flex>
  );

  // - RunAs Groups
  const [runAsGroupOptionSelected, setRunAsGroupOptionSelected] =
    React.useState<string>(
      props.rule.ipasudorunasgroupcategory &&
        props.rule.ipasudorunasgroupcategory === "all"
        ? "Any Group"
        : "Specified Groups"
    );

  // -- When 'ipasudorunasgroupcategory' is "all", disable checkboxes
  const runAsGroupAnyoneOptionSelected =
    runAsGroupOptionSelected === "Any Group";

  const filterRunAsGroup = (
    <Flex className="pf-v5-u-mt-lg">
      <FlexItem>RunAs Group category the rule applies to: </FlexItem>
      <FlexItem>
        <IpaToggleGroup
          ipaObject={props.ipaObject}
          name="ipasudorunasgroupcategory"
          options={groupOptions}
          optionSelected={runAsGroupOptionSelected}
          setOptionSelected={setRunAsGroupOptionSelected}
          onChange={props.recordOnChange}
          objectName="sudorule"
          metadata={props.metadata}
          isCompact
        />
      </FlexItem>
    </Flex>
  );

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      {/* Filter: toggle RunAs Users */}
      {filterRunAsUser}
      {/* Tabs RunAs users*/}
      <Tabs
        activeKey={activeRunAsUsersTabKey}
        onSelect={handleRunAsUsersTabClick}
        aria-label="Tabs for RunAs user category"
        className="pf-v5-u-mt-md"
      >
        <Tab
          key={0}
          eventKey={0}
          className="pf-v5-u-mt-sm"
          title={
            <TabTitleText>
              RunAs Users <Label isCompact>{runAsUsersList.length}</Label>
            </TabTitleText>
          }
          aria-label="RunAs users in the as whom section of the sudo rule"
        >
          <KeytabTableWithFilter
            className="pf-v5-u-ml-md pf-v5-u-mt-sm"
            id={props.rule.cn as string}
            from="sudo rule"
            name="ipasudorunas_user"
            isSpinning={modalSpinning}
            entityType="user"
            // Table data
            operationTitle={"Add RunAs user into sudo rule " + props.rule.cn}
            tableEntryList={runAsUsersList}
            columnNames={["RunAs Users"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddRunAsUser}
            onDelete={onDeleteRunAsUser}
            checkboxesDisabled={runAsUserAnyoneOptionSelected}
            // Add external option on Add modal
            externalOption={true}
          />
        </Tab>
        <Tab
          key={1}
          eventKey={1}
          className="pf-v5-u-mt-sm"
          title={
            <TabTitleText>
              Groups of RunAs Users{" "}
              <Label isCompact>{runAsUsersGroupsList.length}</Label>
            </TabTitleText>
          }
          aria-label="RunAs user groups in the as whom section of the sudo rule"
        >
          <KeytabTableWithFilter
            className="pf-v5-u-ml-md pf-v5-u-mt-sm"
            id={props.rule.cn as string}
            from="sudo rule"
            name="ipasudorunas_group"
            isSpinning={modalSpinning}
            entityType="group"
            // Table data
            operationTitle={"Add host group into sudo rule " + props.rule.cn}
            tableEntryList={runAsUsersGroupsList}
            columnNames={["Groups of RunAs Users"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddRunAsUsersGroups}
            onDelete={onDeleteRunAsUsersGroups}
            checkboxesDisabled={runAsUserAnyoneOptionSelected}
            // Add external option on Add modal
            externalOption={true}
          />
        </Tab>
      </Tabs>
      {/* Filter: toggle RunAs groups */}
      {filterRunAsGroup}
      {/* Tabs RunAs groups*/}
      <Tabs
        activeKey={activeRunAsGroupsTabKey}
        onSelect={handleRunAsGroupsTabClick}
        aria-label="Tabs for RunAs Group category"
        className="pf-v5-u-mt-md"
      >
        <Tab
          key={0}
          eventKey={0}
          className="pf-v5-u-mt-sm"
          title={
            <TabTitleText>
              RunAs Groups <Label isCompact>{runAsGroupsList.length}</Label>
            </TabTitleText>
          }
          aria-label="RunAs Groups in the as whom section of the sudo rule"
        >
          <KeytabTableWithFilter
            className="pf-v5-u-ml-md pf-v5-u-mt-sm"
            id={props.rule.cn as string}
            from="sudo rule"
            name="ipasudorunasgroup_group"
            isSpinning={modalSpinning}
            entityType="group"
            // Table data
            operationTitle={"Add RunAs groups into sudo rule " + props.rule.cn}
            tableEntryList={runAsGroupsList}
            columnNames={["RunAs Groups"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddRunAsGroups}
            onDelete={onDeleteRunAsGroups}
            checkboxesDisabled={runAsGroupAnyoneOptionSelected}
            // Add external option on Add modal
            externalOption={true}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default SudoRuleAsWhom;
