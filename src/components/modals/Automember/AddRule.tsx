import React from "react";
// PatternFly
import {
  Button,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Hooks
import { addAlert } from "src/store/alerts";
// RPC
import {
  AddPayload,
  useAddToAutomemberMutation,
} from "src/services/rpcAutomember";
import { useGetGenericListQuery } from "src/services/rpc";
// Data types
import { groupType } from "src/utils/datatypes/globalDataTypes";

interface PropsToAddRule {
  show: boolean;
  handleModalToggle: () => void;
  onOpenAddModal?: () => void;
  onCloseAddModal?: () => void;
  onRefresh?: () => void;
  groupsAvailableToAdd: string[];
  ruleType: string;
}

const AddRule = (props: PropsToAddRule) => {
  // API calls
  const [addRuleCommand] = useAddToAutomemberMutation();

  // States
  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [addAgainSpinning, setAddAgainBtnSpinning] =
    React.useState<boolean>(false);
  const [groupSelected, setGroupSelected] = React.useState("");
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);

  // Add button is disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  React.useEffect(() => {
    if (groupSelected === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [groupSelected]);

  // Assign groups to selector
  const groupsQuery = useGetGenericListQuery(props.ruleType);
  const groupsError = groupsQuery.error;
  const groupsData =
    (groupsQuery.data?.result.result as unknown as groupType[]) || [];

  React.useEffect(() => {
    if (groupsData && !groupsQuery.isFetching) {
      const groups: string[] = [];
      groupsData.map((group) => {
        groups.push(group.cn.toString());
      });
    }
  }, [groupsData, groupsQuery.isFetching]);

  // Set alery on error
  React.useEffect(() => {
    if (groupsError) {
      addAlert(
        "retrieve-groups-error",
        "Error while retrieving groups",
        "danger"
      );
    }
  }, [groupsError]);

  // Toggle
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy="modal-select-automember-toggle"
      ref={toggleRef}
      onClick={() => setIsSelectOpen(!isSelectOpen)}
      className="pf-v6-u-w-100"
      isExpanded={isSelectOpen}
    >
      {groupSelected}
    </MenuToggle>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelectGroup = (selection: any) => {
    setGroupSelected(selection.target.textContent);
    setIsSelectOpen(false);
  };

  // List of fields
  const fields = [
    {
      id: "automember",
      name: "Automember",
      pfComponent: (
        <Select
          data-cy="modal-select-automember"
          id="automember"
          toggle={toggle}
          onSelect={onSelectGroup}
          selected={groupSelected}
          isOpen={isSelectOpen}
          aria-labelledby="automember-group-add"
        >
          <SelectList>
            {props.groupsAvailableToAdd.map((option, index) => (
              <SelectOption
                data-cy={"modal-select-automember-" + option}
                key={index}
                value={option}
              >
                {option}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      ),
    },
  ];

  const cleanFields = () => {
    setGroupSelected("");
    setIsSelectOpen(false);
    setAddBtnSpinning(false);
    setAddAgainBtnSpinning(false);
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanFields();
    props.handleModalToggle();
  };

  // Add
  const onAdd = () => {
    const addPayload: AddPayload = {
      group: groupSelected,
      type: props.ruleType,
    };

    setAddBtnSpinning(true);
    addRuleCommand(addPayload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const error = data?.error as FetchBaseQueryError | SerializedError;

        if (error) {
          addAlert("add-rule-error", JSON.stringify(error, null, 2), "danger");
        } else {
          // Set alert: success
          addAlert("add-rule-success", "Entry successfully added", "success");
          setAddBtnSpinning(true);

          // Refresh table content
          if (props.onRefresh !== undefined) props.onRefresh();
          // Clean and close modal
          cleanAndCloseModal();
        }
      }
    });
  };

  // Add and add another
  const onAddAndAddAnother = () => {
    const addPayload: AddPayload = {
      group: groupSelected,
      type: props.ruleType,
    };

    setAddAgainBtnSpinning(true);
    addRuleCommand(addPayload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const error = data?.error as FetchBaseQueryError | SerializedError;

        if (error) {
          addAlert("add-rule-error", JSON.stringify(error, null, 2), "danger");
        } else {
          // Set alert: success
          addAlert("add-rule-success", "Entry successfully added", "success");
          setAddAgainBtnSpinning(false);

          // Clean fields and refresh table
          cleanFields();
          if (props.onRefresh) props.onRefresh();
        }
      }
    });
  };

  const modalActions = [
    <SecondaryButton
      dataCy={"modal-button-add"}
      key="add"
      onClickHandler={onAdd}
      isLoading={addSpinning}
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isDisabled={buttonDisabled}
    >
      Add
    </SecondaryButton>,
    <SecondaryButton
      dataCy={"modal-button-add-and-add-another"}
      key="add-another"
      onClickHandler={onAddAndAddAnother}
      isLoading={addAgainSpinning}
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isDisabled={buttonDisabled}
    >
      Add and add another
    </SecondaryButton>,
    <Button
      data-cy={"modal-button-cancel"}
      key="cancel-new-rule"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <ModalWithFormLayout
        dataCy={"add-rule-modal"}
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add rule"
        formId="add-rule-modal"
        fields={fields}
        show={props.show}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
    </>
  );
};

export default AddRule;
