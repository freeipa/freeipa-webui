Feature: OTP tokens manipulation
  Create, search, enable, disable and delete OTP tokens

  @seed
  Scenario: Prep: Create user for TOTP test
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"

  @test
  Scenario: Add a new TOTP token with owner
    Given I am logged in as admin
    And I am on "otp-tokens" page

    When I click on the "otp-tokens-button-add" button
    Then I should see "add-otp-token-modal" modal
    And I should see the "modal-radio-totp" radio button is selected

    When I type in the "modal-textbox-description" textbox text "totp_token"
    Then I should see "totp_token" in the "modal-textbox-description" textbox

    When I select "otpuser" option in the "modal-select-owner" selector
    Then I should see "otpuser" option in the "modal-select-owner" selector

    When I click on the "modal-button-add" button
    Then I should not see "add-otp-token-modal" modal
    And I should see "configure-your-token-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "configure-your-token-modal" modal
    And I should see "totp_token" entry in the data table with ID "otp-tokens-table"

  @cleanup
  Scenario: Cleanup: Delete test data after TOTP test
    Given I delete OTP token with description "totp_token"
    And I delete user "otpuser"

  @seed
  Scenario: Prep: Create user for HOTP test
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"

  @test
  Scenario: Add a new HOTP token with owner
    Given I am logged in as admin
    And I am on "otp-tokens" page

    When I click on the "otp-tokens-button-add" button
    Then I should see "add-otp-token-modal" modal

    When I click on the "modal-radio-hotp" radio button
    Then I should see the "modal-radio-hotp" radio button is selected
    And I should see the "modal-radio-totp" radio button is not selected

    When I type in the "modal-textbox-description" textbox text "hotp_token"
    Then I should see "hotp_token" in the "modal-textbox-description" textbox

    When I select "otpuser" option in the "modal-select-owner" selector
    Then I should see "otpuser" option in the "modal-select-owner" selector

    When I click on the "modal-button-add" button
    Then I should not see "add-otp-token-modal" modal
    And I should see "configure-your-token-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "configure-your-token-modal" modal
    And I should see "hotp_token" entry in the data table with ID "otp-tokens-table"

  @cleanup
  Scenario: Cleanup: Delete test data after HOTP test
    Given I delete OTP token with description "hotp_token"
    And I delete user "otpuser"

  @seed
  Scenario: Prep: Create user and token for search test
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"
    And an OTP token exists for user "otpuser" with type "totp" and description "search_token"

  @test
  Scenario: TOTP is the default token type
    Given I am logged in as admin
    And I am on "otp-tokens" page

    When I click on the "otp-tokens-button-add" button
    Then I should see "add-otp-token-modal" modal
    And I should see the "modal-radio-totp" radio button is selected
    And I should see the "modal-radio-hotp" radio button is not selected

    When I click on the "modal-button-cancel" button
    Then I should not see "add-otp-token-modal" modal

  @cleanup
  Scenario: Cleanup: Delete search test data
    Given I delete OTP token with description "search_token"
    And I delete user "otpuser"

  @seed
  Scenario: Prep: Create user and token for disable test
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"
    And an OTP token exists for user "otpuser" with type "totp" and description "disable_token"

  @test
  Scenario: Disable an OTP token
    Given I am logged in as admin
    And I am on "otp-tokens" page

    When I search for "otpuser" in the data table
    Then I should see "otpuser" entry in the data table with ID "otp-tokens-table"

    When I select "otpuser" entry in the data table with ID "otp-tokens-table"
    Then I should see "otpuser" entry selected in the data table with ID "otp-tokens-table"

    When I click on the "otp-tokens-button-disable" button
    Then I should see "enable-disable-otp-tokens-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "enable-disable-otp-tokens-modal" modal
    And I should see "success" alert

  @cleanup
  Scenario: Cleanup: Delete disable test data
    Given I delete OTP token with description "disable_token"
    And I delete user "otpuser"

  @seed
  Scenario: Seed: Create user and disabled token for enable test
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"
    And OTP token "enable_token" exists for user "otpuser" with type "totp" and description "enable_token"
    And OTP token "enable_token" is disabled

  @test
  Scenario: Enable a disabled OTP token
    Given I am logged in as admin
    And I am on "otp-tokens" page

    When I search for "otpuser" in the data table
    Then I should see "otpuser" entry in the data table with ID "otp-tokens-table"

    When I select "otpuser" entry in the data table with ID "otp-tokens-table"
    Then I should see "otpuser" entry selected in the data table with ID "otp-tokens-table"

    When I click on the "otp-tokens-button-enable" button
    Then I should see "enable-disable-otp-tokens-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "enable-disable-otp-tokens-modal" modal
    And I should see "success" alert

  @cleanup
  Scenario: Cleanup: Delete enable test data
    Given I delete OTP token "enable_token"
    And I delete user "otpuser"

  @seed
  Scenario: Seed: Create user and OTP token for delete test
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"
    And an OTP token exists for user "otpuser" with type "totp" and description "delete_token"

  @test
  Scenario: Delete an OTP token
    Given I am logged in as admin
    And I am on "otp-tokens" page

    When I search for "otpuser" in the data table
    Then I should see "otpuser" entry in the data table with ID "otp-tokens-table"

    When I select "otpuser" entry in the data table with ID "otp-tokens-table"
    Then I should see "otpuser" entry selected in the data table with ID "otp-tokens-table"

    When I click on the "otp-tokens-button-delete" button
    Then I should see "delete-otp-tokens-modal" modal

    When I click on the "modal-button-ok" button
    Then I should see "remove-otp-tokens-success" alert
    And I should not see "delete-otp-tokens-modal" modal

  @cleanup
  Scenario: Cleanup: Delete 'delete_token' test data
    Given I delete OTP token with description "delete_token"
    And I delete user "otpuser"
