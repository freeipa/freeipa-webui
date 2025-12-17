Feature: Automember user group management


    @test
    Scenario: Create new user group rule
        Given user group "my_automember_usergroup" exists

        Given I am logged in as admin
        And I am on "user-group-rules" page

        When I create user group rule based on user group "my_automember_usergroup"
        Then I should see user group rule "my_automember_usergroup" in the user group rule table

    @test
    Scenario: Set default user group rule
        Given user group "my_automember_usergroup" exists

        Given I am logged in as admin
        And I am on "user-group-rules" page

        When I set default user group rule "my_automember_usergroup"
        Then I should see user group rule "my_automember_usergroup" as the default user group rule


    @test
    Scenario: Delete automember user group rule
        Given user group "my_automember_usergroup" exists
        And user group rule "my_automember_usergroup" exists

        Given I am logged in as admin
        And I am on "user-group-rules" page
        When I try to delete user group rule "my_automember_usergroup"
        Then I should not see user group rule "my_automember_usergroup" in the user group rule table


