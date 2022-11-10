import React from "react";
// PatternFly
import { Form, FormGroup, Modal, TextArea } from "@patternfly/react-core";

interface PropsToPKModal {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  title: string;
  subtitle?: string;
  cssName: string;
  ariaLabel?: string;
}

const ModalWithTextAreaLayout = (props: PropsToPKModal) => {
  return (
    <Modal
      variant="small"
      title={props.title}
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    >
      <Form>
        <FormGroup label={props.subtitle} type="string" fieldId="selection">
          <TextArea
            value={props.value}
            name={props.cssName}
            onChange={props.onChange}
            aria-label={props.ariaLabel}
            resizeOrientation="vertical"
            style={{ height: "422px" }}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default ModalWithTextAreaLayout;
