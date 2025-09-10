Feature: DNS Zones Settings > Kebab
    Configure DNS zones > Settings > Kebab menu options

    @seed
    Scenario: Create DNS zone 'my-dns-zone' for settings testing
        Given DNS zone "my-dns-zone" exists and it is enabled

    @test
    Scenario: Disable DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-disable" button
        Then I should see "dns-zones-enable-disable-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS zone 'my-dns-zone'
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create DNS zone 'my-dns-zone-2' for settings testing
        Given DNS zone "my-dns-zone-2" exists and it is disabled

    @test
    Scenario: Enable DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone-2." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-enable" button
        Then I should see "dns-zones-enable-disable-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS zone 'my-dns-zone-2'
        Given I delete DNS zone "my-dns-zone-2."

    @seed
    Scenario: Create DNS zone 'my-dns-zone' for settings testing
        Given DNS zone "my-dns-zone" exists and it is enabled

    @test
    Scenario: Add permission to DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-add-permission" button
        Then I should see "dns-zones-add-remove-permission-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS zone 'my-dns-zone'
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create DNS zone 'my-dns-zone' for settings testing
        Given DNS zone "my-dns-zone" exists and has permission

    @test
    Scenario: Remove permission from DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-remove-permission" button
        Then I should see "dns-zones-add-remove-permission-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete DNS zone 'my-dns-zone'
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create DNS zone 'my-dns-zone' for settings testing
        Given DNS zone "my-dns-zone" exists and it is enabled

    @test
    Scenario: Delete DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-delete" button
        Then I should see "dns-zones-delete-modal" modal

        When I click on the "modal-button-ok" button
        Then I should not see "dns-zones-delete-modal" modal
        And I should not see DNS zone "my-dns-zone." in the list

