Feature: Permissions manipulation
  Create, search, and delete permissions

  @test
  Scenario: Add a new permission
    Given I am logged in as admin
    And I am on "permissions" page

    When I click on the "permissions-button-add" button
    Then I should see "add-permission-modal" modal

    When I type in the "modal-textbox-permission-name" textbox text "a_permission1"
    Then I should see "a_permission1" in the "modal-textbox-permission-name" textbox

    When I click on the "modal-checkbox-right-read" checkbox
    Then I should see the "modal-checkbox-right-read" checkbox is checked

    When I select "user" option in the "modal-select-type-select" selector
    Then I should see "User" option in the "modal-select-type-select" selector

    When I click on the "modal-button-add" button
    Then I should not see "add-permission-modal" modal
    And I should see "add-permission-success" alert

    When I search for "a_permission1" in the data table
    Then I should see "a_permission1" entry in the data table
    And I should see "a_permission1" entry in the data table with attribute "ipapermright" set to "read"

  @cleanup
  Scenario: Cleanup: Delete permission
    Given I delete permission "a_permission1"

  @seed
  Scenario: Seed: Create permission used in tests
    Given permission "a_permission2" exists

  @test
  Scenario: Search for a permission
    Given I am logged in as admin
    And I am on "permissions" page

    When I search for "a_permission2" in the data table
    Then I should see "a_permission2" entry in the data table
    And I should not see "a_permission1" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete seeded permission
    Given I delete permission "a_permission2"

  @seed
  Scenario: Seed: Create permission for delete test
    Given permission "a_permission1" exists

  @test
  Scenario: Delete a permission
    Given I am logged in as admin
    And I am on "permissions" page

    When I search for "a_permission1" in the data table
    Then I should see "a_permission1" entry in the data table
    When I select entry "a_permission1" in the data table
    Then I should see "a_permission1" entry selected in the data table

    When I click on the "permissions-button-delete" button
    Then I should see "delete-permissions-modal" modal
    And I should see "a_permission1" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-permissions-success" alert
    And I should not see "delete-permissions-modal" modal
    And I should not see "a_permission1" entry in the data table

  @seed
  Scenario: Seed: Create permissions for bulk delete test
    Given permission "a_permission2" exists
    And permission "a_permission3" exists

  @test
  Scenario: Delete many permissions
    Given I am logged in as admin
    And I am on "permissions" page

    When I search for "a_permission2" in the data table
    Then I should see "a_permission2" entry in the data table
    When I select entry "a_permission2" in the data table
    Then I should see "a_permission2" entry selected in the data table

    When I search for "a_permission3" in the data table
    Then I should see "a_permission3" entry in the data table
    When I select entry "a_permission3" in the data table
    Then I should see "a_permission3" entry selected in the data table

    When I click on the "permissions-button-delete" button
    Then I should see "delete-permissions-modal" modal
    And I should see "a_permission2" entry in the data table
    And I should see "a_permission3" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-permissions-success" alert
    And I should not see "delete-permissions-modal" modal
    And I should not see "a_permission2" entry in the data table
    And I should not see "a_permission3" entry in the data table

  @test
  Scenario: Delete button is disabled with no selection
    Given I am logged in as admin
    And I am on "permissions" page

    Then I should see the "permissions-button-delete" button is disabled

  @test
  Scenario: Add a permission with multiple granted rights
    Given I am logged in as admin
    And I am on "permissions" page

    When I click on the "permissions-button-add" button
    Then I should see "add-permission-modal" modal

    When I type in the "modal-textbox-permission-name" textbox text "a_permission_multi_rights"
    Then I should see "a_permission_multi_rights" in the "modal-textbox-permission-name" textbox

    When I click on the "modal-checkbox-right-read" checkbox
    Then I should see the "modal-checkbox-right-read" checkbox is checked

    When I click on the "modal-checkbox-right-write" checkbox
    Then I should see the "modal-checkbox-right-write" checkbox is checked

    When I select "user" option in the "modal-select-type-select" selector
    Then I should see "User" option in the "modal-select-type-select" selector

    When I click on the "modal-button-add" button
    Then I should not see "add-permission-modal" modal
    And I should see "add-permission-success" alert

    When I search for "a_permission_multi_rights" in the data table
    Then I should see "a_permission_multi_rights" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete multi-rights permission
    Given I delete permission "a_permission_multi_rights"
