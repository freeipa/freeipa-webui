/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import {
  Button,
  Form,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Modal,
  Select,
  SelectOption,
  Spinner,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { DnsRecordType } from "src/utils/datatypes/globalDataTypes";
import { dnsRecordConfigs } from "src/utils/datatypes/DnsRecordTypes";
// RPC
import {
  DynamicAddDnsRecordPayload,
  useAddDnsRecordMutation,
} from "src/services/rpcDnsZones";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
// Components
import {
  CheckboxField,
  GenericField,
  NumberInputField,
  RadioGroupField,
  SelectField,
} from "src/components/Form/Field";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  dnsZoneId: string;
  defaultSelectedRecordType?: DnsRecordType; // If not provided, the first record type will be selected
  defaultRecordName?: string; // If not provided, the record name will be empty
}

// Mandatory fields per record type (for validation)
export const mandatoryFields: Record<DnsRecordType, string[]> = {
  A: ["a_part_ip_address"],
  AAAA: ["aaaa_part_ip_address"],
  A6: ["a6_part_data"],
  AFSDB: ["afsdb_part_hostname"],
  CERT: ["cert_part_certificate_or_crl"],
  CNAME: ["cname_part_hostname"],
  DNAME: ["dname_part_target"],
  DS: ["ds_part_digest"],
  DLV: ["dlv_part_digest"],
  KX: ["kx_part_exchanger"],
  LOC: ["loc_part_lat_deg", "loc_part_lon_deg", "loc_part_altitude"],
  MX: ["mx_part_exchanger"],
  NAPTR: ["naptr_part_service", "naptr_part_regexp", "naptr_part_replacement"],
  NS: ["ns_part_hostname"],
  PTR: ["ptr_part_hostname"],
  SRV: ["srv_part_target"],
  SSHFP: ["sshfp_part_fingerprint"],
  TLSA: ["tlsa_part_cert_association_data"],
  TXT: ["txt_part_data"],
  URI: ["uri_part_target"],
};

const AddDnsRecordsModal = (props: PropsToAddModal) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Options
  const recordTypeOptions = [
    { key: "A", value: "A" },
    { key: "AAAA", value: "AAAA" },
    { key: "A6", value: "A6" },
    { key: "AFSDB", value: "AFSDB" },
    { key: "CERT", value: "CERT" },
    { key: "CNAME", value: "CNAME" },
    { key: "DNAME", value: "DNAME" },
    { key: "DS", value: "DS" },
    { key: "DLV", value: "DLV" },
    { key: "KX", value: "KX" },
    { key: "LOC", value: "LOC" },
    { key: "MX", value: "MX" },
    { key: "NAPTR", value: "NAPTR" },
    { key: "NS", value: "NS" },
    { key: "PTR", value: "PTR" },
    { key: "SRV", value: "SRV" },
    { key: "SSHFP", value: "SSHFP" },
    { key: "TLSA", value: "TLSA" },
    { key: "TXT", value: "TXT" },
    { key: "URI", value: "URI" },
  ];

  // API calls
  const [addDnsRecord] = useAddDnsRecordMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] =
    React.useState<boolean>(false);
  const [isAddAnotherButtonSpinning, setIsAddAnotherButtonSpinning] =
    React.useState<boolean>(false);

  // Basic form values
  const [basicFormValues, setBasicFormValues] = React.useState({
    recordName: props.defaultRecordName || "",
    recordType: (props.defaultSelectedRecordType || "A") as DnsRecordType,
  });

  // Dynamic field values - unified state management
  const [fieldValues, setFieldValues] = React.useState<Record<string, any>>({});

  // Select states for dropdowns
  const [selectStates, setSelectStates] = React.useState<
    Record<string, { isOpen: boolean; setIsOpen: (open: boolean) => void }>
  >({});
  const [isRecordTypeOpen, setIsRecordTypeOpen] = React.useState(false);

  // Initialize select states for current record type
  React.useEffect(() => {
    const currentConfig = dnsRecordConfigs[basicFormValues.recordType];
    const newSelectStates: Record<
      string,
      { isOpen: boolean; setIsOpen: (open: boolean) => void }
    > = {};

    currentConfig.forEach((field) => {
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

    setSelectStates(newSelectStates);
  }, [basicFormValues.recordType]);

  // Helper function to get field value with fallback to default
  const getFieldValue = (fieldName: string, defaultValue?: any) => {
    return fieldValues[fieldName] ?? defaultValue;
  };

  // Helper function to update field value
  const updateFieldValue = (fieldName: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Helper function to determine if add buttons should be enabled
  const checkMandatoryFieldsFilled = (recordType: DnsRecordType) => {
    const isRecordNameNotEmpty = basicFormValues.recordName.trim() !== "";
    const mandatoryFieldsForType = mandatoryFields[recordType];
    const currentConfig = dnsRecordConfigs[recordType];

    const allRequiredFieldsFilled: boolean = mandatoryFieldsForType.every(
      (fieldName: string) => {
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
          return true; // Field is "filled" with its default value
        }

        // If field has a default value and user value equals default, consider it filled
        if (hasDefaultValue && value === defaultValue) {
          return true; // Field is "filled" with its default value
        }

        // Standard validation for explicitly set values
        switch (typeof value) {
          case "string":
            return value !== "";
          case "number":
            // For numbers, if there's a default value, any number (including 0) is valid
            if (hasDefaultValue) {
              return true;
            }
            return value !== 0;
          case "boolean":
            return true; // Booleans are always valid
          case "object":
            return Array.isArray(value) ? value.length > 0 : value !== null;
          default:
            // If field has default value and no user value is set, it's considered filled
            return hasDefaultValue;
        }
      }
    );

    return isRecordNameNotEmpty && allRequiredFieldsFilled;
  };

  // Track mandatory fields to enable/disable buttons
  const [areMandatoryFieldsFilled, setAreMandatoryFieldsFilled] =
    React.useState(false);
  React.useEffect(() => {
    setAreMandatoryFieldsFilled(
      checkMandatoryFieldsFilled(basicFormValues.recordType)
    );
  }, [basicFormValues.recordName, basicFormValues.recordType, fieldValues]);

  // Initialize default values on component mount
  React.useEffect(() => {
    const currentConfig = dnsRecordConfigs[basicFormValues.recordType];
    const newFieldValues: Record<string, any> = {};

    currentConfig.forEach((field) => {
      if (
        field.type === "checkbox" &&
        (field as CheckboxField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as CheckboxField).defaultValue;
      } else if (
        field.type === "number" &&
        (field as NumberInputField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as NumberInputField).defaultValue;
      } else if (
        field.type === "select" &&
        (field as SelectField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as SelectField).defaultValue;
      } else if (
        field.type === "radio" &&
        (field as RadioGroupField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as RadioGroupField).defaultValue;
      }
    });

    setFieldValues(newFieldValues);
  }, []); // Only run on mount

  // Helper method to build the payload based on values
  const buildPayload = (): DynamicAddDnsRecordPayload => {
    const payload: DynamicAddDnsRecordPayload = {
      dnsZoneId: props.dnsZoneId,
      recordName: basicFormValues.recordName,
      recordType: basicFormValues.recordType,
    };

    // Get current record type configuration to access default values
    const currentConfig = dnsRecordConfigs[basicFormValues.recordType];

    // First, set all default values for the current record type
    // This ensures that fields like loc_part_lat_deg, loc_part_lon_deg, loc_part_lat_dir, etc.
    // are ALWAYS included in the payload with their defaults, even if user never touched them
    currentConfig.forEach((field) => {
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

      // ALWAYS set default value if field has one (including 0, false, etc.)
      if (defaultValue !== undefined) {
        payload[field.name] = defaultValue;
      }
    });

    // Then, override with any user-modified values
    // This ensures user choices take precedence over defaults
    Object.entries(fieldValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const fieldConfig = currentConfig.find((f) => f.name === key);

        if (typeof value === "string") {
          // For strings, include if not empty OR if it's a field with a default value
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
          // For non-string values (numbers, booleans), ALWAYS include them
          // This ensures 0 values are included (important for LOC records)
          payload[key] = value;
        }
      }
    });

    // Some fields are structured, so we need to set the structured flag
    if (basicFormValues.recordType === "TLSA") {
      payload.structured = true;
    }

    return payload;
  };

  // Clear form fields
  const clearFields = () => {
    setBasicFormValues({
      recordName: props.defaultRecordName || "",
      recordType: (props.defaultSelectedRecordType || "A") as DnsRecordType,
    });

    // Initialize with default values for the default record type
    const newFieldValues: Record<string, any> = {};
    const defaultRecordType = props.defaultSelectedRecordType || "A";
    const defaultConfig = dnsRecordConfigs[defaultRecordType];

    defaultConfig.forEach((field) => {
      if (
        field.type === "checkbox" &&
        (field as CheckboxField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as CheckboxField).defaultValue;
      } else if (
        field.type === "number" &&
        (field as NumberInputField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as NumberInputField).defaultValue;
      } else if (
        field.type === "select" &&
        (field as SelectField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as SelectField).defaultValue;
      } else if (
        field.type === "radio" &&
        (field as RadioGroupField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as RadioGroupField).defaultValue;
      }
    });

    setFieldValues(newFieldValues);
  };

  // Clear non-basic fields when record type changes
  const clearNonBasicFields = () => {
    // Initialize with default values for the new record type
    const newFieldValues: Record<string, any> = {};
    const currentConfig = dnsRecordConfigs[basicFormValues.recordType];

    currentConfig.forEach((field) => {
      if (
        field.type === "checkbox" &&
        (field as CheckboxField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as CheckboxField).defaultValue;
      } else if (
        field.type === "number" &&
        (field as NumberInputField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as NumberInputField).defaultValue;
      } else if (
        field.type === "select" &&
        (field as SelectField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as SelectField).defaultValue;
      } else if (
        field.type === "radio" &&
        (field as RadioGroupField).defaultValue !== undefined
      ) {
        newFieldValues[field.name] = (field as RadioGroupField).defaultValue;
      }
    });

    setFieldValues(newFieldValues);
  };

  // on Add operation
  const onAddOperation = (keepModalOpen: boolean) => {
    setIsAddButtonSpinning(!keepModalOpen);
    setIsAddAnotherButtonSpinning(keepModalOpen);

    const payload = buildPayload();

    addDnsRecord(payload).then((response) => {
      if ("data" in response) {
        const data = response.data?.result;
        const error = response.data?.error as SerializedError;

        if (error) {
          alerts.addAlert("add-dnsrecord-error", error.message, "danger");
        }

        if (data) {
          alerts.addAlert(
            "add-dnsrecord-success",
            "DNS Record successfully added",
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

  // Render dynamic fields based on record type
  const renderRecordTypeFields = () => {
    const config = dnsRecordConfigs[basicFormValues.recordType];
    return config.map((field) => (
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
          value={basicFormValues.recordName}
          id="record-name"
          name="recordName"
          isDisabled={props.defaultRecordName !== undefined}
          onChange={(_event, value: string) =>
            setBasicFormValues({ ...basicFormValues, recordName: value })
          }
          aria-label="Record name text input"
          data-cy="record-name"
        />
      </FormGroup>
      <FormGroup label="Record type">
        <Select
          onSelect={(_event, value: string | number | undefined) => {
            if (!value) return;
            setBasicFormValues({
              ...basicFormValues,
              recordType: value as DnsRecordType,
            });
            setIsRecordTypeOpen(false);
            clearNonBasicFields();
          }}
          selected={basicFormValues.recordType}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsRecordTypeOpen(!isRecordTypeOpen)}
              isExpanded={isRecordTypeOpen}
              className="pf-v5-u-w-100"
              data-cy="record-type-toggle"
            >
              {basicFormValues.recordType}
            </MenuToggle>
          )}
          aria-label="Record type select"
          isOpen={isRecordTypeOpen}
          isScrollable
          data-cy="record-type"
        >
          {recordTypeOptions.map((option) => (
            <SelectOption
              key={option.value}
              value={option.value}
              data-cy="record-type-option"
              isDisabled={
                props.defaultSelectedRecordType !== undefined &&
                option.value !== basicFormValues.recordType
              }
            >
              {option.key}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
      {renderRecordTypeFields()}
    </Form>
  );

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  // Modal actions
  const modalActions: JSX.Element[] = [
    <Button
      key="add-new"
      variant="secondary"
      isDisabled={isAddButtonSpinning || !areMandatoryFieldsFilled}
      form="add-modal-form"
      onClick={() => onAddOperation(false)}
      data-cy="add-dns-records-modal-add-button"
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
      key="add-new-another"
      variant="secondary"
      isDisabled={isAddAnotherButtonSpinning || !areMandatoryFieldsFilled}
      form="add-another-modal-form"
      onClick={() => onAddOperation(true)}
      data-cy="add-dns-records-modal-add-another-button"
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
      key="cancel-new"
      variant="link"
      onClick={cleanAndCloseModal}
      data-cy="add-dns-records-modal-cancel-button"
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
        title={"Add DNS resource record"}
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

export default AddDnsRecordsModal;
