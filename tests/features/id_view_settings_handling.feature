Feature: ID View manipulation
  Modify an ID view
  Background:
    Given I am logged in as "Administrator"
    Given I am on "id-views" page

  Scenario: Add a new view
    When I click on "Add" button
    * I type in the field "ID view name" text "a_new_view"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New ID view added"
    Then I should see "a_new_view" entry in the data table

  Scenario: Set Description
    When I click on "a_new_view" entry in the data table
    * I type in the textarea "description" text "test"
    Then I click on "Save" button
    * I should see "success" alert with text "ID view modified"
    * I close the alert
    Then Then I should see "test" in the textarea "description"

  Scenario: Set domain resolution order
    Then I click in the field "Domain resolution order"
    * I clear the field "ipadomainresolutionorder"
    * I type in the field with ID "ipadomainresolutionorder" the text "dom-server.ipa.demo"
    Then I click on "Save" button
    * I should see "success" alert with text "ID view modified"
    * I close the alert

  Scenario: Delete the new view
    When I click on the breadcrump link "ID views"
    Then I should see "a_new_view" entry in the data table
    * I select entry "a_new_view" in the data table
    When I click on "Delete" button
    * I should see "a_new_view" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "ID views removed"
