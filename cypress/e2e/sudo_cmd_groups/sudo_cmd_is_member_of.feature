Feature: Sudo command is a member of sudo command groups
  Manage Is a member of section from the Sudo commands page

  @seed
  Scenario: Create seed data
    Given sudo command "/usr/bin/top" exists
    And sudo command group "cmdgroup_ismemberof" exists

  @test
  Scenario: Add a sudo command to a sudo command group via Is member of
    Given I am logged in as admin
    And I am on "sudo-commands/%252Fusr%252Fbin%252Ftop" page

    When I click on the "sudo-cmd-is-member-of-tab" tab
    Then I should see "sudo-cmd-is-member-of-tab" tab selected

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-cmdgroup_ismemberof" dual list item
    Then I should see "item-cmdgroup_ismemberof" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-cmdgroup_ismemberof" dual list item on the right
    And I should see "item-cmdgroup_ismemberof" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "cmdgroup_ismemberof" in the members table
    Then I should see "cmdgroup_ismemberof" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/top" from sudo command group "cmdgroup_ismemberof"
    And I delete sudo command "/usr/bin/top"
    And I delete sudo command group "cmdgroup_ismemberof"

  @seed
  Scenario: Create seed data
    Given sudo command "/usr/bin/htop" exists
    And sudo command group "cmdgroup_imsearch1" exists
    And sudo command group "cmdgroup_imsearch2" exists
    And I add sudo command "/usr/bin/htop" to sudo command group "cmdgroup_imsearch1"
    And I add sudo command "/usr/bin/htop" to sudo command group "cmdgroup_imsearch2"

  @test
  Scenario: Search within Is member of sudo command groups
    Given I am logged in as admin
    And I am on "sudo-commands/%252Fusr%252Fbin%252Fhtop" page

    When I click on the "sudo-cmd-is-member-of-tab" tab
    Then I should see "sudo-cmd-is-member-of-tab" tab selected

    When I search for "cmdgroup_imsearch1" in the members table
    Then I should see "cmdgroup_imsearch1" entry in the data table
    And I should not see "cmdgroup_imsearch2" entry in the data table

    When I search for "notthere" in the members table
    Then I should not see "notthere" entry in the data table
    And I should not see "cmdgroup_imsearch1" entry in the data table

    When I clear the search in the members table
    Then I should see "cmdgroup_imsearch1" entry in the data table
    And I should see "cmdgroup_imsearch2" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/htop" from sudo command group "cmdgroup_imsearch1"
    And I remove sudo command "/usr/bin/htop" from sudo command group "cmdgroup_imsearch2"
    And I delete sudo command "/usr/bin/htop"
    And I delete sudo command group "cmdgroup_imsearch1"
    And I delete sudo command group "cmdgroup_imsearch2"

  @seed
  Scenario: Create seed data
    Given sudo command "/usr/bin/df" exists
    And sudo command group "cmdgroup_imremove" exists
    And I add sudo command "/usr/bin/df" to sudo command group "cmdgroup_imremove"

  @test
  Scenario: Remove a sudo command from a sudo command group via Is member of
    Given I am logged in as admin
    And I am on "sudo-commands/%252Fusr%252Fbin%252Fdf" page

    When I click on the "sudo-cmd-is-member-of-tab" tab
    Then I should see "sudo-cmd-is-member-of-tab" tab selected

    When I search for "cmdgroup_imremove" in the members table
    Then I should see "cmdgroup_imremove" entry in the data table

    When I select entry "cmdgroup_imremove" in the members table
    Then I should see "cmdgroup_imremove" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-sudo-cmds-success" alert

    When I search for "cmdgroup_imremove" in the members table
    Then I should not see "cmdgroup_imremove" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command "/usr/bin/df"
    And I delete sudo command group "cmdgroup_imremove"

  @seed
  Scenario: Create seed data
    Given sudo command "/usr/bin/du" exists
    And sudo command group "cmdgroup_imcanceladd" exists

  @test
  Scenario: Cancel adding a sudo command to a group via Is member of
    Given I am logged in as admin
    And I am on "sudo-commands/%252Fusr%252Fbin%252Fdu" page

    When I click on the "sudo-cmd-is-member-of-tab" tab
    Then I should see "sudo-cmd-is-member-of-tab" tab selected

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-add-modal" modal

    When I search for "cmdgroup_imcanceladd" in the members table
    Then I should not see "cmdgroup_imcanceladd" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command "/usr/bin/du"
    And I delete sudo command group "cmdgroup_imcanceladd"

  @seed
  Scenario: Create seed data
    Given sudo command "/usr/bin/whoami" exists
    And sudo command group "cmdgroup_imcancelrem" exists
    And I add sudo command "/usr/bin/whoami" to sudo command group "cmdgroup_imcancelrem"

  @test
  Scenario: Cancel removal of a sudo command from a group via Is member of
    Given I am logged in as admin
    And I am on "sudo-commands/%252Fusr%252Fbin%252Fwhoami" page

    When I click on the "sudo-cmd-is-member-of-tab" tab
    Then I should see "sudo-cmd-is-member-of-tab" tab selected

    When I search for "cmdgroup_imcancelrem" in the members table
    Then I should see "cmdgroup_imcancelrem" entry in the data table

    When I select entry "cmdgroup_imcancelrem" in the members table
    Then I should see "cmdgroup_imcancelrem" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "cmdgroup_imcancelrem" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/whoami" from sudo command group "cmdgroup_imcancelrem"
    And I delete sudo command "/usr/bin/whoami"
    And I delete sudo command group "cmdgroup_imcancelrem"

  @seed
  Scenario: Create seed data
    Given sudo command "/usr/bin/stat" exists
    And sudo command group "cmdgroup_imalready" exists
    And I add sudo command "/usr/bin/stat" to sudo command group "cmdgroup_imalready"

  @test
  Scenario: Already assigned group does not appear in the add modal dual list
    Given I am logged in as admin
    And I am on "sudo-commands/%252Fusr%252Fbin%252Fstat" page

    When I click on the "sudo-cmd-is-member-of-tab" tab
    Then I should see "sudo-cmd-is-member-of-tab" tab selected

    When I search for "cmdgroup_imalready" in the members table
    Then I should see "cmdgroup_imalready" entry in the data table

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I search for "cmdgroup_imalready" in the dual list
    Then I should not see "item-cmdgroup_imalready" dual list item

    When I click on the "modal-button-cancel" button
    Then I should not see "member-of-add-modal" modal

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/stat" from sudo command group "cmdgroup_imalready"
    And I delete sudo command "/usr/bin/stat"
    And I delete sudo command group "cmdgroup_imalready"

  @seed
  Scenario: Create seed data
    Given sudo command "/usr/bin/id" exists

  @test
  Scenario: Delete button is disabled when no group is selected in Is member of
    Given I am logged in as admin
    And I am on "sudo-commands/%252Fusr%252Fbin%252Fid" page

    When I click on the "sudo-cmd-is-member-of-tab" tab
    Then I should see "sudo-cmd-is-member-of-tab" tab selected
    And I should see the "member-of-button-delete" button is disabled

  @cleanup
  Scenario: Cleanup
    Given I delete sudo command "/usr/bin/id"

  @seed
  Scenario: Create seed data
    Given sudo command "/usr/bin/tee" exists
    And sudo command group "cmdgroup_immulti1" exists
    And sudo command group "cmdgroup_immulti2" exists

  @test
  Scenario: Add a sudo command to multiple groups via Is member of
    Given I am logged in as admin
    And I am on "sudo-commands/%252Fusr%252Fbin%252Ftee" page

    When I click on the "sudo-cmd-is-member-of-tab" tab
    Then I should see "sudo-cmd-is-member-of-tab" tab selected

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-cmdgroup_immulti1" dual list item
    Then I should see "item-cmdgroup_immulti1" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-cmdgroup_immulti1" dual list item on the right

    When I click on "item-cmdgroup_immulti2" dual list item
    Then I should see "item-cmdgroup_immulti2" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-cmdgroup_immulti2" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "cmdgroup_immulti1" in the members table
    Then I should see "cmdgroup_immulti1" entry in the data table
    When I search for "cmdgroup_immulti2" in the members table
    Then I should see "cmdgroup_immulti2" entry in the data table

  @cleanup
  Scenario: Cleanup
    Given I remove sudo command "/usr/bin/tee" from sudo command group "cmdgroup_immulti1"
    And I remove sudo command "/usr/bin/tee" from sudo command group "cmdgroup_immulti2"
    And I delete sudo command "/usr/bin/tee"
    And I delete sudo command group "cmdgroup_immulti1"
    And I delete sudo command group "cmdgroup_immulti2"
