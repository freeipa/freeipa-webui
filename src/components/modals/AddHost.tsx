import React, { MutableRefObject, useEffect, useRef, useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  HelperText,
  HelperTextItem,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
// Layout
import SecondaryButton from "../layouts/SecondaryButton";
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addHost } from "src/store/Identity/hosts-slice";

export interface PropsToAddHost {
  show: boolean;
  handleModalToggle: () => void;
  onRefresh?: () => void;
}

const AddHost = (props: PropsToAddHost) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // States for TextInputs
  const [hostName, setHostName] = useState("");
  const [hostClass, setHostClass] = useState("");
  const [hostIpAddress, setHostIpAddress] = useState("");

  // TextInput setters
  const hostNameHandler = (value: string) => {
    setHostName(value);
  };
  const hostClassHandler = (value: string) => {
    setHostClass(value);
  };
  const hostIpAddressHandler = (value: string) => {
    setHostIpAddress(value);
  };

  // DNS zone Selector
  const defaultDnsZone = "server.ipa.demo";
  const [isDnsZoneOpen, setIsDnsZoneOpen] = useState(false);
  const [dnsZoneSelected, setDnsZoneSelected] = useState(defaultDnsZone);
  const dnsZoneOptions = [{ value: defaultDnsZone, disabled: false }]; // TODO: Adapt to existing DNS options

  const dnsZoneOnToggle = (isOpen: boolean) => {
    setIsDnsZoneOpen(isOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dnsZoneOnSelect = (selection: any) => {
    setDnsZoneSelected(selection.target.textContent);
    setIsDnsZoneOpen(false);
  };

  // Checkboxes
  const [forceCheckbox, setForceCheckbox] = useState(false);
  const [generateOtpCheckbox, setGenerateOtpCheckbox] = useState(false);

  // Refs
  const hostNameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const hostClassRef = useRef() as MutableRefObject<HTMLInputElement>;
  const hostIpAddressRef = useRef() as MutableRefObject<HTMLInputElement>;

  // Validation fields
  const [hostNameValidation, setHostNameValidation] = useState({
    isError: false,
    message: "",
    pfError: ValidatedOptions.default,
  });

  const [hostDnsZoneValidation, setHostDnsZoneValidation] = useState({
    isError: false,
    message: "",
    pfError: ValidatedOptions.default,
  });

  const hostNameValidationHandler = () => {
    if (hostName === "") {
      const hostNameVal = {
        isError: true,
        message: "Required field",
        pfError: ValidatedOptions.error,
      };
      setHostNameValidation(hostNameVal);
      return true;
    }
    return false;
  };

  const dnsZoneValidationHandler = () => {
    if (dnsZoneSelected.length === 0) {
      const dnsZoneVal = {
        isError: true,
        message: "Required field",
        pfError: ValidatedOptions.error,
      };
      setHostDnsZoneValidation(dnsZoneVal);
      return true;
    }
    return false;
  };

  // Buttons are disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (hostName.length > 0 && dnsZoneSelected.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [hostName, dnsZoneSelected]);

  // Reset validation methods
  // - Host name
  const resetHostNameError = () => {
    setHostNameValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

  // - DNS zone
  const resetDnsZoneError = () => {
    setHostDnsZoneValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

  // List of fields
  const fields = [
    {
      id: "host-name",
      name: "Host name",
      pfComponent: (
        <>
          <TextInput
            type="text"
            id="modal-form-host-name"
            name="modal-form-host-name"
            onFocus={resetHostNameError}
            onBlur={hostNameValidationHandler}
            value={hostName}
            onChange={(_event, value: string) => hostNameHandler(value)}
            validated={hostNameValidation.pfError}
            ref={hostNameRef}
          />
          <HelperText>
            {!hostNameValidation.isError && (
              <HelperTextItem>{hostNameValidation.message}</HelperTextItem>
            )}
            {hostNameValidation.isError && (
              <HelperTextItem variant="error">
                {hostNameValidation.message}
              </HelperTextItem>
            )}
          </HelperText>
        </>
      ),
    },
    {
      id: "dns-zone",
      name: "DNS zone",
      pfComponent: (
        <>
          <Select
            id="dns-zone-selector"
            name="dnszone"
            variant={SelectVariant.single}
            placeholderText=" "
            aria-label="Select DNS zone selector"
            onToggle={(_event, isOpen: boolean) => dnsZoneOnToggle(isOpen)}
            onFocus={resetDnsZoneError}
            onSelect={dnsZoneOnSelect}
            selections={dnsZoneSelected}
            isOpen={isDnsZoneOpen}
            aria-labelledby="dns zone"
          >
            {dnsZoneOptions.map((option, index) => (
              <SelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
              />
            ))}
          </Select>
          <HelperText>
            {!hostDnsZoneValidation.isError && (
              <HelperTextItem>{hostDnsZoneValidation.message}</HelperTextItem>
            )}
            {hostDnsZoneValidation.isError && (
              <HelperTextItem variant="error">
                {hostDnsZoneValidation.message}
              </HelperTextItem>
            )}
          </HelperText>
        </>
      ),
    },
    {
      id: "host-class",
      name: "Class",
      pfComponent: (
        <TextInput
          type="text"
          id="modal-form-host-class"
          name="userclass"
          value={hostClass}
          onChange={(_event, value: string) => hostClassHandler(value)}
          ref={hostClassRef}
        />
      ),
    },
    {
      id: "host-ip-address",
      name: "IP address",
      pfComponent: (
        <TextInput
          type="text"
          id="modal-form-host-ip-address"
          name="ip_address"
          value={hostIpAddress}
          onChange={(_event, value: string) => hostIpAddressHandler(value)}
          ref={hostIpAddressRef}
        />
      ),
    },
    {
      id: "host-force",
      name: "",
      pfComponent: (
        <Checkbox
          label="Force"
          isChecked={forceCheckbox}
          aria-label="force host name checkbox"
          id="forceCheckbox"
          name="force"
          value="force"
        />
      ),
    },
    {
      id: "generate-otp",
      name: "",
      pfComponent: (
        <Checkbox
          label="Generate OTP"
          isChecked={generateOtpCheckbox}
          aria-label="Generate OTP checkbox"
          id="generateOtpCheckbox"
          name="random"
          value="generateotp"
          className="pf-v5-u-mb-md"
        />
      ),
    },
  ];

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setHostName("");
    setDnsZoneSelected(defaultDnsZone);
    setHostClass("");
    setHostIpAddress("");
    setForceCheckbox(false);
    setGenerateOtpCheckbox(false);
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanAllFields();
    resetValidations();
    props.handleModalToggle();
  };

  // Helper method to reset validation values
  const resetValidations = () => {
    resetHostNameError();
    resetDnsZoneError();
  };

  // List of field validations
  const validateFields = () => {
    resetValidations();
    const hostNameError = hostNameValidationHandler();
    const dnsZoneError = dnsZoneValidationHandler();
    if (hostNameError || dnsZoneError) {
      return false;
    } else return true;
  };

  const addHostHandler = () => {
    const validation = validateFields();
    if (validation) {
      const newHost: Host = {
        hostName: hostName,
        fqdn: hostName + "." + dnsZoneSelected,
        dnsZone: dnsZoneSelected,
        userclass: hostClass,
        ip_address: hostIpAddress,
        description: "",
        enrolledby: "", // TODO: Investigate on enrolling hosts to see how this value is determined
        force: false,
        has_keytab: false,
        has_password: false,
        krbcanonicalname: "",
        krbprincipalname: "",
        managedby_host: [],
        memberof_hostgroup: [],
        sshpubkeyfp: [],
        nshostlocation: "",
        l: "",
        attributelevelrights: [],
        krbpwdpolicyreference: [],
        managing_host: [],
        serverhostname: "",
        ipakrbrequirespreauth: false,
        ipakrbokasdelegate: false,
        ipakrboktoauthasdelegate: false,
      };
      dispatch(addHost(newHost));
      cleanAndCloseModal();
    }
  };

  const addAndAddAnotherHandler = () => {
    const validation = validateFields();
    if (validation) {
      const newHost: Host = {
        hostName: hostName,
        fqdn: hostName + "." + dnsZoneSelected,
        dnsZone: dnsZoneSelected,
        userclass: hostClass,
        ip_address: hostIpAddress,
        description: "",
        enrolledby: "", // TODO: Investigate on enrolling hosts to set this value correctly
        force: false,
        has_keytab: false,
        has_password: false,
        krbcanonicalname: "",
        krbprincipalname: "",
        managedby_host: [],
        memberof_hostgroup: [],
        sshpubkeyfp: [],
        nshostlocation: "",
        l: "",
        attributelevelrights: [],
        krbpwdpolicyreference: [],
        managing_host: [],
        serverhostname: "",
        ipakrbrequirespreauth: false,
        ipakrbokasdelegate: false,
        ipakrboktoauthasdelegate: false,
      };
      dispatch(addHost(newHost));
      // Do not close the modal, but clean fields & reset validations
      cleanAllFields();
      resetValidations();
    }
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      key="add-new-host"
      isDisabled={buttonDisabled}
      onClickHandler={addHostHandler}
      form="modal-form"
    >
      Add
    </SecondaryButton>,
    <SecondaryButton
      key="add-and-add-another-host"
      isDisabled={buttonDisabled}
      onClickHandler={addAndAddAnotherHandler}
    >
      Add and add another
    </SecondaryButton>,
    <Button key="cancel-new-host" variant="link" onClick={cleanAndCloseModal}>
      Cancel
    </Button>,
  ];

  // Render 'AddHost'
  return (
    <ModalWithFormLayout
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add host"
      formId="users-add-host-modal"
      fields={fields}
      show={props.show}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddHost;
