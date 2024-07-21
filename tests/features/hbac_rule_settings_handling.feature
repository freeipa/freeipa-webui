Feature: Hbac rule settings manipulation
  Modify a Hbac rule

  Background:
    Given I am logged in as "Administrator"
    Given I am on "hbac-rules" page

  Scenario Outline: Add a new rule
    Given I am on "hbac-rules" page
    When I click on "Add" button
    * I type in the field "Rule name" text "rule1"
    * I type in the field "Description" text "my description"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New HBAC rule added"
    * I close the alert
    Then I should see "rule1" entry in the data table
    * entry "rule1" should have attribute "Description" set to "my description"

  Scenario: Add user to Who category
    When I click on "rule1" entry in the data table
    * I click on "Users" page tab
    Then I click on "Add users" button
    * I see "Add users to HBAC rule" modal
    * I click on the arrow icon to perform search
    Then I click on the dual list item "admin"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added user to HBAC rule"
    * I close the alert
    Then I should see "admin" entry in the data table

  Scenario: Add group to Who category
    When I click on "Groups" page tab
    Then I click on "Add groups" button
    * I see "Add groups to HBAC rule" modal
    * I click on the arrow icon to perform search
    Then I click on the dual list item "admins"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added group to HBAC rule"
    * I close the alert
    Then I should see "admins" entry in the data table

  Scenario: Add host to Host category and dual list search short cut
    When I click on "Hosts" page tab
    Then I click on "Add hosts" button
    * I see "Add hosts to HBAC rule" modal
    Then I click on the first dual list item
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added host to HBAC rule"
    * I close the alert

  Scenario: Add hostgroup to Host category
    When I click on "Host groups" page tab
    Then I click on "Add host groups" button
    * I see "Add Host groups to HBAC rule" modal
    Then I click on the arrow icon to perform search
    Then I click on the dual list item "ipaservers"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added Host group to HBAC rule"
    * I close the alert
    Then I should see "ipaservers" entry in the data table

  Scenario: Add service to Service category
    When I scroll down
    * I click on "Services" page tab
    Then I click on "Add services" button
    * I see "Add Services to HBAC rule" modal
    Then I click on the arrow icon to perform search
    Then I click on the dual list item "crond"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added Service to HBAC rule"
    * I close the alert
    Then I scroll down
    * I should see "crond" entry in the data table

  Scenario: Add service group to Service category
    When I scroll down
    * I click on "Service groups" page tab
    Then I click on "Add service groups" button
    * I see "Add Service groups to HBAC rule" modal
    Then I click on the arrow icon to perform search
    Then I click on the dual list item "ftp"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added Service group to HBAC rule"
    * I close the alert
    Then I scroll down
    * I should see "ftp" entry in the data table

  Scenario: Set User category to allow all users
    # When enabling "Allow anyone" all members need to be removed otherwise
    # the update fails
    When I scroll up
    * I click on "Allow anyone" inline checkbox
    Then I click on "Save" button
    * I should see "success" alert with text "HBAC rule modified"
    * I close the alert
    # Members should be removed
    Then I click on "Allow anyone" inline checkbox
    When I click on "Users" page tab
    Then I should not see "admin" entry in the data table
    When I click on "Groups" page tab
    Then I should not see "admins" entry in the data table

  Scenario: Set Host category to allow all hosts
    # This is the same test as above but for the host category
    * I click on "Any host" inline checkbox
    Then I click on "Save" button
    * I should see "success" alert with text "HBAC rule modified"
    * I close the alert
    When I scroll down
    Then I click on "Any host" inline checkbox
    When I click on "Hosts" page tab
    Then I should not see "server.ipa.demo" entry in the data table
    When I click on "Host groups" page tab
    Then I should not see "ipaservers" entry in the data table

  Scenario: Set Service category to allow all services
    # This is the same test as above but for the host category
    * I click on "Any service" inline checkbox
    Then I click on "Save" button
    * I should see "success" alert with text "HBAC rule modified"
    * I close the alert
    When I scroll down
    Then I click on "Any service" inline checkbox
    When I click on "Services" page tab
    Then I should not see "crond" entry in the data table
    When I click on "Service groups" page tab
    Then I should not see "ftp" entry in the data table

  Scenario: Delete the HBAC rule for cleanup
    When I click on the breadcrump link "HBAC rules"
    Then I should see "rule1" entry in the data table
    * I select entry "rule1" in the data table
    When I click on "Delete" button
    * I should see "rule1" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "HBAC rules removed"
