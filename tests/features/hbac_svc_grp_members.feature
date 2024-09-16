Feature: HBAC service group members
  Work with Members section and its operations

  Background:
    Given I am logged in as "Administrator"
    Given I am on "hbac-service-groups" page

  #
  # Test HBAC service groups members
  #
  Scenario: Add a HBAC service member
    Given I click on "ftp" entry in the data table
    Given I click on "Members" page tab
    Given I am on "ftp" group > Members > "HBAC services" section
    Then I should see the "service" tab count is "5"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign HBAC service members to: ftp"
    When I move user "crond" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new HBAC service members to 'ftp'"
    * I close the alert
    Then I should see the element "crond" in the table
    Then I should see the "service" tab count is "6"

  Scenario: Search for a user
    When I type "crond" in the search field
    Then I should see the "crond" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "crond" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see the element "crond" in the table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Remove User member
    When I select entry "crond" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete HBAC service members from: ftp"
    And the "crond" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed HBAC service members from 'ftp'"
    * I close the alert
    And I should not see the element "crond" in the table
    Then I should see the "service" tab count is "5"
