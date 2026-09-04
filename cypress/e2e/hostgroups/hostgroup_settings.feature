Feature: Host group settings manipulation
  Modify host group settings

  @seed
  Scenario: Create hostgroup
    Given hostgroup "a-hostgroup" exists

  @test
  Scenario: Set Description
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup" page

    When I type in the "host-groups-tab-settings-textbox-description" textbox text "test"
    Then I should see "test" in the "host-groups-tab-settings-textbox-description" textbox
    And I should see the "host-groups-tab-settings-button-save" button is enabled

    When I click on the "host-groups-tab-settings-button-save" button
    Then I should see "save-success" alert

  @cleanup
  Scenario: Delete hostgroup
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create hostgroup
    Given hostgroup "a-hostgroup" with description "original" exists

  @test
  Scenario: Revert Description
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup" page

    When I type in the "host-groups-tab-settings-textbox-description" textbox text "temporary"
    Then I should see "temporary" in the "host-groups-tab-settings-textbox-description" textbox
    And I should see the "host-groups-tab-settings-button-revert" button is enabled

    When I click on the "host-groups-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see "original" in the "host-groups-tab-settings-textbox-description" textbox
    And I should see the "host-groups-tab-settings-button-save" button is disabled

  @cleanup
  Scenario: Delete hostgroup
    Given I delete hostgroup "a-hostgroup"
