Feature: Netgroup settings manipulation
  Modify a netgroup

  Background:
    Given I am logged in as "Administrator"
    Given I am on "netgroups" page

  Scenario: Add two groups
    When I click on "Add" button
    * I type in the field "Netgroup name" text "netgroup1"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New netgroup added"
    * I close the alert
    Then I type in the field "Netgroup name" text "netgroup2"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    * I close the alert
    Then I should see "netgroup1" entry in the data table
    Then I should see "netgroup2" entry in the data table

  Scenario: Set Description
    When I click on "netgroup1" entry in the data table
    * I type in the textarea "description" text "test"
    Then I click on "Save" button
    * I should see "success" alert with text "Netgroup modified"
    * I close the alert
    Then Then I should see "test" in the textarea "description"

  Scenario: Set nis domain name
    When I scroll up
    Then I click in the field "NIS domain name"
    * I clear the field "nisdomainname"
    * I type in the field with ID "nisdomainname" the text "newNIS"
    Then I click on "Save" button
    * I should see "success" alert with text "Netgroup modified"
    * I close the alert
    Then I should not see value "newNIS" in any of the textboxes that belong to the field "NIS domain name"

  Scenario: Add user to User category
    When I click on "Users" page tab
    Then I click on "Add users" button
    * I see "Add users to netgroup" modal
    * I click on the arrow icon to perform search
    Then I click on the dual list item "admin"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added user to netgroup"
    * I close the alert
    Then I should see "admin" entry in the data table

  Scenario: Add group to User category
    When I click on "Groups" page tab
    Then I click on "Add groups" button
    * I see "Add groups to netgroup" modal
    * I click on the arrow icon to perform search
    Then I click on the dual list item "admins"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added group to netgroup"
    * I close the alert
    Then I should see "admins" entry in the data table

  Scenario: Add host to Host category
    When I click on "Hosts" page tab
    Then I click on "Add hosts" button
    * I see "Add hosts to netgroup" modal
    * I click on the arrow icon to perform search
    Then I click on the first dual list item
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added host to netgroup"
    * I close the alert

  Scenario: Add hostgroup to Host category
    When I click on "Host groups" page tab
    Then I click on "Add host groups" button
    * I see "Add Host groups to netgroup" modal
    Then I click on the arrow icon to perform search
    Then I click on the dual list item "ipaservers"
    * I click on the dual list add selected button
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added hostgroup to netgroup"
    * I close the alert
    Then I should see "ipaservers" entry in the data table

  Scenario: Add external host to Host category
    When I click on "External host" page tab
    Then I click on "Add external hosts" button
    * I see "Add external host" modal
    * I type in the field with ID "externalHostName" the text "test.test.test"
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added externalHost to netgroup"
    * I close the alert
    When I scroll down
    Then I should see "test.test.test" entry in the data table

  Scenario: Set User category to allow all users
    # When enabling "Allow anyone" all members need to be removed otherwise
    # the update fails
    When I scroll up
    * I click on "Allow anyone" checkbox
    Then I click on "Save" button
    * I should see "success" alert with text "Netgroup modified"
    * I close the alert
    # Members should be removed
    Then I click on "Allow anyone" checkbox
    When I click on "Users" page tab
    Then I should not see "admin" entry in the data table
    When I click on "Groups" page tab
    Then I should not see "admins" entry in the data table

  Scenario: Set Host category to allow all hosts
    # This is the same test as above but for the host category
    When I scroll down
    * I click on "Allow any host" checkbox
    Then I click on "Save" button
    * I should see "success" alert with text "Netgroup modified"
    * I close the alert
    When I scroll down
    Then I click on "Allow any host" checkbox
    When I click on "Hosts" page tab
    Then I should not see "server.ipa.demo" entry in the data table
    When I click on "Host groups" page tab
    Then I should not see "ipaservers" entry in the data table
    When I click on "External hosts" page tab
    Then I should not see "test.test.test" entry in the data table

  Scenario: Delete the groups for cleanup
    When I click on the breadcrump link "Netgroups"
    Then I should see "netgroup1" entry in the data table
    * I should see "netgroup2" entry in the data table
    * I select entry "netgroup1" in the data table
    * I select entry "netgroup2" in the data table
    When I click on "Delete" button
    * I should see "netgroup1" entry in the data table
    * I should see "netgroup2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Netgroups removed"

