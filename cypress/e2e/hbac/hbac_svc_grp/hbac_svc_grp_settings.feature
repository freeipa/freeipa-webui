Feature: HBAC service group settings manipulation
  Modify a HBAC service group

  @seed
  Scenario: Seed: Ensure service group exists
    Given HBAC service group "a_service_group_settings" exists

  @test
  Scenario: Set Description in settings
    Given I am logged in as admin
    And I am on "hbac-service-groups/a_service_group_settings" page

    When I type in the "hbac-service-groups-tab-settings-textbox-description" textbox text "test"
    Then I should see "test" in the "hbac-service-groups-tab-settings-textbox-description" textbox
    And I should see the "hbac-service-groups-tab-settings-button-save" button is enabled

    When I click on the "hbac-service-groups-tab-settings-button-save" button
    Then I should see "save-success" alert

    When I am on "hbac-service-groups" page
    Then I should see "a_service_group_settings" entry in the data table with attribute "Description" set to "test"

  @cleanup
  Scenario: Cleanup: Delete a service group
    Given I delete service group "a_service_group_settings"
