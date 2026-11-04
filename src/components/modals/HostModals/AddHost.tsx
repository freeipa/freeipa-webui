import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  HelperText,
  HelperTextItem,
  TextInput,
} from "@patternfly/react-core";
// Layout
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputWithValidation from "src/components/layouts/InputWithValidation";
// Data types
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { FindRPCResponse } from "src/services/rpc";
import { useAddHostMutation, HostAddPayload } from "src/services/rpcHosts";
import { isValidIpAddress } from "src/utils/utils";

interface PropsToAddHost {
  onClose: () => void;
  onRefresh: () => void;
}

const AddHost = (props: PropsToAddHost) => {
  const dispatch = useAppDispatch();

  // Define 'executeCommand' to add user data to IPA server
  const [executeHostAddCommand] = useAddHostMutation();

  // States for TextInputs
  const [hostName, setHostName] = useState("");
  const [hostClass, setHostClass] = useState("");
  const [hostIpAddress, setHostIpAddress] = useState("");
  const [description, setDescription] = useState("");

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);

  // Checkboxes
  const [forceCheckbox, setForceCheckbox] = useState(false);
  const [generateOtpCheckbox, setGenerateOtpCheckbox] = useState(false);
  const [noMembershipCheckbox, setNoMembershipCheckbox] = useState(false);
  const [isForceDisabled, setIsForceDisabled] = useState(false);

  // Check for FQDN compatible string
  // The domain name should require at least two labels,
  // but IPA accepts names like 'a.b'.
  const validHostNameRegex =
    /^([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]?)(\.([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]?))+\.?$/;

  // Buttons are disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (hostName.length > 0 && isValidIpAddress(hostIpAddress)) {
      setButtonDisabled(false);
      setIsForceDisabled(false);
    } else {
      setIsForceDisabled(true);
      setButtonDisabled(true);
    }
  });

  const handleForceCheckbox = () => {
    setForceCheckbox(!forceCheckbox);
  };
  const handleOtpCheckbox = () => {
    setGenerateOtpCheckbox(!generateOtpCheckbox);
  };
  const handleNoMembershipCheckbox = () => {
    setNoMembershipCheckbox(!noMembershipCheckbox);
  };

  // List of fields
  const fields = [
    {
      id: "modal-form-host-name",
      name: "Host FQDN",
      pfComponent: (
        <>
          <InputWithValidation
            dataCy="modal-textbox-host-name"
            id="modal-form-host-name"
            name="modal-form-host-name"
            value={hostName}
            onChange={setHostName}
            isRequired
            placeholder="e.g. host.example.com"
            rules={[
              {
                id: "valid-fqdn",
                message:
                  "Must be a fully qualified domain name with at least two labels separated by a dot",
                validate: (value: string) => validHostNameRegex.test(value),
              },
              {
                id: "valid-chars",
                message:
                  "Allowed characters: a-z, A-Z, 0-9, hyphen (-), and dot (.) as label separator",
                validate: (value: string) => /^[a-zA-Z0-9.-]+$/.test(value),
              },
            ]}
          />
        </>
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-host-desc",
      name: "Description",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-host-description"
          type="text"
          id="modal-form-host-desc"
          name="modal-form-host-desc"
          value={description}
          onChange={(_event, value: string) => setDescription(value)}
        />
      ),
    },
    {
      id: "modal-form-host-class",
      name: "Class",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-host-class"
          type="text"
          id="modal-form-host-class"
          name="modal-form-host-class"
          value={hostClass}
          onChange={(_event, value: string) => setHostClass(value)}
        />
      ),
    },
    {
      id: "modal-form-host-ip-address",
      name: "IP address",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-host-ip-address"
          id="modal-form-host-ip-address"
          name="modal-form-host-ip-address"
          value={hostIpAddress}
          onChange={setHostIpAddress}
          rules={[
            {
              id: "ruleIp",
              message: "Must be a valid IPv4 or IPv6 address",
              validate: (v: string) => (v === "" ? false : isValidIpAddress(v)),
            },
          ]}
        />
      ),
    },
    {
      id: "host-force",
      name: "",
      pfComponent: (
        <div title="Skip the DNS check, but requires a valid IP address">
          <Checkbox
            data-cy="modal-checkbox-force-host"
            label="Force"
            isChecked={forceCheckbox}
            aria-label="force host name checkbox"
            id="forceCheckbox"
            name="forceCheckbox"
            value="force"
            onChange={handleForceCheckbox}
            isDisabled={isForceDisabled}
          />
          <HelperText>
            <HelperTextItem variant="indeterminate">
              Allow adding host objects that does not have DNS entries
              associated with them
            </HelperTextItem>
          </HelperText>
        </div>
      ),
    },
    {
      id: "generate-otp",
      name: "",
      pfComponent: (
        <Checkbox
          data-cy="modal-checkbox-generate-otp"
          label="Generate OTP"
          isChecked={generateOtpCheckbox}
          aria-label="Generate OTP checkbox"
          id="generateOtpCheckbox"
          name="generateOtpCheckbox"
          value="generateotp"
          onChange={handleOtpCheckbox}
        />
      ),
    },
    {
      id: "no-membership",
      name: "",
      pfComponent: (
        <Checkbox
          data-cy="modal-checkbox-suppress-membership"
          label="Suppress processing of membership attributes"
          isChecked={noMembershipCheckbox}
          aria-label="Suppress membership attributes checkbox"
          id="noMembershipCheckbox"
          name="noMembershipCheckbox"
          value="nomembership"
          onChange={handleNoMembershipCheckbox}
          className="pf-v6-u-mb-md"
        />
      ),
    },
  ];

  const addHostHandler = () => {
    if (!isValidIpAddress(hostIpAddress)) return;

    setAddBtnSpinning(true);
    const newHostPayload = {
      fqdn: hostName,
    } as HostAddPayload;

    if (hostClass !== "") {
      newHostPayload.userclass = hostClass;
    }
    if (hostIpAddress !== "") {
      newHostPayload.ip_address = hostIpAddress;
    }
    if (forceCheckbox) {
      newHostPayload.force = forceCheckbox;
    }
    if (description !== "") {
      newHostPayload.description = description;
    }
    if (generateOtpCheckbox) {
      newHostPayload.random = generateOtpCheckbox;
    }

    executeHostAddCommand(newHostPayload).then((host) => {
      if ("data" in host) {
        const data = host.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          let title = "";
          if ("code" in error) {
            title = "IPA error " + error.code + ": " + error.name;
          }
          dispatch(
            addAlert({
              name: "add-host-error",
              title: title,
              variant: "danger",
            })
          );
        } else {
          dispatch(
            addAlert({
              name: "add-host-success",
              title: "New host added",
              variant: "success",
            })
          );
          props.onRefresh();
          props.onClose();
        }
      }
      setAddBtnSpinning(false);
    });
  };

  const onClose = () => {
    if (!addSpinning) {
      props.onClose();
    }
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-host"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="hosts-add-host-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-host"
      variant="link"
      onClick={onClose}
      isDisabled={addSpinning}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-host-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add host"
      formId="hosts-add-host-modal"
      fields={fields}
      show
      onSubmit={addHostHandler}
      onClose={onClose}
      actions={modalActions}
    />
  );
};

export default AddHost;
