// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Modal,
  Radio,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";

// Generic data to pass to the Textbox adder
interface ElementData {
  id: string | number;
  element: string;
}

interface PropsToCertificateMappingData {
  // Modal options
  isOpen: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  // First radio option: Certificate mapping data
  isCertMappingDataChecked: boolean;
  onChangeCertMappingDataCheck: (value: boolean) => void;
  // Second radio option: Issuer and subject
  isIssuerAndSubjectChecked: boolean;
  onChangeIssuerAndSubjectCheck: (value: boolean) => void;
  issuerValue: string;
  subjectValue: string;
  onChangeIssuer: (value: string) => void;
  onChangeSubject: (value: string) => void;
  // Generated texboxes, textareas, and data
  certificateMappingDataList: ElementData[];
  certificateList: ElementData[];
  onAddCertificateMappingDataHandler: () => void;
  onHandleCertificateMappingDataChange: (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => void;
  onRemoveCertificateMappingDataHandler: (idx: number) => void;
  onAddCertificateHandler: () => void;
  onHandleCertificateChange: (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>,
    idx: number
  ) => void;
  onRemoveCertificateHandler: (idx: number) => void;
}

const CertificateMappingDataModal = (props: PropsToCertificateMappingData) => {
  // Popover messages
  const certificateMessage = (
    <div>
      <p>Base-64 encoder user certificate</p>
    </div>
  );
  const issuerMessage = (
    <div>
      <p>Issuer of the certificate</p>
    </div>
  );
  const subjectMessage = (
    <div>
      <p>Subject of the certificate</p>
    </div>
  );

  return (
    <Modal
      variant="small"
      title="Add certificate mapping data"
      isOpen={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    >
      <Radio
        isChecked={props.isCertMappingDataChecked}
        name="cert-mapping-data-radio"
        onChange={props.onChangeCertMappingDataCheck}
        label="Certificate mapping data"
        id="certificate-mapping-data"
        className="pf-u-mb-md"
      />
      <div className="pf-u-ml-lg pf-u-mb-md">
        <Form>
          <FormGroup
            label="Certificate mapping data"
            fieldId="certificate-mapping-data-modal"
          >
            <Flex direction={{ default: "column" }} name="ipacertmapdata">
              {props.certificateMappingDataList.map((certMap, idx) => (
                <Flex
                  direction={{ default: "row" }}
                  key={certMap.id + "-" + idx + "-div"}
                  name="value"
                >
                  <FlexItem
                    key={certMap.id + "-textbox"}
                    flex={{ default: "flex_1" }}
                  >
                    <TextInput
                      id="cert-map-data"
                      value={certMap.element}
                      type="text"
                      name={"ipacertmapdata-" + idx}
                      aria-label="certificate mapping data textbox"
                      onChange={(value, event) =>
                        props.onHandleCertificateMappingDataChange(
                          value,
                          event,
                          idx
                        )
                      }
                    />
                  </FlexItem>
                  <FlexItem key={certMap.id + "-delete-button"}>
                    <SecondaryButton
                      name="remove"
                      onClickHandler={() =>
                        props.onRemoveCertificateMappingDataHandler(idx)
                      }
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </Flex>
            <SecondaryButton
              classname="pf-u-mt-sm pf-u-mb-0"
              isDisabled={!props.isCertMappingDataChecked}
              onClickHandler={props.onAddCertificateMappingDataHandler}
            >
              Add
            </SecondaryButton>
          </FormGroup>
          <FormGroup
            label="Certificate"
            fieldId="certificate"
            labelIcon={
              <PopoverWithIconLayout
                message={certificateMessage}
                hasAutoWidth={true}
              />
            }
          >
            <Flex direction={{ default: "column" }} name="certificate">
              {props.certificateList.map((certificate, idx) => (
                <Flex
                  direction={{ default: "row" }}
                  key={certificate.id + "-" + idx + "-div"}
                  alignItems={{ default: "alignItemsFlexEnd" }}
                  name="value"
                >
                  <FlexItem
                    key={certificate.id + "-textbox"}
                    flex={{ default: "flex_1" }}
                  >
                    <TextArea
                      id="cert-map-data"
                      value={certificate.element}
                      type="text"
                      name={"certificate-" + idx}
                      aria-label="certificate textarea"
                      resizeOrientation="vertical"
                      onChange={(value, event) =>
                        props.onHandleCertificateChange(value, event, idx)
                      }
                      style={{ height: "135px" }}
                    />
                  </FlexItem>
                  <FlexItem key={certificate.id + "-delete-button"}>
                    <SecondaryButton
                      name="remove"
                      onClickHandler={() =>
                        props.onRemoveCertificateHandler(idx)
                      }
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </Flex>
            <SecondaryButton
              classname="pf-u-mt-sm"
              isDisabled={!props.isCertMappingDataChecked}
              onClickHandler={props.onAddCertificateHandler}
            >
              Add
            </SecondaryButton>
          </FormGroup>
        </Form>
      </div>
      <Radio
        isChecked={props.isIssuerAndSubjectChecked}
        name="issuer-and-subject-radio"
        onChange={props.onChangeIssuerAndSubjectCheck}
        label="Issuer and subject"
        id="issuer-and-subject"
        className="pf-u-mb-md"
      />
      <div className="pf-u-ml-lg pf-u-mb-md">
        <Form>
          <FormGroup
            label="Issuer"
            fieldId="issuer"
            labelIcon={
              <PopoverWithIconLayout
                message={issuerMessage}
                hasAutoWidth={true}
              />
            }
          >
            <TextInput
              id="issuer-textbox"
              value={props.issuerValue}
              type="text"
              name="issuer"
              aria-label="issuer textbox"
              onChange={props.onChangeIssuer}
              isDisabled={!props.isIssuerAndSubjectChecked}
            />
          </FormGroup>
          <FormGroup
            label="Subject"
            fieldId="subject"
            labelIcon={
              <PopoverWithIconLayout
                message={subjectMessage}
                hasAutoWidth={true}
              />
            }
          >
            <TextInput
              id="subject-textbox"
              value={props.subjectValue}
              type="text"
              name="subject"
              aria-label="subject textbox"
              onChange={props.onChangeSubject}
              isDisabled={!props.isIssuerAndSubjectChecked}
            />
          </FormGroup>
        </Form>
      </div>
    </Modal>
  );
};

export default CertificateMappingDataModal;
