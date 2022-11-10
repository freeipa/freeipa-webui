import React, { useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";

const UsersMailingAddress = () => {
  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zip, setZip] = useState("");

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
          <FormGroup label="Street address" fieldId="street-address">
            <TextInput
              id="street-address"
              name="street"
              value={streetAddress}
              type="text"
              aria-label="street address"
              onChange={onChangeStreetAddressHandler}
            />
          </FormGroup>
          <FormGroup label="City" fieldId="city">
            <TextInput
              id="city"
              name="l"
              value={city}
              type="text"
              aria-label="city"
              onChange={onChangeCityHandler}
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="State/province" fieldId="state-province">
            <TextInput
              id="state-province"
              name="st"
              value={stateProvince}
              type="text"
              aria-label="state province"
              onChange={onChangeStateProvinceHandler}
            />
          </FormGroup>
          <FormGroup label="ZIP" fieldId="zip">
            <TextInput
              id="zip"
              name="postalcode"
              value={zip}
              type="text"
              aria-label="zip"
              onChange={onChangeZipHandler}
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersMailingAddress;
