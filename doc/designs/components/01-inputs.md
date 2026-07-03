# Component Catalog — Input Components

> **Part of:** [Component Catalog](00-overview.md)
> **See also:** [List Components](02-lists.md) | [Layout Components](03-layouts.md)

All form components are in `src/components/Form/` and follow the **IPAParamDefinition pattern**:
- Receive `ipaObject`, `onChange`, `metadata`, `objectName`, and `name` props
- Automatically determine read-only state from metadata
- Handle value conversion and updates consistently

## Basic Input Components

### IpaTextInput

Single-line text input with automatic validation and read-only handling.

**Import:** `import IpaTextInput from "src/components/Form/IpaTextInput"`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `dataCy` | `string` | Test identifier |
| `name` | `string` | Field name (matches IPA attribute) |
| `ipaObject` | `Record<string, unknown>` | Current entity data |
| `onChange` | `(obj: Record<string, unknown>) => void` | Update handler |
| `metadata` | `Metadata` | Field metadata from API |
| `objectName` | `string` | Entity type name |
| `rules?` | `RuleProps[]` | Validation rules |
| `helperTextMessage?` | `string` | Helper text for required fields |

```tsx
<IpaTextInput
  dataCy="entity-settings-textbox-description"
  name="description"
  ipaObject={ipaObject}
  onChange={recordOnChange}
  metadata={props.metadata}
  objectName="entityname"
/>
```

### IpaTextArea

Multi-line text input. **Props:** Same as `IpaTextInput`.

```tsx
<IpaTextArea
  dataCy="entity-settings-textarea-description"
  name="description"
  ipaObject={ipaObject}
  onChange={recordOnChange}
  metadata={props.metadata}
  objectName="entityname"
/>
```

### IpaPasswordInput

Password field with masked input. **Props:** Same as `IpaTextInput`, plus `showPasswordButton?: boolean`.

### IpaNumberInput

Numeric input with optional min/max constraints.

**Import:** `import IpaNumberInput from "src/components/Form/IpaNumberInput"`

**Additional Props:**
| Prop | Type | Description |
|------|------|-------------|
| `minValue?` | `number` | Minimum allowed value |
| `maxValue?` | `number` | Maximum allowed value |
| `numCharsShown?` | `number` | Width of input field |

```tsx
<IpaNumberInput
  dataCy="otp-settings-number-timestep"
  name="ipatokentotptimestep"
  ipaObject={ipaObject}
  onChange={recordOnChange}
  metadata={props.metadata}
  objectName="otptoken"
  minValue={5}
  maxValue={2147483647}
/>
```

### IpaTextContent

Read-only text display (not editable). Use for computed or immutable fields like unique IDs.

---

## Selection Components

### IpaCheckbox

Single boolean checkbox.

**Additional Props:**
| Prop | Type | Description |
|------|------|-------------|
| `altTrue?` | `string` | Value when checked (default: `true`) |
| `altFalse?` | `string` | Value when unchecked (default: `false`) |

```tsx
<IpaCheckbox
  dataCy="hbac-settings-checkbox-usercategory"
  name="usercategory"
  ipaObject={ipaObject}
  onChange={recordOnChange}
  metadata={props.metadata}
  objectName="hbacrule"
  altTrue="all"
  altFalse=""
/>
```

### IpaCheckboxes

Group of checkboxes for multi-select from a predefined list.

**Additional Props:** `options: { value: string; text: string }[]`

```tsx
<IpaCheckboxes
  dataCy="entity-settings-checkboxes-flags"
  name="flags"
  ipaObject={ipaObject}
  onChange={recordOnChange}
  metadata={props.metadata}
  objectName="entityname"
  options={[
    { value: "option1", text: "Enable option 1" },
    { value: "option2", text: "Enable option 2" },
  ]}
/>
```

### IpaCheckboxListWithFilter

Checkboxes with search/filter. For large lists where users need to find specific items.

**Additional Props:**
| Prop | Type | Description |
|------|------|-------------|
| `options` | `{ value: string; text: string }[]` | Checkbox options |
| `maxHeight?` | `string` | Max height (default: `"300px"`) |

**Features:** Case-insensitive filtering, three-column layout, scrollable list.

```tsx
<IpaCheckboxListWithFilter
  dataCy="auth-types-checkbox-list"
  name="ipauserauthtype"
  ipaObject={ipaObject}
  onChange={recordOnChange}
  metadata={props.metadata}
  objectName="user"
  options={[
    { value: "password", text: "Password" },
    { value: "radius", text: "RADIUS" },
    { value: "otp", text: "Two-factor authentication" },
  ]}
  maxHeight="400px"
/>
```

### IpaSelect

Dropdown selection from a list of options.

**Additional Props:**
| Prop | Type | Description |
|------|------|-------------|
| `options` | `string[]` | Available options |
| `variant?` | `"default" \| "typeahead"` | Visual variant |
| `defaultValue?` | `string` | Default selection |

**Important:** Do NOT use `variant="typeahead"` in Settings pages.

```tsx
<IpaSelect
  dataCy="entity-settings-select-type"
  name="ipatokenotptype"
  ipaObject={ipaObject}
  setIpaObject={recordOnChange}
  objectName="otptoken"
  metadata={props.metadata}
  options={["totp", "hotp"]}
/>
```

### IpaToggleGroup

Toggle between two mutually exclusive options (e.g., "Anyone" vs "Specified").

**Additional Props:**
| Prop | Type | Description |
|------|------|-------------|
| `options` | `{ label: string; value: string }[]` | Toggle options |
| `optionSelected` | `string` | Currently selected label |
| `setOptionSelected` | `(value: string) => void` | Selection handler |

```tsx
const [userOptionSelected, setUserOptionSelected] = useState("Anyone");

<IpaToggleGroup
  dataCy="selinux-toggle-user-category"
  name="usercategory"
  ipaObject={ipaObject}
  onChange={recordOnChange}
  metadata={props.metadata}
  objectName="selinuxusermap"
  options={[
    { label: "Anyone", value: "all" },
    { label: "Specified users and groups", value: "" },
  ]}
  optionSelected={userOptionSelected}
  setOptionSelected={setUserOptionSelected}
/>
```

### IpaDropdownSearch

Dropdown with search capability for large option lists.

**Additional Props:** `options: string[]`, `onSearch: (value: string) => void`, `onSelect?: (value: string) => void`

### IpaCalendar

Date picker component. **Import:** `import IpaCalendar from "src/components/Form/IpaCalendar"`

### DateTimeSelector

Combined date and time selection. **Import:** `import DateTimeSelector from "src/components/Form/DateTimeSelector"`
