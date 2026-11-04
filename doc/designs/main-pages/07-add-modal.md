# Main Pages — Add Modal Structure & Pattern

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Add Modal Fields](07b-add-modal-fields.md) | [Delete Modal](08-delete-modal-and-utils.md)

The Add modal (`src/components/modals/<EntityModals>/Add<Entity>Modal.tsx`) is built using `ModalWithFormLayout`.

## Standard Props Interface

All Add modals use a consistent props interface with **all props required** (no optionals):

```tsx
interface PropsToAddModal {
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `onClose` | `() => void` | Callback to close the modal |
| `title` | `string` | Modal title displayed in the header |
| `onRefresh` | `() => void` | Callback to refresh the parent table after successful addition |

**Usage in the parent page:**

The modal must be conditionally rendered so that it unmounts when closed. This resets all internal state automatically — no manual field clearing needed.

```tsx
{showAddModal && (
  <AddEntityModal
    onClose={() => setShowAddModal(false)}
    title="Add entity"
    onRefresh={refreshData}
  />
)}
```

## Code Organization

The Add modal follows this structure:

1. **Imports** — PatternFly components, layout components, RPC hooks, Redux, alerts
2. **Props interface** — Standard `PropsToAddModal` with four required props
3. **Component body:**
   - API mutation hook
   - State declarations (spinner, form fields)
   - `onClose()` — guarded close handler (prevents closing while a request is in flight)
   - `onAdd()` — the add handler (API call, success/error alerts, refresh, close)
   - `fields` array — form field definitions
   - `modalActions` array — Add and Cancel buttons
4. **Return** — `ModalWithFormLayout` component

## Error Handling

Use **alerts** for error handling — do not use a separate `ErrorModal` component:

```tsx
if (error) {
  dispatch(
    addAlert({
      name: "add-entity-error",
      title: error.message,
      variant: "danger",
    })
  );
}
```

When an error occurs: dispatch a danger alert and keep the modal open. The spinner reset (`setIsAddButtonSpinning(false)`) must always live in a `.finally()` block so it runs regardless of success, error, or rejection. See [Best Practices §6](../sub-pages/00-best-practices.md) for the full rule.

## Modal Action Buttons

Only two buttons: **Add** and **Cancel**.

```tsx
const modalActions: JSX.Element[] = [
  <Button
    data-cy="modal-button-add"
    key="add-new"
    isDisabled={isAddButtonSpinning || requiredField === ""}
    form="add-modal-form"
    type="submit"
  >
    Add
  </Button>,
  <Button
    data-cy="modal-button-cancel"
    key="cancel-new"
    variant="link"
    onClick={onClose}
    isDisabled={isAddButtonSpinning}
  >
    Cancel
  </Button>,
];
```

The Cancel button is disabled while a request is in flight, giving clear visual feedback. The `onClose` handler also guards against closing via the modal's X button or Escape key.

## Button Disabled Logic

Compute disabled state inline — do not use `useEffect` + `useState`:

```tsx
// Inline (preferred for simple conditions):
isDisabled={isAddButtonSpinning || requiredField === ""}

// Derived variable (for complex conditions):
const mandatoryEmpty = requiredField1 === "" || requiredField2 === "";
const disabledAdd = isAddButtonSpinning || mandatoryEmpty;
```

## Compact Template

```tsx
import React from "react";
import { Button, TextArea } from "@patternfly/react-core";
import ModalWithFormLayout, { Field } from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
import { useAddEntityMutation } from "src/services/rpcEntity";
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToAddModal {
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddEntityModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();
  const [addEntity] = useAddEntityMutation();

  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [entityName, setEntityName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const onClose = () => {
    if (!isAddButtonSpinning) {
      props.onClose();
    }
  };

  const onAdd = () => {
    setIsAddButtonSpinning(true);
    addEntity({ cn: entityName, description: description || undefined })
      .then((response) => {
        if ("data" in response) {
          const error = response.data?.error as SerializedError;
          if (error) {
            dispatch(addAlert({ name: "add-entity-error", title: error.message, variant: "danger" }));
          }
          if (response.data?.result) {
            dispatch(addAlert({ name: "add-entity-success", title: "New entity added", variant: "success" }));
            props.onRefresh();
            props.onClose();
          }
        }
      }).finally(() => {
        setIsAddButtonSpinning(false);
      });
  };

  const fields: Field[] = [
    {
      id: "modal-form-entity-name",
      name: "Entity name",
      pfComponent: (
        <InputRequiredText dataCy="modal-textbox-entity-name" id="modal-form-entity-name"
          name="cn" value={entityName} onChange={setEntityName} requiredHelperText="Required value" />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-description",
      name: "Description",
      pfComponent: (
        <TextArea data-cy="modal-textbox-description" id="modal-form-description" name="description"
          value={description} onChange={(_e, v) => setDescription(v)} autoResize />
      ),
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button data-cy="modal-button-add" key="add-new" isDisabled={isAddButtonSpinning || entityName === ""}
      form="add-modal-form" type="submit">Add</Button>,
    <Button data-cy="modal-button-cancel" key="cancel-new" variant="link" onClick={onClose}
      isDisabled={isAddButtonSpinning}>Cancel</Button>,
  ];

  return (
    <ModalWithFormLayout dataCy="add-entity-modal" variantType="small" modalPosition="top" offPosition="76px"
      title={props.title} formId="add-modal-form" fields={fields} show
      onSubmit={() => onAdd()} onClose={onClose} actions={modalActions} />
  );
};

export default AddEntityModal;
```

## Reference Implementations

| Entity | Modal file | Notes |
|--------|-----------|-------|
| Roles | `src/components/modals/RoleModals/AddRoleModal.tsx` | Simple two-field modal |
| Certificate Mapping | `src/components/modals/CertificateMapping/AddRuleModal.tsx` | Clean pattern with alerts |
| DNS Zones | `src/components/modals/DnsZones/AddDnsZoneModal.tsx` | Uses custom Modal component |
