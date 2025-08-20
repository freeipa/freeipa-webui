import React from "react";
// PatternFly
import {
  Content,
  ContentVariants,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@patternfly/react-core";

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
      isOpen={props.showModal}
      onClose={props.onCloseModal}
      aria-label="Delete member modal"
    >
      <ModalHeader title={props.title} labelId="member-of-delete-modal-title" />
      <ModalBody id="member-of-delete-modal-body">
        <Form id={"is-member-of-delete-modal"}>
          <FormGroup key={"question-text"} fieldId={"question-text"}>
            <Content component={ContentVariants.p}>
              Are you sure you want to remove the following entries?
            </Content>
          </FormGroup>
          <FormGroup
            key={"deleted-users-table"}
            fieldId={"deleted-users-table"}
          >
            {props.children}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>{modalActionsDelete}</ModalFooter>
    </Modal>
  );
};

export default MemberOfDeleteModal;
