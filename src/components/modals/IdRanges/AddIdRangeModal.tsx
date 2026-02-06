import React from "react";
// PatternFly
import {
  Button,
  MenuToggle,
  MenuToggleElement,
  Radio,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
// Redux
import { addAlert } from "src/store/Global/alerts-slice";
import { useAppDispatch } from "src/store/hooks";
// RPC
import {
  AddIdRangePayload,
  useAddIdRangeMutation,
} from "src/services/rpcIdRanges";
// Types
import { SerializedError } from "@reduxjs/toolkit";
import InputRequiredText from "src/components/layouts/InputRequiredText";
import NumberSelector from "src/components/Form/NumberInput";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

type RangeType = "ipa-local" | "ipa-ad-trust" | "ipa-ad-trust-posix";

const autoPrivateGroupsOptions = [
  { value: "true", label: "true" },
  { value: "false", label: "false" },
  { value: "hybrid", label: "hybrid" },
];

// Fields will follow the shared ModalWithFormLayout.Field shape

const AddIdRangeModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API
  const [addIdRange] = useAddIdRangeMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);

  // Form fields
  const [cn, setCn] = React.useState("");
  const [rangeType, setRangeType] = React.useState<RangeType>("ipa-local");
  const [ipabaseid, setIpabaseid] = React.useState<number | "">("");
  const [ipaidrangesize, setIpaidrangesize] = React.useState<number | "">("");
  const [ipabaserid, setIpabaserid] = React.useState<number | "">("");
  const [ipasecondarybaserid, setIpasecondarybaserid] = React.useState<
    number | ""
  >("");
  const [ipanttrusteddomainname, setIpanttrusteddomainname] =
    React.useState("");
  const [ipaautoprivategroups, setIpaautoprivategroups] =
    React.useState("true");

  const [isAutoPrivOpen, setIsAutoPrivOpen] = React.useState(false);

  const isRangeTypeLocal = rangeType === "ipa-local";
  const isRangeTypeAD = rangeType === "ipa-ad-trust";
  const isRangeTypeADPosix = rangeType === "ipa-ad-trust-posix";

  const updateRangeType = (newType: RangeType) => {
    setRangeType(newType);
    if (newType === "ipa-local") {
      if (ipanttrusteddomainname !== "") setIpanttrusteddomainname("");
      if (ipaautoprivategroups !== "") setIpaautoprivategroups("");
    } else if (newType === "ipa-ad-trust") {
      if (ipasecondarybaserid !== "") setIpasecondarybaserid("");
    } else if (newType === "ipa-ad-trust-posix") {
      if (ipabaserid !== "") setIpabaserid("");
      if (ipasecondarybaserid !== "") setIpasecondarybaserid("");
    }
  };

  const clearFields = () => {
    setCn("");
    setRangeType("ipa-local");
    setIpabaseid("");
    setIpaidrangesize("");
    setIpabaserid("");
    setIpasecondarybaserid("");
    setIpanttrusteddomainname("");
    setIpaautoprivategroups("true");
  };

  // Derived validation state
  const mandatoryEmpty =
    cn === "" ||
    ipabaseid === "" ||
    ipaidrangesize === "" ||
    (isRangeTypeLocal && (ipabaserid === "" || ipasecondarybaserid === "")) ||
    (isRangeTypeAD && (ipabaserid === "" || ipanttrusteddomainname === "")) ||
    (isRangeTypeADPosix && ipanttrusteddomainname === "");

  const disabledAdd = isAddButtonSpinning || mandatoryEmpty;

  const onAdd = () => {
    setIsAddButtonSpinning(true);

    const ipabaseidStr = ipabaseid === "" ? "" : String(ipabaseid);
    const ipaidrangesizeStr =
      ipaidrangesize === "" ? "" : String(ipaidrangesize);
    const ipabaseridStr =
      isRangeTypeLocal || isRangeTypeAD
        ? ipabaserid === ""
          ? ""
          : String(ipabaserid)
        : undefined;
    const ipasecondarybaseridStr = isRangeTypeLocal
      ? ipasecondarybaserid === ""
        ? ""
        : String(ipasecondarybaserid)
      : undefined;

    const newIdRangePayload: AddIdRangePayload = {
      cn,
      ipabaseid: ipabaseidStr,
      ipaidrangesize: ipaidrangesizeStr,
      ipanttrusteddomainname:
        isRangeTypeAD || isRangeTypeADPosix
          ? ipanttrusteddomainname
          : undefined,
      ipabaserid: ipabaseridStr,
      ipasecondarybaserid: ipasecondarybaseridStr,
      ipaautoprivategroups,
      iparangetype: rangeType,
    };

    addIdRange(newIdRangePayload)
      .then((result) => {
        if ("data" in result) {
          const data = result.data?.result;
          const error = result.data?.error as SerializedError;

          if (error) {
            dispatch(
              addAlert({
                name: "add-idrange-error",
                title: error.message,
                variant: "danger",
              })
            );
          }

          if (data) {
            dispatch(
              addAlert({
                name: "add-idrange-success",
                title: "ID range successfully added",
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

  const cleanAndClose = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "range-name",
      name: "Range name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-range-name"
          id="range-name"
          name="cn"
          value={cn}
          onChange={setCn}
          requiredHelperText="Please enter a range name"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "range-type",
      name: "Range type",
      pfComponent: (
        <>
          <Radio
            data-cy="local-domain-radio"
            isChecked={rangeType === "ipa-local"}
            name="range-type"
            onChange={() => updateRangeType("ipa-local")}
            label="Local domain"
            id="range-type-local"
          />
          <Radio
            data-cy="ad-domain-radio"
            isChecked={rangeType === "ipa-ad-trust"}
            name="range-type"
            onChange={() => updateRangeType("ipa-ad-trust")}
            label="Active Directory domain"
            id="range-type-ad"
          />
          <Radio
            data-cy="range-type-radio"
            isChecked={rangeType === "ipa-ad-trust-posix"}
            name="range-type"
            onChange={() => updateRangeType("ipa-ad-trust-posix")}
            label="Active Directory domain with POSIX attributes"
            id="range-type-ad-posix"
          />
        </>
      ),
    },
    {
      id: "base-id",
      name: "Base ID",
      pfComponent: (
        <NumberSelector
          dataCy="modal-textbox-base-id"
          aria-label="Base ID"
          id="base-id"
          name="ipabaseid"
          value={ipabaseid}
          setValue={setIpabaseid}
          minValue={1}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "range-size",
      name: "Range size",
      pfComponent: (
        <NumberSelector
          dataCy="modal-textbox-range-size"
          aria-label="Range size"
          id="range-size"
          name="ipaidrangesize"
          value={ipaidrangesize}
          setValue={setIpaidrangesize}
          minValue={1}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "primary-rid-base",
      name: "Primary RID base",
      pfComponent: (
        <NumberSelector
          dataCy="modal-textbox-primary-rid-base"
          aria-label="Primary RID base"
          id="primary-rid-base"
          name="ipabaserid"
          value={ipabaserid}
          setValue={setIpabaserid}
          isDisabled={isRangeTypeADPosix}
          minValue={0}
        />
      ),
      fieldRequired: !isRangeTypeADPosix,
    },
    {
      id: "secondary-rid-base",
      name: "Secondary RID base",
      pfComponent: (
        <NumberSelector
          dataCy="modal-textbox-secondary-rid-base"
          id="secondary-rid-base"
          name="ipasecondarybaserid"
          value={ipasecondarybaserid}
          setValue={setIpasecondarybaserid}
          aria-label="Secondary RID base"
          isDisabled={isRangeTypeAD || isRangeTypeADPosix}
          minValue={0}
        />
      ),
      fieldRequired: !isRangeTypeAD && !isRangeTypeADPosix,
    },
    {
      id: "trusted-domain",
      name: "Name of the trusted domain",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-trusted-domain"
          id="trusted-domain"
          name="ipanttrusteddomainname"
          value={ipanttrusteddomainname}
          onChange={setIpanttrusteddomainname}
          isDisabled={isRangeTypeLocal}
          requiredHelperText="Please enter the name of the trusted domain"
        />
      ),
      fieldRequired: !isRangeTypeLocal,
    },
    {
      id: "auto-private-groups",
      name: "Auto private groups",
      pfComponent: (
        <Select
          aria-label="Auto private groups"
          data-cy="modal-select-auto-private-groups"
          isOpen={isAutoPrivOpen}
          onOpenChange={(isOpen) => setIsAutoPrivOpen(isOpen)}
          selected={ipaautoprivategroups}
          onSelect={(_, val) => {
            setIpaautoprivategroups(String(val));
            setIsAutoPrivOpen(false);
          }}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsAutoPrivOpen(!isAutoPrivOpen)}
              isExpanded={isAutoPrivOpen}
              className="pf-v6-u-w-100"
              data-cy="modal-select-auto-private-groups-toggle"
              isDisabled={isRangeTypeLocal}
            >
              {ipaautoprivategroups}
            </MenuToggle>
          )}
        >
          <SelectList>
            {autoPrivateGroupsOptions.map((option) => (
              <SelectOption
                data-cy={"modal-select-auto-private-groups-" + option.value}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      ),
    },
  ];

  // Modal action buttons
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      name="add"
      isDisabled={disabledAdd || isAddButtonSpinning}
      onClick={() => onAdd()}
      form="add-id-range-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={isAddButtonSpinning}
    >
      {isAddButtonSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new"
      variant="link"
      onClick={cleanAndClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-id-range-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title={props.title}
      formId="add-id-range-modal"
      fields={fields}
      show={props.isOpen}
      onClose={cleanAndClose}
      actions={modalActions}
    />
  );
};

export default AddIdRangeModal;
