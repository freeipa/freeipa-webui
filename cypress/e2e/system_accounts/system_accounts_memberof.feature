Feature: System account is a member of
  Work with system account Is a member of section and its operations

  @seed
  Scenario: Create seed data (system account and role)
    Given system account "memberof_sysaccount" exists with password "Secret123"
    And role "sysaccount_test_role" exists

  @test
  Scenario: Add a Role membership to the system account
    Given I am logged in as admin
    And I am on "system-accounts/memberof_sysaccount/member_role" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-sysaccount_test_role" dual list item on the left

    When I click on "item-sysaccount_test_role" dual list item
    Then I should see "item-sysaccount_test_role" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-sysaccount_test_role" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    Then I should see "sysaccount_test_role" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete system account "memberof_sysaccount"
    And I delete role "sysaccount_test_role"

  @seed
  Scenario: Create seed data (system account with role membership)
    Given system account "remove_memberof_sa" exists with password "Secret123"
    And role "remove_sa_role" exists
    And system account "remove_memberof_sa" is member of role "remove_sa_role"

  @test
  Scenario: Remove a Role membership from the system account
    Given I am logged in as admin
    And I am on "system-accounts/remove_memberof_sa/member_role" page

    When I select entry "remove_sa_role" in the members table
    Then I should see "remove_sa_role" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-roles-success" alert

    When I search for "remove_sa_role" in the members table
    Then I should not see "remove_sa_role" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete system account "remove_memberof_sa"
    And I delete role "remove_sa_role"
