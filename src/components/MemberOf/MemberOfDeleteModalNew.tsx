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
import MemberOfDeletedGroupsTable from "./MemberOfDeletedGroupsTableNew";
import {
  HBACRules,
  Netgroup,
  Roles,
  SudoRules,
  UserGroupNew,
} from "src/utils/datatypes/globalDataTypes";
// Utils
import { getNameValue } from "./MemberOfTableNew";
// RPC
import { ErrorResult, useGroupRemoveMemberMutation } from "src/services/rpc";
// Hooks
import { AlertObject } from "src/hooks/useAlerts";

interface ModalData {
  showModal: boolean;
  handleModalToggle: () => void;
}

interface ButtonData {
  changeIsDeleteButtonDisabled: (updatedDeleteButton: boolean) => void;
  updateIsDeletion: (option: boolean) => void;
  onClickRefreshHandler: () => void;
}

interface TabData {
  tabName: string;
  activeTabKey: number;
  userName: string;
}

interface PropsToDelete {
  modalData: ModalData;
  tabData: TabData;
  groupNamesToDelete: string[];
  groupRepository: (
    | UserGroupNew
    | Netgroup
    | Roles
    | HBACRules
    | SudoRules
    | SudoRules
  )[];
  updateGroupRepository: (
    args: (
      | UserGroupNew
      | Netgroup
      | Roles
      | HBACRules
      | SudoRules
      | SudoRules
    )[]
  ) => void;
  buttonData: ButtonData;
  alerts: AlertObject;
}

const MemberOfDeleteModal = (props: PropsToDelete) => {
  // API call
  const [removeMembersFromUserGroup] = useGroupRemoveMemberMutation();

  // Given a single group name, obtain full info to be sent and shown on the deletion table
  const getGroupInfoByName = (groupName: string) => {
    const res = props.groupRepository.filter((group) => {
      const name = getNameValue(group);
      return name === groupName;
    });
    return res[0];
  };

  const getListOfGroupsToDelete = () => {
    const groupsToDelete: (
      | UserGroupNew
      | Netgroup
      | Roles
      | HBACRules
      | SudoRules
    )[] = [];
    props.groupNamesToDelete.map((groupName) =>
      groupsToDelete.push(getGroupInfoByName(groupName))
    );
    return groupsToDelete;
  };

  // Groups to delete list
  const [groupsToDelete] = useState<
    (UserGroupNew | Netgroup | Roles | HBACRules | SudoRules | SudoRules)[]
  >(getListOfGroupsToDelete);

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
          tabName={props.tabData.tabName}
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
    let generalUpdatedGroupList: (
      | UserGroupNew
      | Netgroup
      | Roles
      | HBACRules
      | SudoRules
    )[] = props.groupRepository;
    props.groupNamesToDelete.map((groupName) => {
      const updatedGroupList = generalUpdatedGroupList.filter((grp) => {
        const name = getNameValue(grp);
        return name !== groupName;
      });
      // If not empty, replace groupList by new array
      if (updatedGroupList) {
        generalUpdatedGroupList = updatedGroupList;
      }
    });

    // API call
    removeMembersFromUserGroup([
      props.tabData.userName,
      props.groupNamesToDelete,
    ]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          props.alerts.addAlert(
            "remove-member-success",
            "Removed members from user group '" + props.tabData.userName + "'",
            "success"
          );

          // Update data
          props.updateGroupRepository(generalUpdatedGroupList);
          props.buttonData.changeIsDeleteButtonDisabled(true);
          props.buttonData.updateIsDeletion(true);

          // Close modal
          closeModal();

          // Refresh
          props.buttonData.onClickRefreshHandler();
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          props.alerts.addAlert(
            "remove-member-error",
            errorMessage.message,
            "danger"
          );
        }
      }
    });
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
      title={"Remove " + props.tabData.tabName}
      formId="active-users-remove-groups-modal"
      fields={fields}
      show={props.modalData.showModal}
      onClose={closeModal}
      actions={modalActionsDelete}
    />
  );
};

export default MemberOfDeleteModal;
