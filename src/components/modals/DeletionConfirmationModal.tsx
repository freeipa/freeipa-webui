import React from "react";
// PatternFly
import { Modal } from "@patternfly/react-core";
// Components
import TextLayout from "../layouts/TextLayout";

interface PropsToDeletionConfModal {
  variant?: "default" | "small" | "medium" | "large";
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  messageText: string;
  messageObj: string;
}

const DeletionConfirmationModal = (props: PropsToDeletionConfModal) => {
  return (
    <Modal
      variant={props.variant || "small"}
      title={props.title}
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    >
      <TextLayout component="p">{props.messageText}</TextLayout>
      <TextLayout className="pf-v5-u-mt-md">
        <b>{props.messageObj}</b>
      </TextLayout>
    </Modal>
  );
};

export default DeletionConfirmationModal;
