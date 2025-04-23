Feature: Sudo rules - Settings page > 'Run commands' section
    Modify the 'Run commands' section of the sudo rules settings page

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

    # 'Run command' subsection
    # - Allow
    # -- Prep a new command to add from the 'Sudo commands' page
    Scenario: Add a new sudo commands
        Given I am on "sudo-commands" page
        When I click on "Add" button
        * I type in the field "Command name" text "command1"
        * I type in the field "Description" text "my description"
        * in the modal dialog I click on "Add and add another" button
        * I should see "success" alert with text "New sudo command added"
        * I close the alert
        * I type in the field "Command name" text "command2"
        * I type in the field "Description" text "my description 2"
        * in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New sudo command added"
        * I close the alert
        Then I should see "command1" entry in the data table
        * entry "command1" should have attribute "Description" set to "my description"
        Then I should see "command2" entry in the data table
        * entry "command2" should have attribute "Description" set to "my description 2"
        Then I wait for 3 seconds

    Scenario: Add a new sudo allow command
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on ID "add-allow-sudocmd" button
        Then I see a modal with title text "Add allow sudo commands into sudo rule 'sudoRule2'"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "command1"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "command1" entry in the data table

    Scenario: Remove sudo allow command from table
        Given I should see "command1" entry in the data table
        When I select "command1" entry with no link in the data table
        And I click on "Delete" button
        And the "command1" element should be in the dialog table with id "remove-sudocmds-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "command1" entry in the data table

    # -- Prep a new command group to add from the 'Sudo command groups' page
    Scenario: Add a new sudo command group
        Given I am on "sudo-command-groups" page
        When I click on "Add" button
        * I type in the field "Command group name" text "my-cmd-group"
        * in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New sudo command group added"
        * I close the alert
        Then I should see "my-cmd-group" entry in the data table

    Scenario: Add another sudo command group
        Given I am on "sudo-command-groups" page
        When I click on "Add" button
        * I type in the field "Command group name" text "my-cmd-group-2"
        * in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New sudo command group added"
        * I close the alert
        Then I should see "my-cmd-group-2" entry in the data table

    Scenario: Add a new sudo allow command group
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on "Sudo Allow Command Groups" page tab
        And I click on ID "add-allow-sudocmdgroup" button
        Then I see a modal with title text "Add allow sudo command groups into sudo rule 'sudoRule2'"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "my-cmd-group"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "my-cmd-group" entry in the data table

    Scenario: Remove sudo allow command group from table
        Given I should see "my-cmd-group" entry in the data table
        When I select "my-cmd-group" entry with no link in the data table
        And I click on "Delete" button
        And the "my-cmd-group" element should be in the dialog table with id "remove-sudocmdgroups-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "my-cmd-group" entry in the data table

    # - Deny
    Scenario: Add a new sudo deny command
        Given I am on the "sudo-rules" > "sudoRule2" Settings page
        When I click on ID "add-deny-sudocmd" button
        Then I see a modal with title text "Add deny sudo commands into sudo rule 'sudoRule2'"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "command2"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "command2" entry in the data table

    Scenario: Remove sudo deny command from table
        Given I should see "command2" entry in the data table
        When I select "command2" entry with no link in the data table
        And I click on "Delete" button
        And the "command2" element should be in the dialog table with id "remove-sudocmds-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "command2" entry in the data table

    Scenario: Add a new sudo deny command group
        When I click on "Sudo Deny Command Groups" page tab
        And I click on ID "add-deny-sudocmdgroup" button
        Then I see a modal with title text "Add deny sudo command groups into sudo rule 'sudoRule2'"
        And I click on the arrow icon to perform search in modal
        And I click on the dual list item "my-cmd-group-2"
        And I click on the dual list add selected button
        And I click on the "Add" button located in the footer modal dialog
        And I should see "success" alert with text "Added new item(s) to 'sudoRule2'"
        Then I close the alert
        And I should see "my-cmd-group-2" entry in the data table

    Scenario: Remove sudo deny command group from table
        Given I should see "my-cmd-group-2" entry in the data table
        When I select "my-cmd-group-2" entry with no link in the data table
        And I click on "Delete" button
        And the "my-cmd-group-2" element should be in the dialog table with id "remove-sudocmdgroups-table"
        When in the modal dialog I click on "Delete" button
        And I should see "success" alert with text "Removed item(s) from"
        Then I close the alert
        And I should not see "my-cmd-group-2" entry in the data table

    Scenario: Change command category - 'Specified Commands and Groups' to 'Any command'
        When I click on the "Any command" option under ID "cmdcategory" toggle group
        And I click on "Save" button
        And I should see "success" alert with text "Removed item(s) from 'sudoRule2' and saved"
        Then I close the alert
        And I should see "Any command" selected in the ID "cmdcategory" toggle group

    # Cleanup of created entities
    # - Sudo command
    Scenario: Delete a command
        Given I am on "sudo-commands" page
        Given I should see "command1" entry in the data table
        When I select entry "command1" in the data table
        * I click on "Delete" button
        When I see "Remove sudo commands" modal
        * I should see "command1" entry in the data table
        * in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Sudo commands removed"
        * I close the alert
        Then I should not see "command1" entry in the data table

    Scenario: Delete another command
        Given I am on "sudo-commands" page
        Given I should see "command2" entry in the data table
        When I select entry "command2" in the data table
        * I click on "Delete" button
        When I see "Remove sudo commands" modal
        * I should see "command2" entry in the data table
        * in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Sudo commands removed"
        * I close the alert
        Then I should not see "command2" entry in the data table

    # - Command group
    Scenario: Delete command groups
        Given I am on "sudo-command-groups" page
        Given I should see "my-cmd-group" entry in the data table
        When I select entry "my-cmd-group" in the data table
        When I select entry "my-cmd-group-2" in the data table
        * I click on "Delete" button
        When I see "Remove sudo command groups" modal
        * I should see "my-cmd-group" entry in the data table
        * I should see "my-cmd-group-2" entry in the data table
        * in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Sudo command groups removed"
        * I close the alert
        Then I should not see "my-cmd-group" entry in the data table
        Then I should not see "my-cmd-group-2" entry in the data table

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