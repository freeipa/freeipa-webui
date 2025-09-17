Feature: Usergroup member managers
  Manage user group member managers across Users and User groups tabs

  @seed
  Scenario: Create seed data (user and user group)
    Given User "mmuser" "Member" "Manager" exists and is using password "Secret123"
    And user group "member-managers-group" exists

  @test
  Scenario: Add a User member manager into the user group
    Given I am logged in as admin
    And I am on "user-groups/member-managers-group/manager_user" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-mmuser" dual list item on the left

    When I click on "item-mmuser" dual list item
    Then I should see "item-mmuser" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-mmuser" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-managers-success" alert

    When I search for "mmuser" in the data table
    Then I should see "mmuser" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user "mmuser"
    And I delete user group "member-managers-group"

  @seed
  Scenario: Create seed data (user and user group)
    Given User "mmuser" "Member" "Manager" exists and is using password "Secret123"
    And user group "member-managers-group" exists
    And user "mmuser" is manager of group "member-managers-group"

  @test
  Scenario: Remove User member manager from the user group
    Given I am logged in as admin
    And I am on "user-groups/member-managers-group/manager_user" page

    When I select entry "mmuser" in the data table
    Then I should see "mmuser" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-member-managers-success" alert

    When I search for "mmuser" in the data table
    Then I should not see "mmuser" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user "mmuser"
    And I delete user group "member-managers-group"

  @seed
  Scenario: Create seed data (user group)
    Given user group "member-managers-group" exists

  @test
  Scenario: Add a User group member manager into the user group
    Given I am logged in as admin
    And I am on "user-groups/member-managers-group/manager_usergroup" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-editors" dual list item on the left

    When I click on "item-editors" dual list item
    Then I should see "item-editors" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-editors" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-managers-success" alert

    When I search for "editors" in the data table
    Then I should see "editors" entry in the data table

  @test
  Scenario: Remove User group member manager from the user group
    Given I am logged in as admin
    And I am on "user-groups/member-managers-group/manager_usergroup" page

    When I select entry "editors" in the data table
    Then I should see "editors" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-member-managers-success" alert

    When I search for "editors" in the data table
    Then I should not see "editors" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "member-managers-group"
