# Cypress rules

## Writing Tests

Tests follow a three-part structure for better maintainability and re-execution capabilities. Each part is tagged separately and runs in isolation with cleared cache and storage.

You don't have to use all parts, if they do not make sense for your scenario.

Every events needs to be followed by state validation, this can be either handled in
cypress directly, in case of more complex step definitions or via Gherkin When, Then.

When implementing Given steps, make sure to reuse shared lines from When and Then steps where it makes sense! We should ideally replace Given steps by networking calls, but reusing other steps is also fine.

**Test Isolation**: All scenarios start fresh - login is always required, however database state is never reset between tests.

### Seeding (@seed)

Database preparation phase focused on efficiency and minimal steps.

**Purpose**: Prepare test data with maximum amount of shortcuts
**Syntax**: Always begin steps with `Given`
**Common patterns**:

- Add new users for user-focused tests
- Create custom test data as needed

**Example**:

```gherkin
@seed
Scenario: Create user
  Given User "jdoe" "John" "Doe" exists and is using password "Secret123"
```

### Test (@test)

Primary test execution phase with explicit, comprehensive testing.

**Purpose**: Execute actual test scenarios with minimal shortcuts
**Syntax**: Use `When` followed by one or more `Then` statements
**Approach**: Be explicit and thorough in test steps

**Example**:

```gherkin
@test
Scenario: Fill in reset password form
  When I type in the "reset-password-textbox-current-password" textbox text "Secret123"
  Then I should see "Secret123" in the "reset-password-textbox-current-password" textbox

  When I type in the "reset-password-textbox-new-password" textbox text "NewSecret123"
  Then I should see "NewSecret123" in the "reset-password-textbox-new-password" textbox

  When I type in the "reset-password-textbox-verify-password" textbox text "NewSecret123"
  Then I should see "NewSecret123" in the "reset-password-textbox-verify-password" textbox
```

### Cleanup (@cleanup)

Database cleanup phase focused on efficient teardown.

**Purpose**: Remove test data using maximum shortcuts
**Syntax**: Always begin steps with `Given`
**Common patterns**:

- Custom cleanup steps for specific test scenarios
- Bulk removal operations where possible

**Example**:

```gherkin
@cleanup
Scenario: Delete user "jdoe"
  Given I delete user "jdoe"
```

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
3. **Uniqueness**: Ensure each data-cy value is unique across the visible page
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
- Always validate state after an event
- Features have to follow When -> Then structure

## Caveats

- In case you're running out of memory

```
V8 javascript OOM (Reached heap limit).
```

You can [increase the limit](https://stackoverflow.com/questions/38558989/node-js-heap-out-of-memory), preferably by:

```
export NODE_OPTIONS=--max_old_space_size=8192
```
