
Feature: Netgroup is a member of
  Work with betgroup Is a member of section and its operations in all the available tabs

  Background:
    Given I am logged in as "Administrator"
    Given I am on "netgroups" page

  #
  # Create test entries
  #
  Scenario: Add a new netgroup
    Given I am on "netgroups" page
    When I click on "Add" button
    * I type in the field "Netgroup name" text "my_netgroup"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    Then I should see "my_netgroup" entry in the data table

  Scenario: Add another new netgroup
    Given I am on "netgroups" page
    When I click on "Add" button
    * I type in the field "Netgroup name" text "my_netgroup_2"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    Then I should see "my_netgroup_2" entry in the data table

  #
  # Test netgroup memberof
  #

  Scenario: Add a netgroup member into the new netgroup
    Given I click on "my_netgroup" entry in the data table
    Given I click on the Is a member of section
    Given I am on "my_netgroup" user > Is a member of > "Netgroups" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'my_netgroup' into netgroups"
    When I move user "my_netgroup_2" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'my_netgroup' to netgroups"
    * I close the alert
    Then I should see the element "my_netgroup_2" in the table

  Scenario: Search for a netgroup member
    When I type "my_netgroup_2" in the search field
    Then I should see the "my_netgroup_2" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "my_netgroup_2" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "my_netgroup_2" entry in the data table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Delete a netgroup member from the netgroup
    When I select entry "my_netgroup_2" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'my_netgroup' from netgroups"
    And the "my_netgroup_2" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'my_netgroup' from netgroups"
    * I close the alert
    And I should not see the element "my_netgroup_2" in the table

  #
  # Cleanup
  #
  Scenario: Cleanup - delete netgroup
    Given I navigate to "Netgroups" page using the breadcrumb link
    Given I am on "netgroups" page
    Then I select partial entry "my_netgroup" in the data table
    When I click on "Delete" button
    * I see "Remove netgroups" modal
    * I should see partial "my_netgroup" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Netgroups removed"
    Then I should not see "my_netgroup" entry in the data table

