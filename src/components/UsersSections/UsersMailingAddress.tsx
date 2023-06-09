/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Util
import { isFieldReadable, isFieldWritable } from "src/utils/utils";
import FieldWrapper from "src/utils/FieldWrapper";

interface PropsToMailingAddress {
  userData: any;
  attrLevelRights: any;
}

const UsersMailingAddress = (props: PropsToMailingAddress) => {
  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zip, setZip] = useState("");

  // Updates data on 'userData' changes
  useEffect(() => {
    if (props.userData !== undefined) {
      const userData = props.userData as User;

      if (userData.street !== undefined) {
        setStreetAddress(userData.street);
      }
      if (userData.l !== undefined) {
        setCity(userData.l);
      }
      if (userData.st !== undefined) {
        setStateProvince(userData.st);
      }
      if (userData.postalcode !== undefined) {
        setZip(userData.postalcode);
      }
    }
  }, [props.userData]);

  const onChangeStreetAddressHandler = (value: string) => {
    setStreetAddress(value);
  };

  const onChangeCityHandler = (value: string) => {
    setCity(value);
  };

  const onChangeStateProvinceHandler = (value: string) => {
    setStateProvince(value);
  };

  const onChangeZipHandler = (value: string) => {
    setZip(value);
  };

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.street)}
            isReadable={isFieldReadable(props.attrLevelRights.street)}
          >
            <FormGroup label="Street address" fieldId="street-address">
              <TextInput
                id="street-address"
                name="street"
                value={streetAddress}
                type="text"
                aria-label="street address"
                onChange={onChangeStreetAddressHandler}
                isDisabled={isFieldWritable(props.attrLevelRights.street)}
              />
            </FormGroup>
          </FieldWrapper>

          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.l)}
            isReadable={isFieldReadable(props.attrLevelRights.l)}
          >
            <FormGroup label="City" fieldId="city">
              <TextInput
                id="city"
                name="l"
                value={city}
                type="text"
                aria-label="city"
                onChange={onChangeCityHandler}
                isDisabled={isFieldWritable(props.attrLevelRights.l)}
              />
            </FormGroup>
          </FieldWrapper>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.st)}
            isReadable={isFieldReadable(props.attrLevelRights.st)}
          >
            <FormGroup label="State/province" fieldId="state-province">
              <TextInput
                id="state-province"
                name="st"
                value={stateProvince}
                type="text"
                aria-label="state province"
                onChange={onChangeStateProvinceHandler}
                isDisabled={isFieldWritable(props.attrLevelRights.st)}
              />
            </FormGroup>
          </FieldWrapper>

          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.postalcode)}
            isReadable={isFieldReadable(props.attrLevelRights.postalcode)}
          >
            <FormGroup label="ZIP" fieldId="zip">
              <TextInput
                id="zip"
                name="postalcode"
                value={zip}
                type="text"
                aria-label="zip"
                onChange={onChangeZipHandler}
                isDisabled={isFieldWritable(props.attrLevelRights.postalcode)}
              />
            </FormGroup>
          </FieldWrapper>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersMailingAddress;
