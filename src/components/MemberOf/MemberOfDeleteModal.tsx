import React from "react";
// PatternFly
import {
  Content,
  ContentVariants,
  Button,
  Form,
  FormGroup,
} from "@patternfly/react-core";
import { Modal } from "@patternfly/react-core/deprecated";

interface PropsToDelete {
  title: string;
  showModal: boolean;
  onCloseModal: () => void;
  onDelete: () => void;
  spinning: boolean;
}

const MemberOfDeleteModal = (props: React.PropsWithChildren<PropsToDelete>) => {
  const onDelete = () => {
    props.onDelete();
  };

  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-delete"
      key="delete-groups"
      variant="danger"
      onClick={onDelete}
      form="active-users-remove-groups-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={props.spinning}
      isDisabled={props.spinning}
    >
      {props.spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-remove-group"
      variant="link"
      onClick={props.onCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <Modal
      data-cy="member-of-delete-modal"
      variant={"medium"}
      position={"top"}
      positionOffset={"76px"}
      title={props.title}
      isOpen={props.showModal}
      onClose={props.onCloseModal}
      actions={modalActionsDelete}
      aria-label="Delete member modal"
    >
      <Form id={"is-member-of-delete-modal"}>
        <FormGroup key={"question-text"} fieldId={"question-text"}>
          <Content>
            <Content component={ContentVariants.p}>
              Are you sure you want to remove the following entries?
            </Content>
          </Content>
        </FormGroup>
        <FormGroup key={"deleted-users-table"} fieldId={"deleted-users-table"}>
          {props.children}
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default MemberOfDeleteModal;
