# Sub-Pages — Best Practices

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Checklist](08-checklist.md) | [Common Issues](08a-common-issues.md)

This document consolidates essential practices for creating sub-pages. **Read this before starting any new sub-page implementation.**

---

## The Golden Rule

> **When in doubt, ASK.** It is always better to ask one extra question than to deliver an incomplete component.

---

## Anti-Patterns: Things to NEVER Do

### Silent Decisions

**NEVER** make silent decisions when information is missing:

| Anti-Pattern | Why It's Wrong |
|--------------|----------------|
| "I'll disable the Add button because I don't know the API" | User expects working functionality |
| "I'll leave the delete handler empty for now" | Creates incomplete, broken component |
| "I'll skip the modal implementation" | User cannot add/remove items |

```tsx
// ❌ UNACCEPTABLE: Buttons disabled without asking
addButtonEnabled={false}
onAddButtonClick={() => {}}  // Empty handler!

// ❌ UNACCEPTABLE: Creating read-only component when Add/Delete is expected
// Agent decided not to implement functionality instead of asking questions
```

### Code Quality Anti-Patterns

| Anti-Pattern | Correct Approach |
|--------------|------------------|
| Comparing booleans directly | `convertApiObj` converts booleans to strings |
| Assuming API returns strings | API often returns single values as arrays |
| Skipping validation commands | Always run full validation before committing |

---

## Required Practices: Things to ALWAYS Do

### 1. Ask for Missing Information

**STOP** before creating a component if you don't have:

| Missing Info | Question to Ask |
|--------------|-----------------|
| API for Add modal | "What API lists available items to add? (e.g., `user_find`, `service_find`)" |
| Entity type for mutations | "What `entityType` should I use for `_add_member`/`_remove_member`? (e.g., `user`, `host`)" |
| Table columns | "What columns should the table display?" |
| Add modal pattern | "Should I use a searchable list (DualListSelector) or text input for adding items?" |
| Read-only confirmation | "Should Add/Delete functionality be disabled for this tab? (If yes, I'll make it read-only)" |

### 2. Follow File Creation Order

> ⚠️ **CREATION ORDER MATTERS:** Files must be created in this exact order:
> 1. `use<Entity>SettingsData.tsx` — Data hook (provides data to Tabs)
> 2. `<Entity>Tabs.tsx` — Tabs component (entry point, renders Settings)
> 3. `<Entity>Settings.tsx` — Settings form (child of Tabs)
>
> **The Settings component CANNOT exist without the Tabs component.**

### 3. Enable Main Page Navigation

> ⚠️ **FREQUENTLY FORGOTTEN:** Set `showLink={true}` in the main page's MainTable:

```tsx
<MainTable showLink={true} pathname="<parent-pathname>" />
```

Without this, table rows are not clickable and users cannot navigate to the sub-page.

### 4. Add Documentation Links Entry

> ⚠️ **MANDATORY:** Add entry in `documentation-links.json` for `<entity>-settings` key:

```json
{ "entity-settings": [] }
```

Missing entries cause **runtime crashes**. Always add the entry, even as an empty array.

### 5. Register Types in MembershipTable

When creating membership tabs using `MembershipTable`:

1. Add `from` value to `FromTypes` union
2. If data is object array: import and add to `EntryDataTypes`
3. If data is string array: add to `STRING_ARRAY_TYPES`

Failing to register types causes TypeScript errors that may surface later.

### 6. Reset UI Flags in `.finally()`, Not Inside `.then()`

When an async command (add, delete, enable, disable, save, etc.) sets a UI flag like `setSpinning(true)` or `setBtnSpinning(true)` before the API call, the reset (`setSpinning(false)`) **must** go in a `.finally()` block — **not** at the end of `.then()`.

This guarantees the flag is reset even when the promise rejects with a network error or an unhandled exception, preventing the UI from staying in a stuck/spinning state.

```tsx
// ✅ Correct — flag resets regardless of outcome:
const onAdd = () => {
  setSpinning(true);
  addEntity(payload)
    .then((response) => {
      // handle success / error from response…
    })
    .finally(() => {
      setSpinning(false);
    });
};

// ❌ Wrong — if the promise rejects, setSpinning(false) never runs:
const onAdd = () => {
  setSpinning(true);
  addEntity(payload).then((response) => {
    // handle success / error…
    setSpinning(false);
  });
};
```

This rule applies to **every** command operation: add modals, delete modals, enable/disable modals, save handlers, and any other async action that toggles a loading/spinner flag.

### 7. Use Absolute Imports

```tsx
// ✅ Correct:
import OtpTokensManagedBy from "src/pages/OtpTokens/OtpTokensManagedBy";

// ❌ Wrong:
import OtpTokensManagedBy from "./OtpTokensManagedBy";
```

---

## Post-Generation Quality Checks

**Always run these checks in order** after generating a sub-page:

```bash
npm run prettier:fix   # Fix formatting
npm run knip           # Check unused exports
npm run lint           # Fix errors (warnings ok)
npm run build          # Catch TypeScript errors
```

**Quick combined check:**
```bash
npm run prettier:fix && npm run knip && npm run lint && npm run build
```

Fix **all errors** before committing.

---

## Critical Warnings Summary

| Warning | Consequence if Ignored |
|---------|------------------------|
| Missing `showLink={true}` | Users cannot navigate to sub-page |
| Missing `documentation-links.json` entry | Runtime crash |
| Unregistered types in `MembershipTable` | TypeScript errors (may appear later) |
| Disabled buttons without user approval | Incomplete, unusable component |
| Spinner/flag reset inside `.then()` instead of `.finally()` | UI stuck in spinning state on network error or rejection |
| Skipping validation commands | Build failures in CI |

---

## Quick Reference Checklist

Before committing any new sub-page:

- [ ] **Asked user** for any missing information
- [ ] **Created files in correct order** (hook → tabs → settings)
- [ ] **Set `showLink={true}`** in main page
- [ ] **Added documentation-links.json entry** (even if empty array)
- [ ] **Registered types** if using MembershipTable
- [ ] **Reset UI flags in `.finally()`** (spinner, button state — never inside `.then()`)
- [ ] **Used absolute imports** (starting with `src/`)
- [ ] **Ran validation commands** and fixed all errors

---

## Communication is Key

**ALWAYS** communicate and get user input. It is better to:

- Ask one extra question than deliver broken functionality
- Confirm assumptions than make silent decisions
- Request clarification than guess wrong

**See also:**
- [06c-membership-creating-new.md](06c-membership-creating-new.md) — Detailed questions for new membership components
- [08-checklist.md](08-checklist.md) — Complete validation checklist
- [08a-common-issues.md](08a-common-issues.md) — Solutions to common implementation issues
