Feature: RADIUS server management
  Create, and delete RADIUS servers

  @test
  Scenario: Add a new RADIUS server
    Given I am logged in as admin
    And I am on "radius-servers" page

    When I click on the "radius-servers-button-add" button
    Then I should see "add-radius-server-modal" modal

    When I type in the "modal-textbox-radius-server-name" textbox text "a-radius-server"
    Then I should see "a-radius-server" in the "modal-textbox-radius-server-name" textbox

    When I type in the "modal-textbox-radius-server" textbox text "radius.example.test"
    Then I should see "radius.example.test" in the "modal-textbox-radius-server" textbox

    When I type in the "modal-textbox-radius-secret" textbox text "Secret123"
    Then I should see "Secret123" in the "modal-textbox-radius-secret" textbox

    When I type in the "modal-textbox-radius-secret-verify" textbox text "Secret123"
    Then I should see "Secret123" in the "modal-textbox-radius-secret-verify" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-radius-server-modal" modal
    And I should see "add-radius-server-success" alert

    When I search for "a-radius-server" in the data table
    Then I should see "a-radius-server" entry in the data table

  @cleanup
  Scenario: Delete a RADIUS server
    Given I delete RADIUS server "a-radius-server"

  @seed
  Scenario: Create a RADIUS server
    Given RADIUS server "a-radius-server" exists with server "radius.example.test" and secret "Secret123"

  @test
  Scenario: Delete a RADIUS server
    Given I am logged in as admin
    And I am on "radius-servers" page

    When I search for "a-radius-server" in the data table
    Then I should see "a-radius-server" entry in the data table

    When I select entry "a-radius-server" in the data table
    Then I should see "a-radius-server" entry selected in the data table

    When I click on the "radius-servers-button-delete" button
    Then I should see "delete-radius-servers-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-radius-servers-modal" modal
    And I should see "remove-radius-servers-success" alert

    When I search for "a-radius-server" in the data table
    Then I should not see "a-radius-server" entry in the data table

  @seed
  Scenario: Create RADIUS servers
    Given RADIUS server "radius-server1" exists with server "radius1.example.test" and secret "Secret123"
    And RADIUS server "radius-server2" exists with server "radius2.example.test" and secret "Secret123"

  @test
  Scenario: Delete many RADIUS servers
    Given I am logged in as admin
    And I am on "radius-servers" page

    When I search for "radius-server1" in the data table
    Then I should see "radius-server1" entry in the data table
    When I check entry "radius-server1" in the data table
    Then I should see "radius-server1" entry selected in the data table

    When I search for "radius-server2" in the data table
    Then I should see "radius-server2" entry in the data table
    When I check entry "radius-server2" in the data table
    Then I should see "radius-server2" entry selected in the data table

    When I click on the "radius-servers-button-delete" button
    Then I should see "delete-radius-servers-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-radius-servers-modal" modal
    And I should see "remove-radius-servers-success" alert

    When I search for "radius-server1" in the data table
    Then I should not see "radius-server1" entry in the data table

    When I search for "radius-server2" in the data table
    Then I should not see "radius-server2" entry in the data table

