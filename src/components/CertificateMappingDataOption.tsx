import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Radio,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
// Components
import PopoverWithIconLayout from "./layouts/PopoverWithIconLayout";
import SecondaryButton from "./layouts/SecondaryButton";

interface PropsToCertificateMappingDataOption {
  isCertMappingDataChecked: boolean;
  onChangeCertMappingDataCheck: (value: boolean) => void;
  setIsAddButtonDisabled: (value: boolean) => void;
  certificatesList: string[];
  setCertificateList: (value: string[]) => void;
  certificateMappingDataList: string[];
  setCertificateMappingDataList: (value: string[]) => void;
}

const CertificateMappingDataOption = (
  props: PropsToCertificateMappingDataOption
) => {
  // Deep-copy of the data that will be used for a short-term copy on simple operations.
  const certificateMappingDataListCopy = structuredClone(
    props.certificateMappingDataList
  );
  const certificateListCopy = structuredClone(props.certificatesList);

  // CERTIFICATE MAPPING DATA
  // 'Change certificate mapping data' handler
  const onHandleCertificateMappingDataChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    certificateMappingDataListCopy[idx] = (
      event.target as HTMLInputElement
    ).value;
    props.setCertificateMappingDataList(certificateMappingDataListCopy);
  };

  // 'Remove certificate mapping data' handler
  const onRemoveCertificateMappingDataHandler = (idx: number) => {
    certificateMappingDataListCopy.splice(idx, 1);
    props.setCertificateMappingDataList(certificateMappingDataListCopy);
  };

  // 'Add certificate mapping data' handler
  const onAddCertificateMappingDataHandler = () => {
    certificateMappingDataListCopy.push("");
    props.setCertificateMappingDataList(certificateMappingDataListCopy);
  };

  // Validate if 'Certificate mapping data' and 'Certificate' are not empty to enable the 'Add' button
  React.useEffect(() => {
    if (
      props.isCertMappingDataChecked &&
      ((props.certificateMappingDataList.length > 0 &&
        props.certificateMappingDataList[
          props.certificateMappingDataList.length - 1
        ] !== "") ||
        (props.certificatesList.length > 0 &&
          props.certificatesList[props.certificatesList.length - 1] !== ""))
    ) {
      props.setIsAddButtonDisabled(false);
    } else {
      props.setIsAddButtonDisabled(true);
    }
  }, [
    props.isCertMappingDataChecked,
    props.certificateMappingDataList,
    props.certificatesList,
  ]);

  // Render 'Certificate mapping data' (text input + action buttons)
  const certificateMappingDataElement = (
    <>
      <Flex direction={{ default: "column" }} name="ipacertmapdata">
        {certificateMappingDataListCopy.map((certMap, idx) => (
          <Flex
            direction={{ default: "row" }}
            key={"ipacertmapdata-" + idx + "-div"}
            name={"flex-ipacertmapdata-" + idx + "-div"}
          >
            <FlexItem
              key={"ipacertmapdata-" + idx + "-textbox"}
              flex={{ default: "flex_1" }}
              name={"flexitem-ipacertmapdata-" + idx + "-div"}
            >
              <TextInput
                id="cert-map-data"
                value={certMap}
                type="text"
                name={"ipacertmapdata-" + idx}
                aria-label="certificate mapping data textbox"
                onChange={(event, value) =>
                  onHandleCertificateMappingDataChange(value, event, idx)
                }
              />
            </FlexItem>
            <FlexItem key={"ipacertmapdata-" + idx + "-delete-button"}>
              <SecondaryButton
                name="remove"
                onClickHandler={() =>
                  onRemoveCertificateMappingDataHandler(idx)
                }
              >
                Delete
              </SecondaryButton>
            </FlexItem>
          </Flex>
        ))}
      </Flex>
      <SecondaryButton
        name={"add-ipacertmapdata"}
        classname="pf-v5-u-mt-sm pf-v5-u-mb-0"
        isDisabled={!props.isCertMappingDataChecked}
        onClickHandler={onAddCertificateMappingDataHandler}
      >
        Add
      </SecondaryButton>
    </>
  );

  // CERTIFICATE
  // - 'Change certificate' handler
  const onHandleCertificateChange = (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>,
    idx: number
  ) => {
    certificateListCopy[idx] = (event.target as HTMLTextAreaElement).value;
    props.setCertificateList(certificateListCopy);
  };

  // - 'Remove certificate' handler
  const onRemoveCertificateHandler = (idx: number) => {
    certificateListCopy.splice(idx, 1);
    props.setCertificateList(certificateListCopy);
  };

  // - 'Add certificate' handler
  const onAddCertificateHandler = () => {
    certificateListCopy.push("");
    props.setCertificateList(certificateListCopy);
  };

  // Render 'Certificates' (text area + + action buttons)
  const certificateElement = (
    <>
      <Flex direction={{ default: "column" }} name="certificate">
        {certificateListCopy.map((certificate, idx) => (
          <Flex
            direction={{ default: "row" }}
            key={"flex-certificate-" + idx + "-div"}
            alignItems={{ default: "alignItemsFlexEnd" }}
            name={"flex-certificate-" + idx + "-div"}
          >
            <FlexItem
              key={"flexitem-certificate-" + idx + "-textbox"}
              flex={{ default: "flex_1" }}
            >
              <TextArea
                id="cert-map-data"
                value={certificate}
                type="text"
                name={"certificate-" + idx}
                aria-label="certificate textarea"
                resizeOrientation="vertical"
                onChange={(event, value) =>
                  onHandleCertificateChange(value, event, idx)
                }
                style={{ height: "135px" }}
              />
            </FlexItem>
            <FlexItem
              key={"certificate-" + idx + "-delete-button"}
              name={"certificate-" + idx + "-delete-button"}
            >
              <SecondaryButton
                name="remove"
                onClickHandler={() => onRemoveCertificateHandler(idx)}
              >
                Delete
              </SecondaryButton>
            </FlexItem>
          </Flex>
        ))}
      </Flex>
      <SecondaryButton
        name={"add-certificate"}
        classname="pf-v5-u-mt-sm"
        isDisabled={!props.isCertMappingDataChecked}
        onClickHandler={onAddCertificateHandler}
      >
        Add
      </SecondaryButton>
    </>
  );

  // Popover messages
  const certificateMessage = (
    <div>
      <p>Base-64 encoder user certificate</p>
    </div>
  );

  return (
    <>
      <Radio
        isChecked={props.isCertMappingDataChecked}
        name="cert-mapping-data-radio"
        onChange={(_event, value) => props.onChangeCertMappingDataCheck(value)}
        label="Certificate mapping data"
        id="certificate-mapping-data"
        className="pf-v5-u-mb-md"
      />
      <div className="pf-v5-u-ml-lg pf-v5-u-mb-md">
        <Form>
          <FormGroup
            label="Certificate mapping data"
            fieldId="certificate-mapping-data-modal"
            role="group"
            name={"certificate-mapping-data-section"}
          >
            <>{certificateMappingDataElement}</>
          </FormGroup>
          <FormGroup
            label="Certificate"
            fieldId="certificate"
            role="group"
            labelIcon={
              <PopoverWithIconLayout
                message={certificateMessage}
                hasAutoWidth={true}
              />
            }
            name={"certificate-section"}
          >
            <>{certificateElement}</>
          </FormGroup>
        </Form>
      </div>
    </>
  );
};

export default CertificateMappingDataOption;
