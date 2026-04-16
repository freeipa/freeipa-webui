import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  OtpTokensModifyPayload,
  useModifyOtpTokensMutation,
} from "src/services/rpcOtpTokens";
// Components
import ConfirmationModal from "src/components/modals/ConfirmationModal";
// Utils
import capitalizeFirstLetter from "src/utils/utils";
// Data types
import { OtpToken } from "src/utils/datatypes/globalDataTypes";

interface EnableDisableOtpTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsList: string[];
  setElementsList: (elementsList: OtpToken[]) => void;
  operation: "enable" | "disable";
  setShowTableRows: (value: boolean) => void;
  onRefresh: () => void;
}

const EnableDisableOtpTokensModal = (
  props: EnableDisableOtpTokensModalProps
) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [modifyOtpTokens] = useModifyOtpTokensMutation();
  // Enable/Disable operation
  const onEnableDisable = () => {
    // const operation = props.operation === "enable" ? enableOtpTokens : disableOtpTokens;
    const payload: OtpTokensModifyPayload[] = props.elementsList.map(
      (element) => ({
        ipatokenuniqueid: element,
        ipatokendisabled: props.operation !== "enable",
      })
    );
    modifyOtpTokens(payload).then((response) => {
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
              title: "OTP tokens status changed",
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
      key={props.operation + "-otp-tokens"}
      variant="primary"
      onClick={onEnableDisable}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-otp-tokens"}
      variant="secondary"
      onClick={onCloseWithoutClearingElements}
    >
      Cancel
    </Button>,
  ];

  return (
    <ConfirmationModal
      dataCy="enable-disable-otp-tokens-modal"
      title={capitalizeFirstLetter(props.operation) + " confirmation"}
      isOpen={props.isOpen}
      onClose={onClose}
      actions={modalActions}
      messageText={`Are you sure you want to ${props.operation} the following OTP tokens?`}
      messageObj={props.elementsList.join(", ")}
    />
  );
};

export default EnableDisableOtpTokensModal;
