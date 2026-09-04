Feature: Hostgroup management
  Create, and delete host groups

  @test
  Scenario: Add a new host group
    Given I am logged in as admin
    And I am on "host-groups" page

    When I click on the "host-groups-button-add" button
    Then I should see "add-hostgroup-modal" modal

    When I type in the "modal-textbox-hostgroup-name" textbox text "a-hostgroup"
    Then I should see "a-hostgroup" in the "modal-textbox-hostgroup-name" textbox

    When I type in the "modal-textbox-hostgroup-description" textbox text "test"
    Then I should see "test" in the "modal-textbox-hostgroup-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-hostgroup-modal" modal
    And I should see "add-hostgroup-success" alert

    When I search for "a-hostgroup" in the data table
    Then I should see "a-hostgroup" entry in the data table

  @cleanup
  Scenario: Delete a host group
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create a host group
    Given hostgroup "a-hostgroup" exists

  @test
  Scenario: Delete a host group
    Given I am logged in as admin
    And I am on "host-groups" page

    When I search for "a-hostgroup" in the data table
    Then I should see "a-hostgroup" entry in the data table

    When I select entry "a-hostgroup" in the data table
    Then I should see "a-hostgroup" entry selected in the data table

    When I click on the "host-groups-button-delete" button
    Then I should see "delete-hostgroups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-hostgroups-modal" modal
    And I should see "remove-hostgroups-success" alert

    When I search for "a-hostgroup" in the data table
    Then I should not see "a-hostgroup" entry in the data table

  @seed
  Scenario: Create host groups
    Given hostgroup "hostgroup1" exists
    And hostgroup "hostgroup2" exists

  @test
  Scenario: Delete many host groups
    Given I am logged in as admin
    And I am on "host-groups" page

    When I search for "hostgroup1" in the data table
    Then I should see "hostgroup1" entry in the data table
    When I select entry "hostgroup1" in the data table
    Then I should see "hostgroup1" entry selected in the data table

    When I search for "hostgroup2" in the data table
    Then I should see "hostgroup2" entry in the data table
    When I select entry "hostgroup2" in the data table
    Then I should see "hostgroup2" entry selected in the data table

    When I click on the "host-groups-button-delete" button
    Then I should see "delete-hostgroups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-hostgroups-modal" modal
    And I should see "remove-hostgroups-success" alert

    When I search for "hostgroup1" in the data table
    Then I should not see "hostgroup1" entry in the data table

    When I search for "hostgroup2" in the data table
    Then I should not see "hostgroup2" entry in the data table

  @test
  Scenario: Cancel creation of a host group
    Given I am logged in as admin
    And I am on "host-groups" page

    When I search for "cancelhostgroup" in the data table
    Then I should not see "cancelhostgroup" entry in the data table

    When I click on the "host-groups-button-add" button
    Then I should see "add-hostgroup-modal" modal

    When I type in the "modal-textbox-hostgroup-name" textbox text "cancelhostgroup"
    Then I should see "cancelhostgroup" in the "modal-textbox-hostgroup-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-hostgroup-modal" modal

    When I search for "cancelhostgroup" in the data table
    Then I should not see "cancelhostgroup" entry in the data table
