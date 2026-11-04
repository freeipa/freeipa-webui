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
import { useAddSudoCmdGroupsMutation } from "src/services/rpcSudoCmdGroups";

interface PropsToAddGroup {
  onClose: () => void;
  onRefresh: () => void;
}

const AddSudoCmdGroup = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();
  const [executeGroupAddCommand] = useAddSudoCmdGroupsMutation();

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [cmdGroupName, setCmdGroupName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (cmdGroupName === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [cmdGroupName]);

  const fields = [
    {
      id: "modal-form-cmd-grp-name",
      name: "Command group name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-cmd-grp-name"
          id="modal-form-cmd-grp-name"
          name="modal-form-cmd-grp-name"
          value={cmdGroupName}
          onChange={setCmdGroupName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-cmd-grp-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-cmd-grp-desc"
          id="modal-form-cmd-grp-desc"
          name="modal-form-cmd-grp-desc"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          aria-label="Sudo command group description"
          autoResize
        />
      ),
    },
  ];

  const addCmdGroupHandler = () => {
    setAddBtnSpinning(true);
    executeGroupAddCommand([cmdGroupName, description]).then((cmd) => {
      if ("data" in cmd) {
        const data = cmd.data as BatchRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-sudo-cmd-grp-error",
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
              name: "add-sudo-cmd-grp-success",
              title: "New sudo command group added",
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
      key="add-new-cmd"
      name="add"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="add-sudo-cmd-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      key="cancel-new-cmd"
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
      dataCy="add-sudo-cmd-group-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add sudo command group"
      formId="add-sudo-cmd-modal"
      fields={fields}
      show
      onSubmit={addCmdGroupHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddSudoCmdGroup;
