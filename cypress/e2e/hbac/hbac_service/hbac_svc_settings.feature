Feature: HBAC service settings manipulation
  Modify a HBAC service

  @seed
  Scenario: Seed: Ensure service exists
    Given HBAC service "a_service_settings" exists

  @test
  Scenario: Set Description in settings
    Given I am logged in as admin
    And I am on "hbac-services/a_service_settings" page

    When I type in the "hbac-services-tab-settings-textbox-description" textbox text "test"
    Then I should see "test" in the "hbac-services-tab-settings-textbox-description" textbox
    And I should see the "hbac-services-tab-settings-button-save" button is enabled

    When I click on the "hbac-services-tab-settings-button-save" button
    Then I should see "save-success" alert

    When I am on "hbac-services" page
    Then I should see "a_service_settings" entry in the data table with attribute "Description" set to "test"

  @cleanup
  Scenario: Cleanup: Delete a service
    Given I delete service "a_service_settings"
