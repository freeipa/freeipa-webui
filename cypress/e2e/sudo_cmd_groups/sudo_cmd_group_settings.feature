Feature: Sudo command group settings manipulation
  Modify settings of a Sudo command group

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_settings" exists

  @test
  Scenario: Set description and verify it persists in the list page
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_settings" page

    When I type in the "sudo-cmd-groups-tab-settings-textbox-description" textbox text "test description"
    Then I should see "test description" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox
    And I should see the "sudo-cmd-groups-tab-settings-button-save" button is enabled

    When I click on the "sudo-cmd-groups-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "test description" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox

    When I am on "sudo-command-groups" page
    Then I should see "cmdgroup_settings" entry in the data table with attribute "Description" set to "test description"

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_settings"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_revert" with description "original desc" exists

  @test
  Scenario: Revert description restores original value
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_revert" page

    When I type in the "sudo-cmd-groups-tab-settings-textbox-description" textbox text "temporary"
    Then I should see "temporary" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox
    And I should see the "sudo-cmd-groups-tab-settings-button-revert" button is enabled

    When I click on the "sudo-cmd-groups-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see "original desc" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox
    And I should see the "sudo-cmd-groups-tab-settings-button-save" button is disabled

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_revert"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_modify" exists

  @test
  Scenario: Modify description and verify it persists after refresh
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_modify" page

    When I type in the "sudo-cmd-groups-tab-settings-textbox-description" textbox text "persistent desc"
    Then I should see "persistent desc" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox
    And I should see the "sudo-cmd-groups-tab-settings-button-save" button is enabled

    When I click on the "sudo-cmd-groups-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "persistent desc" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox

    When I click on the "sudo-cmd-groups-tab-settings-button-refresh" button
    Then I should see "persistent desc" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_modify"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_buttons" exists

  @test
  Scenario: Save and Revert buttons are disabled when no changes are made
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_buttons" page

    Then I should see the "sudo-cmd-groups-tab-settings-button-save" button is disabled
    And I should see the "sudo-cmd-groups-tab-settings-button-revert" button is disabled

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_buttons"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_revert_save" with description "original" exists

  @test
  Scenario: Revert disables Save button
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_revert_save" page

    When I type in the "sudo-cmd-groups-tab-settings-textbox-description" textbox text "changed"
    Then I should see the "sudo-cmd-groups-tab-settings-button-save" button is enabled
    And I should see the "sudo-cmd-groups-tab-settings-button-revert" button is enabled

    When I click on the "sudo-cmd-groups-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see "original" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox
    And I should see the "sudo-cmd-groups-tab-settings-button-save" button is disabled
    And I should see the "sudo-cmd-groups-tab-settings-button-revert" button is disabled

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_revert_save"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_refresh" with description "refresh me" exists

  @test
  Scenario: Refresh button reloads saved data discarding unsaved changes
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_refresh" page

    Then I should see "refresh me" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox

    When I type in the "sudo-cmd-groups-tab-settings-textbox-description" textbox text "unsaved change"
    Then I should see "unsaved change" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox

    When I click on the "sudo-cmd-groups-tab-settings-button-refresh" button
    Then I should see "refresh me" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox
    And I should see the "sudo-cmd-groups-tab-settings-button-save" button is disabled

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_refresh"
