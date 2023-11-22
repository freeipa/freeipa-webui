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
import { removeHost } from "src/store/Identity/hosts-slice";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedHostsData {
  selectedHosts: string[];
  updateSelectedHosts: (newSelectedHosts: string[]) => void;
}

export interface PropsToDeleteHosts {
  show: boolean;
  handleModalToggle: () => void;
  selectedHostsData: SelectedHostsData;
  buttonsData: ButtonsData;
  onRefresh?: () => void;
}

const DeleteHosts = (props: PropsToDeleteHosts) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve all hosts list from Store and make a copy
  const hostsList = useAppSelector((state) => state.hosts.hostsList);
  const hostsListCopy = [...hostsList];

  // Define the column names that will be displayed on the confirmation table.
  // - NOTE: Camel-case should match with the property to show as it is defined in the data.
  //    This variable will be coverted into word.
  const deleteHostsColumnNames = ["hostName", "description"];

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
          elementsToDelete={props.selectedHostsData.selectedHosts}
          elementsList={hostsListCopy}
          columnNames={deleteHostsColumnNames}
          elementType="hosts"
        />
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  // Redux: Delete hosts
  const deleteHosts = () => {
    props.selectedHostsData.selectedHosts.map((host) => {
      dispatch(removeHost(host));
    });
    props.selectedHostsData.updateSelectedHosts([]);
    props.buttonsData.updateIsDeleteButtonDisabled(true);
    props.buttonsData.updateIsDeletion(true);
    closeModal();
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-hosts"
      variant="danger"
      onClick={deleteHosts}
      form="delete-hosts-modal"
    >
      Delete
    </Button>,
    <Button key="cancel-delete-hosts" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  const modalDelete: JSX.Element = (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Remove hosts"
      formId="remove-hosts-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsDelete}
    />
  );

  // Render 'DeleteUsers'
  return modalDelete;
};

export default DeleteHosts;
