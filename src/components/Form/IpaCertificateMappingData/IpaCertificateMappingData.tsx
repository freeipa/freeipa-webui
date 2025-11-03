import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Utils
import { getParamProperties } from "src/utils/ipaObjectUtils";
// Components
import SecondaryButton from "../../layouts/SecondaryButton";
import CertificateMappingDataOption from "../../CertificateMappingDataOption";
import IssuerAndSubjectOption from "../../IssuerAndSubjectOption";
import { ErrorResult } from "src/services/rpc";
import {
  useAddCertMapDataMutation,
  useRemoveCertMapDataMutation,
} from "src/services/rpcUsers";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Modals
import ConfirmationModal from "../../modals/ConfirmationModal";
// Icons
import { MapIcon } from "@patternfly/react-icons";

export interface PropsToIpaCertificateMappingData {
  ipaObject: Record<string, unknown>;
  onChange: (ipaObject: Record<string, unknown>) => void;
  metadata: Metadata;
  onRefresh: () => void;
}

const IpaCertificateMappingData = (props: PropsToIpaCertificateMappingData) => {
  const dispatch = useAppDispatch();

  const { value } = getParamProperties({
    name: "ipacertmapdata",
    ipaObject: props.ipaObject,
    metadata: props.metadata,
    objectName: "user",
  });
  // TODO: Use 'readOnly' in the fields (right now is 'undefined')
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
  const [deletionMessageObj, setDeletionMessageObj] = React.useState("");
  const [modalSpinning, setModalSpinning] = React.useState(false);

  const onCloseDeletionModal = () => {
    setIsDeletionModalOpen(false);
  };

  const deletionModalActions = [
    <Button
      data-cy="modal-button-delete"
      key="del-certificate-mapping-data"
      variant="danger"
      onClick={() => onRemoveCertificateMappingData(idxToDelete)}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Deleting"
      spinnerAriaLabelledBy="Deleting"
      spinnerAriaLabel="Deleting"
    >
      {modalSpinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onCloseDeletionModal}
    >
      Cancel
    </Button>,
  ];

  // Operation when deleting an entry
  const onDeleteCertMapData = (idx: number) => {
    setIdxToDelete(idx);
    setDeletionMessage("Do you want to remove certificate mapping data?");
    setDeletionMessageObj(certificateMappingDataMainList[idx]);
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

    setModalSpinning(true);

    addCertMapData(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Close the modal
          setIsOpen(false);
          // Set alert: success
          dispatch(
            addAlert({
              name: "add-cert-mapping-data-success",
              title:
                "Added certificate mappings to user '" +
                props.ipaObject.uid +
                "'",
              variant: "success",
            })
          );
          // Reset fields' values
          resetFields();
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "add-cert-mapping-data-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
        setModalSpinning(false);
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
        if (response.data?.result) {
          // Close the modal
          setIsOpen(false);
          // Set alert: success
          dispatch(
            addAlert({
              name: "remove-cert-mapping-data-success",
              title:
                "Removed certificate mappings from user '" +
                props.ipaObject.uid +
                "'",
              variant: "success",
            })
          );
          // Reset fields' values
          resetFields();
          setIsDeletionModalOpen(false);
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "remove-cert-mapping-data-error",
              title: errorMessage.message,
              variant: "danger",
            })
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
      dataCy="modal-button-add"
      key="add"
      onClickHandler={onAddCertificateMappingData}
      isDisabled={isAddButtonDisabled}
      isLoading={modalSpinning}
      spinnerAriaValueText="Adding"
      spinnerAriaLabelledBy="Adding"
      spinnerAriaLabel="Adding"
      name={"add-certificate-mapping-data-modal"}
    >
      {modalSpinning ? "Adding" : "Add"}
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onClose}
      name={"cancel-certificate.mapping-data-modal"}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      {certificateMappingDataMainList !== undefined &&
      certificateMappingDataMainList.length > 0
        ? certificateMappingDataMainList.map((certMapData, idx) => {
            return (
              <Flex
                key={"flex-" + idx}
                flex={{ default: "flex_1" }}
                className="pf-v6-u-mb-sm"
                flexWrap={{ default: "nowrap" }}
                name={"flex-certmapdata-" + idx}
              >
                <FlexItem name={"flexitem-certmapdata-" + idx}>
                  <MapIcon /> {certMapData}
                </FlexItem>
                <FlexItem>
                  <SecondaryButton
                    dataCy="user-tab-settings-button-delete-certificate-mapping-data"
                    onClickHandler={() => onDeleteCertMapData(idx)}
                    name={"remove-certificate-mapping-data-" + idx}
                  >
                    Delete
                  </SecondaryButton>
                </FlexItem>
              </Flex>
            );
          })
        : null}

      <SecondaryButton
        dataCy="user-tab-settings-button-add-certificate-mapping-data"
        name={"add-certificate-mapping-data"}
        onClickHandler={() => setIsOpen(true)}
      >
        Add
      </SecondaryButton>
      <Modal
        data-cy={"add-certificate-mapping-data-modal"}
        variant="small"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalHeader
          title="Add certificate mapping data"
          labelId="add-certificate-mapping-data-modal"
        />
        <ModalBody id="add-certificate-mapping-data-modal-body">
          <CertificateMappingDataOption
            dataCy="modal-cert-map-data"
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
        </ModalBody>
        <ModalFooter>{actions}</ModalFooter>
      </Modal>
      <ConfirmationModal
        dataCy={"remove-certificate-mapping-data-modal"}
        title={"Remove certificate mapping data"}
        isOpen={isDeletionModalOpen}
        onClose={onCloseDeletionModal}
        actions={deletionModalActions}
        messageText={deletionMessage}
        messageObj={deletionMessageObj}
      />
    </>
  );
};

export default IpaCertificateMappingData;
