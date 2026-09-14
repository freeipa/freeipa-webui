Feature: Self-service permission settings manipulation
  Modify self-service permission settings

  @seed
  Scenario: Create self-service permission for settings test
    Given self-service permission "settings_selfservice" exists with permissions "read" and attribute "cn"

  @test
  Scenario: Add write permission
    Given I am logged in as admin
    And I am on "selfservice-permissions/settings_selfservice" page

    Then I should see the "selfservice-permissions-tab-settings-checkbox-permissions-read" checkbox is checked
    And I should see the "selfservice-permissions-tab-settings-checkbox-permissions-write" checkbox is unchecked

    When I click on the "selfservice-permissions-tab-settings-checkbox-permissions-write" checkbox
    Then I should see the "selfservice-permissions-tab-settings-checkbox-permissions-write" checkbox is checked
    And I should see the "selfservice-permissions-tab-settings-button-save" button is enabled

    When I click on the "selfservice-permissions-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see the "selfservice-permissions-tab-settings-checkbox-permissions-write" checkbox is checked

  @cleanup
  Scenario: Delete settings_selfservice
    Given I delete self-service permission "settings_selfservice"

  @seed
  Scenario: Create self-service permission for attribute test
    Given self-service permission "attrs_selfservice" exists with permissions "read" and attribute "cn"

  @test
  Scenario: Add attribute
    Given I am logged in as admin
    And I am on "selfservice-permissions/attrs_selfservice" page

    When I select "description" in the "selfservice-permissions-tab-settings-select-attrs" typeahead checkbox
    Then I should see the "description" option selected in the "selfservice-permissions-tab-settings-select-attrs" typeahead checkbox
    And I should see the "selfservice-permissions-tab-settings-button-save" button is enabled

    When I click on the "selfservice-permissions-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see the "description" option selected in the "selfservice-permissions-tab-settings-select-attrs" typeahead checkbox

  @cleanup
  Scenario: Delete attrs_selfservice
    Given I delete self-service permission "attrs_selfservice"

  @seed
  Scenario: Create self-service permission for extra attribute test
    Given self-service permission "extra_attr_selfservice" exists with permissions "read" and attributes "cn,dn"

  @test
  Scenario: Show extra attribute from server
    Given I am logged in as admin
    And I am on "selfservice-permissions/extra_attr_selfservice" page

    Then I should see the "cn" option selected in the "selfservice-permissions-tab-settings-select-attrs" typeahead checkbox
    And I should see the "dn" option selected in the "selfservice-permissions-tab-settings-select-attrs" typeahead checkbox

  @cleanup
  Scenario: Delete extra_attr_selfservice
    Given I delete self-service permission "extra_attr_selfservice"

  @seed
  Scenario: Create self-service permission for revert test
    Given self-service permission "revert_selfservice" exists with permissions "read" and attribute "cn"

  @test
  Scenario: Revert changes
    Given I am logged in as admin
    And I am on "selfservice-permissions/revert_selfservice" page

    Then I should see the "selfservice-permissions-tab-settings-checkbox-permissions-read" checkbox is checked
    And I should see the "selfservice-permissions-tab-settings-checkbox-permissions-write" checkbox is unchecked

    When I click on the "selfservice-permissions-tab-settings-checkbox-permissions-write" checkbox
    Then I should see the "selfservice-permissions-tab-settings-checkbox-permissions-write" checkbox is checked

    When I click on the "selfservice-permissions-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see the "selfservice-permissions-tab-settings-checkbox-permissions-write" checkbox is unchecked

  @cleanup
  Scenario: Delete revert_selfservice
    Given I delete self-service permission "revert_selfservice"
