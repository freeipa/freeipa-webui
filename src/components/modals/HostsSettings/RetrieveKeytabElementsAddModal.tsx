import React, { ReactNode, useEffect, useState } from "react";
// PatternFly
import { Button, DualListSelector } from "@patternfly/react-core";
// Layout
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";

interface PropsToAddModal {
  host: string;
  elementType: string;
  operationType: string;
  showModal: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
  availableData: string[];
  updateAvailableData: (newAvailableData: unknown[]) => void;
  updateSelectedElements: (newSelectedElements: string[]) => void;
  tableElementsList: string[];
  updateTableElementsList: (newTableElementsList: string[]) => void;
}

const RetrieveKeytabElementsAddModal = (props: PropsToAddModal) => {
  // Dual list data
  const data = props.availableData;

  // Dual list selector
  const [availableOptions, setAvailableOptions] = useState<ReactNode[]>(
    data.sort()
  );
  const [chosenOptions, setChosenOptions] = useState<ReactNode[]>([]);

  const listChange = (
    newAvailableOptions: ReactNode[],
    newChosenOptions: ReactNode[]
  ) => {
    setAvailableOptions(newAvailableOptions.sort());
    setChosenOptions(newChosenOptions.sort());
    // The recently added entries are removed from the available data options
    props.updateAvailableData(newAvailableOptions.sort());
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
    props.updateSelectedElements([]);
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanData();
    props.onCloseModal();
  };

  // Buttons are disabled until all the required fields are filled
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (chosenOptions.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [chosenOptions]);

  // Add element to the list
  const addElementToList = () => {
    const itemsToAdd: string[] = [];
    const newTableElementsList = props.tableElementsList;
    chosenOptions.map((opt) => {
      if (opt !== undefined && opt !== null) {
        itemsToAdd.push(opt.toString());
        newTableElementsList.push(opt.toString());
      }
    });
    props.updateTableElementsList(newTableElementsList);
    props.updateSelectedElements([]);
    cleanAndCloseModal();
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      key={"add-new-" + props.elementType}
      isDisabled={buttonDisabled}
      form="modal-form"
      onClickHandler={addElementToList}
    >
      Add
    </SecondaryButton>,
    <Button
      key={"cancel-new-" + props.elementType}
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
      title={
        "Allow " +
        props.elementType +
        "s to " +
        props.operationType +
        " keytab of " +
        props.host
      }
      formId={
        props.operationType + "-keytab-" + props.elementType + "s-add-modal"
      }
      fields={fields}
      show={props.showModal}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default RetrieveKeytabElementsAddModal;
