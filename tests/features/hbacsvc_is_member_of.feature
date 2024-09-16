Feature: HBAC service is a member of
  Work with HBAC service Is a member of section

  Background:
    Given I am logged in as "Administrator"
    Given I am on "hbac-services" page

  # Test HBAC service group memberships
  Scenario: Add crond to a HBAC service group
    Given I click on "crond" entry in the data table
    Given I click on the Is a member of section
    Given I am on "crond" user > Is a member of > "HBAC service groups" section
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'crond' to HBAC service groups"
    When I move user "ftp" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned 'crond' to HBAC service groups"
    * I close the alert
    Then I should see the element "ftp" in the table

  Scenario: Search for a HBAC service group
    When I type "ftp" in the search field
    Then I should see the "ftp" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "ftp" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see "ftp" entry in the data table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Delete a member from the HBAC service group
    When I select entry "ftp" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Remove 'crond' from HBAC service groups"
    And the "ftp" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed 'crond' from HBAC service groups"
    * I close the alert
    And I should not see the element "ftp" in the table

