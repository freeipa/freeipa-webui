Feature: Delegation manipulation
  Create, delete and search for delegations

  @test
  Scenario: Add a new delegation
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "a_delegation1"
    Then I should see "a_delegation1" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group within "add-delegation-modal" modal
    And I select "ipausers" in the "modal-form-memberof" typeahead group within "add-delegation-modal" modal
    And I select "cn" in the "modal-select-attrs" typeahead checkbox within "add-delegation-modal" modal

    When I click on the "modal-button-add" button
    Then I should not see "add-delegation-modal" modal
    And I should see "add-delegation-success" alert

    When I search for "a_delegation1" in the data table
    Then I should see "a_delegation1" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete delegation a_delegation1
    Given I delete delegation "a_delegation1"

  @seed
  Scenario: Seed: Create delegation a_delegation1
    Given delegation "a_delegation1" exists

  @test
  Scenario: Delete a delegation
    Given I am logged in as admin
    And I am on "delegations" page

    When I search for "a_delegation1" in the data table
    Then I should see "a_delegation1" entry in the data table
    When I select entry "a_delegation1" in the data table
    Then I should see "a_delegation1" entry selected in the data table

    When I click on the "delegations-button-delete" button
    Then I should see "delete-delegations-modal" modal
    And I should see "a_delegation1" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-delegations-success" alert
    And I should not see "delete-delegations-modal" modal
    And I should not see "a_delegation1" entry in the data table

  @seed
  Scenario: Seed: Create delegations used in tests
    Given delegation "a_delegation2" exists
    And delegation "a_delegation3" exists

  @test
  Scenario: Delete many delegations
    Given I am logged in as admin
    And I am on "delegations" page

    When I search for "a_delegation2" in the data table
    Then I should see "a_delegation2" entry in the data table
    When I select entry "a_delegation2" in the data table
    Then I should see "a_delegation2" entry selected in the data table

    When I search for "a_delegation3" in the data table
    Then I should see "a_delegation3" entry in the data table
    When I select entry "a_delegation3" in the data table
    Then I should see "a_delegation3" entry selected in the data table

    When I click on the "delegations-button-delete" button
    Then I should see "delete-delegations-modal" modal
    And I should see "a_delegation2" entry in the data table
    And I should see "a_delegation3" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-delegations-success" alert
    And I should not see "delete-delegations-modal" modal
    And I should not see "a_delegation2" entry in the data table
    And I should not see "a_delegation3" entry in the data table

  @test
  Scenario: Cancel creation of a delegation
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "a_delegation_cancel"
    Then I should see "a_delegation_cancel" in the "modal-textbox-delegation-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal
    And I should not see "a_delegation_cancel" entry in the data table
