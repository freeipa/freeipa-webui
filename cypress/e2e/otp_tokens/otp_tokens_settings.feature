Feature: OTP tokens - Settings page
  Modify OTP token settings

  @seed
  Scenario: Prep: Create user and OTP token for set description test
    Given User "otpsettingsuser" "OTP" "Settings" exists and is using password "Secret123"
    And OTP token "settings_token" exists for user "otpsettingsuser" with type "totp" and description "settings_token"

  @test
  Scenario: Set Description field
    Given I am logged in as admin
    And I am on "otp-tokens/settings_token" page

    When I type in the "otp-tokens-tab-settings-textbox-description" textbox text "Updated description"
    Then I should see "Updated description" in the "otp-tokens-tab-settings-textbox-description" textbox
    And I should see the "otp-tokens-tab-settings-button-save" button is enabled
    And I should see the "otp-tokens-tab-settings-button-revert" button is enabled

    When I click on the "otp-tokens-tab-settings-button-save" button
    Then I should see "success" alert

  @cleanup
  Scenario: Cleanup: Delete set description test data
    Given I delete OTP token "settings_token"
    And I delete user "otpsettingsuser"

  @seed
  Scenario: Prep: Create user and OTP token for set vendor test
    Given User "otpsettingsuser" "OTP" "Settings" exists and is using password "Secret123"
    And OTP token "settings_token" exists for user "otpsettingsuser" with type "totp" and description "settings_token"

  @test
  Scenario: Set Vendor field
    Given I am logged in as admin
    And I am on "otp-tokens/settings_token" page

    When I type in the "otp-tokens-tab-settings-textbox-ipatokenvendor" textbox text "TestVendor"
    Then I should see "TestVendor" in the "otp-tokens-tab-settings-textbox-ipatokenvendor" textbox
    And I should see the "otp-tokens-tab-settings-button-save" button is enabled

    When I click on the "otp-tokens-tab-settings-button-save" button
    Then I should see "success" alert

  @cleanup
  Scenario: Cleanup: Delete set vendor test data
    Given I delete OTP token "settings_token"
    And I delete user "otpsettingsuser"

  @seed
  Scenario: Prep: Create user and OTP token for revert test
    Given User "otpsettingsuser" "OTP" "Settings" exists and is using password "Secret123"
    And OTP token "settings_token" exists for user "otpsettingsuser" with type "totp" and description "settings_token"

  @test
  Scenario: Revert changes
    Given I am logged in as admin
    And I am on "otp-tokens/settings_token" page

    When I type in the "otp-tokens-tab-settings-textbox-description" textbox text "Reverted description"
    Then I should see "Reverted description" in the "otp-tokens-tab-settings-textbox-description" textbox
    And I should see the "otp-tokens-tab-settings-button-revert" button is enabled

    When I click on the "otp-tokens-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see the "otp-tokens-tab-settings-button-save" button is disabled
    And I should see the "otp-tokens-tab-settings-button-revert" button is disabled

  @cleanup
  Scenario: Cleanup: Delete revert test data
    Given I delete OTP token "settings_token"
    And I delete user "otpsettingsuser"

  @seed
  Scenario: Prep: Create user and OTP token for disable test
    Given User "otpsettingsuser" "OTP" "Settings" exists and is using password "Secret123"
    And OTP token "settings_token" exists for user "otpsettingsuser" with type "totp" and description "settings_token"

  @test
  Scenario: Disable token from settings kebab
    Given I am logged in as admin
    And I am on "otp-tokens/settings_token" page

    When I click on the "otp-tokens-tab-settings-kebab" kebab menu
    Then I should see "otp-tokens-tab-settings-kebab" kebab menu expanded

    When I click on the "otp-tokens-tab-settings-kebab-disable" button
    Then I should see "enable-disable-otp-tokens-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "enable-disable-otp-tokens-modal" modal
    And I should see "success" alert

    When I click on the "otp-tokens-tab-settings-kebab" kebab menu
    Then I should see "otp-tokens-tab-settings-kebab" kebab menu expanded
    And I should see the "otp-tokens-tab-settings-kebab-disable" kebab menu item is disabled

  @cleanup
  Scenario: Cleanup: Delete disable test data
    Given I delete OTP token "settings_token"
    And I delete user "otpsettingsuser"

  @seed
  Scenario: Prep: Create user and disabled OTP token for enable test
    Given User "otpsettingsuser" "OTP" "Settings" exists and is using password "Secret123"
    And OTP token "settings_token" exists for user "otpsettingsuser" with type "totp" and description "settings_token"
    And OTP token "settings_token" is disabled

  @test
  Scenario: Enable token from settings kebab
    Given I am logged in as admin
    And I am on "otp-tokens/settings_token" page

    When I click on the "otp-tokens-tab-settings-kebab" kebab menu
    Then I should see "otp-tokens-tab-settings-kebab" kebab menu expanded

    When I click on the "otp-tokens-tab-settings-kebab-enable" button
    Then I should see "enable-disable-otp-tokens-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "enable-disable-otp-tokens-modal" modal
    And I should see "success" alert

    When I click on the "otp-tokens-tab-settings-kebab" kebab menu
    Then I should see "otp-tokens-tab-settings-kebab" kebab menu expanded
    And I should see the "otp-tokens-tab-settings-kebab-enable" kebab menu item is disabled

  @cleanup
  Scenario: Cleanup: Delete enable test data
    Given I delete OTP token "settings_token"
    And I delete user "otpsettingsuser"

  @seed
  Scenario: Prep: Create user and OTP token for delete test
    Given User "otpsettingsuser" "OTP" "Settings" exists and is using password "Secret123"
    And OTP token "settings_token" exists for user "otpsettingsuser" with type "totp" and description "settings_token"

  @test
  Scenario: Delete token from settings kebab
    Given I am logged in as admin
    And I am on "otp-tokens/settings_token" page

    When I click on the "otp-tokens-tab-settings-kebab" kebab menu
    Then I should see "otp-tokens-tab-settings-kebab" kebab menu expanded

    When I click on the "otp-tokens-tab-settings-kebab-delete" button
    Then I should see "delete-otp-tokens-modal" modal

    When I click on the "modal-button-ok" button
    Then I should see "remove-otp-tokens-success" alert

  @cleanup
  Scenario: Cleanup: Delete remaining test data
    Given I delete user "otpsettingsuser"
