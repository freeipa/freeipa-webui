# Main Pages — Add Modal Field Types & Templates

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Checklist & Modal Naming](06-checklist-and-types.md) | [Delete Modal & Entity Utils](08-delete-modal-and-utils.md)

The Add modal (`src/components/modals/<EntityModals>/Add<Entity>Modal.tsx`) is built using `ModalWithFormLayout`, which accepts a `fields` array. Each field specifies an `id`, a `name` (label), a `pfComponent` (the PatternFly/custom UI component), and optionally `fieldRequired: true`.

## Standard Props Interface

All Add modals use a consistent props interface with **all props required** (no optionals):

```tsx
interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback to close the modal |
| `title` | `string` | Modal title displayed in the header |
| `onRefresh` | `() => void` | Callback to refresh the parent table after successful addition |

**Usage in the parent page:**

```tsx
<AddEntityModal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  title="Add entity"
  onRefresh={refreshData}
/>
```

## Complete Modal Template

```tsx
import React from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
// RPC
import { useAddEntityMutation } from "src/services/rpcEntity";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddEntityModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addEntity] = useAddEntityMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [entityName, setEntityName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Clear fields
  const clearFields = () => {
    setEntityName("");
    setDescription("");
  };

  // 'Add' button handler
  const onAdd = () => {
    setIsAddButtonSpinning(true);

    addEntity({
      cn: entityName,
      description: description || undefined,
    }).then((response) => {
      if ("data" in response) {
        const data = response.data?.result;
        const error = response.data?.error as SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-entity-error",
              title: error.message,
              variant: "danger",
            })
          );
        }

        if (data) {
          dispatch(
            addAlert({
              name: "add-entity-success",
              title: "New entity added",
              variant: "success",
            })
          );
          // Reset fields
          clearFields();
          // Update data
          props.onRefresh();
          props.onClose();
        }
      }
      // Reset button spinner
      setIsAddButtonSpinning(false);
    });
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "modal-form-entity-name",
      name: "Entity name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-entity-name"
          id="modal-form-entity-name"
          name="cn"
          value={entityName}
          onChange={setEntityName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-description",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-description"
          id="modal-form-description"
          name="description"
          value={description}
          aria-label="Description"
          onChange={(_event, value: string) => setDescription(value)}
          autoResize
        />
      ),
    },
  ];

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={isAddButtonSpinning || entityName === ""}
      form="add-modal-form"
      type="submit"
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="add-entity-modal"
        variantType={"small"}
        modalPosition={"top"}
        offPosition={"76px"}
        title={props.title}
        formId="add-modal-form"
        fields={fields}
        show={props.isOpen}
        onSubmit={() => onAdd()}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
    </>
  );
};

export default AddEntityModal;
```

## Code Organization

The Add modal follows this structure:

1. **Imports** — PatternFly components, layout components, RPC hooks, Redux, alerts
2. **Props interface** — Standard `PropsToAddModal` with four required props
3. **Component body:**
   - API mutation hook
   - State declarations (spinner, form fields)
   - `clearFields()` — resets all form fields
   - `onAdd()` — the add handler (API call, success/error alerts, refresh, close)
   - `cleanAndCloseModal()` — clears fields and closes modal
   - `fields` array — form field definitions
   - `modalActions` array — Add and Cancel buttons
4. **Return** — `ModalWithFormLayout` component

## Error Handling

Use **alerts** for error handling — do not use a separate `ErrorModal` component. When an error occurs:

1. Dispatch a danger alert with the error message
2. Reset the button spinner
3. Keep the modal open so the user can retry or cancel

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

When specifying **Add modal fields** in your prompt, provide each field as:

```
<ipa_attribute> → "<Label>" (<data_type>, <ui_component>, required|optional)
```

## Available UI Components

| UI component | Import from | Data type | Use when |
|-------------|-------------|-----------|----------|
| `InputRequiredText` | `src/components/layouts/InputRequiredText` | `string` | Required single-line text (shows validation helper text). Use for the primary key and other mandatory string fields |
| `TextInput` | `@patternfly/react-core` | `string` | Optional or secondary single-line text input |
| `TextArea` | `@patternfly/react-core` | `string` | Multi-line text (e.g. description fields). Use `autoResize` prop |
| `Checkbox` | `@patternfly/react-core` | `boolean` | Boolean flags (e.g. "Force", "Generate OTP") |
| `Radio` | `@patternfly/react-core` | `string` | One-of-N choice from a small fixed set (e.g. authentication method, algorithm) |
| `Select` + `SelectList` + `SelectOption` | `@patternfly/react-core` | `string` | Dropdown selection from a list of options |
| `NumberSelector` | `src/components/Form/NumberInput` | `number` | Numeric input with increment/decrement (e.g. base ID, range size, priority) |
| `PasswordInput` | `src/components/layouts/PasswordInput` | `string` | Password/secret fields with show/hide toggle |
| `SimpleSelector` | `src/components/Form/SimpleSelector` | `string` | Simple dropdown selection (e.g. group picker) |
| `InputWithValidation` | `src/components/layouts/InputWithValidation` | `string` | Text input with inline validation rules. Use when a field needs real-time format validation (e.g. allowed characters, valid IP address) |

## Field Validation with `InputWithValidation`

`InputWithValidation` is a text input that evaluates one or more validation rules as the user types and renders inline helper text showing pass/fail state for each rule. Use it instead of `TextInput` or `InputRequiredText` when the field has format constraints that should be validated before submission.

**Usage in a modal field:**

```tsx
{
  id: "modal-form-host-name",
  name: "Host name",
  pfComponent: (
    <InputWithValidation
      dataCy="modal-textbox-host-name"
      id="modal-form-host-name"
      name="modal-form-host-name"
      value={hostName}
      onChange={setHostName}
      isRequired
      rules={[
        {
          id: "valid-chars",
          message: "Allowed characters are a-z, A-Z, 0-9, and -",
          validate: (value: string) => /^[a-zA-Z0-9-]+$/.test(value),
        },
      ]}
    />
  ),
  fieldRequired: true,
}
```

Multiple rules can be specified — each renders its own helper text line:

```tsx
rules={[
  {
    id: "ruleCharacters",
    message: "Only alphanumeric and special characters _-.$",
    validate: (v: string) =>
      /^[a-zA-Z]/.test(v.charAt(0)) && /^[a-zA-Z0-9._-]+$/.test(v.substring(1)),
  },
  {
    id: "ruleLength",
    message: "Must be at most 32 characters",
    validate: (v: string) => v.length <= 32,
  },
]}
```

When specifying fields in your prompt, indicate validation with the `InputWithValidation` component and describe the constraint:

```
<ipa_attribute> → "<Label>" (string, InputWithValidation, required, validation: "a-z, A-Z, 0-9, and -")
```

**Existing examples:**

| Entity | Field | Validation |
|--------|-------|-----------|
| Hosts (`AddHost.tsx`) | Host name | Allowed characters: `a-z, A-Z, 0-9, -` |
| Hosts (`AddHost.tsx`) | IP address | Must be a valid IPv4 or IPv6 address |
| Users (`AddUser.tsx`) | User login | Only alphanumeric and `_-.$`, first char must be a letter |
| Users (`AddUser.tsx`) | First/Last name | No special characters or spaces |

## Field Template

```tsx
const fields = [
  {
    id: "modal-form-<field-name>",
    name: "<Label>",
    pfComponent: (
      <InputRequiredText                          // or TextInput, TextArea, Checkbox, etc.
        dataCy="modal-textbox-<field-name>"
        id="modal-form-<field-name>"
        name="modal-form-<field-name>"
        value={fieldState}
        onChange={setFieldState}
        requiredHelperText="Required value"       // only for InputRequiredText
      />
    ),
    fieldRequired: true,                          // omit for optional fields
  },
  // ...more fields
];
```

## Naming Conventions

All naming follows kebab-case formatting for attributes and camelCase for JavaScript variables.

### General Pattern

```
modal-{component-type}-{field-name}
```

### Element IDs (`id`)

Form field IDs use the `modal-form-` prefix:

```
modal-form-{field-name}
```

Examples:

```
modal-form-user-login
modal-form-description
modal-form-first-name
modal-form-ip-address
```

### Test Attributes (`data-cy` / `dataCy`)

Test attributes indicate the component type after the `modal-` prefix:

| Component Type | Pattern | Example |
|----------------|---------|---------|
| Text input | `modal-textbox-{field-name}` | `modal-textbox-user-login` |
| Text area | `modal-textbox-{field-name}` | `modal-textbox-description` |
| Checkbox | `modal-checkbox-{field-name}` | `modal-checkbox-force` |
| Radio button | `modal-radio-{field-name}` | `modal-radio-auth-method` |
| Select/Dropdown | `modal-select-{field-name}` | `modal-select-group` |
| Number input | `modal-number-{field-name}` | `modal-number-base-id` |
| Password input | `modal-textbox-{field-name}` | `modal-textbox-password` |

### State Variables

Use one `useState` per field, named in camelCase after the field:

```tsx
const [userLogin, setUserLogin] = useState("");
const [description, setDescription] = useState("");
const [firstName, setFirstName] = useState("");
const [generateOtp, setGenerateOtp] = useState(false);
```

### Handler Functions

Handler functions follow the `on{Action}` pattern:

```tsx
const onAdd = () => { /* ... */ };
const cleanAndCloseModal = () => { /* ... */ };
```

### Best Practices

1. **Consistency**: Always use kebab-case for `id` and `data-cy` attributes
2. **Uniqueness**: Each `data-cy` value must be unique within the modal
3. **Descriptive**: Use clear names that indicate the field's purpose
4. **Match IPA attributes**: When possible, derive field names from the IPA attribute (e.g., `ipatokenowner` → `modal-form-owner`)

## Modal Action Buttons

The Add modal must only have two action buttons: **Add** and **Cancel**. Do **not** include an "Add and add another" button.

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
    onClick={cleanAndCloseModal}
  >
    Cancel
  </Button>,
];
```

## Button Disabled Logic

The Add button should be disabled until all **required** fields are non-empty. Compute the disabled state inline or as a derived variable — do not use `useEffect` + `useState` for this.

**Inline (preferred for simple conditions):**

```tsx
<Button
  isDisabled={isAddButtonSpinning || requiredField === ""}
  // ...
>
```

**Derived variable (for complex conditions):**

```tsx
const mandatoryEmpty =
  requiredField1 === "" ||
  requiredField2 === "" ||
  (someCondition && requiredField3 === "");

const disabledAdd = isAddButtonSpinning || mandatoryEmpty;

// In modalActions:
<Button isDisabled={disabledAdd}>
```

## Existing Add Modal Examples

**Reference implementations** (follow these patterns):

| Entity | Modal file | Notes |
|--------|-----------|-------|
| Certificate Mapping Rules | `src/components/modals/CertificateMapping/AddRuleModal.tsx` | Clean pattern with alerts for errors |
| DNS Zones | `src/components/modals/DnsZones/AddDnsZoneModal.tsx` | Uses custom Modal (not ModalWithFormLayout) |
| DNS Forward Zones | `src/components/modals/DnsZones/AddDnsForwardZoneModal.tsx` | Uses custom Modal with radio-based field switching |
| Roles | `src/components/modals/RoleModals/AddRoleModal.tsx` | Simple two-field modal with InputRequiredText |

**Other examples:**

| Entity | Modal file | Fields |
|--------|-----------|--------|
| HBAC Rules | `src/components/modals/HbacModals/AddHBACRule.tsx` | Rule name (InputRequiredText, required), Description (TextArea, optional) |
| Hosts | `src/components/modals/HostModals/AddHost.tsx` | Host name (InputWithValidation, required), Description (TextInput), Class (TextInput), IP Address (InputWithValidation), Force (Checkbox), Generate OTP (Checkbox) |
| Trusts | `src/pages/Trusts/AddTrustModal.tsx` | Domain name (TextInput, required), Two-way (Checkbox), External (Checkbox), Auth method (Radio), Admin account (TextInput), Passwords (PasswordInput), Range type (Radio), Base ID (NumberSelector), Range size (NumberSelector) |
| Users | `src/components/modals/UserModals/AddUser.tsx` | User login (InputRequiredText, required), First name (InputRequiredText, required), Last name (InputRequiredText, required), Class (TextInput), No private group (Checkbox), GID (TypeAheadSelectWithCreate), New password (PasswordInput), Verify password (PasswordInput) |
