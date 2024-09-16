Feature: Sudo command is a member of
  Work with Sudo command Is a member of section

  Background:
    Given I am logged in as "Administrator"
    Given I am on "sudo-commands" page

  # Create test entries
  Scenario Outline: Add a new sudo command group
    Given I am on "sudo-command-groups" page
    When I click on "Add" button
    * I type in the field "Command group name" text "sudogroup"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command group added"
    * I close the alert
    Then I should see "sudogroup" entry in the data table

  Scenario Outline: Add a new sudo command
    Given I am on "sudo-commands" page
    When I click on "Add" button
    * I type in the field "Command name" text "ls"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command added"
    * I close the alert
    Then I should see "ls" entry in the data table

  # Test Sudo command group memberships
  Scenario: Add ls to a Sudo command group
    Given I am on "sudo-commands" page
    Given I click on "ls" entry in the data table
    Given I click on the Is a member of section
    Given I am on "ls" user > Is a member of > "Sudo command groups" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'ls' to Sudo command groups"
    When I move user "sudogroup" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'ls' to Sudo command groups"
    * I close the alert
    Then I should see the element "sudogroup" in the table

  Scenario: Search for a Sudo command group
    When I type "sudogroup" in the search field
    Then I should see the "sudogroup" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "sudogroup" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "sudogroup" entry in the data table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Delete a member from the Sudo command group
    When I select entry "sudogroup" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'ls' from Sudo command groups"
    And the "sudogroup" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'ls' from Sudo command groups"
    * I close the alert
    And I should not see the element "sudogroup" in the table

  #
  # Cleanup - remove test entries
  #
  Scenario: Delete sudo command
    When I click on the breadcrump link "Sudo commands"
    Given I am on "sudo-commands" page
    Given I should see "ls" entry in the data table
    When I select entry "ls" in the data table
    * I click on "Delete" button
    When I see "Remove sudo commands" modal
    * I should see "ls" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo commands removed"
    * I close the alert
    Then I should not see "ls" entry in the data table

  Scenario: Delete a command group
    Given I am on "sudo-command-groups" page
    Given I should see "sudogroup" entry in the data table
    When I select entry "sudogroup" in the data table
    * I click on "Delete" button
    When I see "Remove sudo command groups" modal
    * I should see "sudogroup" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo command groups removed"
    * I close the alert
    Then I should not see "sudogroup" entry in the data table

