import React from "react";
// PatternFly
import { Form, FormGroup, Modal, TextArea } from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";

interface PropsToPKModal {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  title: string;
  subtitle?: string;
  isRequired?: boolean | false;
  ariaLabel?: string;
  resizeOrientation?: "horizontal" | "vertical";
  cssStyle?: React.CSSProperties;
  name: string;
  objectName: string;
  ipaObject: Record<string, unknown>;
  metadata: Metadata;
  variant?: "default" | "small" | "medium" | "large";
  isTextareaDisabled?: boolean;
}

const ModalWithTextAreaLayout = (props: PropsToPKModal) => {
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
          label={props.subtitle}
          type="string"
          fieldId="selection"
          isRequired={props.isRequired}
        >
          <TextArea
            value={props.value}
            name={props.name}
            onChange={(_event, value) => props.onChange(value)}
            aria-label={props.ariaLabel}
            resizeOrientation={props.resizeOrientation || "vertical"}
            style={props.cssStyle}
            isDisabled={props.isTextareaDisabled || false}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default ModalWithTextAreaLayout;
