import React from "react";
// PatternFly
import { Modal } from "@patternfly/react-core";
import TextLayout from "../layouts/TextLayout";

interface PropsToDeletionConfModal {
  variant?: "default" | "small" | "medium" | "large";
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  messageText: string;
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
      <TextLayout>{props.messageText}</TextLayout>
    </Modal>
  );
};

export default DeletionConfirmationModal;
