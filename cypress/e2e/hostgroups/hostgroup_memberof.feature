Feature: Hostgroup is a member of
  Work with hostgroup Is a member of section and its operations in all the available tabs

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists

  @test
  Scenario: Add a Host groups membership to the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/memberof_hostgroup" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-ipaservers" dual list item on the left

    When I click on "item-ipaservers" dual list item
    Then I should see "item-ipaservers" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-ipaservers" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "ipaservers" in the members table
    Then I should see "ipaservers" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And hostgroup "a-hostgroup" is member of hostgroup "ipaservers"

  @test
  Scenario: Delete a Host groups membership from the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/memberof_hostgroup" page

    When I select entry "ipaservers" in the members table
    Then I should see "ipaservers" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-host-groups-success" alert

    When I search for "ipaservers" in the members table
    Then I should not see "ipaservers" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And netgroup "test" exists

  @test
  Scenario: Add a netgroup membership to the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/memberof_netgroup" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-test" dual list item on the left

    When I click on "item-test" dual list item
    Then I should see "item-test" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-test" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "test" in the members table
    Then I should see "test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"
    And I delete netgroup "test"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And netgroup "test" exists
    And hostgroup "a-hostgroup" is member of netgroup "test"

  @test
  Scenario: Delete a netgroup membership from the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/memberof_netgroup" page

    When I select entry "test" in the members table
    Then I should see "test" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-netgroups-success" alert

    When I search for "test" in the members table
    Then I should not see "test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"
    And I delete netgroup "test"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And hbac rule "test" exists

  @test
  Scenario: Add a hbac rule membership to the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/memberof_hbacrule" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-test" dual list item on the left

    When I click on "item-test" dual list item
    Then I should see "item-test" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-test" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "test" in the members table
    Then I should see "test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"
    And I delete hbac rule "test"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And hbac rule "test" exists
    And hostgroup "a-hostgroup" is member of hbac rule "test"

  @test
  Scenario: Delete a hbac rule membership from the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/memberof_hbacrule" page

    When I select entry "test" in the members table
    Then I should see "test" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-hbac-rules-success" alert

    When I search for "test" in the members table
    Then I should not see "test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"
    And I delete hbac rule "test"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And sudo rule "test" exists

  @test
  Scenario: Add a sudo rule membership to the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/memberof_sudorule" page

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-test" dual list item on the left

    When I click on "item-test" dual list item
    Then I should see "item-test" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-test" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "test" in the members table
    Then I should see "test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"
    And I delete sudo rule "test"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And sudo rule "test" exists
    And hostgroup "a-hostgroup" is member of sudo rule "test"

  @test
  Scenario: Delete a sudo rule membership from the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/memberof_sudorule" page

    When I select entry "test" in the members table
    Then I should see "test" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-sudo-rules-success" alert

    When I search for "test" in the members table
    Then I should not see "test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"
    And I delete sudo rule "test"
