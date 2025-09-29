Feature: User group manipulation
  Create, and delete user groups

  @test
  Scenario: Add a new POSIX group
    Given I am logged in as admin
    And I am on "user-groups" page

    When I click on the "user-groups-button-add" button
    Then I should see "add-user-group-modal" modal

    When I type in the "modal-textbox-group-name" textbox text "a_posix_group"
    Then I should see "a_posix_group" in the "modal-textbox-group-name" textbox

    When I type in the "modal-textbox-group-gid" textbox text "77777"
    Then I should see "77777" in the "modal-textbox-group-gid" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-user-group-modal" modal
    And I should see "add-group-success" alert

    When I search for "a_posix_group" in the data table
    Then I should see "a_posix_group" entry in the data table with attribute "GID" set to "77777"

  @cleanup
  Scenario: Delete a group
    Given I delete user group "a_posix_group"

  @test
  Scenario: Add a new non-POSIX group
    Given I am logged in as admin
    And I am on "user-groups" page

    When I click on the "user-groups-button-add" button
    Then I should see "add-user-group-modal" modal

    When I type in the "modal-textbox-group-name" textbox text "a_non_posix_group"
    Then I should see "a_non_posix_group" in the "modal-textbox-group-name" textbox

    When I select "non-posix" option in the "modal-group-type-select" selector
    Then I should see "non-posix" option in the "modal-group-type-select" selector

    When I click on the "modal-button-add" button
    Then I should not see "add-user-group-modal" modal
    And I should see "add-group-success" alert

    When I search for "a_non_posix_group" in the data table
    Then I should see "a_non_posix_group" entry in the data table

  @cleanup
  Scenario: Delete a group
    Given I delete user group "a_non_posix_group"

  @test
  Scenario: Add a new external group
    Given I am logged in as admin
    And I am on "user-groups" page

    When I click on the "user-groups-button-add" button
    Then I should see "add-user-group-modal" modal

    When I type in the "modal-textbox-group-name" textbox text "a_external_group"
    Then I should see "a_external_group" in the "modal-textbox-group-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-user-group-modal" modal
    And I should see "add-group-success" alert

    When I search for "a_external_group" in the data table
    Then I should see "a_external_group" entry in the data table

  @cleanup
  Scenario: Delete a group
    Given I delete user group "a_external_group"

  @seed
  Scenario: Create a group
    Given user group "a_posix_group" exists

  @test
  Scenario: Delete a group
    Given I am logged in as admin
    And I am on "user-groups" page

    When I search for "a_posix_group" in the data table
    Then I should see "a_posix_group" entry in the data table

    When I select entry "a_posix_group" in the data table
    Then I should see "a_posix_group" entry selected in the data table

    When I click on the "user-groups-button-delete" button
    Then I should see "delete-user-groups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-user-groups-modal" modal
    And I should see "remove-user-groups-success" alert

    When I search for "a_posix_group" in the data table
    Then I should not see "a_posix_group" entry in the data table

  @seed
  Scenario: Create groups
    Given user group "group1" exists
    And user group "group2" exists

  @test
  Scenario: Delete many groups
    Given I am logged in as admin
    And I am on "user-groups" page

    When I search for "group1" in the data table
    Then I should see "group1" entry in the data table
    When I select entry "group1" in the data table
    Then I should see "group1" entry selected in the data table

    When I search for "group2" in the data table
    Then I should see "group2" entry in the data table
    When I select entry "group2" in the data table
    Then I should see "group2" entry selected in the data table

    When I click on the "user-groups-button-delete" button
    Then I should see "delete-user-groups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-user-groups-modal" modal
    And I should see "remove-user-groups-success" alert

    When I search for "group1" in the data table
    Then I should not see "group1" entry in the data table

    When I search for "group2" in the data table
    Then I should not see "group2" entry in the data table

  @test
  Scenario: Cancel creation of a group
    Given I am logged in as admin
    And I am on "user-groups" page

    When I search for "cancelgroup" in the data table
    Then I should not see "cancelgroup" entry in the data table

    When I click on the "user-groups-button-add" button
    Then I should see "add-user-group-modal" modal

    When I type in the "modal-textbox-group-name" textbox text "cancelgroup"
    Then I should see "cancelgroup" in the "modal-textbox-group-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-user-group-modal" modal

    When I search for "cancelgroup" in the data table
    Then I should not see "cancelgroup" entry in the data table
