import React from "react";
// PatternFly
import {
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextArea,
} from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";

interface PropsToPKModal {
  dataCy: string;
  id: string;
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
      data-cy={props.dataCy + "-modal"}
      variant={props.variant || "default"}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalHeader title={props.title} labelId={props.dataCy} />
      <ModalBody id={props.dataCy + "-modal-body"}>
        <Form>
          <FormGroup
            label={props.subtitle}
            type="string"
            fieldId={props.id}
            isRequired={props.isRequired}
          >
            <TextArea
              data-cy={"modal-textbox-" + props.dataCy}
              id={props.id}
              value={props.value}
              name={props.name}
              onChange={(_event, value) => props.onChange(value)}
              aria-label={props.ariaLabel}
              resizeOrientation={props.resizeOrientation || "vertical"}
              style={props.cssStyle}
              isDisabled={props.isTextareaDisabled || false}
              autoFocus
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>{props.actions}</ModalFooter>
    </Modal>
  );
};

export default ModalWithTextAreaLayout;
