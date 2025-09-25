Feature: HBAC service group members
  Work with Members section and its operations

  @test
  Scenario: Add an HBAC service member
    Given I am logged in as admin
    And I am on "hbac-service-groups/ftp" page

    When I click on the "hbac-service-groups-tab-members" tab
    Then I should see "hbac-service-groups-tab-members" tab selected
    And I should see "hbac-service-groups-tab-members-tab-hbacservices" tab

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "item-crond" dual list item on the left

    When I click on "item-crond" dual list item
    Then I should see "item-crond" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-crond" dual list item on the right
    And I should see "item-crond" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert
    And I should see "crond" entry in the data table

  @cleanup
  Scenario: Cleanup: Remove HBAC service member
    Given I delete service group member "crond" from service group "ftp"

  @seed
  Scenario: Seed: Ensure service exists
    Given I add service group member "crond" to service group "ftp"

  @test
  Scenario: Search within HBAC service members
    Given I am logged in as admin
    And I am on "hbac-service-groups/ftp" page

    When I click on the "hbac-service-groups-tab-members" tab
    Then I should see "hbac-service-groups-tab-members" tab selected

    When I search for "crond" in the members table
    Then I should see "crond" entry in the data table

  @cleanup
  Scenario: Cleanup: Remove HBAC service member
    Given I delete service group member "crond" from service group "ftp"

  @seed
  Scenario: Seed: Ensure service exists
    Given I add service group member "crond" to service group "ftp"

  @test
  Scenario: Remove HBAC service member
    Given I am logged in as admin
    And I am on "hbac-service-groups/ftp" page

    When I click on the "hbac-service-groups-tab-members" tab
    Then I should see "hbac-service-groups-tab-members" tab selected

    Then I should see "crond" entry in the data table
    When I select entry "crond" in the members table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal
    And I should see "crond" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should see "remove-members-success" alert
    And I should not see "crond" entry in the data table

