import React from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
} from "@patternfly/react-core";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { removeService } from "src/store/Identity/services-slice";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedElementsData {
  selectedElements: string[];
  updateSelectedElements: (newSelectedElements: string[]) => void;
}

interface PropsToDeleteServices {
  show: boolean;
  handleModalToggle: () => void;
  selectedElementsData: SelectedElementsData;
  buttonsData: ButtonsData;
}

const DeleteServices = (props: PropsToDeleteServices) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve all hosts list from Store and make a copy
  const servicesList = useAppSelector((state) => state.services.servicesList);
  const servicesListCopy = [...servicesList];

  // Define the column names that will be displayed on the confirmation table.
  // - NOTE: Camel-case should match with the property to show as it is defined in the data.
  //    This variable will be coverted into word.
  // TODO: Adapt to the API data
  const deleteServicesColumnNames = ["id"];

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to remove the selected entries from Hosts?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "deleted-users-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.selectedElementsData.selectedElements}
          elementsList={servicesListCopy}
          columnNames={deleteServicesColumnNames}
          elementType="services"
        />
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  // Redux: Delete services
  const deleteServices = () => {
    props.selectedElementsData.selectedElements.map((service) => {
      dispatch(removeService(service));
    });
    props.selectedElementsData.updateSelectedElements([]);
    props.buttonsData.updateIsDeleteButtonDisabled(true);
    props.buttonsData.updateIsDeletion(true);
    closeModal();
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-services"
      variant="danger"
      onClick={deleteServices}
      form="delete-services-modal"
    >
      Delete
    </Button>,
    <Button key="cancel-delete-services" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalDelete: JSX.Element = (
    <ModalWithFormLayout
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Remove services"
      formId="remove-services-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsDelete}
    />
  );

  // Render component
  return modalDelete;
};

export default DeleteServices;
