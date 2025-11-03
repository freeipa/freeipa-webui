import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  useAddDnsZonePermissionMutation,
  useRemoveDnsZonePermissionMutation,
} from "src/services/rpcDnsZones";
import ConfirmationModal from "../ConfirmationModal";

interface AddRemovePermissionProps {
  isOpen: boolean;
  onClose: () => void;
  dnsZoneId: string;
  operation: "add" | "remove" | null;
  changeOperation: (newOp: "add" | "remove" | null) => void;
  onRefresh: () => void;
}

const AddRemovePermission = (props: AddRemovePermissionProps) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [addPermission] = useAddDnsZonePermissionMutation();
  const [removePermission] = useRemoveDnsZonePermissionMutation();

  // Add/Remove permission operation
  const onAddRemovePermission = () => {
    const operation =
      props.operation === "add" ? addPermission : removePermission;

    operation(props.dnsZoneId).then((response) => {
      if ("data" in response) {
        const { data } = response;
        if (data?.error) {
          dispatch(
            addAlert({
              name: "error",
              title: (data.error as Error).message,
              variant: "danger",
            })
          );
        }
        if (data?.result) {
          dispatch(
            addAlert({
              name: "success",
              title: data.result.summary,
              variant: "success",
            })
          );
          // Change the operation type (e.g. 'add' --> 'remove')
          if (props.operation === "add") {
            props.changeOperation("remove");
          } else {
            props.changeOperation("add");
          }
          // Refresh data
          props.onRefresh();
          props.onClose();
        }
      }
    });
  };

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key={"delete-" + props.dnsZoneId}
      variant="primary"
      onClick={onAddRemovePermission}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-delete-" + props.dnsZoneId}
      variant="secondary"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <ConfirmationModal
        dataCy="dns-zones-add-remove-permission-modal"
        title={"Confirmation"}
        isOpen={props.isOpen}
        onClose={props.onClose}
        actions={modalActions}
        messageText={
          "Are you sure you want to " +
          props.operation +
          " permission for the following DNS Zone?"
        }
        messageObj={props.dnsZoneId}
      />
    </>
  );
};

export default AddRemovePermission;
