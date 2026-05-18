Feature: ID Override user manipulation
  Create, and delete ID override users

  @seed
  Scenario: Seed: Create user and ID view for add override user test
    Given User "overrideuser1" "Chain" "User1" exists and is using password "Secret123"
    And view "override_view" exists

  @test
  Scenario: Add a new override user
    Given I am logged in as admin
    And I am on "id-views/override_view/override-users" page

    When I click on the "id-views-tab-override-users-button-add" button
    Then I should see "add-id-override-user-modal" modal

    When I select "overrideuser1" option in the "modal-form-override-user-dropdown" selector
    Then I should see "overrideuser1" option in the "modal-form-override-user-dropdown" selector

    When I type in the "modal-textbox-user-login" textbox text "myoverrideuser"
    Then I should see "myoverrideuser" in the "modal-textbox-user-login" textbox

    When I type in the "modal-textbox-user-homedir" textbox text "/home/user"
    Then I should see "/home/user" in the "modal-textbox-user-homedir" textbox

    When I type in the "modal-textbox-user-desc" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-user-desc" textbox

    When I type in the "modal-textbox-user-gecos" textbox text "my gecos"
    Then I should see "my gecos" in the "modal-textbox-user-gecos" textbox

    When I type in the "modal-textbox-user-shell" textbox text "/bin/ksh"
    Then I should see "/bin/ksh" in the "modal-textbox-user-shell" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-id-override-user-modal" modal
    And I should see "add-user-success" alert

    When I search for "overrideuser1" in the data table
    Then I should see "overrideuser1" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete override user, user, and ID view
    Given I delete override user "overrideuser1" from view "override_view"
    And I delete user "overrideuser1"
    And I delete view "override_view"

  @seed
  Scenario: Seed: Create user, ID view, and override user for delete test
    Given User "overrideuser2" "Chain" "User2" exists and is using password "Secret123"
    And view "override_view2" exists
    And override user "overrideuser2" exists in view "override_view2"

  @test
  Scenario: Delete an override user
    Given I am logged in as admin
    And I am on "id-views/override_view2/override-users" page

    When I select entry "overrideuser2" in the data table
    Then I should see "overrideuser2" entry selected in the data table

    When I click on the "id-views-tab-override-users-button-delete" button
    Then I should see "delete-id-override-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-id-override-modal" modal
    And I should see "remove-id-override-users-success" alert

    When I search for "overrideuser2" in the data table
    Then I should not see "overrideuser2" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete user and ID view after delete override user test
    Given I delete user "overrideuser2"
    And I delete view "override_view2"
