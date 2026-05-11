Feature: Sudo commands manipulation
  Create and delete Sudo commands

  @test
  Scenario: Add a new sudo command
    Given I am logged in as admin
    And I am on "sudo-commands" page

    When I click on the "sudo-commands-button-add" button
    Then I should see "add-sudo-cmd-modal" modal

    When I type in the "modal-textbox-command" textbox text "ls"
    Then I should see "ls" in the "modal-textbox-command" textbox
    And I type in the "modal-textbox-description" textbox text "my description"

    When I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-modal" modal
    And I should see "add-sudo-cmd-success" alert

    When I search for "ls" in the data table
    Then I should see "ls" entry in the data table
    And I should see "ls" entry in the data table with attribute "Description" set to "my description"

  @cleanup
  Scenario: Cleanup: Delete sudo command
    Given I delete sudo command "ls"

  @test
  Scenario: Add several commands
    Given I am logged in as admin
    And I am on "sudo-commands" page

    When I click on the "sudo-commands-button-add" button
    Then I should see "add-sudo-cmd-modal" modal

    When I type in the "modal-textbox-command" textbox text "cp"
    And I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-modal" modal
    And I should see "add-sudo-cmd-success" alert

    When I click on the "sudo-commands-button-add" button
    Then I should see "add-sudo-cmd-modal" modal

    When I type in the "modal-textbox-command" textbox text "rm"
    And I click on the "modal-button-add" button
    Then I should not see "add-sudo-cmd-modal" modal
    And I should see "add-sudo-cmd-success" alert

    When I search for "cp" in the data table
    Then I should see "cp" entry in the data table
    When I search for "rm" in the data table
    Then I should see "rm" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete multiple sudo commands
    Given I delete sudo command "cp"
    And I delete sudo command "rm"

  @seed
  Scenario: Seed: Create sudo command for delete
    Given sudo command "ls" exists

  @test
  Scenario: Delete a command
    Given I am logged in as admin
    And I am on "sudo-commands" page

    When I select entry "ls" in the data table
    Then I should see "ls" entry selected in the data table

    When I click on the "sudo-commands-button-delete" button
    Then I should see "delete-sudo-commands-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sudo-commands-modal" modal
    And I should see "remove-sudo-commands-success" alert

    When I search for "ls" in the data table
    Then I should not see "ls" entry in the data table

  @seed
  Scenario: Seed: Create sudo commands for bulk delete
    Given sudo command "cp" exists
    And sudo command "rm" exists

  @test
  Scenario: Delete many commands
    Given I am logged in as admin
    And I am on "sudo-commands" page

    When I select entry "cp" in the data table
    Then I should see "cp" entry selected in the data table

    When I select entry "rm" in the data table
    Then I should see "rm" entry selected in the data table

    When I click on the "sudo-commands-button-delete" button
    Then I should see "delete-sudo-commands-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sudo-commands-modal" modal
    And I should see "remove-sudo-commands-success" alert

    When I search for "cp" in the data table
    Then I should not see "cp" entry in the data table
    When I search for "rm" in the data table
    Then I should not see "rm" entry in the data table

  @test
  Scenario: Cancel creation of a command
    Given I am logged in as admin
    And I am on "sudo-commands" page

    When I click on the "sudo-commands-button-add" button
    Then I should see "add-sudo-cmd-modal" modal

    When I type in the "modal-textbox-command" textbox text "cmd-cancel"
    And I click on the "modal-button-cancel" button
    Then I should not see "add-sudo-cmd-modal" modal

    When I search for "cmd-cancel" in the data table
    Then I should not see "cmd-cancel" entry in the data table
