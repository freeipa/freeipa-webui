import React from "react";
// PatternFly
import { Modal } from "@patternfly/react-core/deprecated";
import { Content } from "@patternfly/react-core";

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
      title={props.title}
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    >
      <Content>{props.errorMessage}</Content>
    </Modal>
  );
};

export default ErrorModal;
