Feature: Login page
  Test login using all available methods, failure handling and resetting password

  @test
  Scenario Outline: Successful admin login with valid username and password
    When I log in as "<username>" with password "<password>"
    Then I should be logged in as "Administrator"

    Examples:
      | username | password  |
      | admin    | Secret123 |
      | root     | Secret123 |

  @seed
  Scenario: Create user "jdoe"
    Given User "jdoe" "John" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Successful non-privileged user login with valid username and password with password reset and re-login
    When I log in as "jdoe" with password "Secret123"
    Then I should be on "reset-password/jdoe" page
    And I should see "reset-password-error" alert
    And I should see "jdoe" in the "reset-password-textbox-username" textbox

    When I type in the "reset-password-textbox-current-password" textbox text "Secret123"
    Then I should see "Secret123" in the "reset-password-textbox-current-password" textbox
    When I type in the "reset-password-textbox-new-password" textbox text "NewSecret123"
    Then I should see "NewSecret123" in the "reset-password-textbox-new-password" textbox
    When I type in the "reset-password-textbox-verify-password" textbox text "NewSecret123"
    Then I should see "NewSecret123" in the "reset-password-textbox-verify-password" textbox

    When I click on the "reset-password-button-reset" button
    Then I should be on "login" page

    When I log in as "jdoe" with password "NewSecret123"
    Then I should be on "active-users" page

  @cleanup
  Scenario: Delete user "jdoe"
    Given I delete user "jdoe"

  @test
  Scenario: Unsuccessful login with invalid username or password
    When I log in as "admin" with password "IncorrectPassword"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "admin" with password "Secret123"
    Then I should be logged in as "Administrator"

  @seed
  Scenario: Create user "otpuser"
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"
    And User "otpuser" has OTP enabled

  @test
  Scenario: Successful login with valid OTP with password reset and re-login
    When I log in as "otpuser" with password "Secret123" and generated OTP
    Then I should be on "reset-password/otpuser" page

    When I type in the "reset-password-textbox-current-password" textbox text "Secret123"
    Then I should see "Secret123" in the "reset-password-textbox-current-password" textbox
    When I type in the "reset-password-textbox-new-password" textbox text "NewSecret123"
    Then I should see "NewSecret123" in the "reset-password-textbox-new-password" textbox
    When I type in the "reset-password-textbox-verify-password" textbox text "NewSecret123"
    Then I should see "NewSecret123" in the "reset-password-textbox-verify-password" textbox
    When I type in the "reset-password-textbox-otp" textbox text otp token
    Then I should see otp token in the "reset-password-textbox-otp" textbox

    When I click on the "reset-password-button-reset" button
    Then I should be on "login" page

    When I log in as "otpuser" with password "NewSecret123" and generated OTP
    Then I should be logged in as "OTP User"

  @cleanup
  Scenario: Delete user "otpuser"
    Given I delete user "otpuser"

  @seed
  Scenario: Create user "otpuser"
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"
    And User "otpuser" has OTP enabled

  @test
  Scenario: Unsuccessful login with invalid or expired OTP
    When I log in as "otpuser" with password "Secret123" and generated OTP
    Then I should be on "reset-password/otpuser" page

    When I type in the "reset-password-textbox-current-password" textbox text "Secret123"
    Then I should see "Secret123" in the "reset-password-textbox-current-password" textbox
    When I type in the "reset-password-textbox-new-password" textbox text "NewSecret123"
    Then I should see "NewSecret123" in the "reset-password-textbox-new-password" textbox
    When I type in the "reset-password-textbox-verify-password" textbox text "NewSecret123"
    Then I should see "NewSecret123" in the "reset-password-textbox-verify-password" textbox
    When I type in the "reset-password-textbox-otp" textbox text otp token
    Then I should see otp token in the "reset-password-textbox-otp" textbox

    When I click on the "reset-password-button-reset" button
    Then I should be on "login" page

    When I log in as "otpuser" with password "NewSecret123"
    Then I should see "authentication-modal-error" modal

  @cleanup
  Scenario: Delete user "otpuser"
    Given I delete user "otpuser"

  @seed
  Scenario: Create user "jdoe"
    Given User "jdoe" "John" "Doe" exists and is using password "Secret123"

  @test
  Scenario: Blocked login after multiple failed attempts with username and password
    # Default number of failed attempts is 6
    When I log in as "jdoe" with password "IncorrectPassword"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "jdoe" with password "IncorrectPassword"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "jdoe" with password "IncorrectPassword"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "jdoe" with password "IncorrectPassword"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "jdoe" with password "IncorrectPassword"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "jdoe" with password "IncorrectPassword"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal
    # End login attempts

    When I log in as "jdoe" with password "Secret123"
    Then I should see "authentication-modal-error" modal

  @cleanup
  Scenario: Delete user "jdoe"
    Given I delete user "jdoe"

  @seed
  Scenario: Create user "otpuser"
    Given User "otpuser" "OTP" "User" exists and is using password "Secret123"
    And User "otpuser" has OTP enabled

  @test
  Scenario: Blocked login after multiple failed OTP attempts
    When I log in as "otpuser" with password "Secret123" and generated OTP
    Then I should be on "reset-password/otpuser" page

    When I type in the "reset-password-textbox-current-password" textbox text "Secret123"
    Then I should see "Secret123" in the "reset-password-textbox-current-password" textbox
    When I type in the "reset-password-textbox-new-password" textbox text "NewSecret123"
    Then I should see "NewSecret123" in the "reset-password-textbox-new-password" textbox
    When I type in the "reset-password-textbox-verify-password" textbox text "NewSecret123"
    Then I should see "NewSecret123" in the "reset-password-textbox-verify-password" textbox
    When I type in the "reset-password-textbox-otp" textbox text otp token
    Then I should see otp token in the "reset-password-textbox-otp" textbox

    When I click on the "reset-password-button-reset" button
    Then I should be on "login" page

    # Default number of failed attempts is 6
    When I log in as "otpuser" with password "NewSecret123123456"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "otpuser" with password "NewSecret123123456"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "otpuser" with password "NewSecret123123456"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "otpuser" with password "NewSecret123123456"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "otpuser" with password "NewSecret123123456"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal

    When I log in as "otpuser" with password "NewSecret123123456"
    Then I should see "authentication-modal-error" modal

    When I click on the "modal-button-ok" button
    Then I should not see "authentication-modal-error" modal
    # End login attempts

    When I log in as "otpuser" with password "NewSecret123" and generated OTP
    Then I should see "authentication-modal-error" modal

  @cleanup
  Scenario: Delete user "otpuser"
    Given I delete user "otpuser"
