Feature: DNS Forward Zones
    Create, delete, enable and disable DNS forward zones

    @test
    Scenario: Create a new DNS forward zone (8.8.8.8)
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I click on the "dns-forward-zones-add" button
        Then I should see "add-dns-forward-zone-modal" modal

        When I type in the "modal-textbox-dns-zone-name" textbox text "my-dnsforwardzone"
        Then I should see "my-dnsforwardzone" in the "modal-textbox-dns-zone-name" textbox
        Then I should see the "modal-button-add" button is disabled

        When I click on the "modal-textbox-forwarders-add-button" button
        Then I should see the "modal-textbox-forwarders-0" textbox is empty

        When I type in the "modal-textbox-forwarders-0" textbox text "8.8.8.8"
        Then I should see "8.8.8.8" in the "modal-textbox-forwarders-0" textbox
        Then I should see the "modal-button-add" button is enabled

        When I click on the "modal-button-add" button
        Then I should not see "add-dns-forward-zone-modal" modal
        And I should see "add-dnsforwardzones-success" alert

        When I search for "my-dnsforwardzone." in the data table
        Then I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwarders" set to "8.8.8.8"
        And I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwardpolicy" set to "first"

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @test
    Scenario: Create a new DNS forward zone (192.168.23.24)
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I click on the "dns-forward-zones-add" button
        Then I should see "add-dns-forward-zone-modal" modal

        When I type in the "modal-textbox-dns-zone-name" textbox text "my-dnsforwardzone"
        Then I should see "my-dnsforwardzone" in the "modal-textbox-dns-zone-name" textbox
        Then I should see the "modal-button-add" button is disabled

        When I click on the "modal-textbox-forwarders-add-button" button
        Then I should see the "modal-textbox-forwarders-0" textbox is empty

        When I type in the "modal-textbox-forwarders-0" textbox text "192.168.23.24"
        Then I should see "192.168.23.24" in the "modal-textbox-forwarders-0" textbox
        Then I should see the "modal-button-add" button is enabled

        When I click on the "modal-button-add" button
        Then I should not see "add-dns-forward-zone-modal" modal
        And I should see "add-dnsforwardzones-success" alert

        When I search for "my-dnsforwardzone." in the data table
        Then I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwarders" set to "192.168.23.24"
        And I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwardpolicy" set to "first"

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @test
    Scenario: Create a new DNS forward zone forward only
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I click on the "dns-forward-zones-add" button
        Then I should see "add-dns-forward-zone-modal" modal

        When I type in the "modal-textbox-dns-zone-name" textbox text "my-dnsforwardzone"
        Then I should see "my-dnsforwardzone" in the "modal-textbox-dns-zone-name" textbox
        Then I should see the "modal-button-add" button is disabled

        When I click on the "modal-textbox-forwarders-add-button" button
        Then I should see the "modal-textbox-forwarders-0" textbox is empty

        When I type in the "modal-textbox-forwarders-0" textbox text "8.8.8.8"
        Then I should see "8.8.8.8" in the "modal-textbox-forwarders-0" textbox
        Then I should see the "modal-button-add" button is enabled

        When I click on the "modal-radio-forward-policy-only" radio button
        Then I should see the "modal-radio-forward-policy-only" radio button is selected

        When I click on the "modal-button-add" button
        Then I should not see "add-dns-forward-zone-modal" modal
        And I should see "add-dnsforwardzones-success" alert

        When I search for "my-dnsforwardzone." in the data table
        Then I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwarders" set to "8.8.8.8"
        And I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwardpolicy" set to "only"

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @test
    Scenario: Create a new DNS forward zone forwarding disabled
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I click on the "dns-forward-zones-add" button
        Then I should see "add-dns-forward-zone-modal" modal

        When I type in the "modal-textbox-dns-zone-name" textbox text "my-dnsforwardzone"
        Then I should see "my-dnsforwardzone" in the "modal-textbox-dns-zone-name" textbox
        Then I should see the "modal-button-add" button is disabled

        When I click on the "modal-textbox-forwarders-add-button" button
        Then I should see the "modal-textbox-forwarders-0" textbox is empty

        When I type in the "modal-textbox-forwarders-0" textbox text "8.8.8.8"
        Then I should see "8.8.8.8" in the "modal-textbox-forwarders-0" textbox
        Then I should see the "modal-button-add" button is enabled

        When I click on the "modal-radio-forward-policy-none" radio button
        Then I should see the "modal-radio-forward-policy-none" radio button is selected

        When I click on the "modal-button-add" button
        Then I should not see "add-dns-forward-zone-modal" modal
        And I should see "add-dnsforwardzones-success" alert

        When I search for "my-dnsforwardzone." in the data table
        Then I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwarders" set to "8.8.8.8"
        And I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwardpolicy" set to "none"

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @test
    Scenario: Create a new DNS forward zone with skip overlap check
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I click on the "dns-forward-zones-add" button
        Then I should see "add-dns-forward-zone-modal" modal

        When I type in the "modal-textbox-dns-zone-name" textbox text "my-dnsforwardzone"
        Then I should see "my-dnsforwardzone" in the "modal-textbox-dns-zone-name" textbox
        Then I should see the "modal-button-add" button is disabled

        When I click on the "modal-textbox-forwarders-add-button" button
        Then I should see the "modal-textbox-forwarders-0" textbox is empty

        When I type in the "modal-textbox-forwarders-0" textbox text "8.8.8.8"
        Then I should see "8.8.8.8" in the "modal-textbox-forwarders-0" textbox
        Then I should see the "modal-button-add" button is enabled

        When I click on the "modal-checkbox-skip-overlap-check" checkbox
        Then I should see the "modal-checkbox-skip-overlap-check" checkbox is checked

        When I click on the "modal-button-add" button
        Then I should not see "add-dns-forward-zone-modal" modal
        And I should see "add-dnsforwardzones-success" alert

        When I search for "my-dnsforwardzone." in the data table
        Then I should see "my-dnsforwardzone." entry in the data table with attribute "idnsforwarders" set to "8.8.8.8"

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @test
    Scenario: Create a new reverse DNS forward zone (explicit IP network)
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I click on the "dns-forward-zones-add" button
        Then I should see "add-dns-forward-zone-modal" modal

        When I click on the "modal-radio-reverse-zone-ip" radio button
        Then I should see the "modal-radio-reverse-zone-ip" radio button is selected

        When I type in the "modal-textbox-reverse-zone-ip" textbox text "192.168.0.0/23"
        Then I should see "192.168.0.0/23" in the "modal-textbox-reverse-zone-ip" textbox
        Then I should see the "modal-button-add" button is disabled

        When I click on the "modal-textbox-forwarders-add-button" button
        Then I should see the "modal-textbox-forwarders-0" textbox is empty

        When I type in the "modal-textbox-forwarders-0" textbox text "8.8.8.8"
        Then I should see "8.8.8.8" in the "modal-textbox-forwarders-0" textbox
        Then I should see the "modal-button-add" button is enabled

        When I click on the "modal-button-add" button
        Then I should not see "add-dns-forward-zone-modal" modal
        And I should see "add-dnsforwardzones-success" alert

        When I search for "168.192.in-addr.arpa." in the data table
        Then I should see "168.192.in-addr.arpa." entry in the data table with attribute "idnsforwarders" set to "8.8.8.8"

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "168.192.in-addr.arpa"

    @seed
    Scenario: Create a DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"

    @test
    Scenario: Delete DNS forward zone
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I select entry "my-dnsforwardzone." in the data table
        Then I should see "my-dnsforwardzone." entry selected in the data table

        When I click on the "dns-forward-zones-button-delete" button
        Then I should see "dns-forward-zones-delete-modal" modal

        When I click on the "modal-button-delete" button
        Then I should not see "dns-forward-zones-delete-modal" modal
        And I should see "remove-dnsforwardzones-success" alert

        When I search for "my-dnsforwardzone." in the data table
        Then I should not see "my-dnsforwardzone." entry in the data table

    @seed
    Scenario: Create a DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"

    @test
    Scenario: Disable DNS forward zone
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I select entry "my-dnsforwardzone." in the data table
        Then I should see "my-dnsforwardzone." entry selected in the data table

        When I click on the "dns-forward-zones-disable" button
        Then I should see "dns-forward-zones-enable-disable-modal" modal

        When I click on the "modal-button-disable" button
        Then I should not see "dns-forward-zones-enable-disable-modal" modal
        And I should see "disable-dnsforwardzones-success" alert

        When I search for "my-dnsforwardzone." in the data table
        Then I should see element "my-dnsforwardzone." with status label "idnszoneactive" in the list disabled

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"

    @seed
    Scenario: Create a disabled DNS forward zone
        Given DNS forward zone "my-dnsforwardzone" exists with forwarder "8.8.8.8"
        And DNS forward zone "my-dnsforwardzone" is disabled

    @test
    Scenario: Enable DNS forward zone
        Given I am logged in as admin
        And I am on "dns-forward-zones" page

        When I select entry "my-dnsforwardzone." in the data table
        Then I should see "my-dnsforwardzone." entry selected in the data table

        When I click on the "dns-forward-zones-enable" button
        Then I should see "dns-forward-zones-enable-disable-modal" modal

        When I click on the "modal-button-enable" button
        Then I should not see "dns-forward-zones-enable-disable-modal" modal
        And I should see "enable-dnsforwardzones-success" alert

        When I search for "my-dnsforwardzone." in the data table
        Then I should see element "my-dnsforwardzone." with status label "idnszoneactive" in the list enabled

    @cleanup
    Scenario: Delete DNS forward zone
        Given I delete DNS forward zone "my-dnsforwardzone"
