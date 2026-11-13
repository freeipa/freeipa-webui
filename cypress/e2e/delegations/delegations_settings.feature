Feature: Delegation settings manipulation
  Modify delegation settings

  @seed
  Scenario: Create delegation for page display test
    Given delegation "display_delegation" exists

  @test
  Scenario: Settings page shows delegation name in title and name field
    Given I am logged in as admin
    And I am on "delegations/display_delegation" page

    Then I should see the page heading "Delegation: display_delegation"
    And I should see "display_delegation" in the "delegations-tab-settings-textinput-aciname" textbox

  @cleanup
  Scenario: Delete display_delegation
    Given I delete delegation "display_delegation"

  @seed
  Scenario: Create delegation for default button state test
    Given delegation "defaults_delegation" exists

  @test
  Scenario: Save and Revert buttons are disabled when no changes are made
    Given I am logged in as admin
    And I am on "delegations/defaults_delegation" page

    Then I should see "ipausers" option in the "delegations-tab-settings-group-select" selector
    And I should see the "delegations-tab-settings-button-save" button is disabled
    And I should see the "delegations-tab-settings-button-revert" button is disabled

  @cleanup
  Scenario: Delete defaults_delegation
    Given I delete delegation "defaults_delegation"

  @seed
  Scenario: Create delegation for permissions test
    Given delegation "settings_delegation" exists

  @test
  Scenario: Change permissions
    Given I am logged in as admin
    And I am on "delegations/settings_delegation" page

    When I click on the "delegations-tab-settings-checkbox-permissions-read" checkbox
    Then I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is checked
    And I should see the "delegations-tab-settings-button-save" button is enabled

    When I click on the "delegations-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is checked

  @cleanup
  Scenario: Delete settings_delegation
    Given I delete delegation "settings_delegation"

  @seed
  Scenario: Create delegation for switch-to-read permission test
    Given delegation "read_perm_delegation" exists

  @test
  Scenario: Change permissions from write to read
    Given I am logged in as admin
    And I am on "delegations/read_perm_delegation" page

    Then I should see the "delegations-tab-settings-checkbox-permissions-write" checkbox is checked
    And I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is unchecked

    When I click on the "delegations-tab-settings-checkbox-permissions-read" checkbox
    Then I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is checked

    When I click on the "delegations-tab-settings-checkbox-permissions-write" checkbox
    Then I should see the "delegations-tab-settings-checkbox-permissions-write" checkbox is unchecked
    And I should see the "delegations-tab-settings-button-save" button is enabled

    When I click on the "delegations-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is checked
    And I should see the "delegations-tab-settings-checkbox-permissions-write" checkbox is unchecked

  @cleanup
  Scenario: Delete read_perm_delegation
    Given I delete delegation "read_perm_delegation"

  @seed
  Scenario: Create delegation for user group test
    Given user group "ug_for_group_change" exists
    And delegation "deleg_group_change" exists with group "ipausers" and member group "ipausers"

  @test
  Scenario: Change user group
    Given I am logged in as admin
    And I am on "delegations/deleg_group_change" page

    Then I should see "ipausers" option in the "delegations-tab-settings-group-select" selector

    When I select "ug_for_group_change" option in the "delegations-tab-settings-group-select" selector
    Then I should see "ug_for_group_change" option in the "delegations-tab-settings-group-select" selector
    And I should see the "delegations-tab-settings-button-save" button is enabled

    When I click on the "delegations-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "ug_for_group_change" option in the "delegations-tab-settings-group-select" selector

  @cleanup
  Scenario: Delete deleg_group_change and ug_for_group_change
    Given I delete delegation "deleg_group_change"
    Given I delete user group "ug_for_group_change"

  @seed
  Scenario: Create delegation for member user group test
    Given user group "ug_for_memberof_change" exists
    And delegation "deleg_memberof_change" exists with group "ipausers" and member group "ipausers"

  @test
  Scenario: Change member user group
    Given I am logged in as admin
    And I am on "delegations/deleg_memberof_change" page

    Then I should see "ipausers" option in the "delegations-tab-settings-memberof-select" selector

    When I select "ug_for_memberof_change" option in the "delegations-tab-settings-memberof-select" selector
    Then I should see "ug_for_memberof_change" option in the "delegations-tab-settings-memberof-select" selector
    And I should see the "delegations-tab-settings-button-save" button is enabled

    When I click on the "delegations-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "ug_for_memberof_change" option in the "delegations-tab-settings-memberof-select" selector

  @cleanup
  Scenario: Delete deleg_memberof_change and ug_for_memberof_change
    Given I delete delegation "deleg_memberof_change"
    Given I delete user group "ug_for_memberof_change"

  @seed
  Scenario: Create delegation for attributes test
    Given delegation "attrs_delegation" exists

  @test
  Scenario: Change attributes
    Given I am logged in as admin
    And I am on "delegations/attrs_delegation" page

    When I click on the "delegations-tab-settings-checkboxlist-attrs-description" checkbox
    Then I should see the "delegations-tab-settings-checkboxlist-attrs-description" checkbox is checked
    And I should see the "delegations-tab-settings-button-save" button is enabled

    When I click on the "delegations-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see the "delegations-tab-settings-checkboxlist-attrs-description" checkbox is checked

  @cleanup
  Scenario: Delete attrs_delegation
    Given I delete delegation "attrs_delegation"

  @seed
  Scenario: Create delegation for revert test
    Given delegation "revert_delegation" exists

  @test
  Scenario: Revert changes
    Given I am logged in as admin
    And I am on "delegations/revert_delegation" page

    Then I should see the "delegations-tab-settings-checkbox-permissions-write" checkbox is checked
    And I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is unchecked

    When I click on the "delegations-tab-settings-checkbox-permissions-read" checkbox
    Then I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is checked

    When I click on the "delegations-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is unchecked
    And I should see the "delegations-tab-settings-checkbox-permissions-write" checkbox is checked

  @cleanup
  Scenario: Delete revert_delegation
    Given I delete delegation "revert_delegation"

  @seed
  Scenario: Create delegation for multi-field modification test
    Given user group "multi_mod_group" exists
    And delegation "multi_mod_delegation" exists with group "ipausers" and member group "ipausers"

  @test
  Scenario: Modify multiple fields at once and save
    Given I am logged in as admin
    And I am on "delegations/multi_mod_delegation" page

    When I click on the "delegations-tab-settings-checkbox-permissions-read" checkbox
    Then I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is checked

    When I select "multi_mod_group" option in the "delegations-tab-settings-group-select" selector
    Then I should see "multi_mod_group" option in the "delegations-tab-settings-group-select" selector

    When I select "multi_mod_group" option in the "delegations-tab-settings-memberof-select" selector
    Then I should see "multi_mod_group" option in the "delegations-tab-settings-memberof-select" selector

    When I click on the "delegations-tab-settings-checkboxlist-attrs-description" checkbox
    Then I should see the "delegations-tab-settings-checkboxlist-attrs-description" checkbox is checked

    And I should see the "delegations-tab-settings-button-save" button is enabled

    When I click on the "delegations-tab-settings-button-save" button
    Then I should see "save-success" alert

    And I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is checked
    And I should see "multi_mod_group" option in the "delegations-tab-settings-group-select" selector
    And I should see "multi_mod_group" option in the "delegations-tab-settings-memberof-select" selector
    And I should see the "delegations-tab-settings-checkboxlist-attrs-description" checkbox is checked

  @cleanup
  Scenario: Delete multi_mod_delegation and multi_mod_group
    Given I delete delegation "multi_mod_delegation"
    Given I delete user group "multi_mod_group"

  @seed
  Scenario: Create delegation for refresh test
    Given delegation "refresh_delegation" exists

  @test
  Scenario: Refresh button reloads settings data
    Given I am logged in as admin
    And I am on "delegations/refresh_delegation" page

    When I click on the "delegations-tab-settings-checkbox-permissions-read" checkbox
    Then I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is checked

    When I click on the "delegations-tab-settings-button-refresh" button
    Then I should see the "delegations-tab-settings-checkbox-permissions-read" checkbox is unchecked
    And I should see the "delegations-tab-settings-button-save" button is disabled

  @cleanup
  Scenario: Delete refresh_delegation
    Given I delete delegation "refresh_delegation"

  @seed
  Scenario: Create delegation for breadcrumb navigation test
    Given delegation "breadcrumb_delegation" exists

  @test
  Scenario: Breadcrumb navigates back to delegations list
    Given I am logged in as admin
    And I am on "delegations/breadcrumb_delegation" page

    When I click on the "Delegations" breadcrumb link
    Then I should be on "delegations" page

  @cleanup
  Scenario: Delete breadcrumb_delegation
    Given I delete delegation "breadcrumb_delegation"
