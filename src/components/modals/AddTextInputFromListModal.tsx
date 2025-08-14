import React from "react";
// PatternFly
import { FormGroup, TextInput, ValidatedOptions } from "@patternfly/react-core";
import ModalWithFormLayout, { Field } from "../layouts/ModalWithFormLayout";

interface PropsToAddModal {
  dataCy: string;
  id: string;
  newValue: string;
  setNewValue: (newValue: string) => void;
  variant?: "small" | "medium" | "large" | "default";
  title: string;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any[];
  textInputTitle: string;
  textInputName: string;
  textInputValidator?: boolean;
}

const AddTextInputFromListModal = (props: PropsToAddModal) => {
  // Reset text input value when the modal is closed
  React.useEffect(() => {
    if (!props.isOpen) {
      props.setNewValue("");
    }
  }, [props.isOpen]);

  const fields: Field[] = [
    {
      id: props.id,
      pfComponent: (
        <FormGroup label={props.textInputTitle} fieldId={props.id}>
          <TextInput
            data-cy="modal-textbox-new-kerberos-principal-alias"
            id={props.id}
            name={props.textInputName}
            value={props.newValue}
            onChange={(_, v) => props.setNewValue(v)}
            validated={
              !(props.newValue && !props.newValue.includes("@")) ||
              props.textInputValidator
                ? ValidatedOptions.default
                : ValidatedOptions.error
            }
            isRequired
          />
        </FormGroup>
      ),
    },
  ];

  return (
    <ModalWithFormLayout
      formId={props.id}
      dataCy={props.dataCy}
      variantType={props.variant || "small"}
      modalPosition="top"
      title={props.title}
      show={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
      fields={fields}
    />
  );
};

export default AddTextInputFromListModal;
