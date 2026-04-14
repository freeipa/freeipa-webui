Feature: Certificate identity mapping rule settings
    Modify certificate identity mapping rule settings

    @seed
    Scenario: Create cert mapping rule for description test
        Given certmaprule "test_description_rule" exists

    @test
    Scenario: Set description
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules/test_description_rule" page

        When I type in the "certificate-mapping-tab-settings-textbox-description" textbox text "Test description"
        Then I should see "Test description" in the "certificate-mapping-tab-settings-textbox-description" textbox

        When I click on the "certificate-mapping-tab-settings-button-save" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete cert mapping rule "test_description_rule"
        Given I delete certmaprule "test_description_rule"

    @seed
    Scenario: Create cert mapping rule for mapping rule test
        Given certmaprule "test_mapping_rule" exists

    @test
    Scenario: Set mapping rule
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules/test_mapping_rule" page

        When I type in the "certificate-mapping-tab-settings-textbox-ipacertmapmaprule" textbox text "(ipacertsubject=.*,O=EXAMPLE.ORG)"
        Then I should see "(ipacertsubject=.*,O=EXAMPLE.ORG)" in the "certificate-mapping-tab-settings-textbox-ipacertmapmaprule" textbox

        When I click on the "certificate-mapping-tab-settings-button-save" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete cert mapping rule "test_mapping_rule"
        Given I delete certmaprule "test_mapping_rule"

    @seed
    Scenario: Create cert mapping rule for matching rule test
        Given certmaprule "test_matching_rule" exists

    @test
    Scenario: Set matching rule
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules/test_matching_rule" page

        When I type in the "certificate-mapping-tab-settings-textbox-ipacertmapmatchrule" textbox text "<ISSUER>CN=CA,O=EXAMPLE.ORG"
        Then I should see "<ISSUER>CN=CA,O=EXAMPLE.ORG" in the "certificate-mapping-tab-settings-textbox-ipacertmapmatchrule" textbox

        When I click on the "certificate-mapping-tab-settings-button-save" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete cert mapping rule "test_matching_rule"
        Given I delete certmaprule "test_matching_rule"

    @seed
    Scenario: Create cert mapping rule for domain name test
        Given certmaprule "test_domain_rule" exists

    @test
    Scenario: Add domain name
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules/test_domain_rule" page

        When I add "ipa.test" to "certificate-mapping-tab-settings-textbox-associateddomain" textbox list
        Then I should see "ipa.test" in the "certificate-mapping-tab-settings-textbox-associateddomain" textbox list

        When I click on the "certificate-mapping-tab-settings-button-save" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete cert mapping rule "test_domain_rule"
        Given I delete certmaprule "test_domain_rule"

    @seed
    Scenario: Create cert mapping rule for priority test
        Given certmaprule "test_priority_rule" exists

    @test
    Scenario: Set priority
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules/test_priority_rule" page

        When I type in the "certificate-mapping-tab-settings-textbox-ipacertmappriority" textbox text "5"
        Then I should see "5" in the "certificate-mapping-tab-settings-textbox-ipacertmappriority" textbox

        When I click on the "certificate-mapping-tab-settings-button-save" button
        Then I should see "success" alert

    @cleanup
    Scenario: Delete cert mapping rule "test_priority_rule"
        Given I delete certmaprule "test_priority_rule"

    @seed
    Scenario: Create cert mapping rule for enable/disable tests
        Given certmaprule "test_enable_disable_rule" exists

    @test
    Scenario: Disable rule via kebab
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules/test_enable_disable_rule" page

        When I click on the "certificate-mapping-tab-settings-kebab" kebab menu
        Then I should see "certificate-mapping-tab-settings-kebab" kebab menu expanded

        When I click on the "certificate-mapping-tab-settings-kebab-disable" button
        Then I should see "enable-disable-rule-modal" modal

        When I click on the "modal-button-ok" button
        Then I should not see "enable-disable-rule-modal" modal
        And I should see "success" alert

    @test
    Scenario: Enable rule via kebab
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules/test_enable_disable_rule" page

        When I click on the "certificate-mapping-tab-settings-kebab" kebab menu
        Then I should see "certificate-mapping-tab-settings-kebab" kebab menu expanded

        When I click on the "certificate-mapping-tab-settings-kebab-enable" button
        Then I should see "enable-disable-rule-modal" modal

        When I click on the "modal-button-ok" button
        Then I should not see "enable-disable-rule-modal" modal
        And I should see "success" alert

    @cleanup
    Scenario: Delete cert mapping rule "test_enable_disable_rule"
        Given I delete certmaprule "test_enable_disable_rule"

    @seed
    Scenario: Create cert mapping rule for delete test
        Given certmaprule "test_delete_settings_rule" exists

    @test
    Scenario: Delete rule via kebab
        Given I am logged in as admin
        And I am on "cert-id-mapping-rules/test_delete_settings_rule" page

        When I click on the "certificate-mapping-tab-settings-kebab" kebab menu
        Then I should see "certificate-mapping-tab-settings-kebab" kebab menu expanded

        When I click on the "certificate-mapping-tab-settings-kebab-delete" button
        Then I should see "delete-rule-modal" modal

        When I click on the "modal-button-ok" button
        Then I should not see "delete-rule-modal" modal
        And I should see "success" alert
        And I should be on "cert-id-mapping-rules" page
