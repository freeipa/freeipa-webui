import React from "react";
// PatternFly
import { Modal } from "@patternfly/react-core/deprecated";

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
      title={props.title}
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    >
      {props.content}
    </Modal>
  );
};

export default InformationModalLayout;
