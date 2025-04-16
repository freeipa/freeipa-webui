Feature: Sudo rules - Settings page > 'Access this host' section
    Modify the 'Access this host' section of the sudo rules settings page

    Background:
        Given I am logged in as "Administrator"

    # Create test entry
    Scenario: Add a new rule
        Given I am on "sudo-rules" page
        When I click on "Add" button
        And I type in the field "Rule name" text "sudoRule2"
        When in the modal dialog I click on "Add" button
        And I should see "success" alert with text "New sudo rule added"
        Then I close the alert
        And I should see "sudoRule2" entry in the data table

    # 'Access this host' subsection
    # - Prep a new host to add
    Scenario: Add a new host from the 'Hosts' page
        Given I am on "hosts" page
        When I click on "Add" button
        * I type in the field "Host name" text "my-temp-server"
        * I click on "Force" checkbox in modal
        * in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New host added"
        Then I close the alert
        Then I should see partial "my-temp-server" entry in the data table

    Scenario: Add a new host from the 'Sudo rules' page
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on "Add hosts" button
        Then I see a modal with title text "Add host into sudo rule sudoRule2"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "my-temp-server"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see partial "my-temp-server" entry in the data table


    Scenario: Remove host from table
        Given I should see partial "my-temp-server" entry in the data table
        When I select "my-temp-server" entry with no link in the data table
        And I click on "Delete" button
        And the "my-temp-server" element should be in the dialog table with id "remove-hosts-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "my-temp-server" entry in the data table


    # -- Prep a new host group to add
    Scenario: Add a new host group from the 'Host groups' page
        Given I am on "host-groups" page
        When I click on "Add" button
        * I type in the field "Group name" text "a_host_group2"
        When in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New host group added"
        Then I close the alert
        Then I should see "a_host_group2" entry in the data table

    Scenario: Add a new host group from the 'Sudo rules' page
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on "Host groups" page tab
        And I click on "Add hostgroups" button
        Then I see a modal with title text "Add host group into sudo rule sudoRule2"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "a_host_group2"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "a_host_group2" entry in the data table

    Scenario: Remove host group from table
        Given I should see "a_host_group2" entry in the data table
        When I select "a_host_group2" entry with no link in the data table
        And I click on "Delete" button
        And the "a_host_group2" element should be in the dialog table with id "remove-hostgroups-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "a_host_group2" entry in the data table

    Scenario: Change host category - 'Specified Hosts and Groups' to 'Any host'
        When I click on the "Anyone" option under ID "hostcategory" toggle group
        And I click on "Save" button
        And I should see "success" alert with text "Sudo rule modified"
        Then I close the alert
        And I should see "Anyone" selected in the ID "hostcategory" toggle group

    # Cleanup of created entities
    # - Host
    Scenario: Delete a host
        Given I am on "hosts" page
        Given I should see partial "my-temp-server" entry in the data table
        Then I select partial entry "my-temp-server" in the data table
        When I click on "Delete" button
        * I see "Remove hosts" modal
        * I should see partial "my-temp-server" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Hosts removed"
        Then I close the alert
        Then I should not see "my-temp-server" entry in the data table

    # - Host group
    Scenario: Delete a host group
        Given I am on "host-groups" page
        Given I should see "a_host_group2" entry in the data table
        Then I select entry "a_host_group2" in the data table
        When I click on "Delete" button
        * I see "Remove host groups" modal
        * I should see "a_host_group2" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Host groups removed"
        Then I close the alert
        Then I should not see "a_host_group2" entry in the data table

    # - Sudo rule
    Scenario: Delete the rule
        Given I am on "sudo-rules" page
        Given I should see partial "sudoRule2" entry in the data table
        When I select entry "sudoRule2" in the data table
        * I click on "Delete" button
        When I see "Remove sudo rule" modal
        * I should see "sudoRule2" entry in the data table
        * in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Sudo rules removed"
        Then I close the alert
        Then I should not see "sudoRule2" entry in the data table