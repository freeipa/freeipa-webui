Feature: Sudo command group members
  Manage sudo command members in a Sudo command group

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_members" exists
    And sudo command "/usr/bin/ls" exists

  @test
  Scenario: Add a sudo command member to the group
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_members/member_sudocmd" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I search for "/usr/bin/ls" in the dual list
    Then I should see "item-/usr/bin/ls" dual list item

    When I click on "item-/usr/bin/ls" dual list item
    Then I should see "item-/usr/bin/ls" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-/usr/bin/ls" dual list item on the right
    And I should see "item-/usr/bin/ls" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "/usr/bin/ls" in the members table
    Then I should see "/usr/bin/ls" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/ls" from sudo command group "cmdgroup_members"
    And I delete sudo command "/usr/bin/ls"
    And I delete sudo command group "cmdgroup_members"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_addmulti" exists
    And sudo command "/usr/bin/cat" exists
    And sudo command "/usr/bin/head" exists

  @test
  Scenario: Add multiple sudo command members at once
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_addmulti/member_sudocmd" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-/usr/bin/cat" dual list item
    Then I should see "item-/usr/bin/cat" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-/usr/bin/cat" dual list item on the right

    When I click on "item-/usr/bin/head" dual list item
    Then I should see "item-/usr/bin/head" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-/usr/bin/head" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "/usr/bin/cat" in the members table
    Then I should see "/usr/bin/cat" entry in the data table

    When I search for "/usr/bin/head" in the members table
    Then I should see "/usr/bin/head" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/cat" from sudo command group "cmdgroup_addmulti"
    And I remove sudo command "/usr/bin/head" from sudo command group "cmdgroup_addmulti"
    And I delete sudo command "/usr/bin/cat"
    And I delete sudo command "/usr/bin/head"
    And I delete sudo command group "cmdgroup_addmulti"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_mremove" exists
    And sudo command "/usr/bin/rm" exists
    And I add sudo command "/usr/bin/rm" to sudo command group "cmdgroup_mremove"

  @test
  Scenario: Remove a sudo command member from the group
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_mremove/member_sudocmd" page

    Then I should see "/usr/bin/rm" entry in the data table

    When I select entry "/usr/bin/rm" in the members table
    Then I should see "/usr/bin/rm" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-members-success" alert

    When I search for "/usr/bin/rm" in the members table
    Then I should not see "/usr/bin/rm" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command "/usr/bin/rm"
    And I delete sudo command group "cmdgroup_mremove"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_mdelbtn" exists

  @test
  Scenario: Delete button is disabled when no member is selected
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_mdelbtn/member_sudocmd" page

    Then I should see the "member-of-button-delete" button is disabled

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_mdelbtn"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_bulkremove" exists
    And sudo command "/usr/bin/sort" exists
    And sudo command "/usr/bin/uniq" exists
    And sudo command "/usr/bin/cut" exists
    And I add sudo command "/usr/bin/sort" to sudo command group "cmdgroup_bulkremove"
    And I add sudo command "/usr/bin/uniq" to sudo command group "cmdgroup_bulkremove"
    And I add sudo command "/usr/bin/cut" to sudo command group "cmdgroup_bulkremove"

  @test
  Scenario: Remove multiple sudo command members at once
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_bulkremove/member_sudocmd" page

    When I select entry "/usr/bin/sort" in the members table
    Then I should see "/usr/bin/sort" entry selected in the data table
    When I select entry "/usr/bin/uniq" in the members table
    Then I should see "/usr/bin/uniq" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-members-success" alert

    When I search for "/usr/bin/sort" in the members table
    Then I should not see "/usr/bin/sort" entry in the data table

    When I search for "/usr/bin/uniq" in the members table
    Then I should not see "/usr/bin/uniq" entry in the data table

    When I search for "/usr/bin/cut" in the members table
    Then I should see "/usr/bin/cut" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/cut" from sudo command group "cmdgroup_bulkremove"
    And I delete sudo command "/usr/bin/sort"
    And I delete sudo command "/usr/bin/uniq"
    And I delete sudo command "/usr/bin/cut"
    And I delete sudo command group "cmdgroup_bulkremove"
