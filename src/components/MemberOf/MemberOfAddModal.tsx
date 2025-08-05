import React, { ReactNode, useEffect, useState } from "react";
// PatternFly
import { Button, Form, FormGroup } from "@patternfly/react-core";
import { Modal, DualListSelector } from "@patternfly/react-core/deprecated";

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
  spinning: boolean;
}

const MemberOfAddModal = (props: PropsToAdd) => {
  // Dual list data
  const data = props.availableItems.map((d) => d.key);

  // Dual list selector
  const [availableOptions, setAvailableOptions] = useState<ReactNode[]>(data);
  const [chosenOptions, setChosenOptions] = useState<ReactNode[]>([]);

  // Update available and chosen options when props.availableItems changes
  useEffect(() => {
    const newAval = data.filter((d) => !chosenOptions.includes(d));
    setAvailableOptions(newAval);
  }, [props.availableItems]);

  // reset dialog on close
  useEffect(() => {
    if (!props.showModal) {
      cleanData();
    }
  }, [props.showModal]);

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
          onAvailableOptionsSearchInputChanged={(_event, searchText) =>
            props.onSearchTextChange(searchText)
          }
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
  const onClickAddHandler = () => {
    const optionsToAdd: AvailableItems[] = [];
    chosenOptions.map((opt) => {
      optionsToAdd.push({
        key: opt as string,
        title: opt as string,
      });
    });
    props.onAdd(optionsToAdd);
    setChosenOptions([]);
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-user"
      variant="secondary"
      isDisabled={buttonDisabled || props.spinning}
      form="modal-form"
      onClick={onClickAddHandler}
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={props.spinning}
    >
      {props.spinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-user"
      variant="link"
      onClick={props.onCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <Modal
      data-cy="member-of-add-modal"
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
