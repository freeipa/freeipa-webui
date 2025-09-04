Feature: Automember hostgroup management

    @seed
    Scenario: Create new host group
        Given Hostgroup "my_automember_hostgroup" with description "test" exists

    @test
    Scenario: Create new hostgroup rule
        Given I am logged in as admin
        And I am on "host-group-rules" page

        When I create hostgroup rule based on hostgroup "my_automember_hostgroup"
        Then I should see hostgroup rule "my_automember_hostgroup" in the hostgroup rule list


    @test
    Scenario: Set default hostgroup rule
        Given I am logged in as admin
        And I am on "host-group-rules" page

        When I set default hostgroup rule "my_automember_hostgroup"
        Then I should see hostgroup rule "my_automember_hostgroup" as the default hostgroup rule

    @cleanup
    Scenario: Delete host group rule
        Given I delete hostgroup rule "my_automember_hostgroup"

    @cleanup
    Scenario: Delete host group
        Given I delete hostgroup "my_automember_hostgroup"

    @seed
    Scenario: Create new automember host group
        Given hostgroup rule "my_automember_hostgroup" exists

    @test
    Scenario: Delete automember hostgroup rule and hostgroup
        Given I am logged in as admin
        And I am on "host-group-rules" page
        When I try to delete hostgroup rule "my_automember_hostgroup"
        Then I should not see hostgroup rule "my_automember_hostgroup" in the hostgroup rule list

        # Given I am on "host-groups" page
        When I try to delete hostgroup "my_automember_hostgroup"
        Then I should not see hostgroup "my_automember_hostgroup" in the data table

