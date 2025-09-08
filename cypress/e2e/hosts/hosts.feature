Feature: Host manipulation
  Create, and delete hosts

  @test
  Scenario: Add a new host
    Given I am logged in as admin
    And I am on "hosts" page

    When I click on the "hosts-button-add" button
    Then I should see "add-host-modal" modal

    When I type in the "modal-textbox-host-name" textbox text "myfirstserver"
    Then I should see "myfirstserver" in the "modal-textbox-host-name" textbox

    When I click on the "modal-checkbox-force-host" checkbox
    Then I should see the "modal-checkbox-force-host" checkbox is checked

    When I click on the "modal-button-add" button
    Then I should not see "add-host-modal" modal
    And I should see "add-host-success" alert

    When I search for "myfirstserver" in the data table
    Then I should see "myfirstserver.ipa.test" entry in the data table

  @cleanup
  Scenario: Delete a host
    Given I delete host "myfirstserver"

  @test
  Scenario: Add a new host with all fields set
    Given I am logged in as admin
    And I am on "hosts" page

    When I click on the "hosts-button-add" button
    Then I should see "add-host-modal" modal

    When I type in the "modal-textbox-host-name" textbox text "myfirstserver"
    Then I should see "myfirstserver" in the "modal-textbox-host-name" textbox

    When I type in the "modal-textbox-host-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-host-description" textbox

    When I type in the "modal-textbox-host-class" textbox text "test class"
    Then I should see "test class" in the "modal-textbox-host-class" textbox

    When I click on the "modal-checkbox-force-host" checkbox
    Then I should see the "modal-checkbox-force-host" checkbox is checked

    When I click on the "modal-button-add" button
    Then I should not see "add-host-modal" modal
    And I should see "add-host-success" alert

    When I search for "myfirstserver.ipa.test" in the data table
    Then I should see "myfirstserver.ipa.test" entry in the data table

  @cleanup
  Scenario: Delete a host
    Given I delete host "myfirstserver"

  @test
  Scenario: Add a new host with all checkboxes set
    Given I am logged in as admin
    And I am on "hosts" page

    When I click on the "hosts-button-add" button
    Then I should see "add-host-modal" modal

    When I type in the "modal-textbox-host-name" textbox text "myfirstserver"
    Then I should see "myfirstserver" in the "modal-textbox-host-name" textbox

    When I type in the "modal-textbox-host-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-host-description" textbox

    When I type in the "modal-textbox-host-class" textbox text "test class"
    Then I should see "test class" in the "modal-textbox-host-class" textbox

    When I click on the "modal-checkbox-force-host" checkbox
    Then I should see the "modal-checkbox-force-host" checkbox is checked

    When I click on the "modal-checkbox-generate-otp" checkbox
    Then I should see the "modal-checkbox-generate-otp" checkbox is checked

    When I click on the "modal-checkbox-suppress-membership" checkbox
    Then I should see the "modal-checkbox-suppress-membership" checkbox is checked

    When I click on the "modal-button-add" button
    Then I should not see "add-host-modal" modal
    And I should see "add-host-success" alert

    When I search for "myfirstserver.ipa.test" in the data table
    Then I should see "myfirstserver.ipa.test" entry in the data table

  @cleanup
  Scenario: Delete a host
    Given I delete host "myfirstserver"

  @test
  Scenario: Add a new host with 'Force' unchecked is expected to fail
    Given I am logged in as admin
    And I am on "hosts" page

    When I click on the "hosts-button-add" button
    Then I should see "add-host-modal" modal

    When I type in the "modal-textbox-host-name" textbox text "forcehost"
    Then I should see "forcehost" in the "modal-textbox-host-name" textbox

    When I click on the "modal-button-add" button
    Then I should see "add-host-modal-error" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "add-host-modal-error" modal
    And I should see "add-host-modal" modal

    When I click on the "modal-button-cancel" button
    Then I should not see "add-host-modal" modal

    When I search for "forcehost.ipa.test" in the data table
    Then I should not see "forcehost.ipa.test" entry in the data table

  @test
  Scenario: Add one host after another
    Given I am logged in as admin
    And I am on "hosts" page

    When I click on the "hosts-button-add" button
    Then I should see "add-host-modal" modal

    When I type in the "modal-textbox-host-name" textbox text "myfirstserver"
    Then I should see "myfirstserver" in the "modal-textbox-host-name" textbox

    When I click on the "modal-checkbox-force-host" checkbox
    Then I should see the "modal-checkbox-force-host" checkbox is checked

    When I click on the "modal-button-add-and-add-another" button
    Then I should see "add-host-modal" modal
    And I should see "add-host-success" alert

    When I type in the "modal-textbox-host-name" textbox text "mysecondserver"
    Then I should see "mysecondserver" in the "modal-textbox-host-name" textbox

    When I click on the "modal-checkbox-force-host" checkbox
    Then I should see the "modal-checkbox-force-host" checkbox is checked

    When I click on the "modal-button-add" button
    Then I should see "add-host-modal" modal
    And I should see "add-host-success" alert

    When I search for "myfirstserver.ipa.test" in the data table
    Then I should see "myfirstserver.ipa.test" entry in the data table

    When I search for "mysecondserver.ipa.test" in the data table
    Then I should see "mysecondserver.ipa.test" entry in the data table

  @cleanup
  Scenario: Delete hosts
    Given I delete host "myfirstserver"
    And I delete host "mysecondserver"

  @test
  Scenario: Rebuild auto membership
    Given I am logged in as admin
    And I am on "hosts" page

    When I click on the "hosts-kebab" kebab menu
    Then I should see "hosts-kebab" kebab menu expanded

    When I click on the "hosts-kebab-rebuild-auto-membership" button
    Then I should see "hosts-rebuild-auto-membership-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "hosts-rebuild-auto-membership-modal" modal
    And I should see "rebuild-automember-success" alert

  @seed
  Scenario: Create hosts
    Given host "myfirstserver" exists

  @test
  Scenario: Delete a host
    Given I am logged in as admin
    And I am on "hosts" page

    When I select entry "myfirstserver.ipa.test" in the data table
    Then I should see "myfirstserver.ipa.test" entry selected in the data table

    When I click on the "hosts-button-delete" button
    Then I should see "delete-hosts-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-hosts-modal" modal
    And I should see "remove-hosts-success" alert

    When I search for "myfirstserver.ipa.test" in the data table
    Then I should not see "myfirstserver.ipa.test" entry in the data table

  @seed
  Scenario: Create hosts
    Given host "myfirstserver" exists
    And host "mysecondserver" exists

  @test
  Scenario: Delete many hosts
    Given I am logged in as admin
    And I am on "hosts" page

    When I select entry "myfirstserver.ipa.test" in the data table
    Then I should see "myfirstserver.ipa.test" entry selected in the data table

    When I select entry "mysecondserver.ipa.test" in the data table
    Then I should see "mysecondserver.ipa.test" entry selected in the data table

    When I click on the "hosts-button-delete" button
    Then I should see "delete-hosts-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-hosts-modal" modal
    And I should see "remove-hosts-success" alert

    When I search for "myfirstserver.ipa.test" in the data table
    Then I should not see "myfirstserver.ipa.test" entry in the data table

    When I search for "mysecondserver.ipa.test" in the data table
    Then I should not see "mysecondserver.ipa.test" entry in the data table

  @test
  Scenario: Cancel creation of a host
    Given I am logged in as admin
    And I am on "hosts" page

    When I click on the "hosts-button-add" button
    Then I should see "add-host-modal" modal

    When I type in the "modal-textbox-host-name" textbox text "myfirstserver"
    Then I should see "myfirstserver" in the "modal-textbox-host-name" textbox

    When I click on the "modal-checkbox-force-host" checkbox
    Then I should see the "modal-checkbox-force-host" checkbox is checked

    When I click on the "modal-button-cancel" button
    Then I should not see "add-host-modal" modal

    When I search for "myfirstserver.ipa.test" in the data table
    Then I should not see "myfirstserver.ipa.test" entry in the data table
