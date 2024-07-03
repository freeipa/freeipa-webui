import React from "react";
// PatternFly
import { Card, CardTitle, Modal } from "@patternfly/react-core";
// Components
import TextLayout from "../layouts/TextLayout";

interface PropsToConfModal {
  variant?: "default" | "small" | "medium" | "large";
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  messageText: string;
  messageObj: string;
}

const ConfirmationModal = (props: PropsToConfModal) => {
  return (
    <Modal
      variant={props.variant || "small"}
      title={props.title}
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    >
      <TextLayout component="p">{props.messageText}</TextLayout>
      <Card className="pf-v5-u-mt-md" isFlat isCompact>
        <CardTitle>{props.messageObj}</CardTitle>
      </Card>
    </Modal>
  );
};

export default ConfirmationModal;
