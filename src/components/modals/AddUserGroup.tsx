import React, { useEffect, useState } from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
import InputRequiredText from "../layouts/InputRequiredText";
import InputWithValidation from "../layouts/InputWithValidation";
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
  useAddGroupMutation,
} from "../../services/rpcUserGroups";
import SimpleSelector, { SelectOptionProps } from "../layouts/SimpleSelector";
import { isEmptyOrNumber, EMPTY_OR_NUMBER_MESSAGE } from "src/utils/utils";
interface PropsToAddGroup {
  onClose: () => void;
  onRefresh: () => void;
}

const groupTypeOptions: SelectOptionProps[] = [
  {
    key: "posix",
    value: "posix",
  },
  {
    key: "non-posix",
    value: "non-posix",
  },
  {
    key: "external",
    value: "external",
  },
];

const AddUserGroup = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();
  const [executeGroupAddCommand] = useAddGroupMutation();

  // Set host names list
  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [groupName, setGroupName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [gidNumber, setGID] = React.useState("");
  const [groupType, setGroupType] = React.useState("posix");

  // Add button is disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      groupName === "" ||
      (groupType === "posix" && gidNumber !== "" && isNaN(Number(gidNumber)))
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [gidNumber, groupName]);

  useEffect(() => {
    if (groupType !== "posix") {
      setGID("");
    }
  }, [groupType]);

  // List of fields
  const fields = [
    {
      id: "modal-form-group-name",
      name: "Group name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-group-name"
          id="modal-form-group-name"
          name="modal-form-group-name"
          value={groupName}
          onChange={setGroupName}
          requiredHelperText="Please enter a group name"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-group-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-group-description"
          id="modal-form-group-description"
          name="modal-form-group-description"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          aria-label="Group description"
          autoResize
        />
      ),
    },
    {
      id: "modal-form-group-type",
      name: "Group type",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-group-type"
          id="group-type-selector"
          options={groupTypeOptions}
          selected={groupType}
          onSelectedChange={(selected: string) => setGroupType(selected)}
          ariaLabel="Group type selector"
        />
      ),
    },
    {
      id: "modal-form-group-gid",
      name: "GID",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-group-gid"
          id="modal-form-group-gid"
          name="modal-form-group-gid"
          value={gidNumber}
          onChange={setGID}
          rules={
            groupType === "posix"
              ? [
                  {
                    id: "ruleGid",
                    message: EMPTY_OR_NUMBER_MESSAGE,
                    validate: isEmptyOrNumber,
                  },
                ]
              : []
          }
        />
      ),
    },
  ];

  const addGroupHandler = () => {
    setAddBtnSpinning(true);
    const newGroupPayload = {
      groupName: groupName,
      groupType: groupType,
      gidnumber: gidNumber,
      description: description,
    } as GroupAddPayload;

    executeGroupAddCommand(newGroupPayload).then((group) => {
      if ("data" in group) {
        const data = group.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-group-error",
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
              name: "add-group-success",
              title: "New user group added",
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

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-group"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="add-user-group-modal"
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

  // Render component
  return (
    <ModalWithFormLayout
      dataCy="add-user-group-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add user group"
      formId="add-user-group-modal"
      fields={fields}
      show
      onSubmit={addGroupHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddUserGroup;
