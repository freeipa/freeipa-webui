Feature: HBAC services manipulation
  Create and delete HBAC services

  @test
  Scenario: Add a new service
    Given I am logged in as admin
    And I am on "hbac-services" page

    When I click on the "hbac-services-button-add" button
    Then I should see "add-hbac-service-modal" modal

    When I type in the "modal-textbox-service-name" textbox text "a_service1"
    Then I should see "a_service1" in the "modal-textbox-service-name" textbox

    When I type in the "modal-textbox-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-hbac-service-modal" modal
    And I should see "add-hbacservice-success" alert

    When I search for "a_service1" in the data table
    Then I should see "a_service1" entry in the data table
    And I should see "a_service1" entry in the data table with attribute "Description" set to "my description"

  @test
  Scenario: Search for a service
    Given HBAC service "a_service2" exists

    Given I am logged in as admin
    And I am on "hbac-services" page

    When I search for "a_service2" in the data table
    Then I should see "a_service2" entry in the data table
    And I should not see "a_service1" entry in the data table

  @test
  Scenario: Delete a service
    Given HBAC service "a_service1" exists

    Given I am logged in as admin
    And I am on "hbac-services" page

    When I search for "a_service1" in the data table
    Then I should see "a_service1" entry in the data table
    When I select entry "a_service1" in the data table
    Then I should see "a_service1" entry selected in the data table


    When I click on the "hbac-services-button-delete" button
    Then I should see "delete-hbac-services-modal" modal
    And I should see "a_service1" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-hbacservices-success" alert
    And I should not see "delete-hbac-services-modal" modal
    And I should not see "a_service1" entry in the data table

  @test
  Scenario: Delete many services
    Given HBAC service "a_service2" exists
    And HBAC service "a_service3" exists
    Given I am logged in as admin
    And I am on "hbac-services" page

    When I search for "a_service2" in the data table
    Then I should see "a_service2" entry in the data table
    When I select entry "a_service2" in the data table
    Then I should see "a_service2" entry selected in the data table

    When I search for "a_service3" in the data table
    Then I should see "a_service3" entry in the data table
    When I select entry "a_service3" in the data table
    Then I should see "a_service3" entry selected in the data table

    When I click on the "hbac-services-button-delete" button
    Then I should see "delete-hbac-services-modal" modal
    And I should see "a_service2" entry in the data table
    And I should see "a_service3" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-hbacservices-success" alert
    And I should not see "delete-hbac-services-modal" modal
    And I should not see "a_service2" entry in the data table
    And I should not see "a_service3" entry in the data table

  @test
  Scenario: Cancel creation of a service
    Given I am logged in as admin
    And I am on "hbac-services" page

    When I click on the "hbac-services-button-add" button
    Then I should see "add-hbac-service-modal" modal

    When I type in the "modal-textbox-service-name" textbox text "a_service_cancel"
    Then I should see "a_service_cancel" in the "modal-textbox-service-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-hbac-service-modal" modal
    And I should not see "a_service_cancel" entry in the data table
