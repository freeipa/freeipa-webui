Feature: Role settings manipulation
  Modify role settings

  @seed
  Scenario: Create role for settings test
    Given role "settings_role" exists

  @test
  Scenario: Set Description
    Given I am logged in as admin
    And I am on "roles/settings_role" page

    When I type in the "roles-tab-settings-textarea-description" textbox text "Test description"
    Then I should see "Test description" in the "roles-tab-settings-textarea-description" textbox

    When I click on the "roles-tab-settings-button-save" button
    Then I should see "save-success" alert

  @cleanup
  Scenario: Delete settings_role
    Given I delete role "settings_role"

  @seed
  Scenario: Create role for revert test
    Given role "revert_role" exists with description "Original description"

  @test
  Scenario: Revert changes
    Given I am logged in as admin
    And I am on "roles/revert_role" page

    Then I should see "Original description" in the "roles-tab-settings-textarea-description" textbox

    When I type in the "roles-tab-settings-textarea-description" textbox text "Modified description"
    Then I should see "Modified description" in the "roles-tab-settings-textarea-description" textbox

    When I click on the "roles-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see "Original description" in the "roles-tab-settings-textarea-description" textbox

  @cleanup
  Scenario: Delete revert_role
    Given I delete role "revert_role"

  @seed
  Scenario: Create role for save button state test
    Given role "button_state_role" exists

  @test
  Scenario: Save and Revert buttons are disabled when no changes
    Given I am logged in as admin
    And I am on "roles/button_state_role" page

    Then I should see the "roles-tab-settings-button-save" button is disabled
    And I should see the "roles-tab-settings-button-revert" button is disabled

    When I type in the "roles-tab-settings-textarea-description" textbox text "New description"
    Then I should see "New description" in the "roles-tab-settings-textarea-description" textbox
    And I should see the "roles-tab-settings-button-save" button is enabled
    And I should see the "roles-tab-settings-button-revert" button is enabled

    When I click on the "roles-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see the "roles-tab-settings-button-save" button is disabled
    And I should see the "roles-tab-settings-button-revert" button is disabled

  @cleanup
  Scenario: Delete button_state_role
    Given I delete role "button_state_role"
