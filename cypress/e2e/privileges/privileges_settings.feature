Feature: Privilege settings manipulation
  Modify privilege settings

  @seed
  Scenario: Create privilege for settings test
    Given privilege "settings_privilege" exists

  @test
  Scenario: Set Description
    Given I am logged in as admin
    And I am on "privileges/settings_privilege" page

    When I type in the "privileges-tab-settings-textarea-description" textbox text "Test description"
    Then I should see "Test description" in the "privileges-tab-settings-textarea-description" textbox
    And I should see the "privileges-tab-settings-button-save" button is enabled

    When I click on the "privileges-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "Test description" in the "privileges-tab-settings-textarea-description" textbox

  @cleanup
  Scenario: Delete settings_privilege
    Given I delete privilege "settings_privilege"

  @seed
  Scenario: Create privilege for revert test
    Given privilege "revert_privilege" exists with description "Original description"

  @test
  Scenario: Revert changes
    Given I am logged in as admin
    And I am on "privileges/revert_privilege" page

    Then I should see "Original description" in the "privileges-tab-settings-textarea-description" textbox

    When I type in the "privileges-tab-settings-textarea-description" textbox text "Modified description"
    Then I should see "Modified description" in the "privileges-tab-settings-textarea-description" textbox

    When I click on the "privileges-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see "Original description" in the "privileges-tab-settings-textarea-description" textbox

  @cleanup
  Scenario: Delete revert_privilege
    Given I delete privilege "revert_privilege"
