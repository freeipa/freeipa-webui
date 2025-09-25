Feature: HBAC service is a member of
  Work with HBAC service Is a member of section

  @test
  Scenario: Add crond to a HBAC service group
    Given I am logged in as admin
    And I am on "hbac-services/crond" page

    When I click on the "hbac-service-is-member-of-tab" tab
    Then I should see "hbac-service-is-member-of-tab" tab selected
    And I should see "hbac-service-is-member-of-tab-hbacservicegroups" tab

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal

    Then I should see "item-ftp" dual list item on the left
    When I click on "item-ftp" dual list item
    Then I should see "item-ftp" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-ftp" dual list item on the right
    And I should see "item-ftp" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert
    And I should see "ftp" entry in the data table

  @cleanup
  Scenario: Delete a HBAC service group
    Given I delete service group member "ftp" from service "crond"

  @seed
  Scenario: Add a HBAC service group
    Given I add service group member "ftp" to service "crond"

  @test
  Scenario: Search for a HBAC service group
    Given I am logged in as admin
    And I am on "hbac-services/crond" page

    When I click on the "hbac-service-is-member-of-tab" tab
    Then I should see "hbac-service-is-member-of-tab" tab selected

    When I search for "ftp" in the members table
    Then I should see "ftp" entry in the data table

    When I search for "notthere" in the members table
    Then I should not see "notthere" entry in the data table
    And I should not see "ftp" entry in the data table

  @cleanup
  Scenario: Delete a HBAC service group
    Given I delete service group member "ftp" from service "crond"

  @seed
  Scenario: Add a HBAC service group
    Given I add service group member "ftp" to service "crond"

  @test
  Scenario: Delete a member from the HBAC service group
    Given I am logged in as admin
    And I am on "hbac-services/crond" page

    When I click on the "hbac-service-is-member-of-tab" tab
    Then I should see "hbac-service-is-member-of-tab" tab selected

    When I search for "ftp" in the members table
    Then I should see "ftp" entry in the data table

    When I select entry "ftp" in the members table
    And I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal
    And I should see "ftp" entry in the data table

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-hbac-services-success" alert
    And I should not see "ftp" entry in the data table

