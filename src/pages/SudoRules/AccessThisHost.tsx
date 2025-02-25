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
import { ErrorResult } from "src/services/rpc";
import {
  AddRemoveHostToSudoRulesResult,
  AddRemoveToSudoRulesPayload,
  useAddHostToSudoRuleMutation,
  useRemoveHostFromSudoRuleMutation,
  useSaveSudoRuleMutation,
} from "src/services/rpcSudoRules";

// Utils
import { containsAny } from "src/utils/utils";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface PropsToAccessThisHost {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  rule: Partial<SudoRule>;
  hostsList: TableEntry[]; // memberhost_host + externalhost
  hostGroupsList: TableEntry[]; // memberhost_hostgroup
  onRefresh: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
  // setIsAnyoneSelected: (value: boolean) => void;
  onSave: () => void;
  modifiedValues: () => Partial<SudoRule>;
}

const AccessThisHost = (props: PropsToAccessThisHost) => {
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
  const [onAdd] = useAddHostToSudoRuleMutation();
  const [onDelete] = useRemoveHostFromSudoRuleMutation();
  const [onSave] = useSaveSudoRuleMutation();

  // States
  const [modalSpinning, setModalSpinning] = React.useState(false);
  const [hostsList, setHostsList] = React.useState<TableEntry[]>(
    props.hostsList
  );
  const [hostGroupsList, setHostGroupsList] = React.useState<TableEntry[]>(
    props.hostGroupsList
  );

  React.useEffect(() => {
    setHostsList(props.hostsList);
  }, [props.hostsList]);

  React.useEffect(() => {
    setHostGroupsList(props.hostGroupsList);
  }, [props.hostGroupsList]);

  // on Add new host
  const onAddNewHost = (newHosts: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "host",
      listOfMembers: newHosts,
    };

    onAdd(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result
          .results as unknown as AddRemoveHostToSudoRulesResult[];
        results.forEach((result) => {
          // Check if any errors
          if (result.error !== null) {
            alerts.addAlert(
              "access-this-host-add-host-external-error",
              "Error: " + result.error,
              "danger"
            );
          } else {
            // Some values can be undefined after addition
            const hostsFromResponse = result.result.memberhost_host || [];
            const externalsFromResponse = result.result.externalhost || [];
            if (
              containsAny(hostsFromResponse, newHosts) ||
              containsAny(externalsFromResponse, newHosts)
            ) {
              // Set alert: success
              alerts.addAlert(
                "access-this-host-add-host-external-success",
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

  // on save and add hosts
  //  - If 'specify' option is selected (just modified) and new hosts should be added:
  //    save the rule first and then add the hosts
  const onSaveAndAddHosts = (hostsToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.hostcategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Show toast notification: success
            alerts.addAlert("save-success", "Sudo rule modified", "success");
            props.onRefresh();
            // Add new hosts
            onAddNewHost(hostsToAdd);
          } else if (response.data.error) {
            // Show toast notification: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert("save-error", errorMessage.message, "danger");
          }
        }
      });
    } else {
      onAddNewHost(hostsToAdd);
    }
  };

  // on Delete host(s)
  const onDeleteHosts = (hostsToDelete: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "host",
      listOfMembers: hostsToDelete,
    };

    onDelete(payload).then((response) => {
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
              "access-this-host-remove-host-external-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          else if (results.error || results.failed.memberhost.host.length > 0) {
            alerts.addAlert(
              "access-this-host-remove-host-external-error",
              "Error: " + results.error,
              "danger"
            );
          }
        }
      }
      setModalSpinning(false);
    });
  };

  // on Add new host group
  const onAddNewHostGroup = (newHostGroups: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "hostgroup",
      listOfMembers: newHostGroups,
    };

    onAdd(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results = data.result
          .results as unknown as AddRemoveHostToSudoRulesResult[];
        results.forEach((result) => {
          const hostGroupsFromResponse =
            result.result.memberhost_hostgroup || [];
          if (containsAny(hostGroupsFromResponse, newHostGroups)) {
            // Set alert: success
            alerts.addAlert(
              "access-this-host-add-hostgroup-external-success",
              "Added new item(s) to '" + props.rule.cn + "'",
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          if (result.error !== null) {
            alerts.addAlert(
              "access-this-host-add-hostgroup-external-error",
              "Error: " + result.error,
              "danger"
            );
          }
        });
      }
      setModalSpinning(false);
    });
  };

  // On save and add host groups
  //  - If 'specify' option is selected (just modified) and new host groups should be added:
  //    save the rule first and then add the host groups
  const onSaveAndAddGroups = (hostGroupsToAdd: string[]) => {
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
            onAddNewHostGroup(hostGroupsToAdd);
          } else if (response.data.error) {
            // Show toast notification: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert("save-error", errorMessage.message, "danger");
          }
        }
      });
    } else {
      onAddNewHostGroup(hostGroupsToAdd);
    }
  };

  // on Delete host group(s)
  const onDeleteHostGroups = (hostGroupsToDelete: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "hostgroup",
      listOfMembers: hostGroupsToDelete,
    };

    onDelete(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const results =
          data.result as unknown as AddRemoveHostToSudoRulesResult;
        if (results) {
          const groupsFromResponse = results.result.memberhost_hostgroup || [];
          if (!containsAny(groupsFromResponse, hostGroupsToDelete)) {
            // Set alert: success
            alerts.addAlert(
              "access-this-host-remove-hostgroup-external-success",
              "Removed item(s) from " + props.rule.cn,
              "success"
            );
            // Refresh page
            props.onRefresh();
          }
          // Check if any errors
          else if (
            results.error ||
            results.failed.memberhost.hostgroup.length > 0
          ) {
            alerts.addAlert(
              "access-this-host-remove-hostgroup-external-error",
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
  // - Default value: "first" (the first element)
  // - Instead of using the name of the buttons, it will be referred
  //   as "first" as per the 'IpaToggleGroup' component
  const [optionSelected, setOptionSelected] = React.useState<string>(
    props.rule.usercategory && props.rule.usercategory === "all"
      ? "Anyone"
      : "Specified Users and Groups"
  );

  // - When 'hostcategory' is "all", disable checkboxes
  const anyoneOptionSelected = optionSelected === "Anyone";

  const options = [
    { label: "Anyone", value: "all" },
    { label: "Specified Users and Groups", value: "" },
  ];

  const filter = (
    <Flex name="hostcategory">
      <FlexItem>Host category the rule applies to: </FlexItem>
      <FlexItem>
        <IpaToggleGroup
          ipaObject={props.ipaObject}
          name="hostcategory"
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
              Hosts <Label isCompact>{hostsList.length}</Label>
            </TabTitleText>
          }
          aria-label="hosts in the who section of the sudo rule"
        >
          <KeytabTableWithFilter
            className="pf-v5-u-ml-md pf-v5-u-mt-sm"
            id={props.rule.cn as string}
            from="sudo rule"
            name="memberhost_host"
            isSpinning={modalSpinning}
            entityType="host"
            // Table data
            operationTitle={"Add host into sudo rule " + props.rule.cn}
            tableEntryList={hostsList}
            columnNames={["Host"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddHosts}
            onDelete={onDeleteHosts}
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
              Host groups <Label isCompact>{hostGroupsList.length}</Label>
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
            entityType="hostgroup"
            // Table data
            operationTitle={"Add host group into sudo rule " + props.rule.cn}
            tableEntryList={hostGroupsList}
            columnNames={["Host group"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddGroups}
            onDelete={onDeleteHostGroups}
            checkboxesDisabled={anyoneOptionSelected}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default AccessThisHost;
