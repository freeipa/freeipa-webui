# Sub-Pages — Settings Form Fields

> **Part of:** [Settings Tab](04-settings-tab.md)
> **See also:** [Entity Types](14-entity-types.md) | [Main Pages Add Modal](../main-pages/07-add-modal.md)

Form components and field configuration for Settings tabs.

## Available Form Components

| Component | Use Case |
|-----------|----------|
| `IpaTextInput` | Single-line text input |
| `IpaTextArea` | Multi-line text input |
| `IpaTextContent` | Read-only text display |
| `IpaPasswordInput` | Password field (masked) |
| `IpaNumberInput` | Numeric input with min/max |
| `IpaCheckbox` | Boolean checkbox |
| `IpaSelect` | Dropdown selection |
| `IpaCalendar` | Date picker |

For the full list, see [main-pages/07-add-modal.md](../main-pages/07-add-modal.md#available-ui-components).

## Field Editability

**Important:** Do NOT explicitly set `readOnly` or `isDisabled` props. IPA form components automatically determine editability from the **metadata**.

```tsx
// ❌ Wrong: Explicit readOnly/isDisabled
<IpaTextInput name="ipatokenuniqueid" readOnly />

// ✅ Correct: Let metadata control editability
<IpaTextInput name="ipatokenuniqueid" metadata={props.metadata} />
```

## IpaSelect Usage

Do NOT use `variant="typeahead"` in Settings pages — it changes the visual style to a text input appearance.

```tsx
// ✅ Correct: Standard dropdown
<IpaSelect
  dataCy="<entity>-tab-settings-select-<fieldname>"
  name="<fieldname>"
  ipaObject={ipaObject}
  setIpaObject={recordOnChange}
  objectName="<entity>"
  metadata={props.metadata}
  options={props.<fieldOptions>}
/>

// ❌ Avoid: Typeahead variant in Settings
<IpaSelect variant="typeahead" ... />
```

## Using Entity Data Types

Check the TypeScript interface in `globalDataTypes.ts` for field constraints:

```typescript
export interface OtpToken {
  ipatokentotptimestep: number; // Default: 30 | Minimum value: 5 | Maximum value: 2147483647
}
```

Apply constraints to form components:

```tsx
<IpaNumberInput
  name="ipatokentotptimestep"
  minValue={5}
  maxValue={2147483647}
  numCharsShown={10}  // max(String(5).length, String(2147483647).length)
/>
```

## Column Layout

Settings forms use **two columns** by default:

```tsx
<Flex direction={{ default: "column", lg: "row" }}>
  <FlexItem flex={{ default: "flex_1" }}>
    <Form id="<entity>-settings-form" onSubmit={onSave}>
      <FormGroup label="Field 1" fieldId="field1">
        <IpaTextInput name="field1" ... />
      </FormGroup>
    </Form>
  </FlexItem>
  <FlexItem flex={{ default: "flex_1" }}>
    <Form>
      <FormGroup label="Field N" fieldId="fieldN">
        <IpaTextInput name="fieldN" ... />
      </FormGroup>
    </Form>
  </FlexItem>
</Flex>
```

**Key points:**
- First `FlexItem` contains main form with `onSubmit` and `id`
- Second `FlexItem` uses a separate `<Form>` without `onSubmit`
- `direction={{ default: "column", lg: "row" }}` — stacks on mobile, side-by-side on larger screens

## Data-Cy Naming Convention

```
<entity>-tab-settings-<element-type>-<field-name>
```

**Examples:**
- `dns-zones-tab-settings-textbox-idnsname`
- `dns-zones-tab-settings-button-save`
- `dns-zones-tab-settings-kebab-delete`

## Required Imports

```tsx
import React from "react";
import { Button, Form, FormGroup, Sidebar, SidebarContent, SidebarPanel } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { useAppDispatch } from "src/store/hooks";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
import { asRecord } from "src/utils/<entity>Utils";
import { use<Entity>ModMutation } from "src/services/rpc<Entity>";
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
```

## Category Toggle + Tables — Section Components

For complex sections using the **Category Toggle + Tables** pattern, create a **separate section component** following the pattern in `SudoRulesWho.tsx`. This keeps the main Settings component clean and encapsulates all toggle/table/add/remove logic.

### Component Location

`src/components/<Entity>Sections/<EntitySection>.tsx`

Examples:
- `src/components/SudoRuleSections/SudoRulesWho.tsx`
- `src/components/SelinuxUserMapSections/SelinuxUserMapUser.tsx`
- `src/components/SelinuxUserMapSections/SelinuxUserMapHost.tsx`

### Props Interface

```tsx
interface PropsToSection {
  ipaObject: Record<string, any>;
  map: Partial<Entity>;  // or rule, etc.
  usersList: TableEntry[];
  userGroupsList: TableEntry[];
  onRefresh: () => void;
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
  onSave: () => void;
  modifiedValues: () => Partial<Entity>;
}
```

### Section Component Responsibilities

- Toggle state (`IpaToggleGroup`)
- Tab state for switching between Users/Groups (or Hosts/Host groups)
- Add/Remove API calls with proper response handling
- "Save and Add" logic (saves category first if switching from "all" to "specified")

### Usage in Settings Component

```tsx
<SelinuxUserMapUser
  map={props.map}
  ipaObject={ipaObject}
  onRefresh={props.onRefresh}
  usersList={usersList}
  userGroupsList={userGroupsList}
  recordOnChange={recordOnChange}
  metadata={props.metadata}
  onSave={onSave}
  modifiedValues={props.modifiedValues}
/>
```

### Reference Implementations

| Component | Purpose |
|-----------|---------|
| `SudoRulesWho.tsx` | User section for Sudo rules |
| `SudoRuleAsWhom.tsx` | RunAs section for Sudo rules |
| `SelinuxUserMapUser.tsx` | User section for SELinux user maps |
| `SelinuxUserMapHost.tsx` | Host section for SELinux user maps |

### "Save and Add" Logic

When the user switches from "Anyone" to "Specified users and groups" and immediately tries to add members, the category change must be saved first:

```tsx
const onSaveAndAddUsers = (usersToAdd: string[]) => {
  const modifiedValues = props.modifiedValues();
  if (modifiedValues.usercategory === "") {
    // Category just changed to "specified" - save first
    modifiedValues.cn = props.map.cn;
    onSaveMap(modifiedValues).then((response) => {
      if (response.data?.result) {
        props.onRefresh();
        onAddNewUser(usersToAdd);  // Then add users
      }
    });
  } else {
    onAddNewUser(usersToAdd);  // Category unchanged, just add
  }
};
```

### API Response Handling

Handle the `completed` and `failed` fields from add/remove operations:

```tsx
if (data?.result) {
  const results = data.result as AddRemoveToEntityResult;
  const failedEntries = results.failed?.memberuser?.user || [];
  if (failedEntries.length > 0) {
    const failedNames = failedEntries.map(([name]) => name).join(", ");
    dispatch(addAlert({ title: `Some users could not be added: ${failedNames}`, variant: "warning" }));
  }
  if (results.completed > 0) {
    dispatch(addAlert({ title: `Added ${results.completed} user(s)`, variant: "success" }));
    props.onRefresh();
  }
}
```
