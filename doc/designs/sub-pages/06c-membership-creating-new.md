# Sub-Pages — Creating New Membership Components

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Membership Tabs](06-membership-tabs.md) | [Custom Implementation](06a-membership-custom.md)

This guide covers creating **new** membership components from scratch when no existing component matches your needs.

> ⚠️ **IMPORTANT:** Before creating a new component, verify that no existing component in `src/components/MemberOf/`, `src/components/Members/`, `src/components/MemberManagers/`, or `src/components/ManagedBy/` matches your needs. See [06-membership-tabs.md](06-membership-tabs.md) for the list of existing components.

## When to Create a New Component

Create a new component when:
1. A prompt specifies a component that doesn't exist
2. No similar component exists that can be reused
3. The entity type or membership relationship is not covered by existing components

---

## CRITICAL: Never Leave Functionality Incomplete

> 🛑 **HARD RULE:** When the prompt does not contain enough information to fully implement Add/Delete functionality, you **MUST ASK** for clarification. **NEVER** disable buttons or leave handlers empty without explicit user approval.

### What "Complete" Means

A membership component is **complete** when it has:

| Feature | Implementation |
|---------|---------------|
| ✅ Add button | **Enabled**, opens a working modal |
| ✅ Add modal | Fetches available items OR provides text input |
| ✅ Add action | Calls the correct API mutation |
| ✅ Delete button | **Enabled** when items are selected |
| ✅ Delete modal | Shows confirmation with selected items |
| ✅ Delete action | Calls the correct API mutation |
| ✅ Success/error alerts | Displayed after operations |

### What Is NOT Acceptable

```tsx
// ❌ UNACCEPTABLE: Buttons disabled without asking
addButtonEnabled={false}
onAddButtonClick={() => {}}  // Empty handler!

// ❌ UNACCEPTABLE: Creating read-only component when Add/Delete is expected
// Agent decided not to implement functionality instead of asking questions
```

### What To Do Instead

If you don't have enough information:

1. **STOP** before creating the component
2. **ASK** the user for the missing information (see questions below)
3. **WAIT** for the answer before implementing
4. If user explicitly wants read-only: get confirmation ("Should I disable Add/Delete for now?")

---

## Required Questions to Ask

Before creating any new membership component, you **MUST** ask the user for required information. The questions depend on whether you're creating a **Standard Membership Tab** or an **Independent Sub-Page**.

### How to Determine the Type

| If the prompt mentions... | It's likely... |
|---------------------------|----------------|
| `member_*`, `memberof_*`, `managedby_*`, or `manager_*` fields | **Standard Membership Tab** |
| Uses `<parent>_add_member` / `<parent>_remove_member` | **Standard Membership Tab** |
| Uses entity-specific API like `role_add_privilege`, `dnsrecord_add` | **Independent Sub-Page** |
| Data from `<entity>_show` with specific field (not member_*) | **Independent Sub-Page** |

---

## Scenario A: Standard Membership Tab

Standard membership tabs use `<entity>_add_member` / `<entity>_remove_member` APIs with an `entityType` parameter.

### Required Questions

| # | Question | Purpose | Example Answer |
|---|----------|---------|----------------|
| **1** | Data source field | Which `member_*` or `memberof_*` field contains the data? | `member_sysaccount` |
| **2** | API for available items (Add modal) | What API lists available items to add? | `sysaccount_find` |
| **3** | Item identifier field | Which field from the API response identifies each item? | `uid` |
| **4** | Table column names | What columns should display? | `["System account"]` |
| **5** | Entity type for mutations | What `entityType` value for `_add_member`/`_remove_member`? | `sysaccount` |
| **6** | Direct/Indirect support | Support membership direction toggle? | No |
| **7** | Add modal UI pattern | DualListSelector (standard) or alternative? | DualListSelector |

### Example Question

> "To create the 'System accounts' Members tab, I need:
> 1. Which field contains the data? (e.g., `member_sysaccount`)
> 2. What API fetches available system accounts? (e.g., `sysaccount_find`)
> 3. Which field identifies each item? (e.g., `uid`)
> 4. What columns should display?
> 5. What `entityType` for add/remove?
> 6. Should the Direct/Indirect toggle be shown?
> 7. Use standard DualListSelector for Add modal?"

---

## Scenario B: Independent Sub-Page

Independent sub-pages use entity-specific APIs (not generic `_add_member`/`_remove_member`).

### Required Questions

| # | Question | Purpose | Example Answer |
|---|----------|---------|----------------|
| **1** | Data source (API + field) | Where does table data come from? | `role_show` with `all: true`, field `memberof_privilege` |
| **2** | API for available items | What API lists available items? | `privilege_find` |
| **3** | Item identifier field | Which field identifies each item? | `cn` |
| **4** | Table column names | What columns should display? | `["Privilege name"]` |
| **5** | API call for Add operation | What method adds items? | `role_add_privilege` |
| **6** | API call for Delete operation | What method removes items? | `role_remove_privilege` |
| **7** | Add modal UI pattern | DualListSelector or alternative? | DualListSelector |

### Example Question

> "To create the 'Privileges' page for Roles, I need:
> 1. Where does the data come from?
> 2. What API fetches available privileges?
> 3. Which field identifies each privilege?
> 4. What columns should display?
> 5. What API adds privileges?
> 6. What API removes privileges?
> 7. Use standard DualListSelector for Add modal?"

---

## If the User Doesn't Know Technical Details

Guide them with simpler questions:

| Instead of... | Ask this... |
|---------------|-------------|
| "What API call fetches items?" | "What type of entity does this tab manage?" |
| "What field identifies each item?" | "How is each item uniquely identified?" (username, hostname) |
| "What entityType for add/remove?" | "What is the member attribute name?" (e.g., `member_sysaccount` → `sysaccount`) |

### How to Find API Information

1. **Check FreeIPA API docs:** https://freeipa.readthedocs.io/en/latest/api/
2. **Use browser DevTools** on the old FreeIPA Web UI
3. **Check similar implementations** in `src/services/rpc*.ts`

---

## Default Assumptions (Ask for Confirmation)

If the user cannot provide specifics, propose defaults:

### Standard Membership Tab Defaults

```
- Data source: member_<entityType> field
- API method: <entity>_find with no_members: true
- Item identifier: uid or cn (first element if array)
- Table columns: Single column with identifier
- Add/Remove: <parent>_add_member / <parent>_remove_member
- Direct/Indirect: Hidden (membershipDisabled={true})
- UI pattern: Standard DualListSelector
```

### Independent Sub-Page Defaults

```
- Data source: Specific field from <parent>_show (may need all: true)
- API method: <related>_find with no_members: true
- Item identifier: cn (first element if array)
- Table columns: Single column with item name
- Add: <parent>_add_<relation>
- Remove: <parent>_remove_<relation>
- UI pattern: Standard DualListSelector
```

---

## Component Creation Checklist

After gathering information, the component MUST include:

| Required Feature | Description |
|------------------|-------------|
| **Toolbar** | `MemberOfToolbar` with search, pagination, Add/Delete buttons |
| **Table** | `MemberTable` displaying the member list |
| **Pagination** | Bottom pagination component |
| **Add button** | Enabled, opens add modal |
| **Add modal** | `MemberOfAddModal` with `DualListSelectorGeneric` |
| **Delete button** | Enabled when items selected |
| **Delete modal** | `MemberOfDeleteModal` for confirming removal |
| **API mutations** | Appropriate `useAdd*Mutation` and `useRemove*Mutation` |
| **Alerts** | Success/error alerts via `addAlert` |
| **Loading states** | Spinning indicator during API calls |

---

## Add Modal Pattern Selection

**Default (use without asking):** `MemberOfAddModal` + `DualListSelectorGeneric`

**Alternative patterns (ASK USER FIRST):**
- `ModalWithFormLayout` + `TextInput` — For simple text entry
- `ModalWithFormLayout` + `IpaSelect` — For single selection dropdown
- Custom modal — For complex scenarios

**Reference implementations:**
- Standard pattern: `src/components/Members/MembersUsers.tsx`
- TextInput pattern: `src/components/Members/MembersExternal.tsx`

---

## Summary: The Golden Rule

> **When in doubt, ASK.** It is always better to ask one extra question than to deliver an incomplete component.

### Quick Reference: Questions to Ask

| Missing Info | Question to Ask |
|--------------|-----------------|
| API for Add modal | "What API lists available items to add? (e.g., `user_find`, `service_find`)" |
| Entity type for mutations | "What `entityType` should I use for `_add_member`/`_remove_member`? (e.g., `user`, `host`)" |
| Table columns | "What columns should the table display?" |
| Add modal pattern | "Should I use a searchable list (DualListSelector) or text input for adding items?" |
| Read-only confirmation | "Should Add/Delete functionality be disabled for this tab? (If yes, I'll make it read-only)" |

### Anti-Pattern: Silent Decisions

**NEVER** make silent decisions like:
- "I'll disable the Add button because I don't know the API" ❌
- "I'll leave the delete handler empty for now" ❌
- "I'll skip the modal implementation" ❌

**ALWAYS** communicate and get user input.
