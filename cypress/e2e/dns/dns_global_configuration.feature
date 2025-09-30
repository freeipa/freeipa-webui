Feature: DNS Global Configuration
    Configure DNS global settings

    @test
    Scenario: Set PTR sync
        Given I am logged in as admin
        And I am on "dns-global-config" page

        When I click on the "dns-global-config-checkbox-allow-ptr-sync" checkbox
        Then I should see the "dns-global-config-checkbox-allow-ptr-sync" checkbox is checked

        When I click on the "dns-global-config-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Add global forwarders
        Given I am logged in as admin
        And I am on "dns-global-config" page

        When I add "192.168.45.47" to "dns-global-config-textbox-forwarders" textbox list
        Then I should see "192.168.45.47" in the "dns-global-config-textbox-forwarders" textbox list

        When I add "192.168.77.88" to "dns-global-config-textbox-forwarders" textbox list
        Then I should see "192.168.77.88" in the "dns-global-config-textbox-forwarders" textbox list

        Given I intercept the "dnsconfig_mod" API call
        When I click on the "dns-global-config-button-save" button
        Then I should wait for the API call to finish
        Then I should see "success" alert

    @test
    Scenario: Change forward policy
        Given I am logged in as admin
        And I am on "dns-global-config" page

        When I click on the "dns-zone-tab-settings-radio-forward-only" radio button
        Then I should see the "dns-zone-tab-settings-radio-forward-only" radio button is selected

        When I click on the "dns-global-config-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Reset values to default
        Given I am logged in as admin
        And I am on "dns-global-config" page

        When I click on the "dns-global-config-checkbox-allow-ptr-sync" checkbox
        Then I should see the "dns-global-config-checkbox-allow-ptr-sync" checkbox is unchecked

        When I remove all elements from the "dns-global-config-textbox-forwarders" textbox list
        Then I should see the "dns-global-config-textbox-forwarders" textbox list is empty

        When I click on the "dns-zone-tab-settings-radio-forwarding-disabled" radio button
        Then I should see the "dns-zone-tab-settings-radio-forwarding-disabled" radio button is selected

        When I click on the "dns-global-config-button-save" button
        Then I should see "success" alert
