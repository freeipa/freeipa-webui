import React from "react";
// PatternFly
import { Button, Content } from "@patternfly/react-core";
// Modals
import InformationModalLayout from "src/components/layouts/InformationModalLayout";
// Hooks
import { addAlert } from "src/store/alerts";
// Data types
import { CertificateData } from "src/components/Form/IpaCertificates";
// Utils
import { parseDn } from "src/utils/utils";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useRemoveHoldCertificateMutation } from "src/services/rpcCerts";

interface PropsToRemoveHoldCertificate {
  certificate: CertificateData;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const RemoveHoldCertificate = (props: PropsToRemoveHoldCertificate) => {
  const [certName, setCertName] = React.useState<string>("");

  React.useEffect(() => {
    if (props.certificate.certInfo !== undefined) {
      setCertName(parseDn(props.certificate.certInfo.issuer).cn);
    }
  }, [props.certificate]);

  // Prepare "cert_remove_hold" API call
  const [certRemoveHold] = useRemoveHoldCertificateMutation();

  const onRemoveHold = () => {
    // Prepare payload
    if (props.certificate.certInfo === undefined) return;
    const serialNumber = props.certificate.certInfo.serial_number;
    const cacn = props.certificate.certInfo.cacn;
    const payload = [serialNumber, cacn];

    // Perform the API call
    certRemoveHold(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Close modal
          props.onClose();
          // Set alert: success
          addAlert(
            "remove-hold-certificate-success",
            "Certificate hold removed",
            "success"
          );
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          addAlert(
            "remove-hold-certificate-error",
            errorMessage.message,
            "danger"
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  const infoModalActions = [
    <Button
      data-cy="modal-button-remove-hold"
      key="remove-hold"
      variant="danger"
      onClick={onRemoveHold}
    >
      Remove hold
    </Button>,
    <Button
      data-cy="modal-button-close"
      key="close"
      variant="link"
      onClick={props.onClose}
    >
      Close
    </Button>,
  ];

  const contentMessage = (
    <Content>Do you want to remove the certificate hold?</Content>
  );

  return (
    <>
      <InformationModalLayout
        dataCy="remove-hold-certificate-modal"
        title={"Certificate for " + certName}
        variant="medium"
        actions={infoModalActions}
        isOpen={props.isOpen}
        onClose={props.onClose}
        content={contentMessage}
      />
    </>
  );
};

export default RemoveHoldCertificate;
