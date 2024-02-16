import React from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
  Modal,
  Form,
  FormGroup,
} from "@patternfly/react-core";

interface PropsToDelete {
  title: string;
  showModal: boolean;
  onCloseModal: () => void;
  onDelete: () => void;
}

const MemberOfDeleteModal = (props: React.PropsWithChildren<PropsToDelete>) => {
  const onDelete = () => {
    props.onDelete();
    props.onCloseModal();
  };

  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-groups"
      variant="danger"
      onClick={onDelete}
      form="active-users-remove-groups-modal"
    >
      Delete
    </Button>,
    <Button
      key="cancel-remove-group"
      variant="link"
      onClick={props.onCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <Modal
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
          <TextContent>
            <Text component={TextVariants.p}>
              Are you sure you want to remove the following entries?
            </Text>
          </TextContent>
        </FormGroup>
        <FormGroup key={"deleted-users-table"} fieldId={"deleted-users-table"}>
          {props.children}
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default MemberOfDeleteModal;
