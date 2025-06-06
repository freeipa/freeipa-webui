Feature: Sudo rules - Settings page > 'As whom' section
    Modify the 'As whom' section of the sudo rules settings page

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

    # 'As whom' subsection
    # - Prep: Create a new user to work with
    Scenario: Add a new user
        Given I am on "active-users" page
        When I click on "Add" button
        * I type in the field "First name" text "Han"
        * I type in the field "Last name" text "Solo"
        * in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New user added"
        Then I close the alert
        Then I should see "hsolo" entry in the data table
    # - RunAs User
    Scenario: Add a new runAs user
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on "RunAs Users" page tab
        When I click on ID "add-runas-user" button
        Then I see a modal with title text "Add RunAs user into sudo rule sudoRule2"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "hsolo"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "hsolo" entry in the data table

    Scenario: Remove runAs user from table
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        Given I should see "hsolo" entry in the data table with ID "keytab-user-table"
        When I select "hsolo" entry with no link in the data table
        And I click on "Delete" button
        And the "hsolo" element should be in the dialog table with id "remove-users-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "hsolo" entry in the data table

    # -- Remove hsolo user
    Scenario: Cleanup: Delete 'hsolo' user
        Given I am on "active-users" page
        Given I should see partial "hsolo" entry in the data table
        Then I select partial entry "hsolo" in the data table
        When I click on "Delete" button
        * I see "Remove Active Users" modal
        * I should see partial "hsolo" entry in the data table
        When in the modal dialog I check "Delete" radio selector
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Users removed"
        Then I close the alert
        Then I should not see "hsolo" entry in the data table

    # - Group of runAs users
    Scenario: Add a new group of runAs users
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on "Groups of RunAs Users" page tab
        And I click on ID "add-runas-group" button
        Then I see a modal with title text "Add host group into sudo rule sudoRule2"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "admins"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "admins" entry in the data table

    Scenario: Remove group of runAs users from table
        Given I should see "admins" entry in the data table with ID "keytab-group-table"
        When I select "admins" entry with no link in the data table
        And I click on "Delete" button
        And the "admins" element should be in the dialog table with id "remove-groups-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "admins" entry in the data table

    # - RunAs Groups
    # -- Prep: Create a new group to work with
    Scenario: Add a new group
        Given I am on "user-groups" page
        When I click on "Add" button
        * I type in the field "Group name" text "super_group"
        * in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New user group added"
        * I close the alert
        Then I should see "super_group" entry in the data table

    Scenario: Add a new runAs group
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on ID "add-runas-group-group" button
        Then I see a modal with title text "Add RunAs groups into sudo rule sudoRule2"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "super_group"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "super_group" entry in the data table with ID "keytab-group-table"

    Scenario: Remove runAs group from table
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        Given I should see "super_group" entry in the data table with ID "keytab-group-table"
        When I select "super_group" entry with no link in the data table
        And I click on "Delete" button
        And the "super_group" element should be in the dialog table with id "remove-groups-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "super_group" entry in the data table with ID "keytab-group-table"

    Scenario: Change runAs user and group categories
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on the "Anyone" option under ID "ipasudorunasusercategory" toggle group
        When I click on the "Any Group" option under ID "ipasudorunasgroupcategory" toggle group
        And I click on "Save" button
        And I should see "success" alert with text "Sudo rule modified"
        Then I close the alert
        And I should see "Anyone" selected in the ID "ipasudorunasusercategory" toggle group
        And I should see "Any Group" selected in the ID "ipasudorunasgroupcategory" toggle group

    # -- Cleanup: Delete 'super_group' group
    Scenario: Cleanup: Delete 'super_group' group
        Given I am on "user-groups" page
        Given I should see "super_group" entry in the data table
        Then I select entry "super_group" in the data table
        When I click on "Delete" button
        * I see "Remove user groups" modal
        * I should see "super_group" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "User groups removed"
        When I close the alert
        Then I should not see "super_group" entry in the data table

    # - Cleanup: Sudo rule
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