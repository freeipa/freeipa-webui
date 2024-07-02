import React from "react";
// PatternFly
import { Button, Modal } from "@patternfly/react-core";
// Layouts
import TextLayout from "../layouts/TextLayout";

export interface PropsToConfirm {
  show: boolean;
  handleModalToggle: () => void;
  msg: string;
  spinning?: boolean | false;
  action: () => void;
}

const ConfirmModal = (props: PropsToConfirm) => {
  const modalConfirm: JSX.Element = (
    <>
      <Modal
        variant="small"
        title="Confirmation"
        isOpen={props.show}
        onClose={props.handleModalToggle}
        actions={[
          <Button
            key="yes"
            variant="primary"
            onClick={props.action}
            spinnerAriaValueText="Processing request"
            spinnerAriaLabelledBy="Processing request"
            spinnerAriaLabel="Processing request"
            isLoading={props.spinning}
            isDisabled={props.spinning}
          >
            Yes
          </Button>,
          <Button
            key="no"
            variant="link"
            isDisabled={props.spinning}
            onClick={props.handleModalToggle}
          >
            No
          </Button>,
        ]}
      >
        <TextLayout>{props.msg}</TextLayout>
      </Modal>
    </>
  );

  return modalConfirm;
};

export default ConfirmModal;
