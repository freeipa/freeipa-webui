Feature: HBAC service groups manipulation
  Create and delete HBAC service groups

  @test
  Scenario: Add a new service group
    Given I am logged in as admin
    And I am on "hbac-service-groups" page

    When I click on the "hbac-service-groups-button-add" button
    Then I should see "add-hbac-service-group-modal" modal

    When I type in the "modal-textbox-service-group-name" textbox text "a_service_group1"
    Then I should see "a_service_group1" in the "modal-textbox-service-group-name" textbox

    When I type in the "modal-textbox-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-hbac-service-group-modal" modal
    And I should see "add-hbacservicegroup-success" alert

    When I search for "a_service_group1" in the data table
    Then I should see "a_service_group1" entry in the data table
    And I should see "a_service_group1" entry in the data table with attribute "Description" set to "my description"

  @cleanup
  Scenario: Cleanup: Delete a service group
    Given I delete service group "a_service_group1"

  @seed
  Scenario: Seed: Ensure service group exists
    Given HBAC service group "a_service_group2" exists

  @test
  Scenario: Search for a service group
    Given I am logged in as admin
    And I am on "hbac-service-groups" page

    When I search for "a_service_group2" in the data table
    Then I should see "a_service_group2" entry in the data table
    And I should not see "a_service_group1" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete a service group
    Given I delete service group "a_service_group2"

  @seed
  Scenario: Seed: Ensure service group exists
    Given HBAC service group "a_service_group2" exists
    And HBAC service group "a_service_group3" exists

  @test
  Scenario: Delete many service groups
    Given I am logged in as admin
    And I am on "hbac-service-groups" page

    When I search for "a_service_group2" in the data table
    Then I should see "a_service_group2" entry in the data table
    When I select entry "a_service_group2" in the data table
    Then I should see "a_service_group2" entry selected in the data table

    When I search for "a_service_group3" in the data table
    Then I should see "a_service_group3" entry in the data table
    When I select entry "a_service_group3" in the data table
    Then I should see "a_service_group3" entry selected in the data table

    When I click on the "hbac-service-groups-button-delete" button
    Then I should see "delete-hbac-service-groups-modal" modal
    And I should see "a_service_group2" entry in the data table
    And I should see "a_service_group3" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-hbacservicegroups-success" alert
    And I should not see "a_service_group2" entry in the data table
    And I should not see "a_service_group3" entry in the data table

  @test
  Scenario: Cancel creation of a service group
    Given I am logged in as admin
    And I am on "hbac-service-groups" page

    When I click on the "hbac-service-groups-button-add" button
    Then I should see "add-hbac-service-group-modal" modal

    When I type in the "modal-textbox-service-group-name" textbox text "a_service_group_cancel"
    Then I should see "a_service_group_cancel" in the "modal-textbox-service-group-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-hbac-service-group-modal" modal
    And I should not see "a_service_group_cancel" entry in the data table
