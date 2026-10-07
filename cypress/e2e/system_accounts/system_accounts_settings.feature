Feature: System account settings manipulation
  Modify system account settings

  @seed
  Scenario: Create system account for description test
    Given system account "settings_sysaccount" exists with password "Secret123"

  @test
  Scenario: Set Description
    Given I am logged in as admin
    And I am on "system-accounts/settings_sysaccount" page

    When I type in the "sysaccount-tab-settings-textarea-description" textbox text "Test description"
    Then I should see "Test description" in the "sysaccount-tab-settings-textarea-description" textbox

    When I click on the "sysaccount-tab-settings-button-save" button
    Then I should see "save-success" alert

  @cleanup
  Scenario: Delete settings_sysaccount
    Given I delete system account "settings_sysaccount"

  @seed
  Scenario: Create system account for revert test
    Given system account "revert_sysaccount" exists with password "Secret123" and description "Original description"

  @test
  Scenario: Revert changes
    Given I am logged in as admin
    And I am on "system-accounts/revert_sysaccount" page

    Then I should see "Original description" in the "sysaccount-tab-settings-textarea-description" textbox

    When I type in the "sysaccount-tab-settings-textarea-description" textbox text "Modified description"
    Then I should see "Modified description" in the "sysaccount-tab-settings-textarea-description" textbox

    When I click on the "sysaccount-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see "Original description" in the "sysaccount-tab-settings-textarea-description" textbox

  @cleanup
  Scenario: Delete revert_sysaccount
    Given I delete system account "revert_sysaccount"

  @seed
  Scenario: Create system account for privileged checkbox test
    Given system account "priv_sysaccount" exists with password "Secret123"

  @test
  Scenario: Toggle privileged checkbox
    Given I am logged in as admin
    And I am on "system-accounts/priv_sysaccount" page

    Then I should see the "sysaccount-tab-settings-checkbox-privileged" checkbox is unchecked

    When I click on the "sysaccount-tab-settings-checkbox-privileged" checkbox
    Then I should see the "sysaccount-tab-settings-checkbox-privileged" checkbox is checked

    When I click on the "sysaccount-tab-settings-button-save" button
    Then I should see "save-success" alert

  @cleanup
  Scenario: Delete priv_sysaccount
    Given I delete system account "priv_sysaccount"

  @seed
  Scenario: Create system account for kebab reset password test
    Given system account "pwd_sysaccount" exists with password "Secret123"

  @test
  Scenario: Reset password from kebab menu
    Given I am logged in as admin
    And I am on "system-accounts/pwd_sysaccount" page

    When I click on the "sysaccount-tab-settings-kebab" kebab menu
    Then I should see "sysaccount-tab-settings-kebab" kebab menu expanded

    When I click on the "sysaccount-tab-settings-kebab-reset-password" button
    Then I should see "reset-password-sysaccount-modal" modal

    When I type in the "modal-textbox-new-password" textbox text "NewSecret456"
    Then I should see "NewSecret456" in the "modal-textbox-new-password" textbox

    When I type in the "modal-textbox-verify-password" textbox text "NewSecret456"
    Then I should see "NewSecret456" in the "modal-textbox-verify-password" textbox

    When I click on the "modal-button-reset-password" button
    Then I should not see "reset-password-sysaccount-modal" modal
    And I should see "reset-password-success" alert

  @cleanup
  Scenario: Delete pwd_sysaccount
    Given I delete system account "pwd_sysaccount"

  @seed
  Scenario: Create disabled system account for kebab enable test
    Given disabled system account "keben_sysaccount" exists with password "Secret123"

  @test
  Scenario: Enable from kebab menu
    Given I am logged in as admin
    And I am on "system-accounts/keben_sysaccount" page

    When I click on the "sysaccount-tab-settings-kebab" kebab menu
    Then I should see "sysaccount-tab-settings-kebab" kebab menu expanded

    When I click on the "sysaccount-tab-settings-kebab-enable" button
    Then I should see "system-accounts-enable-disable-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "system-accounts-enable-disable-modal" modal

  @cleanup
  Scenario: Delete keben_sysaccount
    Given I delete system account "keben_sysaccount"

  @seed
  Scenario: Create system account for kebab disable test
    Given system account "kebdis_sysaccount" exists with password "Secret123"

  @test
  Scenario: Disable from kebab menu
    Given I am logged in as admin
    And I am on "system-accounts/kebdis_sysaccount" page

    When I click on the "sysaccount-tab-settings-kebab" kebab menu
    Then I should see "sysaccount-tab-settings-kebab" kebab menu expanded

    When I click on the "sysaccount-tab-settings-kebab-disable" button
    Then I should see "system-accounts-enable-disable-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "system-accounts-enable-disable-modal" modal

  @cleanup
  Scenario: Delete kebdis_sysaccount
    Given I delete system account "kebdis_sysaccount"

  @seed
  Scenario: Create system account for kebab delete test
    Given system account "kebdel_sysaccount" exists with password "Secret123"

  @test
  Scenario: Delete from kebab menu
    Given I am logged in as admin
    And I am on "system-accounts/kebdel_sysaccount" page

    When I click on the "sysaccount-tab-settings-kebab" kebab menu
    Then I should see "sysaccount-tab-settings-kebab" kebab menu expanded

    When I click on the "sysaccount-tab-settings-kebab-delete" button
    Then I should see "delete-sysaccounts-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sysaccounts-modal" modal
    And I should see "remove-sysaccounts-success" alert

    Then I should be on "system-accounts" page
