import React from "react";
// PatternFly
import { Button, TextInput } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
import InputWithValidation from "src/components/layouts/InputWithValidation";
import PasswordInput from "src/components/layouts/PasswordInput";
// RPC
import { useAddRadiusServerMutation } from "src/services/rpcRadiusServers";
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

const AddRadiusServerModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addRadiusServer] = useAddRadiusServerMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [serverName, setServerName] = React.useState("");
  const [server, setServer] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [secretVerify, setSecretVerify] = React.useState("");
  const [userAttribute, setUserAttribute] = React.useState("");
  const [secretHidden, setSecretHidden] = React.useState(true);
  const [secretVerifyHidden, setSecretVerifyHidden] = React.useState(true);

  // Clear fields
  const clearFields = () => {
    setServerName("");
    setServer("");
    setSecret("");
    setSecretVerify("");
    setUserAttribute("");
    setSecretHidden(true);
    setSecretVerifyHidden(true);
  };

  // Server must follow "<server>.<domain>.<tld>" pattern (at least 3 labels)
  const serverPattern =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?){2,}$/;
  const isServerValid = serverPattern.test(server);

  // Passwords must match when both are filled
  const verifiedSecrets =
    secret === secretVerify && secret.length > 0 && secretVerify.length > 0;

  // Buttons disabled until required fields are valid
  const mandatoryEmpty =
    serverName === "" || !isServerValid || !verifiedSecrets;

  // 'Add' button handler
  const onAddRadiusServer = () => {
    setIsAddButtonSpinning(true);

    addRadiusServer({
      cn: serverName,
      ipatokenradiusserver: server,
      ipatokenradiussecret: secret,
      ipatokenusermapattribute: userAttribute || undefined,
    })
      .then((response) => {
        if ("error" in response && response.error) {
          const error = response.error as SerializedError;
          dispatch(
            addAlert({
              name: "add-radius-server-error",
              title: error.message || "Failed to add RADIUS server",
              variant: "danger",
            })
          );
          return;
        }

        if ("data" in response) {
          const data = response.data?.result;
          const error = response.data?.error as SerializedError;

          if (error) {
            dispatch(
              addAlert({
                name: "add-radius-server-error",
                title: error.message,
                variant: "danger",
              })
            );
          }

          if (data) {
            dispatch(
              addAlert({
                name: "add-radius-server-success",
                title: "New RADIUS server added",
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

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "modal-form-radius-server-name",
      name: "RADIUS proxy server name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-radius-server-name"
          id="modal-form-radius-server-name"
          name="cn"
          value={serverName}
          onChange={setServerName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-radius-server",
      name: "Server",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-radius-server"
          id="modal-form-radius-server"
          name="ipatokenradiusserver"
          value={server}
          onChange={setServer}
          isRequired
          rules={[
            {
              id: "server-format",
              message:
                'Must be a fully qualified hostname (e.g. "server1.example.test")',
              validate: (v: string) => serverPattern.test(v),
            },
          ]}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-radius-secret",
      name: "Secret",
      pfComponent: (
        <PasswordInput
          dataCy="modal-textbox-radius-secret"
          id="modal-form-radius-secret"
          name="ipatokenradiussecret"
          value={secret}
          onChange={setSecret}
          onRevealHandler={setSecretHidden}
          passwordHidden={secretHidden}
          isRequired
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-radius-secret-verify",
      name: "Verify secret",
      pfComponent: (
        <PasswordInput
          dataCy="modal-textbox-radius-secret-verify"
          id="modal-form-radius-secret-verify"
          name="secret_verify"
          value={secretVerify}
          onChange={setSecretVerify}
          onRevealHandler={setSecretVerifyHidden}
          passwordHidden={secretVerifyHidden}
          isRequired
          rules={[
            {
              id: "verify-match",
              message: "Secrets must match",
              validate: (v: string) => v === secret,
            },
          ]}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-radius-user-attribute",
      name: "User attribute",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-radius-user-attribute"
          id="modal-form-radius-user-attribute"
          name="ipatokenusermapattribute"
          value={userAttribute}
          onChange={(_event, value: string) => setUserAttribute(value)}
        />
      ),
    },
  ];

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={isAddButtonSpinning || mandatoryEmpty}
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
      dataCy="add-radius-server-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title={props.title}
      formId="add-modal-form"
      fields={fields}
      show={props.isOpen}
      onSubmit={() => onAddRadiusServer()}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddRadiusServerModal;
