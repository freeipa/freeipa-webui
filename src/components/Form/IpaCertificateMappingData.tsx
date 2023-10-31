import React from "react";
// PatternFly
import { Button, Flex, FlexItem, Modal } from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Utils
import { getParamProperties } from "src/utils/ipaObjectUtils";
// Components
import SecondaryButton from "../layouts/SecondaryButton";
import CertificateMappingDataOption from "../CertificateMappingDataOption";
import IssuerAndSubjectOption from "../IssuerAndSubjectOption";
import {
  ErrorResult,
  useAddCertMapDataMutation,
  useRemoveCertMapDataMutation,
} from "src/services/rpc";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Modals
import DeletionConfirmationModal from "../modals/DeletionConfirmationModal";
// Icons
import MapIcon from "@patternfly/react-icons/dist/esm/icons/map-icon";

interface PropsToIpaCertificateMappingData {
  ipaObject: Record<string, unknown>;
  onChange: (ipaObject: Record<string, unknown>) => void;
  metadata: Metadata;
  onRefresh: () => void;
}

const IpaCertificateMappingData = (props: PropsToIpaCertificateMappingData) => {
  const { value } = getParamProperties({
    name: "ipacertmapdata",
    ipaObject: props.ipaObject,
    metadata: props.metadata,
    objectName: "user",
  });
  // TODO: Use 'readOnly' in the fields (right now is 'undefined')

  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC hooks
  const [addCertMapData] = useAddCertMapDataMutation();
  const [removeCertMapData] = useRemoveCertMapDataMutation();

  // Main list of 'Certificate mapping data'
  const [certificateMappingDataMainList, setCertificateMappingDataMainList] =
    React.useState<string[]>([]);

  // Update 'certificateMappingDataMainList' when the value changes
  React.useEffect(() => {
    setCertificateMappingDataMainList(value as string[]);
  }, [value]);

  // 'Add' button from each modal should remain disabled until the user fills out the fields
  const [isAddButtonDisabled, setIsAddButtonDisabled] = React.useState(true);

  // MODAL
  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => {
    // Reset fields' values
    resetFields();
    // Close the modal
    setIsOpen(false);
  };

  // Radio buttons
  const [isCertMappingDataChecked, setIsCertMappingDataChecked] =
    React.useState(true);
  const [isIssuerAndSubjectChecked, setIsIssuerAndSubjectChecked] =
    React.useState(false);

  const onChangeCertMappingDataCheck = (value: boolean) => {
    setIsCertMappingDataChecked(value);
    setIsIssuerAndSubjectChecked(!value);
  };

  const onChangeIssuerAndSubjectCheck = (value: boolean) => {
    setIsIssuerAndSubjectChecked(value);
    setIsCertMappingDataChecked(!value);
  };

  // Issuer and subject textboxes
  const [issuer, setIssuer] = React.useState("");
  const [subject, setSubject] = React.useState("");

  // Certificate mapping data: Lists and generated textboxes and textarea
  const [certificateMappingDataList, setCertificateMappingDataList] =
    React.useState<string[]>([]);
  const [certificatesList, setCertificatesList] = React.useState<string[]>([]);

  // Deletion modal
  const [isDeletionModalOpen, setIsDeletionModalOpen] = React.useState(false);
  const [idxToDelete, setIdxToDelete] = React.useState<number>(999); // Asumption: There will never be 999 entries
  const [deletionMessage, setDeletionMessage] = React.useState("");

  const onCloseDeletionModal = () => {
    setIsDeletionModalOpen(false);
  };

  const deletionModalActions = [
    <Button
      key="del-certificate-mapping-data"
      variant="danger"
      onClick={() => onRemoveCertificateMappingData(idxToDelete)}
    >
      Delete
    </Button>,
    <Button key="cancel" variant="link" onClick={onCloseDeletionModal}>
      Cancel
    </Button>,
  ];

  // Operation when deleting an entry
  const onDeleteCertMapData = (idx: number) => {
    setIdxToDelete(idx);
    setDeletionMessage(
      "Do you want to remove certificate mapping data '" +
        certificateMappingDataMainList[idx] +
        "'?"
    );
    setIsDeletionModalOpen(true);
  };

  // Reset fields
  const resetFields = () => {
    setCertificateMappingDataList([]);
    setCertificatesList([]);
    setIssuer("");
    setSubject("");
    setIsCertMappingDataChecked(true);
    setIsIssuerAndSubjectChecked(false);
    setIsAddButtonDisabled(true);
  };

  // Remove certificate delimiters
  // - This is needed to process the certificate in the API call
  // TODO: Move this into a utils file and adapt this and the 'Certificates' field to
  //   use it.
  const removeCertificateDelimiters = (certificate: string) => {
    return certificate
      .replace(/-----BEGIN CERTIFICATE-----/g, "")
      .replace(/-----END CERTIFICATE-----/g, "")
      .replace(/\n/g, "");
  };

  // Add 'Certificate mapping data' (through 'issuer and subject' option)
  const preparePayloadByIssuerAndSubject = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const certMapData = {
      issuer: issuer,
      subject: subject,
    };

    return [[props.ipaObject.uid], certMapData];
  };

  // Add 'Certificate mapping data' (through 'certificate mapping data' option)
  const preparePayloadCertMappingData = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const certMapData: any = {};
    const certsWithoutDelimiters: string[] = [];

    if (certificateMappingDataList.length > 0) {
      certMapData.ipacertmapdata = certificateMappingDataList;
    }

    if (certificatesList.length > 0) {
      certificatesList.forEach((certificate) => {
        certsWithoutDelimiters.push(removeCertificateDelimiters(certificate));
      });
      certMapData.certificate = certsWithoutDelimiters;
    }

    return [[props.ipaObject.uid], certMapData];
  };

  // Add data (API call)
  const onAddCertificateMappingData = () => {
    // Prepare payload
    let payload;

    if (isCertMappingDataChecked) {
      payload = preparePayloadCertMappingData();
    }
    if (isIssuerAndSubjectChecked) {
      payload = preparePayloadByIssuerAndSubject();
    }

    addCertMapData(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close the modal
          setIsOpen(false);
          // Set alert: success
          alerts.addAlert(
            "add-cert-mapping-data-success",
            "Added certificate mappings to user '" + props.ipaObject.uid + "'",
            "success"
          );
          // Reset fields' values
          resetFields();
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "add-cert-mapping-data-error",
            errorMessage.message,
            "danger"
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  // Remove data (API call)
  const onRemoveCertificateMappingData = (idx: number) => {
    // Prepare payload
    const payload = [
      [props.ipaObject.uid],
      {
        ipacertmapdata: certificateMappingDataMainList[idx],
      },
    ];

    removeCertMapData(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close the modal
          setIsOpen(false);
          // Set alert: success
          alerts.addAlert(
            "remove-cert-mapping-data-success",
            "Removed certificate mappings from user '" +
              props.ipaObject.uid +
              "'",
            "success"
          );
          // Reset fields' values
          resetFields();
          setIsDeletionModalOpen(false);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "remove-cert-mapping-data-error",
            errorMessage.message,
            "danger"
          );
          // Reset fields' values
          resetFields();
          setIsDeletionModalOpen(false);
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  const actions = [
    <SecondaryButton
      key="add"
      onClickHandler={onAddCertificateMappingData}
      isDisabled={isAddButtonDisabled}
    >
      Add
    </SecondaryButton>,
    <Button key="cancel" variant="link" onClick={onClose}>
      Cancel
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      {certificateMappingDataMainList !== undefined &&
      certificateMappingDataMainList.length > 0
        ? certificateMappingDataMainList.map((certMapData, idx) => {
            return (
              <Flex
                key={"flex-" + idx}
                flex={{ default: "flex_1" }}
                className="pf-u-mb-sm"
                flexWrap={{ default: "nowrap" }}
              >
                <FlexItem>
                  <MapIcon /> {certMapData}
                </FlexItem>
                <FlexItem>
                  <SecondaryButton
                    onClickHandler={() => onDeleteCertMapData(idx)}
                  >
                    Delete
                  </SecondaryButton>
                </FlexItem>
              </Flex>
            );
          })
        : null}

      <SecondaryButton onClickHandler={() => setIsOpen(true)}>
        Add
      </SecondaryButton>
      <Modal
        variant="small"
        title="Add certificate mapping data"
        isOpen={isOpen}
        onClose={onClose}
        actions={actions}
      >
        <>
          <CertificateMappingDataOption
            isCertMappingDataChecked={isCertMappingDataChecked}
            onChangeCertMappingDataCheck={onChangeCertMappingDataCheck}
            setIsAddButtonDisabled={setIsAddButtonDisabled}
            certificatesList={certificatesList}
            setCertificateList={setCertificatesList}
            certificateMappingDataList={certificateMappingDataList}
            setCertificateMappingDataList={setCertificateMappingDataList}
          />
          <IssuerAndSubjectOption
            isIssuerAndSubjectChecked={isIssuerAndSubjectChecked}
            onChangeIssuerAndSubjectCheck={onChangeIssuerAndSubjectCheck}
            setIsAddButtonDisabled={setIsAddButtonDisabled}
            issuerValue={issuer}
            setIssuerValue={setIssuer}
            subjectValue={subject}
            setSubjectValue={setSubject}
          />
        </>
      </Modal>
      <DeletionConfirmationModal
        title={"Remove certificate mapping data"}
        isOpen={isDeletionModalOpen}
        onClose={onCloseDeletionModal}
        actions={deletionModalActions}
        messageText={deletionMessage}
      />
    </>
  );
};

export default IpaCertificateMappingData;
