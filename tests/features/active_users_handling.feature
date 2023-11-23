Feature: User manipulation
  Create, disable, delete, preserve and activate users


  Background:
    Given I am logged in as "Administrator"
    Given I am on "active-users" page

  Scenario Outline: Add a new user
    When I click on "Add" button
    * I type in the field "User login" text "<userLogin>"
    * I type in the field "First name" text "<firstName>"
    * I type in the field "Last name" text "<lastName>"
    * I type in the field "New Password" text "<password>"
    * I type in the field "Verify password" text "<password>"
    * in the modal dialog I click on "Add" button
    Then I should see "<userLogin>" entry in the data table
    Examples:
      | userLogin | firstName | lastName | password             |
      | testuser1 | Arthur    | Dent     | ILoveKlingonPoetry42 |
      | testuser2 | Banana    | Bread    | FishAndChips097      |
      | testuser3 | Cypress   | Gateway  | TestingIsFun73       |

#  Test if "Add and add another" behaves as expected
  Scenario: Add one user after another
    When I click on "Add" button
    * I type in the field "User login" text "chainuser1"
    * I type in the field "First name" text "Chain"
    * I type in the field "Last name" text "User1"
    * I type in the field "New Password" text "CorrectHorseBatteryStaple"
    * I type in the field "Verify password" text "CorrectHorseBatteryStaple"
    * in the modal dialog I click on "Add and add another" button

    When I type in the field "User login" text "chainuser2"
    * I type in the field "First name" text "Chain"
    * I type in the field "Last name" text "User2"
    * I type in the field "New Password" text "IncorrectHorseBatteryStaple"
    * I type in the field "Verify password" text "IncorrectHorseBatteryStaple"
    * in the modal dialog I click on "Add" button
    Then I should see "chainuser1" entry in the data table
    Then I should see "chainuser2" entry in the data table

  Scenario: Delete a user
    Given I should see "testuser1" entry in the data table
    When I select entry "testuser1" in the data table
    And I click on "Delete" button
    Then I see "Remove Active Users" modal

    When in the modal dialog I check "Delete" radio selector
    And in the modal dialog I click on "Delete" button
    Then I should not see "testuser1" entry in the data table

  Scenario: Preserve a user
    Given I should see "testuser3" entry in the data table
    When I select entry "testuser3" in the data table
    And I click on "Delete" button
    Then I see "Remove Active Users" modal

    When in the modal dialog I check "Preserve" radio selector
    And in the modal dialog I click on "Preserve" button
    Then I should not see "testuser3" entry in the data table

  Scenario: Restore preserved user
    Given I am on "preserved-users" page
    And I select entry "testuser3" in the data table
    When I select entry "testuser3" in the data table
    And I click on "Restore" button
    Then I see "Restore preserved user" modal

    When in the modal dialog I click on "Restore" button
    Then I should not see "testuser3" entry in the data table

    When I am on "active-users" page
    Then I should see "testuser3" entry in the data table

  Scenario: Disable a user
    Given I should see "testuser2" entry in the data table
    When I select entry "testuser2" in the data table
    Then button "Disable" should be enabled
    Then button "Enable" should be disabled

    When I click on "Disable" button
    Then I see "Disable confirmation" modal

    When in the modal dialog I click on "Disable" button
    Then I should see "testuser2" entry in the data table
    Then entry "testuser2" should have attribute "Status" set to "Disabled"

  Scenario: Re-enable a user
    Given I should see "testuser2" entry in the data table
    When I select entry "testuser2" in the data table
    Then button "Enable" should be enabled
    Then button "Disable" should be disabled

    When I click on "Enable" button
    Then I see "Enable confirmation" modal

    Then in the modal dialog I click on "Enable" button
    Then I should see "testuser2" entry in the data table
    Then entry "testuser2" should have attribute "Status" set to "Enabled"

Scenario: Disable multiple users at once
    Given I should see "testuser2" entry in the data table
    Given I should see "testuser3" entry in the data table
    When I select entry "testuser2" in the data table
    When I select entry "testuser3" in the data table
    Then button "Disable" should be enabled
    Then button "Enable" should be disabled

    When I click on "Disable" button
    Then I see "Disable confirmation" modal

    When in the modal dialog I click on "Disable" button
    Then I should see "testuser2" entry in the data table
    Then I should see "testuser3" entry in the data table
    Then entry "testuser2" should have attribute "Status" set to "Disabled"
    Then entry "testuser3" should have attribute "Status" set to "Disabled"

Scenario: Re-enable multiple users at once
    Given I should see "testuser2" entry in the data table
    Given I should see "testuser3" entry in the data table
    When I select entry "testuser2" in the data table
    When I select entry "testuser3" in the data table
    Then button "Enable" should be enabled
    Then button "Disable" should be disabled

    When I click on "Enable" button
    Then I see "Enable confirmation" modal

    Then in the modal dialog I click on "Enable" button
    Then I should see "testuser2" entry in the data table
    Then I should see "testuser3" entry in the data table
    Then entry "testuser2" should have attribute "Status" set to "Enabled"
    Then entry "testuser3" should have attribute "Status" set to "Enabled"

  Scenario: Try to delete admin user
    Given I should see "admin" entry in the data table
    When I select entry "admin" in the data table
    And I click on "Delete" button
    Then I see "Remove Active Users" modal

    When in the modal dialog I check "Delete" radio selector
    And in the modal dialog I click on "Delete" button
    Then I see a modal with text "admin cannot be deleted"
    When in the modal dialog I click on "OK" button
    And in the modal dialog I click on "Cancel" button
    Then I should see "admin" entry in the data table

  Scenario: Try to preserve admin user
    Given I should see "admin" entry in the data table
    When I select entry "admin" in the data table
    And I click on "Delete" button
    Then I see "Remove Active Users" modal

    When in the modal dialog I check "Preserve" radio selector
    And in the modal dialog I click on "Preserve" button
    Then I see a modal with text "admin cannot be deleted or disabled"
    When in the modal dialog I click on "OK" button
    And in the modal dialog I click on "Cancel" button
    Then I should see "admin" entry in the data table

  Scenario: Try to disable admin user
    Given I should see "admin" entry in the data table
    When I select entry "admin" in the data table
    And I click on "Disable" button
    Then I see "Disable confirmation" modal

    When in the modal dialog I click on "Disable" button
    Then I see a modal with text "admin cannot be deleted or disabled"
    When in the modal dialog I click on "OK" button
    Then I should see "admin" entry in the data table

  Scenario: Cancel creation of a user
    When I click on "Add" button
    * I type in the field "User login" text "cancelleduser"
    * I type in the field "First name" text "Cancelled"
    * I type in the field "Last name" text "User1"
    * I type in the field "New Password" text "DoesntReallyMatter"
    * I type in the field "Verify password" text "DoesntReallyMatter"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "cancelleduser" entry in the data table

  Scenario: Create a user without password
    When I click on "Add" button
    * I type in the field "User login" text "lookmanopass"
    * I type in the field "First name" text "LookMa"
    * I type in the field "Last name" text "NoPassword"
    * in the modal dialog I click on "Add" button
    Then I should see "lookmanopass" entry in the data table

  Scenario: Rebuild auto membership
    When I click on kebab menu and select "Rebuild auto membership"
    Then I see "Confirmation" modal

    When in the modal dialog I click on "OK" button
    Then I should see "success" alert with text "Success alert:Automember rebuild membership task completed"
