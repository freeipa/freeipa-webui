# Sub-Pages — Component Catalog

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Tab](04-settings-tab.md) | [Settings Patterns](12-settings-patterns.md)

A comprehensive reference of all reusable components available for building Settings pages and other sub-page tabs.

## Catalog Files

| File | Contents |
|------|----------|
| [16a-component-catalog-inputs.md](16a-component-catalog-inputs.md) | Basic inputs, selection components (text, number, checkbox, select, toggle) |
| [16b-component-catalog-lists.md](16b-component-catalog-lists.md) | List components, specialized components, selection guide |
| [16c-component-catalog-layouts.md](16c-component-catalog-layouts.md) | Layout components (TabLayout, SidebarLayout, KebabLayout, etc.) |

## Quick Reference

| Category | Components |
|----------|------------|
| **Form Inputs** | `IpaTextInput`, `IpaTextArea`, `IpaPasswordInput`, `IpaNumberInput`, `IpaCheckbox`, `IpaCheckboxes`, `IpaSelect`, `IpaCalendar`, `IpaToggleGroup`, `IpaDropdownSearch` |
| **Lists & Collections** | `IpaTextboxList`, `IpaTextInputFromList`, `IpaSshPublicKeys`, `IpaCertificates`, `IpaCertificateMappingData`, `PrincipalAliasMultiTextBox` |
| **Specialized** | `IpaTextContent`, `IpaPACType`, `IpaForwardPolicy`, `DateTimeSelector` |
| **Layout** | `TabLayout`, `SidebarLayout`, `TitleLayout`, `KebabLayout`, `HelpTextWithIconLayout`, `SettingsTableLayout` |

## Component Selection Guide

| Need | Use |
|------|-----|
| Simple text field | `IpaTextInput` |
| Long text/description | `IpaTextArea` |
| Password field | `IpaPasswordInput` |
| Number with constraints | `IpaNumberInput` |
| Yes/No option | `IpaCheckbox` |
| Multiple options (checkboxes) | `IpaCheckboxes` |
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

## Reference Files

| Component Type | Example Implementation |
|----------------|------------------------|
| Basic form | `src/pages/HostGroups/HostGroupsSettings.tsx` |
| Two-column form | `src/pages/OtpTokens/OtpTokensSettings.tsx` |
| Category toggle sections | `src/pages/SELinuxUserMaps/SELinuxUserMapsSettings.tsx` |
| Complex with all features | `src/pages/SudoRules/SudoRulesSettings.tsx` |
| User settings (certs, SSH) | `src/components/UsersSections/UserSettings.tsx` |
