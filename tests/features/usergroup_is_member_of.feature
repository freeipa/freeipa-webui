Feature: Usergroup is a member of
  Work with usergroup Is a member of section and its operations in all the available tabs

  # TODO: Add pending tests for:
  #          - Pagination functionality (with more elements in the table)

  Background:
    Given I am logged in as "Administrator"
    Given I am on "user-groups" page

  Scenario Outline: Add a new rule
    Given I am on "sudo-rules" page
    When I click on "Add" button
    * I type in the field "Rule name" text "rule1"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo rule added"
    Then I should see "rule1" entry in the data table

  Scenario: Add a new usergroup
    When I click on "Add" button
    * I type in the field "Group name" text "a_group"
    Then TextInput "modal-form-group-gid" should be enabled
    * I type in the field "GID" text "77777"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    * I close the alert
    Then I should see "a_group" entry in the data table
    * entry "a_group" should have attribute "GID" set to "77777"

  # Test usergroup members
  Scenario: Add a usergroup member into the new user group
    Given I click on "a_group" entry in the data table
    Given I click on the Is a member of section
    Given I am on "a_group" user > Is a member of > "User groups" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign 'a_group' to user groups"
    When I move user "editors" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_group' to user groups"
    * I close the alert
    Then I should see the element "editors" in the table

  Scenario: Search for a user group
    When I type "editors" in the search field
    Then I should see the "editors" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "editors" in the table
    * I click on the X icon to clear the search field

  Scenario: Delete a usergroup member from the user group
    When I select entry "editors" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_group' from user groups"
    And the "editors" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'a_group' from user groups"
    * I close the alert
    And I should not see the element "editors" in the table

  # Test Netgroup members
  Scenario: Add a netgroup member to the user group
    # First create a netgroup as there are no default ones
    Given I am on "netgroups" page
    When I click on "Add" button
    * I type in the field "Netgroup name" text "a_netgroup"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    * I close the alert
    Then I should see "a_netgroup" entry in the data table
    # Now move back to user groups
    Given I am on "user-groups" page
    Given I click on "a_group" entry in the data table
    Given I click on the Is a member of section
    Then I click on "Netgroups" page tab
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_group' into netgroups"
    When I move user "a_netgroup" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_group' to netgroups"
    * I close the alert
    Then I should see the element "a_netgroup" in the table

  Scenario: Delete a netgroup member from the user group
    When I select entry "a_netgroup" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_group' from netgroups"
    And the "a_netgroup" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'a_group' from netgroups"
    * I close the alert
    And I should not see the element "a_netgroup" in the table

  # Test Role members
  Scenario: Add a role member to the user group
    Then I click on "Roles" page tab
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_group' into roles"
    When I move user "helpdesk" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_group' to roles"
    * I close the alert
    Then I should see the element "helpdesk" in the table

  Scenario: Delete a role member from the user group
    When I select entry "helpdesk" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_group' from roles"
    And the "helpdesk" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'a_group' from roles"
    * I close the alert
    And I should not see the element "helpdesk" in the table

  # Test HBAC rule members
  Scenario Outline: Add a new HBAC rule
    Given I am on "hbac-rules" page
    When I click on "Add" button
    * I type in the field "Rule name" text "rule1"
    * I type in the field "Description" text "my description"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New HBAC rule added"
    Then I should see "rule1" entry in the data table
    * entry "rule1" should have attribute "Description" set to "my description"

  Scenario: Add a HBAC rule member to the user group
    Given I am on "user-groups" page
    Given I click on "a_group" entry in the data table
    Given I click on the Is a member of section
    Then I click on "HBAC rules" page tab
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_group' into HBAC rules"
    When I move user "rule1" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_group' to HBAC rules"
    * I close the alert
    Then I should see the element "rule1" in the table

  Scenario: Delete a HBAC rule member from the user group
    When I select entry "rule1" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_group' from HBAC rules"
    And the "rule1" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'a_group' from HBAC rules"
    * I close the alert
    And I should not see the element "rule1" in the table

  # Test Sudo rules
  Scenario: Add a Sudo rule member to the user group
    Given I am on "user-groups" page
    Given I click on the Is a member of section
    Then I click on "Sudo rules" page tab
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_group' into sudo rules"
    When I move user "rule1" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_group' to sudo rules"
    * I close the alert
    Then I should see the element "rule1" in the table

  # Cleanup
  Scenario: Delete the groups and rules (clean up)
    When I click on the breadcrump link "User groups"
    Then I should see "a_group" entry in the data table
    And I select entry "a_group" in the data table
    When I click on "Delete" button
    * I see "Remove user groups" modal
    * I should see "a_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
    * I close the alert
    Then I should not see "a_group" entry in the data table

    Given I am on "netgroups" page
    Then I should see "a_netgroup" entry in the data table
    And I select entry "a_netgroup" in the data table
    When I click on "Delete" button
    * I see "Remove netgroups" modal
    * I should see "a_netgroup" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Netgroups removed"
    * I close the alert
    Then I should not see "a_netgroup" entry in the data table

    Given I am on "hbac-rules" page
    Then I should see partial "rule1" entry in the data table
    When I select entry "rule1" in the data table
    * I click on "Delete" button
    When I see "Remove HBAC rule" modal
    * I should see "rule1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "HBAC rules removed"
    Then I should not see "rule1" entry in the data table

    Given I am on "sudo-rules" page
    Given I should see partial "rule1" entry in the data table
    When I select entry "rule1" in the data table
    * I click on "Delete" button
    When I see "Remove sudo rule" modal
    * I should see "rule1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo rules removed"
    Then I should not see "rule1" entry in the data table
