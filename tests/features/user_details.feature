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

  Scenario: Change the account settings - SSH keys addition
      When I click on Add key in the SSH public keys section
      Then I see "Set SSH key" modal
      When I put SSH key named "valid sample 1" into the text area
      And in the modal dialog I click on "Set" button
      Then I should see "success" alert with text "Added SSH public key to 'armadillo'"
      And I should see 1 SSH keys in the SSH public keys section
      When I click on Show key button for key number 1
      Then the SSH key should match "valid sample 1"
      * in the modal dialog I click on "Cancel" button
      # Duplicate key
      When I click on Add key in the SSH public keys section
      Then I see "Set SSH key" modal
      When I put SSH key named "valid sample 1" into the text area
      And in the modal dialog I click on "Set" button
      Then I should see "danger" alert with text "no modifications to be performed"
      * in the modal dialog I click on "Cancel" button
      And I should see 1 SSH keys in the SSH public keys section
      # Invalid key
      When I click on Add key in the SSH public keys section
      Then I see "Set SSH key" modal
      When I put SSH key named "invalid sample" into the text area
      And in the modal dialog I click on "Set" button
      Then I should see "danger" alert with text "invalid 'sshpubkey': invalid SSH public key"
      * in the modal dialog I click on "Cancel" button
      And I should see 1 SSH keys in the SSH public keys section
      # Another valid key
      When I click on Add key in the SSH public keys section
      Then I see "Set SSH key" modal
      When I put SSH key named "valid sample 2" into the text area
      And in the modal dialog I click on "Set" button
      Then I should see "success" alert with text "Added SSH public key to 'armadillo'"
      And I should see 2 SSH keys in the SSH public keys section
      When I click on Show key button for key number 2
      Then the SSH key should match "valid sample 2"
      * in the modal dialog I click on "Cancel" button

  Scenario: Change the account settings - SSH keys deletion
    When I click on Delete button for key number 1
    Then I see "Remove SSH Public Key" modal
    When in the modal dialog I click on "Cancel" button
    Then I should see 2 SSH keys in the SSH public keys section

    When I click on Delete button for key number 1
    Then I see "Remove SSH Public Key" modal
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed SSH public key from 'armadillo'"
    And I should see 1 SSH keys in the SSH public keys section
    # the order has changed, hence key number 1
    When I click on Delete button for key number 1
    Then I see "Remove SSH Public Key" modal
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed SSH public key from 'armadillo'"
    And I should see 0 SSH keys in the SSH public keys section
