import React, { ReactNode, useEffect, useState } from "react";
// PatternFly
import { Button, DualListSelector } from "@patternfly/react-core";
// Modals
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Data types
import {
  UserGroup,
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
} from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
import { setShowAddModal } from "src/store/shared/activeUsersMemberOf-slice";

export interface PropsToAdd {
  show: boolean;
  availableData: UserGroup[] | Netgroup[] | Roles[] | HBACRules[] | SudoRules[];
  userGroupData: unknown[];
  updateGroupRepository: (
    args: UserGroup[] | Netgroup[] | Roles[] | HBACRules[] | SudoRules[]
  ) => void;
  updateAvOptionsList: (args: unknown[]) => void;
  userName: string;
}

// Although tabs data types habe been already defined, it is not possible to access to all
//  its variables. Just the mandatory ones ('name' and 'description') are accessible at this point.
// To display all the possible data types for all the tabs (and not only the mandatory ones)
//   an extra interface 'MemberOfElement' will be defined. This will be called when assigning
//   a new group instead of refering to each type (UserGroup | Netgroup | Roles | HBACRules |
//   SudoRules).
interface MemberOfElement {
  name: string;
  gid?: string;
  status?: string;
  description: string;
}

const MemberOfAddModal = (props: PropsToAdd) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve shared data (Redux)
  const showAddModal = useAppSelector(
    (state) => state.activeUsersMemberOfShared.showAddModal
  );
  const tabName = useAppSelector(
    (state) => state.activeUsersMemberOfShared.tabName
  );
  const userGroupsRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.userGroupsRepository
  );
  const netgroupsRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.netgroupsRepository
  );
  const rolesRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.rolesRepository
  );
  const hbacRulesRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.hbacRulesRepository
  );
  const sudoRulesRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.sudoRulesRepository
  );

  // Set Modal toggle
  const onModalToggle = () => {
    dispatch(setShowAddModal(!showAddModal));
  };

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
          onListChange={listChange}
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
    onModalToggle();
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
    // Copy of the repository to add new data
    let repositoryCopy: unknown[] = [];
    // Define a general 'groupRepository' variable to assign the
    //  right repository depending on the 'tabName'.
    let groupRepository: unknown[] = [];
    switch (tabName) {
      case "User groups":
        groupRepository = [...userGroupsRepository] as UserGroup[];
        break;
      case "Netgroups":
        groupRepository = [...netgroupsRepository] as Netgroup[];
        break;
      case "Roles":
        groupRepository = [...rolesRepository] as Roles[];
        break;
      case "HBAC rules":
        groupRepository = [...hbacRulesRepository] as HBACRules[];
        break;
      case "Sudo rules":
        groupRepository = [...sudoRulesRepository] as SudoRules[];
        break;
    }
    // Add the chosed options to the repository list
    chosenOptions.map((opt) => {
      const optionData: MemberOfElement | undefined = getInfoFromGroupData(opt);
      if (optionData !== undefined) {
        repositoryCopy =
          repositoryCopy.length === 0
            ? [...groupRepository]
            : [...repositoryCopy];
        repositoryCopy.push({
          name: optionData.name !== undefined && optionData.name,
          description:
            optionData.description !== undefined && optionData.description,
          gid: optionData.gid !== undefined && optionData.gid,
          status: optionData.status !== undefined && optionData.status,
        });
        // Send updated data to table (specifying the group data type)
        switch (tabName) {
          case "User groups":
            props.updateGroupRepository(repositoryCopy as UserGroup[]);
            break;
          case "Netgroups":
            props.updateGroupRepository(repositoryCopy as Netgroup[]);
            break;
          case "Roles":
            props.updateGroupRepository(repositoryCopy as Roles[]);
            break;
          case "HBAC rules":
            props.updateGroupRepository(repositoryCopy as HBACRules[]);
            break;
          case "Sudo rules":
            props.updateGroupRepository(repositoryCopy as SudoRules[]);
            break;
        }
      }
    });
    // Clean chosen options and close modal
    setChosenOptions([]);
    onModalToggle();
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
      title={"Add user '" + props.userName + "' into " + tabName}
      formId="is-member-of-add-modal"
      fields={fields}
      show={props.show}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default MemberOfAddModal;
