# Cypress rules

## Attribute Usage

**PatternFly components**: Use `data-cy` directly
**Custom components**: Use `dataCy` prop (passed through to `data-cy`)

All values use kebab-case formatting.

## General Naming Convention

Follow this hierarchy for naming:

```
{page-name}-{component-type}-{action/identifier}
```

## Toolbar

Toolbar is prefixed with `toolbar` instead of a page name.
Otherwise follows same rules as all components below

```
toolbar-button-about
toolbar-button-logout
```

## Navigation

Navigation elements follow this pattern:

```
nav-{section}
nav-button-{action}
nav-link-{page-name}
```

Examples:

```
nav-identity
nav-policy
nav-authentication
nav-link-active-users
nav-link-user-groups
```

## Breadcrumbs

TODO

## Pages

Most pages consist of search bar, table and buttons.

### Search Bar

Each page has a search bar, that is always identified simply as

```
search
```

### Page Buttons

Page toolbar buttons follow this pattern:

```
{page-name}-button-{action}
```

Examples:

```
active-users-button-add
active-users-button-delete
active-users-button-refresh
host-groups-button-add
```

### Kebab Menus

Kebab menus have `-kebab` postfix:

```
{page-name}-kebab
```

Kebab items follow this pattern:

```
{page-name}-kebab-{action}
```

Examples:

```
active-users-kebab
active-users-kebab-rebuild-auto-membership
```

## Tables

Tables and their components follow these patterns:

```
{page-name}-table
```

Examples:

```
active-users-table
```

## Tabs

Follow similar naming fashion as pages:

```
{page-name}-tab-{tab-name}
```

Examples:

```
active-users-tab-memberof
host-groups-tab-settings
```

## Settings Pages

When clicking on an entry, we get to its settings page.
Components in the tabs follow similar naming rules, prefixed with the whole tab name.

### Inputs

```
{page-name}-tab-{tab-name}-textbox-{field-name}
{page-name}-tab-{tab-name}-select-{field-name}
{page-name}-tab-{tab-name}-checkbox-{field-name}
```

Examples:

```
active-users-tab-settings-textbox-first-name
active-users-tab-settings-textbox-last-name
```

### Buttons

```
{page-name}-tab-{tab-name}-button-{action}
```

Examples:

```
active-users-tab-settings-button-refresh
active-users-tab-settings-button-save
```

### Kebab

Kebab for the actions simply has `-kebab` postfix

```
{page-name}-tab-{tab-name}-kebab
{page-name}-tab-{tab-name}-kebab-{action}
```

Examples:

```
active-users-tab-settings-kebab
active-users-tab-settings-kebab-new-certificate
```

## Other pages

There are pages without tabs, these just omit the tab part.

```
{page-name}-button-{action}
```

Examples:

```
certificate-identity-mapping-match-textbox-issuer
certificate-identity-mapping-match-textbox-subject
```

## Modals

Modals follow this naming scheme:

```
{component-name}-modal
```

Examples:

```
add-user-modal
delete-users-modal
add-hbac-rule-modal
reset-password-modal
```

### Error Modals

Error modals within other modals have `-error` postfix:

```
{component-name}-modal-error
```

Examples:

```
add-user-modal-error
delete-users-modal-error
add-hbac-rule-modal-error
```

### Modal Buttons

Modal buttons are always prefixed with `modal-button-`, followed by their action:

```
modal-button-{action}
```

Common examples:

```
modal-button-add
modal-button-delete
modal-button-cancel
modal-button-save
modal-button-reset
modal-button-ok
modal-button-enable
modal-button-disable
```

### Modal Form Elements

Modal form controls are simply prefixed with `modal`, as opening more than one modal is considered a bad practice.

```
modal-textbox-{field-name}
modal-select-{field-name}
modal-checkbox-{field-name}
```

## Form Components

Form components throughout the application follow these patterns:

### Input Components

We don't differentiate between `input type="text"` and `textarea`, both are `textbox`

```
{context}-textbox-{field-name}
{context}-select-{field-name}
{context}-checkbox-{field-name}
{context}-radio-{field-name}
```

### Button Components

```
{context}-button-{action}
```

### Toggle groups

```
{context}-toggle-group-{field-name}
```

### Select

```
{context}-field-name
```

### Dropdown

```
{context}-field-name
```

## Special Cases

### Login Pages

```
login-textbox-username
login-textbox-password
login-button-submit
```

## Best Practices

1. **Consistency**: Always use kebab-case
2. **Hierarchy**: Follow the naming hierarchy for clarity
3. **Uniqueness**: Ensure each data-cy value is unique across the application
4. **Descriptive**: Use clear, descriptive names that indicate purpose
5. **Avoid Ambiguity**: Don't use generic terms like "button" or "input" alone
6. **Component Reuse**: For reusable components, accept `dataCy` as a prop
7. **Error Handling**: Always add data-cy to error modals and validation messages

## Testing Notes

- Use `cy.dataCy(value)` command for selecting elements
- Prefer data-cy over other selectors for stability
- Test both success and error scenarios
- Verify modal opening/closing behavior
- Test form validation and submission
