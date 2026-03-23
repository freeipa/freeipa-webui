Feature: ID Range manipulation
    Create, and delete ID ranges

    @test
    Scenario: Add a new ID range (local domain)
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "IDM.EXAMPLE.COM_new_range"
        Then I should see "IDM.EXAMPLE.COM_new_range" in the "modal-textbox-range-name" textbox

        When I type in the "modal-textbox-base-id-input" textbox text "5000"
        Then I should see "5000" in the "modal-textbox-base-id-input" textbox

        When I type in the "modal-textbox-range-size-input" textbox text "1000"
        Then I should see "1000" in the "modal-textbox-range-size-input" textbox

        When I type in the "modal-textbox-primary-rid-base-input" textbox text "30000"
        Then I should see "30000" in the "modal-textbox-primary-rid-base-input" textbox

        When I type in the "modal-textbox-secondary-rid-base-input" textbox text "1300000"
        Then I should see "1300000" in the "modal-textbox-secondary-rid-base-input" textbox

        When I click on the "modal-button-add" button
        Then I should not see "add-id-range-modal" modal
        And I should see "add-idrange-success" alert

        When I search for "IDM.EXAMPLE.COM_new_range" in the data table
        Then I should see "IDM.EXAMPLE.COM_new_range" entry in the data table

    @cleanup
    Scenario: Delete a ID range
        Given I delete id range "IDM.EXAMPLE.COM_new_range"

    @test
    Scenario: Add a new ID range with special characters in the name
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "itest-range-!@#$%^&*"
        Then I should see "itest-range-!@#$%^&*" in the "modal-textbox-range-name" textbox

        When I type in the "modal-textbox-base-id-input" textbox text "5000"
        Then I should see "5000" in the "modal-textbox-base-id-input" textbox

        When I type in the "modal-textbox-range-size-input" textbox text "1000"
        Then I should see "1000" in the "modal-textbox-range-size-input" textbox

        When I type in the "modal-textbox-primary-rid-base-input" textbox text "30000"
        Then I should see "30000" in the "modal-textbox-primary-rid-base-input" textbox

        When I type in the "modal-textbox-secondary-rid-base-input" textbox text "1300000"
        Then I should see "1300000" in the "modal-textbox-secondary-rid-base-input" textbox

        When I click on the "modal-button-add" button
        Then I should not see "add-id-range-modal" modal
        And I should see "add-idrange-success" alert

        When I search for "itest-range-!@#$%^&*" in the data table
        Then I should see "itest-range-!@#$%^&*" entry in the data table

    @cleanup
    Scenario: Delete a ID range with special characters in the name
        Given I delete id range "itest-range-!@#$%^&*"

    @seed
    Scenario: Create a ID range
        Given id range "IDM.EXAMPLE.COM_exists" exists with base ID "5000", range size "1000", primary RID base "30000", and secondary RID base "1300000"

    @test
    Scenario: Add a new ID range with existing name
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "IDM.EXAMPLE.COM_exists"
        Then I should see "IDM.EXAMPLE.COM_exists" in the "modal-textbox-range-name" textbox

        When I type in the "modal-textbox-base-id-input" textbox text "5000"
        Then I should see "5000" in the "modal-textbox-base-id-input" textbox

        When I type in the "modal-textbox-range-size-input" textbox text "1000"
        Then I should see "1000" in the "modal-textbox-range-size-input" textbox

        When I type in the "modal-textbox-primary-rid-base-input" textbox text "30000"
        Then I should see "30000" in the "modal-textbox-primary-rid-base-input" textbox

        When I type in the "modal-textbox-secondary-rid-base-input" textbox text "1300000"
        Then I should see "1300000" in the "modal-textbox-secondary-rid-base-input" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-id-range-modal" modal
        And I should see "add-idrange-error" alert

        When I click on the "modal-button-cancel" button
        Then I should not see "add-id-range-modal" modal

    @cleanup
    Scenario: Delete a ID range with existing name
        Given I delete id range "IDM.EXAMPLE.COM_exists"

    @seed
    Scenario: Create a ID range
        Given id range "IDM.EXAMPLE.COM_new_range" exists with base ID "5000", range size "1000", primary RID base "30000", and secondary RID base "1300000"

    @test
    Scenario: Delete a ID range
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I search for "IDM.EXAMPLE.COM_new_range" in the data table
        Then I should see "IDM.EXAMPLE.COM_new_range" entry in the data table

        When I select entry "IDM.EXAMPLE.COM_new_range" in the data table
        Then I should see "IDM.EXAMPLE.COM_new_range" entry selected in the data table

        When I click on the "id-ranges-button-delete" button
        Then I should see "delete-idranges-modal" modal

        When I click on the "modal-button-delete" button
        Then I should not see "delete-idranges-modal" modal
        And I should see "remove-idranges-success" alert

        When I search for "IDM.EXAMPLE.COM_new_range" in the data table
        Then I should not see "IDM.EXAMPLE.COM_new_range" entry in the data table

    @test
    Scenario: Cancel creation of a ID range
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "cancel_id_range"
        Then I should see "cancel_id_range" in the "modal-textbox-range-name" textbox

        When I click on the "modal-button-cancel" button
        Then I should not see "add-id-range-modal" modal

        When I search for "cancel_id_range" in the data table
        Then I should not see "cancel_id_range" entry in the data table

    @test
    Scenario: Add a new ID range (AD trust) that fails due to missing trust
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "fail_id_range"
        Then I should see "fail_id_range" in the "modal-textbox-range-name" textbox

        When I click on the "ad-domain-radio" radio button
        Then I should see the "ad-domain-radio" radio button is selected

        When I type in the "modal-textbox-base-id-input" textbox text "5000"
        Then I should see "5000" in the "modal-textbox-base-id-input" textbox

        When I type in the "modal-textbox-range-size-input" textbox text "1000"
        Then I should see "1000" in the "modal-textbox-range-size-input" textbox

        When I type in the "modal-textbox-primary-rid-base-input" textbox text "30000"
        Then I should see "30000" in the "modal-textbox-primary-rid-base-input" textbox

        When I type in the "modal-textbox-trusted-domain" textbox text "ad.ipa.test"
        Then I should see "ad.ipa.test" in the "modal-textbox-trusted-domain" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-id-range-modal" modal
        And I should see "add-idrange-error" alert

        When I click on the "modal-button-cancel" button
        Then I should not see "add-id-range-modal" modal

    @seed
    Scenario: Create a ID range
        Given id range "IDM.EXAMPLE.COM_exists_base_id" exists with base ID "5000", range size "1000", primary RID base "30000", and secondary RID base "1300000"

    @test
    Scenario: Add a new ID range (AD trust with POSIX attributes) that fails due to missing trust and existing base ID
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "IDM.EXAMPLE.COM_exists_base_id"
        Then I should see "IDM.EXAMPLE.COM_exists_base_id" in the "modal-textbox-range-name" textbox

        When I click on the "range-type-radio" radio button
        Then I should see the "range-type-radio" radio button is selected

        When I type in the "modal-textbox-base-id-input" textbox text "5000"
        Then I should see "5000" in the "modal-textbox-base-id-input" textbox

        When I type in the "modal-textbox-range-size-input" textbox text "1000"
        Then I should see "1000" in the "modal-textbox-range-size-input" textbox

        When I type in the "modal-textbox-trusted-domain" textbox text "ad.ipa.test"
        Then I should see "ad.ipa.test" in the "modal-textbox-trusted-domain" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-id-range-modal" modal
        And I should see "add-idrange-error" alert

        When I click on the "modal-button-cancel" button
        Then I should not see "add-id-range-modal" modal

    @cleanup
    Scenario: Delete a ID range with existing base ID
        Given I delete id range "IDM.EXAMPLE.COM_exists_base_id"

    @seed
    Scenario: Create a ID range
        Given id range "IDM.EXAMPLE.COM_exists_secondary_rid_base" exists with base ID "5000", range size "1000", primary RID base "30000", and secondary RID base "1300000"

    @test
    Scenario: Add a new ID range with existing secondary RID base
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "IDM.EXAMPLE.COM_exists_secondary_rid_base"
        Then I should see "IDM.EXAMPLE.COM_exists_secondary_rid_base" in the "modal-textbox-range-name" textbox

        When I type in the "modal-textbox-base-id-input" textbox text "5000"
        Then I should see "5000" in the "modal-textbox-base-id-input" textbox

        When I type in the "modal-textbox-range-size-input" textbox text "1000"
        Then I should see "1000" in the "modal-textbox-range-size-input" textbox

        When I type in the "modal-textbox-primary-rid-base-input" textbox text "30000"
        Then I should see "30000" in the "modal-textbox-primary-rid-base-input" textbox

        When I type in the "modal-textbox-secondary-rid-base-input" textbox text "1300000"
        Then I should see "1300000" in the "modal-textbox-secondary-rid-base-input" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-id-range-modal" modal
        And I should see "add-idrange-error" alert

        When I click on the "modal-button-cancel" button
        Then I should not see "add-id-range-modal" modal

    @cleanup
    Scenario: Delete a ID range with existing secondary RID base
        Given I delete id range "IDM.EXAMPLE.COM_exists_secondary_rid_base"

    @seed
    Scenario: Create a ID range
        Given id range "IDM.EXAMPLE.COM_exists_overlapping_rid_bases" exists with base ID "5000", range size "1000", primary RID base "30000", and secondary RID base "1300000"

    @test
    Scenario: Add a new ID range with overlapping primary and secondary RID bases
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "IDM.EXAMPLE.COM_exists_overlapping_rid_bases"
        Then I should see "IDM.EXAMPLE.COM_exists_overlapping_rid_bases" in the "modal-textbox-range-name" textbox

        When I type in the "modal-textbox-base-id-input" textbox text "5000"
        Then I should see "5000" in the "modal-textbox-base-id-input" textbox

        When I type in the "modal-textbox-range-size-input" textbox text "1000"
        Then I should see "1000" in the "modal-textbox-range-size-input" textbox

        When I type in the "modal-textbox-primary-rid-base-input" textbox text "30000"
        Then I should see "30000" in the "modal-textbox-primary-rid-base-input" textbox

        When I type in the "modal-textbox-secondary-rid-base-input" textbox text "1300000"
        Then I should see "1300000" in the "modal-textbox-secondary-rid-base-input" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-id-range-modal" modal
        And I should see "add-idrange-error" alert

        When I click on the "modal-button-cancel" button
        Then I should not see "add-id-range-modal" modal

    @cleanup
    Scenario: Delete a ID range with overlapping primary and secondary RID bases
        Given I delete id range "IDM.EXAMPLE.COM_exists_overlapping_rid_bases"

    @test
    Scenario: Add a new ID range without any of the required fields (e.g. secondary RID base)
        Given I am logged in as admin
        And I am on "id-ranges" page

        When I click on the "id-ranges-button-add" button
        Then I should see "add-id-range-modal" modal

        When I type in the "modal-textbox-range-name" textbox text "fail_id_range_no_fields"
        Then I should see "fail_id_range_no_fields" in the "modal-textbox-range-name" textbox

        When I type in the "modal-textbox-base-id-input" textbox text "5000"
        Then I should see "5000" in the "modal-textbox-base-id-input" textbox

        When I type in the "modal-textbox-range-size-input" textbox text "1000"
        Then I should see "1000" in the "modal-textbox-range-size-input" textbox

        When I type in the "modal-textbox-primary-rid-base-input" textbox text "30000"
        Then I should see "30000" in the "modal-textbox-primary-rid-base-input" textbox

        When I should see the "modal-button-add" button is disabled
        Then I click on the "modal-button-cancel" button
