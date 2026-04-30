# Main Pages — Delete Modal & Entity Utils File

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Add Modal](07-add-modal.md) | [RPC Service](09-rpc-service.md)

## Delete Modal

The Delete modal (`src/components/modals/<EntityModals>/Delete<Entities>Modal.tsx`) confirms bulk deletion with the user. It **must** receive `columnNames` and `keyNames` as props and pass them through to the `DeletedElementsTable` component so the table dynamically renders the correct columns.

### Props Interface

```tsx
interface Delete<Entities>ModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: <Entity>[];
  clearSelectedElements: () => void;
  columnNames: string[];   // Human-readable column headers, e.g. ["Rule name", "Description"]
  keyNames: string[];      // Attribute keys matching the entity interface, e.g. ["cn", "description"]
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
  fromSettings?: boolean;
}
```

### DeletedElementsTable Usage

The `fields` array inside the delete modal must use `DeletedElementsTable` with `columnNames` and `columnIds` props (not hardcoded columns):

```tsx
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

const fields = [
  {
    id: "question-text",
    pfComponent: (
      <Content component={ContentVariants.p}>
        Are you sure you want to delete the selected entries?
      </Content>
    ),
  },
  {
    id: "deleted-elements-table",
    pfComponent: (
      <DeletedElementsTable
        mode="passing_full_data"
        elementsToDelete={props.elementsToDelete}
        columnNames={props.columnNames}
        columnIds={props.keyNames}
        elementType="<entity type>"
        idAttr={"<primary_key>"}
      />
    ),
  },
];
```

### Calling from the Main Page

When rendering the delete modal from the main page, pass `columnNames` and `keyNames` explicitly:

```tsx
<Delete<Entities>Modal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  elementsToDelete={selectedEntities}
  clearSelectedElements={() => setSelectedEntities([])}
  columnNames={columnNames}       // Same column names used for MainTable
  keyNames={keyNames}             // Same key names used for MainTable
  onRefresh={refreshData}
  updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
  updateIsDeletion={setIsDeletion}
/>
```

### Existing Examples

| Entity | Delete modal file | Props pattern |
|--------|------------------|---------------|
| DNS Zones | `src/components/modals/DnsZones/DeleteDnsZonesModal.tsx` | `columnNames`, `keyNames` → `DeletedElementsTable` |
| Trusts | `src/pages/Trusts/DeleteTrustModal.tsx` | `columnNames`, `keyNames` → `DeletedElementsTable` |

---

## Entity Utils File

Every entity needs a utils file at `src/utils/<entityName>Utils.tsx` (e.g. `hostUtils.tsx`, `trustsUtils.tsx`, `dnsZonesUtils.tsx`). This file provides:

1. **API-to-frontend conversion** (`apiToMyEntity`) — transforms the raw IPA JSON-RPC response into the typed frontend interface
2. **Empty object factory** (`createEmptyMyEntity`) — initializes all fields with safe defaults
3. **Record adapter** (`asRecord`) — wraps the entity for use with form components
4. **Entity-specific helpers** — any helper that operates exclusively on this entity's data type belongs here, **not** in `src/utils/utils.tsx`. For example, a `checkEqualStatusMyEntity` function that compares the enabled/disabled status of selected entries should be defined in the entity utils file, not in the shared utils.

`src/utils/utils.tsx` is reserved for **generic/shared** utilities (e.g. `isMyEntitySelectable` which follows a one-liner pattern shared by all entities, or `checkEqualStatusGen` which is generic over any type). Entity-specific logic that references entity fields or performs entity-specific comparisons must go in the entity's own utils file.

The conversion relies on `convertApiObj` from `src/utils/ipaObjectUtils.ts`, which classifies each field as a simple value (string), a date value, or a complex value (e.g. DNS names with nested `__dns_name__` keys).

### Template

```tsx
// src/utils/myEntitiesUtils.tsx
import { MyEntity } from "src/utils/datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

// Fields that the API returns as arrays but should be stored as simple strings
const simpleValues = new Set([
  "cn",
  "description",
  "dn",
  // Add all single-valued LDAP attributes here...
]);

// Fields that contain generalized time values and need date parsing
const dateValues = new Set([
  // e.g. "krbpasswordexpiration", "krblastpwdchange"
]);

// Fields with complex nested structures (rare, mainly DNS-related)
// Map of field name -> nested key to extract
const complexValues = new Map([
  // e.g. ["idnsname", "__dns_name__"]
]);

export function apiToMyEntity(apiRecord: Record<string, unknown>): MyEntity {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues,
    complexValues // omit if not needed
  ) as Partial<MyEntity>;
  return partialMyEntityToMyEntity(converted);
}

export function partialMyEntityToMyEntity(
  partial: Partial<MyEntity>
): MyEntity {
  return {
    ...createEmptyMyEntity(),
    ...partial,
  };
}

export function createEmptyMyEntity(): MyEntity {
  return {
    cn: "",
    description: "",
    dn: "",
    // Initialize ALL fields from the interface with safe defaults:
    // - strings: ""
    // - string[]: []
    // - booleans: false (or true if that's the IPA default)
    // - numbers: 0
  };
}

// Optional: Record adapter for form components (Settings pages)
export const asRecord = (
  element: Partial<MyEntity>,
  onElementChange: (element: Partial<MyEntity>) => void
) => {
  const ipaObject = element as Record<string, any>;
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as MyEntity);
  }
  return { ipaObject, recordOnChange };
};
```

### Existing Examples

| Entity | Utils file | Key functions |
|--------|-----------|---------------|
| Hosts | `src/utils/hostUtils.tsx` | `apiToHost`, `createEmptyHost`, `asRecord` |
| HBAC Rules | `src/utils/hbacRulesUtils.tsx` | `apiToHBACRule`, `createEmptyHBACRule` |
| Trusts | `src/utils/trustsUtils.tsx` | `apiToTrust`, `createEmptyTrust`, `asRecord` |
| DNS Zones | `src/utils/dnsZonesUtils.tsx` | `apiToDnsZone`, `createEmptyDnsZone` (uses `complexValues` for DNS names) |
