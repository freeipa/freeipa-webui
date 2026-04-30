import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  useDisableSelinuxUserMapsMutation,
  useEnableSelinuxUserMapsMutation,
} from "src/services/rpcSelinuxUserMaps";
// Components
import ConfirmationModal from "../ConfirmationModal";
// Utils
import capitalizeFirstLetter from "src/utils/utils";
// Data types
import { SELinuxUserMap } from "src/utils/datatypes/globalDataTypes";

interface EnableDisableSelinuxUserMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsList: string[];
  setElementsList: (elementsList: SELinuxUserMap[]) => void;
  operation: "enable" | "disable";
  onRefresh: () => void;
}

const EnableDisableSelinuxUserMapsModal = (
  props: EnableDisableSelinuxUserMapsModalProps
) => {
  const dispatch = useAppDispatch();

  const [disableMap] = useDisableSelinuxUserMapsMutation();
  const [enableMap] = useEnableSelinuxUserMapsMutation();

  const onEnableDisable = () => {
    const operation = props.operation === "enable" ? enableMap : disableMap;

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
              title: "SELinux user map status changed",
              variant: "success",
            })
          );
          props.setElementsList([]);
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
      key={props.operation + "-selinux-user-maps"}
      variant="primary"
      onClick={onEnableDisable}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-selinux-user-maps"}
      variant="secondary"
      onClick={onCloseWithoutClearingElements}
    >
      Cancel
    </Button>,
  ];

  return (
    <ConfirmationModal
      dataCy="selinux-user-maps-enable-disable-modal"
      title={capitalizeFirstLetter(props.operation) + " confirmation"}
      isOpen={props.isOpen}
      onClose={onClose}
      actions={modalActions}
      messageText={
        "Are you sure you want to " +
        props.operation +
        " the following element(s)?"
      }
      messageObj={props.elementsList.join(", ")}
    />
  );
};

export default EnableDisableSelinuxUserMapsModal;
