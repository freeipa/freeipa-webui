Feature: User details
  Work with user details and its associations

  Background:
    Given I am logged in as "Administrator"
    Given I am on "active-users" page
    Given sample testing user "armadillo" exists
    Given I click on "armadillo" entry in the data table
    Given I am on "armadillo" user settings page

  Scenario Outline: Change the identity settings
    When I click in the field "First name"
    * I clear the selected field
    * I type in the selected field text "<firstName>"
    When I click in the field "Last name"
    * I clear the selected field
    * I type in the selected field text "<lastName>"
    When I click in the field "Full name"
    * I clear the selected field
    * I type in the selected field text "<firstName> <lastName>"
    When I click in the field "Job title"
    * I clear the selected field
    * I type in the selected field text "<jobTitle>"
    When I click in the field "GECOS"
    * I clear the selected field
    * I type in the selected field text "<firstName> <lastName>"
    When I click in the field "Class"
    * I clear the selected field
    * I type in the selected field text "<class>"

    When I click on "Save" button
    Then I should see "success" alert with text "User modified"
    When I click on "Refresh" button
    Then I should see value "<firstName>" in the field "First name"
    And I should see value "<lastName>" in the field "Last name"
    And I should see value "<firstName> <lastName>" in the field "Full name"
    And I should see value "<firstName> <lastName>" in the field "GECOS"
    And I should see value "<class>" in the field "Class"
    Examples:
     | firstName | lastName | jobTitle |  class   |
     | Reginald  | Barclay  | engineer |  ipauser |

  Scenario: Change the account settings - login, password, home
    When I click in the field "User login"
    Then the active field should be read-only
    When I click in the field "Password"
    Then the active field should be empty
    When I click in the field "Home directory"
    * I clear the selected field
    * I type in the selected field text "/home/rbarclay"

    When I click on "Save" button
    Then I should see "success" alert with text "User modified"
    When I click on "Refresh" button
    Then I should see value "armadillo" in the field "User login"
    And I should see value "" in the field "Password"
    And I should see value "/home/rbarclay" in the field "Home directory"

