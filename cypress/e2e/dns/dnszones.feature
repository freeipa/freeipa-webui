Feature: DNS Zones
    Create, delete, enable and disable DNS zones

    @test
    Scenario: Create a new DNS zone
        Given I am logged in as admin
        And I am on "dns-zones" page
        When I create a DNS zone "my-dnszone"
        Then I should see DNS zone "my-dnszone." in the list

    @cleanup
    Scenario: Delete DNS zones
        Given I delete DNS zone "my-dnszone."

    @test
    Scenario: Create a new reverse DNS zone
        Given I am logged in as admin
        And I am on "dns-zones" page
        When I create a reverse DNS zone "192.168.6.0/23"
        Then I should see "168.192.in-addr.arpa." entry in the data table

    @cleanup
    Scenario: Delete DNS zones with reverse zone IP
        Given I delete DNS zone "168.192.in-addr.arpa."

    @test
    Scenario: Create a new DNS zone with skip overlap check
        Given I am logged in as admin
        And I am on "dns-zones" page
        When I create a DNS zone "my-dnszone-with-skip-overlap-check" with skip overlap check
        Then I should see DNS zone "my-dnszone-with-skip-overlap-check." in the list

    @cleanup
    Scenario: Delete DNS zones
        Given I delete DNS zone "my-dnszone-with-skip-overlap-check."

    @test
    Scenario: Create a new reverse DNS zone with skip overlap check
        Given I am logged in as admin
        And I am on "dns-zones" page
        When I create a reverse DNS zone "192.0.2.0/14" with skip overlap check
        Then I should see "192.in-addr.arpa." entry in the data table

    @cleanup
    Scenario: Delete DNS zones with reverse zone IP
        Given I delete DNS zone "192.in-addr.arpa."

    @test
    Scenario: Cancel DNS zone creation
        Given I am logged in as admin
        And I am on "dns-zones" page
        When I cancel the creation of the "cancelled_zone" DNS zone
        Then I should not see DNS zone "cancelled_zone" in the list

    @test
    Scenario: Validate incorrect reverse zone IP
        Given I am logged in as admin
        And I am on "dns-zones" page
        When I create an invalid DNS reverse zone that triggers a validation error
        Then I should see "error" alert

    @seed
    Scenario: Create a new DNS zone to disable/enable
        Given DNS zone "my-dnszone" exists

    @test
    Scenario: Disable DNS zone
        Given I am logged in as admin
        And I am on "dns-zones" page
        When I disable DNS zone "my-dnszone."
        Then I should see DNS zone "my-dnszone." in the list disabled

    @test
    Scenario: Enable DNS zone
        Given I am logged in as admin
        And I am on "dns-zones" page
        When I enable DNS zone "my-dnszone."
        Then I should see DNS zone "my-dnszone." in the list enabled

    @cleanup
    Scenario: Delete DNS zones
        Given I delete DNS zone "my-dnszone."
