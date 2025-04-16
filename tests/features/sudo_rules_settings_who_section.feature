Feature: Sudo rules - Settings page > 'Who' section
    Modify the 'Who' section of the sudo rules settings page

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

    # 'Who' subsection
    # - Users tab
    Scenario: Add a new user
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on "Add users" button
        Then I see a modal with title text "Add user into sudo rule sudoRule2"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "admin"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "admin" entry in the data table

    Scenario: Remove user from table
        Given I should see "admin" entry in the data table
        When I select "admin" entry with no link in the data table
        And I click on "Delete" button
        And the "admin" element should be in the dialog table with id "remove-users-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "admin" entry in the data table

    # - Host groups tab
    Scenario: Add a new user group
        When I click on "User groups" page tab
        And I click on "Add groups" button
        Then I see a modal with title text "Add group into sudo rule sudoRule2"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "admins"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "admins" entry in the data table

    Scenario: Remove user group from table
        Given I should see "admins" entry in the data table
        When I select "admins" entry with no link in the data table
        And I click on "Delete" button
        And the "admins" element should be in the dialog table with id "remove-groups-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "admins" entry in the data table

    Scenario: Change user category - 'Specify Users and Groups' to 'Anyone'
        When I click on the "Anyone" option under ID "usercategory" toggle group
        And I click on "Save" button
        And I should see "success" alert with text "Sudo rule modified"
        Then I close the alert
        And I should see "Anyone" selected in the ID "usercategory" toggle group

    # - Sudo rule
    Scenario: Delete the rule
        Given I click on the breadcrump link "Sudo rules"
        Given I should see partial "sudoRule2" entry in the data table
        When I select entry "sudoRule2" in the data table
        * I click on "Delete" button
        When I see "Remove sudo rule" modal
        * I should see "sudoRule2" entry in the data table
        * in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Sudo rules removed"
        Then I close the alert
        Then I should not see "sudoRule2" entry in the data table