Feature: ID View manipulation
  Create, and delete ID views

  @test
  Scenario: Add a new view
    Given I am logged in as admin
    And I am on "id-views" page

    When I click on the "id-views-button-add" button
    Then I should see "add-id-view-modal" modal

    When I type in the "modal-textbox-id-view-name" textbox text "a_new_view"
    Then I should see "a_new_view" in the "modal-textbox-id-view-name" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-id-view-modal" modal
    And I should see "add-id-view-success" alert

    When I search for "a_new_view" in the data table
    Then I should see "a_new_view" entry in the data table

  @cleanup
  Scenario: Delete a view
    Given I delete view "a_new_view"

  @test
  Scenario: Add a new view with description
    Given I am logged in as admin
    And I am on "id-views" page

    When I click on the "id-views-button-add" button
    Then I should see "add-id-view-modal" modal

    When I type in the "modal-textbox-id-view-name" textbox text "a_new_view"
    Then I should see "a_new_view" in the "modal-textbox-id-view-name" textbox

    When I type in the "modal-textbox-id-view-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-id-view-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-id-view-modal" modal
    And I should see "add-id-view-success" alert

    When I search for "a_new_view" in the data table
    Then I should see "a_new_view" entry in the data table
    And I should see "a_new_view" entry in the data table with attribute "Description" set to "my description"

  @cleanup
  Scenario: Delete a view
    Given I delete view "a_new_view"

  @test
  Scenario: Add one view after another
    Given I am logged in as admin
    And I am on "id-views" page

    When I click on the "id-views-button-add" button
    Then I should see "add-id-view-modal" modal

    When I type in the "modal-textbox-id-view-name" textbox text "a_new_view"
    Then I should see "a_new_view" in the "modal-textbox-id-view-name" textbox

    When I click on the "modal-button-add-and-add-another" button
    Then I should see "add-id-view-modal" modal
    And I should see "add-id-view-success" alert

    When I click on the "modal-button-cancel" button
    Then I should not see "add-id-view-modal" modal

    When I search for "a_new_view" in the data table
    Then I should see "a_new_view" entry in the data table

  @cleanup
  Scenario: Delete a view
    Given I delete view "a_new_view"

  @seed
  Scenario: Create views
    Given view "a_new_view" exists

  @test
  Scenario: Unapply views from hosts
    Given I am logged in as admin
    And I am on "id-views" page

    When I click on the "id-views-kebab" kebab menu
    Then I should see "id-views-kebab" kebab menu expanded

    When I click on the "id-views-kebab-unapply-hosts" button
    Then I should see "dual-list-modal" modal

    When I click on search link in dual list
    Then I should see "item-webui.ipa.test" dual list item on the left

    When I click on "item-webui.ipa.test" dual list item
    Then I should see "item-webui.ipa.test" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-webui.ipa.test" dual list item on the right
    And I should see "item-webui.ipa.test" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "unapply-id-views-hosts-success" alert

  @test
  Scenario: Unapply views from host groups
    Given I am logged in as admin
    And I am on "id-views" page

    When I click on the "id-views-kebab" kebab menu
    Then I should see "id-views-kebab" kebab menu expanded

    When I click on the "id-views-kebab-unapply-hostgroups" button
    Then I should see "dual-list-modal" modal

    When I click on search link in dual list
    Then I should see "item-ipaservers" dual list item on the left

    When I click on "item-ipaservers" dual list item
    Then I should see "item-ipaservers" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-ipaservers" dual list item on the right
    And I should see "item-ipaservers" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "unapply-id-views-hosts-success" alert

  @cleanup
  Scenario: Delete a view
    Given I delete view "a_new_view"

  @seed
  Scenario: Create view "a_new_view"
    Given view "a_new_view" exists

  @test
  Scenario: Delete a view
    Given I am logged in as admin
    And I am on "id-views" page

    When I search for "a_new_view" in the data table
    Then I should see "a_new_view" entry in the data table

    When I select entry "a_new_view" in the data table
    Then I should see "a_new_view" entry selected in the data table

    When I click on the "id-views-button-delete" button
    Then I should see "delete-id-views-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-id-views-modal" modal
    And I should see "remove-id-views-success" alert

    When I search for "a_new_view" in the data table
    Then I should not see "a_new_view" entry in the data table

  @seed
  Scenario: Create views
    Given view "a_new_view" exists
    Given view "b_new_view" exists

  @test
  Scenario: Delete many views
    Given I am logged in as admin
    And I am on "id-views" page

    When I search for "a_new_view" in the data table
    Then I should see "a_new_view" entry in the data table

    When I select entry "a_new_view" in the data table
    Then I should see "a_new_view" entry selected in the data table

    When I search for "b_new_view" in the data table
    Then I should see "b_new_view" entry in the data table

    When I select entry "b_new_view" in the data table
    Then I should see "b_new_view" entry selected in the data table

    When I click on the "id-views-button-delete" button
    Then I should see "delete-id-views-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-id-views-modal" modal
    And I should see "remove-id-views-success" alert

    When I search for "a_new_view" in the data table
    Then I should not see "a_new_view" entry in the data table

    When I search for "b_new_view" in the data table
    Then I should not see "b_new_view" entry in the data table

  @test
  Scenario: Cancel creation of a view
    Given I am logged in as admin
    And I am on "id-views" page

    When I click on the "id-views-button-add" button
    Then I should see "add-id-view-modal" modal

    When I type in the "modal-textbox-id-view-name" textbox text "a_new_view"
    Then I should see "a_new_view" in the "modal-textbox-id-view-name" textbox

    When I click on the "modal-button-cancel" button
    Then I should not see "add-id-view-modal" modal

    When I search for "a_new_view" in the data table
    Then I should not see "a_new_view" entry in the data table
