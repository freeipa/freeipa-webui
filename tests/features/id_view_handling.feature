Feature: ID View manipulation
  Create, and delete ID views

  Background:
    Given I am logged in as "Administrator"
    Given I am on "id-views" page

  Scenario: Add a new view
    When I click on "Add" button
    * I type in the field "ID view name" text "a_new_view"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New ID view added"
    Then I should see "a_new_view" entry in the data table

  Scenario: Add a new ID view with a description
    When I click on "Add" button
    * I type in the field "ID view name" text "b_new_view"
    * I type in the field "Description" text "my description"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New ID view added"
    Then I should see "b_new_view" entry in the data table
    * entry "b_new_view" should have attribute "Description" set to "my description"

  Scenario: Add one view after another
    When I click on "Add" button
    * I type in the field "ID view name" text "c_new_view"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New ID view added"
    Then I type in the field "ID view name" text "d_new_view"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New ID view added"
    * I close the alert
    Then I should see "c_new_view" entry in the data table
    Then I should see "d_new_view" entry in the data table

  Scenario: Unapply views from hosts
    When I click on the settings kebab menu and select "Unapply from hosts"
    Then I see "Unapply ID views from hosts" modal
    When I click on the arrow icon to perform search in modal
    * I click on the first dual list item
    * I click on the dual list add selected button
    When in the modal dialog I click on "Unapply" button
    Then I should see "success" alert with text "ID views unapplied from hosts"
    * I close the alert

  Scenario: Unapply views from host groups
    When I click on the settings kebab menu and select "Unapply from host groups"
    Then I click on the arrow icon to perform search in modal
    * I click on the first dual list item
    * I click on the dual list add selected button
    When in the modal dialog I click on "Unapply" button
    Then I should see "success" alert with text "ID views unapplied from host groups"
    * I close the alert

  Scenario: Delete a view
    Given I should see "a_new_view" entry in the data table
    Then I select entry "a_new_view" in the data table
    When I click on "Delete" button
    * I see "Remove ID views" modal
    * I should see "a_new_view" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "ID views removed"
    Then I should not see "a_new_view" entry in the data table

  Scenario: Delete many views
    Given I should see "b_new_view" entry in the data table
    Given I should see "c_new_view" entry in the data table
    Given I should see "d_new_view" entry in the data table
    Then I select entry "b_new_view" in the data table
    Then I select entry "c_new_view" in the data table
    Then I select entry "d_new_view" in the data table
    When I click on "Delete" button
    * I see "Remove ID views" modal
    * I should see "b_new_view" entry in the data table
    * I should see "c_new_view" entry in the data table
    * I should see "d_new_view" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "ID views removed"
    Then I should not see "b_new_view" entry in the data table
    Then I should not see "c_new_view" entry in the data table
    Then I should not see "d_new_view" entry in the data table

  Scenario: Cancel creation of a view
    When I click on "Add" button
    * I type in the field "ID view name" text "cancelview"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "cancelview" entry in the data table
