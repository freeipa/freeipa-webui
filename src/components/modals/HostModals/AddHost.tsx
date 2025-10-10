import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
// Layout
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputWithValidation from "src/components/layouts/InputWithValidation";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addHost } from "src/store/Identity/hosts-slice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import { FindRPCResponse } from "src/services/rpc";
import { useAddHostMutation, HostAddPayload } from "src/services/rpcHosts";
import { isValidIpAddress } from "src/utils/utils";

export interface PropsToAddHost {
  show: boolean;
  handleModalToggle: () => void;
  onOpenAddModal?: () => void;
  onCloseAddModal?: () => void;
  dnsZones: string[];
  onRefresh?: () => void;
}

const AddHost = (props: PropsToAddHost) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Define 'executeCommand' to add user data to IPA server
  const [executeHostAddCommand] = useAddHostMutation();

  // States for TextInputs
  const [hostName, setHostName] = useState("");
  const [hostClass, setHostClass] = useState("");
  const [hostIpAddress, setHostIpAddress] = useState("");
  const [description, setDescription] = useState("");

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [addAgainSpinning, setAddAgainBtnSpinning] =
    React.useState<boolean>(false);

  // DNS zone Selector
  const dnsZoneOptions = props.dnsZones.map((zone) => {
    return { value: zone, disabled: false };
  });
  const defaultDnsZone = props.dnsZones.length > 0 ? props.dnsZones[0] : "";
  const [isDnsZoneOpen, setIsDnsZoneOpen] = useState(false);
  const [dnsZoneSelected, setDnsZoneSelected] = useState(defaultDnsZone);

  useEffect(() => {
    if (props.dnsZones.length > 0) {
      setDnsZoneSelected(props.dnsZones[0]);
    }
  }, [props.dnsZones]);

  const dnsZoneOnToggle = () => {
    setIsDnsZoneOpen(!isDnsZoneOpen);
  };

  // Toggle
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy="modal-select-dns-zone-toggle"
      ref={toggleRef}
      onClick={dnsZoneOnToggle}
      className="pf-v6-u-w-100"
      isExpanded={isDnsZoneOpen}
    >
      {dnsZoneSelected}
    </MenuToggle>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dnsZoneOnSelect = (selection: any) => {
    setDnsZoneSelected(selection.target.textContent);
    setIsDnsZoneOpen(false);
  };

  // Checkboxes
  const [forceCheckbox, setForceCheckbox] = useState(false);
  const [generateOtpCheckbox, setGenerateOtpCheckbox] = useState(false);
  const [noMembershipCheckbox, setNoMembershipCheckbox] = useState(false);
  const [isForceDisabled, setIsForceDisabled] = useState(false);

  const validHostNameRegex = /^[a-zA-Z0-9-]+$/;

  // Validation fields

  const [hostDnsZoneValidation, setHostDnsZoneValidation] = useState({
    isError: false,
    message: "",
    pfError: ValidatedOptions.default,
  });

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
    if (
      hostName.length > 0 &&
      dnsZoneSelected.length > 0 &&
      isValidIpAddress(hostIpAddress)
    ) {
      setButtonDisabled(false);
      setIsForceDisabled(false);
    } else {
      setButtonDisabled(true);
      setIsForceDisabled(true);
    }
  }, [hostName, dnsZoneSelected, hostIpAddress]);

  // Reset validation methods
  // - Host name

  // - DNS zone
  const resetDnsZoneError = () => {
    setHostDnsZoneValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

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
      name: "Host name",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-host-name"
          id="modal-form-host-name"
          name="modal-form-host-name"
          value={hostName}
          isRequired
          onChange={setHostName}
          rules={[
            {
              id: "ruleNoDots",
              message: "Must be a single domain component (no dots)",
              validate: (v: string) => !v.includes("."),
            },
            {
              id: "ruleAllowed",
              message: "Only letters, numbers and '-'",
              validate: (v: string) => v === "" || validHostNameRegex.test(v),
            },
          ]}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "dns-zone",
      name: "DNS zone",
      pfComponent: (
        <>
          <Select
            data-cy="modal-select-dns-zone"
            id="dnszone"
            aria-label="Select DNS zone selector"
            toggle={toggle}
            onSelect={dnsZoneOnSelect}
            selected={dnsZoneSelected}
            isOpen={isDnsZoneOpen}
            aria-labelledby="dns zone"
          >
            <SelectList>
              {dnsZoneOptions.map((option, index) => (
                <SelectOption
                  data-cy={"modal-select-dns-zone-" + option.value}
                  isDisabled={option.disabled}
                  key={index}
                  value={option.value}
                >
                  {option.value}
                </SelectOption>
              ))}
            </SelectList>
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

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setHostName("");
    setDnsZoneSelected(defaultDnsZone);
    setHostClass("");
    setHostIpAddress("");
    setForceCheckbox(false);
    setGenerateOtpCheckbox(false);
    setNoMembershipCheckbox(false);
    setDescription("");
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanAllFields();
    resetValidations();
    if (props.onCloseAddModal !== undefined) {
      props.onCloseAddModal();
    }
  };

  // Helper method to reset validation values
  const resetValidations = () => {
    resetDnsZoneError();
  };

  // List of field validations
  const validateFields = () => {
    resetValidations();
    const dnsZoneError = dnsZoneValidationHandler();
    if (dnsZoneError) {
      return false;
    } else return true;
  };

  // Define status flags to determine user added successfully or error
  let isAdditionSuccess = true;

  // Track which button has been clicked ('onAddUser' or 'onAddAndAddAnother')
  // to better handle the 'retry' function and its behavior
  let onAddHostClicked = true;

  // Add host data
  const addHostData = async () => {
    let dnsZone = dnsZoneSelected;
    if (dnsZone.endsWith(".")) {
      // Strip trailing dot
      dnsZone = dnsZone.slice(0, -1);
    }
    const newHostPayload = {
      fqdn: hostName + "." + dnsZone,
    } as HostAddPayload;

    // Add the rest of parameters if they are not empty
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

    // Add host via API call
    await executeHostAddCommand(newHostPayload).then((host) => {
      if ("data" in host) {
        const data = host.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;
        const result = data.result;

        if (error) {
          // Set status flag: error
          isAdditionSuccess = false;
          // Handle error
          handleAPIError(error);
        } else {
          // Set alert: success
          alerts.addAlert("add-host-success", "New host added", "success");

          // Dispatch host data to redux
          const updatedHostList = result.result as unknown as Host;
          dispatch(addHost(updatedHostList));
          // Set status flag: success
          isAdditionSuccess = true;
          // Refresh data
          if (props.onRefresh !== undefined) {
            props.onRefresh();
          }
        }
        setAddBtnSpinning(false);
        setAddAgainBtnSpinning(false);
      }
    });
  };

  const addAndAddAnotherHandler = () => {
    onAddHostClicked = false;
    const validation = validateFields();
    if (validation) {
      setAddAgainBtnSpinning(true);
      addHostData().then(() => {
        if (isAdditionSuccess) {
          // Do not close the modal, but clean fields & reset validations
          cleanAllFields();
          resetValidations();
        } else {
          // Close the modal without cleaning fields
          if (props.onCloseAddModal !== undefined) {
            props.onCloseAddModal();
          }
        }
      });
    }
  };

  const addHostHandler = () => {
    onAddHostClicked = true;
    const validation = validateFields();
    if (validation) {
      setAddBtnSpinning(true);
      addHostData().then(() => {
        if (!isAdditionSuccess) {
          // Close the modal without cleaning fields
          if (props.onCloseAddModal !== undefined) {
            props.onCloseAddModal();
          }
        } else {
          // Clean data and close modal
          cleanAndCloseModal();
        }
      });
    }
  };

  // Handle API error data
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
    // Show Add modal
    if (props.onOpenAddModal !== undefined) {
      props.onOpenAddModal();
    }
  };

  const onRetry = () => {
    // Keep the add modal closed until the operation is done...
    if (props.onCloseAddModal !== undefined) {
      props.onCloseAddModal();
    }

    // Close the error modal
    closeAndCleanErrorParameters();

    // Repeats the same previous operation
    if (onAddHostClicked) {
      addHostHandler();
    } else {
      addAndAddAnotherHandler();
    }
  };

  const errorModalActions = [
    <SecondaryButton
      dataCy="modal-button-retry"
      key="retry"
      onClickHandler={onRetry}
    >
      Retry
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onCloseErrorModal}
    >
      Cancel
    </Button>,
  ];

  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("code" in error) {
      setErrorTitle("IPA error " + error.code + ": " + error.name);
      if (error.message !== undefined) {
        setErrorMessage(error.message);
      }
    }
    setIsModalErrorOpen(true);
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-host"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      type="submit"
      form="hosts-add-host-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <SecondaryButton
      dataCy="modal-button-add-and-add-another"
      key="add-and-add-another-host"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      onClickHandler={addAndAddAnotherHandler}
      spinnerAriaValueText="Adding again"
      spinnerAriaLabel="Adding again"
      isLoading={addAgainSpinning}
    >
      {addAgainSpinning ? "Adding" : "Add and add another"}
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-host"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render 'AddHost'
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        dataCy="add-host-modal"
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add host"
        formId="hosts-add-host-modal"
        fields={fields}
        show={props.show}
        onSubmit={addHostHandler}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="add-host-modal-error"
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default AddHost;
