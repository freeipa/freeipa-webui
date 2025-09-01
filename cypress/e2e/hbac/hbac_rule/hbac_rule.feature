Feature: HBAC rules manipulation
  Create, and delete HBAC rules

  @test
  Scenario: Add a new rule
    Given I am logged in as admin
    And I am on "hbac-rules" page

    When I click on the "hbac-rules-button-add" button
    Then I should see "add-hbac-rule-modal" modal

    When I type in the "modal-textbox-rule-name" textbox text "rule1"
    Then I should see "rule1" in the "modal-textbox-rule-name" textbox

    When I type in the "modal-textbox-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-hbac-rule-modal" modal
    And I should see "add-hbacrule-success" alert

    When I search for "rule1" in the data table
    Then I should see "rule1" entry in the data table
    And I should see "rule1" entry in the data table with attribute "Description" set to "my description"

  @cleanup
    Scenario: Delete a rule
    Given I delete rule "rule1"

  @test
  Scenario: Add several rules
    Given I am logged in as admin
    And I am on "hbac-rules" page

    When I click on the "hbac-rules-button-add" button
    Then I should see "add-hbac-rule-modal" modal

    When I type in the "modal-textbox-rule-name" textbox text "rule2"
    Then I should see "rule2" in the "modal-textbox-rule-name" textbox

    When I click on the "modal-button-add-and-add-another" button
    Then I should see "add-hbac-rule-modal" modal
    And I should see "add-hbacrule-success" alert

    When I type in the "modal-textbox-rule-name" textbox text "rule3"
    Then I should see "rule3" in the "modal-textbox-rule-name" textbox

    When I click on the "modal-button-add-and-add-another" button
    Then I should see "add-hbac-rule-modal" modal
    And I should see "add-hbacrule-success" alert

    When I type in the "modal-textbox-rule-name" textbox text "rule4"
    Then I should see "rule4" in the "modal-textbox-rule-name" textbox

    When I click on the "modal-button-add-and-add-another" button
    Then I should see "add-hbac-rule-modal" modal
    And I should see "add-hbacrule-success" alert

    When I click on the "modal-button-cancel" button
    Then I should not see "add-hbac-rule-modal" modal

    When I search for "rule2" in the data table
    Then I should see "rule2" entry in the data table
    When I search for "rule3" in the data table
    Then I should see "rule3" entry in the data table
    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table

  @cleanup
  Scenario: Delete a rule
    Given I delete rule "rule2"
    And I delete rule "rule3"
    And I delete rule "rule4"

  @seed
  Scenario: Create rules
    Given rule "rule1" exists

  @test
  Scenario: Search for a rule
    Given I am logged in as admin
    And I am on "hbac-rules" page

    When I search for "rule1" in the data table
    Then I should see "rule1" entry in the data table
    And I should not see "rule2" entry in the data table
  
  @cleanup
  Scenario: Delete a rule
    Given I delete rule "rule1"

  @seed 
  Scenario: Create a rule
    Given rule "rule4" exists

  @test
    Scenario: Disable a rule
    Given I am logged in as admin
    And I am on "hbac-rules" page

    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table
    When I select entry "rule4" in the data table
    Then I should see the "hbac-rules-button-disable" button is enabled
    Then I should see the "hbac-rules-button-enable" button is disabled

    When I click on the "hbac-rules-button-disable" button
    Then I should see "disable-hbac-rules-modal" modal

    When I click on the "modal-button-disable" button
    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table
    Then I should see "rule4" entry in the data table with attribute "Status" set to "Disabled"

  Scenario: Re-enable a rule
    Given I am logged in as admin
    And I am on "hbac-rules" page

    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table
    When I select entry "rule4" in the data table
    Then I should see the "hbac-rules-button-enable" button is enabled
    Then I should see the "hbac-rules-button-disable" button is disabled

    When I click on the "hbac-rules-button-enable" button
    Then I should see "enable-hbac-rules-modal" modal

    When I click on the "modal-button-enable" button
    When I search for "rule4" in the data table
    Then I should see "rule4" entry in the data table
    Then I should see "rule4" entry in the data table with attribute "Status" set to "Enabled"

  @cleanup
  Scenario: Delete a rule
    Given I delete rule "rule4"

  @seed 
  Scenario: Create a rule
    Given rule "rule1" exists

  @test
  Scenario: Delete a rule
    Given I am logged in as admin
    And I am on "hbac-rules" page

    When I search for "rule1" in the data table
    Then I should see "rule1" entry in the data table  
    When I select entry "rule1" in the data table
    Then I should see "rule1" entry selected in the data table
    When I click on the "hbac-rules-button-delete" button
    Then I should see "delete-hbac-rules-modal" modal
    When I click on the "modal-button-delete" button
    Then I should not see "delete-hbac-rules-modal" modal
    And I should see "remove-hbacrules-success" alert
    Then I should not see "rule1" entry in the data table

  @seed
  Scenario: Create a rule
    Given rule "rule2" exists
    Given rule "rule3" exists
    Given rule "rule4" exists

  @test
  Scenario: Delete many rules
    Given I am logged in as admin
    And I am on "hbac-rules" page

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

    When I click on the "hbac-rules-button-delete" button
    Then I should see "delete-hbac-rules-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-hbac-rules-modal" modal
    And I should see "remove-hbacrules-success" alert

    Then I should not see "rule2" entry in the data table
    Then I should not see "rule3" entry in the data table
    Then I should not see "rule4" entry in the data table

  @test
  Scenario: Cancel creation of a rule
    Given I am logged in as admin
    And I am on "hbac-rules" page

    When I click on the "hbac-rules-button-add" button
    When I type in the "modal-textbox-rule-name" textbox text "rule-cancel"
    When I click on the "modal-button-cancel" button
    Then I should not see "add-hbac-rule-modal" modal
    Then I should not see "rule-cancel" entry in the data table
