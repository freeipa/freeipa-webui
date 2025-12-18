Feature: Hostgroup management

    @test
    Scenario: Create new host group
        Given I am logged in as admin
        And I am on "host-groups" page

        When I create hostgroup "my_automember_hostgroup" with description "test"
        Then I should see hostgroup "my_automember_hostgroup" in the data table


    @test
    Scenario: Delete host group
        Given Hostgroup "my_automember_hostgroup" with description "test" exists

        Given I am logged in as admin
        And I am on "host-groups" page

        When I try to delete hostgroup "my_automember_hostgroup"
        Then I should not see hostgroup "my_automember_hostgroup" in the data table
