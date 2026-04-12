Feature: DNS Forward Zones Settings
    Configure DNS forward zones settings

    @seed
    Scenario: Create a new DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"

    @test
    Scenario: Change forwarder
        Given I am logged in as admin
        And I am on "dns-forward-zones/my-dnsforwardzone." page

        When I type in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0" textbox text "8.8.4.4"
        Then I should see "8.8.4.4" in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0" textbox

        When I click on the "dns-forward-zones-tab-settings-button-save" button
        Then I should see "8.8.4.4" in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0" textbox
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @seed
    Scenario: Create a new DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"

    @test
    Scenario: Change forwarder port
        Given I am logged in as admin
        And I am on "dns-forward-zones/my-dnsforwardzone." page

        When I type in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0-port" textbox text "53"
        Then I should see "53" in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0-port" textbox

        When I click on the "dns-forward-zones-tab-settings-button-save" button
        Then I should see "8.8.8.8" in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0" textbox
        Then I should see "53" in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0-port" textbox
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @seed
    Scenario: Create a new DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"

    @test
    Scenario: Add another forwarder
        Given I am logged in as admin
        And I am on "dns-forward-zones/my-dnsforwardzone." page

        When I click on the "dns-forward-zones-tab-settings-textbox-idnsforwarders-add-button" button
        Then I should see the "dns-forward-zones-tab-settings-textbox-idnsforwarders-1" textbox is empty

        When I type in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-1" textbox text "8.8.4.4"
        Then I should see "8.8.4.4" in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-1" textbox

        When I click on the "dns-forward-zones-tab-settings-button-save" button
        Then I should see "8.8.8.8" in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0" textbox
        Then I should see "8.8.4.4" in the "dns-forward-zones-tab-settings-textbox-idnsforwarders-1" textbox
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @seed
    Scenario: Create a new DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"

    @test
    Scenario: No forwarders fails
        Given I am logged in as admin
        And I am on "dns-forward-zones/my-dnsforwardzone." page

        When I click on the "dns-forward-zones-tab-settings-textbox-idnsforwarders-0-delete-button" button
        Then I should not see "dns-forward-zones-tab-settings-textbox-idnsforwarders-0" element

        When I click on the "dns-forward-zones-tab-settings-button-save" button
        Then I should see "error" alert

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @seed
    Scenario: Create a new DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"

    @test
    Scenario: Change Forward policy to "Forward only"
        Given I am logged in as admin
        And I am on "dns-forward-zones/my-dnsforwardzone." page

        When I click on the "dns-forward-zones-tab-settings-radio-forward-only" radio button
        Then I should see the "dns-forward-zones-tab-settings-radio-forward-only" radio button is selected

        When I click on the "dns-forward-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @seed
    Scenario: Create a new DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"

    @test
    Scenario: Change Forward policy to "Forwarding disabled"
        Given I am logged in as admin
        And I am on "dns-forward-zones/my-dnsforwardzone." page

        When I click on the "dns-forward-zones-tab-settings-radio-forwarding-disabled" radio button
        Then I should see the "dns-forward-zones-tab-settings-radio-forwarding-disabled" radio button is selected

        When I click on the "dns-forward-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"
