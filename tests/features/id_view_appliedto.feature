Feature: ID View applied to manipulation
  Apply and unapply hosts and hostgroups to an ID view

  Background:
    Given I am logged in as "Administrator"
    Given I am on "id-views" page

  #
  # Create sample entries
  #
  Scenario: Add new hosts
    Given I am on "hosts" page
    When I click on "Add" button
    Then I type in the field "Host name" text "idviewhost1"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "idviewhost1" entry in the data table
    When I click on "Add" button
    Then I type in the field "Host name" text "idviewhost2"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "idviewhost2" entry in the data table

  Scenario: Add a new host group
    Given I am on "host-groups" page
    When I click on "Add" button
    * I type in the field "Group name" text "idviewhostgroup1"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    * I close the alert
    Then I should see "idviewhostgroup1" entry in the data table
    When I click on "Add" button
    * I type in the field "Group name" text "idviewhostgroup2"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    * I close the alert
    Then I should see "idviewhostgroup2" entry in the data table

  Scenario: Add a Host members into the host group 1
    Given I am on "host-groups" page
    And I click on "idviewhostgroup1" entry in the data table
    And I click on "Members" page tab
    And I am on "idviewhostgroup1" group > Members > "Hosts" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign hosts to host group: idviewhostgroup1"
    When I move user "idviewhost1.dom-server.ipa.demo" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new hosts to host group 'idviewhostgroup1'"
    * I close the alert
    Then I should see the element "idviewhost1.dom-server.ipa.demo" in the table

  Scenario: Add a Host members into the host group 2
    Given I am on "host-groups" page
    Given I click on "idviewhostgroup2" entry in the data table
    And I click on "Members" page tab
    And I am on "idviewhostgroup2" group > Members > "Hosts" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign hosts to host group: idviewhostgroup2"
    When I move user "idviewhost2.dom-server.ipa.demo" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new hosts to host group 'idviewhostgroup2'"
    * I close the alert
    Then I should see the element "idviewhost2.dom-server.ipa.demo" in the table

  Scenario: Add a new view
    Given I am on "id-views" page
    When I click on "Add" button
    * I type in the field "ID view name" text "a_new_view"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New ID view added"
    * I close the alert
    Then I should see "a_new_view" entry in the data table

  #
  # Start testing "applied to" hosts
  #
  Scenario: Apply ID view to the host
    When I click on "a_new_view" entry in the data table
    Then I click on "Applied to" page tab
    * I click toolbar dropdown "Apply"
    * I click toolbar dropdown item "Apply hosts"
    * I click on the arrow icon to perform search
    Then I click on the dual list item "idviewhost1"
    And I click on the dual list item "idviewhost2"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Apply" button
    Then I should see "success" alert with text "ID view applied to 2 hosts"
    * I close the alert

  Scenario: Search for a host
    When I type "idviewhost2" in the search field
    Then I should see the "idviewhost2" text in the search input field
    Then I should see the element "idviewhost2" in the table
    Then I should not see the element "idviewhost1" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    Then I should not see the element "idviewhost1" in the table
    Then I should not see the element "idviewhost2" in the table
    * I click on the X icon to clear the search field
    And I should see the element "idviewhost1" in the table
    And I should see the element "idviewhost2" in the table

  #
  # Test unapply hosts
  #
  Scenario: Unapply a host from the ID view
    Given I select partial entry "idviewhost1" in the data table
    Given I select partial entry "idviewhost2" in the data table
    When I click toolbar dropdown "Unapply"
    Then I click toolbar dropdown item "Unapply hosts"
    Then I should see partial "idviewhost1" entry in the data table
    Then I should see partial "idviewhost2" entry in the data table
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "ID view unapplied from 2 hosts"
    * I close the alert

  #
  # Test "applied to" hostgroups
  #
  Scenario: Apply ID view to a host group
    When I click toolbar dropdown "Apply"
    And I click toolbar dropdown item "Apply host groups"
    * I click on the arrow icon to perform search
    Then I click on the dual list item "idviewhostgroup1"
    And I click on the dual list item "idviewhostgroup2"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Apply" button
    Then I should see "success" alert with text "ID view applied to 2 hosts"
    * I close the alert

  #
  # Test unapply host groups
  #
  Scenario: Unapply host groups from the ID view
    When I click toolbar dropdown "Unapply"
    Then I click toolbar dropdown item "Unapply host groups"
    * I click on the arrow icon to perform search
    Then I click on the dual list item "idviewhostgroup1"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Unapply" button
    Then I should see "success" alert with text "ID view unapplied from 1 hosts"
    * I close the alert

  # Cleanup
  Scenario: Delete the ID view
    When I click on the breadcrump link "ID views"
    Then I should see "a_new_view" entry in the data table
    Then I select entry "a_new_view" in the data table
    When I click on "Delete" button
    * I see "Remove ID views" modal
    * I should see "a_new_view" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "ID views removed"
    * I close the alert
    Then I should not see "a_new_view" entry in the data table

  Scenario: Delete hosts
    Given I am on "hosts" page
    And I should see partial "idviewhost1" entry in the data table
    And I should see partial "idviewhost2" entry in the data table
    When I select partial entry "idviewhost1" in the data table
    And I select partial entry "idviewhost2" in the data table
    And I click on "Delete" button
    Then I see "Remove hosts" modal
    * I should see partial "idviewhost1" entry in the data table
    * I should see partial "idviewhost2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Hosts removed"
    * I close the alert
    Then I should not see partial "idviewhost1" entry in the data table
    Then I should not see partial "idviewhost2" entry in the data table

  Scenario: Delete host groups
    Given I am on "host-groups" page
    And I should see "idviewhostgroup1" entry in the data table
    And I should see "idviewhostgroup2" entry in the data table
    Then I select entry "idviewhostgroup1" in the data table
    And I select entry "idviewhostgroup2" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "idviewhostgroup1" entry in the data table
    * I should see "idviewhostgroup2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    * I close the alert
    Then I should not see "idviewhostgroup1" entry in the data table
    And I should not see "idviewhostgroup2" entry in the data table
