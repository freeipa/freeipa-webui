Feature: Self-service permissions manipulation
  Create, search for, and delete self-service permissions

  @test
  Scenario: Add a new self-service permission
    Given I am logged in as admin
    And I am on "selfservice-permissions" page

    When I click on the "selfservice-permissions-button-add" button
    Then I should see "add-self-service-permission-modal" modal

    When I type in the "modal-textbox-self-service-name" textbox text "a_selfservice1"
    Then I should see "a_selfservice1" in the "modal-textbox-self-service-name" textbox

    When I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox

    When I click on the "modal-button-add" button
    Then I should not see "add-self-service-permission-modal" modal
    And I should see "add-self-service-permission-success" alert

    When I search for "a_selfservice1" in the data table
    Then I should see "a_selfservice1" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete a self-service permission
    Given I delete self-service permission "a_selfservice1"

  @seed
  Scenario: Seed: Create self-service permission for deletion test
    Given self-service permission "a_selfservice1" exists

  @test
  Scenario: Delete a self-service permission
    Given I am logged in as admin
    And I am on "selfservice-permissions" page

    When I search for "a_selfservice1" in the data table
    Then I should see "a_selfservice1" entry in the data table
    When I select entry "a_selfservice1" in the data table
    Then I should see "a_selfservice1" entry selected in the data table

    When I click on the "selfservice-permissions-button-delete" button
    Then I should see "delete-self-service-permissions-modal" modal
    And I should see "a_selfservice1" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-self-service-permissions-success" alert
    And I should not see "delete-self-service-permissions-modal" modal
    And I should not see "a_selfservice1" entry in the data table


  @test
  Scenario: Cancel creation of a self-service permission
    Given I am logged in as admin
    And I am on "selfservice-permissions" page

    When I click on the "selfservice-permissions-button-add" button
    Then I should see "add-self-service-permission-modal" modal

    When I type in the "modal-textbox-self-service-name" textbox text "a_selfservice_cancel"
    Then I should see "a_selfservice_cancel" in the "modal-textbox-self-service-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-self-service-permission-modal" modal
    And I should not see "a_selfservice_cancel" entry in the data table
