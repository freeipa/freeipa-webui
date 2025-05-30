Feature: Certificate identity mapping rules - Settings page
    Modify certificate identity mapping rules and their settings

    Background:
        Given I am logged in as "Administrator"

    Scenario: Prep: Create a certificate identity mapping rule
        Given I am on "cert-id-mapping-rules" page
        When I click on "Add" button
        Then I see "Add certificate identity mapping rule" modal
        * In the modal, I type into the field with ID "rule-name" text "certRule1"
        * In the modal, I type into the field with ID "mapping-rule" text "mappingRule1"
        * In the modal, I type into the field with ID "matching-rule" text "matchingRule1"
        * I click on the "priority" number plus button
        When in the modal dialog I click on "Add" button
        * I should see "success" alert with text "Added Certificate Identity Mapping Rule \"certRule1\""
        * I close the alert
        Then I should see "certRule1" entry in the data table with ID "cert-id-mapping-rules-table"

    Scenario: Modify certificate identity mapping rule settings
        When I click on "certRule1" entry in the data table
        # Change 'Description' field
        * I type in the textarea field with ID "description" the text "Test Rule Description"
        # Change 'Mapping rule' field
        When I clear the field "ipacertmapmaprule"
        * I type in the field with ID "ipacertmapmaprule" the text "newMappingRule"
        # Change 'Matching rule' field
        When I clear the field "ipacertmapmatchrule"
        * I type in the field with ID "ipacertmapmatchrule" the text "newMatchingRule"
        # Change 'Associated domain' field
        When I click on button with name attribute "add-associateddomain"
        * I should see a new empty text input field with ID "associateddomain-0"
        * I type in the field with ID "associateddomain-0" the text "dom-server.ipa.demo"
        # Change 'Priority' field
        When I click on the "ipacertmappriority" number plus button
        # Save changes
        Then I click on "Save" button
        * I should see "success" alert with text "Modified Certificate Identity Mapping Rule \"certRule1\""
        * I close the alert

    Scenario: Disable the certificate identity mapping rule via kebab menu
        When I click on kebab menu and select "Disable"
        Then I see "Confirmation" modal
        * in the modal dialog I click on "OK" button
        * I should see "success" alert with text "Disabled Certificate Identity Mapping Rule \"certRule1\""
        * I close the alert

    Scenario: Enable the certificate identity mapping rule via kebab menu
        When I click on kebab menu and select "Enable"
        Then I see "Confirmation" modal
        * in the modal dialog I click on "OK" button
        * I should see "success" alert with text "Enabled Certificate Identity Mapping Rule \"certRule1\""
        * I close the alert

    Scenario: Delete a certificate identity mapping rule
        Given I click on the breadcrump link "Certificate Identity Mapping Rule"
        Given I should see "certRule1" entry in the data table with ID "cert-id-mapping-rules-table"
        Then I select entry "certRule1" in the data table
        When I click on "Delete" button
        * I see "Remove certificate identity mapping rules" modal
        * I should see "certRule1" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Certificate identity provider rules removed"
        * I close the alert
        Then I should not see "certRule1" entry in the data table with ID "cert-id-mapping-rules-table"
