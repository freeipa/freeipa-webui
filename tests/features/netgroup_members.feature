Feature: Netgroup members
  Work with usergroup Members section and its operations in all the available
  tabs (Users, User groups, Hosts, Host groups, And netgroups)

  Background:
    Given I am logged in as "Administrator"
    Given I am on "netgroups" page

  Scenario: Add test user
    Given I am on "active-users" page
    Given sample testing user "armadillo" exists

  Scenario: Add two netgroup
    Given I am on "netgroups" page
    When I click on "Add" button
    * I type in the field "Netgroup name" text "mynetgroup"
    When in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New netgroup added"
    Then I type in the field "Netgroup name" text "mynetgroup2"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    Then I should see "mynetgroup" entry in the data table
    Then I should see "mynetgroup2" entry in the data table

  Scenario: Add a new host group
    Given I am on "host-groups" page
    When I click on "Add" button
    * I type in the field "Group name" text "myhostgroup"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    Then I should see "myhostgroup" entry in the data table

  #
  # Test "User" members
  #
  Scenario: Add a User member
    Given I click on "mynetgroup" entry in the data table
    Given I click on "Members" page tab
    Given I am on "mynetgroup" group > Members > "Users" section
    Then I should see the "user" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign users to netgroup: mynetgroup"
    When I move user "armadillo" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new users to netgroup 'mynetgroup'"
    * I close the alert
    Then I should see the element "armadillo" in the table
    Then I should see the "user" tab count is "1"

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

  Scenario: Remove User member
    When I select entry "armadillo" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete users from netgroup: mynetgroup"
    And the "armadillo" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed users from netgroup 'mynetgroup'"
    * I close the alert
    And I should not see the element "armadillo" in the table
    Then I should see the "user" tab count is "0"

  #
  # Test "UserGroup" members
  #
  Scenario: Add a Usergroup member
    Given I click on "User groups" page tab
    Given I am on "mynetgroup" group > Members > "User groups" section
    Then I should see the "group" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign user groups to netgroup: mynetgroup"
    When I move user "editors" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new user groups to netgroup 'mynetgroup'"
    * I close the alert
    Then I should see the element "editors" in the table
    Then I should see the "group" tab count is "1"

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

  Scenario: Remove Usergroup member
    When I select entry "editors" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete user groups from netgroup: mynetgroup"
    And the "editors" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed user groups from netgroup 'mynetgroup'"
    * I close the alert
    And I should not see the element "editors" in the table
    Then I should see the "group" tab count is "0"

  #
  # Test "Host" members
  #
  Scenario: Add a Host member into the netgroup
    Given I click on "Hosts" page tab
    Given I am on "mynetgroup" group > Members > "Hosts" section
    Then I should see the "host" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign hosts to netgroup: mynetgroup"
    When I move user "server.ipa.demo" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new hosts to netgroup 'mynetgroup'"
    * I close the alert
    Then I should see "server.ipa.demo" entry in the data table
    Then I should see the "host" tab count is "1"

  Scenario: Search for a host
    When I type "server.ipa.demo" in the search field
    Then I should see the "server.ipa.demo" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see "server.ipa.demo" entry in the data table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "server.ipa.demo" entry in the data table
    Then I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search
    Then I should see "server.ipa.demo" entry in the data table

  Scenario: Remove host member
    When I select partial entry "server.ipa.demo" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete hosts from netgroup: mynetgroup"
    And the "server.ipa.demo" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed hosts from netgroup 'mynetgroup'"
    * I close the alert
    And I should not see the element "server.ipa.demo" in the table
    Then I should see the "host" tab count is "0"

  #
  # Test "Host group" members
  #
  Scenario: Add a Host group member into the netgroup
    Given I click on "Host groups" page tab
    Given I am on "mynetgroup" group > Members > "Host groups" section
    Then I should see the "hostgroup" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign host groups to netgroup: mynetgroup"
    When I move user "myhostgroup" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new host groups to netgroup 'mynetgroup'"
    * I close the alert
    Then I should see "myhostgroup" entry in the data table
    Then I should see the "hostgroup" tab count is "1"

  Scenario: Search for a host group
    When I type "myhostgroup" in the search field
    Then I should see the "myhostgroup" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see "myhostgroup" entry in the data table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "myhostgroup" entry in the data table
    Then I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search
    Then I should see "myhostgroup" entry in the data table

  Scenario: Remove host group member
    When I select partial entry "myhostgroup" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete host groups from netgroup: mynetgroup"
    And the "myhostgroup" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed host groups from netgroup 'mynetgroup'"
    * I close the alert
    And I should not see the element "myhostgroup" in the table
    Then I should see the "hostgroup" tab count is "0"

  #
  # Test "Netgroup" members
  #
  Scenario: Add a netgroup into the netgroup
    Given I click on "Netgroups" page tab
    Given I am on "mynetgroup" group > Members > "Netgroups" section
    Then I should see the "netgroup" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign netgroups to netgroup: mynetgroup"
    When I move user "mynetgroup2" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new netgroups to netgroup 'mynetgroup'"
    * I close the alert
    Then I should see "mynetgroup2" entry in the data table
    Then I should see the "netgroup" tab count is "1"

  Scenario: Search for a netgroup
    When I type "mynetgroup2" in the search field
    Then I should see the "mynetgroup2" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see "mynetgroup2" entry in the data table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "mynetgroup2" entry in the data table
    Then I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search
    Then I should see "mynetgroup2" entry in the data table

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "netgroup" tab count is "0"
    When I click on the "direct" button
    Then I should see the "netgroup" tab count is "1"

  Scenario: Remove netgroup member
    When I select entry "mynetgroup2" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete netgroups from netgroup: mynetgroup"
    And the "mynetgroup2" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed netgroups from netgroup 'mynetgroup'"
    * I close the alert
    And I should not see the element "mynetgroup2" in the table
    Then I should see the "netgroup" tab count is "0"

  #
  # Cleanup
  #
  Scenario: clean up and delete new host group
    Given I am on "host-groups" page
    Then I select entry "myhostgroup" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "myhostgroup" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"

  Scenario: clean up and delete new netgroup
    Given I am on "netgroups" page
    Then I select entry "mynetgroup" in the data table
    Then I select entry "mynetgroup2" in the data table
    When I click on "Delete" button
    * I see "Remove netgroups" modal
    * I should see "mynetgroup" entry in the data table
    * I should see "mynetgroup2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Netgroups removed"

