# Sub-Pages — Troubleshooting

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Best Practices](00-best-practices.md) | [Data Hook](03-data-hook.md) | [Checklist](08-checklist.md)

Common issues when creating sub-pages and their solutions. Issues are organized by category.

## Troubleshooting Guides

| File | Contents |
|------|----------|
| [13a-troubleshooting-forms.md](13a-troubleshooting-forms.md) | Form fields not editable, metadata errors, table data handling |
| [13b-troubleshooting-api.md](13b-troubleshooting-api.md) | API response handling, member operations, unknown option errors |
| [13c-troubleshooting-save-revert.md](13c-troubleshooting-save-revert.md) | Save/Revert buttons stay enabled after saving |

## Quick Reference

| Symptom | Guide | Section |
|---------|-------|---------|
| Form fields not editable | [13a](13a-troubleshooting-forms.md) | Form Fields Not Editable |
| Save button always disabled | [13a](13a-troubleshooting-forms.md) | Form Fields Not Editable |
| Metadata errors in console | [13a](13a-troubleshooting-forms.md) | Metadata Errors |
| Table data not displaying correctly | [13a](13a-troubleshooting-forms.md) | Table Data Handling |
| Member add/remove not working | [13b](13b-troubleshooting-api.md) | API Response Handling |
| "Unknown option" API error | [13b](13b-troubleshooting-api.md) | Unknown option error |
| Save/Revert buttons stay enabled | [13c](13c-troubleshooting-save-revert.md) | Full guide |

## Common Root Causes

### Data Transformation Issues
- API returns arrays, UI expects strings → Use `apiTo<Entity>` conversion
- Field not in `simpleValues` set → Add to utils file

### API Structure Issues
- Member fields sent to `*_mod` endpoint → Filter out member fields
- Wrong error location checked → Error is at top level, not in result

### State Management Issues
- `originalEntity` not synced after save → Update in `resetValues`
- Race condition in useEffect → Don't update entity state in onSave

## Post-Generation Quality Checks

See [00-best-practices.md](00-best-practices.md#post-generation-quality-checks) for the required validation commands.

Fix all errors before committing.
