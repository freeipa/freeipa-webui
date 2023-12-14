import React from "react";
// PatternFly
import {
  Form,
  FormGroup,
  Modal,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";

interface PropsToAddModal {
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

  return (
    <Modal
      variant={props.variant || "small"}
      title={props.title}
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    >
      <Form>
        <FormGroup
          label={props.textInputTitle}
          type="string"
          fieldId="selection"
        >
          <TextInput
            name={props.textInputName}
            value={props.newValue}
            onChange={(_event, value) => props.setNewValue(value)}
            type="text"
            aria-label={props.textInputName}
            isRequired={true}
            validated={
              (props.newValue !== "" && !props.newValue.includes("@")) ||
              props.textInputValidator
                ? ValidatedOptions.default
                : ValidatedOptions.error
            }
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default AddTextInputFromListModal;
