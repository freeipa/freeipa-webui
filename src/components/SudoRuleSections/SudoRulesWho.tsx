import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Label,
  Radio,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Data types
import { SudoRule } from "src/utils/datatypes/globalDataTypes";
// Components
import KeytabTableWithFilter, {
  TableEntry,
} from "../tables/KeytabTableWithFilter";
// RPC
import {
  AddRemoveToSudoRulesResult,
  AddRemoveToSudoRulesPayload,
  useAddToSudoRuleMutation,
  useRemoveFromSudoRuleMutation,
} from "src/services/rpcSudoRules";
import { containsAny } from "src/utils/utils";
import useAlerts from "src/hooks/useAlerts";

interface PropsToSudoRulesWho {
  rule: Partial<SudoRule>;
  usersList: TableEntry[]; // memberuser_user + externaluser
  userGroupsList: TableEntry[]; // memberuser_group
  onRefresh: () => void;
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
              "Added new item(s)' to" + props.rule.cn + "'",
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          if (result.error !== null) {
            alerts.addAlert(
              "add-who-user-external-error",
              "Error: " + result.error,
              "danger"
            );
          }
        });
      }
      setModalSpinning(false);
    });
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
              "Added new item(s)' to" + props.rule.cn + "'",
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
          if (!containsAny(groupsFromResponse, groupsToDelete)) {
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

  // Filter
  const [anyoneRadio, setAnyoneRadio] = React.useState(false);
  const [specifiedRadio, setSpecifiedRadio] = React.useState(true);

  React.useEffect(() => {
    if (anyoneRadio === true) {
      setSpecifiedRadio(false);
    }
  }, [anyoneRadio]);

  React.useEffect(() => {
    if (specifiedRadio === true) {
      setAnyoneRadio(false);
    }
  }, [specifiedRadio]);

  const filter = (
    <Flex>
      <FlexItem>User category the rule applies to: </FlexItem>
      <FlexItem>
        <Radio
          isChecked={anyoneRadio}
          name="anyone-radio"
          onChange={(_event, value) => setAnyoneRadio(value)}
          label="Anyone"
          id="anyone-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          isChecked={specifiedRadio}
          name="specified-radio"
          onChange={(_event, value) => setSpecifiedRadio(value)}
          label="Specified Users and Groups"
          id="specified-radio"
        />
      </FlexItem>
    </Flex>
  );

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      {/* Filter: radio options */}
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
            onAdd={onAddNewUser}
            onDelete={onDeleteUsers}
            checkboxesDisabled={anyoneRadio}
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
            onAdd={onAddNewGroup}
            onDelete={onDeleteGroups}
            checkboxesDisabled={anyoneRadio}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default SudoRulesWho;
