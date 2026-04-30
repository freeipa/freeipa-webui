import React from "react";
// PatternFly
import { Button, TextInput } from "@patternfly/react-core";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputWithValidation from "src/components/layouts/InputWithValidation";
// Redux
import { useAppDispatch } from "src/store/hooks";
// RPC
import { addAlert } from "src/store/Global/alerts-slice";
import {
  SelinuxUserMapAddPayload,
  useAddSelinuxUserMapMutation,
} from "src/services/rpcSelinuxUserMaps";
// Errors
import { SerializedError } from "@reduxjs/toolkit";

const invalidCharsRegex = /[$%&]/;

interface PropsToAddSelinuxUserMapModal {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const AddSelinuxUserMapModal = (props: PropsToAddSelinuxUserMapModal) => {
  const dispatch = useAppDispatch();

  const [addSelinuxUserMap] = useAddSelinuxUserMapMutation();

  const [isAddButtonSpinning, setIsAddButtonSpinning] =
    React.useState<boolean>(false);
  const [cn, setCn] = React.useState<string>("");
  const [ipaselinuxuser, setIpaselinuxuser] = React.useState<string>("");

  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  React.useEffect(() => {
    if (
      cn === "" ||
      ipaselinuxuser === "" ||
      invalidCharsRegex.test(ipaselinuxuser)
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [cn, ipaselinuxuser]);

  const clearFields = () => {
    setCn("");
    setIpaselinuxuser("");
  };

  const onAdd = () => {
    setIsAddButtonSpinning(true);

    const payload: SelinuxUserMapAddPayload = {
      cn,
      ipaselinuxuser,
    };

    addSelinuxUserMap(payload)
      .then((response) => {
        if ("data" in response) {
          const data = response.data?.result;
          const error = response.data?.error as SerializedError;

          if (error) {
            dispatch(
              addAlert({
                name: "add-selinux-user-map-error",
                title: error.message!,
                variant: "danger",
              })
            );
          }

          if (data) {
            dispatch(
              addAlert({
                name: "add-selinux-user-map-success",
                title: data.summary,
                variant: "success",
              })
            );
            clearFields();
            props.onRefresh();
            props.onClose();
          }
        }
      })
      .finally(() => {
        setIsAddButtonSpinning(false);
      });
  };

  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields = [
    {
      id: "modal-form-selinux-user-map-cn",
      name: "Rule name",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-cn"
          id="modal-form-selinux-user-map-cn"
          name="modal-form-selinux-user-map-cn"
          value={cn}
          isRequired
          aria-label="Rule name text input"
          onChange={(_event, value) => setCn(value)}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-selinux-user-map-ipaselinuxuser",
      name: "SELinux User",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-ipaselinuxuser"
          id="modal-form-selinux-user-map-ipaselinuxuser"
          name="modal-form-selinux-user-map-ipaselinuxuser"
          value={ipaselinuxuser}
          onChange={setIpaselinuxuser}
          isRequired
          rules={[
            {
              id: "no-invalid-chars",
              message: "Must not contain $, %, or & characters",
              validate: (value: string) => !invalidCharsRegex.test(value),
            },
          ]}
        />
      ),
      fieldRequired: true,
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new-selinux-user-map"
      isDisabled={buttonDisabled || isAddButtonSpinning}
      isLoading={isAddButtonSpinning}
      onClick={onAdd}
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-selinux-user-map"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-selinux-user-map-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add SELinux user map"
      formId="add-selinux-user-map-modal"
      fields={fields}
      show={props.isOpen}
      onSubmit={onAdd}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddSelinuxUserMapModal;
