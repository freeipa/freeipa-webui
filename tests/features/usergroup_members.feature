Feature: Usergroup members
  Work with usergroup Members section and its operations in all the available
  tabs (Users, User groups, Services, External, User ID overrides)
  TODO: external, and User ID overrides

  Background:
    Given I am logged in as "Administrator"
    Given I am on "user-groups" page

  Scenario: Add test user
    Given I am on "active-users" page
    Given sample testing user "armadillo" exists

  #
  # Test "User" members
  #
  Scenario: Add a User member into the user group
    Given I click on "admins" entry in the data table
    Given I click on "Members" page tab
    Given I am on "admins" group > Members > "Users" section
    Then I should see the "user" tab count is "1"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign users to user group: admins"
    When I move user "armadillo" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new users to user group 'admins'"
    * I close the alert
    Then I should see the element "armadillo" in the table
    Then I should see the "user" tab count is "2"

  Scenario: Search for a user
    When I type "armadillo" in the search field
    Then I should see the "armadillo" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "armadillo" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see the element "armadillo" in the table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "user" tab count is "0"
    When I click on the "direct" button
    Then I should see the "user" tab count is "2"

  Scenario: Remove User from the user group admins
    When I select entry "armadillo" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete users from user group: admins"
    And the "armadillo" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed users from user group 'admins'"
    * I close the alert
    And I should not see the element "armadillo" in the table
    Then I should see the "user" tab count is "1"

  #
  # Test "UserGroup" members
  #
  Scenario: Add a Usergroup member into the user group
    Given I click on "User groups" page tab
    Given I am on "admins" group > Members > "User groups" section
    Then I should see the "usergroup" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign user groups to user group: admins"
    When I move user "editors" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new user groups to user group 'admins'"
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

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "usergroup" tab count is "0"
    When I click on the "direct" button
    Then I should see the "usergroup" tab count is "1"

  Scenario: Remove Usergroup from the user group admins
    When I select entry "editors" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete user groups from user group: admins"
    And the "editors" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed user groups from user group 'admins'"
    * I close the alert
    And I should not see the element "editors" in the table
    Then I should see the "usergroup" tab count is "0"

  #
  # Test "Service" members
  #
  Scenario: Add a Service member into the user group
    Given I click on "Services" page tab
    Given I am on "admins" group > Members > "Services" section
    Then I should see the "service" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign services to user group: admins"
    When I move user "DNS/server.ipa.demo@DOM-IPA.DEMO" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new services to user group 'admins'"
    * I close the alert
    Then I should see partial "DNS" entry in the data table
    Then I should see the "service" tab count is "1"

  Scenario: Search for a service
    When I type "DNS" in the search field
    Then I should see the "DNS" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see partial "DNS" entry in the data table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see partial "DNS" entry in the data table
    Then I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search
    Then I should see partial "DNS" entry in the data table

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "service" tab count is "0"
    When I click on the "direct" button
    Then I should see the "service" tab count is "1"

  Scenario: Remove service from the user group admins
    When I select partial entry "DNS" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete services from user group: admins"
    And the "DNS" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed services from user group 'admins'"
    * I close the alert
    And I should not see the element "DNS" in the table
    Then I should see the "service" tab count is "0"
