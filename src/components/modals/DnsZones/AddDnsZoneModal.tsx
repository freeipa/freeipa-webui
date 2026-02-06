import React from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Flex,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  Spinner,
} from "@patternfly/react-core";
// RPC
import {
  AddDnsZonePayload,
  useAddDnsZoneMutation,
} from "src/services/rpcDnsZones";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
// Icons
import {
  isValidReverseZoneIp,
  REVERSE_ZONE_IP_ERROR_MESSAGE,
  SKIP_OVERLAP_CHECK_MESSAGE,
} from "./dnsLabels";
import InputWithValidation from "src/components/layouts/InputWithValidation";
import InputRequiredText from "src/components/layouts/InputRequiredText";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddDnsZoneModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addDnsZone] = useAddDnsZoneMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] =
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

  // Clear form fields
  const clearFields = () => {
    setDnsZoneName("");
    setReverseZoneIp("");
    setSkipOverlapCheck(false);
    setIsZoneNameRadioChecked(true);
    setIsReverseZoneIpRadioChecked(false);
  };

  // Add DNS zone handler
  const onAddDnsZone = () => {
    setIsAddButtonSpinning(true);

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
          dispatch(
            addAlert({
              name: "add-dnszone-error",
              title: error.message,
              variant: "danger",
            })
          );
        }

        if (data) {
          dispatch(
            addAlert({
              name: "add-dnszone-success",
              title: "DNS Zone successfully added",
              variant: "success",
            })
          );
          // Reset selected item
          clearFields();
          // Update data
          props.onRefresh();
          props.onClose();
        }
      }
      // Reset button spinners
      setIsAddButtonSpinning(false);
    });
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const zoneNameLabel = <b>Zone name</b>;
  const reverseZoneLabel = <b>Reverse zone</b>;

  // Form fields
  const formFields = (
    <Form id="add-modal-form-zone-name">
      <Flex
        direction={{ default: "column" }}
        className="pf-v6-u-ml-lg pf-v6-u-mb-md"
        gap={{ default: "gapMd" }}
      >
        <FormGroup
          key="zone-name"
          label={
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
              className="pf-v6-u-display-inline-flex"
              label={zoneNameLabel}
            />
          }
          fieldId="zone-name"
          isRequired={isZoneNameRadioChecked}
        >
          <InputRequiredText
            dataCy="modal-textbox-dns-zone-name"
            id="dns-name"
            name="idnsname"
            value={dnsZoneName}
            onChange={setDnsZoneName}
            isDisabled={!isZoneNameRadioChecked && isReverseZoneIpRadioChecked}
          />
        </FormGroup>
        <FormGroup
          key="reverse-zone"
          fieldId="reverse-zone"
          isRequired={isReverseZoneIpRadioChecked}
          label={
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
              className="pf-v6-u-display-inline-flex"
              label={reverseZoneLabel}
            />
          }
        >
          <InputWithValidation
            dataCy="modal-textbox-reverse-zone-ip"
            id="reverse-zone-ip"
            name="name_from_ip"
            value={reverseZoneIp}
            aria-label="Reverse zone IP text input"
            onChange={setReverseZoneIp}
            isDisabled={!isReverseZoneIpRadioChecked && isZoneNameRadioChecked}
            isRequired={isReverseZoneIpRadioChecked}
            rules={[
              {
                id: "reverse-zone-ip",
                message: REVERSE_ZONE_IP_ERROR_MESSAGE,
                validate: isValidReverseZoneIp,
              },
            ]}
          />
        </FormGroup>
        <FormGroup key="skip-overlap-check" fieldId="skip-overlap-check">
          <Checkbox
            id="skip-overlap-check"
            name="skip_overlap_check"
            data-cy="modal-checkbox-skip-overlap-check"
            isChecked={skipOverlapCheck}
            onChange={(_event, checked: boolean) =>
              setSkipOverlapCheck(checked)
            }
            label="Skip overlap check"
            description={SKIP_OVERLAP_CHECK_MESSAGE}
          />
        </FormGroup>
      </Flex>
    </Form>
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
        onAddDnsZone();
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
