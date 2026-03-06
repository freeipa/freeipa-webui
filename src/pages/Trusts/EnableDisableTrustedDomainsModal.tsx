import React from "react";
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  DisableEnableTrustDomainPayload,
  useEnableDisableTrustDomainsMutation,
} from "src/services/rpcTrusts";
import { BatchResult } from "src/services/rpc";
// Components
import ConfirmationModal from "src/components/modals/ConfirmationModal";

interface EnableDisableTrustedDomainsProps {
  isOpen: boolean;
  onClose: () => void;
  trustId: string;
  domainNames: string[];
  setDomainNames: (domainNames: string[]) => void;
  operation: "enable" | "disable";
  setShowTableRows: (value: boolean) => void;
  onRefresh: () => void;
}

const EnableDisableTrustedDomainsModal = (
  props: EnableDisableTrustedDomainsProps
) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [enableDisableTrustDomains] = useEnableDisableTrustDomainsMutation();

  // Enable/Disable operation
  const onEnableDisable = () => {
    const payload: DisableEnableTrustDomainPayload = {
      trustId: props.trustId,
      domainNames: props.domainNames,
      operation: props.operation,
    };

    enableDisableTrustDomains(payload)
      .then((response) => {
        if ("data" in response && response.data !== undefined) {
          const results: BatchResult[] = response.data.result.results;

          results.forEach((result) => {
            if ("error" in result && result.error) {
              dispatch(
                addAlert({
                  name: "error",
                  title: result.error.toString(),
                  variant: "danger",
                })
              );
            } else {
              dispatch(
                addAlert({
                  name: "success",
                  title: `Domains ${props.operation}ed`,
                  variant: "success",
                })
              );
              // Refresh data
              props.onRefresh();
            }
          });
        }
      })
      .finally(() => {
        props.setShowTableRows(true);
        onClose();
      });
  };

  const onClose = () => {
    props.setShowTableRows(true);
    props.setDomainNames([]);
    props.onClose();
  };

  const onCloseWithoutClearingElements = () => {
    props.setShowTableRows(true);
    props.onClose();
  };

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key={props.operation + "-certmaprules"}
      variant="primary"
      onClick={onEnableDisable}
    >
      OK
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-" + props.operation + "-certmaprules"}
      variant="secondary"
      onClick={onCloseWithoutClearingElements}
    >
      Cancel
    </Button>,
  ];

  return (
    <ConfirmationModal
      dataCy="enable-disable-trusted-domains-modal"
      title={"Confirmation"}
      isOpen={props.isOpen}
      onClose={onClose}
      actions={modalActions}
      messageText={`Are you sure you want to ${props.operation} the following domains?`}
      messageObj={props.domainNames.join(", ")}
    />
  );
};

export default EnableDisableTrustedDomainsModal;
