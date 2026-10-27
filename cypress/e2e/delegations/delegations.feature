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

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox

    When I click on the "modal-button-add" button
    Then I should not see "add-delegation-modal" modal
    And I should see "add-delegation-success" alert

    When I search for "a_delegation1" in the data table
    Then I should see "a_delegation1" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete delegation a_delegation1
    Given I delete delegation "a_delegation1"

  @test
  Scenario: Add button is disabled when delegation name is empty
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox
    And I should see the "modal-button-add" button is disabled

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal

  @test
  Scenario: Add button is disabled when user group is not selected
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "no_group_deleg"
    Then I should see "no_group_deleg" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-memberof" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox
    And I should see the "modal-button-add" button is disabled

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal

  @test
  Scenario: Add button is disabled when member user group is not selected
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "no_memberof_deleg"
    Then I should see "no_memberof_deleg" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox
    And I should see the "modal-button-add" button is disabled

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal

  @test
  Scenario: Add button is disabled when no attributes are selected
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "no_attrs_deleg"
    Then I should see "no_attrs_deleg" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    Then I should see the "modal-button-add" button is disabled

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal

  @test
  Scenario: Add button is disabled for delegation name with special characters
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "bad@deleg#name!"
    Then I should see "bad@deleg#name!" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox
    And I should see the "modal-button-add" button is disabled

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal

  @test
  Scenario: Add button is disabled for delegation name with leading spaces
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text " leading_space"
    Then I should see " leading_space" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox
    And I should see the "modal-button-add" button is disabled

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal

  @test
  Scenario: Add button is disabled for delegation name with trailing spaces
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "trailing_space "
    Then I should see "trailing_space " in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox
    And I should see the "modal-button-add" button is disabled

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal

  @test
  Scenario: Cancel creation of a delegation
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "a_delegation_cancel"
    Then I should see "a_delegation_cancel" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-delegation-modal" modal

    When I search for "a_delegation_cancel" in the data table
    Then I should not see "a_delegation_cancel" entry in the data table

  @seed
  Scenario: Seed: Create delegation for duplicate test
    Given delegation "a_delegation_dup" exists

  @test
  Scenario: Adding a duplicate delegation shows an error
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "a_delegation_dup"
    Then I should see "a_delegation_dup" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    And I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox

    When I click on the "modal-button-add" button
    Then I should see "add-delegation-error" alert

  @cleanup
  Scenario: Cleanup: Delete duplicate test delegation
    Given I delete delegation "a_delegation_dup"

  @test
  Scenario: Add a delegation with both read and write permissions and multiple attributes
    Given I am logged in as admin
    And I am on "delegations" page

    When I click on the "delegations-button-add" button
    Then I should see "add-delegation-modal" modal

    When I type in the "modal-textbox-delegation-name" textbox text "a_deleg_multi"
    Then I should see "a_deleg_multi" in the "modal-textbox-delegation-name" textbox

    When I select "ipausers" in the "modal-form-group" typeahead group
    And I select "ipausers" in the "modal-form-memberof" typeahead group
    And I click on the "modal-checkbox-permissions-read" checkbox
    Then I should see the "modal-checkbox-permissions-read" checkbox is checked

    When I click on the "modal-checkbox-permissions-write" checkbox
    Then I should see the "modal-checkbox-permissions-write" checkbox is checked

    When I select "cn" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "cn" option selected in the "modal-select-attrs" typeahead checkbox

    When I select "description" in the "modal-select-attrs" typeahead checkbox
    Then I should see the "description" option selected in the "modal-select-attrs" typeahead checkbox

    When I click on the "modal-button-add" button
    Then I should not see "add-delegation-modal" modal
    And I should see "add-delegation-success" alert

    When I search for "a_deleg_multi" in the data table
    Then I should see "a_deleg_multi" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete multi-attribute delegation
    Given I delete delegation "a_deleg_multi"

  @seed
  Scenario: Seed: Create delegation for delete-button state tests
    Given delegation "a_delegation_delbtn" exists

  @test
  Scenario: Delete button is disabled when no delegation is selected
    Given I am logged in as admin
    And I am on "delegations" page

    Then I should see the "delegations-button-delete" button is disabled

  @cleanup
  Scenario: Cleanup: Delete delegation a_delegation_delbtn
    Given I delete delegation "a_delegation_delbtn"

  @seed
  Scenario: Seed: Create delegation for cancel delete test
    Given delegation "a_delegation_keepme" exists

  @test
  Scenario: Cancel delete modal keeps the delegation
    Given I am logged in as admin
    And I am on "delegations" page

    When I search for "a_delegation_keepme" in the data table
    Then I should see "a_delegation_keepme" entry in the data table

    When I select entry "a_delegation_keepme" in the data table
    Then I should see "a_delegation_keepme" entry selected in the data table

    When I click on the "delegations-button-delete" button
    Then I should see "delete-delegations-modal" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "delete-delegations-modal" modal

    When I search for "a_delegation_keepme" in the data table
    Then I should see "a_delegation_keepme" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete delegation a_delegation_keepme
    Given I delete delegation "a_delegation_keepme"

  @seed
  Scenario: Seed: Create delegation for refresh test
    Given delegation "a_delegation_refresh" exists

  @test
  Scenario: Refresh button reloads the delegations list
    Given I am logged in as admin
    And I am on "delegations" page

    When I search for "a_delegation_refresh" in the data table
    Then I should see "a_delegation_refresh" entry in the data table

    When I click on the "delegations-button-refresh" button
    Then I should see "a_delegation_refresh" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete delegation a_delegation_refresh
    Given I delete delegation "a_delegation_refresh"

  @test
  Scenario: Search for a non-existent delegation returns no results
    Given I am logged in as admin
    And I am on "delegations" page

    When I search for "this_delegation_does_not_exist" in the data table
    Then I should not see "this_delegation_does_not_exist" entry in the data table

  @seed
  Scenario: Seed: Create delegation for link navigation test
    Given delegation "a_delegation_link" exists

  @test
  Scenario: Clicking a delegation name navigates to its settings page
    Given I am logged in as admin
    And I am on "delegations" page

    When I search for "a_delegation_link" in the data table
    Then I should see "a_delegation_link" entry in the data table

    When I click on "a_delegation_link" entry in the data table
    Then I should be on "delegations/a_delegation_link" page

  @cleanup
  Scenario: Cleanup: Delete delegation a_delegation_link
    Given I delete delegation "a_delegation_link"

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

