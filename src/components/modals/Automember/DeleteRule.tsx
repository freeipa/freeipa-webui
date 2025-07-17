import React from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Data types
import { AutomemberEntry } from "src/utils/datatypes/globalDataTypes";
// RPC
import {
  RemovePayload,
  useDeleteFromAutomemberMutation,
} from "src/services/rpcAutomember";

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

interface SelectedData {
  selectedItems: AutomemberEntry[];
  clearSelected: () => void;
}

interface PropsToDeleteRule {
  show: boolean;
  handleModalToggle: () => void;
  selectedData: SelectedData;
  buttonsData: ButtonsData;
  onRefresh?: () => void;
  ruleType: string;
}

const DeleteRule = (props: PropsToDeleteRule) => {
  // Alerts
  const alerts = useAlerts();

  // RPC
  const [deleteRuleCommand] = useDeleteFromAutomemberMutation();

  // Define the column names that will be displayed on the confirmation table.
  const deleteColumnNames = ["Automember rule", "Description"];

  // States
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // Computed data
  const rulesToDelete = props.selectedData.selectedItems.map((idRule) => {
    return idRule.automemberRule;
  });

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to remove the selected rules?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "deleted-rules-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_id"
          elementsToDelete={rulesToDelete}
          columnNames={deleteColumnNames}
          elementType="rule"
          idAttr="automemberRule"
        />
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  // Delete
  const onDelete = () => {
    setBtnSpinning(true);

    const deletePayload: RemovePayload = {
      groups: rulesToDelete,
      type: props.ruleType,
    };

    deleteRuleCommand(deletePayload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        const error = data?.error as FetchBaseQueryError | SerializedError;

        if (error) {
          alerts.addAlert(
            "delete-rule-error",
            JSON.stringify(error, null, 2),
            "danger"
          );
        } else {
          // Set alert: success
          alerts.addAlert(
            "delete-rule-success",
            "The selected rules have been removed successfully",
            "success"
          );
          setBtnSpinning(false);

          // Refresh data
          if (props.onRefresh !== undefined) {
            props.onRefresh();
          }

          // Close modal
          closeModal();
        }
      }
    });
  };

  // Set the Modal and Action buttons for 'Delete' option
  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-delete"
      key="delete-rules"
      variant="danger"
      onClick={onDelete}
      form="delete-rules-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-delete-rules"
      variant="link"
      onClick={closeModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        dataCy="delete-rule-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove auto membership rules"
        formId="remove-rules-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalActionsDelete}
      />
    </>
  );
};

export default DeleteRule;
