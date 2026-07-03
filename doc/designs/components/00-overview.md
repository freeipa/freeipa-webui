# Component Catalog

Comprehensive reference of reusable components in the FreeIPA Modern WebUI. These components are used across both [main-pages](../main-pages.md) and [sub-pages](../sub-pages.md).

## Catalog Files

| File | Contents |
|------|----------|
| [01-inputs.md](01-inputs.md) | Form inputs: text, number, checkbox, select, toggle, calendar |
| [02-lists.md](02-lists.md) | List components: text lists, SSH keys, certificates |
| [03-layouts.md](03-layouts.md) | Layout components: TabLayout, SidebarLayout, KebabLayout, modals |

## Quick Reference

| Category | Components |
|----------|------------|
| **Form Inputs** | `IpaTextInput`, `IpaTextArea`, `IpaPasswordInput`, `IpaNumberInput`, `IpaCheckbox`, `IpaCheckboxes`, `IpaCheckboxListWithFilter`, `IpaSelect`, `IpaCalendar`, `IpaToggleGroup`, `IpaDropdownSearch` |
| **Lists & Collections** | `IpaTextboxList`, `IpaTextInputFromList`, `IpaSshPublicKeys`, `IpaCertificates`, `IpaCertificateMappingData`, `PrincipalAliasMultiTextBox` |
| **Specialized** | `IpaTextContent`, `IpaPACType`, `IpaForwardPolicy`, `DateTimeSelector` |
| **Layout** | `TabLayout`, `SidebarLayout`, `TitleLayout`, `KebabLayout`, `HelpTextWithIconLayout`, `SettingsTableLayout`, `ModalWithFormLayout` |

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

## IPAParamDefinition Pattern

All form components follow this pattern:
- Receive `ipaObject`, `onChange`, `metadata`, `objectName`, and `name` props
- Automatically determine read-only state from metadata
- Handle value conversion and updates consistently

## Reference Implementations

| Component Type | Example Implementation |
|----------------|------------------------|
| Basic form | `src/pages/HostGroups/HostGroupsSettings.tsx` |
| Two-column form | `src/pages/OtpTokens/OtpTokensSettings.tsx` |
| Category toggle sections | `src/pages/SELinuxUserMaps/SELinuxUserMapsSettings.tsx` |
| Complex with all features | `src/pages/SudoRules/SudoRulesSettings.tsx` |
| User settings (certs, SSH) | `src/components/UsersSections/UserSettings.tsx` |
| Add modal | `src/components/modals/RoleModals/AddRoleModal.tsx` |
| Delete modal | `src/components/modals/RoleModals/DeleteRolesModal.tsx` |
