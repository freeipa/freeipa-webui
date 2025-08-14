import React from "react";
// PatternFly
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";
// Components
import DualListSelectorGeneric, {
  DualListOption,
  optionsToDualListOptions,
} from "../layouts/DualListSelectorGeneric";

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

  // States
  const [availableOptions, setAvailableOptions] = React.useState<
    DualListOption[]
  >(optionsToDualListOptions(data));
  const [chosenOptions, setChosenOptions] = React.useState<DualListOption[]>(
    []
  );

  // Update available and chosen options when props.availableItems changes
  React.useEffect(() => {
    const newAval = data.filter(
      (d) => !chosenOptions.map((o) => o.text).includes(d)
    );
    setAvailableOptions(optionsToDualListOptions(newAval));
  }, [props.availableItems]);

  // reset dialog on close
  React.useEffect(() => {
    if (!props.showModal) {
      cleanData();
    }
  }, [props.showModal]);

  const fields = [
    {
      id: "dual-list-selector",
      name: "Available options",
      pfComponent: (
        <DualListSelectorGeneric
          id="add-modal-dual-list-selector"
          availableOptions={availableOptions}
          setAvailableOptions={setAvailableOptions}
          chosenOptions={chosenOptions}
          setChosenOptions={setChosenOptions}
        />
      ),
    },
  ];

  // When clean data, set to original values
  const cleanData = () => {
    setAvailableOptions(optionsToDualListOptions(data));
    setChosenOptions([]);
  };

  // Buttons are disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  React.useEffect(() => {
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
        key: opt.text,
        title: opt.text,
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
      aria-label={props.ariaLabel}
    >
      <ModalHeader title={props.title} labelId="member-of-add-modal-title" />
      <ModalBody id="member-of-add-modal-body">
        <Form id={"is-member-of-add-modal"}>
          {fields.map((field) => (
            <FormGroup key={field.id} fieldId={field.id}>
              {field.pfComponent}
            </FormGroup>
          ))}
        </Form>
      </ModalBody>
      <ModalFooter>{modalActions}</ModalFooter>
    </Modal>
  );
};

export default MemberOfAddModal;
