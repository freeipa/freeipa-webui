import React from "react";
// Data types
import { Metadata, SudoRule } from "src/utils/datatypes/globalDataTypes";
// Components
import { TableEntry } from "src/components/tables/KeytabTableWithFilter";
import {
  CategoryToggleSection,
  CategoryTabConfig,
} from "src/components/CategoryToggleSection";
// RPC
import {
  AddRemoveToSudoRulesResult,
  AddRemoveToSudoRulesPayload,
  useAddToSudoRuleMutation,
  useRemoveFromSudoRuleMutation,
  useSaveSudoRuleMutation,
} from "src/services/rpcSudoRules";
// Hooks
import {
  useCategoryMembershipOperations,
  MembershipTabConfig,
} from "src/hooks/useCategoryMembershipOperations";

interface PropsToSudoRulesWho {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  rule: Partial<SudoRule>;
  usersList: TableEntry[];
  userGroupsList: TableEntry[];
  onRefresh: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
  onSave: () => void;
  modifiedValues: () => Partial<SudoRule>;
}

const SudoRulesWho = (props: PropsToSudoRulesWho) => {
  // API mutations
  const [addMutation] = useAddToSudoRuleMutation();
  const [removeMutation] = useRemoveFromSudoRuleMutation();
  const [saveMutation] = useSaveSudoRuleMutation();

  // Define tab configurations for the hook
  const membershipTabs: MembershipTabConfig<
    AddRemoveToSudoRulesResult,
    AddRemoveToSudoRulesResult
  >[] = React.useMemo(
    () => [
      {
        name: "user",
        type: "user",
        addResultExtractor: (result) => ({
          primary: result.result.memberuser_user || [],
          external: result.result.externaluser || [],
        }),
        removeResultExtractor: (result) => ({
          remaining: result.result.memberuser_user || [],
          external: result.result.externaluser || [],
          failed: result.failed?.memberuser?.user || [],
          error: result.error,
        }),
      },
      {
        name: "group",
        type: "group",
        addResultExtractor: (result) => ({
          primary: result.result.memberuser_group || [],
        }),
        removeResultExtractor: (result) => ({
          remaining: result.result.memberuser_group || [],
          failed: result.failed?.memberuser?.group || [],
          error: result.error,
        }),
      },
    ],
    []
  );

  // Use the generic hook for membership operations
  const { isSpinning, onSaveAndAdd, onRemove } =
    useCategoryMembershipOperations<
      AddRemoveToSudoRulesPayload,
      AddRemoveToSudoRulesPayload,
      AddRemoveToSudoRulesResult,
      AddRemoveToSudoRulesResult,
      SudoRule
    >({
      entityId: props.rule.cn as string,
      entityName: "Sudo rule",
      categoryFieldName: "usercategory",
      tabs: membershipTabs,
      addMutation: (payload) => addMutation(payload),
      removeMutation: (payload) => removeMutation(payload),
      saveMutation: (entity) => saveMutation(entity),
      createAddPayload: (type, members) => ({
        toId: props.rule.cn as string,
        type: type as "user" | "group" | "host" | "hostgroup",
        listOfMembers: members,
      }),
      createRemovePayload: (type, members) => ({
        toId: props.rule.cn as string,
        type: type as "user" | "group" | "host" | "hostgroup",
        listOfMembers: members,
      }),
      modifiedValues: props.modifiedValues,
      onRefresh: props.onRefresh,
    });

  // Define tab configurations for the UI component
  const categoryTabs: CategoryTabConfig[] = React.useMemo(
    () => [
      {
        key: 0,
        name: "user",
        label: "Users",
        entityType: "user",
        fieldName: "memberuser_user",
        columnNames: ["User"],
        entries: props.usersList,
        externalOption: true,
      },
      {
        key: 1,
        name: "group",
        label: "User groups",
        entityType: "group",
        fieldName: "memberuser_group",
        columnNames: ["Group"],
        entries: props.userGroupsList,
      },
    ],
    [props.usersList, props.userGroupsList]
  );

  const categoryOptions = [
    { label: "Anyone", value: "all" },
    { label: "Specified Users and Groups", value: "" },
  ];

  return (
    <CategoryToggleSection
      categoryFieldName="usercategory"
      categoryLabel="User category the rule applies to:"
      categoryOptions={categoryOptions}
      categoryValue={props.rule.usercategory || ""}
      ipaObject={props.ipaObject}
      recordOnChange={props.recordOnChange}
      metadata={props.metadata}
      objectName="sudorule"
      dataCy="sudo-rule-toggle-group-user-category"
      tabs={categoryTabs}
      entityId={props.rule.cn as string}
      entityFrom="sudo rule"
      isSpinning={isSpinning}
      onAdd={onSaveAndAdd}
      onDelete={onRemove}
      onRefresh={props.onRefresh}
    />
  );
};

export default SudoRulesWho;
