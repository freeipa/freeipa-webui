Feature: Certificate identity mapping rules manipulation
    Create, delete, and validate certificate identity mapping rules

    @test
    Scenario: Add a new certificate identity mapping rule with mandatory fields
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules" page

        When I click on the "certificate-mapping-button-add" button
        Then I should see "add-rule-modal" modal

        When I type in the "modal-textbox-rule-name" textbox text "test_rule_mandatory"
        Then I should see "test_rule_mandatory" in the "modal-textbox-rule-name" textbox

        When I click on the "modal-button-add" button
        Then I should not see "add-rule-modal" modal
        And I should see "add-certmap-success" alert

        When I search for "test_rule_mandatory" in the data table
        Then I should see "test_rule_mandatory" entry in the data table

    @cleanup
    Scenario: Delete cert mapping rule "test_rule_mandatory"
        Given I delete certmaprule "test_rule_mandatory"

    @test
    Scenario: Add a new certificate identity mapping rule with all fields
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules" page

        When I click on the "certificate-mapping-button-add" button
        Then I should see "add-rule-modal" modal

        When I type in the "modal-textbox-rule-name" textbox text "test_rule_all"
        Then I should see "test_rule_all" in the "modal-textbox-rule-name" textbox

        When I type in the "modal-textbox-mapping-rule" textbox text "(ipacertsubject=.*,O=EXAMPLE.ORG)"
        Then I should see "(ipacertsubject=.*,O=EXAMPLE.ORG)" in the "modal-textbox-mapping-rule" textbox

        When I type in the "modal-textbox-matching-rule" textbox text "<ISSUER>CN=CA,O=EXAMPLE.ORG"
        Then I should see "<ISSUER>CN=CA,O=EXAMPLE.ORG" in the "modal-textbox-matching-rule" textbox

        When I add "ipa.test" to "modal-domain-name" textbox list
        Then I should see "ipa.test" in the "modal-domain-name" textbox list

        When I type in the "modal-number-selector-priority-input" textbox text "5"
        Then I should see "5" in the "modal-number-selector-priority-input" textbox

        When I type in the "modal-textbox-description" textbox text "Test rule with all fields"
        Then I should see "Test rule with all fields" in the "modal-textbox-description" textbox

        When I click on the "modal-button-add" button
        Then I should not see "add-rule-modal" modal
        And I should see "add-certmap-success" alert

        When I search for "test_rule_all" in the data table
        Then I should see "test_rule_all" entry in the data table

    @cleanup
    Scenario: Delete cert mapping rule "test_rule_all"
        Given I delete certmaprule "test_rule_all"

    @seed
    Scenario: Create cert mapping rule for deletion test
        Given certmaprule "test_rule_delete" exists

    @test
    Scenario: Delete a certificate identity mapping rule via toolbar
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules" page

        When I select entry "test_rule_delete" in the data table
        Then I should see "test_rule_delete" entry selected in the data table

        When I click on the "certificate-mapping-button-delete" button
        Then I should see "delete-multiple-rules-modal" modal

        When I click on the "modal-button-delete" button
        Then I should not see "delete-multiple-rules-modal" modal
        And I should see "remove-certrules-success" alert

        When I search for "test_rule_delete" in the data table
        Then I should not see "test_rule_delete" entry in the data table

    @test
    Scenario: Cancel creation of a certificate identity mapping rule
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules" page

        When I click on the "certificate-mapping-button-add" button
        Then I should see "add-rule-modal" modal

        When I type in the "modal-textbox-rule-name" textbox text "test_rule_cancel"
        Then I should see "test_rule_cancel" in the "modal-textbox-rule-name" textbox

        When I click on the "modal-button-cancel" button
        Then I should not see "add-rule-modal" modal

        When I search for "test_rule_cancel" in the data table
        Then I should not see "test_rule_cancel" entry in the data table

    @seed
    Scenario: Create cert mapping rule for duplicate test
        Given certmaprule "test_rule_duplicate" exists

    @test
    Scenario: Add an invalid certificate identity mapping rule
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules" page

        When I click on the "certificate-mapping-button-add" button
        Then I should see "add-rule-modal" modal
        And I should see the "modal-button-add" button is disabled

        When I type in the "modal-textbox-rule-name" textbox text "test_rule_duplicate"
        Then I should see "test_rule_duplicate" in the "modal-textbox-rule-name" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-cermap-error" alert

        When I click on the "modal-button-cancel" button
        Then I should not see "add-rule-modal" modal

    @cleanup
    Scenario: Delete cert mapping rule "test_rule_duplicate"
        Given I delete certmaprule "test_rule_duplicate"

    @seed
    Scenario: Create cert mapping rule with status 'Enabled'
        Given certmaprule "test_rule_status_enabled" exists

    @test
    Scenario: Disable a certificate identity mapping rule
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules" page

        When I select entry "test_rule_status_enabled" in the data table
        Then I should see "test_rule_status_enabled" entry selected in the data table

        When I click on the "certificate-mapping-button-disable" button
        Then I should see "enable-disable-multiple-rules-modal" modal

        When I click on the "modal-button-ok" button
        Then I should not see "enable-disable-multiple-rules-modal" modal
        And I should see "success" alert

        When I search for "test_rule_status_enabled" in the data table
        Then I should see element "test_rule_status_enabled" with status label "ipaenabledflag" in the list disabled

    @cleanup
    Scenario: Delete cert mapping rule "test_rule_status_enabled"
        Given I delete certmaprule "test_rule_status_enabled"

    @seed
    Scenario: Create cert mapping rule with status 'Disabled'
        Given certmaprule "test_rule_status_disabled" exists and is disabled

    @test
    Scenario: Enable a certificate identity mapping rule
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules" page

        When I select entry "test_rule_status_disabled" in the data table
        Then I should see "test_rule_status_disabled" entry selected in the data table

        When I click on the "certificate-mapping-button-enable" button
        Then I should see "enable-disable-multiple-rules-modal" modal

        When I click on the "modal-button-ok" button
        Then I should not see "enable-disable-multiple-rules-modal" modal
        And I should see "success" alert

        When I search for "test_rule_status_disabled" in the data table
        Then I should see element "test_rule_status_disabled" with status label "ipaenabledflag" in the list enabled

    @cleanup
    Scenario: Delete cert mapping rule "test_rule_status_disabled"
        Given I delete certmaprule "test_rule_status_disabled"
