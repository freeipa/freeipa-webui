Feature: Hbac rule settings manipulation
  Modify a Hbac rule

  @seed
  Scenario: Add a new rule
    Given rule "rule1" exists

  @test
  Scenario: Add user to Who category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page
    
    When I click on the "hbac-rules-tab-settings-tab-users" tab
    Then I click on the "settings-button-add-user" button
    Then I should see "dual-list-modal" modal
    
    When I click on search link in dual list
    Then I should see "item-admin" dual list item on the left

    When I click on "item-admin" dual list item
    Then I should see "item-admin" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-admin" dual list item on the right
    And I should see "item-admin" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "admin" entry in the data table

  @cleanup
  Scenario: Delete the user for cleanup
    Given I delete element "user" named "admin" from rule "rule1"

  @seed
  Scenario: Add a user to the rule
    Given I have element "user" named "admin" in rule "rule1"

  @test
  Scenario: Remove user from Who category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-users" tab
    Then I should see "admin" entry in the data table
    When I select entry "admin" in the settings data table "user"
    When I click on the "settings-button-delete-user" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "admin" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "admin" entry in the data table

  @test
  Scenario: Add group to Who category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-groups" tab
    Then I click on the "settings-button-add-group" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-admins" dual list item on the left

    When I click on "item-admins" dual list item
    Then I should see "item-admins" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-admins" dual list item on the right
    And I should see "item-admins" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "admins" entry in the data table

  @cleanup
  Scenario: Delete the group for cleanup
    Given I delete element "group" named "admins" from rule "rule1"

  @seed
  Scenario: Add a group to the rule
    Given I have element "group" named "admins" in rule "rule1"

  @test
  Scenario: Remove group from Who category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-groups" tab
    Then I should see "admins" entry in the data table
    When I select entry "admins" in the settings data table "group"
    When I click on the "settings-button-delete-group" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "admins" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "admins" entry in the data table

  @test
  Scenario: Set User category to allow all users
    # When enabling "Allow anyone" all members need to be removed otherwise
    # the update fails
    # 1) Add a user and group to the tables
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page
    When I click on the "hbac-rules-tab-settings-tab-users" tab
    Then I click on the "settings-button-add-user" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-admin" dual list item on the left

    When I click on "item-admin" dual list item
    Then I should see "item-admin" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-admin" dual list item on the right
    And I should see "item-admin" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "admin" entry in the data table

    When I click on the "hbac-rules-tab-settings-tab-groups" tab
    Then I click on the "settings-button-add-group" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-admins" dual list item on the left

    When I click on "item-admins" dual list item
    Then I should see "item-admins" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-admins" dual list item on the right
    And I should see "item-admins" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "admins" entry in the data table

    When I click on the "hbac-rules-tab-settings-checkbox-usercategory" checkbox
    Then I should not see "hbac-rules-tab-settings-tab-users" tab
    Then I should not see "hbac-rules-tab-settings-tab-groups" tab

  @seed
  Scenario: Add a new host that will be used in the tests
    Given host "my-new-host" exists

  @test
  Scenario: Add host to Host category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-hosts" tab
    Then I click on the "settings-button-add-host" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item on the left

    When I click on "item-my-new-host.dom-server.ipa.demo" dual list item
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item on the right
    And I should see "item-my-new-host.dom-server.ipa.demo" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "my-new-host.dom-server.ipa.demo" entry in the data table

  @cleanup
  Scenario: Delete the host from the rule
    Given I delete host "my-new-host" from rule "rule1"

  @seed
  Scenario: Add a host to the rule
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-hosts" tab
    Then I click on the "settings-button-add-host" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item on the left

    When I click on "item-my-new-host.dom-server.ipa.demo" dual list item
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item on the right
    And I should see "item-my-new-host.dom-server.ipa.demo" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "my-new-host.dom-server.ipa.demo" entry in the data table

  @test
  Scenario: Remove host from Host category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-hosts" tab
    Then I should see "my-new-host.dom-server.ipa.demo" entry in the data table
    When I select entry "my-new-host.dom-server.ipa.demo" in the settings data table "host"
    When I click on the "settings-button-delete-host" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "my-new-host.dom-server.ipa.demo" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "my-new-host.dom-server.ipa.demo" entry in the data table

  @test
  Scenario: Add hostgroup to Host category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-hostgroups" tab
    Then I click on the "settings-button-add-hostgroup" button
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
    And I should see "add-member-success" alert
    Then I should see "ipaservers" entry in the data table

  @cleanup
  Scenario: Delete the hostgroup from the rule
    Given I delete element "hostgroup" named "ipaservers" from rule "rule1"

  @seed
  Scenario: Add a hostgroup to the rule
    Given I have element "hostgroup" named "ipaservers" in rule "rule1"
 
  @test
  Scenario: Remove hostgroup from Host category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-hostgroups" tab
    Then I should see "ipaservers" entry in the data table
    When I select entry "ipaservers" in the settings data table "hostgroup"
    When I click on the "settings-button-delete-hostgroup" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "ipaservers" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "ipaservers" entry in the data table

  @test
  Scenario: Set Host category to allow all hosts
    # This is the same test as above but for the host category
    # 1) Add a host and host group to the tables
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-hosts" tab
    Then I click on the "settings-button-add-host" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item on the left

    When I click on "item-my-new-host.dom-server.ipa.demo" dual list item
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-my-new-host.dom-server.ipa.demo" dual list item on the right
    And I should see "item-my-new-host.dom-server.ipa.demo" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "my-new-host.dom-server.ipa.demo" entry in the data table

    When I click on the "hbac-rules-tab-settings-tab-hostgroups" tab
    Then I click on the "settings-button-add-hostgroup" button
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
    And I should see "add-member-success" alert
    Then I should see "ipaservers" entry in the data table

    # 2) Set the category to 'all'
    When I click on the "hbac-rules-tab-settings-checkbox-hostcategory" checkbox
    Then I should not see "hbac-rules-tab-settings-tab-hosts" tab
    Then I should not see "hbac-rules-tab-settings-tab-hostgroups" tab

  @cleanup
  Scenario: Delete host for cleanup
    Given I delete host "my-new-host"

  @test
  Scenario: Add service to Service category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-services" tab
    Then I click on the "settings-button-add-hbacsvc" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-crond" dual list item on the left

    When I click on "item-crond" dual list item
    Then I should see "item-crond" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-crond" dual list item on the right
    And I should see "item-crond" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "crond" entry in the data table

  @cleanup
  Scenario: Delete the service from the rule
    Given I delete service "crond" from rule "rule1"

  @seed
  Scenario: Add a service to the rule
    Given I have service "crond" in rule "rule1"

  @test
  Scenario: Remove service from Service category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-services" tab
    Then I should see "crond" entry in the data table
    When I select entry "crond" in the settings data table "hbacsvc"
    When I click on the "settings-button-delete-hbacsvc" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "crond" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "crond" entry in the data table

  @test
  Scenario: Add service group to Service category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-servicegroups" tab
    Then I click on the "settings-button-add-hbacsvcgroup" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-ftp" dual list item on the left

    When I click on "item-ftp" dual list item
    Then I should see "item-ftp" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-ftp" dual list item on the right
    And I should see "item-ftp" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "ftp" entry in the data table

  @cleanup
  Scenario: Delete the service group from the rule
    Given I delete servicegroup "ftp" from rule "rule1"

  @seed
  Scenario: Add a service group to the rule
    Given I have servicegroup "ftp" in rule "rule1"

  @test
  Scenario: Remove service group from Service category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-servicegroups" tab
    Then I should see "ftp" entry in the data table 
    When I select entry "ftp" in the settings data table "hbacsvcgroup"
    When I click on the "settings-button-delete-hbacsvcgroup" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "ftp" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "ftp" entry in the data table

  @test
  Scenario: Set Service category to allow all services
    # 1) Add a service and service group to the tables
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "hbac-rules-tab-settings-tab-services" tab
    Then I click on the "settings-button-add-hbacsvc" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-crond" dual list item on the left

    When I click on "item-crond" dual list item
    Then I should see "item-crond" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-crond" dual list item on the right
    And I should see "item-crond" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "crond" entry in the data table

    When I click on the "hbac-rules-tab-settings-tab-servicegroups" tab
    Then I click on the "settings-button-add-hbacsvcgroup" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "item-ftp" dual list item on the left

    When I click on "item-ftp" dual list item
    Then I should see "item-ftp" dual list item selected

    When I click on the "dual-list-add-selected" button
    Then I should see "item-ftp" dual list item on the right
    And I should see "item-ftp" dual list item not selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "ftp" entry in the data table

    When I click on the "hbac-rules-tab-settings-checkbox-servicecategory" checkbox
    Then I should not see "hbac-rules-tab-settings-tab-services" tab
    Then I should not see "hbac-rules-tab-settings-tab-servicegroups" tab

  @cleanup
  Scenario: Delete the HBAC rule for cleanup
    Given I delete rule "rule1"
