import React from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  Spinner,
  TextInput,
} from "@patternfly/react-core";
// Components
import CustomTooltip from "src/components/layouts/CustomTooltip";
// RPC
import {
  AddDnsZonePayload,
  useAddDnsZoneMutation,
} from "src/services/rpcDnsZones";
// Hooks
import { addAlert } from "src/store/alerts";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
// Icons
import { InfoCircleIcon } from "@patternfly/react-icons";
import InputWithValidation from "src/components/layouts/InputWithValidation";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddDnsZoneModal = (props: PropsToAddModal) => {
  // API calls
  const [addDnsZone] = useAddDnsZoneMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] =
    React.useState<boolean>(false);
  const [isAddAnotherButtonSpinning, setIsAddAnotherButtonSpinning] =
    React.useState<boolean>(false);
  const [dnsZoneName, setDnsZoneName] = React.useState<string>("");
  const [reverseZoneIp, setReverseZoneIp] = React.useState<string>("");
  const [skipOverlapCheck, setSkipOverlapCheck] =
    React.useState<boolean>(false);
  // - Radios
  const [isZoneNameRadioChecked, setIsZoneNameRadioChecked] =
    React.useState<boolean>(true);
  const [isReverseZoneIpRadioChecked, setIsReverseZoneIpRadioChecked] =
    React.useState<boolean>(false);

  // Tooltip messages
  const skipOverlapCheckMessage =
    "Force DNS zone creation even if it will overlap with an existing zone.";

  // Clear form fields
  const clearFields = () => {
    setDnsZoneName("");
    setReverseZoneIp("");
    setSkipOverlapCheck(false);
    setIsZoneNameRadioChecked(true);
    setIsReverseZoneIpRadioChecked(false);
  };

  // Error message
  const reverseZoneIpErrorMessage =
    "Not a valid network address (examples: 2001:db8::/64, 192.0.2.0/24)";

  const validateReverseZoneIp = (value: string): boolean => {
    // Regular expression to validate format. Examples: 2001:db8::/64, 192.0.2.0/24, etc.
    const regex =
      /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/\d{1,2})$/;
    return regex.test(value);
  };

  // Add DNS zone handler
  const onAddDnsZone = (keepModalOpen: boolean) => {
    setIsAddButtonSpinning(true);
    setIsAddAnotherButtonSpinning(true);

    const payload: AddDnsZonePayload = {
      idnsname: dnsZoneName,
      nameFromIp: reverseZoneIp,
      skipOverlapCheck: skipOverlapCheck,
    };

    addDnsZone(payload).then((response) => {
      if ("data" in response) {
        const data = response.data?.result;
        const error = response.data?.error as SerializedError;

        if (error) {
          addAlert("add-dnszone-error", error.message, "danger");
        }

        if (data) {
          addAlert(
            "add-dnszone-success",
            "DNS Zone successfully added",
            "success"
          );
          // Reset selected item
          clearFields();
          // Update data
          props.onRefresh();
          // 'Add and add another' will keep the modal open
          if (!keepModalOpen) {
            props.onClose();
          }
        }
      }
      // Reset button spinners
      setIsAddButtonSpinning(false);
      setIsAddAnotherButtonSpinning(false);
    });
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const zoneNameLabel = <b>Zone name</b>;
  const reverseZoneLabel = <b>Reverse zone</b>;
  const skipLabel = (
    <>
      Skip overlap check
      <CustomTooltip
        message={skipOverlapCheckMessage}
        id="skip-overlap-check-tooltip"
        ariaLabel="Skip overlap check tooltip with message"
      >
        <InfoCircleIcon className="pf-v6-u-ml-sm" />
      </CustomTooltip>
    </>
  );

  // Form fields
  const formFields = (
    <>
      <div className="pf-v6-u-ml-lg pf-v6-u-mb-md">
        <Form id="add-modal-form-zone-name">
          <Radio
            data-cy="modal-radio-dns-zone-name"
            name="dnszone_name_type"
            id="dnszone_name_type"
            onChange={() => {
              setIsZoneNameRadioChecked(true);
              setIsReverseZoneIpRadioChecked(false);
              setReverseZoneIp(""); // Clear reverse zone IP when switching to DNS zone name
            }}
            isChecked={isZoneNameRadioChecked}
            aria-label="DNS zone name radio button"
            label={zoneNameLabel}
          />
          <FormGroup
            key="zone-name"
            fieldId="zone-name"
            isRequired={isZoneNameRadioChecked}
          >
            <TextInput
              data-cy="modal-textbox-dns-zone-name"
              type="text"
              id="dns-name"
              name="idnsname"
              value={dnsZoneName}
              aria-label="DNS zone text input"
              onChange={(_event, value: string) => setDnsZoneName(value)}
              isDisabled={
                !isZoneNameRadioChecked && isReverseZoneIpRadioChecked
              }
              isRequired={isZoneNameRadioChecked}
            />
          </FormGroup>
        </Form>
      </div>
      <div className="pf-v6-u-ml-lg pf-v6-u-mb-md">
        <Form id="add-modal-form-reverse-zone">
          <Radio
            data-cy="modal-radio-reverse-zone-ip"
            name="reverse_zone_type"
            id="reverse_zone_type"
            onChange={() => {
              setIsZoneNameRadioChecked(false);
              setIsReverseZoneIpRadioChecked(true);
              setDnsZoneName(""); // Clear DNS zone name when switching to reverse zone IP
            }}
            isChecked={isReverseZoneIpRadioChecked}
            aria-label="Reverse zone IP radio button"
            className="pf-v6-u-mt-md"
            label={reverseZoneLabel}
          />
          <FormGroup
            key="reverse-zone"
            fieldId="reverse-zone"
            isRequired={isReverseZoneIpRadioChecked}
          >
            <>
              <InputWithValidation
                dataCy="modal-textbox-reverse-zone-ip"
                id="reverse-zone-ip"
                name="name_from_ip"
                value={reverseZoneIp}
                aria-label="Reverse zone IP text input"
                onChange={setReverseZoneIp}
                isDisabled={
                  !isReverseZoneIpRadioChecked && isZoneNameRadioChecked
                }
                isRequired={isReverseZoneIpRadioChecked}
                rules={[
                  {
                    id: "reverse-zone-ip",
                    message: reverseZoneIpErrorMessage,
                    validate: validateReverseZoneIp,
                  },
                ]}
              />
            </>
          </FormGroup>
        </Form>
      </div>
      <Form>
        <FormGroup
          key="skip-overlap-check"
          fieldId="skip-overlap-check"
          labelHelp={
            <CustomTooltip
              message={skipOverlapCheckMessage}
              id="skip-overlap-check-tooltip"
              ariaLabel="Skip overlap check tooltip with message"
            >
              <InfoCircleIcon className="pf-v6-u-ml-sm" />
            </CustomTooltip>
          }
          className="pf-v6-u-ml-lg pf-v6-u-mt-md pf-v6-u-mb-md"
        >
          <Checkbox
            id="skip-overlap-check"
            name="skip_overlap_check"
            data-cy="modal-checkbox-skip-overlap-check"
            isChecked={skipOverlapCheck}
            onChange={(_event, checked: boolean) =>
              setSkipOverlapCheck(checked)
            }
            label={skipLabel}
          />
        </FormGroup>
      </Form>
    </>
  );

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      variant="secondary"
      isDisabled={
        isAddButtonSpinning ||
        (isZoneNameRadioChecked && dnsZoneName === "") ||
        (isReverseZoneIpRadioChecked && reverseZoneIp === "")
      }
      form="add-modal-form"
      onClick={() => {
        onAddDnsZone(false);
      }}
    >
      {isAddButtonSpinning ? (
        <>
          <Spinner size="sm" />
          {"Adding"}
        </>
      ) : (
        "Add"
      )}
    </Button>,
    <Button
      data-cy="modal-button-add-and-add-another"
      key="add-new-another"
      variant="secondary"
      isDisabled={
        isAddAnotherButtonSpinning ||
        (isZoneNameRadioChecked && dnsZoneName === "") ||
        (isReverseZoneIpRadioChecked && reverseZoneIp === "")
      }
      form="add-another-modal-form"
      onClick={() => {
        onAddDnsZone(true);
      }}
    >
      {isAddAnotherButtonSpinning ? (
        <>
          <Spinner size="sm" className="pf-v6-u-mr-sm" />
          {"Adding"}
        </>
      ) : (
        "Add and add another"
      )}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Return component
  return (
    <>
      <Modal
        variant="small"
        position="top"
        positionOffset="76px"
        isOpen={props.isOpen}
        onClose={props.onClose}
        data-cy="add-dns-zone-modal"
      >
        <ModalHeader title={props.title} labelId="add-dns-zone-modal-title" />
        <ModalBody id="add-dns-zone-modal-body">{formFields}</ModalBody>
        <ModalFooter>{modalActions}</ModalFooter>
      </Modal>
    </>
  );
};

export default AddDnsZoneModal;
