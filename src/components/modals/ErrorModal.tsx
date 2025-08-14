import React from "react";
// PatternFly
import {
  Content,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";

interface PropsToErrorModal {
  dataCy: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  errorMessage: string;
}

const ErrorModal = (props: PropsToErrorModal) => {
  return (
    <Modal
      variant="small"
      data-cy={props.dataCy}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalHeader title={props.title} labelId="error-modal-title" />
      <ModalBody id="error-modal-body">
        <Content>{props.errorMessage}</Content>
      </ModalBody>
      <ModalFooter>{props.actions}</ModalFooter>
    </Modal>
  );
};

export default ErrorModal;
