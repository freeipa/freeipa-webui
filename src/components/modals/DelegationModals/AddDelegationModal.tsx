import React from "react";
import { Button, SelectOptionProps } from "@patternfly/react-core";
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import InputWithValidation from "src/components/layouts/InputWithValidation";
import HelperTextWithIcon from "src/components/layouts/HelperTextWithIcon";
import type { RuleProps } from "src/components/layouts/InputWithValidation";
import { TypeAheadWithCheckbox } from "src/components/TypeAheadWithCheckbox";
import TypeAheadSelectWithCreate from "src/components/TypeAheadSelectWithCreate";
import CheckboxList from "src/components/Form/CheckboxList";
import {
  DelegationAddPayload,
  useAddDelegationMutation,
} from "src/services/rpcDelegations";
import { useFindGroupsQuery } from "src/services/rpcUserGroups";
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import { SerializedError } from "@reduxjs/toolkit";
import { SELF_SERVICE_ATTRS } from "src/utils/datatypes/globalDataTypes";
import { NO_SELECTION_OPTION } from "src/utils/constUtils";

const ATTR_OPTIONS = SELF_SERVICE_ATTRS.map((attr) => ({
  value: attr,
  children: attr,
  "data-cy": `modal-select-attrs-${attr}`,
}));

const PERMISSION_OPTIONS = ["read", "write"];

const NO_SELECTION: SelectOptionProps = {
  value: "",
  children: NO_SELECTION_OPTION,
  "data-cy": "modal-select-group-no-selection",
};

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddDelegationModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();
  const [addDelegation] = useAddDelegationMutation();
  const groupsQuery = useFindGroupsQuery(undefined, { skip: !props.isOpen });

  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [delegationName, setDelegationName] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    string[]
  >([]);
  const [memberof, setMemberof] = React.useState("");
  const [group, setGroup] = React.useState("");
  const [selectedAttrs, setSelectedAttrs] = React.useState<string[]>([]);

  const groupOptions = React.useMemo((): SelectOptionProps[] => {
    const rawResults = groupsQuery.data?.result.result;
    const results = Array.isArray(rawResults)
      ? (rawResults as Array<{ cn?: string | string[] }>)
      : [];

    const options = results.flatMap((entry) => {
      const cn = Array.isArray(entry.cn) ? entry.cn[0] : entry.cn;
      if (typeof cn !== "string" || cn === "") {
        return [];
      }
      return [
        {
          value: cn,
          children: cn,
          "data-cy": `modal-select-group-${cn}`,
        },
      ];
    });

    return [NO_SELECTION, ...options];
  }, [groupsQuery.data]);

  React.useEffect(() => {
    if (props.isOpen && groupsQuery.isError) {
      dispatch(
        addAlert({
          name: "add-delegation-groups-error",
          title: "Unable to load user groups",
          variant: "danger",
        })
      );
    }
  }, [props.isOpen, groupsQuery.isError, dispatch]);

  const ACI_NAME_PATTERN = /^[-_ a-zA-Z0-9]+$/;

  const aciNameRules: RuleProps[] = [
    {
      id: "no-leading-trailing-spaces",
      message: "Must not have leading or trailing spaces",
      validate: (value: string) => value === value.trim(),
    },
    {
      id: "valid-characters",
      message:
        "Only letters, digits, hyphens, underscores, and spaces are allowed",
      validate: (value: string) => ACI_NAME_PATTERN.test(value),
    },
  ];

  const isAciNameValid = (name: string): boolean => {
    if (name === "") return false;
    return aciNameRules.every((rule) => rule.validate(name));
  };

  const clearFields = () => {
    setDelegationName("");
    setSelectedPermissions([]);
    setMemberof("");
    setGroup("");
    setSelectedAttrs([]);
  };

  const onAdd = () => {
    setIsAddButtonSpinning(true);

    const payload: DelegationAddPayload = {
      aciname: delegationName,
      attrs: selectedAttrs,
      memberof,
      group,
    };

    if (selectedPermissions.length > 0) {
      payload.permissions = selectedPermissions;
    }

    addDelegation(payload)
      .then((response) => {
        if ("error" in response && response.error) {
          const error = response.error as SerializedError;

          dispatch(
            addAlert({
              name: "add-delegation-error",
              title: error.message,
              variant: "danger",
            })
          );

          return;
        }

        if ("data" in response) {
          const data = response.data?.result;
          const error = response.data?.error as SerializedError;

          if (error) {
            dispatch(
              addAlert({
                name: "add-delegation-error",
                title: error.message,
                variant: "danger",
              })
            );

            return;
          }

          if (data) {
            dispatch(
              addAlert({
                name: "add-delegation-success",
                title: "New delegation added",
                variant: "success",
              })
            );
            clearFields();
            props.onRefresh();
            props.onClose();
          }
        }
      })
      .finally(() => {
        setIsAddButtonSpinning(false);
      });
  };

  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "modal-form-delegation-name",
      name: "Delegation name",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-delegation-name"
          id="modal-form-delegation-name"
          name="aciname"
          value={delegationName}
          onChange={setDelegationName}
          isRequired={true}
          rules={aciNameRules}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-permissions",
      name: "Permissions",
      pfComponent: (
        <>
          <CheckboxList
            dataCy="modal-checkbox-permissions"
            name="permissions"
            options={PERMISSION_OPTIONS}
            selectedValues={selectedPermissions}
            setSelectedValues={setSelectedPermissions}
          />
          <HelperTextWithIcon
            message="If no permission is selected, it defaults to write."
            type="info"
          />
        </>
      ),
    },
    {
      id: "modal-form-group",
      name: "User group",
      pfComponent: (
        <TypeAheadSelectWithCreate
          id="modal-form-group"
          options={groupOptions}
          selected={group}
          onSelectedChange={setGroup}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-memberof",
      name: "Member user group",
      pfComponent: (
        <TypeAheadSelectWithCreate
          id="modal-form-memberof"
          options={groupOptions}
          selected={memberof}
          onSelectedChange={setMemberof}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-attrs",
      name: "Attributes",
      pfComponent: (
        <TypeAheadWithCheckbox
          id="modal-form-attrs"
          dataCy="modal-select-attrs"
          options={ATTR_OPTIONS}
          selected={selectedAttrs}
          setSelected={setSelectedAttrs}
        />
      ),
      fieldRequired: true,
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={
        isAddButtonSpinning ||
        !isAciNameValid(delegationName) ||
        selectedAttrs.length === 0 ||
        memberof.length === 0 ||
        group.length === 0
      }
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
      dataCy="add-delegation-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title={props.title}
      formId="add-modal-form"
      fields={fields}
      show={props.isOpen}
      onSubmit={() => onAdd()}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddDelegationModal;
