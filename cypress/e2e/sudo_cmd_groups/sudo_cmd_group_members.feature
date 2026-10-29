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
    Given sudo command group "cmdgroup_msearch" exists
    And sudo command "/usr/bin/grep" exists
    And sudo command "/usr/bin/sed" exists
    And I add sudo command "/usr/bin/grep" to sudo command group "cmdgroup_msearch"
    And I add sudo command "/usr/bin/sed" to sudo command group "cmdgroup_msearch"

  @test
  Scenario: Search within sudo command group members
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_msearch/member_sudocmd" page

    When I search for "/usr/bin/grep" in the members table
    Then I should see "/usr/bin/grep" entry in the data table
    And I should not see "/usr/bin/sed" entry in the data table

    When I search for "notthere" in the members table
    Then I should not see "notthere" entry in the data table
    And I should not see "/usr/bin/grep" entry in the data table
    And I should not see "/usr/bin/sed" entry in the data table

    When I clear the search in the members table
    Then I should see "/usr/bin/grep" entry in the data table
    And I should see "/usr/bin/sed" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/grep" from sudo command group "cmdgroup_msearch"
    And I remove sudo command "/usr/bin/sed" from sudo command group "cmdgroup_msearch"
    And I delete sudo command "/usr/bin/grep"
    And I delete sudo command "/usr/bin/sed"
    And I delete sudo command group "cmdgroup_msearch"

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
    Given sudo command group "cmdgroup_mcanceladd" exists
    And sudo command "/usr/bin/mv" exists

  @test
  Scenario: Cancel adding a sudo command member
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_mcanceladd/member_sudocmd" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-add-modal" modal

    When I search for "/usr/bin/mv" in the members table
    Then I should not see "/usr/bin/mv" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command "/usr/bin/mv"
    And I delete sudo command group "cmdgroup_mcanceladd"

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_mcancelrem" exists
    And sudo command "/usr/bin/cp" exists
    And I add sudo command "/usr/bin/cp" to sudo command group "cmdgroup_mcancelrem"

  @test
  Scenario: Cancel removal of a sudo command member
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_mcancelrem/member_sudocmd" page

    Then I should see "/usr/bin/cp" entry in the data table

    When I select entry "/usr/bin/cp" in the members table
    Then I should see "/usr/bin/cp" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "/usr/bin/cp" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/cp" from sudo command group "cmdgroup_mcancelrem"
    And I delete sudo command "/usr/bin/cp"
    And I delete sudo command group "cmdgroup_mcancelrem"

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
    Given sudo command group "cmdgroup_alreadymember" exists
    And sudo command "/usr/bin/wc" exists
    And I add sudo command "/usr/bin/wc" to sudo command group "cmdgroup_alreadymember"

  @test
  Scenario: Already added member does not appear in the add modal dual list
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_alreadymember/member_sudocmd" page

    Then I should see "/usr/bin/wc" entry in the data table

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I search for "/usr/bin/wc" in the dual list
    Then I should not see "item-/usr/bin/wc" dual list item

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-add-modal" modal

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/wc" from sudo command group "cmdgroup_alreadymember"
    And I delete sudo command "/usr/bin/wc"
    And I delete sudo command group "cmdgroup_alreadymember"

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

  @seed
  Scenario: Create seed data
    Given sudo command group "cmdgroup_emptymembers" exists

  @test
  Scenario: Empty members page shows no entries and delete button is disabled
    Given I am logged in as admin
    And I am on "sudo-command-groups/cmdgroup_emptymembers/member_sudocmd" page

    Then I should see the "member-of-button-delete" button is disabled

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-add-modal" modal

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command group "cmdgroup_emptymembers"
