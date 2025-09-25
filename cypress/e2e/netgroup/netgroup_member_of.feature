Feature: Netgroup Member Of manipulation
    Manage netgroup membership in the "Member of" section

    @seed
    Scenario: Create netgroups
        Given netgroup "my_netgroup" exists
        And netgroup "my_netgroup_2" exists

    @test
    Scenario: Add a netgroup member into the new netgroup
        Given I am logged in as admin
        And I am on "netgroups/my_netgroup" page

        When I click on the "netgroups-tab-memberof" tab
        Then I should see "netgroups-tab-memberof" tab

        When I click on the "member-of-button-add" button
        Then I should see "member-of-add-modal" modal
        And I should see "item-my_netgroup_2" dual list item on the left

        When I click on "item-my_netgroup_2" dual list item
        Then I should see "item-my_netgroup_2" dual list item selected

        When I click on the "dual-list-add-selected" button
        Then I should see "item-my_netgroup_2" dual list item on the right

        When I click on the "modal-button-add" button
        Then I should not see "member-of-add-modal" modal
        And I should see "add-member-success" alert
        And I should see "my_netgroup_2" entry in the data table

    @test
    Scenario: Search for a netgroup member
        Given I am logged in as admin
        And I am on "netgroups/my_netgroup" page

        When I click on the "netgroups-tab-memberof" tab
        Then I should see "netgroups-tab-memberof" tab

        When I search for "my_netgroup_2" in the members table
        Then I should see "my_netgroup_2" entry in the data table
        And I should not see "my_netgroup" entry in the data table

        When I search for "notthere" in the members table
        Then I should not see "notthere" entry in the data table
        And I should not see "my_netgroup_2" entry in the data table

    @test
    Scenario: Delete a netgroup member from the netgroup
        Given I am logged in as admin
        And I am on "netgroups/my_netgroup" page

        When I click on the "netgroups-tab-memberof" tab
        Then I should see "netgroups-tab-memberof" tab

        When I select entry "my_netgroup_2" in the members table
        Then I should see "my_netgroup_2" entry selected in the data table
        When I click on the "member-of-button-delete" button
        Then I should see "member-of-delete-modal" modal
        And I should see "my_netgroup_2" entry in the data table

        When I click on the "modal-button-delete" button
        Then I should not see "member-of-delete-modal" modal
        And I should see "remove-netgroups-success" alert
        And I should not see "my_netgroup_2" entry in the data table

    @cleanup
    Scenario: Delete netgroups
        Given I delete netgroup "my_netgroup"
        And I delete netgroup "my_netgroup_2"
