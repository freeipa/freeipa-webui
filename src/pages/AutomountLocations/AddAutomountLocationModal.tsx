import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
// Redux
import { useAppDispatch } from "src/store/hooks";
// RPC
import { addAlert } from "src/store/Global/alerts-slice";
import {
  AutomountLocationAddPayload,
  useAddAutomountLocationMutation,
} from "src/services/rpcAutomountLocations";
// Errors
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToAddAutomountLocationModal {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const AddAutomountLocationModal = (props: PropsToAddAutomountLocationModal) => {
  const dispatch = useAppDispatch();

  const [addLocation] = useAddAutomountLocationMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] =
    React.useState<boolean>(false);
  const [locationName, setLocationName] = React.useState<string>("");

  const isButtonDisabled = isAddButtonSpinning || locationName.length === 0;

  const clearFields = () => {
    setLocationName("");
  };

  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const onAddLocation = () => {
    setIsAddButtonSpinning(true);

    const payload: AutomountLocationAddPayload = {
      locationName: locationName,
    };

    addLocation(payload)
      .then((response) => {
        if ("error" in response) {
          const error = response.error as SerializedError;
          dispatch(
            addAlert({
              name: "add-automount-location-error",
              title: error.message || "Failed to add automount location",
              variant: "danger",
            })
          );
          return;
        }

        if ("data" in response) {
          const error = response.data?.error as SerializedError;

          if (error) {
            dispatch(
              addAlert({
                name: "add-automount-location-error",
                title: error.message || "Failed to add automount location",
                variant: "danger",
              })
            );
            return;
          }

          dispatch(
            addAlert({
              name: "add-automount-location-success",
              title: "New automount location added",
              variant: "success",
            })
          );
          clearFields();
          props.onRefresh();
          props.onClose();
        }
      })
      .finally(() => {
        setIsAddButtonSpinning(false);
      });
  };

  const fields = [
    {
      id: "modal-form-automount-location-name",
      name: "Location name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-automount-location-name"
          id="modal-form-automount-location-name"
          name="modal-form-automount-location-name"
          value={locationName}
          onChange={setLocationName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new-automount-location"
      isDisabled={isButtonDisabled}
      isLoading={isAddButtonSpinning}
      type="submit"
      onClick={onAddLocation}
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-automount-location"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-automount-location-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add automount location"
      formId="add-automount-location-modal"
      fields={fields}
      show={props.isOpen}
      onSubmit={onAddLocation}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddAutomountLocationModal;
