import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import PasswordInput from "src/components/layouts/PasswordInput";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  SysAccountModPayload,
  useSaveSysAccountMutation,
} from "src/services/rpcSystemAccounts";

interface ResetSysAccountPasswordModalProps {
  uid: string;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const ResetSysAccountPasswordModal = (
  props: ResetSysAccountPasswordModalProps
) => {
  const dispatch = useAppDispatch();

  const [saveSysAccount] = useSaveSysAccountMutation();

  const [newPassword, setNewPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");
  const [passwordHidden, setPasswordHidden] = React.useState(true);
  const [verifyPasswordHidden, setVerifyPasswordHidden] = React.useState(true);
  const [spinning, setSpinning] = React.useState(false);

  const passwordsMatch = newPassword === verifyPassword;
  const isButtonDisabled =
    spinning || !newPassword || !verifyPassword || !passwordsMatch;

  const cleanAndClose = () => {
    setNewPassword("");
    setVerifyPassword("");
    setPasswordHidden(true);
    setVerifyPasswordHidden(true);
    props.onClose();
  };

  const fields = [
    {
      id: "modal-form-reset-password-new-password",
      name: "New password",
      pfComponent: (
        <PasswordInput
          dataCy="modal-textbox-new-password"
          id="modal-form-reset-password-new-password"
          name="password"
          value={newPassword}
          aria-label="new password text input"
          onChange={setNewPassword}
          onRevealHandler={setPasswordHidden}
          passwordHidden={passwordHidden}
        />
      ),
    },
    {
      id: "modal-form-reset-password-verify-password",
      name: "Verify password",
      pfComponent: (
        <>
          <PasswordInput
            dataCy="modal-textbox-verify-password"
            id="modal-form-reset-password-verify-password"
            name="password2"
            value={verifyPassword}
            aria-label="verify password text input"
            onChange={setVerifyPassword}
            onRevealHandler={setVerifyPasswordHidden}
            passwordHidden={verifyPasswordHidden}
            rules={[
              {
                id: "verify-match",
                message: "Passwords must match",
                validate: (v: string) => v === newPassword,
              },
            ]}
          />
        </>
      ),
    },
  ];

  const onResetPassword = () => {
    setSpinning(true);

    const sysAccountModPayload: SysAccountModPayload = {
      uid: props.uid,
      userpassword: newPassword,
    };

    saveSysAccount(sysAccountModPayload)
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "reset-password-success",
                title:
                  "Password for system account '" +
                  props.uid +
                  "' has been reset",
                variant: "success",
              })
            );
            props.onRefresh();
            cleanAndClose();
          } else if (response.data?.error) {
            const errorMessage = response.data.error as ErrorResult;
            dispatch(
              addAlert({
                name: "reset-password-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
          }
        }
      })
      .finally(() => {
        setSpinning(false);
      });
  };

  const modalActions: JSX.Element[] = [
    <Button
      key="reset-password-sysaccount"
      variant="primary"
      type="submit"
      form="reset-password-sysaccount-modal"
      isLoading={spinning}
      isDisabled={isButtonDisabled}
      data-cy="modal-button-reset-password"
    >
      {spinning ? "Resetting" : "Reset password"}
    </Button>,
    <Button
      key="cancel-reset-password-sysaccount"
      variant="link"
      onClick={cleanAndClose}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="reset-password-sysaccount-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title={"Reset password for: " + props.uid}
      formId="reset-password-sysaccount-modal"
      fields={fields}
      show={props.isOpen}
      onClose={cleanAndClose}
      onSubmit={onResetPassword}
      actions={modalActions}
    />
  );
};

export default ResetSysAccountPasswordModal;
