import React from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Modal,
  Radio,
  Select,
  SelectOption,
  Spinner,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { DnsRecordType } from "src/utils/datatypes/globalDataTypes";
// RPC
import {
  AddDnsRecordPayload,
  useAddDnsRecordMutation,
} from "src/services/rpcDnsZones";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
// Icons
import { InfoCircleIcon } from "@patternfly/react-icons";
// Utils
import { BasicType } from "src/utils/ipaObjectUtils";
// Components
import CustomTooltip from "src/components/layouts/CustomTooltip";
import NumberSelector from "src/components/Form/NumberInput";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  dnsZoneId: string;
}

const AddDnsRecordsModal = (props: PropsToAddModal) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Helper method to build the payload based on values
  const buildPayload = (
    elementsToBuildPayload: Map<string, BasicType>
  ): AddDnsRecordPayload => {
    const payload: AddDnsRecordPayload = {
      dnsZoneId: props.dnsZoneId,
      recordName: basicFormValues.recordName,
      recordType: basicFormValues.recordType as DnsRecordType,
    };

    elementsToBuildPayload.forEach((value, key) => {
      payload[key] = value;
    });
    return payload;
  };

  // Options
  const recordTypeOptions = [
    { label: "A", value: "A" },
    { label: "AAAA", value: "AAAA" },
    { label: "A6", value: "A6" },
    { label: "AFSDB", value: "AFSDB" },
    { label: "CERT", value: "CERT" },
    { label: "CNAME", value: "CNAME" },
    { label: "DNAME", value: "DNAME" },
    { label: "DS", value: "DS" },
    { label: "DLV", value: "DLV" },
    { label: "KX", value: "KX" },
    { label: "LOC", value: "LOC" },
    { label: "MX", value: "MX" },
    { label: "NAPTR", value: "NAPTR" },
    { label: "NS", value: "NS" },
    { label: "PTR", value: "PTR" },
    { label: "SRV", value: "SRV" },
    { label: "SSHFP", value: "SSHFP" },
    { label: "TLSA", value: "TLSA" },
    { label: "TXT", value: "TXT" },
    { label: "URI", value: "URI" },
  ];

  // API calls
  const [addDnsRecord] = useAddDnsRecordMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] =
    React.useState<boolean>(false);
  const [isAddAnotherButtonSpinning, setIsAddAnotherButtonSpinning] =
    React.useState<boolean>(false);
  // Fields
  const [basicFormValues, setBasicFormValues] = React.useState({
    recordName: "",
    recordType: "A",
  });

  const [aFields, setAFields] = React.useState({
    a_part_ip_address: "",
    extra_create_reverse: false,
  });
  const [a6Fields, setA6Fields] = React.useState({
    a6_part_data: "",
  });
  const [afsdbFields, setAfsdbFields] = React.useState({
    afsdb_part_subtype: 0,
    afsdb_part_hostname: "",
  });
  const [certFields, setCertFields] = React.useState({
    cert_part_type: 0,
    cert_part_key_tag: 0,
    cert_part_algorithm: 0,
    cert_part_certificate_or_crl: "",
  });
  const [cnameFields, setCnameFields] = React.useState({
    cname_part_hostname: "",
  });
  const [dnameFields, setDnameFields] = React.useState({
    dname_part_target: "",
  });
  const [dsdlvFields, setDsdlvFields] = React.useState({
    part_key_tag: 0,
    part_algorithm: 0,
    part_digest_type: 0,
    part_digest: "",
  });
  const [kxMxFields, setKxMxFields] = React.useState({
    part_preference: 0,
    part_exchanger: "",
  });
  const [locFields, setLocFields] = React.useState({
    loc_part_lat_deg: 0.0,
    loc_part_lat_min: 0.0,
    loc_part_lat_sec: 0.0,
    loc_part_lat_dir: "N",
    loc_part_lon_deg: 0.0,
    loc_part_lon_min: 0.0,
    loc_part_lon_sec: 0.0,
    loc_part_lon_dir: "E",
    loc_part_altitude: 0.0,
    loc_part_size: 0.0,
    loc_part_h_precision: 0.0,
    loc_part_v_precision: 0.0,
  });
  const [naptrFields, setNaptrFields] = React.useState({
    naptr_part_order: 0,
    naptr_part_preference: 0,
    naptr_part_flags: "S",
    naptr_part_service: "",
    naptr_part_regexp: "",
    naptr_part_replacement: "",
  });
  const [nsptrFields, setNsptrFields] = React.useState({
    part_hostname: "",
    part_skip_dns_check: false,
  });
  const [srvFields, setSrvFields] = React.useState({
    srv_part_priority: 0,
    srv_part_weight: 0,
    srv_part_port: 0,
    srv_part_target: "",
  });
  const [sshfpFields, setSshfpFields] = React.useState({
    sshfp_part_algorithm: 0,
    sshfp_part_fp_type: 0,
    sshfp_part_fingerprint: "",
  });
  const [tlsaFields, setTlsaFields] = React.useState({
    tlsa_part_cert_usage: 0,
    tlsa_part_selector: 0,
    tlsa_part_matching_type: 0,
    tlsa_part_cert_association_data: "",
  });
  const [txtFields, setTxtFields] = React.useState({
    txt_part_data: "",
  });
  const [uriFields, setUriFields] = React.useState({
    uri_part_priority: 0,
    uri_part_weight: 0,
    uri_part_target: "",
  });

  // Selectors
  const [isRecordTypeOpen, setIsRecordTypeOpen] = React.useState(false);
  const [isNaptrFlagsOpen, setIsNaptrFlagsOpen] = React.useState(false);

  // Tooltips
  const createReverseMessage = "Create reverse record for this IP Address";
  const cnamePartHostnameMessage =
    "A hostname which this alias hostname points to";
  const kxPartPreferenceMessage =
    "Preference given to this exchanger. Lower values are more preferred";
  const kxPartExchangerMessage = "A host willing to act as a key exchanger";
  const ptrHostname = "The hostname this reverse record points to";
  const srvPriorityMessage =
    "Lower number means higher priority. Clients will attempt to contact the server with the lowest-numbered priority they can reach.";
  const srvWeightMessage = "Relative weight for entries with the same priority";
  const srvTargetMessage =
    "The domain name of the target host or '.' if the service is decidedly not available at this domain";
  const uriPriorityMessage =
    "Lower number means higher priority. Clients will attempt to contact the URI with the lowest-numbered priority they can reach.";
  const uriWeightMessage = "Relative weight for entries with the same priority";
  const uriTargetMessage =
    "Target Uniform Resource Identifier according to RFC 3986";

  // Mandatory fields per record type
  const mandatoryFields = {
    A: ["a_part_ip_address"],
    AAAA: ["a_part_ip_address"],
    A6: ["a6_part_data"],
    AFSDB: ["afsdb_part_hostname"],
    CERT: ["cert_part_certificate_or_crl"],
    CNAME: ["cname_part_hostname"],
    DNAME: ["dname_part_target"],
    DS: ["part_digest"],
    DLV: ["part_digest"],
    KX: ["part_exchanger"],
    LOC: ["loc_part_lat_deg", "loc_part_lon_deg"],
    MX: ["part_exchanger"],
    NAPTR: [
      "naptr_part_service",
      "naptr_part_regexp",
      "naptr_part_replacement",
    ],
    NS: ["part_hostname"],
    PTR: ["part_hostname"],
    SRV: ["srv_part_target"],
    SSHFP: ["sshfp_part_fingerprint"],
    TLSA: ["tlsa_part_cert_association_data"],
    TXT: ["txt_part_data"],
    URI: ["uri_part_target"],
  };

  // Helper function to get the record type state object
  const getRecordTypeStateObject = (recordType: DnsRecordType) => {
    switch (recordType) {
      case "A":
        return aFields;
      case "AAAA":
        return aFields;
      case "A6":
        return a6Fields;
      case "AFSDB":
        return afsdbFields;
      case "CERT":
        return certFields;
      case "CNAME":
        return cnameFields;
      case "DNAME":
        return dnameFields;
      case "DS":
        return dsdlvFields;
      case "DLV":
        return dsdlvFields;
      case "KX":
        return kxMxFields;
      case "LOC":
        return locFields;
      case "MX":
        return kxMxFields;
      case "NAPTR":
        return naptrFields;
      case "NS":
        return nsptrFields;
      case "PTR":
        return nsptrFields;
      case "SRV":
        return srvFields;
      case "SSHFP":
        return sshfpFields;
      case "TLSA":
        return tlsaFields;
      case "TXT":
        return txtFields;
      case "URI":
        return uriFields;
      default:
        return null;
    }
  };

  // Helper function to determine if add buttons should be enabled
  // - 'recordName' is empty || mandatory fields not filled = button disabled
  const checkMandatoryFieldsFilled = (recordType: DnsRecordType) => {
    const isRecordNameNotEmpty = basicFormValues.recordName.trim() !== "";

    // Get record type object and mandatory fields
    const recordTypeObject = getRecordTypeStateObject(recordType);
    if (!recordTypeObject) {
      return false;
    }

    const mandatoryFieldsForType = mandatoryFields[recordType];
    const areMandatoryFieldsFilled: boolean = mandatoryFieldsForType.every(
      (field: string) => {
        const valueField = recordTypeObject[field];
        switch (typeof valueField) {
          case "string":
            return valueField !== "";
          case "number":
            return valueField !== 0;
          case "object":
            return Array(valueField).length > 0 || valueField !== null;
          default:
            return false;
        }
      }
    );
    return isRecordNameNotEmpty && areMandatoryFieldsFilled;
  };

  // Track record types values to check if they are filled
  const [areMandatoryFieldsFilled, setAreMandatoryFieldsFilled] =
    React.useState(false);
  React.useEffect(() => {
    setAreMandatoryFieldsFilled(
      checkMandatoryFieldsFilled(basicFormValues.recordType as DnsRecordType)
    );
  }, [
    aFields,
    a6Fields,
    afsdbFields,
    certFields,
    cnameFields,
    dnameFields,
    dsdlvFields,
    kxMxFields,
    locFields,
    naptrFields,
    nsptrFields,
    srvFields,
    sshfpFields,
    tlsaFields,
    txtFields,
    uriFields,
  ]);

  // Components
  // - A, AAAA
  const aComponents = (
    <>
      <FormGroup label="IP address" isRequired>
        <TextInput
          value={aFields.a_part_ip_address}
          id="a-part-ip-address"
          name="a_part_ip_address"
          onChange={(_event, value: string) =>
            setAFields({ ...aFields, a_part_ip_address: value })
          }
          aria-label="IP address text input"
        />
      </FormGroup>
      <FormGroup
        label="Create reverse record"
        labelIcon={
          <CustomTooltip id="priority-tooltip" message={createReverseMessage}>
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <Checkbox
          id="a-extra-create-reverse"
          name="a_extra_create_reverse"
          isChecked={aFields.extra_create_reverse}
          onChange={(_event, value: boolean) =>
            setAFields({ ...aFields, extra_create_reverse: value })
          }
          aria-label="Create reverse record checkbox"
        />
      </FormGroup>
    </>
  );

  // - A6
  const a6Components = (
    <>
      <FormGroup label="Record data" isRequired>
        <TextInput
          value={a6Fields.a6_part_data}
          id="a6-part-data"
          name="a6_part_data"
          onChange={(_event, value: string) =>
            setA6Fields({ ...a6Fields, a6_part_data: value })
          }
          aria-label="Record data text input"
        />
      </FormGroup>
    </>
  );

  // - AFSDB
  const afsdbComponents = (
    <>
      <FormGroup label="Subtype">
        <NumberSelector
          id="afsdb-part-subtype"
          value={afsdbFields.afsdb_part_subtype}
          name="afsdb_part_subtype"
          setValue={(value: number | "") =>
            setAfsdbFields({
              ...afsdbFields,
              afsdb_part_subtype: Number(value),
            })
          }
          aria-label="Subtype number input"
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Hostname" isRequired>
        <TextInput
          value={afsdbFields.afsdb_part_hostname}
          id="afsdb-part-hostname"
          name="afsdb_part_hostname"
          onChange={(_event, value: string) =>
            setAfsdbFields({ ...afsdbFields, afsdb_part_hostname: value })
          }
          aria-label="Hostname text input"
        />
      </FormGroup>
    </>
  );

  // - CERT
  const certComponents = (
    <>
      <FormGroup label="Type" isRequired>
        <NumberSelector
          id="cert-part-type"
          value={certFields.cert_part_type}
          name="cert_part_type"
          setValue={(value: number | "") =>
            setCertFields({ ...certFields, cert_part_type: Number(value) })
          }
          aria-label="Type number input"
          numCharsShown={6}
          maxValue={65535}
        />
      </FormGroup>
      <FormGroup label="Key tag" isRequired>
        <NumberSelector
          id="cert-part-key-tag"
          value={certFields.cert_part_key_tag}
          name="cert_part_key_tag"
          setValue={(value: number | "") =>
            setCertFields({ ...certFields, cert_part_key_tag: Number(value) })
          }
          aria-label="Key tag number input"
          numCharsShown={6}
          maxValue={65535}
        />
      </FormGroup>
      <FormGroup label="Algorithm" isRequired>
        <NumberSelector
          id="cert-part-algorithm"
          value={certFields.cert_part_algorithm}
          name="cert_part_algorithm"
          setValue={(value: number | "") =>
            setCertFields({ ...certFields, cert_part_algorithm: Number(value) })
          }
          aria-label="Algorithm number input"
          numCharsShown={4}
          maxValue={255}
        />
      </FormGroup>
      <FormGroup label="Certificate or CRL" isRequired>
        <TextArea
          value={certFields.cert_part_certificate_or_crl}
          id="cert-part-certificate-or-crl"
          name="cert_part_certificate_or_crl"
          onChange={(_event, value: string) =>
            setCertFields({
              ...certFields,
              cert_part_certificate_or_crl: value,
            })
          }
          aria-label="Certificate or CRL text input"
          rows={8}
        />
      </FormGroup>
    </>
  );

  // - CNAME
  const cnameComponents = (
    <>
      <FormGroup
        label="Hostname"
        labelIcon={
          <CustomTooltip
            id="cname-part-hostname-tooltip"
            message={cnamePartHostnameMessage}
          >
            <InfoCircleIcon />
          </CustomTooltip>
        }
        isRequired
      >
        <TextInput
          value={cnameFields.cname_part_hostname}
          id="cname-part-hostname"
          name="cname_part_hostname"
          onChange={(_event, value: string) =>
            setCnameFields({ ...cnameFields, cname_part_hostname: value })
          }
          aria-label="Hostname text input"
        />
      </FormGroup>
    </>
  );

  // - DNAME
  const dnameComponents = (
    <>
      <FormGroup label="Target" isRequired>
        <TextInput
          value={dnameFields.dname_part_target}
          id="dname-part-target"
          name="dname_part_target"
          onChange={(_event, value: string) =>
            setDnameFields({ ...dnameFields, dname_part_target: value })
          }
          aria-label="Target text input"
        />
      </FormGroup>
    </>
  );

  // - DS, DLV
  const dsDlvComponents = (
    <>
      <FormGroup label="Key tag" isRequired>
        <NumberSelector
          id="ds-part-key-tag"
          value={dsdlvFields.part_key_tag}
          name="ds_part_key_tag"
          setValue={(value: number | "") =>
            setDsdlvFields({ ...dsdlvFields, part_key_tag: Number(value) })
          }
          aria-label="Key tag number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Algorithm" isRequired>
        <NumberSelector
          id="ds-part-algorithm"
          value={dsdlvFields.part_algorithm}
          name="ds_part_algorithm"
          setValue={(value: number | "") =>
            setDsdlvFields({ ...dsdlvFields, part_algorithm: Number(value) })
          }
          aria-label="Algorithm number input"
          maxValue={255}
          numCharsShown={4}
        />
      </FormGroup>
      <FormGroup label="Digest type" isRequired>
        <NumberSelector
          id="ds-part-digest-type"
          value={dsdlvFields.part_digest_type}
          name="ds_part_digest_type"
          setValue={(value: number | "") =>
            setDsdlvFields({ ...dsdlvFields, part_digest_type: Number(value) })
          }
          aria-label="Digest type number input"
          maxValue={255}
          numCharsShown={4}
        />
      </FormGroup>
      <FormGroup label="Digest" isRequired>
        <TextArea
          value={dsdlvFields.part_digest}
          id="ds-part-digest"
          name="ds_part_digest"
          onChange={(_event, value: string) =>
            setDsdlvFields({ ...dsdlvFields, part_digest: value })
          }
          aria-label="Digest text input"
          rows={8}
        />
      </FormGroup>
    </>
  );

  // - KX, MX fields
  const kxMxComponents = (
    <>
      <FormGroup
        label="Preference"
        isRequired
        labelIcon={
          <CustomTooltip
            id="kx-part-preference-tooltip"
            message={kxPartPreferenceMessage}
          >
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <NumberSelector
          id="kx-part-preference"
          value={kxMxFields.part_preference}
          name="kx_part_preference"
          setValue={(value: number | "") =>
            setKxMxFields({
              ...kxMxFields,
              part_preference: Number(value),
            })
          }
          aria-label="Preference number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup
        label="Exchanger"
        isRequired
        labelIcon={
          <CustomTooltip
            id="kx-part-exchanger-tooltip"
            message={kxPartExchangerMessage}
          >
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <TextInput
          value={kxMxFields.part_exchanger}
          id="kx-part-exchanger"
          name="kx_part_exchanger"
          onChange={(_event, value: string) =>
            setKxMxFields({ ...kxMxFields, part_exchanger: value })
          }
          aria-label="Exchanger text input"
        />
      </FormGroup>
    </>
  );

  // - LOC
  const locComponents = (
    <>
      <FormGroup label="Degrees latitude" isRequired>
        <NumberSelector
          id="loc-part-lat-deg"
          value={locFields.loc_part_lat_deg}
          name="loc_part_lat_deg"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_lat_deg: Number(value) })
          }
          aria-label="Degrees latitude number input"
          maxValue={90}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Minutes latitude">
        <NumberSelector
          id="loc-part-lat-min"
          value={locFields.loc_part_lat_min}
          name="loc_part_lat_min"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_lat_min: Number(value) })
          }
          aria-label="Minutes latitude number input"
          maxValue={59}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Seconds latitude">
        <NumberSelector
          id="loc-part-lat-sec"
          value={locFields.loc_part_lat_sec}
          name="loc_part_lat_sec"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_lat_sec: Number(value) })
          }
          aria-label="Seconds latitude number input"
          maxValue={59.999}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Direction latitude">
        <Flex>
          <FlexItem>
            <Radio
              id="loc-part-lat-dir"
              label="N"
              name="loc_part_lat_dir"
              isChecked={locFields.loc_part_lat_dir === "N"}
              onChange={(_event, value: boolean) =>
                setLocFields({
                  ...locFields,
                  loc_part_lat_dir: value ? "N" : "S",
                })
              }
              aria-label="Direction latitude radio north"
            />
          </FlexItem>
          <FlexItem>
            <Radio
              id="loc-part-lat-dir"
              label="S"
              name="loc_part_lat_dir"
              isChecked={locFields.loc_part_lat_dir === "S"}
              onChange={(_event, value: boolean) =>
                setLocFields({
                  ...locFields,
                  loc_part_lat_dir: value ? "S" : "N",
                })
              }
              aria-label="Direction latitude radio south"
            />
          </FlexItem>
        </Flex>
      </FormGroup>
      <FormGroup label="Degrees longitude" isRequired>
        <NumberSelector
          id="loc-part-lon-deg"
          value={locFields.loc_part_lon_deg}
          name="loc_part_lon_deg"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_lon_deg: Number(value) })
          }
          aria-label="Degrees longitude number input"
          maxValue={180}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Minutes longitude">
        <NumberSelector
          id="loc-part-lon-min"
          value={locFields.loc_part_lon_min}
          name="loc_part_lon_min"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_lon_min: Number(value) })
          }
          aria-label="Minutes longitude number input"
          maxValue={59}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Seconds longitude">
        <NumberSelector
          id="loc-part-lon-sec"
          value={locFields.loc_part_lon_sec}
          name="loc_part_lon_sec"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_lon_sec: Number(value) })
          }
          aria-label="Seconds longitude number input"
          maxValue={59.999}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Direction longitude">
        <Flex>
          <FlexItem>
            <Radio
              id="loc-part-lon-dir"
              name="loc_part_lon_dir"
              label="E"
              isChecked={locFields.loc_part_lon_dir === "E"}
              onChange={(_event, value: boolean) =>
                setLocFields({
                  ...locFields,
                  loc_part_lon_dir: value ? "E" : "W",
                })
              }
              aria-label="Direction longitude radio east"
            />
          </FlexItem>
          <FlexItem>
            <Radio
              id="loc-part-lon-dir"
              name="loc_part_lon_dir"
              label="W"
              isChecked={locFields.loc_part_lon_dir === "W"}
              onChange={(_event, value: boolean) =>
                setLocFields({
                  ...locFields,
                  loc_part_lon_dir: value ? "W" : "E",
                })
              }
              aria-label="Direction longitude radio west"
            />
          </FlexItem>
        </Flex>
      </FormGroup>
      <FormGroup label="Altitude">
        <NumberSelector
          id="loc-part-altitude"
          value={locFields.loc_part_altitude}
          name="loc_part_altitude"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_altitude: Number(value) })
          }
          aria-label="Altitude number input"
          minValue={-100000.0}
          maxValue={42849672.95}
          numCharsShown={11}
        />
      </FormGroup>
      <FormGroup label="Size">
        <NumberSelector
          id="loc-part-size"
          value={locFields.loc_part_size}
          name="loc_part_size"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_size: Number(value) })
          }
          aria-label="Size number input"
          minValue={0.0}
          maxValue={90000000.0}
          numCharsShown={11}
        />
      </FormGroup>
      <FormGroup label="Horizontal precision">
        <NumberSelector
          id="loc-part-h-precision"
          value={locFields.loc_part_h_precision}
          name="loc_part_h_precision"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_h_precision: Number(value) })
          }
          aria-label="Horizontal precision number input"
          minValue={0.0}
          maxValue={90000000.0}
          numCharsShown={11}
        />
      </FormGroup>
      <FormGroup label="Vertical precision">
        <NumberSelector
          id="loc-part-v-precision"
          value={locFields.loc_part_v_precision}
          name="loc_part_v_precision"
          setValue={(value: number | "") =>
            setLocFields({ ...locFields, loc_part_v_precision: Number(value) })
          }
          aria-label="Vertical precision number input"
          minValue={0.0}
          maxValue={90000000.0}
          numCharsShown={11}
        />
      </FormGroup>
    </>
  );

  // - NAPTR
  const naptrComponents = (
    <>
      <FormGroup label="Order" isRequired>
        <NumberSelector
          id="naptr-part-order"
          value={naptrFields.naptr_part_order}
          name="naptr_part_order"
          setValue={(value: number | "") =>
            setNaptrFields({ ...naptrFields, naptr_part_order: Number(value) })
          }
          aria-label="Order number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Preference" isRequired>
        <NumberSelector
          id="naptr-part-preference"
          value={naptrFields.naptr_part_preference}
          name="naptr_part_preference"
          setValue={(value: number | "") =>
            setNaptrFields({
              ...naptrFields,
              naptr_part_preference: Number(value),
            })
          }
          aria-label="Preference number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Flags" isRequired>
        <Select
          selected={naptrFields.naptr_part_flags}
          onSelect={(_event, value: string | number | undefined) => {
            setNaptrFields({
              ...naptrFields,
              naptr_part_flags: value as "S" | "U" | "P" | "A",
            });
            setIsNaptrFlagsOpen(false);
          }}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsNaptrFlagsOpen(!isNaptrFlagsOpen)}
              isExpanded={isNaptrFlagsOpen}
              aria-label="Flags select toggle"
            >
              {naptrFields.naptr_part_flags}
            </MenuToggle>
          )}
          aria-label="Flags select"
          isOpen={isNaptrFlagsOpen}
          isScrollable
        >
          <SelectOption id="naptr-part-flags-s" value="S">
            S
          </SelectOption>
          <SelectOption id="naptr-part-flags-u" value="U">
            U
          </SelectOption>
          <SelectOption id="naptr-part-flags-p" value="P">
            P
          </SelectOption>
          <SelectOption id="naptr-part-flags-a" value="A">
            A
          </SelectOption>
        </Select>
      </FormGroup>
      <FormGroup label="Service" isRequired>
        <TextInput
          value={naptrFields.naptr_part_service}
          id="naptr-part-service"
          name="naptr_part_service"
          onChange={(_event, value: string) =>
            setNaptrFields({ ...naptrFields, naptr_part_service: value })
          }
          aria-label="Service text input"
        />
      </FormGroup>
      <FormGroup label="Regular expression" isRequired>
        <TextInput
          value={naptrFields.naptr_part_regexp}
          id="naptr-part-regexp"
          name="naptr_part_regexp"
          onChange={(_event, value: string) =>
            setNaptrFields({ ...naptrFields, naptr_part_regexp: value })
          }
          aria-label="Regular expression text input"
        />
      </FormGroup>
      <FormGroup label="Replacement" isRequired>
        <TextInput
          value={naptrFields.naptr_part_replacement}
          id="naptr-part-replacement"
          name="naptr_part_replacement"
          onChange={(_event, value: string) =>
            setNaptrFields({ ...naptrFields, naptr_part_replacement: value })
          }
          aria-label="Replacement text input"
        />
      </FormGroup>
    </>
  );

  // - NS, PTR
  const nsPtrComponents = (
    <>
      <FormGroup
        label="Hostname"
        isRequired
        labelIcon={
          basicFormValues.recordType === "PTR" ? (
            <CustomTooltip id="ptr-hostname-tooltip" message={ptrHostname}>
              <InfoCircleIcon />
            </CustomTooltip>
          ) : undefined
        }
      >
        <TextInput
          value={nsptrFields.part_hostname}
          id="ns-part-hostname"
          name="ns_part_hostname"
          onChange={(_event, value: string) =>
            setNsptrFields({ ...nsptrFields, part_hostname: value })
          }
          aria-label="Hostname text input"
        />
      </FormGroup>
      {/* Add 'Skip DNS check' option if 'NS' record type is selected */}
      {basicFormValues.recordType === "NS" && (
        <FormGroup label="Skip DNS check">
          <Checkbox
            id="ns-part-skip-dns-check"
            name="ns_part_skip_dns_check"
            isChecked={nsptrFields.part_skip_dns_check}
            onChange={(_event, value: boolean) =>
              setNsptrFields({ ...nsptrFields, part_skip_dns_check: value })
            }
            aria-label="Skip DNS check checkbox"
          />
        </FormGroup>
      )}
    </>
  );

  // - SRV
  const srvComponents = (
    <>
      <FormGroup
        label="Priority"
        isRequired
        labelIcon={
          <CustomTooltip id="srv-priority-tooltip" message={srvPriorityMessage}>
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <NumberSelector
          id="srv-part-priority"
          value={srvFields.srv_part_priority}
          name="srv_part_priority"
          setValue={(value: number | "") =>
            setSrvFields({ ...srvFields, srv_part_priority: Number(value) })
          }
          aria-label="Priority number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup
        label="Weight"
        isRequired
        labelIcon={
          <CustomTooltip id="srv-weight-tooltip" message={srvWeightMessage}>
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <NumberSelector
          id="srv-part-weight"
          value={srvFields.srv_part_weight}
          name="srv_part_weight"
          setValue={(value: number | "") =>
            setSrvFields({ ...srvFields, srv_part_weight: Number(value) })
          }
          aria-label="Weight number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup label="Port" isRequired>
        <NumberSelector
          id="srv-part-port"
          value={srvFields.srv_part_port}
          name="srv_part_port"
          setValue={(value: number | "") =>
            setSrvFields({ ...srvFields, srv_part_port: Number(value) })
          }
          aria-label="Port number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup
        label="Target"
        isRequired
        labelIcon={
          <CustomTooltip id="srv-target-tooltip" message={srvTargetMessage}>
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <TextInput
          value={srvFields.srv_part_target}
          id="srv-part-target"
          name="srv_part_target"
          onChange={(_event, value: string) =>
            setSrvFields({ ...srvFields, srv_part_target: value })
          }
          aria-label="Target text input"
        />
      </FormGroup>
    </>
  );

  // - SSHFP
  const sshfpComponents = (
    <>
      <FormGroup label="Algorithm" isRequired>
        <NumberSelector
          id="sshfp-part-algorithm"
          value={sshfpFields.sshfp_part_algorithm}
          name="sshfp_part_algorithm"
          setValue={(value: number | "") =>
            setSshfpFields({
              ...sshfpFields,
              sshfp_part_algorithm: Number(value),
            })
          }
          aria-label="Algorithm number input"
          maxValue={255}
          numCharsShown={4}
        />
      </FormGroup>
      <FormGroup label="Fingerprint type" isRequired>
        <NumberSelector
          id="sshfp-part-fingerprint-type"
          value={sshfpFields.sshfp_part_fp_type}
          name="sshfp_part_fp_type"
          setValue={(value: number | "") =>
            setSshfpFields({
              ...sshfpFields,
              sshfp_part_fp_type: Number(value),
            })
          }
          aria-label="Fingerprint type number input"
          maxValue={255}
          numCharsShown={4}
        />
      </FormGroup>
      <FormGroup label="Fingerprint" isRequired>
        <TextArea
          value={sshfpFields.sshfp_part_fingerprint}
          id="sshfp-part-fingerprint"
          name="sshfp_part_fingerprint"
          onChange={(_event, value: string) =>
            setSshfpFields({ ...sshfpFields, sshfp_part_fingerprint: value })
          }
          aria-label="Fingerprint text area"
          rows={6}
        />
      </FormGroup>
    </>
  );

  // - TLSA
  const tlsaComponents = (
    <>
      <FormGroup label="Certificate usage" isRequired>
        <NumberSelector
          id="tlsa-part-cert-usage"
          value={tlsaFields.tlsa_part_cert_usage}
          name="tlsa_part_cert_usage"
          setValue={(value: number | "") =>
            setTlsaFields({
              ...tlsaFields,
              tlsa_part_cert_usage: Number(value),
            })
          }
          aria-label="Certificate usage number input"
          maxValue={255}
          numCharsShown={4}
        />
      </FormGroup>
      <FormGroup label="Selector" isRequired>
        <NumberSelector
          id="tlsa-part-selector"
          value={tlsaFields.tlsa_part_selector}
          name="tlsa_part_selector"
          setValue={(value: number | "") =>
            setTlsaFields({ ...tlsaFields, tlsa_part_selector: Number(value) })
          }
          aria-label="Selector number input"
          maxValue={255}
          numCharsShown={4}
        />
      </FormGroup>
      <FormGroup label="Matching type" isRequired>
        <NumberSelector
          id="tlsa-part-matching-type"
          value={tlsaFields.tlsa_part_matching_type}
          name="tlsa_part_matching_type"
          setValue={(value: number | "") =>
            setTlsaFields({
              ...tlsaFields,
              tlsa_part_matching_type: Number(value),
            })
          }
          aria-label="Matching type number input"
          maxValue={255}
          numCharsShown={4}
        />
      </FormGroup>
      <FormGroup label="Certificate association data" isRequired>
        <TextArea
          value={tlsaFields.tlsa_part_cert_association_data}
          id="tlsa-part-cert-association-data"
          name="tlsa_part_cert_association_data"
          onChange={(_event, value: string) =>
            setTlsaFields({
              ...tlsaFields,
              tlsa_part_cert_association_data: value,
            })
          }
          aria-label="Certificate association data text area"
          rows={6}
        />
      </FormGroup>
    </>
  );

  // - TXT
  const txtComponents = (
    <>
      <FormGroup label="Text data" isRequired>
        <TextInput
          value={txtFields.txt_part_data}
          id="txt-part-data"
          name="txt_part_data"
          onChange={(_event, value: string) =>
            setTxtFields({ ...txtFields, txt_part_data: value })
          }
          aria-label="Text data text input"
        />
      </FormGroup>
    </>
  );

  // - URI
  const uriComponents = (
    <>
      <FormGroup
        label="Priority"
        isRequired
        labelIcon={
          <CustomTooltip id="uri-priority-tooltip" message={uriPriorityMessage}>
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <NumberSelector
          id="uri-part-priority"
          value={uriFields.uri_part_priority}
          name="uri_part_priority"
          setValue={(value: number | "") =>
            setUriFields({ ...uriFields, uri_part_priority: Number(value) })
          }
          aria-label="Priority number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup
        label="Weight"
        isRequired
        labelIcon={
          <CustomTooltip id="uri-weight-tooltip" message={uriWeightMessage}>
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <NumberSelector
          id="uri-part-weight"
          value={uriFields.uri_part_weight}
          name="uri_part_weight"
          setValue={(value: number | "") =>
            setUriFields({ ...uriFields, uri_part_weight: Number(value) })
          }
          aria-label="Weight number input"
          maxValue={65535}
          numCharsShown={6}
        />
      </FormGroup>
      <FormGroup
        label="Target uniform resource identifier"
        isRequired
        labelIcon={
          <CustomTooltip id="uri-target-tooltip" message={uriTargetMessage}>
            <InfoCircleIcon />
          </CustomTooltip>
        }
      >
        <TextInput
          value={uriFields.uri_part_target}
          id="uri-part-target"
          name="uri_part_target"
          onChange={(_event, value: string) =>
            setUriFields({ ...uriFields, uri_part_target: value })
          }
          aria-label="Target uniform resource identifier text input"
        />
      </FormGroup>
    </>
  );

  // Fields shown on selected record type
  const getRecordTypeFields = (recordType: DnsRecordType) => {
    switch (recordType) {
      case "A":
        return aComponents;
      case "AAAA":
        return aComponents;
      case "A6":
        return a6Components;
      case "AFSDB":
        return afsdbComponents;
      case "CERT":
        return certComponents;
      case "CNAME":
        return cnameComponents;
      case "DNAME":
        return dnameComponents;
      case "DS":
        return dsDlvComponents;
      case "DLV":
        return dsDlvComponents;
      case "KX":
        return kxMxComponents;
      case "LOC":
        return locComponents;
      case "MX":
        return kxMxComponents;
      case "NAPTR":
        return naptrComponents;
      case "NS":
        return nsPtrComponents;
      case "PTR":
        return nsPtrComponents;
      case "SRV":
        return srvComponents;
      case "SSHFP":
        return sshfpComponents;
      case "TLSA":
        return tlsaComponents;
      case "TXT":
        return txtComponents;
      case "URI":
        return uriComponents;
    }
  };

  // on Add operation
  const onAddOperation = (keepModalOpen: boolean) => {
    const elementsToBuildPayload: Map<string, BasicType> = new Map();

    switch (basicFormValues.recordType) {
      case "A":
        elementsToBuildPayload.set(
          "a_part_ip_address",
          aFields.a_part_ip_address
        );
        if (aFields.extra_create_reverse !== false) {
          elementsToBuildPayload.set(
            "a_extra_create_reverse",
            aFields.extra_create_reverse
          );
        }
        break;
      case "AAAA":
        elementsToBuildPayload.set(
          "aaaa_part_ip_address",
          aFields.a_part_ip_address
        );
        if (aFields.extra_create_reverse !== false) {
          elementsToBuildPayload.set(
            "aaaa_extra_create_reverse",
            aFields.extra_create_reverse
          );
        }
        break;
      case "A6":
        elementsToBuildPayload.set("a6_part_data", a6Fields.a6_part_data);
        break;
      case "AFSDB":
        elementsToBuildPayload.set(
          "afsdb_part_subtype",
          afsdbFields.afsdb_part_subtype
        );
        elementsToBuildPayload.set(
          "afsdb_part_hostname",
          afsdbFields.afsdb_part_hostname
        );
        break;
      case "CERT":
        elementsToBuildPayload.set("cert_part_type", certFields.cert_part_type);
        elementsToBuildPayload.set(
          "cert_part_key_tag",
          certFields.cert_part_key_tag
        );
        elementsToBuildPayload.set(
          "cert_part_algorithm",
          certFields.cert_part_algorithm
        );
        elementsToBuildPayload.set(
          "cert_part_certificate_or_crl",
          certFields.cert_part_certificate_or_crl
        );
        break;
      case "CNAME":
        elementsToBuildPayload.set(
          "cname_part_hostname",
          cnameFields.cname_part_hostname
        );
        break;
      case "DNAME":
        elementsToBuildPayload.set(
          "dname_part_target",
          dnameFields.dname_part_target
        );
        break;
      case "DS":
        elementsToBuildPayload.set("ds_part_key_tag", dsdlvFields.part_key_tag);
        elementsToBuildPayload.set(
          "ds_part_algorithm",
          dsdlvFields.part_algorithm
        );
        elementsToBuildPayload.set(
          "ds_part_digest_type",
          dsdlvFields.part_digest_type
        );
        elementsToBuildPayload.set("ds_part_digest", dsdlvFields.part_digest);
        break;
      case "DLV":
        elementsToBuildPayload.set(
          "dlv_part_key_tag",
          dsdlvFields.part_key_tag
        );
        elementsToBuildPayload.set(
          "dlv_part_algorithm",
          dsdlvFields.part_algorithm
        );
        elementsToBuildPayload.set(
          "dlv_part_digest_type",
          dsdlvFields.part_digest_type
        );
        elementsToBuildPayload.set("dlv_part_digest", dsdlvFields.part_digest);
        break;
      case "KX":
        elementsToBuildPayload.set(
          "kx_part_preference",
          kxMxFields.part_preference
        );
        elementsToBuildPayload.set(
          "kx_part_exchanger",
          kxMxFields.part_exchanger
        );
        break;
      case "LOC":
        elementsToBuildPayload.set(
          "loc_part_lat_deg",
          locFields.loc_part_lat_deg
        );
        elementsToBuildPayload.set(
          "loc_part_lat_min",
          locFields.loc_part_lat_min
        );
        elementsToBuildPayload.set(
          "loc_part_lat_sec",
          locFields.loc_part_lat_sec
        );
        elementsToBuildPayload.set(
          "loc_part_lat_dir",
          locFields.loc_part_lat_dir
        );
        elementsToBuildPayload.set(
          "loc_part_lon_deg",
          locFields.loc_part_lon_deg
        );
        elementsToBuildPayload.set(
          "loc_part_lon_min",
          locFields.loc_part_lon_min
        );
        elementsToBuildPayload.set(
          "loc_part_lon_sec",
          locFields.loc_part_lon_sec
        );
        elementsToBuildPayload.set(
          "loc_part_lon_dir",
          locFields.loc_part_lon_dir
        );
        elementsToBuildPayload.set(
          "loc_part_altitude",
          locFields.loc_part_altitude
        );
        elementsToBuildPayload.set("loc_part_size", locFields.loc_part_size);
        elementsToBuildPayload.set(
          "loc_part_h_precision",
          locFields.loc_part_h_precision
        );
        elementsToBuildPayload.set(
          "loc_part_v_precision",
          locFields.loc_part_v_precision
        );
        break;
      case "MX":
        elementsToBuildPayload.set(
          "part_preference",
          kxMxFields.part_preference
        );
        elementsToBuildPayload.set("part_exchanger", kxMxFields.part_exchanger);
        break;
      case "NAPTR":
        elementsToBuildPayload.set(
          "naptr_part_order",
          naptrFields.naptr_part_order
        );
        elementsToBuildPayload.set(
          "naptr_part_preference",
          naptrFields.naptr_part_preference
        );
        elementsToBuildPayload.set(
          "naptr_part_flags",
          naptrFields.naptr_part_flags
        );
        elementsToBuildPayload.set(
          "naptr_part_service",
          naptrFields.naptr_part_service
        );
        elementsToBuildPayload.set(
          "naptr_part_regexp",
          naptrFields.naptr_part_regexp
        );
        elementsToBuildPayload.set(
          "naptr_part_replacement",
          naptrFields.naptr_part_replacement
        );
        break;
      case "NS":
        elementsToBuildPayload.set(
          "ns_part_hostname",
          nsptrFields.part_hostname
        );
        break;
      case "PTR":
        elementsToBuildPayload.set(
          "ptr_part_hostname",
          nsptrFields.part_hostname
        );
        break;
      case "SRV":
        elementsToBuildPayload.set(
          "srv_part_priority",
          srvFields.srv_part_priority
        );
        elementsToBuildPayload.set(
          "srv_part_weight",
          srvFields.srv_part_weight
        );
        elementsToBuildPayload.set("srv_part_port", srvFields.srv_part_port);
        elementsToBuildPayload.set(
          "srv_part_target",
          srvFields.srv_part_target
        );
        break;
      case "SSHFP":
        elementsToBuildPayload.set(
          "sshfp_part_algorithm",
          sshfpFields.sshfp_part_algorithm
        );
        elementsToBuildPayload.set(
          "sshfp_part_fp_type",
          sshfpFields.sshfp_part_fp_type
        );
        elementsToBuildPayload.set(
          "sshfp_part_fingerprint",
          sshfpFields.sshfp_part_fingerprint
        );
        break;
      case "TLSA":
        elementsToBuildPayload.set(
          "tlsa_part_cert_usage",
          tlsaFields.tlsa_part_cert_usage
        );
        elementsToBuildPayload.set(
          "tlsa_part_selector",
          tlsaFields.tlsa_part_selector
        );
        elementsToBuildPayload.set(
          "tlsa_part_matching_type",
          tlsaFields.tlsa_part_matching_type
        );
        elementsToBuildPayload.set(
          "tlsa_part_cert_association_data",
          tlsaFields.tlsa_part_cert_association_data
        );
        break;
      case "TXT":
        elementsToBuildPayload.set("txt_part_data", txtFields.txt_part_data);
        break;
      case "URI":
        elementsToBuildPayload.set(
          "uri_part_priority",
          uriFields.uri_part_priority
        );
        elementsToBuildPayload.set(
          "uri_part_weight",
          uriFields.uri_part_weight
        );
        elementsToBuildPayload.set(
          "uri_part_target",
          uriFields.uri_part_target
        );
        break;
      default:
        break;
    }
    const payload = buildPayload(elementsToBuildPayload);

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

  // Form fields
  const formFields = (
    <Form>
      <FormGroup label="Record name" isRequired>
        <TextInput
          value={basicFormValues.recordName}
          id="record-name"
          name="recordName"
          onChange={(_event, value: string) =>
            setBasicFormValues({ ...basicFormValues, recordName: value })
          }
          aria-label="Record name text input"
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
            >
              {basicFormValues.recordType}
            </MenuToggle>
          )}
          aria-label="Record type select"
          isOpen={isRecordTypeOpen}
          isScrollable
        >
          {recordTypeOptions.map((option) => (
            <SelectOption key={option.value} value={option.value}>
              {option.label}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
      {getRecordTypeFields(basicFormValues.recordType as DnsRecordType)}
    </Form>
  );

  // Clear form fields
  const clearFields = () => {
    setBasicFormValues({
      recordName: "",
      recordType: "A",
    });
    setAFields({
      a_part_ip_address: "",
      extra_create_reverse: false,
    });
    setA6Fields({
      a6_part_data: "",
    });
    setAfsdbFields({
      afsdb_part_subtype: 0,
      afsdb_part_hostname: "",
    });
    setCertFields({
      cert_part_type: 0,
      cert_part_key_tag: 0,
      cert_part_algorithm: 0,
      cert_part_certificate_or_crl: "",
    });
    setCnameFields({
      cname_part_hostname: "",
    });
    setDnameFields({
      dname_part_target: "",
    });
    setDsdlvFields({
      part_key_tag: 0,
      part_algorithm: 0,
      part_digest_type: 0,
      part_digest: "",
    });
    setKxMxFields({
      part_preference: 0,
      part_exchanger: "",
    });
    setLocFields({
      loc_part_lat_deg: 0,
      loc_part_lat_min: 0,
      loc_part_lat_sec: 0,
      loc_part_lat_dir: "N",
      loc_part_lon_deg: 0,
      loc_part_lon_min: 0,
      loc_part_lon_sec: 0,
      loc_part_lon_dir: "E",
      loc_part_altitude: 0,
      loc_part_size: 0,
      loc_part_h_precision: 0,
      loc_part_v_precision: 0,
    });
    setNaptrFields({
      naptr_part_order: 0,
      naptr_part_preference: 0,
      naptr_part_flags: "S",
      naptr_part_service: "",
      naptr_part_regexp: "",
      naptr_part_replacement: "",
    });
    setNsptrFields({
      part_hostname: "",
      part_skip_dns_check: false,
    });
    setSrvFields({
      srv_part_priority: 0,
      srv_part_weight: 0,
      srv_part_port: 0,
      srv_part_target: "",
    });
    setSshfpFields({
      sshfp_part_algorithm: 0,
      sshfp_part_fp_type: 0,
      sshfp_part_fingerprint: "",
    });
    setTlsaFields({
      tlsa_part_cert_usage: 0,
      tlsa_part_selector: 0,
      tlsa_part_matching_type: 0,
      tlsa_part_cert_association_data: "",
    });
    setTxtFields({
      txt_part_data: "",
    });
    setUriFields({
      uri_part_priority: 0,
      uri_part_weight: 0,
      uri_part_target: "",
    });
  };

  // Clear non basic fields
  // - To clear fields when record type is changed
  const clearNonBasicFields = () => {
    setAFields({
      a_part_ip_address: "",
      extra_create_reverse: false,
    });
    setA6Fields({
      a6_part_data: "",
    });
    setAfsdbFields({
      afsdb_part_subtype: 0,
      afsdb_part_hostname: "",
    });
    setCertFields({
      cert_part_type: 0,
      cert_part_key_tag: 0,
      cert_part_algorithm: 0,
      cert_part_certificate_or_crl: "",
    });
    setCnameFields({
      cname_part_hostname: "",
    });
    setDnameFields({
      dname_part_target: "",
    });
    setDsdlvFields({
      part_key_tag: 0,
      part_algorithm: 0,
      part_digest_type: 0,
      part_digest: "",
    });
    setKxMxFields({
      part_preference: 0,
      part_exchanger: "",
    });
    setLocFields({
      loc_part_lat_deg: 0,
      loc_part_lat_min: 0,
      loc_part_lat_sec: 0,
      loc_part_lat_dir: "N",
      loc_part_lon_deg: 0,
      loc_part_lon_min: 0,
      loc_part_lon_sec: 0,
      loc_part_lon_dir: "E",
      loc_part_altitude: 0,
      loc_part_size: 0,
      loc_part_h_precision: 0,
      loc_part_v_precision: 0,
    });
    setNaptrFields({
      naptr_part_order: 0,
      naptr_part_preference: 0,
      naptr_part_flags: "S",
      naptr_part_service: "",
      naptr_part_regexp: "",
      naptr_part_replacement: "",
    });
    setNsptrFields({
      part_hostname: "",
      part_skip_dns_check: false,
    });
    setSrvFields({
      srv_part_priority: 0,
      srv_part_weight: 0,
      srv_part_port: 0,
      srv_part_target: "",
    });
    setSshfpFields({
      sshfp_part_algorithm: 0,
      sshfp_part_fp_type: 0,
      sshfp_part_fingerprint: "",
    });
    setTlsaFields({
      tlsa_part_cert_usage: 0,
      tlsa_part_selector: 0,
      tlsa_part_matching_type: 0,
      tlsa_part_cert_association_data: "",
    });
    setTxtFields({
      txt_part_data: "",
    });
    setUriFields({
      uri_part_priority: 0,
      uri_part_weight: 0,
      uri_part_target: "",
    });
  };

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
    <Button key="cancel-new" variant="link" onClick={cleanAndCloseModal}>
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
