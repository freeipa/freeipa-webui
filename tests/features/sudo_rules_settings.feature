Feature: Sudo rules - Settings page
  Modify a sudo rule

  Background:
    Given I am logged in as "Administrator"

  # Create test entry
  Scenario: Add a new rule
    Given I am on "sudo-rules" page
    When I click on "Add" button
    And I type in the field "Rule name" text "sudoRule1"
    When in the modal dialog I click on "Add" button
    And I should see "success" alert with text "New sudo rule added"
    Then I close the alert
    And I should see "sudoRule1" entry in the data table

  # 'General' subsection
  # - Sudo order
  Scenario: Add sudo order
    Given I am on the "sudo-rules" > "sudoRule1" Settings page
    When I click on the "sudoorder" number plus button
    And I click on "Save" button
    And I should see the "sudoorder" number input value is "1"
    And I should see "success" alert with text "Sudo rule modified"
    Then I close the alert
    When I click on the "sudoorder" number minus button
    And I click on "Save" button
    And I should see "success" alert with text "Sudo rule modified"
    Then I close the alert

  # - Description
  Scenario: Set Description
    When I type in the textarea "description" text "testing description"
    And I click on "Save" button
    And I should see "success" alert with text "Sudo rule modified"
    Then I close the alert
    And Then I should see "testing description" in the textarea "description"

  # 'Options' subsection
  Scenario: Add a new option
    When I click on "Add options" button
    Then I see a modal with title text "Add sudo option"
    And I type in the flex field "Sudo option" text "sudooption1"
    And I click on "Add" button
    And I should see "success" alert with text "Sudo option added"
    Then I close the alert
    And I should see "sudooption1" entry in the data table

  Scenario: Remove option from table
    Given I should see "sudooption1" entry in the data table
    When I select "sudooption1" entry with no link in the data table
    And I click on "Delete" button
    And the "sudooption1" element should be in the dialog table with id "remove-sudo-rules-table"
    When in the modal dialog I click on "Delete" button
    And I should see "success" alert with text "Sudo option(s) removed"
    Then I close the alert
    And I should not see "sudooption1" entry in the data table

  # - Sudo rule
  Scenario: Delete the rule
    Given I click on the breadcrump link "Sudo rules"
    Given I should see partial "sudoRule1" entry in the data table
    When I select entry "sudoRule1" in the data table
    * I click on "Delete" button
    When I see "Remove sudo rule" modal
    * I should see "sudoRule1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo rules removed"
    Then I close the alert
    Then I should not see "sudoRule1" entry in the data table



