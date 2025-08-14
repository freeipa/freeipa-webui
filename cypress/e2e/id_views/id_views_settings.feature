Feature: ID View manipulation
  Modify an ID view

  @seed
  Scenario: Create views
    Given view "a_new_view" exists

  @test
  Scenario: Set Description
    Given I am logged in as admin
    And I am on "id-views/a_new_view" page

    When I type in the "id-views-tab-settings-textbox-description" textbox text "test"
    Then I should see "test" in the "id-views-tab-settings-textbox-description" textbox
    And I should see the "id-views-tab-settings-button-save" button is enabled 

    When I click on the "id-views-tab-settings-button-save" button
    Then I should see "save-success" alert

  @test
  Scenario: Set domain resolution order
    Given I am logged in as admin
    And I am on "id-views/a_new_view" page

    When I type in the "id-views-tab-settings-textbox-ipadomainresolutionorder" textbox text "dom-server.ipa.demo"
    Then I should see "dom-server.ipa.demo" in the "id-views-tab-settings-textbox-ipadomainresolutionorder" textbox
    And I should see the "id-views-tab-settings-button-save" button is enabled 

    When I click on the "id-views-tab-settings-button-save" button
    Then I should see "save-success" alert

  @cleanup
  Scenario: Delete a view
    Given I delete view "a_new_view"
