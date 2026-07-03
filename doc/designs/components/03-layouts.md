# Component Catalog — Layout Components

> **Part of:** [Component Catalog](00-overview.md)
> **See also:** [Input Components](01-inputs.md) | [List Components](02-lists.md)

Layout components are located in `src/components/layouts/`.

## TabLayout

Outermost wrapper for Settings tabs. Provides fixed bottom toolbar.

**Import:** `import TabLayout from "src/components/layouts/TabLayout"`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Layout identifier |
| `toolbarItems` | `{ key: number; element: ReactNode }[]` | Toolbar buttons |

```tsx
const toolbarFields = [
  { key: 0, element: <Button variant="secondary" onClick={onRefresh}>Refresh</Button> },
  { key: 1, element: <Button variant="secondary" isDisabled={!isModified} onClick={onRevert}>Revert</Button> },
  { key: 2, element: <Button variant="primary" isDisabled={!isModified} type="submit">Save</Button> },
  { key: 3, element: <KebabLayout direction="up" dropdownItems={kebabItems} /> },
];

<TabLayout id="settings-page" toolbarItems={toolbarFields}>
  {/* Content */}
</TabLayout>
```

## SidebarLayout

Provides sidebar with jump links navigation for multi-section pages.

**Import:** `import SidebarLayout from "src/components/layouts/SidebarLayout"`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `itemNames` | `string[]` | Section names for jump links |

```tsx
const itemNames = ["General", "User", "Host", "Options"];

<SidebarLayout itemNames={itemNames}>
  <Flex>
    <TitleLayout headingLevel="h2" id="general" text="General" />
    {/* Section content */}
  </Flex>
  {/* More sections */}
</SidebarLayout>
```

## TitleLayout

Section heading with consistent styling.

**Import:** `import TitleLayout from "src/components/layouts/TitleLayout"`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `headingLevel` | `"h1" \| "h2" \| "h3" \| ...` | Heading level |
| `id` | `string` | Section ID (for jump links) |
| `text` | `string` | Section title |

## KebabLayout

Kebab menu (three dots) with dropdown actions.

**Import:** `import KebabLayout from "src/components/layouts/KebabLayout"`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `direction` | `"up" \| "down"` | Dropdown direction |
| `dropdownItems` | `ReactNode[]` | Menu items |

**Important:** Use `direction="up"` when kebab is in the bottom toolbar.

## HelpTextWithIconLayout

Help button with question mark icon.

**Import:** `import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout"`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `textContent` | `string` | Button text |
| `onClick` | `() => void` | Click handler |

## SettingsTableLayout

Table layout for displaying key-value pairs in Settings.

**Import:** `import SettingsTableLayout from "src/components/layouts/SettingsTableLayout"`

---

## Modal Components

### ModalWithFormLayout

Base modal component for forms with field definitions.

**Import:** `import ModalWithFormLayout, { Field } from "src/components/layouts/ModalWithFormLayout"`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `dataCy` | `string` | Test identifier |
| `variantType` | `"small" \| "medium" \| "large"` | Modal size |
| `modalPosition` | `"top" \| "default"` | Modal position |
| `offPosition` | `string` | Offset from top (e.g., `"76px"`) |
| `title` | `string` | Modal title |
| `formId` | `string` | Form ID for submit button |
| `fields` | `Field[]` | Form field definitions |
| `show` | `boolean` | Controls visibility |
| `onSubmit` | `() => void` | Submit handler |
| `onClose` | `() => void` | Close handler |
| `actions` | `JSX.Element[]` | Action buttons |

**Field definition:**
```tsx
interface Field {
  id: string;
  name: string;
  pfComponent: ReactNode;
  fieldRequired?: boolean;
}
```

**Example:**
```tsx
const fields: Field[] = [
  {
    id: "modal-form-name",
    name: "Name",
    pfComponent: <TextInput id="modal-form-name" value={name} onChange={setName} />,
    fieldRequired: true,
  },
];

<ModalWithFormLayout
  dataCy="add-entity-modal"
  variantType="small"
  modalPosition="top"
  offPosition="76px"
  title="Add entity"
  formId="add-modal-form"
  fields={fields}
  show={isOpen}
  onSubmit={onAdd}
  onClose={onClose}
  actions={modalActions}
/>
```

### ModalWithTextAreaLayout

Modal with text area content.

**Import:** `import ModalWithTextAreaLayout from "src/components/layouts/ModalWithTextAreaLayout"`

---

## Other Layout Components

| Component | Import | Use Case |
|-----------|--------|----------|
| `PopoverWithIconLayout` | `src/components/layouts/PopoverWithIconLayout` | Info popover with icon |
| `ExpandableCardLayout` | `src/components/layouts/ExpandableCardLayout` | Expandable card (used in certificates) |
| `DualListLayout` | `src/components/layouts/DualListLayout` | Dual list selector |
| `DataSpinner` | `src/components/layouts/DataSpinner` | Loading spinner |
| `SecondaryButton` | `src/components/layouts/SecondaryButton` | Secondary action button |
| `InputRequiredText` | `src/components/layouts/InputRequiredText` | Text input with required indicator |

---

## Generic Section Components

For complex sections with the Category Toggle + Tables pattern:

### CategoryToggleSection

**Import:** `import CategoryToggleSection from "src/components/CategoryToggleSection/CategoryToggleSection"`

See [sub-pages/15-category-toggle-sections.md](../sub-pages/15-category-toggle-sections.md) for detailed usage.
