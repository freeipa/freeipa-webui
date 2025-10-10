import React from "react";
// PatternFly
import { Form, FormGroup, Radio } from "@patternfly/react-core";
// Components
import PopoverWithIconLayout from "./layouts/PopoverWithIconLayout";
import InputRequiredText from "./layouts/InputRequiredText";

interface PropsToIssuerAndSubjectOption {
  isIssuerAndSubjectChecked: boolean;
  onChangeIssuerAndSubjectCheck: (value: boolean) => void;
  setIsAddButtonDisabled: (value: boolean) => void;
  issuerValue: string;
  setIssuerValue: (value: string) => void;
  subjectValue: string;
  setSubjectValue: (value: string) => void;
}

const IssuerAndSubjectOption = (props: PropsToIssuerAndSubjectOption) => {
  // Validate if 'issuer' and 'subject' are not empty to enable the 'Add' button
  React.useEffect(() => {
    if (
      props.isIssuerAndSubjectChecked &&
      props.issuerValue !== "" &&
      props.subjectValue !== ""
    ) {
      props.setIsAddButtonDisabled(false);
    } else {
      props.setIsAddButtonDisabled(true);
    }
  }, [props.isIssuerAndSubjectChecked, props.issuerValue, props.subjectValue]);

  // 'onChange' handlers
  const onChangeIssuer = (value: string) => {
    props.setIssuerValue(value);
  };
  const onChangeSubject = (value: string) => {
    props.setSubjectValue(value);
  };

  // Popover messages
  const issuerMessage = (
    <div>
      <p>Issuer of the certificate. Values are expected to be a DN</p>
    </div>
  );
  const subjectMessage = (
    <div>
      <p>Subject of the certificate. Values are expected to be a DN</p>
    </div>
  );

  return (
    <>
      <Radio
        data-cy="modal-radio-issuer-and-subject"
        isChecked={props.isIssuerAndSubjectChecked}
        name="issuer-and-subject-radio"
        onChange={(_event, value) => props.onChangeIssuerAndSubjectCheck(value)}
        label="Issuer and subject"
        id="issuer-and-subject"
        className="pf-v6-u-mb-md"
      />
      <div className="pf-v6-u-ml-lg pf-v6-u-mb-md" id="issuer-and-subject">
        <Form>
          <FormGroup
            label="Issuer"
            fieldId="issuer"
            labelHelp={
              <PopoverWithIconLayout
                message={issuerMessage}
                hasAutoWidth={true}
              />
            }
            isRequired={props.isIssuerAndSubjectChecked}
            name="issuer-formgroup"
          >
            <InputRequiredText
              dataCy="modal-textbox-issuer"
              id="issuer"
              name="issuer textbox"
              value={props.issuerValue}
              isDisabled={!props.isIssuerAndSubjectChecked}
              onChange={onChangeIssuer}
            />
          </FormGroup>
          <FormGroup
            label="Subject"
            fieldId="subject-textbox"
            labelHelp={
              <PopoverWithIconLayout
                message={subjectMessage}
                hasAutoWidth={true}
              />
            }
            isRequired={props.isIssuerAndSubjectChecked}
            name="subject-formgroup"
          >
            <InputRequiredText
              dataCy="modal-textbox-subject"
              id="subject-textbox"
              name="subject textbox"
              value={props.subjectValue}
              isDisabled={!props.isIssuerAndSubjectChecked}
              onChange={onChangeSubject}
            />
          </FormGroup>
        </Form>
      </div>
    </>
  );
};

export default IssuerAndSubjectOption;
