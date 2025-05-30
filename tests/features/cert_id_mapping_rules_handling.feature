Feature: Certificate identity mapping rules handling
    Create, delete, enable, and disable certificate identity mapping rules.

    Background:
        Given I am logged in as "Administrator"
        Given I am on "cert-id-mapping-rules" page

    Scenario: Add a new certificate identity mapping rule
        When I click on "Add" button
        Then I see "Add certificate identity mapping rule" modal
        * In the modal, I type into the field with ID "rule-name" text "myrule"
        * In the modal, I type into the field with ID "mapping-rule" text "somemaprule"
        * In the modal, I type into the field with ID "matching-rule" text "somematchrule"
        * In the modal, I click on button with name attribute "add-associateddomain"
        * I should see a new empty text input field with ID "associateddomain-0"
        * I type in the field with ID "associateddomain-0" the text "dom-server.ipa.demo"
        * I click on the "priority" number plus button
        * I type in the field "Description" text "Test Rule"
        When in the modal dialog I click on "Add" button
        Then I should see "success" alert with text "Added Certificate Identity Mapping Rule \"myrule\""
        * I close the alert
        * I should see "myrule" entry in the data table with ID "cert-id-mapping-rules-table"

    Scenario: Add another certificate identity mapping rule
        When I click on "Add" button
        Then I see "Add certificate identity mapping rule" modal
        * In the modal, I type into the field with ID "rule-name" text "myrule2"
        * In the modal, I type into the field with ID "mapping-rule" text "somemaprule2"
        * In the modal, I type into the field with ID "matching-rule" text "somematchrule2"
        * In the modal, I click on button with name attribute "add-associateddomain"
        * I should see a new empty text input field with ID "associateddomain-0"
        * I type in the field with ID "associateddomain-0" the text "dom-server.ipa.demo"
        * I click on the "priority" number plus button
        * I type in the field "Description" text "Test Rule 2"
        When in the modal dialog I click on "Add" button
        Then I should see "success" alert with text "Added Certificate Identity Mapping Rule \"myrule2\""
        * I close the alert
        * I should see "myrule2" entry in the data table with ID "cert-id-mapping-rules-table"

    Scenario: Disable a certificate identity mapping rule
        Given I should see "myrule" entry in the data table with ID "cert-id-mapping-rules-table"
        Then I select entry "myrule" in the data table
        When I click on "Disable" button
        Then I see "Disable confirmation" modal
        * in the modal dialog I click on "OK" button
        * I should see "success" alert with text "Rule status changed"
        * I close the alert

    Scenario: Enable a certificate identity mapping rule
        Given I should see "myrule" entry in the data table with ID "cert-id-mapping-rules-table"
        Then I select entry "myrule" in the data table
        When I click on "Enable" button
        Then I see "Enable confirmation" modal
        * in the modal dialog I click on "OK" button
        * I should see "success" alert with text "Rule status changed"
        * I close the alert

    Scenario: Delete certificate identity mapping rules
        Given I should see "myrule" entry in the data table with ID "cert-id-mapping-rules-table"
        Given I should see "myrule2" entry in the data table with ID "cert-id-mapping-rules-table"
        Then I select entry "myrule" in the data table
        Then I select entry "myrule2" in the data table
        When I click on "Delete" button
        * I see "Remove certificate identity mapping rules" modal
        * I should see "myrule" entry in the data table
        * I should see "myrule2" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Certificate identity provider rules removed"
        * I close the alert
        Then I should not see "myrule" entry in the data table with ID "cert-id-mapping-rules-table"
        Then I should not see "myrule2" entry in the data table with ID "cert-id-mapping-rules-table"

