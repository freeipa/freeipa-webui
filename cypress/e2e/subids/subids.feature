Feature: Subordinate IDs manipulation
  Create subordinate IDs

  @seed
  Scenario: Prep: Create new user
    Given User "testuser" "Test" "User" exists and is using password "Secret123"

  @test
  Scenario: Add a new subordinate ID
    Given I am logged in as admin
    And I am on "subordinate-ids" page

    When I click on the "subids-button-add" button
    Then I should see "add-subid-modal" modal

    When I select "testuser" option in the "modal-simple-owner-select" selector
    Then I should see "testuser" option in the "modal-simple-owner-select" selector

    When I click on the "modal-button-add" button
    Then I should not see "add-subid-modal" modal
    And I should see "add-subid-success" alert

  @cleanup
  Scenario: Cleanup: Delete a user
    Given I delete user "testuser"
