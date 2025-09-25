Feature: Usergroup is a member of
  Work with usergroup Is a member of section and its operations in all the available tabs

  @seed
  Scenario: Create seed data (User group)
    Given user group "a-group" exists

  @test
  Scenario: Add a User groups membership to the user group
    Given I am logged in as admin
    And I am on "user-groups/a-group/memberof_usergroup" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-editors" dual list item on the left

    When I click on "item-editors" dual list item
    Then I should see "item-editors" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-editors" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "editors" in the members table
    Then I should see "editors" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "a-group"

  @seed
  Scenario: Create seed data (User group)
    Given user group "a-group" exists
    And user group "a-group" is member of group "editors"

  @test
  Scenario: Delete a User groups membership from the user group
    Given I am logged in as admin
    And I am on "user-groups/a-group/memberof_usergroup" page

    When I select entry "editors" in the members table
    Then I should see "editors" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-user-groups-success" alert

    When I search for "editors" in the members table
    Then I should not see "editors" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "a-group"

  # Add Netgroups

  @seed
  Scenario: Create seed data (User group)
    Given user group "a-group" exists

  @test
  Scenario: Add a role membership to the user group
    Given I am logged in as admin
    And I am on "user-groups/a-group/memberof_role" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-helpdesk" dual list item on the left

    When I click on "item-helpdesk" dual list item
    Then I should see "item-helpdesk" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-helpdesk" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "helpdesk" in the members table
    Then I should see "helpdesk" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "a-group"

  @seed
  Scenario: Create seed data (User group)
    Given user group "a-group" exists
    And user group "a-group" is member of role "helpdesk"

  @test
  Scenario: Delete a role membership from the user group
    Given I am logged in as admin
    And I am on "user-groups/a-group/memberof_role" page

    When I select entry "helpdesk" in the members table
    Then I should see "helpdesk" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-roles-success" alert

    When I search for "helpdesk" in the members table
    Then I should not see "helpdesk" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "a-group"
  
  @seed
  Scenario: Create seed data (User group and HBAC rule)
    Given hbac rule "test" exists
    And user group "a-group" exists

  @test
  Scenario: Add a hbac rule membership to the user group
    Given I am logged in as admin
    And I am on "user-groups/a-group/memberof_hbacrule" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-test" dual list item on the left

    When I click on "item-test" dual list item
    Then I should see "item-test" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-test" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "test" in the members table
    Then I should see "test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "a-group"
    And I delete hbac rule "test"

  @seed
  Scenario: Create seed data (User group)
    Given user group "a-group" exists
    And hbac rule "test" exists
    And user group "a-group" is member of hbac rule "test"

  @test
  Scenario: Delete a role membership from the user group
    Given I am logged in as admin
    And I am on "user-groups/a-group/memberof_hbacrule" page

    When I select entry "test" in the members table
    Then I should see "test" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-hbac-rules-success" alert

    When I search for "test" in the members table
    Then I should not see "test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "a-group"
    And I delete hbac rule "test"

  # Add Sudo rules
