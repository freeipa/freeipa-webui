import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useSaveSysAccountMutation } from "src/services/rpcSystemAccounts";
// Components
import ConfirmationModal from "src/components/modals/ConfirmationModal";
// Utils
import capitalizeFirstLetter from "src/utils/utils";

interface EnableDisableSysAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  operation: "enable" | "disable";
  onRefresh: () => void;
}

const EnableDisableSysAccountModal = (
  props: EnableDisableSysAccountModalProps
) => {
  const dispatch = useAppDispatch();
  const [spinning, setSpinning] = React.useState(false);

  const [saveSysAccount] = useSaveSysAccountMutation();

  const onEnableDisable = () => {
    setSpinning(true);
    const nsaccountlock = props.operation === "disable";

    saveSysAccount({ uid: props.uid, nsaccountlock } as never)
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "enable-disable-success",
                title:
                  "System account '" +
                  props.uid +
                  "' " +
                  (props.operation === "enable" ? "enabled" : "disabled"),
                variant: "success",
              })
            );
            props.onRefresh();
            props.onClose();
          } else if (response.data?.error) {
            const errorMessage = response.data.error as ErrorResult;
            dispatch(
              addAlert({
                name: "enable-disable-error",
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
      data-cy="modal-button-ok"
      key={props.operation + "-sysaccount"}
      variant="primary"
      type="submit"
      form="enable-disable-sysaccount-form"
      isLoading={spinning}
      isDisabled={spinning}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-sysaccount"}
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <ConfirmationModal
      dataCy="enable-disable-sysaccount-modal"
      title={capitalizeFirstLetter(props.operation) + " confirmation"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={modalActions}
      messageText={`Are you sure you want to ${props.operation} the following system account?`}
      messageObj={props.uid}
      formId="enable-disable-sysaccount-form"
      onSubmit={onEnableDisable}
    />
  );
};

export default EnableDisableSysAccountModal;
