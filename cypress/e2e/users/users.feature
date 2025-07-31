Feature: User manipulation
  Create, disable, delete, preserve and activate users

  @test
  Scenario Outline: Add a new user
    Given I am logged in as admin

    When I create user "<userLogin>" "<firstName>" "<lastName>" with password "<password>"
    Then I should see "add-user-success" alert

    When I search for "<userLogin>" in the data table
    Then I should see "<userLogin>" entry in the data table

    Examples:
      | userLogin | firstName | lastName | password             |
      | testuser1 | Arthur    | Dent     | ILoveKlingonPoetry42 |
      | testuser2 | Banana    | Bread    | FishAndChips097      |
      | testuser3 | Cypress   | Gateway  | TestingIsFun73       |

  @cleanup
  Scenario: Delete users
    Given I delete user "testuser1"
    And I delete user "testuser2"
    And I delete user "testuser3"

  #  Test if "Add and add another" behaves as expected
  @test
  Scenario: Add one user after another
    Given I am logged in as admin

    When I click on the "active-users-button-add" button
    Then I should see "add-user-modal" modal

    When I fill in user "chainuser1" "Chain" "User1" with password "CorrectHorseBatteryStaple" and click add another
    Then I should see "add-user-modal" modal
    And I should see "add-user-success" alert
    When I click on the "modal-button-cancel" button
    Then I should not see "add-user-modal" modal

    When I search for "chainuser1" in the data table
    Then I should see "chainuser1" entry in the data table

  @cleanup
  Scenario: Delete users
    Given I delete user "chainuser1"

  @seed
  Scenario: Create user "jdoe"
    Given User "jdoe" "John" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Delete a user
    Given I am logged in as admin

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

    When I select entry "jdoe" in the data table
    Then I should see "jdoe" entry selected in the data table

    When I click on the "active-users-button-delete" button
    Then I should see "delete-users-modal" modal

    When I click on the "modal-radio-delete" radio button
    Then I should see the "modal-radio-delete" radio button is selected

    When I click on the "modal-button-delete" button
    Then I should not see "delete-users-modal" modal

    When I search for "jdoe" in the data table
    Then I should not see "jdoe" entry in the data table

  @seed
  Scenario: Create user "jdoe"
    Given User "jdoe" "John" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Preserve a user
    Given I am logged in as admin

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

    When I select entry "jdoe" in the data table
    Then I should see "jdoe" entry selected in the data table

    When I click on the "active-users-button-delete" button
    Then I should see "delete-users-modal" modal

    When I click on the "modal-radio-preserve" radio button
    Then I should see the "modal-radio-preserve" radio button is selected
    And I should see "preserve-users-modal" modal

    When I click on the "modal-button-preserve" button
    Then I should not see "preserve-users-modal" modal

    When I search for "jdoe" in the data table
    Then I should not see "jdoe" entry in the data table

    When I navigate to "preserved-users" page
    Then I should be on "preserved-users" page

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

  @cleanup
  Scenario: Delete users
    Given I delete preserved user "jdoe"

  @seed
  Scenario: Create preserved user "jdoe"
    Given Preserved user "jdoe" "John" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Restore preserved user
    Given I am logged in as admin
    Given I am on "preserved-users" page

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

    When I select entry "jdoe" in the data table
    Then I should see "jdoe" entry selected in the data table

    When I click on the "preserved-users-button-restore" button
    Then I should see "restore-preserved-users-modal" modal

    When I click on the "modal-button-restore" button
    Then I should not see "restore-preserved-users-modal" modal

    When I search for "jdoe" in the data table
    Then I should not see "jdoe" entry in the data table

    When I navigate to "active-users" page
    Then I should be on "active-users" page

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

  @cleanup
  Scenario: Delete user
    Given I delete user "jdoe"

  @seed
  Scenario: Create user "jdoe"
    Given User "jdoe" "John" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Disable a user
    Given I am logged in as admin

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

    When I select entry "jdoe" in the data table
    Then I should see "jdoe" entry selected in the data table

    When I click on the "active-users-button-disable" button
    Then I should see "disable-users-modal" modal

    When I click on the "modal-button-disable" button
    Then I should not see "disable-users-modal" modal

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table
    And I should see "jdoe" user in the data table disabled

  @cleanup
  Scenario: Delete user
    Given I delete user "jdoe"

  @seed
  Scenario: Create disabled user "jdoe"
    Given Disabled user "jdoe" "John" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Re-enable a user
    Given I am logged in as admin

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

    When I select entry "jdoe" in the data table
    Then I should see "jdoe" entry selected in the data table

    When I click on the "active-users-button-enable" button
    Then I should see "enable-users-modal" modal

    When I click on the "modal-button-enable" button
    Then I should not see "enable-users-modal" modal

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table
    And I should see "jdoe" user in the data table enabled

  @cleanup
  Scenario: Delete user
    Given I delete user "jdoe"

  @seed
  Scenario: Create users
    Given User "jdoe" "John" "Doe" exists and is using password "Secret123"
    And User "adoe" "Adam" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Disable multiple users at once
    Given I am logged in as admin

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

    When I select entry "jdoe" in the data table
    Then I should see "jdoe" entry selected in the data table

    When I search for "adoe" in the data table
    Then I should see "adoe" entry in the data table

    When I select entry "adoe" in the data table
    Then I should see "adoe" entry selected in the data table

    When I click on the "active-users-button-disable" button
    Then I should see "disable-users-modal" modal

    When I click on the "modal-button-disable" button
    Then I should not see "disable-users-modal" modal

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table
    And I should see "jdoe" user in the data table disabled

    When I search for "adoe" in the data table
    Then I should see "adoe" entry in the data table
    And I should see "adoe" user in the data table disabled

  @cleanup
  Scenario: Delete users
    Given I delete user "jdoe"
    And I delete user "adoe"

  @seed
  Scenario: Create disabled users
    Given Disabled user "jdoe" "John" "Doe" exists and is using password "Secret123"
    And Disabled user "adoe" "Adam" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Re-enable multiple users at once
    Given I am logged in as admin

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

    When I select entry "jdoe" in the data table
    Then I should see "jdoe" entry selected in the data table

    When I search for "adoe" in the data table
    Then I should see "adoe" entry in the data table

    When I select entry "adoe" in the data table
    Then I should see "adoe" entry selected in the data table

    When I click on the "active-users-button-enable" button
    Then I should see "enable-users-modal" modal

    When I click on the "modal-button-enable" button
    Then I should not see "enable-users-modal" modal

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table
    And I should see "jdoe" user in the data table enabled

    When I search for "adoe" in the data table
    Then I should see "adoe" entry in the data table
    And I should see "adoe" user in the data table enabled

  @cleanup
  Scenario: Delete users
    Given I delete user "jdoe"
    And I delete user "adoe"

  @test
  Scenario: Try to delete admin user
    Given I am logged in as admin

    When I search for "admin" in the data table
    Then I should see "admin" entry in the data table

    When I select entry "admin" in the data table
    Then I should see "admin" entry selected in the data table

    When I click on the "active-users-button-delete" button
    Then I should see "delete-users-modal" modal

    When I click on the "modal-radio-delete" radio button
    Then I should see the "modal-radio-delete" radio button is selected

    When I click on the "modal-button-delete" button
    # Spawning overlaying modals is a bad practice! 
    # Instead of clicking through the modals, we just redirect
    Then I should see "delete-users-modal-error" modal

    When I navigate to "active-users" page
    Then I should be on "active-users" page

    When I search for "admin" in the data table
    Then I should see "admin" entry in the data table

  @test
  Scenario: Try to preserve admin user
    Given I am logged in as admin

    When I search for "admin" in the data table
    Then I should see "admin" entry in the data table

    When I select entry "admin" in the data table
    Then I should see "admin" entry selected in the data table

    When I click on the "active-users-button-delete" button
    Then I should see "delete-users-modal" modal

    When I click on the "modal-radio-preserve" radio button
    Then I should see the "modal-radio-preserve" radio button is selected
    And I should see "preserve-users-modal" modal

    When I click on the "modal-button-preserve" button
    # Spawning overlaying modals is a bad practice! 
    # Instead of clicking through the modals, we just redirect
    Then I should see "preserve-users-modal" modal

    When I navigate to "active-users" page
    Then I should be on "active-users" page

    When I search for "admin" in the data table
    Then I should see "admin" entry in the data table

  @test
  Scenario: Cancel creation of a user
    Given I am logged in as admin

    When I search for "jdoe" in the data table
    Then I should not see "jdoe" entry in the data table

    When I click on the "active-users-button-add" button
    Then I should see "add-user-modal" modal

    When I type in the "modal-textbox-login" textbox text "jdoe"
    Then I should see "jdoe" in the "modal-textbox-login" textbox

    When I type in the "modal-textbox-first-name" textbox text "Joe"
    Then I should see "Joe" in the "modal-textbox-first-name" textbox

    When I type in the "modal-textbox-last-name" textbox text "Doe"
    Then I should see "Doe" in the "modal-textbox-last-name" textbox

    When I type in the "modal-textbox-new-password" textbox text "Secret123"
    Then I should see "Secret123" in the "modal-textbox-new-password" textbox

    When I type in the "modal-textbox-verify-password" textbox text "Secret123"
    Then I should see "Secret123" in the "modal-textbox-verify-password" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-user-modal" modal

    When I search for "jdoe" in the data table
    Then I should not see "jdoe" entry in the data table

  @test
  Scenario: Create a user without password
    Given I am logged in as admin

    When I search for "jdoe" in the data table
    Then I should not see "jdoe" entry in the data table

    When I click on the "active-users-button-add" button
    Then I should see "add-user-modal" modal

    When I type in the "modal-textbox-login" textbox text "jdoe"
    Then I should see "jdoe" in the "modal-textbox-login" textbox

    When I type in the "modal-textbox-first-name" textbox text "Joe"
    Then I should see "Joe" in the "modal-textbox-first-name" textbox

    When I type in the "modal-textbox-last-name" textbox text "Doe"
    Then I should see "Doe" in the "modal-textbox-last-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-user-modal" modal

    When I search for "jdoe" in the data table
    Then I should see "jdoe" entry in the data table

  @cleanup
  Scenario: Delete user
    Given I delete user "jdoe"

  @test
  Scenario: Rebuild auto membership
    Given I am logged in as admin

    When I click on the "active-users-kebab" kebab menu
    Then I should see "active-users-kebab" kebab menu expanded

    When I click on the "active-users-kebab-rebuild-auto-membership" button
    Then I should see "rebuild-auto-membership-modal" modal

    When I click on the "modal-button-ok" button
    Then I should see "rebuild-automember-success" alert
