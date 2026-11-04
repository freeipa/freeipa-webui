import React, { useEffect, useState } from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
import InputRequiredText from "../layouts/InputRequiredText";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { FindRPCResponse } from "../../services/rpc";
import {
  ViewAddPayload,
  useAddIDViewMutation,
} from "../../services/rpcIDViews";

interface PropsToAddIDView {
  onClose: () => void;
  onRefresh: () => void;
}

const AddIDViewModal = (props: PropsToAddIDView) => {
  const dispatch = useAppDispatch();
  const [executeViewAddCommand] = useAddIDViewMutation();

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [viewName, setViewName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (viewName === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [viewName]);

  const fields = [
    {
      id: "modal-form-id-view-name",
      name: "ID view name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-id-view-name"
          id="modal-form-id-view-name"
          name="modal-form-id-view-name"
          value={viewName}
          onChange={setViewName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-id-view-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-id-view-description"
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

  const addViewHandler = () => {
    setAddBtnSpinning(true);

    const newViewPayload = {
      viewName: viewName,
      description: description,
    } as ViewAddPayload;

    executeViewAddCommand(newViewPayload).then((view) => {
      if ("data" in view) {
        const data = view.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-id-view-error",
              title:
                "code" in error
                  ? "IPA error " + error.code + ": " + error.name
                  : "Error",
              variant: "danger",
            })
          );
        } else {
          dispatch(
            addAlert({
              name: "add-id-view-success",
              title: "New ID view added",
              variant: "success",
            })
          );
          props.onRefresh();
          props.onClose();
        }
      }
      setAddBtnSpinning(false);
    });
  };

  const onClose = () => {
    if (!addSpinning) {
      props.onClose();
    }
  };

  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-id-view"
      name="add"
      isDisabled={buttonDisabled || addSpinning}
      form="add-id-view-modal"
      type="submit"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-view"
      variant="link"
      onClick={onClose}
      isDisabled={addSpinning}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-id-view-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add ID view"
      formId="add-id-view-modal"
      fields={fields}
      show
      onSubmit={addViewHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddIDViewModal;
