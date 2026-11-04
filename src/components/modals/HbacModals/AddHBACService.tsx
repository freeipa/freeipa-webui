import React, { useEffect, useState } from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { BatchRPCResponse } from "src/services/rpc";
import { useAddHbacServiceMutation } from "src/services/rpcHBACServices";

interface PropsToAddGroup {
  onClose: () => void;
  onRefresh: () => void;
}

const AddHBACService = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();
  const [executeServiceAddCommand] = useAddHbacServiceMutation();

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [serviceName, setServiceName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (serviceName === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [serviceName]);

  const fields = [
    {
      id: "modal-form-service-name",
      name: "Service name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-service-name"
          id="modal-form-service-name"
          name="modal-form-service-name"
          value={serviceName}
          onChange={setServiceName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-service-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          id="modal-form-service-desc"
          name="modal-form-service-desc"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          data-cy="modal-textbox-description"
          aria-label="Service description"
          autoResize
        />
      ),
    },
  ];

  const addServiceHandler = () => {
    setAddBtnSpinning(true);
    executeServiceAddCommand([serviceName, description]).then((service) => {
      if ("data" in service) {
        const data = service.data as BatchRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-hbacservice-error",
              title:
                "code" in error
                  ? "IPA error " + error.code + ": " + error.name
                  : "An error occurred",
              variant: "danger",
            })
          );
        } else {
          dispatch(
            addAlert({
              name: "add-hbacservice-success",
              title: "New HBAC service added",
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
      key="add-new-service"
      name="add"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="add-hbac-service-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-service"
      variant="link"
      onClick={onClose}
      isDisabled={addSpinning}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-hbac-service-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add HBAC service"
      formId="add-hbac-service-modal"
      fields={fields}
      show
      onSubmit={addServiceHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddHBACService;
