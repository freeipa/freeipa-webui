Feature: Role manipulation
  Create, delete and search for roles

  @test
  Scenario: Add a new role
    Given I am logged in as admin
    And I am on "roles" page

    When I click on the "roles-button-add" button
    Then I should see "add-role-modal" modal

    When I type in the "modal-textbox-role-name" textbox text "test_role"
    Then I should see "test_role" in the "modal-textbox-role-name" textbox

    When I type in the "modal-textbox-description" textbox text "Test role description"
    Then I should see "Test role description" in the "modal-textbox-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-role-modal" modal
    And I should see "add-role-success" alert

    When I search for "test_role" in the data table
    Then I should see "test_role" entry in the data table

  @cleanup
  Scenario: Delete role test_role
    Given I delete role "test_role"

  @test
  Scenario: Add a new role without description
    Given I am logged in as admin
    And I am on "roles" page

    When I click on the "roles-button-add" button
    Then I should see "add-role-modal" modal

    When I type in the "modal-textbox-role-name" textbox text "role_no_desc"
    Then I should see "role_no_desc" in the "modal-textbox-role-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-role-modal" modal
    And I should see "add-role-success" alert

    When I search for "role_no_desc" in the data table
    Then I should see "role_no_desc" entry in the data table

  @cleanup
  Scenario: Delete role role_no_desc
    Given I delete role "role_no_desc"

  @test
  Scenario: Cancel creation of a role
    Given I am logged in as admin
    And I am on "roles" page

    When I search for "cancel_role" in the data table
    Then I should not see "cancel_role" entry in the data table

    When I click on the "roles-button-add" button
    Then I should see "add-role-modal" modal

    When I type in the "modal-textbox-role-name" textbox text "cancel_role"
    Then I should see "cancel_role" in the "modal-textbox-role-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-role-modal" modal

    When I search for "cancel_role" in the data table
    Then I should not see "cancel_role" entry in the data table

  @seed
  Scenario: Create role for deletion test
    Given role "delete_me_role" exists

  @test
  Scenario: Delete a single role
    Given I am logged in as admin
    And I am on "roles" page

    When I search for "delete_me_role" in the data table
    Then I should see "delete_me_role" entry in the data table

    When I select entry "delete_me_role" in the data table
    Then I should see "delete_me_role" entry selected in the data table

    When I click on the "roles-button-delete" button
    Then I should see "delete-roles-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-roles-modal" modal
    And I should see "remove-roles-success" alert

    When I search for "delete_me_role" in the data table
    Then I should not see "delete_me_role" entry in the data table

  @seed
  Scenario: Create roles for multiple deletion test
    Given role "role_to_delete_1" exists
    And role "role_to_delete_2" exists

  @test
  Scenario: Delete multiple roles
    Given I am logged in as admin
    And I am on "roles" page

    When I search for "role_to_delete_1" in the data table
    Then I should see "role_to_delete_1" entry in the data table
    When I select entry "role_to_delete_1" in the data table
    Then I should see "role_to_delete_1" entry selected in the data table

    When I search for "role_to_delete_2" in the data table
    Then I should see "role_to_delete_2" entry in the data table
    When I select entry "role_to_delete_2" in the data table
    Then I should see "role_to_delete_2" entry selected in the data table

    When I click on the "roles-button-delete" button
    Then I should see "delete-roles-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-roles-modal" modal
    And I should see "remove-roles-success" alert

    When I search for "role_to_delete_1" in the data table
    Then I should not see "role_to_delete_1" entry in the data table

    When I search for "role_to_delete_2" in the data table
    Then I should not see "role_to_delete_2" entry in the data table
