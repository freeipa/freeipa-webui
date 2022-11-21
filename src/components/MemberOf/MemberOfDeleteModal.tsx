import React, { useState } from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
} from "@patternfly/react-core";
// Modals
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import MemberOfDeletedGroupsTable from "src/components/MemberOf/MemberOfDeletedGroupsTable";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  setIsDeleteButtonDisabled,
  setIsDeletion,
  setShowDeleteModal,
} from "src/store/shared/activeUsersMemberOf-slice";

// Although tabs data types habe been already defined, it is not possible to access to all
//  its variables. Just the mandatory ones ('name' and 'description') are accessible at this point.
// To display all the possible data types for all the tabs (and not only the mandatory ones)
//   an extra interface 'MemberOfElement' will be defined. This will be called in the 'PropsToTable'
//   interface instead of each type (UserGroup | Netgroup | Roles | HBACRules | SudoRules).
interface MemberOfElement {
  name: string;
  gid?: string;
  status?: string;
  description: string;
}

interface PropsToDelete {
  activeTabKey: number;
  groupRepository: MemberOfElement[];
  updateGroupRepository: (args: MemberOfElement[]) => void;
}

const MemberOfDeleteModal = (props: PropsToDelete) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve shared data (Redux)
  const groupsNamesSelected = useAppSelector(
    (state) => state.activeUsersMemberOfShared.groupsNamesSelected
  );
  const tabName = useAppSelector(
    (state) => state.activeUsersMemberOfShared.tabName
  );
  const showDeleteModal = useAppSelector(
    (state) => state.activeUsersMemberOfShared.showDeleteModal
  );

  // On modal toggle
  const onModalDeleteToggle = () => {
    dispatch(setShowDeleteModal(!showDeleteModal));
  };

  // Given a single group name, obtain full info to be sent and shown on the deletion table
  const getGroupInfoByName = (groupName: string) => {
    const res = props.groupRepository.filter(
      (group) => group.name === groupName
    );
    return res[0];
  };

  const getListOfGroupsToDelete = () => {
    const groupsToDelete: MemberOfElement[] = [];
    groupsNamesSelected.map((groupName) =>
      groupsToDelete.push(getGroupInfoByName(groupName))
    );
    return groupsToDelete;
  };

  // Groups to delete list
  const [groupsToDelete] = useState<MemberOfElement[]>(getListOfGroupsToDelete);

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
        <MemberOfDeletedGroupsTable
          groupsToDelete={groupsToDelete}
          tabName={tabName}
        />
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    onModalDeleteToggle();
  };

  // Delete groups
  const deleteGroups = () => {
    // Define function that will be reused to delete the selected entries
    let generalUpdatedGroupList = props.groupRepository;
    groupsNamesSelected.map((groupName) => {
      const updatedGroupList = generalUpdatedGroupList.filter(
        (grp) => grp.name !== groupName
      );
      // If not empty, replace groupList by new array
      if (updatedGroupList) {
        generalUpdatedGroupList = updatedGroupList;
      }
    });
    props.updateGroupRepository(generalUpdatedGroupList);
    dispatch(setIsDeleteButtonDisabled(true));
    dispatch(setIsDeletion(true));
    closeModal();
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-groups"
      variant="danger"
      onClick={deleteGroups}
      form="active-users-remove-groups-modal"
    >
      Delete
    </Button>,
    <Button key="cancel-remove-group" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  // Render 'MemberOfDeleteModal'
  return (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title={"Remove " + tabName}
      formId="active-users-remove-groups-modal"
      fields={fields}
      show={showDeleteModal}
      onClose={closeModal}
      actions={modalActionsDelete}
    />
  );
};

export default MemberOfDeleteModal;
