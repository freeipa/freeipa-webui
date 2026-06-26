# Sub-Pages — Component Catalog: List & Specialized Components

> **Part of:** [Component Catalog](16-component-catalog.md)
> **See also:** [Input Components](16a-component-catalog-inputs.md) | [Layout Components](16c-component-catalog-layouts.md)

## List & Collection Components

### IpaTextboxList

Dynamic list of text inputs with Add/Delete functionality.

**Additional Props:**
| Prop | Type | Description |
|------|------|-------------|
| `validator?` | `(value: string) => boolean` | Validation function |

**Use case:** Managing lists of values like email addresses or DNS names.

### IpaTextInputFromList

Text input that validates against a predefined list.

### IpaSshPublicKeys

Complete SSH public key management with Add/Show/Delete modals.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `dataCy` | `string` | Test identifier |
| `ipaObject` | `Record<string, unknown>` | Current entity data |
| `onChange` | `(obj: Record<string, unknown>) => void` | Update handler |
| `metadata` | `Metadata` | Field metadata |
| `onRefresh` | `() => void` | Refresh callback |
| `from` | `"active-users" \| "stage-users" \| "preserved-users" \| "hosts"` | Source entity type |

### IpaCertificates

Complete certificate management with View/Get/Download/Revoke/Delete actions.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `dataCy` | `string` | Test identifier |
| `ipaObject` | `Record<string, unknown>` | Current entity data |
| `onChange` | `(obj: Record<string, unknown>) => void` | Update handler |
| `metadata` | `Metadata` | Field metadata |
| `certificates?` | `Certificate[]` | Certificate details from API |
| `objectType` | `"user" \| "host" \| "service"` | Entity type |
| `onRefresh` | `() => void` | Refresh callback |

### IpaCertificateMappingData

Certificate mapping data management.

### PrincipalAliasMultiTextBox

Kerberos principal alias management.

---

## Specialized Components

### IpaPACType

PAC type selection for Kerberos tickets.

### IpaForwardPolicy

DNS forward policy selection.

---

## Component Selection Guide

| Need | Use |
|------|-----|
| Simple text field | `IpaTextInput` |
| Long text/description | `IpaTextArea` |
| Password field | `IpaPasswordInput` |
| Number with constraints | `IpaNumberInput` |
| Yes/No option | `IpaCheckbox` |
| Multiple options (checkboxes) | `IpaCheckboxes` |
| Multiple options with filter | `IpaCheckboxListWithFilter` |
| Single selection from list | `IpaSelect` |
| Toggle between two options | `IpaToggleGroup` |
| Selection with search | `IpaDropdownSearch` |
| Date selection | `IpaCalendar` |
| Date + time selection | `DateTimeSelector` |
| Dynamic list of values | `IpaTextboxList` |
| SSH keys management | `IpaSshPublicKeys` |
| Certificate management | `IpaCertificates` |
| Read-only display | `IpaTextContent` |

---

## Reference Files

| Component Type | Example Implementation |
|----------------|------------------------|
| Basic form | `src/pages/HostGroups/HostGroupsSettings.tsx` |
| Two-column form | `src/pages/OtpTokens/OtpTokensSettings.tsx` |
| Category toggle sections | `src/pages/SELinuxUserMaps/SELinuxUserMapsSettings.tsx` |
| Complex with all features | `src/pages/SudoRules/SudoRulesSettings.tsx` |
| User settings (certificates, SSH keys) | `src/components/UsersSections/UserSettings.tsx` |
