Feature: DNS Servers
    Configure DNS servers

    @test
    Scenario: Change SOA name
        Given I am logged in as admin
        And I am on "dns-servers/webui.ipa.test" page

        When I change SOA name to "my-soa-name"
        Then I should see "my-soa-name" in the "dns-servers-tab-settings-textbox-idnssoamname" textbox

        When I click on the "dns-servers-tab-settings-button-save" button
        Then I should see "my-soa-name" in the "dns-servers-tab-settings-textbox-idnssoamname" textbox
        And I should see "success" alert

    @test
    Scenario: Add new forwarder
        Given I am logged in as admin
        And I am on "dns-servers/webui.ipa.test" page

        When I add new forwarder to "192.168.44.66"
        Then I should see "192.168.44.66" in the "dns-servers-tab-settings-textbox-idnsforwarders" textbox list

        When I click on the "dns-servers-tab-settings-button-save" button
        Then I should see "192.168.44.66" in the "dns-servers-tab-settings-textbox-idnsforwarders" textbox list
        And I should see "success" alert

    @test
    Scenario: Remove forwarder
        Given I am logged in as admin
        And I am on "dns-servers/webui.ipa.test" page

        When I remove forwarder "192.168.44.66"
        Then I should not see "192.168.44.66" in the "dns-servers-tab-settings-textbox-idnsforwarders" textbox list

        When I click on the "dns-servers-tab-settings-button-save" button
        Then I should not see "192.168.44.66" in the "dns-servers-tab-settings-textbox-idnsforwarders" textbox list
        And I should see "success" alert

    @test
    Scenario: Select forward policy
        Given I am logged in as admin
        And I am on "dns-servers/webui.ipa.test" page

        When I click on the "dns-zone-tab-settings-radio-forward-first" radio button
        Then I should see the "dns-zone-tab-settings-radio-forward-first" radio button is selected

        When I click on the "dns-servers-tab-settings-button-save" button
        Then I should see the "dns-zone-tab-settings-radio-forward-first" radio button is selected
        And I should see "success" alert

    @cleanup
    Scenario: Set DNS server to default values
        Given I am logged in as admin
        And I am on "dns-servers/webui.ipa.test" page

        When I change SOA name to "webui.ipa.test"
        Then I should see "webui.ipa.test" in the "dns-servers-tab-settings-textbox-idnssoamname" textbox

        When I click on the "dns-zone-tab-settings-radio-forward-only" radio button
        Then I should see the "dns-zone-tab-settings-radio-forward-only" radio button is selected

        When I click on the "dns-servers-tab-settings-button-save" button
        Then I should see "webui.ipa.test" in the "dns-servers-tab-settings-textbox-idnssoamname" textbox
        And I should see the "dns-zone-tab-settings-radio-forward-only" radio button is selected
        And I should see "success" alert
