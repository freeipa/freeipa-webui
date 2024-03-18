Feature: User details
  Work with user details and its associations

  Background:
    Given I am logged in as "Administrator"
    Given I am on "active-users" page
    Given sample testing user "armadillo" exists
    Given I click on "armadillo" entry in the data table
    Given I am on "armadillo" user settings page

  Scenario Outline: Change the identity settings
    When I click in the field "First name"
    * I clear the selected field
    * I type in the selected field text "<firstName>"
    When I click in the field "Last name"
    * I clear the selected field
    * I type in the selected field text "<lastName>"
    When I click in the field "Full name"
    * I clear the selected field
    * I type in the selected field text "<firstName> <lastName>"
    When I click in the field "Job title"
    * I clear the selected field
    * I type in the selected field text "<jobTitle>"
    When I click in the field "GECOS"
    * I clear the selected field
    * I type in the selected field text "<firstName> <lastName>"
    When I click in the field "Class"
    * I clear the selected field
    * I type in the selected field text "<class>"

    When I click on "Save" button
    Then I should see "success" alert with text "User modified"
    When I click on "Refresh" button
    Then I should see value "<firstName>" in the field "First name"
    And I should see value "<lastName>" in the field "Last name"
    And I should see value "<firstName> <lastName>" in the field "Full name"
    And I should see value "<firstName> <lastName>" in the field "GECOS"
    And I should see value "<class>" in the field "Class"
    Examples:
      | firstName | lastName | jobTitle | class   |
      | Reginald  | Barclay  | engineer | ipauser |

  Scenario: Change the account settings - login, password, home
    When I click in the field "User login"
    Then the active field should be read-only
    When I click in the field "Password"
    Then the active field should be empty
    When I click in the field "Home directory"
    * I clear the selected field
    * I type in the selected field text "/home/rbarclay"

    When I click on "Save" button
    Then I should see "success" alert with text "User modified"
    When I click on "Refresh" button
    Then I should see value "armadillo" in the field "User login"
    And I should see value "" in the field "Password"
    And I should see value "/home/rbarclay" in the field "Home directory"

  Scenario: Change the account settings - SSH keys addition
    When I click on Add key in the SSH public keys section
    Then I see "Set SSH key" modal
    When I put SSH key named "valid sample 1" into the text area
    And in the modal dialog I click on "Set" button
    Then I should see "success" alert with text "Added SSH public key to 'armadillo'"
    And I should see 1 SSH keys in the SSH public keys section
    When I click on Show key button for key number 1
    Then the SSH key should match "valid sample 1"
    * in the modal dialog I click on "Cancel" button
    # Duplicate key
    When I click on Add key in the SSH public keys section
    Then I see "Set SSH key" modal
    When I put SSH key named "valid sample 1" into the text area
    And in the modal dialog I click on "Set" button
    Then I should see "danger" alert with text "no modifications to be performed"
    * in the modal dialog I click on "Cancel" button
    And I should see 1 SSH keys in the SSH public keys section
    # Invalid key
    When I click on Add key in the SSH public keys section
    Then I see "Set SSH key" modal
    When I put SSH key named "invalid sample" into the text area
    And in the modal dialog I click on "Set" button
    Then I should see "danger" alert with text "invalid 'sshpubkey': invalid SSH public key"
    * in the modal dialog I click on "Cancel" button
    And I should see 1 SSH keys in the SSH public keys section
    # Another valid key
    When I click on Add key in the SSH public keys section
    Then I see "Set SSH key" modal
    When I put SSH key named "valid sample 2" into the text area
    And in the modal dialog I click on "Set" button
    Then I should see "success" alert with text "Added SSH public key to 'armadillo'"
    And I should see 2 SSH keys in the SSH public keys section
    When I click on Show key button for key number 2
    Then the SSH key should match "valid sample 2"
    * in the modal dialog I click on "Cancel" button

  Scenario: Change the account settings - SSH keys deletion
    When I click on Delete button for key number 1
    Then I see "Remove SSH Public Key" modal
    When in the modal dialog I click on "Cancel" button
    Then I should see 2 SSH keys in the SSH public keys section

    When I click on Delete button for key number 1
    Then I see "Remove SSH Public Key" modal
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed SSH public key from 'armadillo'"
    And I should see 1 SSH keys in the SSH public keys section
    # the order has changed, hence key number 1
    When I click on Delete button for key number 1
    Then I see "Remove SSH Public Key" modal
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed SSH public key from 'armadillo'"
    And I should see 0 SSH keys in the SSH public keys section

  Scenario: Certificates - addition
    When I click on Add key in the Certificates section
    And I put Certificate named "valid sample 1" into the text area
    And in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added certificate to 'armadillo'"
    And I should see 1 certificates in the Certificates section
    # empty certificate
    When I click on Add key in the Certificates section
    And in the modal dialog I click on "Add" button
    Then I should see "danger" alert with text "'usercertificate' is required"
    * in the modal dialog I click on "Cancel" button
    Then I should see 1 certificates in the Certificates section
    # certificate too short
    When I click on Add key in the Certificates section
    And I put Certificate named "invalid sample - short" into the text area
    And in the modal dialog I click on "Add" button
    Then I should see "danger" alert with text "Certificate format error: error parsing asn1 value: ParseError { kind: ShortData }"
    * in the modal dialog I click on "Cancel" button
    Then I should see 1 certificates in the Certificates section
    # certificate length not divisible by 4
    When I click on Add key in the Certificates section
    And I put Certificate named "invalid sample - padding" into the text area
    And in the modal dialog I click on "Add" button
    Then I should see "danger" alert with text "Base64 decoding failed: Incorrect padding"
    * in the modal dialog I click on "Cancel" button
    Then I should see 1 certificates in the Certificates section

    # Another valid certificate
    When I click on Add key in the Certificates section
    And I put Certificate named "valid sample 2" into the text area
    And in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added certificate to 'armadillo'"
    And I should see 2 certificates in the Certificates section

    # Duplicate certificate
    When I click on Add key in the Certificates section
    And I put Certificate named "valid sample 2" into the text area
    And in the modal dialog I click on "Add" button
    Then I should see "danger" alert with text "'usercertificate;binary' already contains one or more values"
    * in the modal dialog I click on "Cancel" button
    Then I should see 2 certificates in the Certificates section

  Scenario Outline: Certificates - details
    Given certificate number <number> has name "<name>"
    When I toggle the details for certificate number <number>
    Then in the certificate details, I should see value "<serial>" in the field "Serial number"
    * in the certificate details, I should see value "<issuer>" in the field "Issued by"
    * in the certificate details, I should see value "<validFrom>" in the field "Valid from"
    * in the certificate details, I should see value "<validTo>" in the field "Valid to"
    Then I toggle the details for certificate number <number>

    When I toggle the kebab menu for certificate number <number>
    And in the opened certificate kebab menu, I click on "View" button
    Then I see "Certificate for <cn>" modal
    And I see a modal with text "<serial>"
    And I see a modal with text "<issuer>"
    And I see a modal with text "<validFrom>"
    And I see a modal with text "<validTo>"
    * in the modal dialog I click on "Close" button
    * I toggle the kebab menu for certificate number <number>
    Examples:
      | number | name                     | serial                                          | issuer        | validFrom                    | validTo                      | cn               |
      | 1      | krunoslav.hrnjak@hops.hr | 264374074076456325397645183544606453821         | Fina RDC 2015 | Mon Oct 14 12:13:20 2019 UTC | Thu Oct 14 12:13:20 2021 UTC | KRUNOSLAV HRNJAK |
      | 2      | mshelley                 | 11594046475060613235605226731133545093594498279 | mshelley      | Wed Sep 27 09:17:49 2023 UTC | Thu Sep 26 09:17:49 2024 UTC | mshelley         |

  Scenario: Certificates - show raw certificate
    Given certificate number 1 has name "krunoslav.hrnjak@hops.hr"
    When I toggle the kebab menu for certificate number 1
    And in the opened certificate kebab menu, I click on "Get" button
    Then I should see value of "valid sample 1" in the text area
    * in the modal dialog I click on "Close" button
    * I toggle the kebab menu for certificate number 1

    Given certificate number 2 has name "mshelley"
    When I toggle the kebab menu for certificate number 2
    And in the opened certificate kebab menu, I click on "Get" button
    Then I should see value of "valid sample 2" in the text area
    * in the modal dialog I click on "Close" button
    * I toggle the kebab menu for certificate number 2

  Scenario Outline: Certificates - download pem file
    Given certificate number <number> has name "<name>"
    When I toggle the kebab menu for certificate number <number>
    And in the opened certificate kebab menu, I click on "Download" button
    Then file with extension "pem" should be downloaded
    * I toggle the kebab menu for certificate number <number>
    Examples:
      | number | name                     |
      | 1      | krunoslav.hrnjak@hops.hr |
      | 2      | mshelley                 |

  Scenario Outline: Certificates - deletion
    Given certificate number 1 has name "<name>"
    When I toggle the kebab menu for certificate number 1
    And in the opened certificate kebab menu, I click on "Delete" button
    Then I see "Remove certificate" modal
    And I see a modal with text "<serial>"
    When in the modal dialog I click on "Delete" button
    Then I should see <remains> certificates in the Certificates section
    Examples:
      | remains | name                     | serial                                          |
      | 1       | krunoslav.hrnjak@hops.hr | 264374074076456325397645183544606453821         |
      | 0       | mshelley                 | 11594046475060613235605226731133545093594498279 |

  Scenario: Adding a single Certificate mapping data from the 'Certificate mapping data' radio button
    When I click on Add key in the Certificate mappings section
    When in the modal dialog I check "Certificate mapping data" radio selector
    When in the modal dialog I click on "Add" button under the Certificate mapping data section
    When I type "Certificate test 123" into the text input in the Certificate mapping data modal
    When in the modal dialog I click on "Add" button
    Then I should see certificate mappings with the "Certificate test 123" text in the Certificate mappings section
    Then I should see "success" alert with text "Added certificate mappings to user 'armadillo'"

  Scenario: Add multiple Certificate mapping data entries from the 'Certificate mapping data' radio button
    When I click on Add key in the Certificate mappings section
    When in the modal dialog I check "Certificate mapping data" radio selector
    When in the modal dialog I click on "Add" button under the Certificate mapping data section
    When I type "Certificate test 321" into the text input with index 0 in the Certificate mapping data modal
    When in the modal dialog I click on "Add" button under the Certificate mapping data section
    When I type "Certificate test 234" into the text input with index 1 in the Certificate mapping data modal
    When in the modal dialog I click on "Add" button under the Certificate mapping data section
    When I type "Certificate test 345" into the text input with index 2 in the Certificate mapping data modal
    When in the modal dialog I click on "Add" button
    Then I should see certificate mappings with the "Certificate test 321" text in the Certificate mappings section
    Then I should see certificate mappings with the "Certificate test 234" text in the Certificate mappings section
    Then I should see certificate mappings with the "Certificate test 345" text in the Certificate mappings section
    Then I should see "success" alert with text "Added certificate mappings to user 'armadillo'"

  Scenario: Delete certificate mapping data entry
    When I click on Delete button for certificate mapping data number 1 in the Certificate mappings section
    Then I see a modal with text "Certificate test 123"
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed certificate mappings from user 'armadillo'"

  Scenario: Add Certificate from the 'Certificate mapping data' radio button
    When I click on Add key in the Certificate mappings section
    When in the modal dialog I check "Certificate mapping data" radio selector
    When in the modal dialog I click on Add button under the Certificate subsection
    When I put Certificate named "valid sample 1" into the text area with index 1 in the Certificate mapping data modal
    When in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added certificate mappings to user 'armadillo'"

  Scenario: Add Issuer and object
    When I click on Add key in the Certificate mappings section
    When in the modal dialog I check "Issuer and subject" radio selector
    When I type "O=EXAMPLE.ORG,CN=Issuer 123" into the "Issuer" text input in the Certificate mapping data modal
    When I type "O=EXAMPLE.ORG,CN=Subject 123" into the "Subject" text input in the Certificate mapping data modal
    When in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Added certificate mappings to user 'armadillo'"

  Scenario: Remove certificate mapping data entry
    When I click on Delete button for certificate mapping data number 1 in the Certificate mappings section
    Then I see a modal with text "Certificate test"
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed certificate mappings from user 'armadillo'"

  Scenario: Select single user authentication type
    When I click on "Password" checkbox in "User authentication types" section
    Then I should see the "Password" checkbox checked
    When I click on "Save" button
    Then I should see "success" alert with text "User modified"
    And I should see the "Password" checkbox checked
    And I should see the "Two-factor authentication (password + OTP)" checkbox unchecked
    And I should see the "RADIUS" checkbox unchecked
    And I should see the "PKINIT" checkbox unchecked
    And I should see the "Hardened password (by SPAKE or FAST)" checkbox unchecked
    And I should see the "External Identity Provider" checkbox unchecked

  Scenario: Select multiple selections of user authentication types
    When I click on "Two-factor authentication (password + OTP)" checkbox in "User authentication types" section
    Then I should see the "Two-factor authentication (password + OTP)" checkbox checked
    When I click on "RADIUS" checkbox in "User authentication types" section
    Then I should see the "RADIUS" checkbox checked
    When I click on "PKINIT" checkbox in "User authentication types" section
    Then I should see the "PKINIT" checkbox checked
    When I click on "Save" button
    Then I should see "success" alert with text "User modified"
    And I should see the "Two-factor authentication (password + OTP)" checkbox checked
    And I should see the "RADIUS" checkbox checked
    And I should see the "PKINIT" checkbox checked
    And I should see the "Hardened password (by SPAKE or FAST)" checkbox unchecked
    And I should see the "External Identity Provider" checkbox unchecked

  Scenario: Remove multiple selections of user authentication types
    When I click on "Two-factor authentication (password + OTP)" checkbox in "User authentication types" section
    Then I should see the "Two-factor authentication (password + OTP)" checkbox unchecked
    When I click on "RADIUS" checkbox in "User authentication types" section
    Then I should see the "RADIUS" checkbox unchecked
    When I click on "PKINIT" checkbox in "User authentication types" section
    Then I should see the "PKINIT" checkbox unchecked
    When I click on "Save" button
    Then I should see "success" alert with text "User modified"
    And I should see the "Two-factor authentication (password + OTP)" checkbox unchecked
    And I should see the "RADIUS" checkbox unchecked
    And I should see the "PKINIT" checkbox unchecked
    And I should see the "Hardened password (by SPAKE or FAST)" checkbox unchecked
    And I should see the "External Identity Provider" checkbox unchecked
