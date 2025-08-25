import React from "react";
// PatternFly
import {
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";

export interface PropsToModal {
  // Data cypress
  dataCy: string;
  // Modal variant
  variantType: "small" | "medium" | "large" | "default";
  // Position
  modalPosition: "top" | undefined;
  // Offset position
  offPosition?: string;
  // Modal title
  title: string;
  // Form id
  formId: string;
  // List of fields
  fields: Field[];
  // Show modal
  show: boolean;
  // onClose method
  onClose: () => void;
  // onSubmit method
  onSubmit?: (event: React.FormEvent) => void;
  // Action buttons
  actions: JSX.Element[];
  // is horizontal
  isHorizontal?: boolean;
}

export interface Field {
  // Field id ("field-id")
  id: string;
  // Name as it should be shown in the form ("Form name")
  name?: string;
  // JSX code that would include the PF component
  pfComponent: JSX.Element;
  // Label icon. Can include custom classes
  labelIcon?: JSX.Element;
  // Is this field required
  fieldRequired?: boolean;
}

const ModalWithFormLayout = (props: PropsToModal) => {
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.onSubmit?.(event);
  };

  return (
    <Modal
      data-cy={props.dataCy}
      variant={props.variantType}
      position={props.modalPosition}
      positionOffset={props.offPosition}
      isOpen={props.show}
      onClose={props.onClose}
    >
      <ModalHeader title={props.title} labelId={props.formId + "-header"} />
      <ModalBody id={props.formId + "-modal-body"}>
        <Form
          onSubmit={onSubmit}
          id={props.formId}
          isHorizontal={props.isHorizontal || false}
        >
          {props.fields.map((field) => (
            <FormGroup
              key={field.id}
              label={field.name}
              fieldId={field.id}
              isRequired={field.fieldRequired}
              labelHelp={field.labelIcon}
            >
              {field.pfComponent}
            </FormGroup>
          ))}
        </Form>
      </ModalBody>
      <ModalFooter>{props.actions}</ModalFooter>
    </Modal>
  );
};

export default ModalWithFormLayout;
