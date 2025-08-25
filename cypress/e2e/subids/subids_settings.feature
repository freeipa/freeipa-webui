Feature: Subordinate IDs - Settings page
  Modify Subodinate IDs settings

  @seed
  Scenario: Prep: Create new user
    Given User "testuser" "Test" "User" exists and is using password "Secret123"
    And subid for owner "testuser" exists

  # This test assumes that there is only one single subordinate ID in the table
  # because we don't know the ID of the subordinate ID
  @test
  Scenario: Set 'Description' field
    Given I am logged in as admin
    Given I am on "subordinate-ids" page

    When I click on the first subid
    Then I should be on the subid settings page

    When I type in the "subids-tab-settings-textbox-description" textbox text "test_user"
    Then I should see "test_user" in the "subids-tab-settings-textbox-description" textbox

    When I click on the "subids-tab-settings-button-save" button
    Then I should see "success" alert

  @cleanup
  Scenario: Cleanup: Delete user
    Given I delete user "testuser"
