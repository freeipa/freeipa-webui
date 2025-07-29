/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import {
  Button,
  Form,
  FormGroup,
  Modal,
  Spinner,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { DnsRecordType } from "src/utils/datatypes/globalDataTypes";
import { dnsRecordConfigs } from "src/utils/datatypes/DnsRecordTypes";
// Components
import {
  CheckboxField,
  GenericField,
  NumberInputField,
  RadioGroupField,
  SelectField,
} from "src/components/Form/Field";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import {
  DynamicModDnsRecordPayload,
  useModDnsRecordMutation,
} from "src/services/rpcDnsZones";
import { mandatoryFields } from "./AddDnsRecordsModal";

interface EditDnsRecordModalProps {
  recordName: string;
  recordType: DnsRecordType;
  dnsZoneId: string;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialValues?: Record<string, any>; // Initial field values for editing
  originalRecordData?: string; // Original DNS record data that will be replaced
}

const EditDnsRecordModal = (props: EditDnsRecordModalProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [modDnsRecord] = useModDnsRecordMutation();

  // States
  const [isSaveButtonSpinning, setIsSaveButtonSpinning] =
    React.useState<boolean>(false);

  // Dynamic field values - unified state management
  const [fieldValues, setFieldValues] = React.useState<Record<string, any>>({});

  // Select states for dropdowns
  const [selectStates, setSelectStates] = React.useState<
    Record<string, { isOpen: boolean; setIsOpen: (open: boolean) => void }>
  >({});

  // Some fields from `dnsRecordConfigs` won't be shown in the modal for editing
  // These are typically creation-specific fields that don't make sense when editing existing records
  const fieldsToHide = [
    "a_extra_create_reverse", // A record: create reverse record option
    "aaaa_extra_create_reverse", // AAAA record: create reverse record option
    "ns_part_skip_dns_check", // NS record: skip DNS check option
  ];

  // Initialize field values and select states
  React.useEffect(() => {
    const currentConfig = dnsRecordConfigs[props.recordType];
    const newFieldValues: Record<string, any> = {};
    const newSelectStates: Record<
      string,
      { isOpen: boolean; setIsOpen: (open: boolean) => void }
    > = {};

    currentConfig.forEach((field) => {
      // Skip fields that are not shown in the modal for editing
      if (fieldsToHide.includes(field.name)) {
        return;
      }

      // Initialize with initial values if provided, otherwise use defaults
      let initialValue = props.initialValues?.[field.name];

      if (initialValue === undefined) {
        // Set default values for new fields
        if (
          field.type === "checkbox" &&
          (field as CheckboxField).defaultValue !== undefined
        ) {
          initialValue = (field as CheckboxField).defaultValue;
        } else if (
          field.type === "number" &&
          (field as NumberInputField).defaultValue !== undefined
        ) {
          initialValue = (field as NumberInputField).defaultValue;
        } else if (
          field.type === "select" &&
          (field as SelectField).defaultValue !== undefined
        ) {
          initialValue = (field as SelectField).defaultValue;
        } else if (
          field.type === "radio" &&
          (field as RadioGroupField).defaultValue !== undefined
        ) {
          initialValue = (field as RadioGroupField).defaultValue;
        }
      }

      if (initialValue !== undefined) {
        newFieldValues[field.name] = initialValue;
      }

      // Initialize select states
      if (field.type === "select") {
        newSelectStates[field.name] = {
          isOpen: false,
          setIsOpen: (open: boolean) => {
            setSelectStates((prev) => ({
              ...prev,
              [field.name]: { ...prev[field.name], isOpen: open },
            }));
          },
        };
      }
    });

    setFieldValues(newFieldValues);
    setSelectStates(newSelectStates);
  }, [props.recordType, props.initialValues]);

  // Helper function to get field value with fallback to default
  const getFieldValue = (fieldName: string, defaultValue?: any) => {
    return fieldValues[fieldName] ?? defaultValue;
  };

  // Helper function to update field value
  const updateFieldValue = (fieldName: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Helper function to determine if save button should be enabled
  const checkMandatoryFieldsFilled = (recordType: DnsRecordType) => {
    const mandatoryFieldsForType = mandatoryFields[recordType];
    const currentConfig = dnsRecordConfigs[recordType];

    // Filter out hidden fields from mandatory validation
    const visibleMandatoryFields = mandatoryFieldsForType.filter(
      (fieldName) => !fieldsToHide.includes(fieldName)
    );

    return visibleMandatoryFields.every((fieldName: string) => {
      const value = fieldValues[fieldName];
      const fieldConfig = currentConfig.find((f) => f.name === fieldName);

      // Check if this field has a default value
      let hasDefaultValue = false;
      let defaultValue;

      if (fieldConfig) {
        if (
          fieldConfig.type === "checkbox" &&
          (fieldConfig as CheckboxField).defaultValue !== undefined
        ) {
          hasDefaultValue = true;
          defaultValue = (fieldConfig as CheckboxField).defaultValue;
        } else if (
          fieldConfig.type === "number" &&
          (fieldConfig as NumberInputField).defaultValue !== undefined
        ) {
          hasDefaultValue = true;
          defaultValue = (fieldConfig as NumberInputField).defaultValue;
        } else if (
          fieldConfig.type === "select" &&
          (fieldConfig as SelectField).defaultValue !== undefined
        ) {
          hasDefaultValue = true;
          defaultValue = (fieldConfig as SelectField).defaultValue;
        } else if (
          fieldConfig.type === "radio" &&
          (fieldConfig as RadioGroupField).defaultValue !== undefined
        ) {
          hasDefaultValue = true;
          defaultValue = (fieldConfig as RadioGroupField).defaultValue;
        }
      }

      // If field has a default value and user hasn't set a value, consider it filled with default
      if (hasDefaultValue && (value === undefined || value === null)) {
        return true;
      }

      // If field has a default value and user value equals default, consider it filled
      if (hasDefaultValue && value === defaultValue) {
        return true;
      }

      // Standard validation for explicitly set values
      switch (typeof value) {
        case "string":
          return value !== "";
        case "number":
          if (hasDefaultValue) {
            return true;
          }
          return value !== 0;
        case "boolean":
          return true;
        case "object":
          return Array.isArray(value) ? value.length > 0 : value !== null;
        default:
          return hasDefaultValue;
      }
    });
  };

  // Track mandatory fields to enable/disable save button
  const [areMandatoryFieldsFilled, setAreMandatoryFieldsFilled] =
    React.useState(false);
  React.useEffect(() => {
    setAreMandatoryFieldsFilled(checkMandatoryFieldsFilled(props.recordType));
  }, [props.recordType, fieldValues]);

  // Helper method to build the payload
  const buildPayload = (): DynamicModDnsRecordPayload => {
    const payload: DynamicModDnsRecordPayload = {
      dnsZoneId: props.dnsZoneId,
      recordName: props.recordName,
      recordType: props.recordType,
    };

    // Include original record data if provided (what we're replacing)
    if (props.originalRecordData) {
      payload.originalValue = props.originalRecordData;
    }

    // Get current record type configuration to access default values
    const currentConfig = dnsRecordConfigs[props.recordType];

    // First, set all default values for the current record type (excluding hidden fields)
    currentConfig.forEach((field) => {
      // Skip fields that are hidden from the edit modal
      if (fieldsToHide.includes(field.name)) {
        return;
      }

      let defaultValue;

      if (
        field.type === "checkbox" &&
        (field as CheckboxField).defaultValue !== undefined
      ) {
        defaultValue = (field as CheckboxField).defaultValue;
      } else if (
        field.type === "number" &&
        (field as NumberInputField).defaultValue !== undefined
      ) {
        defaultValue = (field as NumberInputField).defaultValue;
      } else if (
        field.type === "select" &&
        (field as SelectField).defaultValue !== undefined
      ) {
        defaultValue = (field as SelectField).defaultValue;
      } else if (
        field.type === "radio" &&
        (field as RadioGroupField).defaultValue !== undefined
      ) {
        defaultValue = (field as RadioGroupField).defaultValue;
      }

      // Set default value if field has one
      if (defaultValue !== undefined) {
        payload[field.name] = defaultValue;
      }
    });

    // Then, override with any user-modified values (excluding hidden fields)
    Object.entries(fieldValues).forEach(([key, value]) => {
      // Skip fields that are hidden from the edit modal
      if (fieldsToHide.includes(key)) {
        return;
      }

      if (value !== undefined && value !== null) {
        const fieldConfig = currentConfig.find((f) => f.name === key);

        if (typeof value === "string") {
          const hasDefault =
            fieldConfig &&
            ((fieldConfig.type === "select" &&
              (fieldConfig as SelectField).defaultValue !== undefined) ||
              (fieldConfig.type === "radio" &&
                (fieldConfig as RadioGroupField).defaultValue !== undefined));

          if (value !== "" || hasDefault) {
            payload[key] = value;
          }
        } else {
          // For non-string values (numbers, booleans), always include them
          payload[key] = value;
        }
      }
    });

    return payload;
  };

  // On save operation
  const onSave = () => {
    setIsSaveButtonSpinning(true);

    const payload: DynamicModDnsRecordPayload = buildPayload();

    modDnsRecord(payload).then((response) => {
      if ("data" in response) {
        const data = response.data?.result;
        const error = response.data?.error;

        if (error) {
          const errorMessage =
            typeof error === "string"
              ? error
              : error.message || "An error occurred";
          alerts.addAlert("edit-dnsrecord-error", errorMessage, "danger");
        }

        if (data) {
          alerts.addAlert(
            "edit-dnsrecord-success",
            "DNS Record successfully updated",
            "success"
          );
          props.onRefresh();
          props.onClose();
        }
      }
      setIsSaveButtonSpinning(false);
    });
  };

  // Render dynamic fields based on record type
  const renderRecordTypeFields = () => {
    const config = dnsRecordConfigs[props.recordType];
    return config
      .filter((field) => !fieldsToHide.includes(field.name)) // Skip hidden fields
      .map((field) => (
        <GenericField
          key={field.name}
          field={field}
          value={getFieldValue(
            field.name,
            field.type === "checkbox"
              ? (field as CheckboxField).defaultValue
              : field.type === "number"
                ? (field as NumberInputField).defaultValue
                : field.type === "select"
                  ? (field as SelectField).defaultValue
                  : field.type === "radio"
                    ? (field as RadioGroupField).defaultValue
                    : ""
          )}
          onChange={(value) => updateFieldValue(field.name, value)}
          selectStates={selectStates}
        />
      ));
  };

  // Form fields
  const formFields = (
    <Form>
      <FormGroup label="Record name" isRequired>
        <TextInput
          value={props.recordName}
          id="record-name"
          name="recordName"
          isDisabled={true}
          aria-label="Record name text input"
          data-cy="edit-record-name"
        />
      </FormGroup>
      <FormGroup label="Record type">
        <TextInput
          value={props.recordType}
          id="record-type"
          name="recordType"
          isDisabled={true}
          aria-label="Record type text input"
          data-cy="edit-record-type"
        />
      </FormGroup>
      {renderRecordTypeFields()}
    </Form>
  );

  // Modal actions
  const modalActions = [
    <Button
      key="save"
      variant="primary"
      isDisabled={isSaveButtonSpinning || !areMandatoryFieldsFilled}
      onClick={onSave}
      data-cy="edit-dns-record-modal-save-button"
    >
      {isSaveButtonSpinning ? (
        <>
          <Spinner size="sm" />
          {"Saving"}
        </>
      ) : (
        "Save"
      )}
    </Button>,
    <Button
      key="cancel"
      variant="link"
      onClick={props.onClose}
      data-cy="edit-dns-record-modal-cancel-button"
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      <Modal
        variant="small"
        title="Edit DNS resource record"
        position="top"
        positionOffset="76px"
        isOpen={props.isOpen}
        onClose={props.onClose}
        actions={modalActions}
      >
        {formFields}
      </Modal>
    </>
  );
};

export default EditDnsRecordModal;
