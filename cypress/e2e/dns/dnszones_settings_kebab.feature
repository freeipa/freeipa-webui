Feature: DNS Zones Settings > Kebab
    Configure DNS zones > Settings > Kebab menu options

    @test
    Scenario: Disable DNS zone from settings page kebab menu
        Given DNS zone "my-dns-zone" exists
        And DNS zone "my-dns-zone" is enabled
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-disable" button
        Then I should see "dns-zones-enable-disable-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert


    @test
    Scenario: Enable DNS zone from settings page kebab menu
        Given DNS zone "my-dns-zone-2" exists
        And DNS zone "my-dns-zone-2" is disabled
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone-2." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-enable" button
        Then I should see "dns-zones-enable-disable-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @test
    Scenario: Add permission to DNS zone from settings page kebab menu
        Given DNS zone "my-dns-zone" exists
        Given DNS zone "my-dns-zone" is enabled
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-add-permission" button
        Then I should see "dns-zones-add-remove-permission-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @test
    Scenario: Remove permission from DNS zone from settings page kebab menu
        Given DNS zone "my-dns-zone" exists
        And DNS zone "my-dns-zone" has permission
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-remove-permission" button
        Then I should see "dns-zones-add-remove-permission-modal" modal

        When I click on the "modal-button-ok" button
        Then I should see "success" alert

    @test
    Scenario: Delete DNS zone from settings page kebab menu
        Given DNS zone "my-dns-zone" exists
        And DNS zone "my-dns-zone" is enabled
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone." page

        When I click on the "dns-zones-tab-settings-kebab" button
        Then I should see "dns-zones-tab-settings-kebab" kebab menu expanded

        When I click on the "dns-zones-tab-settings-kebab-delete" button
        Then I should see "dns-zones-delete-modal" modal

        When I click on the "modal-button-ok" button
        Then I should not see "dns-zones-delete-modal" modal
        And I should not see DNS zone "my-dns-zone." in the list

