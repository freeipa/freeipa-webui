Feature: User group members
  Manage user group members across Users, User groups, and Services tabs

  @seed
  Scenario: Create seed data (user and user group)
    Given User "aturing" "Alan" "Turing" exists and is using password "Secret123"
    And user group "imitation-game-group" exists

  @test
  Scenario: Add a User member into the user group
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_user" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-aturing" dual list item on the left

    When I click on "item-aturing" dual list item
    Then I should see "item-aturing" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-aturing" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "aturing" in the data table
    Then I should see "aturing" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user "aturing"
    And I delete user group "imitation-game-group"

  @seed
  Scenario: Create seed data (user and user group)
    And user group "imitation-game-group" exists

  @test
  Scenario: Switch between direct and indirect memberships (Users)
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_user" page

    When I click on the "member-of-toggle-group-item-indirect" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is pressed
    And I should see the "member-of-button-add" button is disabled

    When I click on the "member-of-toggle-group-item-direct" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is not pressed
    And I should see the "member-of-toggle-group-item-direct" toggle button is pressed
    And I should see the "member-of-button-add" button is enabled

  @cleanup
  Scenario: Cleanup seed data
    And I delete user group "imitation-game-group"

  @seed
  Scenario: Create seed data (user and user group)
    Given User "aturing" "Alan" "Turing" exists and is using password "Secret123"
    And user group "imitation-game-group" exists
    And user "aturing" is member of group "imitation-game-group"

  @test
  Scenario: Remove User from the user group
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_user" page

    When I select entry "aturing" in the data table
    Then I should see "aturing" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-users-success" alert

    When I search for "aturing" in the data table
    Then I should not see "aturing" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user "aturing"
    And I delete user group "imitation-game-group"

  @seed
  Scenario: Create seed data (user group)
    Given user group "imitation-game-group" exists

  @test
  Scenario: Add a User group member into the user group
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_group" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-editors" dual list item on the left

    When I click on "item-editors" dual list item
    Then I should see "item-editors" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-editors" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "editors" in the data table
    Then I should see "editors" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "imitation-game-group"

  @seed
  Scenario: Create seed data (user group)
    Given user group "imitation-game-group" exists

  @test
  Scenario: Switch between direct and indirect memberships (User groups)
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_group" page

    When I click on the "member-of-toggle-group-item-indirect" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is pressed
    And I should see the "member-of-button-add" button is disabled

    When I click on the "member-of-toggle-group-item-direct" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is not pressed
    And I should see the "member-of-toggle-group-item-direct" toggle button is pressed
    And I should see the "member-of-button-add" button is enabled

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "imitation-game-group"

  @seed
  Scenario: Create seed data (user group)
    Given user group "imitation-game-group" exists
    And user group "editors" is member of group "imitation-game-group"

  @test
  Scenario: Remove User group from the user group
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_group" page

    When I select entry "editors" in the data table
    Then I should see "editors" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-usersgroups-success" alert

    When I search for "editors" in the data table
    Then I should not see "editors" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "imitation-game-group"

  @seed
  Scenario: Create seed data (user group)
    Given user group "imitation-game-group" exists

  @test
  Scenario: Add a Service member into the user group
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_service" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-DNS/webui.ipa.test@IPA.TEST" dual list item on the left

    When I click on "item-DNS/webui.ipa.test@IPA.TEST" dual list item
    Then I should see "item-DNS/webui.ipa.test@IPA.TEST" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-DNS/webui.ipa.test@IPA.TEST" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "DNS" in the data table
    Then I should see "DNS/webui.ipa.test@IPA.TEST" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "imitation-game-group"

  @seed
  Scenario: Create seed data (user group)
    Given user group "imitation-game-group" exists

  @test
  Scenario: Switch between direct and indirect memberships (Services)
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_service" page

    When I click on the "member-of-toggle-group-item-indirect" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is pressed
    And I should see the "member-of-button-add" button is disabled

    When I click on the "member-of-toggle-group-item-direct" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is not pressed
    And I should see the "member-of-toggle-group-item-direct" toggle button is pressed
    And I should see the "member-of-button-add" button is enabled

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "imitation-game-group"

  @seed
  Scenario: Create seed data (user group)
    Given user group "imitation-game-group" exists
    And service "DNS/webui.ipa.test@IPA.TEST" is member of group "imitation-game-group"

  @test
  Scenario: Remove Service from the user group
    Given I am logged in as admin
    And I am on "user-groups/imitation-game-group/member_service" page

    When I select entry "DNS/webui.ipa.test@IPA.TEST" in the data table
    Then I should see "DNS/webui.ipa.test@IPA.TEST" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-services-success" alert

    When I search for "DNS" in the data table
    Then I should not see "DNS/webui.ipa.test@IPA.TEST" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user group "imitation-game-group"
