Feature: Netgroup settings manipulation
    Modify a netgroup

    @seed
    Scenario: Create netgroup
        Given netgroup "netgroup1" exists

    @test
    Scenario: Set Description
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I type in the "netgroups-tab-settings-textbox-description" textbox text "test"
        Then I should see "test" in the "netgroups-tab-settings-textbox-description" textbox
        And I should see the "netgroups-tab-settings-button-save" button is enabled

        When I click on the "netgroups-tab-settings-button-save" button
        Then I should see "save-success" alert

    @cleanup
    Scenario: Cleanup netgroup
        Given I delete netgroup "netgroup1"

    @seed
    Scenario: Create netgroup
        Given netgroup "netgroup1" exists

    @test
    Scenario: Set NIS domain name
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I type in the "netgroups-tab-settings-textbox-nisdomainname" textbox text "newNIS"
        Then I should see "newNIS" in the "netgroups-tab-settings-textbox-nisdomainname" textbox
        And I should see the "netgroups-tab-settings-button-save" button is enabled

        When I click on the "netgroups-tab-settings-button-save" button
        Then I should see "save-success" alert
        And I should see "newNIS" in the "netgroups-tab-settings-textbox-nisdomainname" textbox

    @cleanup
    Scenario: Cleanup netgroup
        Given I delete netgroup "netgroup1"

    @seed
    Scenario: Create netgroup
        Given netgroup "netgroup1" exists

    @test
    Scenario: Add user to User category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-users" tab
        Then I should see "netgroups-tab-settings-tab-users" tab

        When I click on the "settings-button-add-user" button
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
        And I should see "admin" entry in the data table

    @cleanup
    Scenario: Cleanup user "admin"
        Given I delete element "user" named "admin" from netgroup "netgroup1"

    @seed
    Scenario: Add user "admin"
        Given I have element "user" named "admin" in netgroup "netgroup1"

    @test
    Scenario: Remove user from User category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-users" tab
        Then I should see "netgroups-tab-settings-tab-users" tab
        And I should see "admin" entry in the data table

        When I select entry "admin" in the settings data table "user"
        Then I should see "admin" entry selected in the data table

        When I click on the "settings-button-delete-user" button
        Then I should see "remove-netgroup-members-modal" modal

        When I click on the "modal-button-delete" button
        Then I should not see "remove-netgroup-members-modal" modal
        And I should see "remove-netgroups-success" alert
        And I should not see "admin" entry in the data table

    @test
    Scenario: Add group to User category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-groups" tab
        Then I should see "netgroups-tab-settings-tab-groups" tab

        When I click on the "settings-button-add-group" button
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
        And I should see "admins" entry in the data table

    @cleanup
    Scenario: Cleanup group "admins"
        Given I delete element "group" named "admins" from netgroup "netgroup1"

    @seed
    Scenario: Add group "admins"
        Given I have element "group" named "admins" in netgroup "netgroup1"

    @test
    Scenario: Remove group from User category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-groups" tab
        Then I should see "netgroups-tab-settings-tab-groups" tab
        And I should see "admins" entry in the data table

        When I select entry "admins" in the settings data table "group"
        Then I should see "admins" entry selected in the data table
        When I click on the "settings-button-delete-group" button
        Then I should see "remove-netgroup-members-modal" modal

        When I click on the "modal-button-delete" button
        Then I should not see "remove-netgroup-members-modal" modal
        And I should see "remove-netgroups-success" alert
        And I should not see "admins" entry in the data table

    @seed
    Scenario: Add a host
        Given host "my-server" exists

    @test
    Scenario: Add host to Host category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-hosts" tab
        Then I should see "netgroups-tab-settings-tab-hosts" tab

        When I click on the "settings-button-add-host" button
        Then I should see "dual-list-modal" modal

        When I click on search link in dual list
        Then I should see "item-my-server.webui.ipa.test" dual list item on the left

        When I click on "item-my-server.webui.ipa.test" dual list item
        Then I should see "item-my-server.webui.ipa.test" dual list item selected

        When I click on the "dual-list-add-selected" button
        Then I should see "item-my-server.webui.ipa.test" dual list item on the right
        And I should see "item-my-server.webui.ipa.test" dual list item not selected

        When I click on the "modal-button-add" button
        Then I should not see "dual-list-modal" modal
        And I should see "add-member-success" alert
        And I should see "my-server.webui.ipa.test" entry in the data table

    @cleanup
    Scenario: Cleanup host from Host category
        Given I delete element "host" named "my-server" from netgroup "netgroup1"

    @seed
    Scenario: Add host to Host category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-hosts" tab
        Then I should see "netgroups-tab-settings-tab-hosts" tab

        When I click on the "settings-button-add-host" button
        Then I should see "dual-list-modal" modal

        When I click on search link in dual list
        Then I should see "item-my-server.webui.ipa.test" dual list item on the left

        When I click on "item-my-server.webui.ipa.test" dual list item
        Then I should see "item-my-server.webui.ipa.test" dual list item selected

        When I click on the "dual-list-add-selected" button
        Then I should see "item-my-server.webui.ipa.test" dual list item on the right
        And I should see "item-my-server.webui.ipa.test" dual list item not selected

        When I click on the "modal-button-add" button
        Then I should not see "dual-list-modal" modal
        And I should see "add-member-success" alert
        And I should see "my-server.webui.ipa.test" entry in the data table

    @test
    Scenario: Remove host from Host category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-hosts" tab
        Then I should see "netgroups-tab-settings-tab-hosts" tab

        Then I should see "my-server.webui.ipa.test" entry in the data table
        When I select entry "my-server.webui.ipa.test" in the settings data table "host"
        Then I should see "my-server.webui.ipa.test" entry selected in the data table
        When I click on the "settings-button-delete-host" button
        Then I should see "remove-netgroup-members-modal" modal

        When I click on the "modal-button-delete" button
        Then I should not see "remove-netgroup-members-modal" modal
        And I should see "remove-netgroups-success" alert
        And I should not see "my-server.webui.ipa.test" entry in the data table

    @cleanup
    Scenario: Cleanup host
        Given I delete host "my-server"

    @test
    Scenario: Add hostgroup to Host category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-hostgroups" tab
        Then I should see "netgroups-tab-settings-tab-hostgroups" tab

        When I click on the "settings-button-add-hostgroup" button
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
        And I should see "ipaservers" entry in the data table

    @cleanup
    Scenario: Cleanup hostgroup "ipaservers"
        Given I delete element "hostgroup" named "ipaservers" from netgroup "netgroup1"

    @seed
    Scenario: Add hostgroup "ipaservers"
        Given I have element "hostgroup" named "ipaservers" in netgroup "netgroup1"

    @test
    Scenario: Remove hostgroup from Host category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-hostgroups" tab
        Then I should see "netgroups-tab-settings-tab-hostgroups" tab

        Then I should see "ipaservers" entry in the data table
        When I select entry "ipaservers" in the settings data table "hostgroup"
        Then I should see "ipaservers" entry selected in the data table
        When I click on the "settings-button-delete-hostgroup" button
        Then I should see "remove-netgroup-members-modal" modal

        When I click on the "modal-button-delete" button
        Then I should not see "remove-netgroup-members-modal" modal
        And I should see "remove-netgroups-success" alert
        And I should not see "ipaservers" entry in the data table

    @test
    Scenario: Add external host to Host category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-externalhosts" tab
        Then I should see "netgroups-tab-settings-tab-externalhosts" tab

        When I click on the "settings-button-add-externalHost" button
        Then I should see "add-external-host-modal" modal

        When I type in the "modal-textbox-external-host-name" textbox text "test.test.test"
        Then I should see "test.test.test" in the "modal-textbox-external-host-name" textbox
        When I click on the "modal-button-add" button
        Then I should not see "add-external-host-modal" modal
        And I should see "add-member-success" alert
        And I should see "test.test.test" entry in the data table

    @cleanup
    Scenario: Cleanup external host "test.test.test"
        Given I delete external host "test.test.test" from netgroup "netgroup1"

    @seed
    Scenario: Add external host "test.test.test"
        Given I have external host "test.test.test" in netgroup "netgroup1"

    @test
    Scenario: Remove external host from Host category
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-tab-externalhosts" tab
        Then I should see "netgroups-tab-settings-tab-externalhosts" tab

        Then I should see "test.test.test" entry in the data table
        When I select entry "test.test.test" in the settings data table "externalHost"
        Then I should see "test.test.test" entry selected in the data table
        When I click on the "settings-button-delete-externalHost" button
        Then I should see "remove-netgroup-members-modal" modal

        When I click on the "modal-button-delete" button
        Then I should not see "remove-netgroup-members-modal" modal
        And I should see "remove-netgroups-success" alert
        And I should not see "test.test.test" entry in the data table

    @test
    Scenario: Toggle user category allow anyone
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-checkbox-usercategory" checkbox
        Then I should not see "netgroups-tab-settings-tab-users" tab
        And I should not see "netgroups-tab-settings-tab-groups" tab

    @test
    Scenario: Toggle host category allow any host
        Given I am logged in as admin
        And I am on "netgroups/netgroup1" page

        When I click on the "netgroups-tab-settings-checkbox-hostcategory" checkbox
        Then I should not see "netgroups-tab-settings-tab-hosts" tab
        And I should not see "netgroups-tab-settings-tab-hostgroups" tab

    @cleanup
    Scenario: Cleanup netgroup
        Given I delete netgroup "netgroup1"
