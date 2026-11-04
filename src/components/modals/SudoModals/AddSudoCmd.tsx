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
import { useAddSudoCmdMutation } from "src/services/rpcSudoCmds";

interface PropsToAddGroup {
  onClose: () => void;
  onRefresh: () => void;
}

const AddSudoCmd = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();
  const [executeCmdAddCommand] = useAddSudoCmdMutation();

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [cmdName, setCmdName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (cmdName === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [cmdName]);

  const fields = [
    {
      id: "modal-form-cmd-name",
      name: "Command name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-command"
          id="modal-form-cmd-name"
          name="modal-form-cmd-name"
          value={cmdName}
          onChange={setCmdName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-cmd-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          id="modal-form-cmd-desc"
          name="modal-form-cmd-desc"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          data-cy="modal-textbox-description"
          aria-label="Sudo command description"
          autoResize
        />
      ),
    },
  ];

  const addCmdHandler = () => {
    setAddBtnSpinning(true);
    executeCmdAddCommand([cmdName, description]).then((cmd) => {
      if ("data" in cmd) {
        const data = cmd.data as BatchRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-sudo-cmd-error",
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
              name: "add-sudo-cmd-success",
              title: "New sudo command added",
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
      dataCy="add-sudo-cmd-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add sudo command"
      formId="add-sudo-cmd-modal"
      fields={fields}
      show
      onSubmit={addCmdHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddSudoCmd;
