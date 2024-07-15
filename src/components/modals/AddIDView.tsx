/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  HelperText,
  HelperTextItem,
  TextArea,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Data types
import { IDView } from "../../utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "./ErrorModal";
// Redux
import { useAppDispatch } from "../../store/hooks";
import { addGroup } from "../../store/Identity/hostGroups-slice";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Hooks
import useAlerts from "../../hooks/useAlerts";
import { FindRPCResponse } from "../../services/rpc";
import {
  ViewAddPayload,
  useAddIDViewMutation,
} from "../../services/rpcIDViews";
interface PropsToAddIDView {
  show: boolean;
  handleModalToggle: () => void;
  onOpenAddModal?: () => void;
  onCloseAddModal?: () => void;
  onRefresh?: () => void;
}

const AddIDViewModal = (props: PropsToAddIDView) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts to show in the UI
  const alerts = useAlerts();

  const [executeViewAddCommand] = useAddIDViewMutation();

  // Set host names list
  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [addAgainSpinning, setAddAgainBtnSpinning] =
    React.useState<boolean>(false);
  const [viewName, setViewName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Add button is disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (viewName === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [viewName]);

  // List of fields
  const fields = [
    {
      id: "id-view-name",
      name: "ID view name",
      pfComponent: (
        <>
          <TextInput
            type="text"
            id="modal-form-id-view-name"
            name="modal-form-id-view-name"
            value={viewName}
            onChange={(_event, value: string) => setViewName(value)}
            validated={
              viewName === ""
                ? ValidatedOptions.error
                : ValidatedOptions.default
            }
          />
          <HelperText>
            {viewName === "" && <HelperTextItem>Required value</HelperTextItem>}
          </HelperText>
        </>
      ),
    },
    {
      id: "id-view-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          id="modal-form-id-view-desc"
          name="modal-form-id-view-desc"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          aria-label="ID view description"
          autoResize
        />
      ),
    },
  ];

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setViewName("");
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

  // Track which button has been clicked ('onAddUser' or 'onAddAndAddAnother')
  // to better handle the 'retry' function and its behavior
  let onAddViewClicked = true;

  // Add host data
  const addViewData = async () => {
    const newViewPayload = {
      viewName: viewName,
      description: description,
    } as ViewAddPayload;

    // Add host via API call
    await executeViewAddCommand(newViewPayload).then((view) => {
      if ("data" in view) {
        const data = view.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;
        const result = data.result;

        if (error) {
          // Set status flag: error
          isAdditionSuccess = false;
          // Handle error
          handleAPIError(error);
        } else {
          // Set alert: success
          alerts.addAlert(
            "add-id-view-success",
            "New ID view added",
            "success"
          );

          // Dispatch host data to redux
          const newView = result.result as unknown as IDView;
          dispatch(addGroup(newView));
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
    onAddViewClicked = false;
    setAddAgainBtnSpinning(true);
    addViewData().then(() => {
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

  const addViewHandler = () => {
    onAddViewClicked = true;
    setAddBtnSpinning(true);
    addViewData().then(() => {
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
    if (onAddViewClicked) {
      addViewHandler();
    } else {
      addAndAddAnotherHandler();
    }
  };

  const errorModalActions = [
    <SecondaryButton key="retry" onClickHandler={onRetry}>
      Retry
    </SecondaryButton>,
    <Button key="cancel" variant="link" onClick={onCloseErrorModal}>
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
    <SecondaryButton
      key="add-new-id-view"
      name="add"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      onClickHandler={addViewHandler}
      form="modal-form"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </SecondaryButton>,
    <SecondaryButton
      key="add-and-add-another-new-view"
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
    <Button key="cancel-new-view" variant="link" onClick={cleanAndCloseModal}>
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add ID view"
        formId="add-id-view-modal"
        fields={fields}
        show={props.show}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
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

export default AddIDViewModal;
