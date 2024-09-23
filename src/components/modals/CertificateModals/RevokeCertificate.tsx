import React from "react";
// PatternFly
import {
  Button,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectOption,
} from "@patternfly/react-core";
// Modals
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
// Data types
import { CertificateData } from "src/components/Form/IpaCertificates";
// Components
import SecondaryButton from "src/components/layouts/SecondaryButton";
// Utils
import { parseDn } from "src/utils/utils";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useGetCertificateAuthorityQuery,
  useRevokeCertificateMutation,
} from "src/services/rpcCerts";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface PropsToRevokeCertificate {
  certificate: CertificateData;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const RevokeCertificate = (props: PropsToRevokeCertificate) => {
  const REVOCATION_REASONS = {
    0: "Unspecified",
    1: "Key Compromise",
    2: "CA Compromise",
    3: "Affiliation Changed",
    4: "Superseded",
    5: "Cessation of Operation",
    6: "Certificate Hold",
    8: "Remove from CRL",
    9: "Privilege Withdrawn",
    10: "AA Compromise",
  };

  // Alerts to show in the UI
  const alerts = useAlerts();

  const [certName, setCertName] = React.useState<string>("");

  React.useEffect(() => {
    if (props.certificate.certInfo !== undefined) {
      setCertName(parseDn(props.certificate.certInfo.issuer).cn);
    }
  }, [props.certificate]);

  // Obtain CAs from the IPA server
  const certificateAuthorityQuery = useGetCertificateAuthorityQuery();
  const certificateAuthorities = certificateAuthorityQuery.data || [];
  const isCALoading = certificateAuthorityQuery.isLoading;

  // Prepare "cert_revoke" API call
  const [certRevoke] = useRevokeCertificateMutation();

  // SELECT: 'Revocation reason'
  const [isRevReasonOpen, setIsRevReasonOpen] = React.useState(false);
  const [revReasonSelected, setRevReasonSelected] =
    React.useState<string>("Unspecified");

  const onToggleRevReason = () => {
    setIsRevReasonOpen(!isRevReasonOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelectRevReason = (selection: any) => {
    setRevReasonSelected(selection.target.textContent);
    setIsRevReasonOpen(false);
  };

  // Toggle
  const toggleRevReason = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleRevReason}
      className="pf-v5-u-w-100"
    >
      {revReasonSelected}
    </MenuToggle>
  );

  // SELECT: 'CA'
  const [isCAOpen, setIsCAOpen] = React.useState(false);
  const [CASelected, setCASelected] = React.useState<string>("ipa"); // Assumtion: 'ipa' is the default CA
  const [CAOptions, setCAOptions] = React.useState<string[]>([]);

  // Update CAs list when updated
  // - Assumption: There is only one CA by default ('ipa')
  React.useEffect(() => {
    if (!isCALoading) {
      const caArray: string[] = [];
      certificateAuthorities.map((ca) => {
        caArray.push(ca.cn[0]);
      });
      setCAOptions(caArray);
    }
  }, [certificateAuthorities]);

  const onCAToggle = () => {
    setIsCAOpen(!isCAOpen);
  };

  const onCASelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    setCASelected(selection as string);
    setIsCAOpen(false);
  };

  // Toggle
  const toggleCASelect = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle ref={toggleRef} onClick={onCAToggle} className="pf-v5-u-w-100">
      {CASelected}
    </MenuToggle>
  );

  // MODAL
  const onCancel = () => {
    // Reset fields
    setRevReasonSelected("Unspecified");
    setCASelected("ipa");
    // Close modal
    props.onClose();
  };

  const onRevokeCert = () => {
    // Prepare payload
    const serialNumber = props.certificate.certInfo.serial_number;
    const reasonKey = Object.keys(REVOCATION_REASONS).find(
      (key) => REVOCATION_REASONS[key] === revReasonSelected
    );
    const reason = reasonKey || "0";
    const payload = [serialNumber, reason, CASelected];

    // Call API
    certRevoke(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          props.onClose();
          alerts.addAlert(
            "revoke-certificate-success",
            "Certificate revoked",
            "success"
          );
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "revoke-certificate-error",
            errorMessage.message,
            "danger"
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  const modalActions = [
    <SecondaryButton key="revoke" onClickHandler={onRevokeCert}>
      Revoke
    </SecondaryButton>,
    <Button key="cancel" variant="link" onClick={onCancel}>
      Cancel
    </Button>,
  ];

  const fields: Field[] = [
    {
      id: "revocation-reason",
      name: "Revocation reason",
      pfComponent: (
        <Select
          id="revocation-reasons"
          aria-label="Select a revocation reason"
          aria-labelledby="revocation-reasons"
          selected={revReasonSelected}
          isOpen={isRevReasonOpen}
          toggle={toggleRevReason}
          onSelect={onSelectRevReason}
        >
          {Object.entries(REVOCATION_REASONS).map((value) => (
            <SelectOption key={value[0]} value={value[1]}>
              {value[1]}
            </SelectOption>
          ))}
        </Select>
      ),
    },
    {
      id: "revocation-ca",
      name: "CA",
      pfComponent: (
        <Select
          id="revocation-certificate-authority"
          aria-label="Select a certificate authority for the revocation"
          aria-labelledby="revocation certificate authority"
          selected={CASelected}
          isOpen={isCAOpen}
          toggle={toggleCASelect}
          onSelect={onCASelect}
        >
          {CAOptions.map((option, index) => (
            <SelectOption key={index} value={option}>
              {option}
            </SelectOption>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="small"
        modalPosition="top"
        title={"Certificate for " + certName}
        description={
          "Do you want to revoke this certificate? Select a reason from the pull-down list."
        }
        formId={"revoke-certificate"}
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActions}
      />
    </>
  );
};

export default RevokeCertificate;
