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

interface PropsToOtherRecordTypes {
  idnsname: string;
  recordName?: string;
  isDataLoading: boolean;
  onRefresh: () => void;
  dnsRecords: RecordType[];
}

const OTHER_RECORD_TYPES: RecordConfigType = {
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
      return {
        ...baseData,
        a6_part_data: record.dnsdata,
      };
    case "AFSDB": {
      const [subtype, hostname] = record.dnsdata.split(" ");
      return {
        ...baseData,
        afsdb_part_subtype: Number(subtype),
        afsdb_part_hostname: hostname,
      };
    }
    case "CERT": {
      const [type, key_tag, algorithm] = record.dnsdata.split(" ");
      return {
        ...baseData,
        cert_part_type: Number(type),
        cert_part_key_tag: Number(key_tag),
        cert_part_algorithm: Number(algorithm),
      };
    }
    case "DNAME":
      return { ...baseData, dname_part_target: record.dnsdata };
    case "DS": {
      const [key_tag, algorithm, digest_type] = record.dnsdata.split(" ");
      return {
        ...baseData,
        ds_part_key_tag: Number(key_tag),
        ds_part_algorithm: Number(algorithm),
        ds_part_digest_type: Number(digest_type),
      };
    }
    case "DLV": {
      const [key_tag, algorithm, digest_type] = record.dnsdata.split(" ");
      return {
        ...baseData,
        dlv_part_key_tag: Number(key_tag),
        dlv_part_algorithm: Number(algorithm),
        dlv_part_digest_type: Number(digest_type),
      };
    }
    case "KX": {
      const [preference, exchanger] = record.dnsdata.split(" ");
      return {
        ...baseData,
        kx_part_preference: Number(preference),
        kx_part_exchanger: exchanger,
      };
    }
    case "LOC":
      return { ...baseData, locrecord: [record.dnsdata] };
    case "NAPTR":
      return { ...baseData, naptrrecord: [record.dnsdata] };
    case "SSHFP": {
      const [algorithm, fp_type] = record.dnsdata.split(" ");
      return {
        ...baseData,
        sshfp_part_algorithm: Number(algorithm),
        sshfp_part_fp_type: Number(fp_type),
      };
    }
    case "TLSA": {
      const [cert_usage, selector, matching_type] = record.dnsdata.split(" ");
      return {
        ...baseData,
        tlsa_part_cert_usage: Number(cert_usage),
        tlsa_part_selector: Number(selector),
        tlsa_part_matching_type: Number(matching_type),
      };
    }
    case "URI": {
      const [priority, weight, target] = record.dnsdata.split(" ");
      return {
        ...baseData,
        uri_part_priority: Number(priority),
        uri_part_weight: Number(weight),
        uri_part_target: target,
      };
    }
    default:
      return { ...baseData };
  }
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
    }, {})
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
    const records = items.map((item) => ({
      ...item, // Include all table row data (ipAddress, hostname, etc.)
      idnsname: props.recordName || "@",
      type,
      dnsdata: item.originalData,
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
      <div key={type}>
        <TitleLayout
          id={`${type.toLowerCase()}-type`}
          text={type}
          headingLevel="h4"
          className={`pf-v5-u-mb-lg ${type !== Object.keys(OTHER_RECORD_TYPES)[0] ? "pf-v5-u-mt-xl" : ""}`}
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

  return <>{Object.keys(OTHER_RECORD_TYPES).map(renderTable)}</>;
};

export default OtherRecordTypes;
