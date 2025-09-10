Feature: Netgroup members manipulation
  Manage members of a netgroup across Users, User groups, Hosts, Host groups and Netgroups tabs

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists

  @test
  Scenario: Add a User member
    Given I am logged in as admin
    And I am on "netgroups/mynetgroup/member_user" page
    And I should be on "netgroups/mynetgroup/member_user" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-admin" dual list item
    Then I should see "item-admin" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "member-of-add-modal" modal

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert
    When I search for "admin" in the members table
    Then I should see "admin" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists
    And "admin" exists in table "mynetgroup/member_user"

  @test
  Scenario: Remove User member
    Given I am logged in as admin
    When I am on "netgroups/mynetgroup/member_user" page
    Then I should be on "netgroups/mynetgroup/member_user" page

    When I select entry "admin" in the members table
    Then I should see "admin" entry selected in the data table
    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-users-success" alert
    When I search for "admin" in the members table
    Then I should not see "admin" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists

  @test
  Scenario: Add a User group member
    Given I am logged in as admin
    When I am on "netgroups/mynetgroup/member_group" page
    Then I should be on "netgroups/mynetgroup/member_group" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-editors" dual list item
    Then I should see "item-editors" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "member-of-add-modal" modal

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert
    When I search for "editors" in the members table
    Then I should see "editors" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists
    And "editors" exists in table "mynetgroup/member_group"

  @test
  Scenario: Remove User group member
    Given I am logged in as admin
    When I am on "netgroups/mynetgroup/member_group" page
    Then I should be on "netgroups/mynetgroup/member_group" page

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
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists

  @test
  Scenario: Add a Host member
    Given I am logged in as admin
    When I am on "netgroups/mynetgroup/member_host" page
    Then I should be on "netgroups/mynetgroup/member_host" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-webui.ipa.test" dual list item
    Then I should see "item-webui.ipa.test" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "member-of-add-modal" modal

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert
    When I search for "webui.ipa.test" in the members table
    Then I should see "webui.ipa.test" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists
    And "webui.ipa.test" exists in table "mynetgroup/member_host"

  @test
  Scenario: Remove Host member
    Given I am logged in as admin
    And I am on "netgroups/mynetgroup/member_host" page
    And I should be on "netgroups/mynetgroup/member_host" page

    When I search for "webui.ipa.test" in the members table
    Then I should see "webui.ipa.test" entry in the data table

    When I select entry "webui.ipa.test" in the members table
    Then I should see "webui.ipa.test" entry selected in the data table
    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-host-success" alert
    When I search for "webui.ipa.test" in the members table
    Then I should not see "webui.ipa.test" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists

  @test
  Scenario: Add a Host group member
    Given I am logged in as admin
    And I am on "netgroups/mynetgroup/member_hostgroup" page
    And I should be on "netgroups/mynetgroup/member_hostgroup" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-ipaservers" dual list item
    Then I should see "item-ipaservers" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "member-of-add-modal" modal

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert
    When I search for "ipaservers" in the members table
    Then I should see "ipaservers" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists
    And "ipaservers" exists in table "mynetgroup/member_hostgroup"

  @test
  Scenario: Remove Host group member
    Given I am logged in as admin
    And I am on "netgroups/mynetgroup/member_hostgroup" page
    And I should be on "netgroups/mynetgroup/member_hostgroup" page

    When I select entry "ipaservers" in the members table
    Then I should see "ipaservers" entry selected in the data table
    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-hostgroups-success" alert
    When I search for "ipaservers" in the members table
    Then I should not see "ipaservers" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists
    And netgroup "mynetgroup2" exists

  @test
  Scenario: Add a Netgroup member
    Given I am logged in as admin
    And I am on "netgroups/mynetgroup/member_netgroup" page
    And I should be on "netgroups/mynetgroup/member_netgroup" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    When I click on "item-mynetgroup2" dual list item
    Then I should see "item-mynetgroup2" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "member-of-add-modal" modal

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert
    When I search for "mynetgroup2" in the members table
    Then I should see "mynetgroup2" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"
    And I delete netgroup "mynetgroup2"

  @seed
  Scenario: Seed data
    Given netgroup "mynetgroup" exists
    And netgroup "mynetgroup2" exists
    And "mynetgroup2" exists in table "mynetgroup/member_netgroup"

  @test
  Scenario: Remove Netgroup member
    Given I am logged in as admin
    When I am on "netgroups/mynetgroup/member_netgroup" page
    Then I should be on "netgroups/mynetgroup/member_netgroup" page

    When I select entry "mynetgroup2" in the members table
    Then I should see "mynetgroup2" entry selected in the data table
    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-netgroups-success" alert
    When I search for "mynetgroup2" in the members table
    Then I should not see "mynetgroup2" entry in the data table

  @cleanup
  Scenario: Cleanup: delete netgroup
    Given I delete netgroup "mynetgroup"
    And I delete netgroup "mynetgroup2"
