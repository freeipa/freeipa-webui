/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// Components
import TableWithOpModals, { TableRow } from "../tables/TableWithOpModals";
import TitleLayout from "../layouts/TitleLayout";
import AddDnsRecordsModal from "src/components/modals/DnsZones/AddDnsRecordsModal";
import DeleteDnsRecordsModal from "src/components/modals/DnsZones/DeleteDnsRecords";
// Data types
import {
  DNSRecord,
  DnsRecordType,
  RecordType,
} from "src/utils/datatypes/globalDataTypes";
import EditDnsRecordModal from "../modals/DnsZones/EditDnsRecordModal";

interface PropsToOtherRecordTypes {
  idnsname: string;
  recordName?: string;
  isDataLoading: boolean;
  onRefresh: () => void;
  dnsRecords: RecordType[];
}

const OTHER_RECORD_TYPES = {
  A6: {
    columns: [{ key: "a6_part_data", label: "Record data" }],
  },
  AFSDB: {
    columns: [
      { key: "afsdb_part_subtype", label: "Subtype" },
      { key: "afsdb_part_hostname", label: "Hostname" },
    ],
  },
  CERT: {
    columns: [
      { key: "cert_part_type", label: "Type" },
      { key: "cert_part_key_tag", label: "Key tag" },
      { key: "cert_part_algorithm", label: "Algorithm" },
    ],
  },
  DNAME: {
    columns: [{ key: "dname_part_target", label: "Target" }],
  },
  DS: {
    columns: [
      { key: "ds_part_key_tag", label: "Key tag" },
      { key: "ds_part_algorithm", label: "Algorithm" },
      { key: "ds_part_digest_type", label: "Digest type" },
    ],
  },

  DLV: {
    columns: [
      { key: "dlv_part_key_tag", label: "Key tag" },
      { key: "dlv_part_algorithm", label: "Algorithm" },
      { key: "dlv_part_digest_type", label: "Digest type" },
    ],
  },
  KX: {
    columns: [
      { key: "kx_part_preference", label: "Preference" },
      { key: "kx_part_exchanger", label: "Exchanger" },
    ],
  },
  LOC: {
    columns: [{ key: "locrecord", label: "Record data" }],
  },
  NAPTR: {
    columns: [{ key: "naptrrecord", label: "Record data" }],
  },
  SSHFP: {
    columns: [
      { key: "sshfp_part_algorithm", label: "Algorithm" },
      { key: "sshfp_part_fp_type", label: "Fingerprint type" },
    ],
  },
  TLSA: {
    columns: [
      { key: "tlsa_part_cert_usage", label: "Cert usage" },
      { key: "tlsa_part_selector", label: "Selector" },
      { key: "tlsa_part_matching_type", label: "Matching type" },
    ],
  },
  URI: {
    columns: [
      { key: "uri_part_priority", label: "Priority (order)" },
      { key: "uri_part_weight", label: "Weight" },
      { key: "uri_part_target", label: "Target uniform resource identifier" },
    ],
  },
};

const transformRecord = (record: RecordType, type: string): TableRow => {
  const id = `${type.toLowerCase()}-${record.dnsdata}`;

  // Store original record data for edit operations
  const baseData = {
    id,
    originalData: record.dnsdata, // Store original DNS data for API payload
    originalRecord: record, // Store complete original record for reference
  };

  switch (type) {
    case "A6":
      return { ...baseData, a6_part_data: record.dnsdata };
    case "AFSDB": {
      const [subtype, hostname] = record.dnsdata.split(" ");
      return {
        ...baseData,
        afsdb_part_subtype: subtype,
        afsdb_part_hostname: hostname,
      };
    }
    case "CERT": {
      const [type, key_tag, algorithm] = record.dnsdata.split(" ");
      return {
        ...baseData,
        cert_part_type: type,
        cert_part_key_tag: key_tag,
        cert_part_algorithm: algorithm,
      };
    }
    case "DNAME":
      return { ...baseData, dname_part_target: record.dnsdata };
    case "DS": {
      const [key_tag, algorithm, digest_type] = record.dnsdata.split(" ");
      return {
        ...baseData,
        ds_part_key_tag: key_tag,
        ds_part_algorithm: algorithm,
        ds_part_digest_type: digest_type,
      };
    }
    case "DLV": {
      const [key_tag, algorithm, digest_type] = record.dnsdata.split(" ");
      return {
        ...baseData,
        dlv_part_key_tag: key_tag,
        dlv_part_algorithm: algorithm,
        dlv_part_digest_type: digest_type,
      };
    }
    case "KX": {
      const [preference, exchanger] = record.dnsdata.split(" ");
      return {
        ...baseData,
        kx_part_preference: preference,
        kx_part_exchanger: exchanger,
      };
    }
    case "LOC":
      return { ...baseData, locrecord: record.dnsdata };
    case "NAPTR":
      return { ...baseData, naptrrecord: record.dnsdata };
    case "SSHFP": {
      const [algorithm, fp_type] = record.dnsdata.split(" ");
      return {
        ...baseData,
        sshfp_part_algorithm: algorithm,
        sshfp_part_fp_type: fp_type,
      };
    }
    case "TLSA": {
      const [cert_usage, selector, matching_type] = record.dnsdata.split(" ");
      return {
        ...baseData,
        tlsa_part_cert_usage: cert_usage,
        tlsa_part_selector: selector,
        tlsa_part_matching_type: matching_type,
      };
    }
    case "URI": {
      const [priority, weight, target] = record.dnsdata.split(" ");
      return {
        ...baseData,
        uri_part_priority: priority,
        uri_part_weight: weight,
        uri_part_target: target,
      };
    }
    default:
      return { ...baseData, data: record.dnsdata };
  }
};

// Transform TableRow back to field values for EditDnsRecordModal
const transformTableRowToFieldValues = (
  row: TableRow,
  type: string
): Record<string, any> => {
  const fieldValues: Record<string, any> = {};

  switch (type) {
    case "A6":
      if (row.a6_part_data) fieldValues.a6_part_data = row.a6_part_data;
      break;
    case "AFSDB":
      if (row.afsdb_part_subtype)
        fieldValues.afsdb_part_subtype = row.afsdb_part_subtype;
      if (row.afsdb_part_hostname)
        fieldValues.afsdb_part_hostname = row.afsdb_part_hostname;
      break;
    case "CERT":
      if (row.cert_part_type) fieldValues.cert_part_type = row.cert_part_type;
      if (row.cert_part_key_tag)
        fieldValues.cert_part_key_tag = row.cert_part_key_tag;
      if (row.cert_part_algorithm)
        fieldValues.cert_part_algorithm = row.cert_part_algorithm;
      break;
    case "DNAME":
      if (row.dname_part_target)
        fieldValues.dname_part_target = row.dname_part_target;
      break;
    case "DS":
      if (row.ds_part_key_tag)
        fieldValues.ds_part_key_tag = row.ds_part_key_tag;
      if (row.ds_part_algorithm)
        fieldValues.ds_part_algorithm = row.ds_part_algorithm;
      if (row.ds_part_digest_type)
        fieldValues.ds_part_digest_type = row.ds_part_digest_type;
      break;
    case "DLV":
      if (row.dlv_part_key_tag)
        fieldValues.dlv_part_key_tag = row.dlv_part_key_tag;
      if (row.dlv_part_algorithm)
        fieldValues.dlv_part_algorithm = row.dlv_part_algorithm;
      if (row.dlv_part_digest_type)
        fieldValues.dlv_part_digest_type = row.dlv_part_digest_type;
      break;
    case "KX":
      if (row.kx_part_preference)
        fieldValues.kx_part_preference = row.kx_part_preference;
      if (row.kx_part_exchanger)
        fieldValues.kx_part_exchanger = row.kx_part_exchanger;
      break;
    case "LOC":
      if (row.locrecord) fieldValues.locrecord = row.locrecord;
      break;
    case "NAPTR":
      if (row.naptrrecord) fieldValues.naptrrecord = row.naptrrecord;
      break;
    case "SSHFP":
      if (row.sshfp_part_algorithm)
        fieldValues.sshfp_part_algorithm = row.sshfp_part_algorithm;
      if (row.sshfp_part_fp_type)
        fieldValues.sshfp_part_fp_type = row.sshfp_part_fp_type;
      break;
    case "TLSA":
      if (row.tlsa_part_cert_usage)
        fieldValues.tlsa_part_cert_usage = row.tlsa_part_cert_usage;
      if (row.tlsa_part_selector)
        fieldValues.tlsa_part_selector = row.tlsa_part_selector;
      if (row.tlsa_part_matching_type)
        fieldValues.tlsa_part_matching_type = row.tlsa_part_matching_type;
      break;
    case "URI":
      if (row.uri_part_priority)
        fieldValues.uri_part_priority = row.uri_part_priority;
      if (row.uri_part_weight)
        fieldValues.uri_part_weight = row.uri_part_weight;
      if (row.uri_part_target)
        fieldValues.uri_part_target = row.uri_part_target;
      break;
  }

  return fieldValues;
};

// Helper function to get API record type name from display name
const getRecordTypeName = (recordType: string): string => {
  const recordTypeMapping: Record<string, string> = {
    A6: "a6record",
    AFSDB: "afsdbrecord",
    CERT: "certrecord",
    DNAME: "dnamerecord",
    DS: "dsrecord",
    DLV: "dlvrecord",
    KX: "kxrecord",
    LOC: "locrecord",
    NAPTR: "naptrrecord",
    SSHFP: "sshfprecord",
    TLSA: "tlsarecord",
    URI: "urirecord",
  };

  return recordTypeMapping[recordType] || `${recordType.toLowerCase()}record`;
};

const OtherRecordTypes = (props: PropsToOtherRecordTypes) => {
  // State management - simplified to single state object
  const [modalStates, setModalStates] = React.useState<
    Record<
      string,
      {
        isAddModalOpen: boolean;
        isEditModalOpen: boolean;
        isDeleteModalOpen: boolean;
        selectedRecords: DNSRecord[];
        selectedRecord: TableRow | null;
      }
    >
  >(
    Object.keys(OTHER_RECORD_TYPES).reduce((acc, type) => {
      acc[type] = {
        isAddModalOpen: false,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        selectedRecords: [],
        selectedRecord: null,
      };
      return acc;
    }, {} as any)
  );

  // Generic modal handlers
  const updateModal = (type: string, updates: any) =>
    setModalStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...updates },
    }));

  const handleAdd = (type: string) =>
    updateModal(type, { isAddModalOpen: true });
  const handleCloseAdd = (type: string) =>
    updateModal(type, { isAddModalOpen: false });

  const handleDelete = (type: string, items: TableRow[]) => {
    // Create records that include both table display data and API data
    const records = items.map((item) => ({
      ...item, // Include all table row data (ipAddress, hostname, etc.)
      idnsname: props.recordName || "@", // API expects the record name
      type: type, // DNS record type
      dnsdata: item.originalData, // Original DNS data for API
    }));
    updateModal(type, { isDeleteModalOpen: true, selectedRecords: records });
  };

  const handleCloseDelete = (type: string) =>
    updateModal(type, { isDeleteModalOpen: false, selectedRecords: [] });

  const handleEdit = (type: string, selected: TableRow) =>
    updateModal(type, { isEditModalOpen: true, selectedRecord: selected });

  const handleCloseEdit = (type: string) =>
    updateModal(type, { isEditModalOpen: false, selectedRecord: null });

  const renderTable = (type: string) => {
    const config = OTHER_RECORD_TYPES[type as keyof typeof OTHER_RECORD_TYPES];
    const rawRecords = props.dnsRecords.filter((r) => r.dnstype === type);
    const records = rawRecords.map((r) => transformRecord(r, type));
    const state = modalStates[type];

    return (
      <React.Fragment key={type}>
        <TitleLayout
          id={`${type.toLowerCase()}-type`}
          text={type}
          headingLevel="h4"
          className={`pf-v5-u-mb-lg ${type !== Object.keys(OTHER_RECORD_TYPES)[0] ? "pf-v5-u-mt-xl" : ""}`}
        />
        <TableWithOpModals
          columns={config.columns}
          rows={records}
          hasCheckboxes={true}
          isLoading={props.isDataLoading}
          tableTitle={`${type} Records`}
          emptyStateMessage={`No ${type} records found`}
          tableVariant="compact"
          addModal={
            <AddDnsRecordsModal
              isOpen={state.isAddModalOpen}
              onClose={() => handleCloseAdd(type)}
              onRefresh={props.onRefresh}
              dnsZoneId={props.idnsname}
              defaultSelectedRecordType={type as DnsRecordType}
              defaultRecordName={props.recordName}
            />
          }
          editModal={
            <EditDnsRecordModal
              isOpen={state.isEditModalOpen}
              onClose={() => handleCloseEdit(type)}
              onRefresh={props.onRefresh}
              dnsZoneId={props.idnsname}
              recordName={props.recordName || ""}
              recordType={type as DnsRecordType}
              initialValues={
                state.selectedRecord
                  ? transformTableRowToFieldValues(state.selectedRecord, type)
                  : undefined
              }
              originalRecordData={state.selectedRecord?.originalData}
            />
          }
          deleteModal={
            <DeleteDnsRecordsModal
              isOpen={state.isDeleteModalOpen}
              onClose={() => handleCloseDelete(type)}
              elementsToDelete={state.selectedRecords}
              clearSelectedElements={() =>
                updateModal(type, { selectedRecords: [] })
              }
              columnNames={config.columns.map((col) => col.label)}
              keyNames={config.columns.map((col) => col.key)}
              onRefresh={props.onRefresh}
              dnsZoneId={props.idnsname}
              recordName={props.recordName}
              recordTypeName={getRecordTypeName(type)}
            />
          }
          isAddModalOpen={state.isAddModalOpen}
          isEditModalOpen={state.isEditModalOpen}
          isDeleteModalOpen={state.isDeleteModalOpen}
          onOpenAddModal={() => handleAdd(type)}
          onCloseAddModal={() => handleCloseAdd(type)}
          onOpenEditModal={(selected) => handleEdit(type, selected)}
          onCloseEditModal={() => handleCloseEdit(type)}
          onOpenDeleteModal={(items) => handleDelete(type, items)}
          onCloseDeleteModal={() => handleCloseDelete(type)}
          editingItem={state.selectedRecord}
        />
      </React.Fragment>
    );
  };

  return <>{Object.keys(OTHER_RECORD_TYPES).map(renderTable)}</>;
};

export default OtherRecordTypes;
