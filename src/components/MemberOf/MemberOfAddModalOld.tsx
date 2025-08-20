import React, { ReactNode, useEffect, useState } from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
import { DualListSelector } from "@patternfly/react-core/deprecated";
// Modals
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Data types
import {
  UserGroupOld,
  NetgroupOld,
  RolesOld,
  HBACRulesOld,
  SudoRulesOld,
  HostGroupOld,
} from "src/utils/datatypes/globalDataTypes";

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
    | UserGroupOld[]
    | NetgroupOld[]
    | RolesOld[]
    | HBACRulesOld[]
    | SudoRulesOld[]
    | HostGroupOld[];
  groupRepository: unknown[];
  updateGroupRepository: (
    args:
      | UserGroupOld[]
      | NetgroupOld[]
      | RolesOld[]
      | HBACRulesOld[]
      | SudoRulesOld[]
      | HostGroupOld[]
  ) => void;
  updateAvOptionsList: (args: unknown[]) => void;
  tabData: TabData;
}

// Although tabs data types habe been already defined, it is not possible to access to all
//  its variables. Just the mandatory ones ('name' and 'description') are accessible at this point.
// To display all the possible data types for all the tabs (and not only the mandatory ones)
//   an extra interface 'MemberOfElement' will be defined. This will be called when assigning
//   a new group instead of refering to each type (UserGroupOld | NetgroupOld | Roles | HBACRulesOld |
//   SudoRulesOld | HostGroupOld).
interface MemberOfElement {
  hostGroup?: string;
  name: string;
  gid?: string;
  status?: string;
  description: string;
}

const MemberOfAddModal = (props: PropsToAdd) => {
  // Dual list data
  const data = props.availableData.map((d) => d.name);

  // Dual list selector
  const [availableOptions, setAvailableOptions] = useState<ReactNode[]>(data);
  const [chosenOptions, setChosenOptions] = useState<ReactNode[]>([]);

  const listChange = (
    newAvailableOptions: ReactNode[],
    newChosenOptions: ReactNode[]
  ) => {
    setAvailableOptions(newAvailableOptions.sort());
    setChosenOptions(newChosenOptions.sort());
    props.updateAvOptionsList(newAvailableOptions.sort());
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
    return props.availableData.find((d) => option === d.name);
  };

  // Add group option
  const onClickAddGroupHandler = () => {
    chosenOptions.map((opt) => {
      const optionData: MemberOfElement | undefined = getInfoFromGroupData(opt);
      if (optionData !== undefined) {
        // User groups
        if (props.tabData.tabName === "User groups") {
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
            gid: optionData.gid !== undefined && optionData.gid,
            status: optionData.status !== undefined && optionData.status,
          } as UserGroupOld);
          // Send updated data to table
          props.updateGroupRepository(props.groupRepository as UserGroupOld[]);
        }
        // Netgroups
        if (props.tabData.tabName === "Netgroups") {
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
            gid: optionData.gid !== undefined && optionData.gid,
            status: optionData.status !== undefined && optionData.status,
          } as NetgroupOld);
          // Send updated data to table
          props.updateGroupRepository(props.groupRepository as NetgroupOld[]);
        }
        // Roles
        if (props.tabData.tabName === "Roles") {
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
            gid: optionData.gid !== undefined && optionData.gid,
            status: optionData.status !== undefined && optionData.status,
          } as RolesOld);
          // Send updated data to table
          props.updateGroupRepository(props.groupRepository as RolesOld[]);
        }
        // HBAC rules
        if (props.tabData.tabName === "HBAC rules") {
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
            gid: optionData.gid !== undefined && optionData.gid,
            status: optionData.status !== undefined && optionData.status,
          } as HBACRulesOld);
          // Send updated data to table
          props.updateGroupRepository(props.groupRepository as HBACRulesOld[]);
        }
        // Sudo rules
        if (props.tabData.tabName === "Sudo rules") {
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
            gid: optionData.gid !== undefined && optionData.gid,
            status: optionData.status !== undefined && optionData.status,
          } as SudoRulesOld);
          // Send updated data to table
          props.updateGroupRepository(props.groupRepository as SudoRulesOld[]);
        }
        // Host groups
        if (props.tabData.tabName === "Host groups") {
          props.groupRepository.push({
            name: optionData.name !== undefined && optionData.name,
            description:
              optionData.description !== undefined && optionData.description,
          } as HostGroupOld);
          // Send updated data to table
          props.updateGroupRepository(props.groupRepository as HostGroupOld[]);
        }
      }
    });
    // Clean chosen options and close modal
    setChosenOptions([]);
    props.modalData.handleModalToggle();
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-user"
      variant="secondary"
      isDisabled={buttonDisabled}
      form="modal-form"
      onClick={onClickAddGroupHandler}
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-user"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render 'MemberOfaddModal'
  return (
    <ModalWithFormLayout
      dataCy="member-of-add-modal"
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
