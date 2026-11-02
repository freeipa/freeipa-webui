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
  useAddHostGroupMutation,
} from "../../services/rpcHostGroups";

interface PropsToAddGroup {
  onClose: () => void;
  onRefresh: () => void;
}

const AddHostGroup = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();
  const [executeGroupAddCommand] = useAddHostGroupMutation();

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
      id: "modal-form-hostgroup-name",
      name: "Group name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-hostgroup-name"
          id="modal-form-hostgroup-name"
          name="modal-form-hostgroup-name"
          value={groupName}
          onChange={setGroupName}
          requiredHelperText="Please enter a group name"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-hostgroup-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-hostgroup-description"
          id="modal-form-hostgroup-desc"
          name="modal-form-hostgroup-desc"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          aria-label="Host group description"
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
              name: "add-hostgroup-error",
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
              name: "add-hostgroup-success",
              title: "New host group added",
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
      key="add-new-hostgroup"
      name="add"
      isDisabled={buttonDisabled || addSpinning}
      form="modal-form-add-hostgroup"
      type="submit"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-group"
      variant="link"
      onClick={onClose}
      isDisabled={addSpinning}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-hostgroup-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add host group"
      formId="modal-form-add-hostgroup"
      fields={fields}
      show
      onSubmit={addGroupHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddHostGroup;
