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
  BaseDnsForwardZoneAddPayload,
  DnsForwardZoneAddPayload,
  IPAddressWithPort,
  useAddDnsForwardZoneMutation,
} from "src/services/rpcDnsForwardZones";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
import {
  isValidReverseZoneIp,
  REVERSE_ZONE_IP_ERROR_MESSAGE,
  SKIP_OVERLAP_CHECK_MESSAGE,
} from "./dnsLabels";
import InputRequiredText from "src/components/layouts/InputRequiredText";
import InputWithValidation from "src/components/layouts/InputWithValidation";
import IPAddressWithPortInputList from "src/components/Form/IPAddressWithPortInputList";
// Redux
import { useAppDispatch } from "src/store/hooks";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const defaultDnsForwardZoneAddPayload: BaseDnsForwardZoneAddPayload = {
  idnsforwarders: [],
  idnsforwardpolicy: "first",
  skipOverlapCheck: false,
};

const AddDnsForwardZoneModalInner = (props: PropsToAddModal) => {
  // API calls
  const [addDnsForwardZone] = useAddDnsForwardZoneMutation();

  const dispatch = useAppDispatch();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] =
    React.useState<boolean>(false);
  const [formState, setFormState] =
    React.useState<BaseDnsForwardZoneAddPayload>(
      defaultDnsForwardZoneAddPayload
    );
  const [dnsZoneName, setDnsZoneName] = React.useState<string>("");
  const [reverseZoneIP, setReverseZoneIP] = React.useState<string>("");

  // - Radios
  const [isReverseZoneIpRadioChecked, setIsReverseZoneIpRadioChecked] =
    React.useState<boolean>(false);

  // Add DNS zone handler
  const onAddDnsForwardZone = () => {
    const payload: DnsForwardZoneAddPayload = {
      ...((!isReverseZoneIpRadioChecked && { idnsname: dnsZoneName }) || {
        nameFromIp: reverseZoneIP,
      }),
      ...formState,
    };

    addDnsForwardZone(payload)
      .then((response) => {
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

            // Update data
            props.onRefresh();
            props.onClose();
          }
        }
      })
      .finally(() => {
        setIsAddButtonSpinning(false);
      });
  };

  // Form fields
  const formFields = (
    <Form id="add-dns-forward-zone-modal-form">
      <Flex
        direction={{ default: "column" }}
        className="pf-v6-u-ml-lg pf-v6-u-mb-md"
        gap={{ default: "gapMd" }}
      >
        <FormGroup
          label={
            <Radio
              data-cy="modal-radio-dns-zone-name"
              name="dnszone_name_type"
              id="dnszone_name_type"
              onChange={() => {
                setIsReverseZoneIpRadioChecked(false);
              }}
              isChecked={!isReverseZoneIpRadioChecked}
              aria-label="DNS zone name radio button"
              className="pf-v6-u-display-inline-flex"
              label="Zone name"
            />
          }
          fieldId="dns-name"
          isRequired={!isReverseZoneIpRadioChecked}
          required
        >
          <InputRequiredText
            dataCy="modal-textbox-dns-zone-name"
            id="dns-name"
            name="idnsname"
            value={dnsZoneName}
            onChange={setDnsZoneName}
            isDisabled={isReverseZoneIpRadioChecked}
          />
        </FormGroup>
        <FormGroup
          label={
            <Radio
              data-cy="modal-radio-reverse-zone-ip"
              name="reverse_zone_type"
              id="reverse_zone_type"
              onChange={() => {
                setIsReverseZoneIpRadioChecked(true);
              }}
              isChecked={isReverseZoneIpRadioChecked}
              aria-label="Reverse zone IP radio button"
              className="pf-v6-u-display-inline-flex"
              label="Reverse zone IP network"
            />
          }
          fieldId="reverse-zone-ip"
          isRequired={isReverseZoneIpRadioChecked}
        >
          <InputWithValidation
            dataCy="modal-textbox-reverse-zone-ip"
            id="reverse-zone-ip"
            name="name_from_ip"
            value={reverseZoneIP}
            aria-label="Reverse zone IP text input"
            onChange={setReverseZoneIP}
            isDisabled={!isReverseZoneIpRadioChecked}
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
        <FormGroup label="Forwarders" isRequired>
          <IPAddressWithPortInputList
            dataCy="modal-textbox-forwarders"
            name="idnsforwarders"
            ariaLabel="Forwarders text input"
            list={formState.idnsforwarders}
            setList={(values: IPAddressWithPort[]) =>
              setFormState({ ...formState, idnsforwarders: values })
            }
          />
        </FormGroup>
        <FormGroup label="Forward policy">
          <Radio
            value="first"
            name="idnsforwardpolicy"
            id="forward_policy_first"
            label="Forward first"
            data-cy="modal-radio-forward-policy-first"
            onChange={() =>
              setFormState({ ...formState, idnsforwardpolicy: "first" })
            }
            isChecked={formState.idnsforwardpolicy === "first"}
          />
          <Radio
            value="only"
            name="idnsforwardpolicy"
            id="forward_policy_only"
            label="Forward only"
            data-cy="modal-radio-forward-policy-only"
            onChange={() =>
              setFormState({ ...formState, idnsforwardpolicy: "only" })
            }
            isChecked={formState.idnsforwardpolicy === "only"}
          />
          <Radio
            value="none"
            name="idnsforwardpolicy"
            id="forward_policy_none"
            label="Forwarding disabled"
            data-cy="modal-radio-forward-policy-none"
            onChange={() =>
              setFormState({ ...formState, idnsforwardpolicy: "none" })
            }
            isChecked={formState.idnsforwardpolicy === "none"}
          />
        </FormGroup>
        <FormGroup key="skip-overlap-check" fieldId="skip-overlap-check">
          <Checkbox
            id="skip-overlap-check"
            name="skip_overlap_check"
            data-cy="modal-checkbox-skip-overlap-check"
            isChecked={formState.skipOverlapCheck}
            onChange={(_event, checked: boolean) =>
              setFormState({ ...formState, skipOverlapCheck: checked })
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
      variant="primary"
      type="submit"
      isDisabled={
        isAddButtonSpinning ||
        formState.idnsforwarders.length === 0 ||
        (!isReverseZoneIpRadioChecked && dnsZoneName === "") ||
        (isReverseZoneIpRadioChecked && reverseZoneIP === "")
      }
      form="add-dns-forward-zone-modal-form"
      onClick={() => {
        setIsAddButtonSpinning(true);
        onAddDnsForwardZone();
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
      onClick={() => {
        props.onClose();
      }}
    >
      Cancel
    </Button>,
  ];

  // Return component
  return (
    <Modal
      variant="small"
      position="top"
      positionOffset="76px"
      isOpen={props.isOpen}
      onClose={props.onClose}
      data-cy="add-dns-forward-zone-modal"
    >
      <ModalHeader
        title={props.title}
        labelId="add-dns-forward-zone-modal-title"
      />
      <ModalBody id="add-dns-forward-zone-modal-body">{formFields}</ModalBody>
      <ModalFooter>{modalActions}</ModalFooter>
    </Modal>
  );
};

const AddDnsForwardZoneModal = (props: PropsToAddModal) => {
  if (!props.isOpen) return null;

  return <AddDnsForwardZoneModalInner {...props} />;
};

export default AddDnsForwardZoneModal;
