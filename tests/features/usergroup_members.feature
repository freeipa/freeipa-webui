Feature: Usergroup members
  Work with usergroup Members section and its operations in all the available
  tabs (Users, User groups, Services, External, User ID overrides)
  TODO: external, and User ID overrides

  Background:
    Given I am logged in as "Administrator"
    Given I am on "user-groups" page

  # Add a new test user
  Scenario: Add a new testing user
    Given I am on "active-users" page
    When I click on "Add" button
    * I type in the field "First name" text "Alan"
    * I type in the field "Last name" text "Turing"
    * in the modal dialog I click on "Add" button
    Then I should see "aturing" entry in the data table

  # Add a new test user group
  Scenario: Add a new testing user group
    Given I am on "user-groups" page
    When I click on "Add" button
    * I type in the field "Group name" text "imitation-game-group"
    When in the modal dialog I click on "Add" button
    Then I should see "imitation-game-group" entry in the data table

  #
  # Test "User" members
  #
  Scenario: Add a User member into the user group
    Given I click on "imitation-game-group" entry in the data table
    Given I click on "Members" page tab
    Given I am on "imitation-game-group" group > Members > "Users" section
    Then I should see the "user" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign users to user group: imitation-game-group"
    When I move user "aturing" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new users to user group 'imitation-game-group'"
    * I close the alert
    Then I should see the element "aturing" in the table
    Then I should see the "user" tab count is "1"

  Scenario: Search for a user
    When I type "aturing" in the search field
    Then I should see the "aturing" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "aturing" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see the element "aturing" in the table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "user" tab count is "0"
    When I click on the "direct" button
    Then I should see the "user" tab count is "1"

  Scenario: Remove User from the user group imitation-game-group
    When I select entry "aturing" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete users from user group: imitation-game-group"
    And the "aturing" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed users from user group 'imitation-game-group'"
    * I close the alert
    And I should not see the element "aturing" in the table
    Then I should see the "user" tab count is "0"

  #
  # Test "UserGroup" members
  #
  Scenario: Add a Usergroup member into the user group
    Given I click on "User groups" page tab
    Given I am on "imitation-game-group" group > Members > "User groups" section
    Then I should see the "usergroup" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign user groups to user group: imitation-game-group"
    When I move user "editors" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new user groups to user group 'imitation-game-group'"
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

  Scenario: Remove Usergroup from the user group imitation-game-group
    When I select entry "editors" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete user groups from user group: imitation-game-group"
    And the "editors" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed user groups from user group 'imitation-game-group'"
    * I close the alert
    And I should not see the element "editors" in the table
    Then I should see the "usergroup" tab count is "0"

  #
  # Test "Service" members
  #
  Scenario: Add a Service member into the user group
    Given I click on "Services" page tab
    Given I am on "imitation-game-group" group > Members > "Services" section
    Then I should see the "service" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign services to user group: imitation-game-group"
    When I move user "DNS/server.ipa.demo@DOM-IPA.DEMO" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new services to user group 'imitation-game-group'"
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

  Scenario: Remove service from the user group imitation-game-group
    When I select partial entry "DNS" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete services from user group: imitation-game-group"
    And the "DNS" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed services from user group 'imitation-game-group'"
    * I close the alert
    And I should not see the element "DNS" in the table
    Then I should see the "service" tab count is "0"

  # Cleanup
  Scenario: Remove testing user aturing
    Given I am on "active-users" page
    Given I should see "aturing" entry in the data table
    Then I select entry "aturing" in the data table
    When I click on "Delete" button
    * I see "Remove Active Users" modal
    * I should see "aturing" entry in the data table
    When in the modal dialog I check "Delete" radio selector
    And in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Users removed"
    Then I should not see "aturing" entry in the data table

  Scenario: Remove testing user group imitation-game-group
    Given I am on "user-groups" page
    Given I should see "imitation-game-group" entry in the data table
    Then I select entry "imitation-game-group" in the data table
    When I click on "Delete" button
    * I see "Remove user groups" modal
    * I should see "imitation-game-group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
    Then I should not see "imitation-game-group" entry in the data table
