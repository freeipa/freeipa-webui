Feature: Sudo rules manipulation
  Create, delete, disable/enable Sudo rules

  Background:
    Given I am logged in as "Administrator"
    Given I am on "sudo-rules" page

  Scenario Outline: Add a new rule
    Given I am on "sudo-rules" page
    When I click on "Add" button
    * I type in the field "Rule name" text "rule1"
    * I type in the field "Description" text "my description"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo rule added"
    Then I should see "rule1" entry in the data table
    * entry "rule1" should have attribute "Description" set to "my description"

  Scenario Outline: Add several rules
    When I click on "Add" button
    * I type in the field "Rule name" text "rule2"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New sudo rule added"
    * I type in the field "Rule name" text "rule3"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New sudo rule added"
    * I type in the field "Rule name" text "rule4"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo rule added"
    Then I should see "rule2" entry in the data table
    Then I should see "rule3" entry in the data table
    Then I should see "rule4" entry in the data table

  Scenario Outline: Search for a rule
    When I type "rule2" in the search field
    Then I should see the "rule2" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "rule2" in the table
    And I should not see the element "rule1" in the table
    Then I click on the X icon to clear the search field
    When I click on the arrow icon to perform search
    Then I should see the element "rule1" in the table

  Scenario: Disable a rule
    Given I should see "rule4" entry in the data table
    When I select entry "rule4" in the data table
    Then button "Disable" should be enabled
    Then button "Enable" should be disabled

    When I click on "Disable" button
    Then I see "Disable confirmation" modal

    When in the modal dialog I click on "Disable" button
    Then I should see "rule4" entry in the data table
    Then entry "rule4" should have attribute "Status" set to "Disabled"

  Scenario: Re-enable a rule
    Given I should see "rule4" entry in the data table
    When I select entry "rule4" in the data table
    Then button "Enable" should be enabled
    Then button "Disable" should be disabled

    When I click on "Enable" button
    Then I see "Enable confirmation" modal

    Then in the modal dialog I click on "Enable" button
    Then I should see "rule4" entry in the data table
    Then entry "rule4" should have attribute "Status" set to "Enabled"

  Scenario: Delete a rule
    Given I should see partial "rule1" entry in the data table
    When I select entry "rule1" in the data table
    * I click on "Delete" button
    When I see "Remove sudo rule" modal
    * I should see "rule1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo rules removed"
    Then I should not see "rule1" entry in the data table

  Scenario: Delete many rules
    Given I should see "rule2" entry in the data table
    Given I should see "rule3" entry in the data table
    Given I should see "rule4" entry in the data table
    Then I select partial entry "rule2" in the data table
    Then I select partial entry "rule3" in the data table
    Then I select partial entry "rule4" in the data table
    When I click on "Delete" button
    * I see "Remove sudo rule" modal
    * I should see partial "rule2" entry in the data table
    * I should see partial "rule3" entry in the data table
    * I should see partial "rule4" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo rules removed"
    Then I should not see "rule2" entry in the data table
    Then I should not see "rule3" entry in the data table
    Then I should not see "rule4" entry in the data table

  Scenario: Cancel creation of a rule
    When I click on "Add" button
    * I type in the field "Rule name" text "rule-cancel"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "rule-cancel" entry in the data table
