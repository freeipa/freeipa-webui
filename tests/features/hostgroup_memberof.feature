Feature: Hostgroup is a member of
  Work with hostgroup Is a member of section and its operations in all the available tabs

  # TODO: Add pending tests for tab sections:
  #          - 'Netgroups'
  #          - 'HBAC rules'
  #          - 'Sudo rules'

  Background:
    Given I am logged in as "Administrator"
    Given I am on "host-groups" page

  Scenario: Add a new hostgroup
    When I click on "Add" button
    * I type in the field "Group name" text "a_hostgroup"
    Then TextInput "modal-form-add-hostgroup" should be enabled
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    * I close the alert
    Then I should see "a_hostgroup" entry in the data table

  Scenario: Add another new hostgroup
    When I click on "Add" button
    * I type in the field "Group name" text "a_hostgroup_2"
    Then TextInput "modal-form-add-hostgroup" should be enabled
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    * I close the alert
    Then I should see "a_hostgroup_2" entry in the data table

  # Test hostgroup members
  Scenario: Add a hostgroup member into the new host group
    Given I click on "a_hostgroup" entry in the data table
    Given I click on the Is a member of section
    Given I am on "a_hostgroup" user > Is a member of > "Host groups" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_hostgroup' into host groups"
    When I move user "a_hostgroup_2" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned item(s) to host groups"
    * I close the alert
    Then I should see the element "editors" in the table

  Scenario: Search for a host group
    When I type "a_hostgroup_2" in the search field
    Then I should see the "a_hostgroup_2" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "a_hostgroup_2" in the table
    * I click on the X icon to clear the search field

  Scenario: Delete a hostgroup member from the host group
    When I select entry "a_hostgroup_2" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_hostgroup_2' from host groups"
    And the "a_hostgroup_2" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed item(s) from host groups"
    * I close the alert
    And I should not see the element "a_hostgroup_2" in the table

  # Cleanup
  Scenario: Delete the groups and rules (clean up)
    When I click on the breadcrump link "Host groups"
    Then I should see "a_hostgroup" entry in the data table
    * I should see "a_hostgroup_2" entry in the data table
    And I select entry "a_hostgroup" in the data table
    * I select entry "a_hostgroup_2" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "a_hostgroup" entry in the data table
    * I should see "a_hostgroup_2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    * I close the alert
    Then I should not see "a_hostgroup" entry in the data table
    * I should not see "a_hostgroup_2" entry in the data table

