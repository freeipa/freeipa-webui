Feature: Permission settings manipulation
  Modify permission settings

  @seed
  Scenario: Create permission for save test
    Given permission "save_revert_perm" exists with subtree "cn=accounts,dc=ipa,dc=test"

  @test
  Scenario: Modify and save subtree field
    Given I am logged in as admin
    And I am on "permissions/save_revert_perm" page

    When I type in the "permissions-tab-settings-textbox-ipapermlocation" textbox text "cn=users,cn=accounts,dc=ipa,dc=test"
    Then I should see "cn=users,cn=accounts,dc=ipa,dc=test" in the "permissions-tab-settings-textbox-ipapermlocation" textbox

    When I click on the "permissions-tab-settings-button-save" button
    Then I should see "save-success" alert

  @cleanup
  Scenario: Delete save_revert_perm
    Given I delete permission "save_revert_perm"

  @seed
  Scenario: Create permission for revert test
    Given permission "revert_perm" exists

  @test
  Scenario: Revert changes
    Given I am logged in as admin
    And I am on "permissions/revert_perm" page

    When I type in the "permissions-tab-settings-textbox-ipapermlocation" textbox text "ou=reverted,dc=example,dc=com"
    Then I should see "ou=reverted,dc=example,dc=com" in the "permissions-tab-settings-textbox-ipapermlocation" textbox

    When I click on the "permissions-tab-settings-button-revert" button
    Then I should see "revert-success" alert

  @cleanup
  Scenario: Delete revert_perm
    Given I delete permission "revert_perm"

  @seed
  Scenario: Create permission for button state test
    Given permission "btn_state_perm" exists with subtree "cn=accounts,dc=ipa,dc=test"

  @test
  Scenario: Save and Revert buttons are disabled when no changes
    Given I am logged in as admin
    And I am on "permissions/btn_state_perm" page

    Then I should see the "permissions-tab-settings-button-save" button is disabled
    And I should see the "permissions-tab-settings-button-revert" button is disabled

    When I type in the "permissions-tab-settings-textbox-ipapermlocation" textbox text "cn=users,cn=accounts,dc=ipa,dc=test"
    Then I should see "cn=users,cn=accounts,dc=ipa,dc=test" in the "permissions-tab-settings-textbox-ipapermlocation" textbox
    And I should see the "permissions-tab-settings-button-save" button is enabled
    And I should see the "permissions-tab-settings-button-revert" button is enabled

    When I click on the "permissions-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see the "permissions-tab-settings-button-save" button is disabled
    And I should see the "permissions-tab-settings-button-revert" button is disabled

  @cleanup
  Scenario: Delete btn_state_perm
    Given I delete permission "btn_state_perm"

  @seed
  Scenario: Create permission for bind rule type test
    Given permission "bindrule_perm" exists

  @test
  Scenario: Change bind rule type
    Given I am logged in as admin
    And I am on "permissions/bindrule_perm" page

    When I select "all" option in the "permissions-tab-settings-select-ipapermbindruletype-select" selector
    Then I should see "all" option in the "permissions-tab-settings-select-ipapermbindruletype-select" selector

    And I should see the "permissions-tab-settings-button-save" button is enabled
    And I should see the "permissions-tab-settings-button-revert" button is enabled

    When I click on the "permissions-tab-settings-button-save" button
    Then I should see "save-success" alert

  @cleanup
  Scenario: Delete bindrule_perm
    Given I delete permission "bindrule_perm"
