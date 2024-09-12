Feature: Hostgroup member managers
  Work with usergroup member managers section and its operations in all the available
  tabs (Users, User groups)

  Background:
    Given I am logged in as "Administrator"
    Given I am on "host-groups" page

  #
  # Test "User" member managers
  #
  Scenario: Add a User member into the user group
    Given I click on "ipaservers" entry in the data table
    Given I click on "Member managers" page tab
    Given I am on "ipaservers" group > Member managers > "Users" section
    Then I should see the "user" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign user member managers to: ipaservers"
    When I move user "admin" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new user member managers to 'ipaservers'"
    * I close the alert
    Then I should see the element "admin" in the table
    Then I should see the "user" tab count is "1"

  Scenario: Search for a user
    When I type "admin" in the search field
    Then I should see the "admin" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "admin" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see the element "admin" in the table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Remove User from the user group ipaservers
    When I select entry "admin" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete user member managers from: ipaservers"
    And the "admin" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed user member managers from 'ipaservers'"
    * I close the alert
    And I should not see the element "admin" in the table
    Then I should see the "user" tab count is "0"

  #
  # Test "UserGroup" members
  #
  Scenario: Add a Hostgroup member into the user group
    Given I click on "User groups" page tab
    Given I am on "ipaservers" group > Member managers > "User groups" section
    Then I should see the "usergroup" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign group member managers to: ipaservers"
    When I move user "editors" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new group member managers to 'ipaservers'"
    * I close the alert
    Then I should see the element "editors" in the table
    Then I should see the "usergroup" tab count is "1"

  Scenario: Search for a usergroup
    When I type "editors" in the search field
    Then I should see the "editors" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "editors" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see the element "editors" in the table
    Then I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search
    Then I should see the element "editors" in the table

  Scenario: Remove Hostgroup from the user group ipaservers
    When I select entry "editors" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete group member managers from: ipaservers"
    And the "editors" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed group member managers from 'ipaservers'"
    * I close the alert
    And I should not see the element "editors" in the table
    Then I should see the "usergroup" tab count is "0"
