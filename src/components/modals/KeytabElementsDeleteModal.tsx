import React from "react";
// PatternFly
import { Button, Content, ContentVariants } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

interface PropsToDelete {
  host: string;
  elementType: string;
  operationType: string;
  columnNames: string[];
  showModal: boolean;
  closeModal: () => void;
  elementsToDelete: string[];
  updateIsDeleteButtonDisabled: (newValue: boolean) => void;
  updateSelectedElements: (newSelectedElements: string[]) => void;
  tableElementsList: string[];
  updateTableElementsList: (newElementsList: string[]) => void;
  availableData: string[];
  updateAvailableData: (newFilteredElements: string[]) => void;
}

const KeytabElementsDeleteModal = (props: PropsToDelete) => {
  // Modal fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to delete the selected entries?
        </Content>
      ),
    },
    {
      id: "deleted-" + props.elementType + "s-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_id"
          elementsToDelete={props.elementsToDelete.sort()}
          columnNames={props.columnNames}
          elementType={props.elementType}
          idAttr="fqdn"
        />
      ),
    },
  ];

  // Remove element from the list
  const removeElementFromList = () => {
    // Define function that will be reused to delete the selected entries
    let generalUpdatedElementsList = props.tableElementsList;
    const dataBackToBeAvailable = props.availableData;
    props.elementsToDelete.map((element) => {
      dataBackToBeAvailable.push(element);
      const updatedElementsList = generalUpdatedElementsList.filter(
        (elm) => elm !== element
      );
      // If not empty, replace element list by new array
      if (updatedElementsList) {
        generalUpdatedElementsList = updatedElementsList;
      }
    });
    props.updateTableElementsList(generalUpdatedElementsList);
    props.updateIsDeleteButtonDisabled(true);
    // Add removed items back to the option list (to be added again)
    props.updateAvailableData(dataBackToBeAvailable.sort());
    // Clean selected elements & close modal
    props.updateSelectedElements([]);
    closeModal();
  };

  const closeModal = () => {
    props.closeModal();
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-delete"
      variant="danger"
      key={"delete-" + props.elementType}
      form="modal-form"
      onClick={removeElementFromList}
    >
      Delete
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-delete-" + props.elementType}
      variant="link"
      onClick={closeModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <ModalWithFormLayout
      dataCy="keytab-elements-delete-modal"
      variantType="medium"
      modalPosition="top"
      title={
        "Disallow " +
        props.elementType +
        "s to " +
        props.operationType +
        " keytab of " +
        props.host
      }
      formId={
        props.operationType + "-keytab-" + props.elementType + "s-delete-modal"
      }
      fields={fields}
      show={props.showModal}
      onClose={closeModal}
      actions={modalActions}
    />
  );
};

export default KeytabElementsDeleteModal;
