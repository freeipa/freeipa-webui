Feature: Role members manipulation
  Manage role members across Users, User groups, Hosts, Host groups, Services, User ID override, and System accounts tabs

  @seed
  Scenario: Create seed data (user and role)
    Given User "roleuser" "Role" "User" exists and is using password "Secret123"
    And role "member_test_role" exists

  @test
  Scenario: Add a User member into the role
    Given I am logged in as admin
    And I am on "roles/member_test_role/member_user" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-roleuser" dual list item on the left

    When I click on "item-roleuser" dual list item
    Then I should see "item-roleuser" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-roleuser" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "roleuser" in the members table
    Then I should see "roleuser" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user "roleuser"
    And I delete role "member_test_role"

  @seed
  Scenario: Create seed data (user and role with member)
    Given User "removeuser" "Remove" "User" exists and is using password "Secret123"
    And role "remove_member_role" exists
    And user "removeuser" is member of role "remove_member_role"

  @test
  Scenario: Remove User from the role
    Given I am logged in as admin
    And I am on "roles/remove_member_role/member_user" page

    When I select entry "removeuser" in the members table
    Then I should see "removeuser" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-users-success" alert

    When I search for "removeuser" in the members table
    Then I should not see "removeuser" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete user "removeuser"
    And I delete role "remove_member_role"

  @seed
  Scenario: Create seed data (role for user group test)
    Given role "group_member_role" exists

  @test
  Scenario: Add a User group member into the role
    Given I am logged in as admin
    And I am on "roles/group_member_role/member_group" page

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

    When I search for "editors" in the members table
    Then I should see "editors" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete role "group_member_role"

  @seed
  Scenario: Create seed data (role with user group member)
    Given role "remove_group_role" exists
    And user group "editors" is member of role "remove_group_role"

  @test
  Scenario: Remove User group from the role
    Given I am logged in as admin
    And I am on "roles/remove_group_role/member_group" page

    When I select entry "editors" in the members table
    Then I should see "editors" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-usersgroups-success" alert

    When I search for "editors" in the members table
    Then I should not see "editors" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete role "remove_group_role"

  @seed
  Scenario: Create seed data (role for service test)
    Given role "service_member_role" exists

  @test
  Scenario: Add a Service member into the role
    Given I am logged in as admin
    And I am on "roles/service_member_role/member_service" page

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

    When I search for "DNS" in the members table
    Then I should see "DNS/webui.ipa.test@IPA.TEST" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete role "service_member_role"

  @seed
  Scenario: Create seed data (role with service member)
    Given role "remove_service_role" exists
    And service "DNS/webui.ipa.test@IPA.TEST" is member of role "remove_service_role"

  @test
  Scenario: Remove Service from the role
    Given I am logged in as admin
    And I am on "roles/remove_service_role/member_service" page

    When I select entry "DNS/webui.ipa.test@IPA.TEST" in the members table
    Then I should see "DNS/webui.ipa.test@IPA.TEST" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-services-success" alert

    When I search for "DNS" in the members table
    Then I should not see "DNS/webui.ipa.test@IPA.TEST" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete role "remove_service_role"
