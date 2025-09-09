Feature: DNS Zones Settings
    Configure DNS zone settings including SOA records, TTL, security policies, and forwarders

    @seed
    Scenario: Create DNS zone for settings testing
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Configure DNS zone authoritative values
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        And I change admin email field to "admin.example.com"

        When I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Configure DNS zone SOA settings
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I change SOA refresh field to "7200"
        And I change SOA retry field to "1800"
        And I change SOA expire field to "1209600"
        And I change SOA minimum field to "3600"

        And I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Configure DNS zone TTL settings
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I change DNS zone default TTL field to "300"
        And I change TTL field to "1800"

        And I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Configure DNS zone dynamic update settings
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I click on the "dns-zones-tab-settings-checkbox-idnsallowdynupdate" checkbox
        Then I should see the "dns-zones-tab-settings-checkbox-idnsallowdynupdate" checkbox is checked

        When I type in the "dns-zones-tab-settings-textbox-idnsupdatepolicy" textarea text "example text"
        Then I should see "example text" in the "dns-zones-tab-settings-textbox-idnsupdatepolicy" textarea

        When I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Configure DNS zone allow query settings
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I remove allow query "any"
        When I add allow query "192.168.1.0/24"

        When I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Configure DNS zone allow transfer settings
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I remove allow transfer "none"
        When I add allow transfer "10.0.0.0/8"

        When I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Configure DNS zone forwarder settings
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I add zone forwarder "8.8.8.8"

        When I click on the "dns-zone-tab-settings-radio-forward-only" radio button
        Then I should see the "dns-zone-tab-settings-radio-forward-only" radio button is selected

        When I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Configure DNS zone security settings
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I click on the "dns-zones-tab-settings-checkbox-idnsallowsyncptr" checkbox
        Then I should see the "dns-zones-tab-settings-checkbox-idnsallowsyncptr" checkbox is unchecked

        When I click on the "dns-zones-tab-settings-checkbox-idnssecinlinesigning" checkbox
        Then I should see the "dns-zones-tab-settings-checkbox-idnssecinlinesigning" checkbox is checked

        When I type in the "dns-zones-tab-settings-textbox-nsec3paramrecord" textbox text "1 0 10 1234567890ABCDEF"
        Then I should see "1 0 10 1234567890ABCDEF" in the "dns-zones-tab-settings-textbox-nsec3paramrecord" textbox

        When I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "success" alert

    @test
    Scenario: Validate invalid NSEC3PARAM record
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I try to add invalid NSEC3PARAM record to zone
        And I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "error" alert

    @test
    Scenario: Validate invalid allow query record
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page
        And I remove all elements from all textbox lists in DNS zone settings

        When I try to add invalid Allow Query record to zone
        And I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "error" alert

    @test
    Scenario: Validate invalid zone forwarder
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page
        And I remove all elements from all textbox lists in DNS zone settings

        When I try to add invalid zone forwarder to zone
        And I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "error" alert

    @test
    Scenario: Validate invalid zone allow transfer
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page
        And I remove all elements from all textbox lists in DNS zone settings

        When I try to add invalid zone allow transfer to zone
        And I click on the "dns-zones-tab-settings-button-save" button
        Then I should see "error" alert

    @cleanup
    Scenario: Delete test DNS zone
        Given I delete DNS zone "my-dns-zone."
