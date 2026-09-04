Feature: Privilege permissions manipulation
  Manage permissions assigned to privileges

  @seed
  Scenario: Create seed data (privilege for add permission test)
    Given privilege "add_perm_privilege" exists
    And permission "a_permission_add" exists

  @test
  Scenario: Add a permission to the privilege
    Given I am logged in as admin
    And I am on "privileges/add_perm_privilege/permissions" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I search for "a_permission_add" in the dual list
    Then I should see "item-a_permission_add" dual list item on the left

    When I click on "item-a_permission_add" dual list item
    Then I should see "item-a_permission_add" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-a_permission_add" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-permission-success" alert
    And I should see "a_permission_add" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete privilege "add_perm_privilege"
    And I delete permission "a_permission_add"

  @seed
  Scenario: Create seed data (privilege with permission for removal)
    Given privilege "remove_perm_privilege" exists
    And permission "a_permission_remove" exists
    And permission "a_permission_remove" is member of privilege "remove_perm_privilege"

  @test
  Scenario: Remove a permission from the privilege
    Given I am logged in as admin
    And I am on "privileges/remove_perm_privilege/permissions" page

    Then I should see "a_permission_remove" entry in the data table

    When I check entry "a_permission_remove" in the data table
    Then I should see "a_permission_remove" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-permission-success" alert
    And I should not see "a_permission_remove" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete privilege "remove_perm_privilege"
    And I delete permission "a_permission_remove"

  @seed
  Scenario: Create seed data for permissions search test
    Given privilege "search_perm_privilege" exists
    And permission "a_permission_alpha" exists
    And permission "a_permission_beta" exists
    And permission "a_permission_alpha" is member of privilege "search_perm_privilege"
    And permission "a_permission_beta" is member of privilege "search_perm_privilege"

  @test
  Scenario: Search permissions
    Given I am logged in as admin
    And I am on "privileges/search_perm_privilege/permissions" page

    Then I should see "a_permission_alpha" entry in the data table
    And I should see "a_permission_beta" entry in the data table

    When I search for "alpha" in the members table
    Then I should see "a_permission_alpha" entry in the data table
    And I should not see "a_permission_beta" entry in the data table

    When I clear the search in the members table
    Then I should see "a_permission_alpha" entry in the data table
    And I should see "a_permission_beta" entry in the data table

  @test
  Scenario: Search permissions with no match
    Given I am logged in as admin
    And I am on "privileges/search_perm_privilege/permissions" page

    When I search for "notthere" in the members table
    Then I should not see "notthere" entry in the data table
    And I should not see "a_permission_alpha" entry in the data table
    And I should not see "a_permission_beta" entry in the data table

  @cleanup
  Scenario: Cleanup permissions search test data
    Given I delete privilege "search_perm_privilege"
    And I delete permission "a_permission_alpha"
    And I delete permission "a_permission_beta"

  @seed
  Scenario: Create seed data for cancel add test
    Given privilege "cancel_add_privilege" exists
    And permission "a_permission_cancel_add" exists

  @test
  Scenario: Cancel adding a permission
    Given I am logged in as admin
    And I am on "privileges/cancel_add_privilege/permissions" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I search for "a_permission_cancel_add" in the dual list
    Then I should see "item-a_permission_cancel_add" dual list item on the left

    When I click on "item-a_permission_cancel_add" dual list item
    Then I should see "item-a_permission_cancel_add" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-a_permission_cancel_add" dual list item on the right

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-add-modal" modal
    And I should not see "a_permission_cancel_add" entry in the data table

  @cleanup
  Scenario: Cleanup cancel add test data
    Given I delete privilege "cancel_add_privilege"
    And I delete permission "a_permission_cancel_add"

  @seed
  Scenario: Create seed data for cancel delete test
    Given privilege "cancel_delete_privilege" exists
    And permission "a_permission_cancel_delete" exists
    And permission "a_permission_cancel_delete" is member of privilege "cancel_delete_privilege"

  @test
  Scenario: Cancel removing a permission
    Given I am logged in as admin
    And I am on "privileges/cancel_delete_privilege/permissions" page

    Then I should see "a_permission_cancel_delete" entry in the data table

    When I check entry "a_permission_cancel_delete" in the data table
    Then I should see "a_permission_cancel_delete" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal
    And I should see "a_permission_cancel_delete" entry in the data table

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "a_permission_cancel_delete" entry in the data table

  @cleanup
  Scenario: Cleanup cancel delete test data
    Given I delete privilege "cancel_delete_privilege"
    And I delete permission "a_permission_cancel_delete"
