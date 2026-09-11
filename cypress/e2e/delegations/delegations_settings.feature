Feature: Delegation settings manipulation
  Modify delegation settings

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
  Scenario: Create delegation for user group test
    Given user group "delegation_alt_group" exists
    And delegation "group_delegation" exists with group "ipausers" and member group "ipausers"

  @test
  Scenario: Change user group
    Given I am logged in as admin
    And I am on "delegations/group_delegation" page

    Then I should see "ipausers" option in the "delegations-tab-settings-select-group" ipa select

    When I select "delegation_alt_group" option in the "delegations-tab-settings-select-group" ipa select
    Then I should see "delegation_alt_group" option in the "delegations-tab-settings-select-group" ipa select
    And I should see the "delegations-tab-settings-button-save" button is enabled

    When I click on the "delegations-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "delegation_alt_group" option in the "delegations-tab-settings-select-group" ipa select

  @cleanup
  Scenario: Delete group_delegation and delegation_alt_group
    Given I delete delegation "group_delegation"
    Given I delete user group "delegation_alt_group"

  @seed
  Scenario: Create delegation for member user group test
    Given user group "delegation_alt_group" exists
    And delegation "memberof_delegation" exists with group "ipausers" and member group "ipausers"

  @test
  Scenario: Change member user group
    Given I am logged in as admin
    And I am on "delegations/memberof_delegation" page

    Then I should see "ipausers" option in the "delegations-tab-settings-select-memberof" ipa select

    When I select "delegation_alt_group" option in the "delegations-tab-settings-select-memberof" ipa select
    Then I should see "delegation_alt_group" option in the "delegations-tab-settings-select-memberof" ipa select
    And I should see the "delegations-tab-settings-button-save" button is enabled

    When I click on the "delegations-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "delegation_alt_group" option in the "delegations-tab-settings-select-memberof" ipa select

  @cleanup
  Scenario: Delete memberof_delegation and delegation_alt_group
    Given I delete delegation "memberof_delegation"
    Given I delete user group "delegation_alt_group"

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
