import React from "react";
// PatternFly
import {
  Button,
  CardBody,
  CardTitle,
  DropdownItem,
  DropdownSeparator,
} from "@patternfly/react-core";
// Data types
import { Certificate, Metadata } from "src/utils/datatypes/globalDataTypes";
// ipaObject utils
import { getParamProperties } from "src/utils/ipaObjectUtils";
// Modals
import ModalWithTextAreaLayout from "../layouts/ModalWithTextAreaLayout";
import DeletionConfirmationModal from "../modals/DeletionConfirmationModal";
// Components
import SecondaryButton from "../layouts/SecondaryButton";
// RTK
import {
  ErrorResult,
  useAddCertificateMutation,
  useRemoveCertificateMutation,
} from "src/services/rpc";
// Components
import ExpandableCardLayout from "../layouts/ExpandableCardLayout";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface PropsToIpaCertificates {
  ipaObject: Record<string, unknown>;
  onChange: (ipaObject: Record<string, unknown>) => void;
  metadata: Metadata;
  certificates: Record<string, unknown>;
  onRefresh: () => void;
}

interface CertificateParam {
  __base64__: string;
}

interface CertificateData {
  certificate: CertificateParam;
  certInfo: Certificate;
}

interface DN {
  c: string;
  cn: string;
  o: string;
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
    objectName: "user",
  });

  // Get different values from DN
  const parseDn = (dn: string) => {
    const result = {} as DN;
    if (dn === undefined) return result;

    // TODO: Use proper LDAP DN parser
    const rdns = dn.split(",");
    for (let i = 0; i < rdns.length; i++) {
      const rdn = rdns[i];
      if (!rdn) continue;

      const parts = rdn.split("=");
      const name = parts[0].toLowerCase();
      const value = parts[1];

      const old_value = result[name];
      if (!old_value) {
        result[name] = value;
      } else if (typeof old_value == "string") {
        result[name] = [old_value, value];
      } else {
        result[name].push(value);
      }
    }

    return result as DN;
  };

  // Get further details of a certificate (via the `cert_find` results)
  const getCertificateInfo = (certificate: CertificateParam) => {
    const certificatesInfoList = props.certificates as unknown as Certificate[];
    if (certificatesInfoList !== undefined) {
      return certificatesInfoList.find(
        (cert) => cert.certificate === certificate.__base64__
      ) as Certificate;
    }
    return {} as Certificate;
  };

  // Get data from 'value'
  const getCertificatesList = () => {
    const valueAsArray = value as CertificateParam[];
    const certsList: CertificateData[] = [];

    if (valueAsArray !== undefined) {
      valueAsArray.map((cert) => {
        const certsInfo: Certificate | undefined = getCertificateInfo(cert);
        const certEntry = {
          certificate: cert,
          certInfo: certsInfo,
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
    const certificateToRemove = certificatesList[idx].certInfo.certificate;

    const payload = [
      props.ipaObject.uid,
      removeCertificateDelimiters(certificateToRemove),
    ];

    removeCertificate(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          setIsDeleteConfModalOpen(false);
          // Set alert: success
          alerts.addAlert(
            "remove-certificate-success",
            "Removed certificates from user '" + props.ipaObject.uid + "'",
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
      }
    });
  };

  // Function to get the dropdown items (based on 'idx')
  const getDropdownItems = (idx: number) => {
    return [
      <DropdownItem key="view" component="button">
        View
      </DropdownItem>,
      <DropdownItem key="get" component="button">
        Get
      </DropdownItem>,
      <DropdownItem key="download" component="button">
        Download
      </DropdownItem>,
      <DropdownItem key="revoke" component="button" isDisabled>
        Revoke
      </DropdownItem>,
      <DropdownItem key="remove-hold" component="button" isDisabled>
        Remove hold
      </DropdownItem>,
      <DropdownSeparator key="separator" />,
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
  const getCardTitle = (cert: CertificateData) => {
    let title = parseDn(cert.certInfo.issuer).cn;
    if (cert.certInfo.san_rfc822name !== undefined) {
      title = cert.certInfo.san_rfc822name[0];
    }

    return (
      <CardTitle
        id={"card-" + parseDn(cert.certInfo.issuer).cn}
        className="pf-u-font-weight-normal pf-u-font-family-redhatVF-sans-serif"
      >
        {title}
      </CardTitle>
    );
  };

  // Get header toggle button props
  const getHeaderToggleButtonProps = (cert: CertificateData, idx: number) => {
    return {
      id: "toggle-button-" + idx,
      "aria-label": "Details",
      "aria-labelledby":
        "toggle-button card-" + parseDn(cert.certInfo.issuer).cn,
    };
  };

  const buildTableBody = (elements: DictWithName[]) => {
    return (
      <div className="pf-u-display-table">
        {elements.map((element) => {
          return (
            <>
              <div className="pf-u-display-table-row">
                <div className="pf-u-display-table-cell">
                  <p className="pf-u-mb-xs pf-u-mr-xs pf-u-font-weight-bold">
                    {element.key + ": "}
                  </p>
                </div>
                <div className="pf-u-display-table-cell">
                  <p
                    className="pf-u-mb-xs"
                    id={element.name}
                    data-name={element.name}
                  >
                    {element.value}
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  // Get card body
  const getCardBody = (cert: CertificateData) => {
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
    const payload = [
      props.ipaObject.uid,
      removeCertificateDelimiters(textAreaValue),
    ];

    addCertificate(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          setIsModalOpen(false);
          // Set alert: success
          alerts.addAlert(
            "add-certificate-success",
            "Added certificate to user '" + props.ipaObject.uid + "'",
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
      }
    });
  };

  // Delete confirmation modal
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] =
    React.useState(false);
  const [idxToDelete, setIdxToDelete] = React.useState<number>(999); // Asumption: There will never be 999 alias
  const [messageDeletionConf, setMessageDeletionConf] = React.useState("");

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
    const aliasToDelete = certificatesList[idx].certInfo.serial_number;
    setMessageDeletionConf(
      "Are you sure you want to delete the certificate with serial number " +
        aliasToDelete +
        "?"
    );
    // Open deletion confirmation modal
    onOpenDeletionConfModal();
  };

  const deletionConfModalActions = [
    <Button
      key="del-certificate-conf"
      variant="danger"
      onClick={() => onDeleteCertificate(idxToDelete)}
    >
      Delete
    </Button>,
    <Button key="cancel" variant="link" onClick={onCloseDeletionConfModal}>
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      {certificatesList.length > 0
        ? certificatesList.map((cert, idx) => {
            return (
              <>
                {cert.certInfo !== undefined &&
                  Object.keys(cert.certInfo).length !== 0 && (
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
                  )}
              </>
            );
          })
        : null}
      <SecondaryButton onClickHandler={onOpenModal} isDisabled={readOnly}>
        Add
      </SecondaryButton>
      <ModalWithTextAreaLayout
        value={textAreaValue}
        onChange={onChangeTextAreaValue}
        isOpen={isModalOpen}
        onClose={onClickCancel}
        actions={[
          <SecondaryButton
            key="add-certificate"
            onClickHandler={onAddCertificate}
            isDisabled={textAreaValue === ""}
          >
            Add
          </SecondaryButton>,
          <Button key="cancel" variant="link" onClick={onClickCancel}>
            Cancel
          </Button>,
        ]}
        title="New certificate"
        subtitle="Certificate in base64 or PEM format"
        isRequired={true}
        ariaLabel="new certificate modal text area"
        cssStyle={{ height: "422px" }}
        name={"usercertificate"}
        objectName="user"
        ipaObject={props.ipaObject}
        metadata={props.metadata}
        variant="medium"
      />
      <DeletionConfirmationModal
        title={"Remove certificate"}
        isOpen={isDeleteConfModalOpen}
        onClose={onCloseDeletionConfModal}
        actions={deletionConfModalActions}
        messageText={messageDeletionConf}
      />
    </>
  );
};

export default IpaCertificates;
