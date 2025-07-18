/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormGroup,
  TextInput,
  TextArea,
  Checkbox,
  Select,
  SelectOption,
  MenuToggle,
  Flex,
  FlexItem,
  Radio,
  MenuToggleElement,
} from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";
import React from "react";
import CustomTooltip from "src/components/layouts/CustomTooltip";
import NumberSelector from "src/components/Form/NumberInput";

// Generic field types
export interface BaseField {
  name: string;
  label: string;
  isRequired?: boolean;
  tooltip?: string;
}

export interface TextInputField extends BaseField {
  type: "text";
  placeholder?: string;
}

export interface NumberInputField extends BaseField {
  type: "number";
  minValue?: number;
  maxValue?: number;
  numCharsShown?: number;
  defaultValue?: number;
}

export interface TextAreaField extends BaseField {
  type: "textarea";
  rows?: number;
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
  defaultValue?: boolean;
}

export interface SelectField extends BaseField {
  type: "select";
  options: Array<{ key: string; value: string }>;
  defaultValue?: string;
}

export interface RadioGroupField extends BaseField {
  type: "radio";
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
}

export type FieldConfig =
  | TextInputField
  | NumberInputField
  | TextAreaField
  | CheckboxField
  | SelectField
  | RadioGroupField;

// Generic Field Components
export interface GenericFieldProps {
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  selectStates?: {
    [key: string]: { isOpen: boolean; setIsOpen: (open: boolean) => void };
  };
}

export const GenericField = ({
  field,
  value,
  onChange,
  selectStates,
}: GenericFieldProps) => {
  const fieldId = field.name.replace(/_/g, "-");
  const ariaLabel = `${field.label} ${field.type === "textarea" ? "text area" : field.type === "number" ? "number input" : "text input"}`;

  const labelIcon = field.tooltip ? (
    <CustomTooltip id={`${fieldId}-tooltip`} message={field.tooltip}>
      <InfoCircleIcon />
    </CustomTooltip>
  ) : undefined;

  switch (field.type) {
    case "text":
      return (
        <FormGroup
          label={field.label}
          isRequired={field.isRequired}
          labelIcon={labelIcon}
        >
          <TextInput
            value={value || ""}
            id={fieldId}
            name={field.name}
            onChange={(_event, val: string) => onChange(val)}
            aria-label={ariaLabel}
            placeholder={field.placeholder}
          />
        </FormGroup>
      );

    case "number":
      return (
        <FormGroup
          label={field.label}
          isRequired={field.isRequired}
          labelIcon={labelIcon}
        >
          <NumberSelector
            id={fieldId}
            value={value ?? field.defaultValue ?? 0}
            name={field.name}
            setValue={(val: number | "") => onChange(Number(val) || 0)}
            aria-label={ariaLabel}
            minValue={field.minValue}
            maxValue={field.maxValue}
            numCharsShown={field.numCharsShown}
          />
        </FormGroup>
      );

    case "textarea":
      return (
        <FormGroup
          label={field.label}
          isRequired={field.isRequired}
          labelIcon={labelIcon}
        >
          <TextArea
            value={value || ""}
            id={fieldId}
            name={field.name}
            onChange={(_event, val: string) => onChange(val)}
            aria-label={ariaLabel}
            rows={field.rows || 4}
          />
        </FormGroup>
      );

    case "checkbox":
      return (
        <FormGroup label={field.label} labelIcon={labelIcon}>
          <Checkbox
            id={fieldId}
            name={field.name}
            isChecked={value ?? field.defaultValue ?? false}
            onChange={(_event, val: boolean) => onChange(val)}
            aria-label={`${field.label} checkbox`}
          />
        </FormGroup>
      );

    case "select":
      const selectState = selectStates?.[field.name];
      return (
        <FormGroup
          label={field.label}
          isRequired={field.isRequired}
          labelIcon={labelIcon}
        >
          <Select
            selected={value ?? field.defaultValue}
            onSelect={(_event, val: string | number | undefined) => {
              onChange(val);
              selectState?.setIsOpen(false);
            }}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => selectState?.setIsOpen(!selectState.isOpen)}
                isExpanded={selectState?.isOpen}
                aria-label={`${field.label} select toggle`}
              >
                {value ?? field.defaultValue}
              </MenuToggle>
            )}
            aria-label={`${field.label} select`}
            isOpen={selectState?.isOpen}
            isScrollable
          >
            {field.options.map((option) => (
              <SelectOption
                key={option.key}
                id={`${fieldId}-${option.value}`}
                value={option.value}
              >
                {option.key}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>
      );

    case "radio":
      return (
        <FormGroup label={field.label} labelIcon={labelIcon}>
          <Flex>
            {field.options.map((option) => {
              // Handle both label (for radio) and key (if using select structure)
              const displayText =
                (option as any).label || (option as any).key || option.value;
              return (
                <FlexItem key={option.value}>
                  <Radio
                    id={`${fieldId}-${option.value}`}
                    label={displayText}
                    name={field.name}
                    isChecked={
                      value === option.value ||
                      (!value && field.defaultValue === option.value)
                    }
                    onChange={(_event, checked: boolean) => {
                      if (checked) onChange(option.value);
                    }}
                    aria-label={`${field.label} radio ${displayText}`}
                  />
                </FlexItem>
              );
            })}
          </Flex>
        </FormGroup>
      );

    default:
      return null;
  }
};
