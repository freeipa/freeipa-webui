Feature: Hostgroup is a member of
  Work with hostgroup Is a member of section and its operations in all the available tabs

  Background:
    Given I am logged in as "Administrator"
    Given I am on "host-groups" page

  #
  # Create test entries
  #
  Scenario: Add a new netgroup
    Given I am on "netgroups" page
    When I click on "Add" button
    * I type in the field "Netgroup name" text "a_net_group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    Then I should see "a_net_group" entry in the data table

  Scenario Outline: Add a new HBAC rule
    Given I am on "hbac-rules" page
    When I click on "Add" button
    * I type in the field "Rule name" text "hbacrule1"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New HBAC rule added"
    Then I should see "hbacrule1" entry in the data table

  Scenario Outline: Add a new sudo rule
    Given I am on "sudo-rules" page
    When I click on "Add" button
    * I type in the field "Rule name" text "sudorule1"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo rule added"
    Then I should see "sudorule1" entry in the data table

  Scenario: Add a new hostgroup
    When I click on "Add" button
    * I type in the field "Group name" text "a_hostgroup"
    Then TextInput "modal-form-hostgroup-name" should be enabled
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    * I close the alert
    Then I should see "a_hostgroup" entry in the data table

  Scenario: Add another new hostgroup
    When I click on "Add" button
    * I type in the field "Group name" text "a_hostgroup_2"
    Then TextInput "modal-form-hostgroup-name" should be enabled
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    * I close the alert
    Then I should see "a_hostgroup_2" entry in the data table

  #
  # Test hostgroup members
  #
  Scenario: Add a hostgroup member into the new host group
    Given I click on "a_hostgroup" entry in the data table
    Given I click on the Is a member of section
    Given I am on "a_hostgroup" user > Is a member of > "Host groups" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_hostgroup' into host groups"
    When I move user "a_hostgroup_2" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_hostgroup' to host groups"
    * I close the alert
    Then I should see the element "a_hostgroup_2" in the table
    * I should see the "group" tab count is "1"

  Scenario: Search for a host group
    When I type "a_hostgroup_2" in the search field
    Then I should see the "a_hostgroup_2" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "a_hostgroup_2" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "a_hostgroup_2" entry in the data table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "group" tab count is "0"
    When I click on the "direct" button
    Then I should see the "group" tab count is "1"

  Scenario: Delete a hostgroup member from the host group
    When I select entry "a_hostgroup_2" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_hostgroup' from host groups"
    And the "a_hostgroup_2" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'a_hostgroup' from host groups"
    * I close the alert
    And I should not see the element "a_hostgroup_2" in the table
    Then I should see the "group" tab count is "0"

  #
  # Test netgroup memberof
  #
  Scenario: Add a hostgroup member into the new host group
    Given I click on the Is a member of section
    Given I click on "Netgroups" page tab
    Given I am on "a_hostgroup" user > Is a member of > "Netgroups" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_hostgroup' into netgroups"
    When I move user "a_net_group" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_hostgroup' to netgroups"
    * I close the alert
    Then I should see the element "a_net_group" in the table
    * I should see the "netgroup" tab count is "1"

  Scenario: Search for a netgroup member
    When I type "a_net_group" in the search field
    Then I should see the "a_net_group" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "a_net_group" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "a_net_group" entry in the data table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Delete a netgroup member from the netgroup
    When I select entry "a_net_group" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_hostgroup' from netgroups"
    And the "a_net_group" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'a_hostgroup' from netgroups"
    * I close the alert
    And I should not see the element "a_net_group" in the table
    Then I should see the "netgroup" tab count is "0"

  #
  # Test HBAC memberof
  #
  Scenario: Add a HBAC rule member into the new host group
    Given I click on the Is a member of section
    Given I click on "HBAC rules" page tab
    Given I am on "a_hostgroup" user > Is a member of > "HBAC rules" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_hostgroup' into HBAC rules"
    When I move user "hbacrule1" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_hostgroup' to HBAC rules"
    * I close the alert
    Then I should see the element "hbacrule1" in the table
    * I should see the "hbacrule" tab count is "1"

  Scenario: Search for a HBAC rule
    When I type "hbacrule1" in the search field
    Then I should see the "hbacrule1" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "hbacrule1" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "hbacrule1" entry in the data table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "hbacrule" tab count is "0"
    When I click on the "direct" button
    Then I should see the "hbacrule" tab count is "1"

  Scenario: Delete a HBAC rule member from the host group
    When I select entry "hbacrule1" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_hostgroup' from HBAC rules"
    And the "hbacrule1" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'a_hostgroup' from HBAC rules"
    * I close the alert
    And I should not see the element "hbacrule1" in the table
    Then I should see the "hbacrule" tab count is "0"

  #
  # Test Sudo rule memberof
  #
  Scenario: Add a Sudo rule member into the new host group
    Given I click on the Is a member of section
    Given I click on "Sudo rules" page tab
    Given I am on "a_hostgroup" user > Is a member of > "Sudo rules" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'a_hostgroup' into sudo rules"
    When I move user "sudorule1" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'a_hostgroup' to sudo rules"
    * I close the alert
    Then I should see the element "sudorule1" in the table
    * I should see the "sudorule" tab count is "1"

  Scenario: Search for a Sudo rule
    When I type "sudorule1" in the search field
    Then I should see the "sudorule1" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "sudorule1" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "sudorule1" entry in the data table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "sudorule" tab count is "0"
    When I click on the "direct" button
    Then I should see the "sudorule" tab count is "1"

  Scenario: Delete a sudo rule from the host group
    When I select entry "sudorule1" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'a_hostgroup' from sudo rules"
    And the "sudorule1" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'a_hostgroup' from sudo rules"
    * I close the alert
    And I should not see the element "sudorule1" in the table
    Then I should see the "sudorule" tab count is "0"

  #
  # Cleanup
  #
  Scenario: Cleanup - delete host groups
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

  Scenario: Cleanup - delete netgroup
    Given I am on "netgroups" page
    Then I select partial entry "a_net_group" in the data table
    When I click on "Delete" button
    * I see "Remove netgroups" modal
    * I should see partial "a_net_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Netgroups removed"
    Then I should not see "a_net_group" entry in the data table

  Scenario: Cleanup - delete HBAC rule
    Given I am on "hbac-rules" page
    Then I select partial entry "hbacrule1" in the data table
    When I click on "Delete" button
    * I see "Remove HBAC rules" modal
    * I should see partial "hbacrule1" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "HBAC rules removed"
    Then I should not see "hbacrule1" entry in the data table

  Scenario: Cleanup - delete Sudo rule
    Given I am on "sudo-rules" page
    Then I select partial entry "sudorule1" in the data table
    When I click on "Delete" button
    * I see "Remove sudo rules" modal
    * I should see partial "sudorule1" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo rules removed"
    Then I should not see "sudorule1" entry in the data table
