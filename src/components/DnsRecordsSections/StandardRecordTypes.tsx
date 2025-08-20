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
  RecordConfigType,
  RecordType,
} from "src/utils/datatypes/globalDataTypes";
// Utils
import { getRecordTypeName } from "src/utils/utils";
// Components
import EditDnsRecordModal from "../modals/DnsZones/EditDnsRecordModal";

interface PropsToStandardRecordTypes {
  idnsname: string;
  recordName?: string;
  isDataLoading: boolean;
  onRefresh: () => void;
  dnsRecords: RecordType[];
}

// Record type configurations - simplified and consolidated
const RECORD_CONFIGS: RecordConfigType = {
  A: { columns: [{ key: "a_part_ip_address", label: "IP Address" }] },
  AAAA: { columns: [{ key: "aaaa_part_ip_address", label: "IP Address" }] },
  CNAME: { columns: [{ key: "cname_part_hostname", label: "Hostname" }] },
  MX: {
    columns: [
      { key: "mx_part_preference", label: "Preference" },
      { key: "mx_part_exchanger", label: "Exchanger" },
    ],
  },
  NS: { columns: [{ key: "ns_part_hostname", label: "Hostname" }] },
  PTR: { columns: [{ key: "ptr_part_hostname", label: "Hostname" }] },
  SRV: {
    columns: [
      { key: "srv_part_priority", label: "Priority (order)" },
      { key: "srv_part_weight", label: "Weight" },
      { key: "srv_part_port", label: "Port" },
      { key: "srv_part_target", label: "Target" },
    ],
  },
  TXT: { columns: [{ key: "txt_part_data", label: "Text data" }] },
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
      return { ...baseData, a_part_ip_address: [record.dnsdata] };
    case "AAAA":
      return { ...baseData, aaaa_part_ip_address: record.dnsdata };
    case "CNAME":
    case "NS":
    case "PTR":
      return { ...baseData, ptr_part_hostname: record.dnsdata };
    case "MX": {
      const [pref, exch] = record.dnsdata.split(" ");
      return {
        ...baseData,
        mx_part_preference: Number(pref),
        mx_part_exchanger: exch,
      };
    }
    case "SRV": {
      const [prio, weight, port, target] = record.dnsdata.split(" ");
      return {
        ...baseData,
        srv_part_priority: Number(prio),
        srv_part_weight: Number(weight),
        srv_part_port: Number(port),
        srv_part_target: target,
      };
    }
    case "TXT":
      return { ...baseData, txt_part_data: record.dnsdata };
    default:
      return { ...baseData };
  }
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
    const config = RECORD_CONFIGS[type as DnsRecordType];
    const rawRecords = props.dnsRecords.filter((r) => r.dnstype === type);
    const records = rawRecords.map((r) => transformRecord(r, type));
    const state = modalStates[type];

    return (
      <div key={type}>
        <TitleLayout
          id={`${type.toLowerCase()}-type`}
          text={type}
          headingLevel="h4"
          className={`pf-v5-u-mb-lg ${type !== Object.keys(RECORD_CONFIGS)[0] ? "pf-v5-u-mt-xl" : ""}`}
        />

        <TableWithOpModals
          columns={config?.columns ?? []}
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
                  ? state.selectedRecord.originalRecord
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
              columnNames={config?.columns?.map((col) => col.label) ?? []}
              keyNames={config?.columns?.map((col) => col.key) ?? []}
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
      </div>
    );
  };

  return <>{Object.keys(RECORD_CONFIGS).map(renderTable)}</>;
};

export default StandardRecordTypes;
