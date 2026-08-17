import React, { useMemo } from "react";
// PatternFly
import { Button, Checkbox, Grid, GridItem } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import SimpleSelector, {
  SelectOptionProps,
} from "src/components/layouts/SimpleSelector";
// RPC
import { useAddPermissionMutation } from "src/services/rpcPermissions";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { Metadata } from "src/utils/datatypes/globalDataTypes";
import TextInputList from "src/components/Form/TextInputList";
import { TypeAheadWithCheckbox } from "src/components/TypeAheadWithCheckbox";
import { useFindGroupsQuery } from "src/services/rpcUserGroups";
import InputWithValidation from "src/components/layouts/InputWithValidation";
import { isValidDn } from "src/utils/utils";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const BIND_RULE_OPTIONS: SelectOptionProps[] = [
  { key: "permission", value: "permission" },
  { key: "all", value: "all" },
  { key: "anonymous", value: "anonymous" },
  { key: "self", value: "self" },
];

// There are records, that have the same name as others
// but shouldn't really be used by the user, remove these.
const FILTERED_OBJECTS: readonly string[] = ["automember_default_group"];

const generateTypes = (metadata: Metadata | undefined) => {
  if (!metadata) {
    return [];
  }

  const objects: SelectOptionProps[] = [];

  objects.push({ key: "", value: "Custom" });
  for (const obj of Object.values(metadata.objects || {})) {
    if (FILTERED_OBJECTS.includes(obj.name)) {
      continue;
    }

    if (obj.can_have_permissions) {
      objects.push({
        key: obj.name,
        value: (obj.label_singular === "Entry"
          ? obj.label
          : obj.label_singular) as string,
      });
    }
  }

  return objects;
};

const generateAttrs = (
  metadata: Metadata | undefined,
  currentObject: string
) => {
  if (!metadata) {
    return [];
  }

  return (
    metadata.objects?.[currentObject]?.aciattrs?.map((attr) => ({
      children: attr,
      value: attr,
      "data-cy": `modal-select-attrs-${attr}`,
    })) || []
  );
};

const generateRights = (metadata: Metadata | undefined) => {
  const rightParam = metadata?.objects?.permission?.takes_params?.find(
    (param) => param.name === "ipapermright"
  );

  return rightParam?.values || [];
};

const AddPermissionModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const metadataQuery = useGetObjectMetadataQuery();
  const groupsQuery = useFindGroupsQuery();
  const [addPermission] = useAddPermissionMutation();

  const types = useMemo(
    () => generateTypes(metadataQuery.data),
    [metadataQuery.data]
  );

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [permissionName, setPermissionName] = React.useState("");
  const [selectedRights, setSelectedRights] = React.useState<string[]>([]);
  const [bindRuleType, setBindRuleType] = React.useState("permission");
  const [type, setType] = React.useState("");
  const [subtree, setSubtree] = React.useState("");
  const [extraTargetFilter, setExtraTargetFilter] = React.useState<string[]>(
    []
  );
  const [memberof, setMemberof] = React.useState<string[]>([]);
  const [ipapermtarget, setIpapermtarget] = React.useState("");
  const [attrs, setAttrs] = React.useState<string[]>([]);

  const hasType = type.trim() !== "";
  const hasTarget =
    hasType ||
    ipapermtarget.trim() !== "" ||
    memberof.length > 0 ||
    extraTargetFilter.length > 0 ||
    attrs.length > 0;

  // Clear fields
  const clearFields = () => {
    setPermissionName("");
    setSelectedRights([]);
    setBindRuleType("permission");
    setType("");
    setSubtree("");
    setExtraTargetFilter([]);
    setMemberof([]);
    setIpapermtarget("");
    setAttrs([]);
  };

  const toggleRight = (right: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRights((prev) => [...prev, right]);
    } else {
      setSelectedRights((prev) => prev.filter((r) => r !== right));
    }
  };

  // 'Add' button handler
  const onAddPermission = () => {
    setIsAddButtonSpinning(true);

    addPermission({
      cn: permissionName,
      ipapermright: selectedRights,
      ipapermbindruletype: bindRuleType,
      type: type.trim() || undefined,
      ipapermlocation: subtree.trim() || undefined,
      extratargetfilter:
        extraTargetFilter.length > 0 ? extraTargetFilter : undefined,
      memberof: memberof.length > 0 ? memberof : undefined,
      ipapermtarget: ipapermtarget.trim() || undefined,
      attrs: attrs.length > 0 ? attrs : undefined,
    }).then((response) => {
      if ("data" in response) {
        const data = response.data?.result;
        const error = response.data?.error as SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-permission-error",
              title: error.message,
              variant: "danger",
            })
          );
        }

        if (data) {
          dispatch(
            addAlert({
              name: "add-permission-success",
              title: "New permission added",
              variant: "success",
            })
          );
          cleanAndCloseModal();
          props.onRefresh();
        }
      }
      // Reset button spinner
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
      id: "modal-form-permission-name",
      name: "Permission name",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-permission-name"
          id="modal-form-permission-name"
          name="modal-form-permission-name"
          value={permissionName}
          onChange={(value: string) => setPermissionName(value)}
          isRequired
          rules={[
            {
              id: "valid-chars",
              message: "May only contain letters, numbers, -, _, ., and space",
              validate: (value: string) => /^[-_ a-zA-Z0-9.]+$/.test(value),
            },
          ]}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-bind-rule-type",
      name: "Bind rule type",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-select-bind-rule-type"
          id="modal-form-bind-rule-type"
          options={BIND_RULE_OPTIONS}
          selected={bindRuleType}
          onSelectedChange={setBindRuleType}
          ariaLabel="Bind rule type"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-granted-rights",
      name: "Granted rights",
      pfComponent: (
        <Grid sm={4}>
          {generateRights(metadataQuery.data).map((right) => (
            <GridItem key={right}>
              <Checkbox
                id={`modal-form-right-${right}`}
                data-cy={`modal-checkbox-right-${right}`}
                label={right}
                name={right}
                isChecked={selectedRights.includes(right)}
                onChange={(_event, checked) => toggleRight(right, checked)}
              />
            </GridItem>
          ))}
        </Grid>
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-type",
      name: "Type",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-select-type"
          id="modal-form-type"
          options={types}
          selected={type}
          onSelectedChange={(newType) => {
            setType(newType);
            setSubtree("");
            setAttrs([]);
          }}
          ariaLabel="Type"
          returnedProperty="key"
        />
      ),
    },
    {
      id: "modal-form-subtree",
      name: "Subtree",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-subtree"
          id="modal-form-subtree"
          name="ipapermlocation"
          value={subtree}
          onChange={(value: string) => setSubtree(value)}
          isDisabled={hasType}
          rules={[
            {
              id: "valid-chars",
              message: "Must be a valid DN, e.g. ou=users,dc=example,dc=com",
              validate: (value: string) => isValidDn(value),
            },
          ]}
        />
      ),
    },
    {
      id: "modal-form-filter",
      name: "Extra target filter",
      pfComponent: (
        <TextInputList
          dataCy="modal-textbox-filter"
          name="extratargetfilter"
          ariaLabel="Extra target filter"
          list={extraTargetFilter}
          setList={setExtraTargetFilter}
        />
      ),
    },
    {
      id: "modal-form-ipapermtarget",
      name: "Target DN",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-ipapermtarget"
          id="modal-form-ipapermtarget"
          name="ipapermtarget"
          value={ipapermtarget}
          onChange={(value: string) => setIpapermtarget(value)}
          rules={[
            {
              id: "valid-chars",
              message: "Must be a valid DN, e.g. ou=users,dc=example,dc=com",
              validate: (value: string) => isValidDn(value),
            },
          ]}
        />
      ),
    },
    {
      id: "modal-form-memberof",
      name: "Member of group",
      pfComponent: (
        <TypeAheadWithCheckbox
          id="modal-form-memberof"
          dataCy="modal-select-memberof"
          options={
            (
              groupsQuery.data?.result.result as unknown as Record<
                string,
                unknown[]
              >[]
            )?.map((group) => ({
              children: group.cn[0] as string,
              value: group.cn[0] as string,
              "data-cy": `modal-select-attrs-${group.cn[0]}`,
            })) || []
          }
          selected={memberof}
          setSelected={setMemberof}
        />
      ),
    },
    {
      id: "modal-form-attrs",
      name: "Attributes",
      pfComponent: (
        <TypeAheadWithCheckbox
          id="modal-form-attrs"
          dataCy="modal-select-attrs"
          options={generateAttrs(metadataQuery.data, type)}
          selected={attrs}
          setSelected={setAttrs}
          creationProps={{
            onChangeTarget: type,
            transformValue: (value) => value.toLowerCase(),
          }}
        />
      ),
    },
  ];

  const isAddDisabled =
    isAddButtonSpinning ||
    permissionName === "" ||
    selectedRights.length === 0 ||
    !hasTarget;

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={isAddDisabled}
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
    <ModalWithFormLayout
      dataCy="add-permission-modal"
      variantType={"medium"}
      modalPosition={"top"}
      offPosition={"76px"}
      title={props.title}
      formId="add-modal-form"
      fields={fields}
      show={props.isOpen}
      onSubmit={() => onAddPermission()}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddPermissionModal;
