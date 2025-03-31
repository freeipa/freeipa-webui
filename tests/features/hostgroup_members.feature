Feature: Hostgroup members
  Work with hostgroup Members section and its operations in all the available
  tabs (Hosts, Host groups)

  Background:
    Given I am logged in as "Administrator"
    Given I am on "host-groups" page

  Scenario: Add a new test host
    Given I am on "hosts" page
    When I click on "Add" button
    * I type in the field "Host name" text "myhost"
    * I click on "Force" checkbox in modal
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "myhost" entry in the data table

  Scenario: Add a new test host group
    When I click on "Add" button
    * I type in the field "Group name" text "testgroup"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    Then I should see "testgroup" entry in the data table

  Scenario: Add another host group to work with
    When I click on "Add" button
    * I type in the field "Group name" text "main-host-group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    Then I should see "main-host-group" entry in the data table

  #
  # Test "Host" members
  #
  Scenario: Add a Host member into the host group
    Given I click on "main-host-group" entry in the data table
    Given I click on "Members" page tab
    Given I am on "main-host-group" group > Members > "Hosts" section
    Then I should see the "host" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign hosts to host group: main-host-group"
    When I move user "/^myhost\./" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new hosts to host group 'main-host-group'"
    * I close the alert
    Then I should see the element "/^myhost\./" in the table
    Then I should see the "host" tab count is "1"

  Scenario: Search for a host
    When I type "myhost" in the search field
    Then I should see the "myhost" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "/^myhost\./" in the table
    * I should not see "server.ipa.demo" entry in the data table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "/^myhost\./" entry in the data table
    * I should not see "server.ipa.demo" entry in the data table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "host" tab count is "0"
    When I click on the "direct" button
    Then I should see the "host" tab count is "1"

  Scenario: Remove Host from the host group
    When I select entry that starts with "myhost." in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete hosts from host group: main-host-group"
    And the "/^myhost\./" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed hosts from host group 'main-host-group'"
    * I close the alert
    And I should not see "/^myhost\./" entry in the data table
    Then I should see the "host" tab count is "0"

  #
  # Test "HostGroup" members
  #
  Scenario: Add a Host group member into the host group
    Given I click on "Host groups" page tab
    Given I am on "main-host-group" group > Members > "Host groups" section
    Then I should see the "hostgroup" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign host groups to host group: main-host-group"
    When I move user "testgroup" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new host groups to host group 'main-host-group'"
    * I close the alert
    Then I should see the element "testgroup" in the table
    Then I should see the "hostgroup" tab count is "1"

  Scenario: Search for a host group
    When I type "testgroup" in the search field
    Then I should see the "testgroup" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "testgroup" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "testgroup" entry in the data table
    Then I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search
    Then I should see the element "testgroup" in the table

  Scenario: Switch between direct and indirect memberships
    When I click on the "indirect" button
    Then I should see the "hostgroup" tab count is "0"
    When I click on the "direct" button
    Then I should see the "hostgroup" tab count is "1"

  Scenario: Remove Host group from the host group
    When I select entry "testgroup" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete host groups from host group: main-host-group"
    And the "testgroup" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed host groups from host group 'main-host-group'"
    * I close the alert
    And I should not see "testgroup" entry in the data table
    Then I should see the "hostgroup" tab count is "0"

  #
  # Cleanup
  #
  Scenario: Cleanup - remove the test host
    Given I am on "hosts" page
    Then I select partial entry "/^myhost\./" in the data table
    When I click on "Delete" button
    * I see "Remove hosts" modal
    * I should see partial "/^myhost\./" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Hosts removed"
    * I close the alert
    Then I should not see "/^myhost\./" entry in the data table

  Scenario: Cleanup - delete the test host group
    Given I should see "testgroup" entry in the data table
    Then I select entry "testgroup" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "testgroup" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    * I close the alert
    Then I should not see "testgroup" entry in the data table

  Scenario: Cleanup - delete the 'main-host-group' host group
    Given I should see "main-host-group" entry in the data table
    Then I select entry "main-host-group" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "main-host-group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    * I close the alert
    Then I should not see "main-host-group" entry in the data table
