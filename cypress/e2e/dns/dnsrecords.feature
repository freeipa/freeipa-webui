Feature: DNS Records
    Manage DNS records

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'A' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record A with name "my-a-dns-record"
        Then I should see DNS record "my-a-dns-record" with type "A" and data "192.168.66.67"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'AAAA' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record AAAA with name "my-aaaa-dns-record"
        Then I should see DNS record "my-aaaa-dns-record" with type "AAAA" and data "2001:db8::1"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'A6' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record A6 with name "my-a6-dns-record"
        Then I should see DNS record "my-a6-dns-record" with type "A6" and data "record data"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'AFSDB' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record AFSDB with name "my-afsdb-dns-record"
        Then I should see DNS record "my-afsdb-dns-record" with type "AFSDB" and data "1 hostname"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'CNAME' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record CNAME with name "my-cname-dns-record"
        Then I should see DNS record "my-cname-dns-record" with type "CNAME" and data "hostname.example.com"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'DLV' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record DLV with name "my-dlv-dns-record"
        Then I should see DNS record "my-dlv-dns-record" with type "DLV" and data "34505 8 2 A3746E9665885C21431E75193239C6A481B23E3905553655CE9C2DD4C02F2393"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'DNAME' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record DNAME with name "my-dname-dns-record"
        Then I should see DNS record "my-dname-dns-record" with type "DNAME" and data "target.example.com"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'KX' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record KX with name "my-kx-dns-record"
        Then I should see DNS record "my-kx-dns-record" with type "KX" and data "10 exchanger.example.com"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'LOC' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record LOC with name "my-loc-dns-record"
        Then I should see DNS record "my-loc-dns-record" with type "LOC" and data "40 0 0 N 74 0 0 W 0 100 10 10"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'MX' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record MX with name "my-mx-dns-record"
        Then I should see DNS record "my-mx-dns-record" with type "MX" and data "10 mail.example.com"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'NAPTR' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record NAPTR with name "my-naptr-dns-record"
        Then I should see DNS record "my-naptr-dns-record" with type "NAPTR" and data "100 10 U sip .* sip.example.com"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'PTR' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record PTR with name "my-ptr-dns-record"
        Then I should see DNS record "my-ptr-dns-record" with type "PTR" and data "hostname.example.com"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'SRV' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record SRV with name "my-srv-dns-record"
        Then I should see DNS record "my-srv-dns-record" with type "SRV" and data "10 5 8080 target.example.com"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'SSHFP' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record SSHFP with name "my-sshfp-dns-record"
        Then I should see DNS record "my-sshfp-dns-record" with type "SSHFP" and data "1 1 d4b01d51ebe9c82a2e8b92425a8c9fc2b818f2e3"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'TLSA' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record TLSA with name "my-tlsa-dns-record"
        Then I should see DNS record "my-tlsa-dns-record" with type "TLSA" and data "1 1 1 data"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'TXT' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record TXT with name "my-txt-dns-record"
        Then I should see DNS record "my-txt-dns-record" with type "TXT" and data "text record data"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create a new DNS zone
        Given DNS zone "my-dns-zone" exists

    @test
    Scenario: Create a new DNS 'URI' record
        Given I am logged in as admin
        And I am on "dns-zones/my-dns-zone./dns-records" page

        When I create a DNS record URI with name "my-uri-dns-record"
        Then I should see DNS record "my-uri-dns-record" with type "URI" and data "10 5 \"https://example.com\""

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-dns-zone."

    @seed
    Scenario: Create new DNS zone
        Given DNS zone "my-new-dns-zone" exists

    @test
    Scenario: Create a new DNS 'NS' + 'DS' record
        Given I am logged in as admin
        And I am on "dns-zones/my-new-dns-zone./dns-records" page

        When I create a DNS record NS with name "secure"
        Then I should see DNS record "secure" with type "NS" and data "server.ipa.demo"

        When I navigate to "dns-zones/my-new-dns-zone./dns-records" page
        Then I should be on "dns-zones/my-new-dns-zone./dns-records" page

        When I create a DNS record DS with name "secure"
        Then I should see DNS record "secure" with type "DS, NS" and data "20326 8 2 E06D44B80B8F1D39A95C0B0D7C65D08458E880409BBC683457104237C7F53853, server.ipa.demo"

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-new-dns-zone."

    @seed
    Scenario: Create new DNS zone
        Given DNS zone "my-other-dns-zone" exists and has record "A" with name "my-a-dns-record" and data "192.168.66.67"

    @test
    Scenario: Remove DNS record
        Given I am logged in as admin
        And I am on "dns-zones/my-other-dns-zone./dns-records" page

        When I delete DNS record "my-a-dns-record"
        Then I should not see "my-a-dns-record" entry in the data table

    @cleanup
    Scenario: Delete DNS zone
        Given I delete DNS zone "my-other-dns-zone."
