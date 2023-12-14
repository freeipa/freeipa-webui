import React, { ReactNode, useEffect, useState } from "react";
// PaternFly
import { Button, DualListSelector } from "@patternfly/react-core";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
import SecondaryButton from "../layouts/SecondaryButton";

interface ModalData {
  showModal: boolean;
  handleModalToggle: () => void;
}

interface TabData {
  tabName: string;
  elementName: string;
}

interface PropsToAddModal {
  modalData: ModalData;
  availableData: Host[];
  groupRepository: unknown[];
  updateGroupRepository: (args: Host[]) => void;
  updateAvOptionsList: (args: unknown[]) => void;
  tabData: TabData;
}

interface ManagedByElement {
  fqdn?: string;
}

const ManagedByAddModal = (props: PropsToAddModal) => {
  // Dual list data
  const data = props.availableData.map((d) => d.fqdn);

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
          onListChange={(_event, newAvailableOptions: ReactNode[], newChosenOptions: ReactNode[]) => listChange(newAvailableOptions, newChosenOptions)}
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
    return props.availableData.find((d) => option === d.fqdn);
  };

  // Add group option
  const onClickAddGroupHandler = () => {
    chosenOptions.map((opt) => {
      const optionData: ManagedByElement | undefined =
        getInfoFromGroupData(opt);
      if (optionData !== undefined) {
        // Host groups
        if (props.tabData.tabName === "Hosts") {
          props.groupRepository.push({
            hostName: optionData.fqdn !== undefined && optionData.fqdn,
          } as Host);
          // Send updated data to table
          props.updateGroupRepository(props.groupRepository as Host[]);
        }
      }
    });
    // Clean chosen options and close modal
    setChosenOptions([]);
    props.modalData.handleModalToggle();
  };

  // Utility: Convert the tab name by removing the last character and transforming into lower case
  //  - Eg: 'Hosts' -> 'host'
  const convertedTabName = props.tabData.tabName.slice(0, -1).toLowerCase();

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      key={"add-new-" + convertedTabName}
      isDisabled={buttonDisabled}
      form="modal-form"
      onClickHandler={onClickAddGroupHandler}
    >
      Add
    </SecondaryButton>,
    <Button
      key={"cancel-add-new-" + convertedTabName}
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title={
        "Add " +
        props.tabData.tabName.toLowerCase() +
        " managing " +
        convertedTabName +
        " '" +
        props.tabData.elementName +
        "'"
      }
      formId="is-managed-by-add-modal"
      fields={fields}
      show={props.modalData.showModal}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default ManagedByAddModal;
