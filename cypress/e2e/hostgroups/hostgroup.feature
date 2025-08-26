Feature: Hostgroup management

    @test
    Scenario: Create new host group
        Given I am logged in as admin
        And I am on "host-groups" page

        When I create hostgroup "my_automember_hostgroup" with description "test"
        Then I should see hostgroup "my_automember_hostgroup" in the data table

    @cleanup
    Scenario: Delete host group
        Given I delete hostgroup "my_automember_hostgroup"

    @seed
    Scenario: Create new host group
        Given Hostgroup "my_automember_hostgroup" with description "test" exists

    @test
    Scenario: Delete host group
        Given I am logged in as admin
        And I am on "host-groups" page

        When I delete hostgroup "my_automember_hostgroup"
        Then I should not see hostgroup "my_automember_hostgroup" in the data table
