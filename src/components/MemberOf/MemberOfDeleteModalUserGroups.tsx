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
// Tables
import MemberOfDeletedGroupsTable from "src/components/MemberOf/MemberOfDeletedGroupsTable";
// Data types
import { UserGroupOld } from "src/utils/datatypes/globalDataTypes";

interface PropsToDelete {
  showModal: boolean;
  onCloseModal: () => void;
  tabName: string;
  groupNamesToDelete: string[];
  groupRepository: UserGroupOld[];
  updateGroupRepository: (args: UserGroupOld[]) => void;
  updateGroupNamesToDelete: (args: string[]) => void;
}

const MemberOfDeleteModal = (props: PropsToDelete) => {
  // Given a single group name, obtain full info to be sent and shown on the deletion table
  const getGroupInfoByName = (groupName: string) => {
    const res = props.groupRepository.filter(
      (group) => group.name === groupName
    );
    return res[0];
  };

  // Obtain full info of groups to delete
  const getListOfGroupsToDelete = () => {
    const groupsToDelete: UserGroupOld[] = [];
    props.groupNamesToDelete.map((groupName) =>
      groupsToDelete.push(getGroupInfoByName(groupName))
    );
    return groupsToDelete;
  };

  // Groups to delete list
  const groupsToDelete: UserGroupOld[] = getListOfGroupsToDelete();

  // Delete groups
  const deleteGroups = () => {
    let generalUpdatedGroupList = props.groupRepository;
    props.groupNamesToDelete.map((groupName) => {
      const updatedGroupList = generalUpdatedGroupList.filter(
        (grp) => grp.name !== groupName
      );
      // If not empty, replace groupList by new array
      if (updatedGroupList) {
        generalUpdatedGroupList = updatedGroupList;
      }
    });
    props.updateGroupRepository(generalUpdatedGroupList);
    props.updateGroupNamesToDelete([]);
    props.onCloseModal();
  };

  // Modal actions
  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-groups"
      variant="danger"
      onClick={deleteGroups}
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
      title={"Remove " + props.tabName}
      isOpen={props.showModal}
      onClose={props.onCloseModal}
      actions={modalActionsDelete}
      aria-label="Delete member modal"
    >
      <Form id={"is-member-of-delete-modal"}>
        <FormGroup key={"question-text"} fieldId={"question-text"}>
          <TextContent>
            <Text component={TextVariants.p}>
              Are you sure you want to remove the selected entries from the
              list?
            </Text>
          </TextContent>
        </FormGroup>
        <FormGroup key={"deleted-users-table"} fieldId={"deleted-users-table"}>
          <MemberOfDeletedGroupsTable
            groupsToDelete={groupsToDelete}
            tabName={props.tabName}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default MemberOfDeleteModal;
