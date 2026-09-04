Feature: Hostgroup members
  Manage host group members across Hosts and Host groups tabs

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists

  @test
  Scenario: Add a Host member into the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/member_host" page

    Then I should see the host groups members tab "host" count is "0"

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "member-of-add-modal" modal with title "Assign hosts to host group: a-hostgroup"
    And I should see "item-webui.ipa.test" dual list item on the left

    When I click on "item-webui.ipa.test" dual list item
    Then I should see "item-webui.ipa.test" dual list item selected
    When I click on the "dual-list-add-selected" button
    Then I should see "item-webui.ipa.test" dual list item on the right

    When I click on the "modal-button-add" button
    Then I should not see "member-of-add-modal" modal
    And I should see "add-member-success" alert

    When I search for "webui.ipa.test" in the members table
    Then I should see "webui.ipa.test" entry in the data table
    And I should see the host groups members tab "host" count is "1"

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And host "webui.ipa.test" is member of hostgroup "a-hostgroup"

  @test
  Scenario: Search for a host
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/member_host" page

    When I type "webui" in the members table search field
    Then I should see "webui" in the members table search field
    When I submit the members table search
    Then I should see "webui.ipa.test" entry in the data table
    And I should not see "ipaservers" entry in the data table

    When I clear the members table search field
    When I type "notthere" in the members table search field
    Then I should see "notthere" in the members table search field
    When I submit the members table search
    Then I should not see "webui.ipa.test" entry in the data table
    And I should not see "ipaservers" entry in the data table

    When I clear the members table search field
    When I submit the members table search
    Then I should see "webui.ipa.test" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists

  @test
  Scenario: Switch between direct and indirect memberships (Hosts)
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/member_host" page

    When I click on the "member-of-toggle-group-item-indirect" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is pressed
    And I should see the "member-of-button-add" button is disabled
    And I should see the host groups members tab "host" count is "0"

    When I click on the "member-of-toggle-group-item-direct" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is not pressed
    And I should see the "member-of-toggle-group-item-direct" toggle button is pressed
    And I should see the "member-of-button-add" button is enabled
    And I should see the host groups members tab "host" count is "0"

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And host "webui.ipa.test" is member of hostgroup "a-hostgroup"

  @test
  Scenario: Remove Host from the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/member_host" page

    When I select entry "webui.ipa.test" in the members table
    Then I should see "webui.ipa.test" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal
    And I should see "member-of-delete-modal" modal with title "Delete hosts from host group: a-hostgroup"

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-host-success" alert

    When I search for "webui.ipa.test" in the members table
    Then I should not see "webui.ipa.test" entry in the data table
    And I should see the host groups members tab "host" count is "0"

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists

  @test
  Scenario: Add a Host group member into the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/member_hostgroup" page

    Then I should see the host groups members tab "hostgroup" count is "0"

    When I click on the "member-of-button-add" button
    Then I should see "member-of-add-modal" modal
    And I should see "member-of-add-modal" modal with title "Assign host groups to host group: a-hostgroup"
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
    And I should see the host groups members tab "hostgroup" count is "1"

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And hostgroup "nested-hostgroup" exists
    And hostgroup "nested-hostgroup" is member of hostgroup "a-hostgroup"

  @test
  Scenario: Search for a host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/member_hostgroup" page

    When I type "nested-hostgroup" in the members table search field
    Then I should see "nested-hostgroup" in the members table search field
    When I submit the members table search
    Then I should see "nested-hostgroup" entry in the data table
    And I should not see "ipaservers" entry in the data table

    When I clear the members table search field
    When I type "notthere" in the members table search field
    Then I should see "notthere" in the members table search field
    When I submit the members table search
    Then I should not see "nested-hostgroup" entry in the data table
    And I should not see "ipaservers" entry in the data table

    When I clear the members table search field
    When I submit the members table search
    Then I should see "nested-hostgroup" entry in the data table

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"
    And I delete hostgroup "nested-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists

  @test
  Scenario: Switch between direct and indirect memberships (Host groups)
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/member_hostgroup" page

    When I click on the "member-of-toggle-group-item-indirect" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is pressed
    And I should see the "member-of-button-add" button is disabled
    And I should see the host groups members tab "hostgroup" count is "0"

    When I click on the "member-of-toggle-group-item-direct" button
    Then I should see the "member-of-toggle-group-item-indirect" toggle button is not pressed
    And I should see the "member-of-toggle-group-item-direct" toggle button is pressed
    And I should see the "member-of-button-add" button is enabled
    And I should see the host groups members tab "hostgroup" count is "0"

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"

  @seed
  Scenario: Create seed data
    Given hostgroup "a-hostgroup" exists
    And hostgroup "ipaservers" is member of hostgroup "a-hostgroup"

  @test
  Scenario: Remove Host group from the host group
    Given I am logged in as admin
    And I am on "host-groups/a-hostgroup/member_hostgroup" page

    When I select entry "ipaservers" in the members table
    Then I should see "ipaservers" entry selected in the data table

    When I click on the "member-of-button-delete" button
    Then I should see "member-of-delete-modal" modal
    And I should see "member-of-delete-modal" modal with title "Delete host groups from host group: a-hostgroup"

    When I click on the "modal-button-delete" button
    Then I should not see "member-of-delete-modal" modal
    And I should see "remove-hostgroups-success" alert

    When I search for "ipaservers" in the members table
    Then I should not see "ipaservers" entry in the data table
    And I should see the host groups members tab "hostgroup" count is "0"

  @cleanup
  Scenario: Cleanup seed data
    Given I delete hostgroup "a-hostgroup"
