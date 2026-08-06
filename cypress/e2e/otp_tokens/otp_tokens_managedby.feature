Feature: OTP tokens - Is managed by page
  Manage OTP token managers (users)

  @seed
  Scenario: Prep: Create users and OTP token for add manager test
    Given User "otpmgdbyuser" "OTPManaged" "User" exists and is using password "Secret123"
    And User "otpmanager" "OTP" "Manager" exists and is using password "Secret123"
    And OTP token "managedby_token" exists for user "otpmgdbyuser" with type "totp" and description "managedby_token"

  @test
  Scenario: Add a user manager to OTP token
    Given I am logged in as admin
    And I am on "otp-tokens/managedby_token" page

    When I click on the "otp-tokens-tab-managedby" tab
    Then I should see "otp-tokens-tab-managedby" tab selected

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-otpmanager" dual list item on the left

    When I click on "item-otpmanager" dual list item
    Then I should see "item-otpmanager" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-otpmanager" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-managedby-success" alert

    When I search for "otpmanager" in the members table
    Then I should see "otpmanager" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete add manager test data
    Given I delete OTP token "managedby_token"
    And I delete user "otpmgdbyuser"
    And I delete user "otpmanager"

  @seed
  Scenario: Prep: Create users, OTP token, and manager for remove test
    Given User "otpmgdbyuser" "OTPManaged" "User" exists and is using password "Secret123"
    And User "otpmanager" "OTP" "Manager" exists and is using password "Secret123"
    And OTP token "managedby_token" exists for user "otpmgdbyuser" with type "totp" and description "managedby_token"
    And user "otpmanager" is manager of OTP token "managedby_token"

  @test
  Scenario: Remove a user manager from OTP token
    Given I am logged in as admin
    And I am on "otp-tokens/managedby_token" page

    When I click on the "otp-tokens-tab-managedby" tab
    Then I should see "otp-tokens-tab-managedby" tab selected

    When I select entry "otpmanager" in the members table
    Then I should see "otpmanager" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-managedby-success" alert

    When I search for "otpmanager" in the members table
    Then I should not see "otpmanager" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete remove manager test data
    Given I delete OTP token "managedby_token"
    And I delete user "otpmgdbyuser"
    And I delete user "otpmanager"
