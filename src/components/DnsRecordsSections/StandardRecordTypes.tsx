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

interface PropsToStandardRecordTypes {
  idnsname: string;
  recordName?: string;
  isDataLoading: boolean;
  onRefresh: () => void;
  dnsRecords: RecordType[];
}

// Record type configurations - simplified and consolidated
const RECORD_CONFIGS = {
  A: { columns: [{ key: "ipAddress", label: "IP Address" }] },
  AAAA: { columns: [{ key: "ipAddress", label: "IP Address" }] },
  CNAME: { columns: [{ key: "hostname", label: "Hostname" }] },
  MX: {
    columns: [
      { key: "preference", label: "Preference" },
      { key: "exchanger", label: "Exchanger" },
    ],
  },
  NS: { columns: [{ key: "hostname", label: "Hostname" }] },
  PTR: { columns: [{ key: "hostname", label: "Hostname" }] },
  SRV: {
    columns: [
      { key: "priority", label: "Priority (order)" },
      { key: "weight", label: "Weight" },
      { key: "port", label: "Port" },
      { key: "target", label: "Target" },
    ],
  },
  TXT: { columns: [{ key: "data", label: "Text data" }] },
};

// Generic data transformer
const transformRecord = (record: RecordType, type: string): TableRow => {
  const id = `${type.toLowerCase()}-${record.dnsdata}`;

  // Store original record data for edit operations
  const baseData = {
    id,
    originalData: record.dnsdata, // Store original DNS data for API payload
    originalRecord: record, // Store complete original record for reference
  };

  switch (type) {
    case "A":
      return { ...baseData, ipAddress: record.dnsdata };
    case "AAAA":
      return { ...baseData, ipAddress: record.dnsdata };
    case "CNAME":
      return { ...baseData, hostname: record.dnsdata };
    case "NS":
      return { ...baseData, hostname: record.dnsdata };
    case "PTR":
      return { ...baseData, hostname: record.dnsdata };
    case "MX": {
      const [pref, exch] = record.dnsdata.split(" ");
      return { ...baseData, preference: pref, exchanger: exch };
    }
    case "SRV": {
      const [prio, weight, port, target] = record.dnsdata.split(" ");
      return { ...baseData, priority: prio, weight, port, target };
    }
    case "TXT":
      return { ...baseData, data: record.dnsdata };
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
    case "A":
      if (row.ipAddress) fieldValues.a_part_ip_address = row.ipAddress;
      break;
    case "AAAA":
      if (row.ipAddress) fieldValues.aaaa_part_ip_address = row.ipAddress;
      break;
    case "CNAME":
      if (row.hostname) fieldValues.cname_part_hostname = row.hostname;
      break;
    case "NS":
      if (row.hostname) fieldValues.ns_part_hostname = row.hostname;
      break;
    case "PTR":
      if (row.hostname) fieldValues.ptr_part_hostname = row.hostname;
      break;
    case "MX":
      if (row.preference)
        fieldValues.mx_part_preference =
          parseInt(row.preference as string) || 0;
      if (row.exchanger) fieldValues.mx_part_exchanger = row.exchanger;
      break;
    case "SRV":
      if (row.priority)
        fieldValues.srv_part_priority = parseInt(row.priority as string) || 0;
      if (row.weight)
        fieldValues.srv_part_weight = parseInt(row.weight as string) || 0;
      if (row.port)
        fieldValues.srv_part_port = parseInt(row.port as string) || 0;
      if (row.target) fieldValues.srv_part_target = row.target;
      break;
    case "TXT":
      if (row.data) fieldValues.txt_part_data = row.data;
      break;
    default:
      break;
  }

  return fieldValues;
};

// Helper function to get API record type name from display name
const getRecordTypeName = (recordType: string): string => {
  const recordTypeMapping: Record<string, string> = {
    A: "arecord",
    AAAA: "aaaaarecord",
    A6: "a6record",
    AFSDB: "afsdbrecord",
    CERT: "certrecord",
    CNAME: "cnamerecord",
    DNAME: "dnamerecord",
    DS: "dsrecord",
    DLV: "dlvrecord",
    KX: "kxrecord",
    LOC: "locrecord",
    MX: "mxrecord",
    NAPTR: "naptrrecord",
    NS: "nsrecord",
    PTR: "ptrrecord",
    SRV: "srvrecord",
    SSHFP: "sshfprecord",
    TLSA: "tlsarecord",
    TXT: "txtrecord",
  };

  return recordTypeMapping[recordType] || `${recordType.toLowerCase()}record`;
};

const StandardRecordTypes = (props: PropsToStandardRecordTypes) => {
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
    Object.keys(RECORD_CONFIGS).reduce((acc, type) => {
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
    const config = RECORD_CONFIGS[type as keyof typeof RECORD_CONFIGS];
    const rawRecords = props.dnsRecords.filter((r) => r.dnstype === type);
    const records = rawRecords.map((r) => transformRecord(r, type));
    const state = modalStates[type];

    return (
      <React.Fragment key={type}>
        <TitleLayout
          id={`${type.toLowerCase()}-type`}
          text={type}
          headingLevel="h4"
          className={`pf-v5-u-mb-lg ${type !== Object.keys(RECORD_CONFIGS)[0] ? "pf-v5-u-mt-xl" : ""}`}
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

  return <>{Object.keys(RECORD_CONFIGS).map(renderTable)}</>;
};

export default StandardRecordTypes;
