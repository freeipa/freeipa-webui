Feature: Privilege roles manipulation
  Manage roles assigned to privileges

  @seed
  Scenario: Create seed data (privilege for add role test)
    Given privilege "add_role_privilege" exists
    And role "add_role_test" exists

  @test
  Scenario: Add a role to the privilege
    Given I am logged in as admin
    And I am on "privileges/add_role_privilege/member_role" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-add_role_test" dual list item
    Then I should see "item-add_role_test" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-add_role_test" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert
    And I should see "add_role_test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete privilege "add_role_privilege"
    And I delete role "add_role_test"

  @seed
  Scenario: Create seed data (privilege with role for removal)
    Given privilege "remove_role_privilege" exists
    And role "remove_role_test" exists
    And privilege "remove_role_privilege" is member of role "remove_role_test"

  @test
  Scenario: Remove a role from the privilege
    Given I am logged in as admin
    And I am on "privileges/remove_role_privilege/member_role" page

    Then I should see "remove_role_test" entry in the data table

    When I check entry "remove_role_test" in the data table
    Then I should see "remove_role_test" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-members-success" alert
    And I should not see "remove_role_test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete privilege "remove_role_privilege"
    And I delete role "remove_role_test"

  @seed
  Scenario: Create seed data for roles search test
    Given privilege "search_role_privilege" exists
    And role "search_role_alpha" exists
    And role "search_role_beta" exists
    And privilege "search_role_privilege" is member of role "search_role_alpha"
    And privilege "search_role_privilege" is member of role "search_role_beta"

  @test
  Scenario: Search roles
    Given I am logged in as admin
    And I am on "privileges/search_role_privilege/member_role" page

    Then I should see "search_role_alpha" entry in the data table
    And I should see "search_role_beta" entry in the data table

    When I search for "alpha" in the members table
    Then I should see "search_role_alpha" entry in the data table
    And I should not see "search_role_beta" entry in the data table

    When I clear the search in the members table
    Then I should see "search_role_alpha" entry in the data table
    And I should see "search_role_beta" entry in the data table

  @test
  Scenario: Search roles with no match
    Given I am logged in as admin
    And I am on "privileges/search_role_privilege/member_role" page

    When I search for "notthere" in the members table
    Then I should not see "notthere" entry in the data table
    And I should not see "search_role_alpha" entry in the data table
    And I should not see "search_role_beta" entry in the data table

  @cleanup
  Scenario: Cleanup roles search test data
    Given I delete privilege "search_role_privilege"
    And I delete role "search_role_alpha"
    And I delete role "search_role_beta"

  @seed
  Scenario: Create seed data for cancel add test
    Given privilege "cancel_add_role_privilege" exists
    And role "cancel_add_role_test" exists

  @test
  Scenario: Cancel adding a role
    Given I am logged in as admin
    And I am on "privileges/cancel_add_role_privilege/member_role" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-cancel_add_role_test" dual list item
    Then I should see "item-cancel_add_role_test" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-cancel_add_role_test" dual list item on the right

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-add-modal" modal
    And I should not see "cancel_add_role_test" entry in the data table

  @cleanup
  Scenario: Cleanup cancel add test data
    Given I delete privilege "cancel_add_role_privilege"
    And I delete role "cancel_add_role_test"

  @seed
  Scenario: Create seed data for cancel delete test
    Given privilege "cancel_delete_role_privilege" exists
    And role "cancel_delete_role_test" exists
    And privilege "cancel_delete_role_privilege" is member of role "cancel_delete_role_test"

  @test
  Scenario: Cancel removing a role
    Given I am logged in as admin
    And I am on "privileges/cancel_delete_role_privilege/member_role" page

    Then I should see "cancel_delete_role_test" entry in the data table

    When I check entry "cancel_delete_role_test" in the data table
    Then I should see "cancel_delete_role_test" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal
    And I should see "cancel_delete_role_test" entry in the data table

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "cancel_delete_role_test" entry in the data table

  @cleanup
  Scenario: Cleanup cancel delete test data
    Given I delete privilege "cancel_delete_role_privilege"
    And I delete role "cancel_delete_role_test"
