import React from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
// RPC
import { useAddRoleMutation } from "src/services/rpcRoles";
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

const AddRoleModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addRole] = useAddRoleMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [roleName, setRoleName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Clear fields
  const clearFields = () => {
    setRoleName("");
    setDescription("");
  };

  // 'Add' button handler
  const onAddRole = () => {
    setIsAddButtonSpinning(true);

    addRole({
      cn: roleName,
      description: description || undefined,
    }).then((response) => {
      if ("data" in response) {
        const data = response.data?.result;
        const error = response.data?.error as SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-role-error",
              title: error.message,
              variant: "danger",
            })
          );
        }

        if (data) {
          dispatch(
            addAlert({
              name: "add-role-success",
              title: "New role added",
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
      id: "modal-form-role-name",
      name: "Role name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-role-name"
          id="modal-form-role-name"
          name="cn"
          value={roleName}
          onChange={setRoleName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-role-description",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-description"
          id="modal-form-role-description"
          name="description"
          value={description}
          aria-label="Role description"
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
      isDisabled={isAddButtonSpinning || roleName === ""}
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
    <>
      <ModalWithFormLayout
        dataCy="add-role-modal"
        variantType={"small"}
        modalPosition={"top"}
        offPosition={"76px"}
        title={props.title}
        formId="add-modal-form"
        fields={fields}
        show={props.isOpen}
        onSubmit={() => onAddRole()}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
    </>
  );
};

export default AddRoleModal;
