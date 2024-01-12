import React from "react";
// PatternFly
import { Button, Flex, FlexItem } from "@patternfly/react-core";
// Components
import TitleLayout from "../layouts/TitleLayout";
import TextLayout from "../layouts/TextLayout";
// Modals
import InformationModalLayout from "../layouts/InformationModalLayout";
// Data types
import { CertificateData } from "../Form/IpaCertificates";
// Utils
import { parseDn } from "src/utils/utils";

interface PropsToCertificatesInfoModal {
  isOpen: boolean;
  onClose: () => void;
  idxSelected: number;
  certificatesList: CertificateData[];
  uid: string;
}

const CertificatesInformationModal = (props: PropsToCertificatesInfoModal) => {
  const infoModalActions = [
    <Button key="close" variant="primary" onClick={props.onClose}>
      Close
    </Button>,
  ];

  const parseKeyValue = (key: string, value: string) => {
    return (
      <Flex>
        <FlexItem>
          <TextLayout>{key}:</TextLayout>
        </FlexItem>
        <FlexItem>
          <TextLayout className="pf-v5-u-ml-md">{value}</TextLayout>
        </FlexItem>
      </Flex>
    );
  };

  const infoModalContent = (
    <>
      <TitleLayout
        id={"info-modal-issued-to"}
        headingLevel="h2"
        text={"Issued to"}
      />
      {parseKeyValue(
        "Common name",
        parseDn(props.certificatesList[props.idxSelected].certInfo.subject)
          .cn || ""
      )}
      {parseKeyValue(
        "Organization",
        parseDn(props.certificatesList[props.idxSelected].certInfo.subject).o ||
          ""
      )}
      {parseKeyValue(
        "Organization unit",
        parseDn(props.certificatesList[props.idxSelected].certInfo.issuer).ou ||
          ""
      )}
      {parseKeyValue(
        "Serial number",
        props.certificatesList[props.idxSelected].certInfo.serial_number || ""
      )}
      {parseKeyValue(
        "Serial number (hex)",
        props.certificatesList[props.idxSelected].certInfo.serial_number_hex ||
          ""
      )}
      <TitleLayout
        id={"info-modal-issued-by"}
        headingLevel="h2"
        text={"Issued by"}
        className="pf-v5-u-mt-sm"
      />
      {parseKeyValue(
        "Common name",
        parseDn(props.certificatesList[props.idxSelected].certInfo.issuer).cn ||
          ""
      )}
      {parseKeyValue(
        "Organization",
        parseDn(props.certificatesList[props.idxSelected].certInfo.issuer).o ||
          ""
      )}
      {parseKeyValue(
        "Organization unit",
        parseDn(props.certificatesList[props.idxSelected].certInfo.issuer).ou ||
          ""
      )}
      <TitleLayout
        id={"info-modal-validity"}
        headingLevel="h2"
        text={"Validity"}
        className="pf-v5-u-mt-sm"
      />
      {parseKeyValue(
        "Issued on",
        props.certificatesList[props.idxSelected].certInfo.valid_not_before ||
          ""
      )}
      {parseKeyValue(
        "Expires on",
        props.certificatesList[props.idxSelected].certInfo.valid_not_after || ""
      )}
      <TitleLayout
        id={"info-modal-fingerprints"}
        headingLevel="h2"
        text={"Fingerprints"}
        className="pf-v5-u-mt-sm"
      />
      {parseKeyValue(
        "Expires on",
        props.certificatesList[props.idxSelected].certInfo.sha1_fingerprint ||
          ""
      )}
      {parseKeyValue(
        "Expires on",
        props.certificatesList[props.idxSelected].certInfo.sha256_fingerprint ||
          ""
      )}
    </>
  );

  return (
    <InformationModalLayout
      title={
        "Certificate for " +
        parseDn(props.certificatesList[props.idxSelected].certInfo.subject).cn
      }
      variant="medium"
      actions={infoModalActions}
      isOpen={props.isOpen}
      onClose={props.onClose}
      content={infoModalContent}
    />
  );
};

export default CertificatesInformationModal;
