import React, { ReactNode, useEffect, useState } from "react";
// PatternFly
import { Button, DualListSelector } from "@patternfly/react-core";
// Modals
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Data types
import {
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
  HostGroup,
  UserGroupNew,
} from "src/utils/datatypes/globalDataTypes";
// Hooks
import { AlertObject } from "src/hooks/useAlerts";
// Utils
import { getNameValue } from "./MemberOfTableNew";
import { ErrorResult, useGroupAddMemberMutation } from "src/services/rpc";

interface ModalData {
  showModal: boolean;
  handleModalToggle: () => void;
}

interface TabData {
  tabName: string;
  userName: string; // TODO: Change to a more generalistic name
}

export interface PropsToAdd {
  modalData: ModalData;
  availableData:
    | UserGroupNew[]
    | Netgroup[]
    | Roles[]
    | HBACRules[]
    | SudoRules[]
    | HostGroup[];
  groupRepository: unknown[];
  updateGroupRepository: (
    args:
      | UserGroupNew[]
      | Netgroup[]
      | Roles[]
      | HBACRules[]
      | SudoRules[]
      | HostGroup[]
  ) => void;
  updateAvOptionsList: (args: unknown[]) => void;
  tabData: TabData;
  alerts: AlertObject;
}

const MemberOfAddModal = (props: PropsToAdd) => {
  // Dual list data
  const data = props.availableData.map((d) => getNameValue(d));

  // API call
  const [addMemberToUserGroup] = useGroupAddMemberMutation();

  // Dual list selector
  const [availableOptions, setAvailableOptions] = useState<ReactNode[]>(data);
  const [chosenOptions, setChosenOptions] = useState<ReactNode[]>([]);

  const listChange = (
    newAvailableOptions: ReactNode[],
    newChosenOptions: ReactNode[]
  ) => {
    setAvailableOptions(newAvailableOptions.sort());
    setChosenOptions(newChosenOptions.sort());
  };

  const fields = [
    {
      id: "dual-list-selector",
      pfComponent: (
        <DualListSelector
          isSearchable
          availableOptions={availableOptions}
          chosenOptions={chosenOptions}
          onListChange={(
            _event,
            newAvailableOptions: ReactNode[],
            newChosenOptions: ReactNode[]
          ) => listChange(newAvailableOptions, newChosenOptions)}
          id="basicSelectorWithSearch"
        />
      ),
    },
  ];

  // When clean data, set to original values
  const cleanData = () => {
    setAvailableOptions(data);
    setChosenOptions([]);
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanData();
    props.modalData.handleModalToggle();
  };

  // Buttons are disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (chosenOptions.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [chosenOptions]);

  // Get all info from a chosen option
  const getInfoFromGroupData = (option: unknown) => {
    const availableDataCopy = [...props.availableData];
    return availableDataCopy.find((d) => {
      const name = getNameValue(d);
      return option === name;
    });
  };

  // Add new member to 'User group'
  const onAddToUserGroup = (toUid: string, newData: string[]) => {
    addMemberToUserGroup([toUid, newData]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          props.alerts.addAlert(
            "add-member-success",
            "Added new members to user group '" + toUid + "'",
            "success"
          );
          // Close modal
          props.modalData.handleModalToggle();
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          props.alerts.addAlert(
            "add-member-error",
            errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  // Add group option
  const onClickAddGroupHandler = () => {
    // List of items to be added
    const newGroupRepoItems: unknown[] = [...props.groupRepository];
    const optionsToAdd: string[] = [];

    chosenOptions.map((opt) => {
      let optionData = getInfoFromGroupData(opt);
      if (optionData !== undefined) {
        // User groups
        if (props.tabData.tabName === "User groups") {
          optionData = optionData as UserGroupNew;
          newGroupRepoItems.push({
            cn: optionData.cn !== undefined && optionData.cn,
            description:
              optionData.description !== undefined && optionData.description,
            gidnumber:
              optionData.gidnumber !== undefined && optionData.gidnumber,
          });
          optionsToAdd.push(optionData.cn);
        }
        // Netgroups
        if (props.tabData.tabName === "Netgroups") {
          optionData = optionData as Netgroup;
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
          } as Netgroup);
          props.updateGroupRepository(props.groupRepository as Netgroup[]);
        }
        // Roles
        if (props.tabData.tabName === "Roles") {
          optionData = optionData as Roles;
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
          } as Roles);
          props.updateGroupRepository(props.groupRepository as Roles[]);
        }
        // HBAC rules
        if (props.tabData.tabName === "HBAC rules") {
          optionData = optionData as HBACRules;
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
          } as HBACRules);
          props.updateGroupRepository(props.groupRepository as HBACRules[]);
        }
        // Sudo rules
        if (props.tabData.tabName === "Sudo rules") {
          optionData = optionData as SudoRules;
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
          } as SudoRules);
          props.updateGroupRepository(props.groupRepository as SudoRules[]);
        }
        // Host groups
        if (props.tabData.tabName === "Host groups") {
          optionData = optionData as HostGroup;
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
          } as HostGroup);
          props.updateGroupRepository(props.groupRepository as HostGroup[]);
        }
      }
    });

    // API call
    onAddToUserGroup(props.tabData.userName, optionsToAdd);

    // Send updated data to table based on data type (New approach)
    switch (props.tabData.tabName) {
      case "User groups":
        props.updateGroupRepository(newGroupRepoItems as UserGroupNew[]);
        break;
      // TODO: Add other cases here as they're adapted to the C.L.
    }

    // Clean chosen options and close modal
    setChosenOptions([]);
    props.modalData.handleModalToggle();
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      key="add-new-user"
      variant="secondary"
      isDisabled={buttonDisabled}
      form="modal-form"
      onClick={onClickAddGroupHandler}
    >
      Add
    </Button>,
    <Button key="cancel-new-user" variant="link" onClick={cleanAndCloseModal}>
      Cancel
    </Button>,
  ];

  // Render 'MemberOfaddModal'
  return (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title={
        "Add user '" +
        props.tabData.userName +
        "' into " +
        props.tabData.tabName
      }
      formId="is-member-of-add-modal"
      fields={fields}
      show={props.modalData.showModal}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default MemberOfAddModal;
