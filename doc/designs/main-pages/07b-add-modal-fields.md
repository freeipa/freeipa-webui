# Main Pages — Add Modal Field Types & Naming

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Add Modal Structure](07-add-modal.md) | [Delete Modal](08-delete-modal-and-utils.md)

## Specifying Fields

When specifying Add modal fields in your prompt:

```
<ipa_attribute> → "<Label>" (<data_type>, <ui_component>, required|optional)
```

## Available UI Components

| UI component | Import from | Use when |
|-------------|-------------|----------|
| `InputRequiredText` | `src/components/layouts/InputRequiredText` | Required single-line text with validation helper |
| `TextInput` | `@patternfly/react-core` | Optional single-line text |
| `TextArea` | `@patternfly/react-core` | Multi-line text (use `autoResize`) |
| `Checkbox` | `@patternfly/react-core` | Boolean flags |
| `Radio` | `@patternfly/react-core` | One-of-N choice |
| `Select` + `SelectList` + `SelectOption` | `@patternfly/react-core` | Dropdown selection |
| `NumberSelector` | `src/components/Form/NumberInput` | Numeric with increment/decrement |
| `PasswordInput` | `src/components/layouts/PasswordInput` | Password with show/hide |
| `SimpleSelector` | `src/components/Form/SimpleSelector` | Simple dropdown |
| `InputWithValidation` | `src/components/layouts/InputWithValidation` | Text with inline validation rules |

## Field Validation with `InputWithValidation`

Use when fields have format constraints:

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

**Existing validation examples:**

| Entity | Field | Validation |
|--------|-------|-----------|
| Hosts | Host name | `a-z, A-Z, 0-9, -` |
| Hosts | IP address | Valid IPv4 or IPv6 |
| Users | User login | Alphanumeric and `_-.$`, first char must be letter |

## Naming Conventions

### Element IDs (`id`)

```
modal-form-{field-name}
```

Examples: `modal-form-user-login`, `modal-form-description`

### Test Attributes (`data-cy` / `dataCy`)

| Component Type | Pattern | Example |
|----------------|---------|---------|
| Text input | `modal-textbox-{field-name}` | `modal-textbox-user-login` |
| Text area | `modal-textbox-{field-name}` | `modal-textbox-description` |
| Checkbox | `modal-checkbox-{field-name}` | `modal-checkbox-force` |
| Radio button | `modal-radio-{field-name}` | `modal-radio-auth-method` |
| Select/Dropdown | `modal-select-{field-name}` | `modal-select-group` |
| Number input | `modal-number-{field-name}` | `modal-number-base-id` |

### State Variables

Use camelCase, one `useState` per field:

```tsx
const [userLogin, setUserLogin] = React.useState("");
const [description, setDescription] = React.useState("");
const [generateOtp, setGenerateOtp] = React.useState(false);
```

### Handler Functions

Use `on{Action}` pattern:

```tsx
const onAdd = () => { /* ... */ };
const cleanAndCloseModal = () => { /* ... */ };
```

## Field Template

```tsx
const fields: Field[] = [
  {
    id: "modal-form-<field-name>",
    name: "<Label>",
    pfComponent: (
      <InputRequiredText
        dataCy="modal-textbox-<field-name>"
        id="modal-form-<field-name>"
        name="<ipa-attribute>"
        value={fieldState}
        onChange={setFieldState}
        requiredHelperText="Required value"
      />
    ),
    fieldRequired: true,  // omit for optional fields
  },
];
```

## Best Practices

1. **Consistency**: Use kebab-case for `id` and `data-cy` attributes
2. **Uniqueness**: Each `data-cy` value must be unique within the modal
3. **Descriptive**: Use clear names that indicate the field's purpose
4. **Match IPA attributes**: Derive field names from IPA attribute (e.g., `ipatokenowner` → `modal-form-owner`)

## Other Add Modal Examples

| Entity | Modal file | Fields |
|--------|-----------|--------|
| HBAC Rules | `src/components/modals/HbacModals/AddHBACRule.tsx` | Rule name, Description |
| Hosts | `src/components/modals/HostModals/AddHost.tsx` | Host name, Description, Class, IP, Force, OTP |
| Trusts | `src/pages/Trusts/AddTrustModal.tsx` | Domain, Auth method, Admin, Passwords, Range type |
| Users | `src/components/modals/UserModals/AddUser.tsx` | Login, First/Last name, Class, GID, Passwords |
