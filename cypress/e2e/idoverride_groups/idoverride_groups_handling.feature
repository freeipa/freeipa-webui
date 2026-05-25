Feature: ID Override group manipulation
  Create, and delete ID override groups

  @seed
  Scenario: Seed: Create user group and ID view for add override group test
    Given user group "overridegroup1" exists
    And view "override_group_view" exists

  @test
  Scenario: Add a new override group
    Given I am logged in as admin
    And I am on "id-views/override_group_view/override-groups" page

    When I click on the "id-views-tab-override-groups-button-add" button
    Then I should see "add-id-override-group-modal" modal

    When I select "overridegroup1" option in the "modal-override-group-dropdown" selector
    Then I should see "overridegroup1" option in the "modal-override-group-dropdown" selector

    When I type in the "modal-textbox-group-name" textbox text "myoverridegroup1"
    Then I should see "myoverridegroup1" in the "modal-textbox-group-name" textbox

    When I type in the "modal-textbox-group-description" textbox text "my description2"
    Then I should see "my description2" in the "modal-textbox-group-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-id-override-group-modal" modal
    And I should see "add-group-success" alert

    When I search for "overridegroup1" in the data table
    Then I should see "overridegroup1" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete override group, user group, and ID view
    Given I delete override group "overridegroup1" from view "override_group_view"
    And I delete user group "overridegroup1"
    And I delete view "override_group_view"

  @seed
  Scenario: Seed: Create user group, ID view, and override group for delete test
    Given user group "overridegroup2" exists
    And view "override_group_view2" exists
    And override group "overridegroup2" exists in view "override_group_view2"

  @test
  Scenario: Delete an override group
    Given I am logged in as admin
    And I am on "id-views/override_group_view2/override-groups" page

    When I select entry "overridegroup2" in the data table
    Then I should see "overridegroup2" entry selected in the data table

    When I click on the "id-views-tab-override-groups-button-delete" button
    Then I should see "delete-id-override-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-id-override-modal" modal
    And I should see "remove-id-override-groups-success" alert

    When I search for "overridegroup2" in the data table
    Then I should not see "overridegroup2" entry in the data table

  @cleanup
  Scenario: Cleanup: Delete user group and ID view after delete override group test
    Given I delete user group "overridegroup2"
    And I delete view "override_group_view2"
