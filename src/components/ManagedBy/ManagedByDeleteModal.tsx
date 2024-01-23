import React from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Data type
import { Host } from "src/utils/datatypes/globalDataTypes";
// Tables
import DeletedElementsTable from "../tables/DeletedElementsTable";

interface ModalData {
  showModal: boolean;
  handleModalToggle: () => void;
}

interface ButtonData {
  changeIsDeleteButtonDisabled: (updatedDeleteButton: boolean) => void;
  updateIsDeletion: (option: boolean) => void;
}

interface TabData {
  tabName: string;
  elementName: string;
}

interface PropsToDeleteModal {
  modalData: ModalData;
  tabData: TabData;
  groupNamesToDelete: string[];
  groupRepository: Host[];
  updateGroupRepository: (args: Host[]) => void;
  buttonData: ButtonData;
}

const ManagedByDeleteModal = (props: PropsToDeleteModal) => {
  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to remove the selected entries from the list?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "deleted-users-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_id"
          elementsToDelete={props.groupNamesToDelete}
          columnNames={["Host"]}
          elementType={props.tabData.tabName}
          idAttr="fqdn"
        />
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.modalData.handleModalToggle();
  };

  // Delete groups
  const deleteGroups = () => {
    // Define function that will be reused to delete the selected entries
    let generalUpdatedGroupList = props.groupRepository;
    props.groupNamesToDelete.map((groupName) => {
      const updatedGroupList = generalUpdatedGroupList.filter(
        (grp) => grp.fqdn !== groupName
      );
      // If not empty, replace groupList by new array
      if (updatedGroupList) {
        generalUpdatedGroupList = updatedGroupList;
      }
    });
    props.updateGroupRepository(generalUpdatedGroupList);
    props.buttonData.changeIsDeleteButtonDisabled(true);
    props.buttonData.updateIsDeletion(true);
    closeModal();
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-groups"
      variant="danger"
      onClick={deleteGroups}
      form={props.tabData.tabName.toLowerCase() + "-remove-groups-modal"}
    >
      Delete
    </Button>,
    <Button key="cancel-remove-group" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  // Utility: Convert the tab name by removing the last character and transforming into lower case
  //  - Eg: 'Hosts' -> 'host'
  const convertedTabName = props.tabData.tabName.slice(0, -1).toLowerCase();

  // Render component
  return (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title={
        "Remove " +
        props.tabData.tabName.toLowerCase() +
        " managing " +
        convertedTabName +
        " '" +
        props.tabData.elementName +
        "'"
      }
      formId="is-managed-by-remove-modal"
      fields={fields}
      show={props.modalData.showModal}
      onClose={closeModal}
      actions={modalActionsDelete}
    />
  );
};

export default ManagedByDeleteModal;
