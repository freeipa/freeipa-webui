Feature: RADIUS server settings manipulation
  Modify RADIUS server settings

  @seed
  Scenario: Create RADIUS server
    Given RADIUS server "a-radius-server" exists with server "radius.example.test" and secret "Secret123"

  @test
  Scenario: Set Description
    Given I am logged in as admin
    And I am on "radius-servers/a-radius-server" page

    When I type in the "radius-servers-tab-settings-textarea-description" textbox text "test description"
    Then I should see "test description" in the "radius-servers-tab-settings-textarea-description" textbox
    And I should see the "radius-servers-tab-settings-button-save" button is enabled

    When I click on the "radius-servers-tab-settings-button-save" button
    Then I should see "save-success" alert

  @test
  Scenario: Set Server
    Given I am logged in as admin
    And I am on "radius-servers/a-radius-server" page

    When I type in the "radius-servers-tab-settings-textinput-ipatokenradiusserver" textbox text "new-radius.example.test"
    Then I should see "new-radius.example.test" in the "radius-servers-tab-settings-textinput-ipatokenradiusserver" textbox
    And I should see the "radius-servers-tab-settings-button-save" button is enabled

    When I click on the "radius-servers-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "new-radius.example.test" in the "radius-servers-tab-settings-textinput-ipatokenradiusserver" textbox

  @test
  Scenario: Set User attribute
    Given I am logged in as admin
    And I am on "radius-servers/a-radius-server" page

    When I type in the "radius-servers-tab-settings-textinput-ipatokenusermapattribute" textbox text "uid"
    Then I should see "uid" in the "radius-servers-tab-settings-textinput-ipatokenusermapattribute" textbox
    And I should see the "radius-servers-tab-settings-button-save" button is enabled

    When I click on the "radius-servers-tab-settings-button-save" button
    Then I should see "save-success" alert
    And I should see "uid" in the "radius-servers-tab-settings-textinput-ipatokenusermapattribute" textbox

  @cleanup
  Scenario: Cleanup: Remove RADIUS server before revert test
    Given I delete RADIUS server "a-radius-server"

  @seed
  Scenario: Seed: Recreate RADIUS server with known values for revert test
    Given RADIUS server "a-radius-server" exists with server "radius.example.test" secret "Secret123" and description "original"

  @test
  Scenario: Revert changes
    Given I am logged in as admin
    And I am on "radius-servers/a-radius-server" page

    When I type in the "radius-servers-tab-settings-textarea-description" textbox text "temporary"
    Then I should see "temporary" in the "radius-servers-tab-settings-textarea-description" textbox
    And I should see the "radius-servers-tab-settings-button-revert" button is enabled

    When I click on the "radius-servers-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see "original" in the "radius-servers-tab-settings-textarea-description" textbox
    And I should see the "radius-servers-tab-settings-button-save" button is disabled

  @cleanup
  Scenario: Cleanup: Remove the RADIUS server
    Given I delete RADIUS server "a-radius-server"
