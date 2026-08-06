import React from "react";
// PatternFly
import {
  Card,
  CardTitle,
  Content,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";

interface PropsToConfModal {
  dataCy: string;
  variant?: "default" | "small" | "medium" | "large";
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  messageText: string;
  messageObj: string;
  formId?: string;
  onSubmit?: (event: React.FormEvent) => void;
}

const ConfirmationModal = (props: PropsToConfModal) => {
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.onSubmit?.(event);
  };

  return (
    <Modal
      data-cy={props.dataCy}
      variant={props.variant || "small"}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalHeader title={props.title} labelId="confirmation-modal-title" />
      <ModalBody id="confirmation-modal-body">
        <form onSubmit={onSubmit} id={props.formId}>
          <Content component="p">{props.messageText}</Content>
          <Card className="pf-v6-u-mt-md" isCompact>
            <CardTitle>{props.messageObj}</CardTitle>
          </Card>
        </form>
      </ModalBody>
      <ModalFooter>{props.actions}</ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
