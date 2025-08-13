import React from "react";
// PatternFly
import { Card, CardTitle, Content } from "@patternfly/react-core";
import { Modal } from "@patternfly/react-core/deprecated";

interface PropsToConfModal {
  dataCy: string;
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
      data-cy={props.dataCy}
      variant={props.variant || "small"}
      title={props.title}
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    >
      <Content component="p">{props.messageText}</Content>
      <Card className="pf-v6-u-mt-md" isCompact>
        <CardTitle>{props.messageObj}</CardTitle>
      </Card>
    </Modal>
  );
};

export default ConfirmationModal;
