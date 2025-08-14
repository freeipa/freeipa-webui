import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@patternfly/react-core";
import React from "react";
// PatternFly

interface PropsToModalLayout {
  dataCy: string;
  isOpen: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  title: string;
  variant?: "default" | "small" | "medium" | "large";
  content: React.ReactNode;
}

const InformationModalLayout = (props: PropsToModalLayout) => {
  return (
    <Modal
      data-cy={props.dataCy}
      variant={props.variant || "small"}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalHeader title={props.title} labelId={props.dataCy} />
      <ModalBody id={props.dataCy + "-modal-body"}>{props.content}</ModalBody>
      <ModalFooter>{props.actions}</ModalFooter>
    </Modal>
  );
};

export default InformationModalLayout;
