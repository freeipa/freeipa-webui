Feature: System account manipulation
  Create, disable, enable, delete system accounts

  @test
  Scenario: Add a new system account
    Given I am logged in as admin
    And I am on "system-accounts" page

    When I click on the "system-accounts-button-add" button
    Then I should see "add-sysaccount-modal" modal

    When I type in the "modal-textbox-sysaccount-id" textbox text "test_sysaccount"
    Then I should see "test_sysaccount" in the "modal-textbox-sysaccount-id" textbox

    When I type in the "modal-textbox-description" textbox text "Test system account"
    Then I should see "Test system account" in the "modal-textbox-description" textbox

    When I type in the "modal-textbox-new-password" textbox text "Secret123"
    Then I should see "Secret123" in the "modal-textbox-new-password" textbox

    When I type in the "modal-textbox-verify-password" textbox text "Secret123"
    Then I should see "Secret123" in the "modal-textbox-verify-password" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sysaccount-modal" modal
    And I should see "add-sysaccount-success" alert

    When I search for "test_sysaccount" in the data table
    Then I should see "test_sysaccount" entry in the data table

  @cleanup
  Scenario: Delete system account test_sysaccount
    Given I delete system account "test_sysaccount"

  @test
  Scenario: Add a new system account with privileged flag
    Given I am logged in as admin
    And I am on "system-accounts" page

    When I click on the "system-accounts-button-add" button
    Then I should see "add-sysaccount-modal" modal

    When I type in the "modal-textbox-sysaccount-id" textbox text "priv_sysaccount"
    Then I should see "priv_sysaccount" in the "modal-textbox-sysaccount-id" textbox

    When I click on the "modal-checkbox-privileged" checkbox

    When I type in the "modal-textbox-new-password" textbox text "Secret123"
    Then I should see "Secret123" in the "modal-textbox-new-password" textbox

    When I type in the "modal-textbox-verify-password" textbox text "Secret123"
    Then I should see "Secret123" in the "modal-textbox-verify-password" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-sysaccount-modal" modal
    And I should see "add-sysaccount-success" alert

    When I search for "priv_sysaccount" in the data table
    Then I should see "priv_sysaccount" entry in the data table

  @cleanup
  Scenario: Delete system account priv_sysaccount
    Given I delete system account "priv_sysaccount"

  @seed
  Scenario: Create system account for deletion test
    Given system account "del_sysaccount" exists with password "Secret123"

  @test
  Scenario: Delete a single system account
    Given I am logged in as admin
    And I am on "system-accounts" page

    When I search for "del_sysaccount" in the data table
    Then I should see "del_sysaccount" entry in the data table

    When I select entry "del_sysaccount" in the data table
    Then I should see "del_sysaccount" entry selected in the data table

    When I click on the "system-accounts-button-delete" button
    Then I should see "delete-sysaccounts-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sysaccounts-modal" modal
    And I should see "remove-sysaccounts-success" alert

    When I search for "del_sysaccount" in the data table
    Then I should not see "del_sysaccount" entry in the data table

  @seed
  Scenario: Create system accounts for multiple deletion test
    Given system account "del_sysaccount_1" exists with password "Secret123"
    And system account "del_sysaccount_2" exists with password "Secret123"

  @test
  Scenario: Delete multiple system accounts
    Given I am logged in as admin
    And I am on "system-accounts" page

    When I search for "del_sysaccount_1" in the data table
    Then I should see "del_sysaccount_1" entry in the data table
    When I select entry "del_sysaccount_1" in the data table
    Then I should see "del_sysaccount_1" entry selected in the data table

    When I search for "del_sysaccount_2" in the data table
    Then I should see "del_sysaccount_2" entry in the data table
    When I select entry "del_sysaccount_2" in the data table
    Then I should see "del_sysaccount_2" entry selected in the data table

    When I click on the "system-accounts-button-delete" button
    Then I should see "delete-sysaccounts-modal" modal

    When I click on the "modal-button-delete" button
    Then I should not see "delete-sysaccounts-modal" modal
    And I should see "remove-sysaccounts-success" alert

    When I search for "del_sysaccount_1" in the data table
    Then I should not see "del_sysaccount_1" entry in the data table

    When I search for "del_sysaccount_2" in the data table
    Then I should not see "del_sysaccount_2" entry in the data table

  @seed
  Scenario: Create system account for disable test
    Given system account "dis_sysaccount" exists with password "Secret123"

  @test
  Scenario: Disable a system account
    Given I am logged in as admin
    And I am on "system-accounts" page

    When I search for "dis_sysaccount" in the data table
    Then I should see "dis_sysaccount" entry in the data table

    When I select entry "dis_sysaccount" in the data table
    Then I should see "dis_sysaccount" entry selected in the data table

    When I click on the "system-accounts-button-disable" button
    Then I should see "system-accounts-enable-disable-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "system-accounts-enable-disable-modal" modal

    When I search for "dis_sysaccount" in the data table
    Then I should see "dis_sysaccount" entry in the data table
    And I should see "dis_sysaccount" system account in the data table disabled

  @cleanup
  Scenario: Delete system account dis_sysaccount
    Given I delete system account "dis_sysaccount"

  @seed
  Scenario: Create disabled system account for enable test
    Given disabled system account "en_sysaccount" exists with password "Secret123"

  @test
  Scenario: Re-enable a system account
    Given I am logged in as admin
    And I am on "system-accounts" page

    When I search for "en_sysaccount" in the data table
    Then I should see "en_sysaccount" entry in the data table

    When I select entry "en_sysaccount" in the data table
    Then I should see "en_sysaccount" entry selected in the data table

    When I click on the "system-accounts-button-enable" button
    Then I should see "system-accounts-enable-disable-modal" modal

    When I click on the "modal-button-ok" button
    Then I should not see "system-accounts-enable-disable-modal" modal

    When I search for "en_sysaccount" in the data table
    Then I should see "en_sysaccount" entry in the data table
    And I should see "en_sysaccount" system account in the data table enabled

  @cleanup
  Scenario: Delete system account en_sysaccount
    Given I delete system account "en_sysaccount"
