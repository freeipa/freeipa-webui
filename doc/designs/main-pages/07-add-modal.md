# Main Pages — Add Modal Field Types & Templates

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Checklist & Modal Naming](06-checklist-and-types.md) | [Delete Modal & Entity Utils](08-delete-modal-and-utils.md)

The Add modal (`src/components/modals/<EntityModals>/Add<Entity>Modal.tsx`) is built using `ModalWithFormLayout`, which accepts a `fields` array. Each field specifies an `id`, a `name` (label), a `pfComponent` (the PatternFly/custom UI component), and optionally `fieldRequired: true`.

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

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `dataCy` | `string` | Cypress test attribute |
| `id` | `string` | HTML id (should match the field's `id` in the `fields` array) |
| `name` | `string` | HTML name attribute |
| `value` | `string` | Controlled value |
| `onChange` | `(value: string) => void` | State setter (receives the new value directly, not the event) |
| `isRequired` | `boolean?` | Marks the input as required |
| `isDisabled` | `boolean?` | Disables the input and hides validation messages |
| `rules` | `Array<RuleProps>` | Validation rules (see below) |
| `showAlways` | `boolean?` | If `true`, show helper text even when the value is empty (default: hidden until the user types) |
| `type` | `TextInputProps["type"]?` | HTML input type (defaults to `"text"`) |

Each rule in the `rules` array has this shape (exported as `RuleProps`):

```tsx
{
  id: string;           // unique key for the rule (e.g. "valid-chars", "ruleIp")
  message: string;      // text shown to the user (e.g. "Must be a valid IPv4 or IPv6 address")
  validate: (value: string) => boolean;  // returns true if the value passes
}
```

The component renders each rule as a helper text item with three possible states:
- **indeterminate** — value is empty (no visual pass/fail indicator)
- **success** — `validate(value)` returned `true`
- **error** — `validate(value)` returned `false`

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

- `id`: `"modal-form-<field-name>"` (kebab-case)
- `data-cy` / `dataCy`: `"modal-textbox-<field-name>"` for text inputs, `"modal-checkbox-<field-name>"` for checkboxes, etc.
- State variables: one `useState` per field, named after the field (e.g. `const [description, setDescription] = useState("")`)

## Modal Action Buttons

The Add modal must only have two action buttons: **Add** and **Cancel**. Do **not** include an "Add and add another" button.

```tsx
const modalActions: JSX.Element[] = [
  <Button
    data-cy="modal-button-add"
    key="add-new-<entity>"
    isDisabled={buttonDisabled}
    onClick={onAdd}
  >
    Add
  </Button>,
  <Button
    data-cy="modal-button-cancel"
    key="cancel-new-<entity>"
    variant="link"
    onClick={cleanAndCloseModal}
  >
    Cancel
  </Button>,
];
```

## Button Disabled Logic

The Add button should be disabled until all **required** fields are non-empty:

```tsx
const [buttonDisabled, setButtonDisabled] = useState(true);

useEffect(() => {
  if (requiredField1 === "" || requiredField2 === "") {
    setButtonDisabled(true);
  } else {
    setButtonDisabled(false);
  }
}, [requiredField1, requiredField2]);
```

## Existing Add Modal Examples

| Entity | Modal file | Fields |
|--------|-----------|--------|
| HBAC Rules | `src/components/modals/HbacModals/AddHBACRule.tsx` | Rule name (InputRequiredText, required), Description (TextArea, optional) |
| Hosts | `src/components/modals/HostModals/AddHost.tsx` | Host name (InputWithValidation, required), Description (TextInput), Class (TextInput), IP Address (InputWithValidation), Force (Checkbox), Generate OTP (Checkbox) |
| Trusts | `src/pages/Trusts/AddTrustModal.tsx` | Domain name (TextInput, required), Two-way (Checkbox), External (Checkbox), Auth method (Radio), Admin account (TextInput), Passwords (PasswordInput), Range type (Radio), Base ID (NumberSelector), Range size (NumberSelector) |
| Users | `src/components/modals/UserModals/AddUser.tsx` | User login (InputRequiredText, required), First name (InputRequiredText, required), Last name (InputRequiredText, required), Class (TextInput), No private group (Checkbox), GID (TypeAheadSelectWithCreate), New password (PasswordInput), Verify password (PasswordInput) |
