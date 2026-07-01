Feature: Role privileges manipulation
  Manage privileges assigned to roles

  @seed
  Scenario: Create seed data (role for add privilege test)
    Given role "priv_test_role" exists

  @test
  Scenario: Add a privilege to the role
    Given I am logged in as admin
    And I am on "roles/priv_test_role/privileges" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-Host Enrollment" dual list item
    Then I should see "item-Host Enrollment" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-Host Enrollment" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-privilege-success" alert

  @cleanup
  Scenario: Cleanup seed data
    Given I delete role "priv_test_role"

  @seed
  Scenario: Create seed data (role with privilege for removal)
    Given role "remove_priv_role" exists
    And privilege "Host Enrollment" is member of role "remove_priv_role"

  @test
  Scenario: Remove a privilege from the role
    Given I am logged in as admin
    And I am on "roles/remove_priv_role/privileges" page

    Then I should see "Host Enrollment" entry in the data table

    When I check entry "Host Enrollment" in the data table
    Then I should see "Host Enrollment" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-privilege-success" alert

    Then I should not see "Host Enrollment" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete role "remove_priv_role"

  @seed
  Scenario: Create seed data (role for button state test)
    Given role "button_state_priv_role" exists

  @test
  Scenario: Delete button is disabled when no privileges selected
    Given I am logged in as admin
    And I am on "roles/button_state_priv_role/privileges" page

    Then I should see the "member-of-button-delete" button is disabled
    And I should see the "member-of-button-add" button is enabled
    And I should see the "member-of-button-refresh" button is enabled

  @cleanup
  Scenario: Cleanup seed data
    Given I delete role "button_state_priv_role"
