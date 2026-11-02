import React, { useEffect, useState } from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { BatchRPCResponse } from "src/services/rpc";
import { useAddSudoRuleMutation } from "src/services/rpcSudoRules";

interface PropsToAddGroup {
  onClose: () => void;
  onRefresh: () => void;
}

const AddSudoRule = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();
  const [executeRuleAddCommand] = useAddSudoRuleMutation();

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [ruleName, setRuleName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (ruleName === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [ruleName]);

  const fields = [
    {
      id: "modal-form-rule-name",
      name: "Rule name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-rule-name"
          id="modal-form-rule-name"
          name="modal-form-rule-name"
          value={ruleName}
          onChange={setRuleName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-rule-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          id="modal-form-rule-desc"
          name="modal-form-rule-desc"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          data-cy="modal-textbox-description"
          aria-label="Rule description"
          autoResize
        />
      ),
    },
  ];

  const addRuleHandler = () => {
    setAddBtnSpinning(true);
    executeRuleAddCommand([ruleName, description]).then((rule) => {
      if ("data" in rule) {
        const data = rule.data as BatchRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-sudorule-error",
              title:
                "code" in error
                  ? "IPA error " + error.code + ": " + error.name
                  : "An error occurred",
              variant: "danger",
            })
          );
        } else {
          dispatch(
            addAlert({
              name: "add-sudorule-success",
              title: "New sudo rule added",
              variant: "success",
            })
          );
          props.onRefresh();
          props.onClose();
        }
      }
      setAddBtnSpinning(false);
    });
  };

  const onClose = () => {
    if (!addSpinning) {
      props.onClose();
    }
  };

  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-rule"
      name="add"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="add-sudo-rule-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      key="cancel-new-rule"
      variant="link"
      onClick={onClose}
      isDisabled={addSpinning}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-sudo-rule-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add sudo rule"
      formId="add-sudo-rule-modal"
      fields={fields}
      show
      onSubmit={addRuleHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddSudoRule;
