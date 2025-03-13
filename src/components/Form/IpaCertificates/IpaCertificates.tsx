import React from "react";
// PatternFly
import {
  Button,
  CardBody,
  CardTitle,
  Divider,
  DropdownItem,
} from "@patternfly/react-core";
// Data types
import { Certificate, Metadata } from "src/utils/datatypes/globalDataTypes";
// ipaObject utils
import { getParamProperties } from "src/utils/ipaObjectUtils";
// Modals
import ModalWithTextAreaLayout from "../../layouts/ModalWithTextAreaLayout";
import ConfirmationModal from "../../modals/ConfirmationModal";
import CertificatesInformationModal from "../../modals/CertificateModals/CertificatesInformationModal";
import RevokeCertificate from "../../modals/CertificateModals/RevokeCertificate";
import RemoveHoldCertificate from "../../modals/CertificateModals/RemoveHoldCertificate";
// Components
import SecondaryButton from "../../layouts/SecondaryButton";
// RTK
import { ErrorResult } from "src/services/rpc";
import {
  useAddCertificateMutation,
  useRemoveCertificateMutation,
} from "src/services/rpcCerts";
// Components
import ExpandableCardLayout from "../../layouts/ExpandableCardLayout";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Utils
import { parseDn } from "src/utils/utils";

export interface PropsToIpaCertificates {
  ipaObject: Record<string, unknown>;
  onChange: (ipaObject: Record<string, unknown>) => void;
  metadata: Metadata;
  certificates?: Certificate[];
  objectType: "user" | "host" | "service";
  onRefresh: () => void;
}

interface CertificateParam {
  __base64__: string;
}

export interface CertificateData {
  certificate: CertificateParam;
  certInfo?: Certificate;
}

export interface DictWithName {
  key: string | React.ReactNode;
  name: string;
  value: string | React.ReactNode;
}

const IpaCertificates = (props: PropsToIpaCertificates) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RTK hooks
  const [addCertificate] = useAddCertificateMutation();
  const [removeCertificate] = useRemoveCertificateMutation();

  const { readOnly, value } = getParamProperties({
    name: "usercertificate",
    ipaObject: props.ipaObject,
    metadata: props.metadata,
    objectName: props.objectType,
  });

  let idParamName = "uid";
  if (props.metadata.objects) {
    const objMetadata = props.metadata.objects[props.objectType];
    idParamName = objMetadata.primary_key as string;
  }
  const idParam = props.ipaObject[idParamName] as string;

  // Get further details of a certificate (via the `cert_find` results)
  const getCertificateInfo = (certificate: CertificateParam) => {
    const certificatesInfoList = props.certificates;
    if (certificatesInfoList !== undefined) {
      return certificatesInfoList.find(
        (cert) => cert.certificate === certificate.__base64__
      );
    }
  };

  // Get data from 'value'
  const getCertificatesList = () => {
    const valueAsArray = value as CertificateParam[];
    const certsList: CertificateData[] = [];

    if (valueAsArray !== undefined) {
      valueAsArray.map((cert) => {
        const certEntry = {
          certificate: cert,
          certInfo: getCertificateInfo(cert),
        };
        certsList.push(certEntry);
      });
    }
    return certsList;
  };

  // Update certificates list when 'value' changes
  //  - This prevents the list to be empty when exiting the page and coming back
  React.useEffect(() => {
    setCertificatesList(getCertificatesList());
  }, [value]);

  // Update certificates list when 'props.certificates' changes
  React.useEffect(() => {
    setCertificatesList(getCertificatesList());
  }, [props.certificates]);

  // States
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [certificatesList, setCertificatesList] = React.useState<
    CertificateData[]
  >(getCertificatesList() || []);

  const onChangeTextAreaValue = (value: string) => {
    setTextAreaValue(value);
  };

  // On delete certificate
  const onDeleteCertificate = (idx: number) => {
    const certInfo = certificatesList[idx].certInfo;
    if (certInfo === undefined) return;

    const certificateToRemove = certInfo.certificate;

    const payload = [
      idParam,
      removeCertificateDelimiters(certificateToRemove),
      props.objectType,
    ];
    setModalSpinning(true);

    removeCertificate(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          setIsDeleteConfModalOpen(false);
          // Set alert: success
          alerts.addAlert(
            "remove-certificate-success",
            "Removed certificates from user '" + idParam + "'",
            "success"
          );
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "remove-certificate-error",
            errorMessage.message,
            "danger"
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
        setModalSpinning(false);
      }
    });
  };

  // Checks if the certificate can be revoked
  // - i.e.: issued by IPA CA + not expired + not revoked
  const canBeRevoked = (idx: number) => {
    const certInfo = certificatesList[idx].certInfo;
    if (certInfo === undefined) return false;

    if (certInfo.cacn !== undefined && certInfo.valid_not_after !== undefined) {
      // Issued by IPA CA
      const issuedByIpaCa = certInfo.cacn === "ipa";
      // Not expired
      const now = new Date();
      const expirationDate = new Date(certInfo.valid_not_after);
      // Not revoked
      const isCertRevoked = certInfo.revoked !== undefined && certInfo.revoked;

      return issuedByIpaCa && now < expirationDate && !isCertRevoked;
    }
    return false;
  };

  // Check if the certificate can be removed from hold
  // - i.e.: certificate has been revoked with CRL reason #6: 'Certificate hold'
  const canHoldBeRemoved = (idx: number) => {
    const certInfo = certificatesList[idx].certInfo;
    if (certInfo === undefined) return false;

    if (certInfo.revocation_reason !== undefined) {
      return certInfo.revocation_reason === 6;
    }
    return false;
  };

  // Function to get the dropdown items (based on 'idx')
  const getDropdownItems = (idx: number) => {
    return [
      <DropdownItem
        key="view"
        component="button"
        onClick={() => onViewCertificate(idx)}
      >
        View
      </DropdownItem>,
      <DropdownItem
        key="get"
        component="button"
        onClick={() => onGetCertificate(idx)}
      >
        Get
      </DropdownItem>,
      <DropdownItem
        key="download"
        component="button"
        onClick={() => onDownloadCertificate(idx)}
      >
        Download
      </DropdownItem>,
      <DropdownItem
        key="revoke"
        component="button"
        isDisabled={!canBeRevoked(idx)}
        onClick={() => onRevokeCertificate(idx)}
      >
        Revoke
      </DropdownItem>,
      <DropdownItem
        key="remove-hold"
        component="button"
        isDisabled={!canHoldBeRemoved(idx)}
        onClick={() => onRemoveHoldCertificate(idx)}
      >
        Remove hold
      </DropdownItem>,
      <Divider component="li" key="separator" />,
      <DropdownItem
        key="delete"
        component="button"
        onClick={() => onRemoveCert(idx)}
      >
        Delete
      </DropdownItem>,
    ];
  };

  // Get card title
  const getCardTitle = (cert: Required<CertificateData>) => {
    let title = parseDn(cert.certInfo.subject).cn;
    if (cert.certInfo.san_rfc822name !== undefined) {
      title = cert.certInfo.san_rfc822name[0];
    }

    return (
      <CardTitle
        id={"card-" + parseDn(cert.certInfo.subject).cn}
        className="pf-v5-u-font-weight-normal pf-v5-u-font-family-redhatVF-sans-serif"
      >
        {title}
        {cert.certInfo.revoked ? (
          <p className="pf-v5-u-color-200">{" (REVOKED)"}</p>
        ) : (
          ""
        )}
      </CardTitle>
    );
  };

  // Get header toggle button props
  const getHeaderToggleButtonProps = (
    cert: Required<CertificateData>,
    idx: number
  ) => {
    return {
      id: "toggle-button-" + idx,
      "aria-label": "Details",
      "aria-labelledby":
        "toggle-button card-" + parseDn(cert.certInfo.subject).cn,
    };
  };

  const buildTableBody = (elements: DictWithName[]) => {
    return (
      <div className="pf-v5-u-display-table">
        {elements.map((element) => {
          return (
            <div key={"table-body-" + element.key}>
              <div className="pf-v5-u-display-table-row">
                <div className="pf-v5-u-display-table-cell">
                  <p className="pf-v5-u-mb-xs pf-v5-u-mr-xs pf-v5-u-font-weight-bold">
                    {element.key + ": "}
                  </p>
                </div>
                <div className="pf-v5-u-display-table-cell">
                  <p
                    className="pf-v5-u-mb-xs"
                    id={element.name}
                    data-name={element.name}
                  >
                    {element.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Get card body
  const getCardBody = (cert: Required<CertificateData>) => {
    const tableElements: DictWithName[] = [
      {
        key: "Serial number",
        name: "cert-serial-num",
        value: cert.certInfo.serial_number,
      },
      {
        key: "Issued by",
        name: "cert-issued-by",
        value: parseDn(cert.certInfo.issuer).cn,
      },
      {
        key: "Valid from",
        name: "cert-valid-from",
        value: cert.certInfo.valid_not_before,
      },
      {
        key: "Valid to",
        name: "cert-valid-to",
        value: cert.certInfo.valid_not_after,
      },
    ];
    return <CardBody>{buildTableBody(tableElements)}</CardBody>;
  };

  // MODAL
  // On open modal
  const onOpenModal = () => {
    // Assign value to text area state
    setTextAreaValue("");
    // Determine wich option to show
    setTextareaModalOption("add");
    // Open modal
    setIsModalOpen(true);
  };

  // On click 'Cancel' button (within modal)
  const onClickCancel = () => {
    // Closes the modal
    setIsModalOpen(false);
  };

  // Remove certificate delimiters
  // - This is needed to process the certificate in the API call
  const removeCertificateDelimiters = (certificate: string) => {
    return certificate
      .replace(/-----BEGIN CERTIFICATE-----/g, "")
      .replace(/-----END CERTIFICATE-----/g, "")
      .replace(/\n/g, "");
  };

  // On adding a certificate
  const onAddCertificate = () => {
    const payload: string[] = [
      idParam,
      removeCertificateDelimiters(textAreaValue),
      props.objectType,
    ];
    setModalSpinning(true);

    addCertificate(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          setIsModalOpen(false);
          // Set alert: success
          alerts.addAlert(
            "add-certificate-success",
            "Added certificate to '" + idParam + "'",
            "success"
          );
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "add-certificate-error",
            errorMessage.message,
            "danger"
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
        setModalSpinning(false);
      }
    });
  };

  // Delete confirmation modal
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] =
    React.useState(false);
  const [idxToDelete, setIdxToDelete] = React.useState<number>(999); // Asumption: There will never be 999 certificates
  const [messageDeletionConf, setMessageDeletionConf] = React.useState("");
  const [messageDeletionObj, setMessageDeletionObj] = React.useState("");
  const [modalSpinning, setModalSpinning] = React.useState(false);

  const onOpenDeletionConfModal = () => {
    setIsDeleteConfModalOpen(true);
  };

  const onCloseDeletionConfModal = () => {
    setIsDeleteConfModalOpen(false);
  };

  const onRemoveCert = (idx: number) => {
    // Get the specific index of the element to remove
    setIdxToDelete(idx);
    // Set message to show on the deletion confirmation modal
    const certInfo = certificatesList[idx].certInfo;
    if (certInfo === undefined) return;
    const aliasToDelete = certInfo.serial_number;
    setMessageDeletionConf(
      "Are you sure you want to delete the certificate with the following serial number?"
    );
    setMessageDeletionObj(aliasToDelete);
    // Open deletion confirmation modal
    onOpenDeletionConfModal();
  };

  const deletionConfModalActions = [
    <Button
      key="del-certificate-conf"
      variant="danger"
      onClick={() => onDeleteCertificate(idxToDelete)}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Deleting"
      spinnerAriaLabelledBy="Deleting"
      spinnerAriaLabel="Deleting"
    >
      {modalSpinning ? "Deleting" : "Delete"}
    </Button>,
    <Button key="cancel" variant="link" onClick={onCloseDeletionConfModal}>
      Cancel
    </Button>,
  ];

  // // INFORMATION MODAL
  const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
  const [idxSelected, setIdxSelected] = React.useState<number>(0);

  const onCloseInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const onViewCertificate = (idx: number) => {
    // Track index of the selected certificate
    setIdxSelected(idx);
    // show info modal
    setIsInfoModalOpen(true);
  };

  // 'GET' OPTION
  const [textareaModalOption, setTextareaModalOption] = React.useState<
    "add" | "get"
  >("get");
  const [selectedCertName, setSelectedCertName] = React.useState<string>("");

  const onGetCertificate = (idx: number) => {
    const certInfo = certificatesList[idx].certInfo;
    if (certInfo !== undefined) {
      const certificateIssuer = parseDn(certInfo.issuer).cn;
      const rfcName = certInfo.san_rfc822name;

      if (rfcName !== undefined) {
        setSelectedCertName(rfcName[0]);
      } else {
        setSelectedCertName(certificateIssuer);
      }
    }

    // Get certificate in PEM format
    const cert =
      "-----BEGIN CERTIFICATE-----\n" +
      certificatesList[idx].certificate.__base64__ +
      "\n-----END CERTIFICATE-----";
    setTextAreaValue(cert);
    // Set to 'get' option
    setTextareaModalOption("get");
    // Show modal
    setIsModalOpen(true);
  };

  const onDownloadCertificate = (idx: number) => {
    const certificate =
      "-----BEGIN CERTIFICATE-----" +
      certificatesList[idx].certificate.__base64__ +
      "\n-----END CERTIFICATE-----";
    const blob = new Blob([certificate], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "cert.pem";
    link.href = url;
    link.click();
  };

  // 'REVOKE' OPTION
  const [isRevokeModalOpen, setIsRevokeModalOpen] = React.useState(false);

  const onRevokeCertificate = (idx: number) => {
    // Track index of the selected certificate
    setIdxSelected(idx);
    // show revoke modal
    setIsRevokeModalOpen(true);
  };

  const onCloseRevokeModal = () => {
    setIsRevokeModalOpen(false);
  };

  // 'REMOVE HOLD' OPTION
  const [isRemoveHoldModalOpen, setIsRemoveHoldModalOpen] =
    React.useState(false);

  const onRemoveHoldCertificate = (idx: number) => {
    // Track index of the selected certificate
    setIdxSelected(idx);
    // show revoke modal
    setIsRemoveHoldModalOpen(true);
  };

  const onCloseRemoveHoldModal = () => {
    setIsRemoveHoldModalOpen(false);
  };

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      {certificatesList !== undefined && certificatesList.length > 0
        ? certificatesList.map((cert, idx) => {
            const innerCertificate = () => {
              const isFullCertificate = (
                cert: CertificateData
              ): cert is Required<CertificateData> =>
                typeof cert.certInfo !== "undefined";
              if (
                !isFullCertificate(cert) ||
                Object.keys(cert.certInfo).length === 0
              )
                return null;

              return (
                <div key={"certificate-" + idx}>
                  <ExpandableCardLayout
                    id={"card-" + idx}
                    isCompact={true}
                    headerToggleButtonProps={getHeaderToggleButtonProps(
                      cert,
                      idx
                    )}
                    dropdownItems={getDropdownItems(idx)}
                    cardTitle={getCardTitle(cert)}
                    cardBody={getCardBody(cert)}
                  />
                </div>
              );
            };

            return <div key={idx}>{innerCertificate()}</div>;
          })
        : null}
      <SecondaryButton
        name={"add-certificate"}
        onClickHandler={onOpenModal}
        isDisabled={readOnly}
      >
        Add
      </SecondaryButton>
      <ModalWithTextAreaLayout
        value={textAreaValue}
        onChange={onChangeTextAreaValue}
        isOpen={isModalOpen}
        onClose={onClickCancel}
        actions={
          textareaModalOption === "add"
            ? [
                <SecondaryButton
                  key="add-certificate"
                  onClickHandler={onAddCertificate}
                  isDisabled={modalSpinning}
                  isLoading={modalSpinning}
                  spinnerAriaValueText="Adding"
                  spinnerAriaLabelledBy="Adding"
                  spinnerAriaLabel="Adding"
                >
                  {modalSpinning ? "Adding" : "Add"}
                </SecondaryButton>,
                <Button key="cancel" variant="link" onClick={onClickCancel}>
                  Cancel
                </Button>,
              ]
            : [
                <Button key="close" variant="link" onClick={onClickCancel}>
                  Close
                </Button>,
              ]
        }
        title={
          textareaModalOption === "add"
            ? "New certificate"
            : "Certificate for " + selectedCertName
        }
        subtitle={
          textareaModalOption === "add"
            ? "Certificate in base64 or PEM format"
            : ""
        }
        isRequired={true}
        ariaLabel={
          textareaModalOption === "add"
            ? "new certificate modal text area"
            : "certificate modal text area"
        }
        cssStyle={{ height: "422px" }}
        name={"usercertificate"}
        objectName={props.objectType}
        ipaObject={props.ipaObject}
        metadata={props.metadata}
        variant="medium"
        isTextareaDisabled={textareaModalOption === "get"}
      />
      <ConfirmationModal
        title={"Remove certificate"}
        isOpen={isDeleteConfModalOpen}
        onClose={onCloseDeletionConfModal}
        actions={deletionConfModalActions}
        messageText={messageDeletionConf}
        messageObj={messageDeletionObj}
      />
      {certificatesList[idxSelected] !== undefined && (
        <>
          <CertificatesInformationModal
            isOpen={isInfoModalOpen}
            onClose={onCloseInfoModal}
            idxSelected={idxSelected}
            certificatesList={certificatesList}
            uid={idParam as string}
          />
          <RevokeCertificate
            certificate={certificatesList[idxSelected]}
            isOpen={isRevokeModalOpen}
            onClose={onCloseRevokeModal}
            onRefresh={props.onRefresh}
          />
          <RemoveHoldCertificate
            certificate={certificatesList[idxSelected]}
            isOpen={isRemoveHoldModalOpen}
            onClose={onCloseRemoveHoldModal}
            onRefresh={props.onRefresh}
          />
        </>
      )}
    </>
  );
};

export default IpaCertificates;
