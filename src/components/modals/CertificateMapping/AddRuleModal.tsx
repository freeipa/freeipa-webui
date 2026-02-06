import React from "react";
// PatternFly
import { Button, TextArea, TextInput } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import TextInputList from "src/components/Form/TextInputList";
import CustomTooltip from "src/components/layouts/CustomTooltip";
// RPC
import {
  CertMapRuleAddPayload,
  useCertMapRuleAddMutation,
} from "src/services/rpcCertMapping";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
// Icons
import { InfoCircleIcon } from "@patternfly/react-icons";
import NumberSelector from "src/components/Form/NumberInput";
import InputRequiredText from "src/components/layouts/InputRequiredText";

interface PropsToAddRuleModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddRuleModal = (props: PropsToAddRuleModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addRule] = useCertMapRuleAddMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [ruleName, setRuleName] = React.useState("");
  const [mappingRule, setMappingRule] = React.useState("");
  const [matchingRule, setMatchingRule] = React.useState("");
  const [domainName, setDomainName] = React.useState<string[]>([]);
  const [priority, setPriority] = React.useState<number | "">(0);
  const [description, setDescription] = React.useState("");

  // Tooltip messages
  // - TODO: Move the strings to a single-source-of-truth file
  const mappingRuleMessage =
    "Rule used to map the certificate with a user entry";

  const matchingRuleMessage =
    "Rule used to check if a certificate can be used for authentication";

  const domainNameMessage = "Domain where the user entry will be searched";

  const priorityMessage =
    "Priority of the rule (higher number means lower priority";

  const clearFields = () => {
    setRuleName("");
    setMappingRule("");
    setMatchingRule("");
    setDomainName([]);
    setPriority(0);
    setDescription("");
  };

  // 'Add' button handler
  const onAddRule = () => {
    setIsAddButtonSpinning(true);

    const payload: CertMapRuleAddPayload = {
      ruleId: ruleName,
      description: description,
      ipacertmapmaprule: mappingRule,
      ipacertmapmatchrule: matchingRule,
      associateddomain: domainName,
      ipacertmappriority: priority || 0,
    };

    addRule(payload).then((response) => {
      if ("data" in response) {
        const data = response.data?.result;
        const error = response.data?.error as SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-cermap-error",
              title: error.message,
              variant: "danger",
            })
          );
        }

        if (data) {
          dispatch(
            addAlert({
              name: "add-certmap-success",
              title: data.summary,
              variant: "success",
            })
          );
          // Reset selected item
          clearFields();
          // Update data
          props.onRefresh();
          props.onClose();
        }
      }
      // Reset button spinners
      setIsAddButtonSpinning(false);
    });
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "rule-name",
      name: "Rule name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-rule-name"
          id="rule-name"
          name="cn"
          value={ruleName}
          onChange={setRuleName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "mapping-rule",
      name: "Mapping rule",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-mapping-rule"
          type="text"
          id="mapping-rule"
          name="ipacertmapmaprule"
          value={mappingRule}
          aria-label="Mapping rule text input"
          onChange={(_event, value: string) => setMappingRule(value)}
        />
      ),
      labelIcon: (
        <CustomTooltip id="mapping-rule-tooltip" message={mappingRuleMessage}>
          <InfoCircleIcon />
        </CustomTooltip>
      ),
    },
    {
      id: "matching-rule",
      name: "Matching rule",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-matching-rule"
          type="text"
          id="matching-rule"
          name="ipacertmapmatchrule"
          value={matchingRule}
          aria-label="Matching rule text input"
          onChange={(_event, value: string) => setMatchingRule(value)}
        />
      ),
      labelIcon: (
        <CustomTooltip id="matching-rule-tooltip" message={matchingRuleMessage}>
          <InfoCircleIcon />
        </CustomTooltip>
      ),
    },
    {
      id: "domain-name",
      name: "Domain name",
      pfComponent: (
        <TextInputList
          dataCy="modal-domain-name"
          name="associateddomain"
          ariaLabel="Domain name text input"
          list={domainName}
          setList={setDomainName}
        />
      ),
      labelIcon: (
        <CustomTooltip id="domain-name-tooltip" message={domainNameMessage}>
          <InfoCircleIcon />
        </CustomTooltip>
      ),
    },
    {
      id: "priority",
      name: "Priority",
      pfComponent: (
        <NumberSelector
          dataCy="modal-number-selector-priority"
          id="priority-number-selector"
          name="priority"
          value={priority}
          setValue={(value: number | "") => setPriority(value)}
          numCharsShown={6}
          maxValue={2147483647}
        />
      ),
      labelIcon: (
        <CustomTooltip id="priority-tooltip" message={priorityMessage}>
          <InfoCircleIcon />
        </CustomTooltip>
      ),
    },
    {
      id: "description",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-description"
          type="text"
          id="description"
          name="description"
          value={description}
          aria-label="Description text input"
          onChange={(_event, value: string) => setDescription(value)}
        />
      ),
    },
  ];

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      variant="secondary"
      isDisabled={isAddButtonSpinning || ruleName === ""}
      form="add-modal-form"
      type="submit"
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="add-rule-modal"
        variantType={"small"}
        modalPosition={"top"}
        offPosition={"76px"}
        title={props.title}
        formId="add-modal-form"
        fields={fields}
        show={props.isOpen}
        onSubmit={() => onAddRule()}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
    </>
  );
};

export default AddRuleModal;
