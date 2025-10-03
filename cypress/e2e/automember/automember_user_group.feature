Feature: Automember user group management

    @seed
    Scenario: Create new user group
        Given user group "my_automember_usergroup" exists

    @test
    Scenario: Create new user group rule
        Given I am logged in as admin
        And I am on "user-group-rules" page

        When I create user group rule based on user group "my_automember_usergroup"
        Then I should see user group rule "my_automember_usergroup" in the user group rule table

    @test
    Scenario: Set default user group rule
        Given I am logged in as admin
        And I am on "user-group-rules" page

        When I set default user group rule "my_automember_usergroup"
        Then I should see user group rule "my_automember_usergroup" as the default user group rule

    @cleanup
    Scenario: Delete user group rule
        Given I delete user group rule "my_automember_usergroup"

    @cleanup
    Scenario: Delete user group
        Given I delete user group "my_automember_usergroup"

    @seed
    Scenario: Create new automember user group
        Given user group rule "my_automember_usergroup" exists

    @test
    Scenario: Delete automember user group rule
        Given I am logged in as admin
        And I am on "user-group-rules" page
        When I try to delete user group rule "my_automember_usergroup"
        Then I should not see user group rule "my_automember_usergroup" in the user group rule table

    @cleanup
    Scenario: Delete user group
        Given I delete user group "my_automember_usergroup"

