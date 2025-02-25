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
import IpaToggleGroup from "src/components/Form/IpaToggleGroup/IpaToggleGroup";
// RPC
import {
  AddRemoveToSudoRulesResult,
  AddRemoveToSudoRulesPayload,
  useAddToSudoRuleMutation,
  useRemoveFromSudoRuleMutation,
  useSaveSudoRuleMutation,
} from "src/services/rpcSudoRules";
// Utils
import { containsAny } from "src/utils/utils";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import { ErrorResult } from "src/services/rpc";

interface PropsToSudoRulesWho {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  rule: Partial<SudoRule>;
  usersList: TableEntry[]; // memberuser_user + externaluser
  userGroupsList: TableEntry[]; // memberuser_group
  onRefresh: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
  onSave: () => void;
  modifiedValues: () => Partial<SudoRule>;
}

const SudoRulesWho = (props: PropsToSudoRulesWho) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [onAdd] = useAddToSudoRuleMutation();
  const [onRemove] = useRemoveFromSudoRuleMutation();
  const [onSave] = useSaveSudoRuleMutation();

  // States
  const [modalSpinning, setModalSpinning] = React.useState(false);
  const [usersList, setUsersList] = React.useState<TableEntry[]>(
    props.usersList
  );
  const [userGroupsList, setUserGroupsList] = React.useState<TableEntry[]>(
    props.userGroupsList
  );

  React.useEffect(() => {
    setUsersList(props.usersList);
  }, [props.usersList]);

  React.useEffect(() => {
    setUserGroupsList(props.userGroupsList);
  }, [props.userGroupsList]);

  // on Add new user
  const onAddNewUser = (newUsers: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "user",
      listOfMembers: newUsers,
    };

    onAdd(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result
          .results as unknown as AddRemoveToSudoRulesResult[];
        results.forEach((result) => {
          // Check if any errors
          if (result.error !== null) {
            alerts.addAlert(
              "add-who-user-external-error",
              "Error: " + result.error,
              "danger"
            );
          } else {
            // Some values can be undefined after addition
            const usersFromResponse = result.result.memberuser_user || [];
            const externalsFromResponse = result.result.externaluser || [];
            if (
              containsAny(usersFromResponse, newUsers) ||
              containsAny(externalsFromResponse, newUsers)
            ) {
              // Set alert: success
              alerts.addAlert(
                "add-who-user-external-success",
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
          "add-who-user-external-error",
          "Error: " + (response.error ? response.error : "Unknown error"),
          "danger"
        );
      }
      setModalSpinning(false);
    });
  };

  // On save and add users
  //  - If 'specify' option is selected (just modified) and new users should be added:
  //    save the rule first and then add the users
  const onSaveAndAddUsers = (usersToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.usercategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Show toast notification: success
            alerts.addAlert("save-success", "Sudo rule modified", "success");
            props.onRefresh();
            // Add new users
            onAddNewUser(usersToAdd);
          } else if (response.data.error) {
            // Show toast notification: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert("save-error", errorMessage.message, "danger");
          }
        }
      });
    } else {
      onAddNewUser(usersToAdd);
    }
  };

  // on Delete user(s)
  const onDeleteUsers = (usersToDelete: string[]) => {
    setModalSpinning(true);
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
      setModalSpinning(false);
    });
  };

  // on Add new group
  const onAddNewGroup = (newGroups: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "group",
      listOfMembers: newGroups,
    };

    onAdd(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result
          .results as unknown as AddRemoveToSudoRulesResult[];
        results.forEach((result) => {
          const groupsFromResponse = result.result.memberuser_group;
          if (containsAny(groupsFromResponse, newGroups)) {
            // Set alert: success
            alerts.addAlert(
              "add-who-group-external-success",
              "Added new item(s) to '" + props.rule.cn + "'",
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          if (result.error !== null) {
            alerts.addAlert(
              "add-who-group-external-error",
              "Error: " + result.error,
              "danger"
            );
          }
        });
      }
      setModalSpinning(false);
    });
  };

  // On save and add groups
  //  - If 'specify' option is selected (just modified) and new users should be added:
  //    save the rule first and then add the users
  const onSaveAndAddGroups = (groupsoAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.usercategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Show toast notification: success
            alerts.addAlert("save-success", "Sudo rule modified", "success");
            props.onRefresh();
            // Add new users
            onAddNewGroup(groupsoAdd);
          } else if (response.data.error) {
            // Show toast notification: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert("save-error", errorMessage.message, "danger");
          }
        }
      });
    } else {
      onAddNewGroup(groupsoAdd);
    }
  };

  // on Delete group(s)
  const onDeleteGroups = (groupsToDelete: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "group",
      listOfMembers: groupsToDelete,
    };

    onRemove(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result as unknown as AddRemoveToSudoRulesResult;
        if (results) {
          const groupsFromResponse = results.result.memberuser_group;
          if (
            groupsFromResponse === undefined ||
            !containsAny(groupsFromResponse, groupsToDelete)
          ) {
            // Set alert: success
            alerts.addAlert(
              "remove-who-group-external-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          else if (
            results.error ||
            results.failed.memberuser.group.length > 0
          ) {
            alerts.addAlert(
              "remove-who-group-external-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
      setModalSpinning(false);
    });
  };

  // Filter: option options
  // - Default value: "first" (the first element)
  // - Instead of using the name of the buttons, it will be referred
  //   as "first" as per the 'IpaToggleGroup' component
  const [optionSelected, setOptionSelected] = React.useState<string>(
    props.rule.usercategory && props.rule.usercategory === "all"
      ? "Anyone"
      : "Specified Users and Groups"
  );

  // - When 'usercategory' is "all", disable checkboxes
  const anyoneOptionSelected = optionSelected === "Anyone";

  const options = [
    { label: "Anyone", value: "all" },
    { label: "Specified Users and Groups", value: "" },
  ];

  const filter = (
    <Flex name="usercategory">
      <FlexItem>User category the rule applies to: </FlexItem>
      <FlexItem>
        <IpaToggleGroup
          ipaObject={props.ipaObject}
          name="usercategory"
          options={options}
          optionSelected={optionSelected}
          setOptionSelected={setOptionSelected}
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
      {/* Filter: toggle group */}
      {filter}
      {/* Tabs */}
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        aria-label="Tabs for types of entries that can create keytabs"
      >
        <Tab
          key={0}
          eventKey={0}
          title={
            <TabTitleText>
              Users <Label isCompact>{usersList.length}</Label>
            </TabTitleText>
          }
          aria-label="users in the who section of the sudo rule"
        >
          <KeytabTableWithFilter
            className="pf-v5-u-ml-md pf-v5-u-mt-sm"
            id={props.rule.cn as string}
            from="sudo rule"
            name="memberuser_user"
            isSpinning={modalSpinning}
            entityType="user"
            // Table data
            operationTitle={"Add user into sudo rule " + props.rule.cn}
            tableEntryList={usersList}
            columnNames={["User"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddUsers}
            onDelete={onDeleteUsers}
            checkboxesDisabled={anyoneOptionSelected}
            // Add external option on Add modal
            externalOption={true}
          />
        </Tab>
        <Tab
          key={1}
          eventKey={1}
          title={
            <TabTitleText>
              User groups <Label isCompact>{userGroupsList.length}</Label>
            </TabTitleText>
          }
          aria-label="user groups in the who section of the sudo rule"
        >
          <KeytabTableWithFilter
            className="pf-v5-u-ml-md pf-v5-u-mt-sm"
            id={props.rule.cn as string}
            from="sudo rule"
            name="memberuser_group"
            isSpinning={modalSpinning}
            entityType="group"
            // Table data
            operationTitle={"Add group into sudo rule " + props.rule.cn}
            tableEntryList={userGroupsList}
            columnNames={["Group"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddGroups}
            onDelete={onDeleteGroups}
            checkboxesDisabled={anyoneOptionSelected}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default SudoRulesWho;
