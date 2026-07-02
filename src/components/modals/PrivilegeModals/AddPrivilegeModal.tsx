import React from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
// RPC
import { useAddPrivilegeMutation } from "src/services/rpcPrivileges";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddPrivilegeModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addPrivilege] = useAddPrivilegeMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [privilegeName, setPrivilegeName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Clear fields
  const clearFields = () => {
    setPrivilegeName("");
    setDescription("");
  };

  // 'Add' button handler
  const onAddPrivilege = () => {
    setIsAddButtonSpinning(true);

    addPrivilege({
      cn: privilegeName,
      description: description || undefined,
    }).then((response) => {
      if ("data" in response) {
        const data = response.data?.result;
        const error = response.data?.error as SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-privilege-error",
              title: error.message,
              variant: "danger",
            })
          );
        }

        if (data) {
          dispatch(
            addAlert({
              name: "add-privilege-success",
              title: "New privilege added",
              variant: "success",
            })
          );
          // Reset fields
          clearFields();
          // Update data
          props.onRefresh();
          props.onClose();
        }
      }
      // Reset button spinner
      setIsAddButtonSpinning(false);
    });
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "modal-form-privilege-name",
      name: "Privilege name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-privilege-name"
          id="modal-form-privilege-name"
          name="cn"
          value={privilegeName}
          onChange={setPrivilegeName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-privilege-description",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-description"
          id="modal-form-privilege-description"
          name="description"
          value={description}
          aria-label="Privilege description"
          onChange={(_event, value: string) => setDescription(value)}
          autoResize
        />
      ),
    },
  ];

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={isAddButtonSpinning || privilegeName === ""}
      form="add-modal-form"
      type="submit"
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-privilege-modal"
      variantType={"small"}
      modalPosition={"top"}
      offPosition={"76px"}
      title={props.title}
      formId="add-modal-form"
      fields={fields}
      show={props.isOpen}
      onSubmit={() => onAddPrivilege()}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddPrivilegeModal;
