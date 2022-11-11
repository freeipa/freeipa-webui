// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
// PatternFly
import { Form, FormGroup, Modal, ModalVariant } from "@patternfly/react-core";

export interface PropsToModal {
  // Modal variant
  variantType: "small" | "medium" | "large" | "default";
  // Position
  modalPosition: "top" | undefined;
  // Offset position
  offPosition?: string;
  // Modal title
  title: string;
  // Description
  description?: string;
  // Form id
  formId: string;
  // List of fields
  fields: Field[];
  // Show modal
  show: boolean;
  // onClose method
  onClose: () => void;
  // Action buttons
  actions: JSX.Element[];
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
  // -- Transform the 'variant: string' to 'ModalVariant' type as specified in PF.
  const [variant, setVariant] = React.useState(ModalVariant.default);
  // 'ModalVariant' is re-evaluated everytime the 'variant' property changes.
  React.useEffect(() => {
    switch (props.variantType) {
      case "small":
        setVariant(ModalVariant.small);
        break;
      case "medium":
        setVariant(ModalVariant.medium);
        break;
      case "large":
        setVariant(ModalVariant.large);
        break;
      case "default":
        setVariant(ModalVariant.default);
        break;
      default:
        setVariant(ModalVariant.default);
    }
  }, [props.variantType]);

  // Render 'ModalWithFormLayout'
  return (
    <Modal
      variant={variant}
      title={props.title}
      description={props.description}
      position={props.modalPosition}
      positionOffset={props.offPosition}
      isOpen={props.show}
      onClose={props.onClose}
      actions={props.actions}
    >
      <Form id={props.formId}>
        {props.fields.map((field) => (
          <FormGroup
            key={field.id}
            label={field.name}
            fieldId={field.id}
            isRequired={field.fieldRequired}
            labelIcon={field.labelIcon}
          >
            {field.pfComponent}
          </FormGroup>
        ))}
      </Form>
    </Modal>
  );
};

export default ModalWithFormLayout;
