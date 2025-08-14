import React from "react";
// PatternFly
import {
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";

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

  return (
    <Modal
      data-cy={props.dataCy}
      variant={props.variant || "small"}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalHeader title={props.title} labelId={props.title} />
      <ModalBody id="modal-box-body-basic">
        <Form>
          <FormGroup
            label={props.textInputTitle}
            type="string"
            fieldId={props.id}
          >
            <TextInput
              data-cy="modal-textbox-new-kerberos-principal-alias"
              id={props.id}
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
      </ModalBody>
      <ModalFooter>{props.actions}</ModalFooter>
    </Modal>
  );
};

export default AddTextInputFromListModal;
