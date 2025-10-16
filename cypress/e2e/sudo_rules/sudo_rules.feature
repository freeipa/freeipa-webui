Feature: Sudo rules manipulation
  Manage creation, search, enable/disable and deletion of Sudo rules

  @test
  Scenario: Add a new rule
    Given I am logged in as admin
    And I am on "sudo-rules" page

    When I click on the "sudo-rules-button-add" button
    Then I should see "add-sudo-rule-modal" modal

    When I type in the "modal-textbox-rule-name" textbox text "rule1"
    Then I should see "rule1" in the "modal-textbox-rule-name" textbox
    And I type in the "modal-textbox-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-description" textbox
    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-rule-modal" modal
    And I should see "add-sudorule-success" alert

    When I search for "rule1" in the data table
    Then I should see "rule1" entry in the data table with attribute "Description" set to "my description"

  @cleanup
  Scenario: Delete a rule
    Given I delete sudo rule "rule1"

  @seed
  Scenario: Create rules
    Given sudo rule "rule1" exists

  @test
  Scenario: Search for a rule
    Given I am logged in as admin
    And I am on "sudo-rules" page

    When I search for "rule1" in the data table
    Then I should see "rule1" entry in the data table

  @cleanup
  Scenario: Delete a rule
    Given I delete sudo rule "rule1"

  @seed
  Scenario: Create rule
    Given sudo rule "rule4" exists

  @test
  Scenario: Disable a rule
    Given I am logged in as admin
    And I am on "sudo-rules" page

    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table

    When I select entry "rule4" in the data table
    Then I should see "rule4" entry selected in the data table
    When I click on the "sudo-rules-button-disable" button
    Then I should see "disable-enable-sudo-rules-modal" modal

    When I click on the "modal-button-disable" button
    Then I should not see "disable-enable-sudo-rules-modal" modal

    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table
    And I should see "rule4" entry in the data table with attribute "Status" set to "Disabled"

  @cleanup
  Scenario: Delete a rule
    Given I delete sudo rule "rule4"

  @seed
  Scenario: Create rule
    Given sudo rule "rule4" exists
    And I disable sudo rule "rule4"

  @test
  Scenario: Re-enable a rule
    Given I am logged in as admin
    And I am on "sudo-rules" page

    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table

    When I select entry "rule4" in the data table
    Then I should see "rule4" entry selected in the data table
    When I click on the "sudo-rules-button-enable" button
    Then I should see "disable-enable-sudo-rules-modal" modal

    When I click on the "modal-button-enable" button
    Then I should not see "disable-enable-sudo-rules-modal" modal

    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table
    And I should see "rule4" entry in the data table with attribute "Status" set to "Enabled"

  @cleanup
  Scenario: Delete a rule
    Given I delete sudo rule "rule4"

  @seed
  Scenario: Create rule
    Given sudo rule "rule1" exists

  @test
  Scenario: Delete a rule
    Given I am logged in as admin
    And I am on "sudo-rules" page

    When I search for "rule1" in the data table
    Then I should see "rule1" entry in the data table

    When I select entry "rule1" in the data table
    Then I should see "rule1" entry selected in the data table
    When I click on the "sudo-rules-button-delete" button
    Then I should see "delete-sudo-rules-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sudo-rules-modal" modal
    And I should see "remove-sudorules-success" alert

    When I search for "rule1" in the data table
    Then I should not see "rule1" entry in the data table

  @seed
  Scenario: Create rules
    Given sudo rule "rule2" exists
    And sudo rule "rule3" exists
    And sudo rule "rule4" exists

  @test
  Scenario: Delete many rules
    Given I am logged in as admin
    And I am on "sudo-rules" page

    When I search for "rule2" in the data table
    Then I should see "rule2" entry in the data table
    When I select entry "rule2" in the data table
    Then I should see "rule2" entry selected in the data table

    When I search for "rule3" in the data table
    Then I should see "rule3" entry in the data table
    When I select entry "rule3" in the data table
    Then I should see "rule3" entry selected in the data table

    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table
    When I select entry "rule4" in the data table
    Then I should see "rule4" entry selected in the data table

    When I click on the "sudo-rules-button-delete" button
    Then I should see "delete-sudo-rules-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sudo-rules-modal" modal
    And I should see "remove-sudorules-success" alert

    When I search for "rule2" in the data table
    Then I should not see "rule2" entry in the data table
    When I search for "rule3" in the data table
    Then I should not see "rule3" entry in the data table
    When I search for "rule4" in the data table
    Then I should not see "rule4" entry in the data table

  @test
  Scenario: Cancel creation of a rule
    Given I am logged in as admin
    And I am on "sudo-rules" page

    When I click on the "sudo-rules-button-add" button
    Then I should see "add-sudo-rule-modal" modal

    When I type in the "modal-textbox-rule-name" textbox text "rule-cancel"
    And I click on the "modal-button-cancel" button
    Then I should not see "add-sudo-rule-modal" modal

    When I search for "rule-cancel" in the data table
    Then I should not see "rule-cancel" entry in the data table
