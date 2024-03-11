import React from "react";
// PatternFly
import { Form, FormGroup, Radio, TextInput } from "@patternfly/react-core";
// Components
import PopoverWithIconLayout from "./layouts/PopoverWithIconLayout";

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
        isChecked={props.isIssuerAndSubjectChecked}
        name="issuer-and-subject-radio"
        onChange={(_event, value) => props.onChangeIssuerAndSubjectCheck(value)}
        label="Issuer and subject"
        id="issuer-and-subject"
        className="pf-v5-u-mb-md"
      />
      <div className="pf-v5-u-ml-lg pf-v5-u-mb-md" id="issuer-and-subject">
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
            isRequired={props.isIssuerAndSubjectChecked}
            name="issuer-formgroup"
          >
            <TextInput
              id="issuer"
              value={props.issuerValue}
              type="text"
              name="issuer"
              aria-label="issuer textbox"
              onChange={(_event, value: string) => onChangeIssuer(value)}
              isDisabled={!props.isIssuerAndSubjectChecked}
              placeholder="O=EXAMPLE.ORG,CN=Issuer Example CA"
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
            isRequired={props.isIssuerAndSubjectChecked}
            name="subject-formgroup"
          >
            <TextInput
              id="subject-textbox"
              value={props.subjectValue}
              type="text"
              name="subject"
              aria-label="subject textbox"
              onChange={(_event, value: string) => onChangeSubject(value)}
              isDisabled={!props.isIssuerAndSubjectChecked}
              placeholder="CN=Subject example,O=EXAMPLE.ORG"
            />
          </FormGroup>
        </Form>
      </div>
    </>
  );
};

export default IssuerAndSubjectOption;
