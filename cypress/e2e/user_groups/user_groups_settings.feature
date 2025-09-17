Feature: User group settings manipulation
  Modify user group settings

  @seed
  Scenario: Create group
    Given user group "group1" exists

  @test
  Scenario: Set Description
    Given I am logged in as admin
    And I am on "user-groups/group1" page

    When I type in the "user-groups-tab-settings-textbox-description" textbox text "test"
    Then I should see "test" in the "user-groups-tab-settings-textbox-description" textbox

    When I click on the "user-groups-tab-settings-button-save" button
    Then I should see "save-success" alert
  
  @cleanup
  Scenario: Delete group
    Given I delete user group "group1"

  @seed
  Scenario: Create group
    Given non-POSIX User group "group1" exists

  @test
  Scenario: Convert group to POSIX group
    Given I am logged in as admin
    And I am on "user-groups/group1" page

    When I click on the "user-groups-tab-settings-kebab" kebab menu
    Then I should see "user-groups-tab-settings-kebab" kebab menu expanded

    When I click on the "user-groups-tab-settings-kebab-change-to-posix" button
    Then I should see "change-group-type-posix-modal" modal

    When I click on the "modal-button-change" button
    Then I should not see "change-group-type-posix-modal" modal
    And I should see "posix-usergroup-success" alert
    And I should see "POSIX" in the "user-groups-tab-settings-textbox-group-type" textbox

  @cleanup
  Scenario: Delete group
    Given I delete user group "group1"

  @seed
  Scenario: Create group
    Given non-POSIX User group "group1" exists

  @test
  Scenario: Convert group to external group
    Given I am logged in as admin
    And I am on "user-groups/group1" page

    When I click on the "user-groups-tab-settings-kebab" kebab menu
    Then I should see "user-groups-tab-settings-kebab" kebab menu expanded

    When I click on the "user-groups-tab-settings-kebab-change-to-external" button
    Then I should see "change-group-type-external-modal" modal

    When I click on the "modal-button-change" button
    Then I should not see "change-group-type-external-modal" modal
    And I should see "external-usergroup-success" alert
    And I should see "External" in the "user-groups-tab-settings-textbox-group-type" textbox

  @cleanup
  Scenario: Cleanup: Delete groups
    Given I delete user group "group1"
