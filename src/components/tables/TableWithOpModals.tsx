import React from "react";
// PatternFly
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Checkbox,
  Skeleton,
} from "@patternfly/react-core";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
  TableVariant,
} from "@patternfly/react-table";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import {
  RecordType,
  RecordTypeData,
} from "src/utils/datatypes/globalDataTypes";

// Column definition interface
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

// Table row data interface
export type TableRow = {
  id: string | number;
  originalData: string;
  originalRecord: RecordType;
} & RecordTypeData;

// Action item interface
export interface TableAction {
  label: string;
  onClick: (item: TableRow) => void;
  isDisabled?: (item: TableRow) => boolean;
}

// Props interface
interface PropsToTableWithOpModals {
  // Table data
  columns: TableColumn[];
  rows: TableRow[];
  // Modal components
  addModal: React.ReactNode;
  editModal: React.ReactNode;
  deleteModal: React.ReactNode;
  // Modal states
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  // Modal handlers
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  onOpenEditModal: (item: TableRow) => void;
  onCloseEditModal: () => void;
  onOpenDeleteModal: (selectedItems: TableRow[]) => void;
  onCloseDeleteModal: () => void;
  // Table configuration
  hasCheckboxes?: boolean;
  emptyStateMessage?: string;
  tableTitle?: string;
  tableVariant?: "compact" | "default";
  // Additional actions per row (optional)
  customActions?: TableAction[];
  // Loading state
  isLoading?: boolean;
  // Current edited item
  editingItem?: TableRow | null;
}

const TableWithOpModals = (props: PropsToTableWithOpModals) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // States
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(
    new Set()
  );

  // Helper functions
  const isRowSelected = (rowId: string | number) => selectedRows.has(rowId);

  const isAllRowsSelected = () => {
    return props.rows.length > 0 && selectedRows.size === props.rows.length;
  };

  // Selection handlers
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRows(new Set(props.rows.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowId: string | number, isSelected: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (isSelected) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    setSelectedRows(newSelectedRows);
  };

  // Get selected row objects
  const getSelectedRowObjects = (): TableRow[] => {
    return props.rows.filter((row) => selectedRows.has(row.id));
  };

  // Action handlers
  const handleEdit = (item: TableRow) => {
    props.onOpenEditModal(item);
  };

  const handleDelete = () => {
    const selectedItems = getSelectedRowObjects();
    props.onOpenDeleteModal(selectedItems);
  };

  // Reset selections when rows change
  React.useEffect(() => {
    setSelectedRows(new Set());
  }, [props.rows]);

  // Computed states
  const isDeleteDisabled = selectedRows.size === 0;
  const hasRows = props.rows.length > 0;

  // Render loading state
  const loadingState = () => {
    const skeletonRows = Array.from({ length: 3 }, (_, index) => (
      <Tr key={`skeleton-${index}`}>
        {props.hasCheckboxes && (
          <Td>
            <Skeleton height="20px" width="20px" />
          </Td>
        )}
        {props.columns.map((column) => (
          <Td key={`skeleton-${column.key}-${index}`}>
            <Skeleton height="20px" />
          </Td>
        ))}
        <Td>
          <Skeleton height="20px" width="80px" />
        </Td>
      </Tr>
    ));
    return <>{skeletonRows}</>;
  };

  // Render empty state
  const emptyState = () => (
    <Tr>
      <Td colSpan={props.columns.length + (props.hasCheckboxes ? 2 : 1)}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          {props.emptyStateMessage || "No data available"}
        </div>
      </Td>
    </Tr>
  );

  // Render table header
  const tableHeader = () => (
    <Thead>
      <Tr>
        {props.hasCheckboxes && (
          <Th>
            <Checkbox
              id="select-all"
              isChecked={isAllRowsSelected()}
              onChange={(_event, checked) => handleSelectAll(checked)}
              aria-label="Select all rows"
              data-cy="select-all-checkbox"
            />
          </Th>
        )}
        {props.columns.map((column) => (
          <Th key={column.key}>{column.label}</Th>
        ))}
        {hasRows && <Th>Actions</Th>}
      </Tr>
    </Thead>
  );

  // Render table row
  const tableRow = (row: TableRow, index: number) => {
    const isSelected = isRowSelected(row.id);

    // Default actions
    const defaultActions = [
      {
        label: "Edit",
        onClick: () => handleEdit(row),
        isDisabled: false,
      },
    ];

    // Combine with custom actions
    const allActions = [...defaultActions, ...(props.customActions || [])];

    return (
      <Tr key={row.id} selected={isSelected}>
        {props.hasCheckboxes && (
          <Td>
            <Checkbox
              id={`select-row-${row.id}`}
              isChecked={isSelected}
              onChange={(_event, checked) => handleSelectRow(row.id, checked)}
              aria-label={`Select row ${index + 1}`}
              data-cy={`select-row-${row.id}`}
            />
          </Td>
        )}
        {props.columns.map((column) => (
          <Td key={column.key} dataLabel={column.label}>
            {row[column.key]}
          </Td>
        ))}
        <Td>
          <ActionsColumn
            items={allActions.map((action, actionIndex) => ({
              title: action.label,
              onClick: () => action.onClick(row),
              isDisabled:
                typeof action.isDisabled === "function"
                  ? action.isDisabled(row)
                  : action.isDisabled || false,
              "data-cy": `action-${actionIndex}-row-${row.id}`,
            }))}
          />
        </Td>
      </Tr>
    );
  };

  // Render toolbar
  const renderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <Button
            variant="primary"
            onClick={props.onOpenAddModal}
            data-cy="add-button"
          >
            Add
          </Button>
        </ToolbarItem>
        {props.hasCheckboxes && (
          <ToolbarItem>
            <Button
              variant="danger"
              isDisabled={isDeleteDisabled}
              onClick={handleDelete}
              data-cy="delete-button"
            >
              Delete ({selectedRows.size})
            </Button>
          </ToolbarItem>
        )}
        <ToolbarItem align={{ default: "alignEnd" }}>
          {selectedRows.size > 0 && (
            <span data-cy="selection-count">
              {selectedRows.size} of {props.rows.length} selected
            </span>
          )}
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  return (
    <div data-cy="table-with-op-modals">
      <alerts.ManagedAlerts />

      {/* Toolbar */}
      {renderToolbar()}

      {/* Table */}
      <Table
        aria-label={props.tableTitle || "Data table"}
        variant={(props.tableVariant as TableVariant) || TableVariant.compact}
      >
        {tableHeader()}
        <Tbody>
          {props.isLoading
            ? loadingState()
            : hasRows
              ? props.rows.map((row, index) => tableRow(row, index))
              : emptyState()}
        </Tbody>
      </Table>

      {/* Modals */}
      {props.addModal}
      {props.editModal}
      {props.deleteModal}
    </div>
  );
};

export default TableWithOpModals;
