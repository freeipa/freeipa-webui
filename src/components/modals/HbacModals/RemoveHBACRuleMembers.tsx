import React from "react";
// PatternFly
import { Button, Content, ContentVariants } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

interface PropsToDelete {
  elementType: string;
  showModal: boolean;
  closeModal: () => void;
  elementsToDelete: string[];
  spinning: boolean;
  removeMembers: (members: string[]) => void;
  label?: string;
}

const RemoveHBACRuleMembersModal = (props: PropsToDelete) => {
  const label = props.label ? props.label : props.elementType;

  // Modal fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to remove the selected entries?
        </Content>
      ),
    },
    {
      id: "deleted-" + props.elementType + "s-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_id"
          elementsToDelete={props.elementsToDelete.sort()}
          columnNames={[props.elementType]}
          elementType={props.elementType}
          idAttr="cn"
        />
      ),
    },
  ];

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      dataCy="modal-button-delete"
      key={"delete-" + props.elementType}
      form="modal-form"
      onClickHandler={() => props.removeMembers(props.elementsToDelete)}
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={props.spinning}
      isDisabled={props.spinning}
    >
      {props.spinning ? "Deleting" : "Delete"}
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-delete-" + props.elementType}
      variant="link"
      onClick={props.closeModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <ModalWithFormLayout
      dataCy="remove-hbac-rule-members-modal"
      variantType="medium"
      modalPosition="top"
      title={"Remove " + label.toLowerCase() + "s from HBAC rule"}
      formId={props.elementType + "-delete-modal"}
      fields={fields}
      show={props.showModal}
      onClose={props.closeModal}
      actions={modalActions}
    />
  );
};

export default RemoveHBACRuleMembersModal;
