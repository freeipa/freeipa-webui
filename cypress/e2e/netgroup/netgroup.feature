Feature: Netgroup manipulation
  Create, and delete netgroups

  @test
  Scenario: Add a new netgroup
    Given I am logged in as admin
    And I am on "netgroups" page

    When I click on the "netgroups-button-add" button
    Then I should see "add-netgroup-modal" modal

    When I type in the "modal-textbox-netgroup-name" textbox text "a_net_group"
    Then I should see "a_net_group" in the "modal-textbox-netgroup-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-netgroup-modal" modal
    And I should see "add-netgroup-success" alert

    When I search for "a_net_group" in the data table
    Then I should see "a_net_group" entry in the data table

  @cleanup
  Scenario: Delete a netgroup
    Given I delete netgroup "a_net_group"

  @test
  Scenario: Add a new netgroup with description
    Given I am logged in as admin
    And I am on "netgroups" page

    When I click on the "netgroups-button-add" button
    Then I should see "add-netgroup-modal" modal

    When I type in the "modal-textbox-netgroup-name" textbox text "b_net_group"
    Then I should see "b_net_group" in the "modal-textbox-netgroup-name" textbox

    When I type in the "modal-textbox-netgroup-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-netgroup-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-netgroup-modal" modal
    And I should see "add-netgroup-success" alert

    When I search for "b_net_group" in the data table
    Then I should see "b_net_group" entry in the data table

  @cleanup
  Scenario: Delete a netgroup
    Given I delete netgroup "b_net_group"

  @test
  Scenario: Add one netgroup after another
    Given I am logged in as admin
    And I am on "netgroups" page

    When I click on the "netgroups-button-add" button
    Then I should see "add-netgroup-modal" modal

    When I type in the "modal-textbox-netgroup-name" textbox text "c_net_group"
    Then I should see "c_net_group" in the "modal-textbox-netgroup-name" textbox

    When I click on the "modal-button-add-and-add-another" button
    Then I should see "add-netgroup-modal" modal
    And I should see "add-netgroup-success" alert

    When I type in the "modal-textbox-netgroup-name" textbox text "d_net_group"
    Then I should see "d_net_group" in the "modal-textbox-netgroup-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-netgroup-modal" modal
    And I should see "add-netgroup-success" alert

    When I search for "c_net_group" in the data table
    Then I should see "c_net_group" entry in the data table

    When I search for "d_net_group" in the data table
    Then I should see "d_net_group" entry in the data table

  @cleanup
  Scenario: Delete netgroups
    Given I delete netgroup "c_net_group"
    And I delete netgroup "d_net_group"

  @seed
  Scenario: Create netgroups
    Given netgroup "a_net_group" exists

  @test
  Scenario: Delete a netgroup via toolbar
    Given I am logged in as admin
    And I am on "netgroups" page

    When I select entry "a_net_group" in the data table
    Then I should see "a_net_group" entry selected in the data table

    When I click on the "netgroups-button-delete" button
    Then I should see "delete-netgroups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-netgroups-modal" modal
    And I should see "remove-netgroups-success" alert

    When I search for "a_net_group" in the data table
    Then I should not see "a_net_group" entry in the data table

  @seed
  Scenario: Create netgroups
    Given netgroup "b_net_group" exists
    And netgroup "c_net_group" exists
    And netgroup "d_net_group" exists

  @test
  Scenario: Delete many netgroups via toolbar
    Given I am logged in as admin
    And I am on "netgroups" page

    When I select entry "b_net_group" in the data table
    Then I should see "b_net_group" entry selected in the data table

    When I select entry "c_net_group" in the data table
    Then I should see "c_net_group" entry selected in the data table

    When I select entry "d_net_group" in the data table
    Then I should see "d_net_group" entry selected in the data table

    When I click on the "netgroups-button-delete" button
    Then I should see "delete-netgroups-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-netgroups-modal" modal
    And I should see "remove-netgroups-success" alert

    When I search for "b_net_group" in the data table
    Then I should not see "b_net_group" entry in the data table

    When I search for "c_net_group" in the data table
    Then I should not see "c_net_group" entry in the data table

    When I search for "d_net_group" in the data table
    Then I should not see "d_net_group" entry in the data table

  @test
  Scenario: Cancel creation of a netgroup
    Given I am logged in as admin
    And I am on "netgroups" page

    When I click on the "netgroups-button-add" button
    Then I should see "add-netgroup-modal" modal

    When I type in the "modal-textbox-netgroup-name" textbox text "cancelgroup"
    Then I should see "cancelgroup" in the "modal-textbox-netgroup-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-netgroup-modal" modal

    When I search for "cancelgroup" in the data table
    Then I should not see "cancelgroup" entry in the data table
