import React, { useEffect, useState } from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import { BatchRPCResponse } from "src/services/rpc";
import { useAddSudoCmdGroupsMutation } from "src/services/rpcSudoCmdGroups";

interface PropsToAddGroup {
  show: boolean;
  handleModalToggle: () => void;
  onOpenAddModal?: () => void;
  onCloseAddModal?: () => void;
  onRefresh?: () => void;
}

const AddSudoCmdGroup = (props: PropsToAddGroup) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const [executeGroupAddCommand] = useAddSudoCmdGroupsMutation();

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [addAgainSpinning, setAddAgainBtnSpinning] =
    React.useState<boolean>(false);
  const [cmdGroupName, setCmdGroupName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Add button is disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (cmdGroupName === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [cmdGroupName]);

  // List of fields
  const fields = [
    {
      id: "modal-form-cmd-grp-name",
      name: "Command group name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-cmd-grp-name"
          id="modal-form-cmd-grp-name"
          name="modal-form-cmd-grp-name"
          value={cmdGroupName}
          onChange={setCmdGroupName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-cmd-grp-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-cmd-grp-desc"
          id="modal-form-cmd-grp-desc"
          name="modal-form-cmd-grp-desc"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          aria-label="Sudo command group description"
          autoResize
        />
      ),
    },
  ];

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setCmdGroupName("");
    setDescription("");
    setAddBtnSpinning(false);
    setAddAgainBtnSpinning(false);
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanAllFields();
    props.handleModalToggle();
  };

  // Define status flags to determine user added successfully or error
  let isAdditionSuccess = true;

  // Track which button has been clicked ('onAdd' or 'onAddAndAddAnother')
  // to better handle the 'retry' function and its behavior
  let onAddCmdGroupClicked = true;

  // Add host data
  const addCmdGroupData = async () => {
    // Add host via API call
    await executeGroupAddCommand([cmdGroupName, description]).then((cmd) => {
      if ("data" in cmd) {
        const data = cmd.data as BatchRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          // Set status flag: error
          isAdditionSuccess = false;
          // Handle error
          handleAPIError(error);
        } else {
          // Set alert: success
          alerts.addAlert(
            "add-sudo-cmd-grp-success",
            "New sudo command group added",
            "success"
          );

          // Set status flag: success
          isAdditionSuccess = true;
          // Refresh data
          if (props.onRefresh !== undefined) {
            props.onRefresh();
          }
        }
      }
    });
  };

  const addAndAddAnotherHandler = () => {
    onAddCmdGroupClicked = false;
    setAddAgainBtnSpinning(true);
    addCmdGroupData().then(() => {
      if (isAdditionSuccess) {
        // Do not close the modal, but clean fields & reset validations
        cleanAllFields();
      } else {
        // Close the modal without cleaning fields
        if (props.onCloseAddModal !== undefined) {
          props.onCloseAddModal();
        }
        setAddAgainBtnSpinning(false);
      }
    });
  };

  const addCmdGroupHandler = () => {
    onAddCmdGroupClicked = true;
    setAddBtnSpinning(true);
    addCmdGroupData().then(() => {
      if (!isAdditionSuccess) {
        // Close the modal without cleaning fields
        if (props.onCloseAddModal !== undefined) {
          props.onCloseAddModal();
        }
        setAddBtnSpinning(false);
      } else {
        // Clean data and close modal
        cleanAndCloseModal();
      }
    });
  };

  // Error handling
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
    // Show Add modal
    if (props.onOpenAddModal !== undefined) {
      props.onOpenAddModal();
    }
  };

  const onRetry = () => {
    // Keep the add modal closed until the operation is done...
    if (props.onCloseAddModal !== undefined) {
      props.onCloseAddModal();
    }

    // Close the error modal
    closeAndCleanErrorParameters();

    // Repeats the same previous operation
    if (onAddCmdGroupClicked) {
      addCmdGroupHandler();
    } else {
      addAndAddAnotherHandler();
    }
  };

  const errorModalActions = [
    <SecondaryButton
      key="retry"
      onClickHandler={onRetry}
      dataCy="modal-button-retry"
    >
      Retry
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onCloseErrorModal}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("code" in error) {
      setErrorTitle("IPA error " + error.code + ": " + error.name);
      if (error.message !== undefined) {
        setErrorMessage(error.message);
      }
    }
    setIsModalErrorOpen(true);
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-cmd"
      name="add"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      type="submit"
      form="add-sudo-cmd-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <SecondaryButton
      dataCy="modal-button-add-and-add-another"
      key="add-and-add-another-new-cmd"
      name="add_and_add_another"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      onClickHandler={addAndAddAnotherHandler}
      form="modal-form"
      spinnerAriaValueText="Adding again"
      spinnerAriaLabel="Adding again"
      isLoading={addAgainSpinning}
    >
      {addAgainSpinning ? "Adding" : "Add and add another"}
    </SecondaryButton>,
    <Button
      key="cancel-new-cmd"
      variant="link"
      onClick={cleanAndCloseModal}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        dataCy="add-sudo-cmd-group-modal"
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add sudo command group"
        formId="add-sudo-cmd-modal"
        fields={fields}
        show={props.show}
        onSubmit={addCmdGroupHandler}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="add-sudo-cmd-group-modal-error"
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default AddSudoCmdGroup;
