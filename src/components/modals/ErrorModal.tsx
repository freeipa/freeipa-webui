import React from "react";
// PatternFly
import { Modal } from "@patternfly/react-core/deprecated";
import TextLayout from "../layouts/TextLayout";

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
      <TextLayout>{props.errorMessage}</TextLayout>
    </Modal>
  );
};

export default ErrorModal;
