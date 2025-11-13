Feature: User settings page > Car license field exists
    Verify that a textbox field "Car license" with data-cy "user-tab-settings-textbox-car-license" exists on the users' settings page

    @seed
    Scenario: Prep: Create user for testing
        Given User "testuser" "Test" "User" exists and is using password "Secret123"

    @test
    Scenario: Car license field exists on user settings page
        Given I am logged in as admin
        And I am on "active-users/testuser" page
        Then I should see a textbox with data-cy "user-tab-settings-textbox-car-license"

    @cleanup
    Scenario: Cleanup: Delete created user
        Given I delete user "testuser"

