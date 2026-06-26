# Sub-Pages — Troubleshooting: Save/Revert Buttons

> **Part of:** [Troubleshooting](13-troubleshooting.md)
> **See also:** [Form Issues](13a-troubleshooting-forms.md) | [Data Hook](03-data-hook.md)

## Save/Revert Buttons Stay Enabled After Saving

**Symptom:** After clicking "Save", both the Save and Revert buttons stay enabled instead of becoming disabled. However, clicking "Revert" correctly disables both buttons.

**Root Cause:** Race condition between `onSave` and the `useEffect` that computes `modified`:

1. User modifies data → `entity` ≠ `originalEntity` → `modified = true`
2. User clicks Save → API call succeeds
3. ❌ `onSave` updates `entity` with response AND calls `resetValues()`
4. `resetValues()` sets `modified = false`
5. But `useEffect` detects `entity` ≠ `originalEntity` (original wasn't updated!)
6. `useEffect` sets `modified = true` again → buttons stay enabled

## Solution 1: Update `originalEntity` in `resetValues` (Recommended)

Update the data hook's `resetValues` to sync `originalEntity` with current `entity`:

```tsx
// ❌ WRONG - only sets modified to false, but useEffect recalculates it
const onResetValues = () => {
  setModified(false);
};

// ✅ CORRECT - update originalEntity to match entity
const onResetValues = () => {
  setOriginalEntity({ ...entity });
  setModified(false);
};
```

## Solution 2: Don't Update Entity State in `onSave`

Follow the pattern in `HostsSettings.tsx`:

```tsx
// ❌ WRONG - updating entity triggers useEffect
const onSave = () => {
  saveEntity(payload).then((response) => {
    if (response.data?.result) {
      props.onEntityChange(response.data.result.result);  // ← Problem!
      props.onResetValues();
    }
  });
};

// ✅ CORRECT - don't update entity state, just reset values
const onSave = () => {
  setSaving(true);
  saveEntity(payload).then((response) => {
    if ("data" in response) {
      if (response.data?.result) {
        dispatch(addAlert({ title: "Entity modified", variant: "success" }));
      } else if (response.data?.error) {
        dispatch(addAlert({ title: response.data.error.message, variant: "danger" }));
      }
      props.onResetValues();
      setSaving(false);
    }
  });
};
```

## Solution 3: Call `refetch()` After Save

If you need fresh data from the server:

```tsx
const onSave = () => {
  setSaving(true);
  saveEntity(payload).then((response) => {
    if (response.data?.result) {
      dispatch(addAlert({ title: "Entity modified", variant: "success" }));
      props.refetch();  // Fetches fresh data, updates both entity and originalEntity
    }
    setSaving(false);
  });
};
```

## Also: Disable Revert During Save

Both buttons should check `isSaving`:

```tsx
// Save button
<Button
  isDisabled={!props.isModified || isSaving}
  isLoading={isSaving}
  onClick={onSave}
>
  {isSaving ? "Saving" : "Save"}
</Button>

// Revert button - ALSO check isSaving
<Button
  isDisabled={!props.isModified || isSaving}
  onClick={onRevert}
>
  Revert
</Button>
```

## Complete Working Example

```tsx
// In data hook (use<Entity>SettingsData.tsx)
const onResetValues = () => {
  setOriginalEntity({ ...entity });
  setModified(false);
};

// In settings component (<Entity>Settings.tsx)
const [isSaving, setSaving] = React.useState(false);

const onSave = () => {
  const modifiedValues = props.modifiedValues();
  const payload = buildPayload(modifiedValues);
  
  setSaving(true);
  
  saveEntity(payload).then((response) => {
    if ("data" in response) {
      if (response.data?.result) {
        dispatch(addAlert({ title: "Entity modified", variant: "success" }));
      } else if (response.data?.error) {
        dispatch(addAlert({ title: response.data.error.message, variant: "danger" }));
      }
      props.onResetValues();
      setSaving(false);
    }
  });
};

// Toolbar buttons
const toolbarFields = [
  {
    key: 1,
    element: (
      <Button isDisabled={!props.isModified || isSaving} onClick={onRevert}>
        Revert
      </Button>
    ),
  },
  {
    key: 2,
    element: (
      <Button
        isDisabled={!props.isModified || isSaving}
        isLoading={isSaving}
        onClick={onSave}
      >
        {isSaving ? "Saving" : "Save"}
      </Button>
    ),
  },
];
```

**Reference implementations:** `HostsSettings.tsx`, `SudoRulesSettings.tsx`, `DelegationsSettings.tsx`
