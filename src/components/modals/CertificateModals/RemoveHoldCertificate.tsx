import React from "react";
// PatternFly
import { Button, Content, ContentVariants } from "@patternfly/react-core";
// Modals
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
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
  const dispatch = useAppDispatch();
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
          dispatch(
            addAlert({
              name: "remove-hold-certificate-success",
              title: "Certificate hold removed",
              variant: "success",
            })
          );
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "remove-hold-certificate-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  const formId = "remove-hold-certificate-modal";

  const modalActions = [
    <Button
      data-cy="modal-button-remove-hold"
      key="remove-hold"
      variant="danger"
      type="submit"
      form={formId}
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

  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Do you want to remove the certificate hold?
        </Content>
      ),
    },
  ];

  return (
    <ModalWithFormLayout
      dataCy="remove-hold-certificate-modal"
      title={"Certificate for " + certName}
      variantType="medium"
      modalPosition={undefined}
      formId={formId}
      onSubmit={onRemoveHold}
      fields={fields}
      show={props.isOpen}
      onClose={props.onClose}
      actions={modalActions}
    />
  );
};

export default RemoveHoldCertificate;
