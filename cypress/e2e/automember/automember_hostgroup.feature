Feature: Automember hostgroup management

    @test
    Scenario: Create new hostgroup rule
        Given Hostgroup "my_automember_hostgroup" with description "test" exists

        Given I am logged in as admin
        And I am on "host-group-rules" page

        When I create hostgroup rule based on hostgroup "my_automember_hostgroup"
        Then I should see hostgroup rule "my_automember_hostgroup" in the hostgroup rule list


    @test
    Scenario: Set default hostgroup rule
        Given Hostgroup "my_automember_hostgroup" with description "test" exists

        Given I am logged in as admin
        And I am on "host-group-rules" page
        And hostgroup rule "my_automember_hostgroup" exists


        When I set default hostgroup rule "my_automember_hostgroup"
        Then I should see hostgroup rule "my_automember_hostgroup" as the default hostgroup rule


    @test
    Scenario: Delete automember hostgroup rule and hostgroup
        Given Hostgroup "my_automember_hostgroup" with description "test" exists
        And hostgroup rule "my_automember_hostgroup" exists

        Given I am logged in as admin
        And I am on "host-group-rules" page

        When I try to delete hostgroup rule "my_automember_hostgroup"
        Then I should not see hostgroup rule "my_automember_hostgroup" in the hostgroup rule list

        # Given I am on "host-groups" page
        When I try to delete hostgroup "my_automember_hostgroup"
        Then I should not see hostgroup "my_automember_hostgroup" in the data table

