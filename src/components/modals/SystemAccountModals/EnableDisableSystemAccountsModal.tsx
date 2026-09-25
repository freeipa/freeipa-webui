import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  useSysaccountDisableMutation,
  useSysaccountEnableMutation,
} from "src/services/rpcSystemAccounts";
// Components
import ConfirmationModal from "../ConfirmationModal";
// Utils
import capitalizeFirstLetter from "src/utils/utils";
// Data types
import { SysAccount } from "src/utils/datatypes/globalDataTypes";

interface EnableDisableSystemAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsList: string[];
  setElementsList: (elementsList: SysAccount[]) => void;
  operation: "enable" | "disable";
  onRefresh: () => void;
}

const EnableDisableSystemAccountsModal = (
  props: EnableDisableSystemAccountsModalProps
) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [disableAccount] = useSysaccountDisableMutation();
  const [enableAccount] = useSysaccountEnableMutation();

  // Enable/Disable operation
  const onEnableDisable = () => {
    const operation =
      props.operation === "enable" ? enableAccount : disableAccount;

    operation(props.elementsList).then((response) => {
      if ("data" in response) {
        const { data } = response;
        if (data?.error) {
          dispatch(
            addAlert({ name: "error", title: data.error, variant: "danger" })
          );
        }
        if (data?.result) {
          dispatch(
            addAlert({
              name: "success",
              title: "System account status changed",
              variant: "success",
            })
          );
          // Clear selected elements
          props.setElementsList([]);
          // Refresh data
          props.onRefresh();
          onClose();
        }
      }
    });
  };

  const onClose = () => {
    props.setElementsList([]);
    props.onClose();
  };

  const onCloseWithoutClearingElements = () => {
    props.onClose();
  };

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key={props.operation + "-sysaccounts"}
      variant="primary"
      type="submit"
      form="enable-disable-system-accounts-modal"
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-sysaccounts"}
      variant="secondary"
      onClick={onCloseWithoutClearingElements}
    >
      Cancel
    </Button>,
  ];

  return (
    <ConfirmationModal
      dataCy="system-accounts-enable-disable-modal"
      title={capitalizeFirstLetter(props.operation) + " confirmation"}
      isOpen={props.isOpen}
      onClose={onClose}
      actions={modalActions}
      formId="enable-disable-system-accounts-modal"
      onSubmit={onEnableDisable}
      messageText={
        "Are you sure you want to " +
        props.operation +
        " the following element(s)?"
      }
      messageObj={props.elementsList.join(", ")}
    />
  );
};

export default EnableDisableSystemAccountsModal;
