Feature: Privileges manipulation
  Create and delete privileges

  @test
  Scenario: Add a new privilege
    Given I am logged in as admin
    And I am on "privileges" page

    When I click on the "privileges-button-add" button
    Then I should see "add-privilege-modal" modal

    When I type in the "modal-textbox-privilege-name" textbox text "a_privilege1"
    Then I should see "a_privilege1" in the "modal-textbox-privilege-name" textbox

    When I type in the "modal-textbox-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-privilege-modal" modal
    And I should see "add-privilege-success" alert

    When I search for "a_privilege1" in the data table
    Then I should see "a_privilege1" entry in the data table
    And I should see "a_privilege1" entry in the data table with attribute "description" set to "my description"

  @cleanup
  Scenario: Cleanup: Delete a privilege
    Given I delete privilege "a_privilege1"

  @seed
  Scenario: Seed: Create privileges used in tests
    Given privilege "a_privilege2" exists

  @test
  Scenario: Search for a privilege
    Given I am logged in as admin
    And I am on "privileges" page

    When I search for "a_privilege2" in the data table
    Then I should see "a_privilege2" entry in the data table
    And I should not see "a_privilege1" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete seeded privileges
    Given I delete privilege "a_privilege2"

  @seed
  Scenario: Seed: Create privileges used in tests
    Given privilege "a_privilege1" exists

  @test
  Scenario: Delete a privilege
    Given I am logged in as admin
    And I am on "privileges" page

    When I search for "a_privilege1" in the data table
    Then I should see "a_privilege1" entry in the data table
    When I select entry "a_privilege1" in the data table
    Then I should see "a_privilege1" entry selected in the data table

    When I click on the "privileges-button-delete" button
    Then I should see "delete-privileges-modal" modal
    And I should see "a_privilege1" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-privileges-success" alert
    And I should not see "delete-privileges-modal" modal
    And I should not see "a_privilege1" entry in the data table

  @seed
  Scenario: Seed: Create privileges used in tests
    Given privilege "a_privilege2" exists
    And privilege "a_privilege3" exists

  @test
  Scenario: Delete many privileges
    Given I am logged in as admin
    And I am on "privileges" page

    When I search for "a_privilege2" in the data table
    Then I should see "a_privilege2" entry in the data table
    When I select entry "a_privilege2" in the data table
    Then I should see "a_privilege2" entry selected in the data table

    When I search for "a_privilege3" in the data table
    Then I should see "a_privilege3" entry in the data table
    When I select entry "a_privilege3" in the data table
    Then I should see "a_privilege3" entry selected in the data table

    When I click on the "privileges-button-delete" button
    Then I should see "delete-privileges-modal" modal
    And I should see "a_privilege2" entry in the data table
    And I should see "a_privilege3" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-privileges-success" alert
    And I should not see "delete-privileges-modal" modal
    And I should not see "a_privilege2" entry in the data table
    And I should not see "a_privilege3" entry in the data table

  @test
  Scenario: Cancel creation of a privilege
    Given I am logged in as admin
    And I am on "privileges" page

    When I click on the "privileges-button-add" button
    Then I should see "add-privilege-modal" modal

    When I type in the "modal-textbox-privilege-name" textbox text "a_privilege_cancel"
    Then I should see "a_privilege_cancel" in the "modal-textbox-privilege-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-privilege-modal" modal
    And I should not see "a_privilege_cancel" entry in the data table
