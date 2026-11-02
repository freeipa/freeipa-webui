import React, { useEffect, useState } from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
import InputRequiredText from "../layouts/InputRequiredText";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { FindRPCResponse } from "../../services/rpc";
import {
  GroupAddPayload,
  useAddNetgroupMutation,
} from "../../services/rpcNetgroups";

interface PropsToAddGroup {
  onClose: () => void;
  onRefresh: () => void;
}

const AddNetgroup = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();
  const [executeGroupAddCommand] = useAddNetgroupMutation();

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [groupName, setGroupName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (groupName === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [groupName]);

  const fields = [
    {
      id: "modal-form-netgroup-name",
      name: "Netgroup name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-netgroup-name"
          id="modal-form-netgroup-name"
          name="modal-form-netgroup-name"
          value={groupName}
          onChange={setGroupName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-netgroup-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-netgroup-description"
          id="modal-form-netgroup-desc"
          name="modal-form-netgroup-desc"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          aria-label="Netgroup description"
          autoResize
        />
      ),
    },
  ];

  const addGroupHandler = () => {
    setAddBtnSpinning(true);

    const newGroupPayload = {
      groupName: groupName,
      description: description,
    } as GroupAddPayload;

    executeGroupAddCommand(newGroupPayload).then((group) => {
      if ("data" in group) {
        const data = group.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-netgroup-error",
              title:
                "code" in error
                  ? "IPA error " + error.code + ": " + error.name
                  : "Error",
              variant: "danger",
            })
          );
        } else {
          dispatch(
            addAlert({
              name: "add-netgroup-success",
              title: "New netgroup added",
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
      key="add-new-netgroup"
      name="add"
      isDisabled={buttonDisabled || addSpinning}
      form="add-netgroup-modal"
      type="submit"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-netgroup"
      variant="link"
      onClick={onClose}
      isDisabled={addSpinning}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-netgroup-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add netgroup"
      formId="add-netgroup-modal"
      fields={fields}
      show
      onSubmit={addGroupHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddNetgroup;
