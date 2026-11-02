import React, { MutableRefObject, useEffect, useRef, useState } from "react";
// PatternFly
import {
  Button,
  Spinner,
  Content,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
// Layout
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputWithValidation from "src/components/layouts/InputWithValidation";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Forms
import DropdownSearch from "src/components/layouts/DropdownSearch";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Data types
import { IDViewOverrideGroup } from "src/utils/datatypes/globalDataTypes";
import {
  useGetIDListMutation,
  FindRPCResponse,
  GenericPayload,
} from "src/services/rpc";
import {
  useAddIDOverrideGroupMutation,
  AddGroupPayload,
} from "src/services/rpcIdOverrides";
import { EMPTY_OR_NUMBER_MESSAGE, isEmptyOrNumber } from "src/utils/utils";

interface PropsToAddGroup {
  idview: string;
  groups: IDViewOverrideGroup[];
  onClose: () => void;
  onRefresh: () => void;
}

const AddIDOverrideGroupModal = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();

  const [executeAddCommand] = useAddIDOverrideGroupMutation();
  const [retrieveGroups] = useGetIDListMutation({});

  const [overrideGroup, setOverrideGroup] = useState("");
  const [groupName, setGroupName] = useState("");
  const [gidnumber, setGidNumber] = useState("");
  const [description, setDescription] = useState("");

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [groupNames, setGroupNames] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    retrieveGroups({
      searchValue: "",
      sizeLimit: 200,
      startIdx: 0,
      stopIdx: 199,
      entryType: "group",
    } as GenericPayload).then((result) => {
      if (result && "data" in result) {
        const existing_groups = props.groups.map(
          (group) => group["ipaanchoruuid"][0]
        );
        const groups = (result.data?.list || []).filter(
          (item) => !existing_groups.includes(item)
        );
        setGroupNames(groups);
      } else {
        setGroupNames([]);
      }
      setLoading(false);
    });
  }, [props.groups]);

  const loginRef = useRef() as MutableRefObject<HTMLInputElement>;

  const fields = [
    {
      id: "modal-form-override-group",
      name: "Group to override",
      pfComponent: (
        <DropdownSearch
          dataCy="modal-override-group"
          id="modal-form-override-group"
          options={groupNames}
          onSelect={(value: string) => setOverrideGroup(value)}
          searchType="group"
          value={overrideGroup}
        />
      ),
    },
    {
      id: "modal-form-group-name",
      name: "Group name",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-group-name"
          type="text"
          id="modal-form-group-name"
          name="modal-form-group-name"
          value={groupName}
          onChange={(_event, value: string) => setGroupName(value)}
          ref={loginRef}
        />
      ),
    },
    {
      id: "modal-form-gidnumber",
      name: "GID",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-gidnumber"
          id="modal-form-gidnumber"
          name="modal-form-gidnumber"
          value={gidnumber}
          onChange={setGidNumber}
          rules={[
            {
              id: "ruleGid",
              message: EMPTY_OR_NUMBER_MESSAGE,
              validate: isEmptyOrNumber,
            },
          ]}
        />
      ),
    },
    {
      id: "modal-form-group-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-group-description"
          id="modal-form-group-desc"
          name="modal-form-group-desc"
          value={description}
          onChange={(_event, value: string) => setDescription(value)}
        />
      ),
    },
  ];

  const addHandler = () => {
    setAddBtnSpinning(true);
    const newGroupPayload = {
      idview: props.idview,
      group: overrideGroup,
      groupName: groupName,
      gidnumber,
      description,
    } as AddGroupPayload;

    executeAddCommand(newGroupPayload).then((add) => {
      if ("data" in add) {
        const data = add.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;
        if (error) {
          let title = "";
          if ("code" in error) {
            title = "IPA error " + error.code + ": " + error.name;
          }
          dispatch(
            addAlert({
              name: "add-override-group-error",
              title,
              variant: "danger",
            })
          );
        } else {
          dispatch(
            addAlert({
              name: "add-group-success",
              title: "New override group added",
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

  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (
      overrideGroup === "" ||
      (gidnumber !== "" && isNaN(Number(gidnumber)))
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [overrideGroup, gidnumber]);

  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-group"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="override-group-add-modal"
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

  const loadingGroups = [
    {
      id: "Loading",
      name: "",
      pfComponent: (
        <Content className="pf-v6-u-m-xl">
          <Content component="h3">
            <i>Loading groups</i>
            <Spinner isInline size="xl" className="pf-v6-u-ml-md" />
          </Content>
        </Content>
      ),
    },
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-id-override-group-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add new override group"
      formId="override-group-add-modal"
      fields={loading ? loadingGroups : fields}
      show
      onSubmit={addHandler}
      onClose={onClose}
      actions={modalActions}
      isHorizontal
    />
  );
};

export default AddIDOverrideGroupModal;
