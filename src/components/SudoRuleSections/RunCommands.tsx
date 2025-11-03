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
import { BatchResponse, ErrorResult, FindRPCResponse } from "src/services/rpc";
import {
  AddRemoveCommandToSudoRulesResult,
  AddRemoveToSudoRulesPayload,
  useAddAllowCommandToSudoRuleMutation,
  useAddDenyCommandToSudoRuleMutation,
  useRemoveAllowCommandFromSudoRuleMutation,
  useRemoveDenyCommandFromSudoRuleMutation,
  useSaveSudoRuleMutation,
} from "src/services/rpcSudoRules";
// Utils
import { containsAny } from "src/utils/utils";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import TitleLayout from "../layouts/TitleLayout";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToRunCommands {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  rule: Partial<SudoRule>;
  allowCommandsList: TableEntry[]; // memberallowcmd_sudocmd
  allowCommandGroupsList: TableEntry[]; // memberallowcmd_sudocmdgroup
  denyCommandsList: TableEntry[]; // memberdenycmd_sudocmd
  denyCommandGroupsList: TableEntry[]; // memberdenycmd_sudocmdgroup
  onRefresh: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
  // setIsAnyoneSelected: (value: boolean) => void;
  onSave: () => void;
  modifiedValues: () => Partial<SudoRule>;
}

const RunCommands = (props: PropsToRunCommands) => {
  const dispatch = useAppDispatch();
  const [activeAllowTabKey, setActiveAllowTabKey] = React.useState<
    string | number
  >(0);
  const [activeDenyTabKey, setActiveDenyTabKey] = React.useState<
    string | number
  >(2);

  const handleAllowTabClick = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveAllowTabKey(tabIndex);
  };

  const handleDenyTabClick = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveDenyTabKey(tabIndex);
  };

  // API calls
  const [addAllowCommand] = useAddAllowCommandToSudoRuleMutation();
  const [removeAllowCommand] = useRemoveAllowCommandFromSudoRuleMutation();
  const [addDenyCommand] = useAddDenyCommandToSudoRuleMutation();
  const [removeDenyCommand] = useRemoveDenyCommandFromSudoRuleMutation();
  const [onSave] = useSaveSudoRuleMutation();

  // States
  const [modalSpinning, setModalSpinning] = React.useState(false);
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
    setAllowCommandsList(props.allowCommandsList);
  }, [props.allowCommandsList]);

  React.useEffect(() => {
    setAllowCommandGroupsList(props.allowCommandGroupsList);
  }, [props.allowCommandGroupsList]);

  React.useEffect(() => {
    setDenyCommandsList(props.denyCommandsList);
  }, [props.denyCommandsList]);

  React.useEffect(() => {
    setDenyCommandGroupsList(props.denyCommandGroupsList);
  }, [props.denyCommandGroupsList]);

  const onAddResponseHandle = (
    response:
      | {
          data: BatchResponse;
        }
      | {
          error: FetchBaseQueryError | SerializedError;
        },
    id: string,
    cmdType:
      | "allowsudocmd"
      | "denysudocmd"
      | "allowsudocmdgroup"
      | "denysudocmdgroup",
    commandList: string[]
  ) => {
    if ("data" in response) {
      const data = response.data;
      const results = data.result
        .results as unknown as AddRemoveCommandToSudoRulesResult[];
      results.forEach((result) => {
        // Check if any errors
        if (result.error !== null) {
          dispatch(
            addAlert({
              name: id + "-error",
              title: "Error: " + result.error,
              variant: "danger",
            })
          );
        } else {
          // Infer the type of the result
          // Some values can be undefined after addition
          let cmdsFromResponse: string[] = [];
          if (cmdType === "allowsudocmd") {
            cmdsFromResponse = result.result.memberallowcmd_sudocmd || [];
          } else if (cmdType === "allowsudocmdgroup") {
            cmdsFromResponse = result.result.memberallowcmd_sudocmdgroup || [];
          } else if (cmdType === "denysudocmd") {
            cmdsFromResponse = result.result.memberdenycmd_sudocmd || [];
          } else {
            cmdsFromResponse = result.result.memberdenycmd_sudocmdgroup || [];
          }

          if (containsAny(cmdsFromResponse, commandList)) {
            // Set alert: success
            dispatch(
              addAlert({
                name: id + "-success",
                title: "Added new item(s) to '" + props.rule.cn + "'",
                variant: "success",
              })
            );
            // Refresh page
            props.onRefresh();
          }
        }
      });
    } else {
      // Assume error
      dispatch(
        addAlert({
          name: id + "-error",
          title:
            "Error: " + (response.error ? response.error : "Unknown error"),
          variant: "danger",
        })
      );
    }
    setModalSpinning(false);
  };

  const onRemoveResponseHandle = (
    response:
      | {
          data: FindRPCResponse;
        }
      | {
          error: FetchBaseQueryError | SerializedError;
        },
    id: string,
    cmdType:
      | "allowsudocmd"
      | "denysudocmd"
      | "allowsudocmdgroup"
      | "denysudocmdgroup",
    cmdListToRemove: string[]
  ) => {
    if ("data" in response) {
      const data = response.data;
      const result =
        data.result as unknown as AddRemoveCommandToSudoRulesResult;
      if (result) {
        // Infer the type of the result
        // Some values can be undefined after addition
        let cmdsFromResponse: string[] = [];
        if (cmdType === "allowsudocmd") {
          cmdsFromResponse = result.result.memberallowcmd_sudocmd || [];
        } else if (cmdType === "allowsudocmdgroup") {
          cmdsFromResponse = result.result.memberallowcmd_sudocmdgroup || [];
        } else if (cmdType === "denysudocmd") {
          cmdsFromResponse = result.result.memberdenycmd_sudocmd || [];
        } else if (cmdType === "denysudocmdgroup") {
          cmdsFromResponse = result.result.memberdenycmd_sudocmdgroup || [];
        }

        if (!containsAny(cmdsFromResponse, cmdListToRemove)) {
          // Set alert: success
          dispatch(
            addAlert({
              name: id + "-success",
              title: "Removed item(s) from " + props.rule.cn,
              variant: "success",
            })
          );
          // Refresh page
          props.onRefresh();
        }
        // Check if any errors
        else if (
          result.error ||
          result.failed.memberallowcmd.sudocmd.length > 0 ||
          result.failed.memberallowcmd.sudocmdgroup.length > 0 ||
          result.failed.memberdenycmd.sudocmd.length > 0 ||
          result.failed.memberdenycmd.sudocmdgroup.length > 0
        ) {
          dispatch(
            addAlert({
              name: id + "-error",
              title: "Error: " + result.error,
              variant: "danger",
            })
          );
        }
      }
    }
    setModalSpinning(false);
  };

  // Allow commands - Operations
  const onAddNewAllowCommand = (newCommands: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "sudocmd",
      listOfMembers: newCommands,
    };

    addAllowCommand(payload).then((response) => {
      onAddResponseHandle(
        response,
        "add-allow-command",
        "allowsudocmd",
        newCommands
      );
    });
  };

  const onDeleteFromAllowCommand = (commandsToDelete: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "sudocmd",
      listOfMembers: commandsToDelete,
    };

    removeAllowCommand(payload).then((response) => {
      onRemoveResponseHandle(
        response,
        "remove-allow-command",
        "allowsudocmd",
        commandsToDelete
      );
    });
  };

  // On save and add commands
  //  - If 'specify' option is selected (just modified) and new users should be added:
  //    save the rule first and then add the commands
  const onSaveAndAddAllowCommands = (commandsToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.cmdcategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Show toast notification: success
            dispatch(
              addAlert({
                name: "save-success",
                title: "Sudo rule modified",
                variant: "success",
              })
            );
            props.onRefresh();
            // Add new users
            onAddNewAllowCommand(commandsToAdd);
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
        }
      });
    } else {
      onAddNewAllowCommand(commandsToAdd);
    }
  };

  // Allow command groups - Operations
  const onAddNewAllowCommandGroup = (newCmdGroups: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "sudocmdgroup",
      listOfMembers: newCmdGroups,
    };

    addAllowCommand(payload).then((response) => {
      onAddResponseHandle(
        response,
        "add-allow-command",
        "allowsudocmdgroup",
        newCmdGroups
      );
    });
  };

  const onDeleteFromAllowCommandGroup = (cmdGroupsToDelete: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "sudocmdgroup",
      listOfMembers: cmdGroupsToDelete,
    };

    removeAllowCommand(payload).then((response) => {
      onRemoveResponseHandle(
        response,
        "remove-allow-command",
        "allowsudocmdgroup",
        cmdGroupsToDelete
      );
    });
  };

  const onSaveAndAddAllowCommandGroups = (cmdGroupsToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.cmdcategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Show toast notification: success
            dispatch(
              addAlert({
                name: "save-success",
                title: "Sudo rule modified",
                variant: "success",
              })
            );
            props.onRefresh();
            // Add new users
            onAddNewAllowCommandGroup(cmdGroupsToAdd);
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
        }
      });
    } else {
      onAddNewAllowCommandGroup(cmdGroupsToAdd);
    }
  };

  // Deny commands - Operations
  const onAddNewDenyCommand = (commandsToAdd: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "sudocmd",
      listOfMembers: commandsToAdd,
    };

    addDenyCommand(payload).then((response) => {
      onAddResponseHandle(
        response,
        "add-deny-command",
        "denysudocmd",
        commandsToAdd
      );
    });
  };

  const onDeleteFromDenyCommand = (commandsToDelete: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "sudocmd",
      listOfMembers: commandsToDelete,
    };

    removeDenyCommand(payload).then((response) => {
      onRemoveResponseHandle(
        response,
        "remove-deny-command",
        "denysudocmd",
        commandsToDelete
      );
    });
  };

  const onSaveAndAddDenyCommands = (commandsToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.cmdcategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Show toast notification: success
            dispatch(
              addAlert({
                name: "save-success",
                title: "Sudo rule modified",
                variant: "success",
              })
            );
            props.onRefresh();
            // Add new users
            onAddNewDenyCommand(commandsToAdd);
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
        }
      });
    } else {
      onAddNewDenyCommand(commandsToAdd);
    }
  };

  // Deny command groups - Operations
  const onAddNewDenyCommandGroup = (cmsGroupsToAdd: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "sudocmdgroup",
      listOfMembers: cmsGroupsToAdd,
    };

    addDenyCommand(payload).then((response) => {
      onAddResponseHandle(
        response,
        "add-deny-command-group",
        "denysudocmdgroup",
        cmsGroupsToAdd
      );
    });
  };

  const onDeleteFromDenyCommandGroup = (cmdGroupsToDelete: string[]) => {
    setModalSpinning(true);
    const payload: AddRemoveToSudoRulesPayload = {
      toId: props.rule.cn as string,
      type: "sudocmdgroup",
      listOfMembers: cmdGroupsToDelete,
    };

    removeDenyCommand(payload).then((response) => {
      onRemoveResponseHandle(
        response,
        "remove-deny-command",
        "denysudocmdgroup",
        cmdGroupsToDelete
      );
    });
  };

  const onSaveAndAddDenyCommandGroups = (cmdGroupsToAdd: string[]) => {
    const modifiedValues = props.modifiedValues();
    if (modifiedValues.cmdcategory === "") {
      modifiedValues.cn = props.rule.cn;

      onSave(modifiedValues).then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Show toast notification: success
            dispatch(
              addAlert({
                name: "save-success",
                title: "Sudo rule modified",
                variant: "success",
              })
            );
            props.onRefresh();
            // Add new users
            onAddNewDenyCommandGroup(cmdGroupsToAdd);
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
        }
      });
    } else {
      onAddNewDenyCommandGroup(cmdGroupsToAdd);
    }
  };

  // Filter: toggle options
  // - Default value: "Any command"
  const [optionSelected, setOptionSelected] = React.useState<string>(
    props.rule.cmdcategory && props.rule.cmdcategory === "all"
      ? "Any command"
      : "Specified Commands and Groups"
  );

  // - When 'cmdcategory' is "all", disable checkboxes
  const anyoneOptionSelected = optionSelected === "Any command";

  const options = [
    { label: "Any command", value: "all" },
    { label: "Specified Commands and Groups", value: "" },
  ];

  const filter = (
    <Flex name="cmdcategory">
      <FlexItem>Command category the rule applies to: </FlexItem>
      <FlexItem>
        <IpaToggleGroup
          dataCy="sudo-rule-toggle-group-cmd-category"
          ipaObject={props.ipaObject}
          name="cmdcategory"
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
      {/* Filter: toggle group */}
      {filter}
      {/* Tabs - Allow Commands */}
      <TitleLayout
        headingLevel="h4"
        id="allow"
        text="Allow"
        className="pf-v6-u-mt-md pf-v6-u-ml-md"
      />
      <Tabs
        activeKey={activeAllowTabKey}
        onSelect={handleAllowTabClick}
        aria-label="Tabs for all the allow commands types"
      >
        <Tab
          key={0}
          eventKey={0}
          title={
            <TabTitleText>
              Sudo Allow Commands{" "}
              <Label isCompact>{allowCommandsList.length}</Label>
            </TabTitleText>
          }
          aria-label="sudo allow commands in the Run commands section of the sudo rule settings page"
        >
          <KeytabTableWithFilter
            className="pf-v6-u-ml-md pf-v6-u-mt-sm"
            id={props.rule.cn as string}
            extraId="allow"
            from="sudo rule"
            name="memberallowcmd_sudocmd"
            isSpinning={modalSpinning}
            entityType="sudocmd"
            // Table data
            operationTitle={
              "Add allow sudo commands into sudo rule '" + props.rule.cn + "'"
            }
            tableEntryList={allowCommandsList}
            columnNames={["Sudo Allow Commands"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddAllowCommands}
            onDelete={onDeleteFromAllowCommand}
            checkboxesDisabled={anyoneOptionSelected}
          />
        </Tab>
        <Tab
          key={1}
          eventKey={1}
          title={
            <TabTitleText>
              Sudo Allow Command Groups{" "}
              <Label isCompact>{allowCommandGroupsList.length}</Label>
            </TabTitleText>
          }
          aria-label="sudo allow commands groups in the Run commands section of the sudo rule settings page"
        >
          <KeytabTableWithFilter
            className="pf-v6-u-ml-md pf-v6-u-mt-sm"
            id={props.rule.cn as string}
            extraId="allow"
            from="sudo rule"
            name="memberallowcmd_sudocmdgroup"
            isSpinning={modalSpinning}
            entityType="sudocmdgroup"
            // Table data
            operationTitle={
              "Add allow sudo command groups into sudo rule '" +
              props.rule.cn +
              "'"
            }
            tableEntryList={allowCommandGroupsList}
            columnNames={["Sudo Allow Command Groups"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddAllowCommandGroups}
            onDelete={onDeleteFromAllowCommandGroup}
            checkboxesDisabled={anyoneOptionSelected}
          />
        </Tab>
      </Tabs>
      {/* Tabs - Deny Command groups */}
      <TitleLayout
        headingLevel="h4"
        id="deny"
        text="Deny"
        className="pf-v6-u-mt-md pf-v6-u-ml-md"
      />
      <Tabs
        activeKey={activeDenyTabKey}
        onSelect={handleDenyTabClick}
        aria-label="Tabs for all the allow commands types"
      >
        <Tab
          key={2}
          eventKey={2}
          title={
            <TabTitleText>
              Sudo Deny Commands{" "}
              <Label isCompact>{denyCommandsList.length}</Label>
            </TabTitleText>
          }
          aria-label="sudo deny commands in the Run commands section of the sudo rule settings page"
        >
          <KeytabTableWithFilter
            className="pf-v6-u-ml-md pf-v6-u-mt-sm"
            id={props.rule.cn as string}
            extraId="deny"
            from="sudo rule"
            name="memberdenycmd_sudocmd"
            isSpinning={modalSpinning}
            entityType="sudocmd"
            // Table data
            operationTitle={
              "Add deny sudo commands into sudo rule '" + props.rule.cn + "'"
            }
            tableEntryList={denyCommandsList}
            columnNames={["Sudo Deny Commands"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddDenyCommands}
            onDelete={onDeleteFromDenyCommand}
            checkboxesDisabled={anyoneOptionSelected}
          />
        </Tab>
        <Tab
          key={3}
          eventKey={3}
          title={
            <TabTitleText>
              Sudo Deny Command Groups{" "}
              <Label isCompact>{denyCommandGroupsList.length}</Label>
            </TabTitleText>
          }
          aria-label="sudo deny commands groups in the Run commands section of the sudo rule settings page"
        >
          <KeytabTableWithFilter
            className="pf-v6-u-ml-md pf-v6-u-mt-sm"
            id={props.rule.cn as string}
            extraId="deny"
            from="sudo rule"
            name="memberdenycmd_sudocmdgroup"
            isSpinning={modalSpinning}
            entityType="sudocmdgroup"
            // Table data
            operationTitle={
              "Add deny sudo command groups into sudo rule '" +
              props.rule.cn +
              "'"
            }
            tableEntryList={denyCommandGroupsList}
            columnNames={["Sudo Deny Command Groups"]}
            onRefresh={props.onRefresh}
            onAdd={onSaveAndAddDenyCommandGroups}
            onDelete={onDeleteFromDenyCommandGroup}
            checkboxesDisabled={anyoneOptionSelected}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default RunCommands;
