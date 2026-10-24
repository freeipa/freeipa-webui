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
    Then I should see the "sudo-cmd-groups-tab-settings-button-save" button is enabled

    When I click on the "sudo-cmd-groups-tab-settings-button-save" button
    Then I should see "save-success" alert

    When I click on the "sudo-cmd-groups-tab-settings-button-refresh" button
    Then I should see "persistent desc" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_modify"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_clear" with description "to be cleared" exists

  @test
  Scenario: Clear the description field and save
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_clear" page

    When I clear the "sudo-cmd-groups-tab-settings-textbox-description" textbox
    Then I should see the "sudo-cmd-groups-tab-settings-textbox-description" textbox is empty
    And I should see the "sudo-cmd-groups-tab-settings-button-save" button is enabled

    When I click on the "sudo-cmd-groups-tab-settings-button-save" button
    Then I should see "save-success" alert

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_clear"

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

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_tabs" with description "tab navigation" exists
    And sudo command "/usr/bin/env" exists
    And I add sudo command "/usr/bin/env" to sudo command group "cmdgroup_tabs"

  @test
  Scenario: Switch between Settings and Members tabs preserving data
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_tabs" page

    Then I should see "tab navigation" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox

    When I click on the "member-details" tab
    Then I should see "/usr/bin/env" entry in the data table

    When I click on the "settings-details" tab
    Then I should see "tab navigation" in the "sudo-cmd-groups-tab-settings-textbox-description" textbox

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/env" from sudo command group "cmdgroup_tabs"
    And I delete sudo command "/usr/bin/env"
    And I delete sudo command group "cmdgroup_tabs"
