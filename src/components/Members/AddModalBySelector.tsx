import React, { ReactNode } from "react";
// PatternFly
import {
  Button,
  DualListSelector,
  Form,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Modal,
  Select,
  SelectOption,
} from "@patternfly/react-core";
// Utils
import { AvailableItems } from "../MemberOf/MemberOfAddModal";
import { UserIDOverride } from "src/utils/datatypes/globalDataTypes";
import { useGetUserIdOverridesInfoByIdViewMutation } from "src/services/rpcUserIdOverrides";

export interface PropsToAdd {
  showModal: boolean;
  onCloseModal: () => void;
  availableItemsSelector: AvailableItems[];
  onAdd: (items: AvailableItems[]) => void;
  onSearchTextChange: (searchText: string) => void;
  title: string;
  ariaLabel: string;
  spinning: boolean;
}

const AddModalBySelector = (props: PropsToAdd) => {
  // API call
  const [getUidOverrides] = useGetUserIdOverridesInfoByIdViewMutation();

  // List of User Id Overrides associated to the selected id view
  const [uidOverridesList, setUidOverridesList] = React.useState<
    UserIDOverride[]
  >([]);

  // Selector data
  const availableOptionsSelector = props.availableItemsSelector.map(
    (d) => d.key
  );

  // Selector
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [idViewSelected, setIdViewSelected] = React.useState(
    props.availableItemsSelector[0].title || ""
  ); // By default: first item

  const serviceOnToggle = () => {
    setIsSelectorOpen(!isSelectorOpen);
  };

  const toggleIDView = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={serviceOnToggle}
      className="pf-v5-u-w-100"
    >
      {idViewSelected}
    </MenuToggle>
  );

  const onChangeSelector = (_event, value) => {
    setIdViewSelected(value as string);
    setIsSelectorOpen(false);
  };

  // Perform API call to get available idOverride data when the selector's value changes
  React.useEffect(() => {
    getUidOverrides(idViewSelected).then((result) => {
      if ("data" in result) {
        setUidOverridesList(result.data);
        setAvailableOptionsDualList(result.data);
        setChosenOptionsDualList([]);
      }
    });
  }, [idViewSelected]);

  // reset dialog on close
  React.useEffect(() => {
    if (!props.showModal) {
      cleanData();
    }
  }, [props.showModal]);

  const listChange = (
    newAvailableOptions: ReactNode[],
    newChosenOptions: ReactNode[]
  ) => {
    setAvailableOptionsDualList(newAvailableOptions.sort());
    setChosenOptionsDualList(newChosenOptions.sort());
  };

  // Manage data shown in Dual list selector
  const getAvailableOptionsDualListSelector = () => {
    const result = uidOverridesList.map((item) => item.ipaoriginaluid);
    return result as ReactNode[];
  };

  // Dual list data
  const [availableOptionsDualList, setAvailableOptionsDualList] =
    React.useState<ReactNode[]>(getAvailableOptionsDualListSelector());
  const [chosenOptionsDualList, setChosenOptionsDualList] = React.useState<
    ReactNode[]
  >([]);

  const cleanData = () => {
    setAvailableOptionsDualList(getAvailableOptionsDualListSelector());
    setChosenOptionsDualList([]);
  };

  // Update available and chosen options when props.availableItemsSelector changes
  React.useEffect(() => {
    const newAval = uidOverridesList.filter(
      (d) => !chosenOptionsDualList.includes(d.ipaoriginaluid)
    );
    setAvailableOptionsDualList(newAval.map((item) => item.ipaoriginaluid));
  }, [uidOverridesList]);

  const fields = [
    {
      id: "selector",
      name: "Selector",
      pfComponent: (
        <Select
          id="id-view-selector"
          aria-label="Select ID View"
          toggle={toggleIDView}
          onSelect={onChangeSelector}
          selected={idViewSelected}
          isOpen={isSelectorOpen}
          aria-labelledby="idview-selector"
        >
          {availableOptionsSelector.map((option, index) => (
            <SelectOption key={index} value={option}>
              {option}
            </SelectOption>
          ))}
        </Select>
      ),
    },
    {
      id: "dual-list-selector",
      name: "Available options",
      pfComponent: (
        <DualListSelector
          isSearchable
          availableOptions={availableOptionsDualList}
          chosenOptions={chosenOptionsDualList}
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

  // Buttons are disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  React.useEffect(() => {
    if (chosenOptionsDualList.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [chosenOptionsDualList]);

  // Add option
  const onClickAddHandler = () => {
    const optionsToAdd: AvailableItems[] = [];
    chosenOptionsDualList.map((opt) => {
      optionsToAdd.push({
        key: opt as string,
        title: opt as string,
      });
    });
    props.onAdd(optionsToAdd);
    setChosenOptionsDualList([]);
    props.onCloseModal();
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      key="add-new-user-id-override"
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
      key="cancel-new-user-id-override"
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

export default AddModalBySelector;
