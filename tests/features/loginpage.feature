Feature: Login page
  Test login using all available methods, failure handling and resetting password

  Background:
    Given I am logged in as "Administrator"
    Given I am on "active-users" page

  Scenario Outline: Successful admin login with valid username and password
    When in the logged-in user menu I click on the "Log out" button
    When I log in as "<username>" with password "<password>"
    Then I should be on "active-users" page

    Examples:
      | username | password  |
      | admin    | Secret123 |
      | root     | Secret123 |

  Scenario: Successful non-privileged user login with valid username and password with password reset and re-login
    Given sample testing user "nonadminuser" exists and is using default password

    When in the logged-in user menu I click on the "Log out" button
    Then I should be on "login" page

    When I log in as "nonadminuser" with password "Secret123"
#   default password triggers password reset
    Then I should see the login dialog with title "Reset password"
    And I should see "danger" alert with text "Your password has expired. Please enter a new password."
    And I should see "nonadminuser" in readonly text input field with ID "username"
    When In the login dialog I type in the field "Current password" text "Secret123"
    And In the login dialog I type in the field "New password" text "NewSecret123"
    And In the login dialog I type in the field "Verify password" text "NewSecret123"
    And I click on "Reset password" button
    Then I should be on "login" page

    When I log in as "nonadminuser" with password "NewSecret123"
    Then I should be on "active-users" page

  Scenario: Unsuccessful login with invalid username or password
    Given in the logged-in user menu I click on the "Log out" button
    Given I am on "login" page
    When I log in as "admin" with password "IncorrectPassword"
    Then I should be on "login" page
    Then in the modal dialog I click on "OK" button
    When I log in as "admin" with password "Secret123"

  Scenario: Successful login with valid OTP with password reset and re-login
    Given sample testing user "otpuser" exists and is using default password
    Given I click on "otpuser" entry in the data table
    Given I am on "otpuser" user settings page
    Given I click on "Two-factor authentication (password + OTP)" checkbox in "User authentication types" section
#   generate a OTP QE and obtain the secret
    Given I click on kebab menu and select "Add OTP token"
    Given in the modal dialog I click on "Add" button
    Given I acquire OTP secret from the displayed QR code
    Given I close the modal dialog

    Given I click on "Save" button
#   attempt to log in with password + otp
    When in the logged-in user menu I click on the "Log out" button
    Then I should be on "login" page
    When I log in as "otpuser" with password "Secret123" and generated OTP

    Then I should see the login dialog with title "Reset password"
    And I should see "danger" alert with text "Your password has expired. Please enter a new password."

    And I should see "otpuser" in readonly text input field with ID "username"
    When In the login dialog I type in the field "Current password" text "Secret123"
    And In the login dialog I type in the field "New password" text "NewSecret123"
    And In the login dialog I type in the field "Verify password" text "NewSecret123"
    And In the login dialog I type in the field "OTP" current OTP token
    And I click on "Reset password" button
    Then I should be on "login" page
    When I log in as "otpuser" with password "NewSecret123" and generated OTP
    And I should be on "active-users" page
    And in the logged-in user menu I click on the "Log out" button
    Then I should be on "login" page
    When I log in as "admin" with password "Secret123"

  Scenario: Unsuccessful login with invalid or expired OTP
    Given sample testing user "otpuser2" exists and is using default password
    And I click on "otpuser2" entry in the data table
    And I am on "otpuser2" user settings page
    And I click on "Two-factor authentication (password + OTP)" checkbox in "User authentication types" section
    And I click on kebab menu and select "Add OTP token"
    And in the modal dialog I click on "Add" button
#    no need to acquire the secret, we want to use incorrect OTP token
    And I close the modal dialog

    Given I click on "Save" button

    When in the logged-in user menu I click on the "Log out" button
    When I log in as "otpuser2" with password "Secret123"
    Then I should see the dialog with title "Authentication error"
    And I click on "OK" button
    Then I should be on "login" page
    When I log in as "admin" with password "Secret123"

  Scenario: Blocked login after multiple failed attempts with username and password
    Given sample testing user "blockeduser" exists
    And in the logged-in user menu I click on the "Log out" button
    # default number of failed attempts is 6
    When I log in as "blockeduser" with password "IncorrectPassword"
    When I log in as "blockeduser" with password "IncorrectPassword"
    When I log in as "blockeduser" with password "IncorrectPassword"
    When I log in as "blockeduser" with password "IncorrectPassword"
    When I log in as "blockeduser" with password "IncorrectPassword"
    When I log in as "blockeduser" with password "IncorrectPassword"
    # 7th attempt, correct password
    When I log in as "blockeduser" with password "Secret123"
    Then I should see the dialog with title "Authentication error"

    # Login is disabled, still on the login page
    And I should be on "login" page
    When I log in as "admin" with password "Secret123"

  Scenario: Blocked login after multiple failed OTP attempts
    Given sample testing user "blockedotp" exists and is using default password
    Given I click on "blockedotp" entry in the data table
    Given I am on "blockedotp" user settings page
    Given I click on "Two-factor authentication (password + OTP)" checkbox in "User authentication types" section
#   generate a OTP QE and obtain the secret
    Given I click on kebab menu and select "Add OTP token"
    Given in the modal dialog I click on "Add" button
    Given I acquire OTP secret from the displayed QR code
    Given I close the modal dialog

    Given I click on "Save" button
#   attempt to log in with password + otp
    When in the logged-in user menu I click on the "Log out" button
    Then I should be on "login" page
    # default number of failed attempts is 6
    When I log in as "blockedotp" with password "Secret12312345"
    When I log in as "blockedotp" with password "Secret12312345"
    When I log in as "blockedotp" with password "Secret12312345"
    When I log in as "blockedotp" with password "Secret12312345"
    When I log in as "blockedotp" with password "Secret12312345"
    When I log in as "blockedotp" with password "Secret12312345"
    # 7th attempt, correct password and OTP
    When I log in as "blockeduser" with password "Secret123" and generated OTP
    Then I should see the dialog with title "Authentication error"

    # Login is disabled, still on the login page
    And I should be on "login" page
    When I log in as "admin" with password "Secret123"
