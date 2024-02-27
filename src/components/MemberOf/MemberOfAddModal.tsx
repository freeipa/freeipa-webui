import React, { ReactNode, useEffect, useState } from "react";
// PatternFly
import {
  Button,
  DualListSelector,
  Form,
  FormGroup,
  Modal,
} from "@patternfly/react-core";

export interface AvailableItems {
  key: string;
  title: string;
}

export interface PropsToAdd {
  showModal: boolean;
  onCloseModal: () => void;
  availableItems: AvailableItems[];
  onAdd: (items: AvailableItems[]) => void;
  onSearchTextChange: (searchText: string) => void;
  title: string;
  ariaLabel: string;
}

const MemberOfAddModal = (props: PropsToAdd) => {
  // Dual list data
  const data = props.availableItems.map((d) => d.key);

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
      name: "Available options",
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
    props.onCloseModal();
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

  // Add group option
  const onClickAddGroupHandler = () => {
    const optionsToAdd: AvailableItems[] = [];
    chosenOptions.map((opt) => {
      optionsToAdd.push({
        key: opt as string,
        title: opt as string,
      });
    });
    props.onAdd(optionsToAdd);
    // Clean chosen options and close modal
    setChosenOptions([]);
    props.onCloseModal();
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

  return (
    <Modal
      variant={"medium"}
      position={"top"}
      positionOffset={"76px"}
      isOpen={props.showModal}
      onClose={props.onCloseModal}
      actions={modalActions}
      title={props.title}
      aria-label={props.ariaLabel}
    >
      <Form id={"is-member-of-add-modal"}>
        {fields.map((field) => (
          <FormGroup key={field.id} fieldId={field.id}>
            {field.pfComponent}
          </FormGroup>
        ))}
      </Form>
    </Modal>
  );
};

export default MemberOfAddModal;
