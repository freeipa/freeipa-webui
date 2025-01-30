Feature: Sudo rules - Settings page
  Modify a sudo rule

  Background:
    Given I am logged in as "Administrator"

  # Create test entry
  Scenario: Add a new rule
    Given I am on "sudo-rules" page
    When I click on "Add" button
    And I type in the field "Rule name" text "sudoRule1"
    When in the modal dialog I click on "Add" button
    And I should see "success" alert with text "New sudo rule added"
    Then I close the alert
    And I should see "sudoRule1" entry in the data table

  # 'General' subsection
  # - Sudo order
  Scenario: Add sudo order
    Given I am on the "sudo-rules" > "sudoRule1" Settings page
    When I click on the "sudoorder" number plus button
    And I click on "Save" button
    And I should see the "sudoorder" number input value is "1"
    And I should see "success" alert with text "Sudo rule modified"
    Then I close the alert
    When I click on the "sudoorder" number minus button
    And I click on "Save" button
    And I should see "success" alert with text "Sudo rule modified"
    Then I close the alert

  # - Description
  Scenario: Set Description
    When I type in the textarea "description" text "testing description"
    And I click on "Save" button
    And I should see "success" alert with text "Sudo rule modified"
    Then I close the alert
    And Then I should see "testing description" in the textarea "description"

  # 'Options' subsection
  Scenario: Add a new option
    When I click on "Add options" button
    Then I see a modal with title text "Add sudo option"
    And I type in the flex field "Sudo option" text "sudooption1"
    And I click on "Add" button
    And I should see "success" alert with text "Sudo option added"
    Then I close the alert
    And I should see "sudooption1" entry in the data table

  Scenario: Remove option from table
    Given I should see "sudooption1" entry in the data table
    When I select "sudooption1" entry with no link in the data table
    And I click on "Delete" button
    And the "sudooption1" element should be in the dialog table with id "remove-sudo-rules-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Sudo option(s) removed"
    Then I close the alert
    And I should not see "sudooption1" entry in the data table

  # 'Who' subsection
  # - Users tab
  Scenario: Add a new user
    When I click on "Add users" button
    Then I see a modal with title text "Add user into sudo rule sudoRule1"
    And I click on the arrow icon to perform search
    And I click on the dual list item "admin"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
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
    Then I see a modal with title text "Add group into sudo rule sudoRule1"
    And I click on the arrow icon to perform search
    And I click on the dual list item "admins"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
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

  # 'Access this host' subsection
  # - Prep a new host to add
  Scenario: Add a new host from the 'Hosts' page
    Given I am on "hosts" page
    When I click on "Add" button
    * I type in the field "Host name" text "my-temp-server"
    * I click on "Force" checkbox in modal
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "my-temp-server" entry in the data table

  Scenario: Add a new host from the 'Sudo rules' page
    Given I am on the "sudo-rules" > "sudoRule1" Settings page
    When I click on "Add hosts" button
    Then I see a modal with title text "Add host into sudo rule sudoRule1"
    And I click on the arrow icon to perform search
    And I click on the dual list item "my-temp-server"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
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
    * I type in the field "Group name" text "a_host_group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    Then I should see "a_host_group" entry in the data table

  Scenario: Add a new host group
    Given I am on the "sudo-rules" > "sudoRule1" Settings page
    When I click on "Host groups" page tab
    And I click on "Add hostgroups" button
    Then I see a modal with title text "Add host group into sudo rule sudoRule1"
    And I click on the arrow icon to perform search
    And I click on the dual list item "a_host_group"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
    Then I close the alert
    And I should see "a_host_group" entry in the data table

  Scenario: Remove host group from table
    Given I should see "a_host_group" entry in the data table
    When I select "a_host_group" entry with no link in the data table
    And I click on "Delete" button
    And the "a_host_group" element should be in the dialog table with id "remove-hostgroups-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Removed item(s) from"
    Then I close the alert
    And I should not see "a_host_group" entry in the data table

  Scenario: Change host category - 'Specified Hosts and Groups' to 'Any host'
    When I click on the "Anyone" option under ID "hostcategory" toggle group
    And I click on "Save" button
    And I should see "success" alert with text "Sudo rule modified"
    Then I close the alert
    And I should see "Anyone" selected in the ID "hostcategory" toggle group

  # 'Run command' subsection
  # - Allow
  # -- Prep a new command to add from the 'Sudo commands' page
  Scenario: Add a new sudo command
    Given I am on "sudo-commands" page
    When I click on "Add" button
    * I type in the field "Command name" text "command1"
    * I type in the field "Description" text "my description"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command added"
    * I close the alert
    Then I should see "command1" entry in the data table
    * entry "command1" should have attribute "Description" set to "my description"

  Scenario: Add a new sudo allow command
    Given I am on the "sudo-rules" > "sudoRule1" Settings page
    When I click on "Add sudocmds" button
    Then I see a modal with title text "Add allow sudo commands into sudo rule 'sudoRule1'"
    And I click on the arrow icon to perform search
    And I click on the dual list item "command1"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
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
    * I type in the field "Command group name" text "cmdgroup1"
    * I type in the field "Description" text "my description"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command group added"
    * I close the alert
    Then I should see "cmdgroup1" entry in the data table
    * entry "cmdgroup1" should have attribute "Description" set to "my description"

  Scenario: Add a new sudo allow command group
    Given I am on the "sudo-rules" > "sudoRule1" Settings page
    When I click on "Sudo Allow Command Groups" page tab
    And I click on "Add sudocmdgroups" button
    Then I see a modal with title text "Add allow sudo command groups into sudo rule 'sudoRule1'"
    And I click on the arrow icon to perform search
    And I click on the dual list item "cmdgroup1"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
    Then I close the alert
    And I should see "cmdgroup1" entry in the data table

  Scenario: Remove sudo allow command group from table
    Given I should see "cmdgroup1" entry in the data table
    When I select "cmdgroup1" entry with no link in the data table
    And I click on "Delete" button
    And the "cmdgroup1" element should be in the dialog table with id "remove-sudocmdgroups-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Removed item(s) from"
    Then I close the alert
    And I should not see "cmdgroup1" entry in the data table

  # - Deny
  Scenario: Add a new sudo deny command
    Given I am on the "sudo-rules" > "sudoRule1" Settings page
    When I click on ID "add-deny-sudocmd" button
    Then I see a modal with title text "Add deny sudo commands into sudo rule 'sudoRule1'"
    And I click on the arrow icon to perform search
    And I click on the dual list item "command1"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
    Then I close the alert
    And I should see "command1" entry in the data table

  Scenario: Remove sudo deny command from table
    Given I should see "command1" entry in the data table
    When I select "command1" entry with no link in the data table
    And I click on "Delete" button
    And the "command1" element should be in the dialog table with id "remove-sudocmds-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Removed item(s) from"
    Then I close the alert
    And I should not see "command1" entry in the data table

  Scenario: Add a new sudo deny command group
    When I click on "Sudo Deny Command Groups" page tab
    And I click on ID "add-deny-sudocmdgroup" button
    Then I see a modal with title text "Add deny sudo command groups into sudo rule 'sudoRule1'"
    And I click on the arrow icon to perform search
    And I click on the dual list item "cmdgroup1"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
    Then I close the alert
    And I should see "cmdgroup1" entry in the data table

  Scenario: Remove sudo deny command group from table
    Given I should see "cmdgroup1" entry in the data table
    When I select "cmdgroup1" entry with no link in the data table
    And I click on "Delete" button
    And the "cmdgroup1" element should be in the dialog table with id "remove-sudocmdgroups-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Removed item(s) from"
    Then I close the alert
    And I should not see "cmdgroup1" entry in the data table

  Scenario: Change command category - 'Specified Commands and Groups' to 'Any command'
    When I click on the "Any command" option under ID "cmdcategory" toggle group
    And I click on "Save" button
    And I should see "success" alert with text "Removed item(s) from 'sudoRule1' and saved"
    Then I close the alert
    And I should see "Any command" selected in the ID "cmdcategory" toggle group

  # 'As whom' subsection
  # - RunAs User
  Scenario: Add a new runAs user
    Given I am on the "sudo-rules" > "sudoRule1" Settings page
    When I click on ID "add-runas-user" button
    Then I see a modal with title text "Add RunAs user into sudo rule sudoRule1"
    And I click on the arrow icon to perform search
    And I click on the dual list item "admin"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
    Then I close the alert
    And I should see "admin" entry in the data table

  Scenario: Remove runAs user from table
    Given I should see "admin" entry in the data table
    When I select "admin" entry with no link in the data table
    And I click on "Delete" button
    And the "admin" element should be in the dialog table with id "remove-users-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Removed item(s) from"
    Then I close the alert
    And I should not see "admin" entry in the data table

  # - Group of runAs users
  Scenario: Add a new group of runAs users
    When I click on "Groups of RunAs Users" page tab
    And I click on ID "add-runas-group" button
    Then I see a modal with title text "Add host group into sudo rule sudoRule1"
    And I click on the arrow icon to perform search
    And I click on the dual list item "admins"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
    Then I close the alert
    And I should see "admins" entry in the data table

  Scenario: Remove group of runAs users from table
    Given I should see "admins" entry in the data table
    When I select "admins" entry with no link in the data table
    And I click on "Delete" button
    And the "admins" element should be in the dialog table with id "remove-groups-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Removed item(s) from"
    Then I close the alert
    And I should not see "admins" entry in the data table

  # - RunAs Groups
  Scenario: Add a new runAs group
    When I click on ID "add-runas-group-group" button
    Then I see a modal with title text "Add RunAs groups into sudo rule sudoRule1"
    And I click on the arrow icon to perform search
    And I click on the dual list item "admins"
    And I click on the dual list add selected button
    And I click on the "Add" button located in the footer modal dialog
    And I should see "success" alert with text "Added new item(s) to 'sudoRule1'"
    Then I close the alert
    And I should see "admins" entry in the data table with ID "keytab-group-table"

  Scenario: Remove runAs group from table
    Given I should see "admins" entry in the data table with ID "keytab-group-table"
    When I select "admins" entry with no link in the data table
    And I click on "Delete" button
    And the "admins" element should be in the dialog table with id "remove-groups-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Removed item(s) from"
    Then I close the alert
    And I should not see "admins" entry in the data table with ID "keytab-group-table"

  Scenario: Change runAs user and group categories
    When I click on the "Anyone" option under ID "ipasudorunasusercategory" toggle group
    When I click on the "Any Group" option under ID "ipasudorunasgroupcategory" toggle group
    And I click on "Save" button
    And I should see "success" alert with text "Sudo rule modified"
    Then I close the alert
    And I should see "Anyone" selected in the ID "ipasudorunasusercategory" toggle group
    And I should see "Any Group" selected in the ID "ipasudorunasgroupcategory" toggle group

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
    Then I should not see "my-temp-server" entry in the data table

  # - Host group
  Scenario: Delete a host group
    Given I am on "host-groups" page
    Given I should see "a_host_group" entry in the data table
    Then I select entry "a_host_group" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "a_host_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    Then I should not see "a_host_group" entry in the data table

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

  # - Command group
  Scenario: Delete a command group
    Given I am on "sudo-command-groups" page
    Given I should see "cmdgroup1" entry in the data table
    When I select entry "cmdgroup1" in the data table
    * I click on "Delete" button
    When I see "Remove sudo command groups" modal
    * I should see "cmdgroup1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo command groups removed"
    * I close the alert
    Then I should not see "cmdgroup1" entry in the data table

  # - Sudo rule
  Scenario: Delete the rule
    Given I am on "sudo-rules" page
    Given I should see partial "sudoRule1" entry in the data table
    When I select entry "sudoRule1" in the data table
    * I click on "Delete" button
    When I see "Remove sudo rule" modal
    * I should see "sudoRule1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo rules removed"
    Then I should not see "sudoRule1" entry in the data table



