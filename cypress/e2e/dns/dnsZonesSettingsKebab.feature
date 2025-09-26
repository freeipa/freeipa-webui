Feature: DNS Zones Settings > Kebab
    Configure DNS zones > Settings > Kebab menu options

    @seed
    Scenario: Create DNS zone 'my-dns-zone' for settings testing
        Given DNS zone "my-dns-zone" exists and it is enabled

    @seed
    Scenario: Create DNS zone 'my-dns-zone-2' for settings testing
        Given DNS zone "my-dns-zone-2" exists and it is disabled

    @test
    Scenario: Disable DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I click on the "dns-zones-tab-settings-kebab" kebab menu
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-disable" kebab menu item
        Then I should see "dns-zones-enable-disable-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @test
    Scenario: Enable DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone-2." > Settings page

        When I click on the "dns-zones-tab-settings-kebab" kebab menu
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-enable" kebab menu item
        Then I should see "dns-zones-enable-disable-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @test
    Scenario: Add permission to DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I click on the "dns-zones-tab-settings-kebab" kebab menu
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-add-permission" kebab menu item
        Then I should see "dns-zones-add-remove-permission-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @test
    Scenario: Remove permission from DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I click on the "dns-zones-tab-settings-kebab" kebab menu
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-remove-permission" kebab menu item
        Then I should see "dns-zones-add-remove-permission-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @test
    Scenario: Delete DNS zone from settings page kebab menu
        Given I am logged in as admin
        And I am on DNS zone "my-dns-zone." > Settings page

        When I click on the "dns-zones-tab-settings-kebab" kebab menu
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-delete" kebab menu item
        Then I should see "dns-zones-delete-modal" modal

        When I click on the "modal-button-ok" button
        Then I should not see "dns-zones-delete-modal" modal
        And I should not see DNS zone "my-dns-zone." in the list

    @cleanup
    Scenario: Delete DNS zone 'my-dns-zone-2'
        Given I delete DNS zone "my-dns-zone-2."
