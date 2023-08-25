Feature: User manipulation
  Create, edit, delete, preserve and activate users

  Background:
    Given I am on login page
    When I log in as "admin" with password "Secret123"

  Scenario: Add a new user
    Given I open the side menu
    * I click on "Active users" tab
    * I close the side menu
    * there is only admin user active
    When I click on "Add" button
    * I type in the field "User login" text "testuser1"
    * I type in the field "First name" text "Arthur"
    * I type in the field "Last name" text "Dent"
    * I type in the field "New Password" text "ILoveKlingonPoetry42"
    * I type in the field "Verify password" text "ILoveKlingonPoetry42"
    * in the modal dialog I click on "Add" button
    Then I should see "testuser1" entry in the data table
