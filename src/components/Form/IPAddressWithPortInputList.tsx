import React from "react";
// Button
import { Button, Flex, FlexItem, TextInput } from "@patternfly/react-core";
import InputWithValidation from "../layouts/InputWithValidation";
import { isValidIpAddress } from "src/utils/utils";
import { IPAddressWithPort } from "src/services/rpcDnsForwardZones";

interface IPAddressWithPortInputListProps {
  dataCy: string;
  name: string;
  ariaLabel: string;
  list: IPAddressWithPort[];
  setList: (value: IPAddressWithPort[]) => void;
}

const IPAddressWithPortInputList = (props: IPAddressWithPortInputListProps) => {
  // Change element on list handle
  const onChangeHandler = (value: IPAddressWithPort, idx: number) => {
    // Update ipaObject
    const listCopy = [...props.list];
    listCopy[idx] = value;
    props.setList(listCopy);
  };

  return (
    <>
      <Flex direction={{ default: "column" }} name={props.name}>
        {props.list.map((item, idx) => (
          <Flex
            direction={{ default: "row" }}
            gap={{ default: "gapMd" }}
            // eslint-disable-next-line @eslint-react/no-array-index-key
            key={props.name + "-" + idx + "-div"}
          >
            <Flex
              direction={{ default: "row" }}
              gap={{ default: "gapXs" }}
              flex={{ default: "flex_4" }}
            >
              <FlexItem
                // eslint-disable-next-line @eslint-react/no-array-index-key
                key={props.name + "-" + idx + "-ip-address-textbox"}
                flex={{ default: "flex_3" }}
              >
                <InputWithValidation
                  dataCy={props.dataCy + "-" + idx}
                  id={props.name + "-" + idx}
                  value={item.ipAddress}
                  name={props.name + "-" + idx}
                  aria-label={props.ariaLabel + " number " + idx}
                  placeholder="IP Address"
                  onChange={(value) =>
                    onChangeHandler({ ipAddress: value, port: item.port }, idx)
                  }
                  rules={[
                    {
                      id: "ruleIp",
                      message: "Must be a valid IPv4 or IPv6 address",
                      validate: (v: string) =>
                        v === "" ? false : isValidIpAddress(v),
                    },
                  ]}
                  isRequired={true}
                  showAlways={true}
                />
              </FlexItem>
              <FlexItem
                // eslint-disable-next-line @eslint-react/no-array-index-key
                key={props.name + "-" + idx + "-port-textbox"}
                flex={{ default: "flex_1" }}
              >
                <TextInput
                  data-cy={props.dataCy + "-" + item + "-port"}
                  id={props.name + "-" + idx + "-port"}
                  name={props.name + "-" + idx + "-port"}
                  value={item.port ?? ""}
                  type="text"
                  aria-label={props.name + " port"}
                  placeholder="Port"
                  onChange={(_event, value) => {
                    const num = Number(value);
                    if (value === "" || !isNaN(num)) {
                      onChangeHandler(
                        {
                          ipAddress: item.ipAddress,
                          port: value === "" ? null : num,
                        },
                        idx
                      );
                    }
                  }}
                />
              </FlexItem>
            </Flex>
            <FlexItem
              /* eslint-disable-next-line @eslint-react/no-array-index-key */
              key={props.name + "-" + idx + "-delete-button"}
            >
              <Button
                data-cy={props.dataCy + "-" + item + "-delete-button"}
                variant="secondary"
                name={"remove-" + props.name + "-" + idx}
                onClick={() =>
                  props.setList(props.list.filter((_, i) => i !== idx))
                }
              >
                Delete
              </Button>
            </FlexItem>
          </Flex>
        ))}
      </Flex>
      <Button
        data-cy={props.dataCy + "-add-button"}
        variant="secondary"
        className="pf-v6-u-mt-sm"
        name={"add-" + props.name}
        onClick={() =>
          props.setList([...props.list, { ipAddress: "", port: null }])
        }
      >
        Add
      </Button>
    </>
  );
};

export default IPAddressWithPortInputList;
