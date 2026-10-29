Feature: Sudo command groups handling
  Create, search, and delete Sudo command groups

  @test
  Scenario: Add a new sudo command group with description
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal

    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup1"
    Then I should see "cmdgroup1" in the "modal-textbox-cmd-grp-name" textbox

    When I type in the "modal-textbox-cmd-grp-desc" textbox text "my test group"
    Then I should see "my test group" in the "modal-textbox-cmd-grp-desc" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-group-modal" modal
    And I should see "add-sudo-cmd-grp-success" alert

    When I search for "cmdgroup1" in the data table
    Then I should see "cmdgroup1" entry in the data table
    And I should see "cmdgroup1" entry in the data table with attribute "Description" set to "my test group"

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup1"

  @test
  Scenario: Add a sudo command group without description
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal

    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup_nodesc"
    Then I should see "cmdgroup_nodesc" in the "modal-textbox-cmd-grp-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-group-modal" modal
    And I should see "add-sudo-cmd-grp-success" alert

    When I search for "cmdgroup_nodesc" in the data table
    Then I should see "cmdgroup_nodesc" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_nodesc"

  @test
  Scenario: Add several sudo command groups consecutively
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal
    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup_multi1"
    Then I should see "cmdgroup_multi1" in the "modal-textbox-cmd-grp-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-group-modal" modal
    And I should see "add-sudo-cmd-grp-success" alert

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal
    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup_multi2"
    Then I should see "cmdgroup_multi2" in the "modal-textbox-cmd-grp-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-group-modal" modal
    And I should see "add-sudo-cmd-grp-success" alert

    When I search for "cmdgroup_multi1" in the data table
    Then I should see "cmdgroup_multi1" entry in the data table
    When I search for "cmdgroup_multi2" in the data table
    Then I should see "cmdgroup_multi2" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_multi1"
    And I delete sudo command group "cmdgroup_multi2"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_search1" exists
    And sudo command group "cmdgroup_search2" exists

  @test
  Scenario: Search for a sudo command group
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I search for "cmdgroup_search1" in the data table
    Then I should see "cmdgroup_search1" entry in the data table
    And I should not see "cmdgroup_search2" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_search1"
    And I delete sudo command group "cmdgroup_search2"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_del1" exists

  @test
  Scenario: Delete a single sudo command group
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I search for "cmdgroup_del1" in the data table
    Then I should see "cmdgroup_del1" entry in the data table

    When I select entry "cmdgroup_del1" in the data table
    Then I should see "cmdgroup_del1" entry selected in the data table

    When I click on the "sudo-command-groups-button-delete" button
    Then I should see "delete-sudo-command-groups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sudo-command-groups-modal" modal
    And I should see "remove-sudo-command-groups-success" alert

    When I search for "cmdgroup_del1" in the data table
    Then I should not see "cmdgroup_del1" entry in the data table

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_bulk1" exists
    And sudo command group "cmdgroup_bulk2" exists
    And sudo command group "cmdgroup_bulk3" exists

  @test
  Scenario: Delete many sudo command groups
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I search for "cmdgroup_bulk1" in the data table
    Then I should see "cmdgroup_bulk1" entry in the data table
    When I select entry "cmdgroup_bulk1" in the data table
    Then I should see "cmdgroup_bulk1" entry selected in the data table

    When I search for "cmdgroup_bulk2" in the data table
    Then I should see "cmdgroup_bulk2" entry in the data table
    When I select entry "cmdgroup_bulk2" in the data table
    Then I should see "cmdgroup_bulk2" entry selected in the data table

    When I search for "cmdgroup_bulk3" in the data table
    Then I should see "cmdgroup_bulk3" entry in the data table
    When I select entry "cmdgroup_bulk3" in the data table
    Then I should see "cmdgroup_bulk3" entry selected in the data table

    When I click on the "sudo-command-groups-button-delete" button
    Then I should see "delete-sudo-command-groups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sudo-command-groups-modal" modal
    And I should see "remove-sudo-command-groups-success" alert

    When I search for "cmdgroup_bulk1" in the data table
    Then I should not see "cmdgroup_bulk1" entry in the data table
    When I search for "cmdgroup_bulk2" in the data table
    Then I should not see "cmdgroup_bulk2" entry in the data table
    When I search for "cmdgroup_bulk3" in the data table
    Then I should not see "cmdgroup_bulk3" entry in the data table

  @test
  Scenario: Modal fields are cleared after successful add
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal

    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup_fieldreset"
    Then I should see "cmdgroup_fieldreset" in the "modal-textbox-cmd-grp-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-group-modal" modal
    And I should see "add-sudo-cmd-grp-success" alert

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal
    And I should see the "modal-textbox-cmd-grp-name" textbox is empty
    And I should see the "modal-textbox-cmd-grp-desc" textbox is empty

    When I click on the "modal-button-cancel" button
    Then I should not see "add-sudo-cmd-group-modal" modal

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_fieldreset"

  @test
  Scenario: Cancel creation of a sudo command group
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal

    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup_cancel"
    Then I should see "cmdgroup_cancel" in the "modal-textbox-cmd-grp-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-sudo-cmd-group-modal" modal

    When I search for "cmdgroup_cancel" in the data table
    Then I should not see "cmdgroup_cancel" entry in the data table

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_canceldelete" exists

  @test
  Scenario: Cancel deletion of a sudo command group
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I select entry "cmdgroup_canceldelete" in the data table
    Then I should see "cmdgroup_canceldelete" entry selected in the data table

    When I click on the "sudo-command-groups-button-delete" button
    Then I should see "delete-sudo-command-groups-modal" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "delete-sudo-command-groups-modal" modal

    When I search for "cmdgroup_canceldelete" in the data table
    Then I should see "cmdgroup_canceldelete" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_canceldelete"

  @test
  Scenario: Add button in modal is disabled when name is empty
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal
    And I should see the "modal-button-add" button is disabled

    When I click on the "modal-button-cancel" button
    Then I should not see "add-sudo-cmd-group-modal" modal

  @test
  Scenario: Delete button is disabled when no entry is selected
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    Then I should see the "sudo-command-groups-button-delete" button is disabled

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_dup" exists

  @test
  Scenario: Try to add a duplicate sudo command group
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal

    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup_dup"
    Then I should see "cmdgroup_dup" in the "modal-textbox-cmd-grp-name" textbox

    When I click on the "modal-button-add" button
    Then I should see "add-sudo-cmd-group-modal-error" modal

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_dup"

  @test
  Scenario: Search for a non-existent sudo command group
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I search for "this_group_does_not_exist" in the data table
    Then I should not see "this_group_does_not_exist" entry in the data table

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_refresh_list" exists

  @test
  Scenario: Refresh button on list page reloads data
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I search for "cmdgroup_refresh_list" in the data table
    Then I should see "cmdgroup_refresh_list" entry in the data table

    When I click on the "sudo-command-groups-button-refresh" button
    Then I should see "cmdgroup_refresh_list" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_refresh_list"

  @test
  Scenario: Add a sudo command group with special characters in the name
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal

    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup_special-chars.test"
    Then I should see "cmdgroup_special-chars.test" in the "modal-textbox-cmd-grp-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-group-modal" modal
    And I should see "add-sudo-cmd-grp-success" alert

    When I search for "cmdgroup_special-chars.test" in the data table
    Then I should see "cmdgroup_special-chars.test" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_special-chars.test"

  @test
  Scenario: Add a sudo command group with underscores and numbers
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I click on the "sudo-command-groups-button-add" button
    Then I should see "add-sudo-cmd-group-modal" modal

    When I type in the "modal-textbox-cmd-grp-name" textbox text "cmdgroup_99_test_01"
    Then I should see "cmdgroup_99_test_01" in the "modal-textbox-cmd-grp-name" textbox

    When I type in the "modal-textbox-cmd-grp-desc" textbox text "group with numbers"
    Then I should see "group with numbers" in the "modal-textbox-cmd-grp-desc" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-group-modal" modal
    And I should see "add-sudo-cmd-grp-success" alert

    When I search for "cmdgroup_99_test_01" in the data table
    Then I should see "cmdgroup_99_test_01" entry in the data table
    And I should see "cmdgroup_99_test_01" entry in the data table with attribute "Description" set to "group with numbers"

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_99_test_01"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_del_with_members" exists
    And sudo command "/usr/bin/tar" exists
    And I add sudo command "/usr/bin/tar" to sudo command group "cmdgroup_del_with_members"

  @test
  Scenario: Delete a sudo command group that has members
    Given I am logged in as admin
    And I am on "sudo-command-groups" page

    When I search for "cmdgroup_del_with_members" in the data table
    Then I should see "cmdgroup_del_with_members" entry in the data table

    When I select entry "cmdgroup_del_with_members" in the data table
    Then I should see "cmdgroup_del_with_members" entry selected in the data table

    When I click on the "sudo-command-groups-button-delete" button
    Then I should see "delete-sudo-command-groups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sudo-command-groups-modal" modal
    And I should see "remove-sudo-command-groups-success" alert

    When I search for "cmdgroup_del_with_members" in the data table
    Then I should not see "cmdgroup_del_with_members" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command "/usr/bin/tar"

