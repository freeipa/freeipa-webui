Feature: Automember > Settings page
    Modify automember settings

    @seed
    Scenario: Prep: Create a new user group to work with
        Given user group rule "my_automember_usergroup" exists

    @test
    Scenario: Set 'Description' textarea field
        Given I am logged in as admin
        And I am on "user-group-rules/my_automember_usergroup" page

        When I type in the "auto-member-tab-settings-textbox-description" textbox text "This is a test user group rule"
        Then I should see "This is a test user group rule" in the "auto-member-tab-settings-textbox-description" textbox

        When I click on the "auto-member-tab-settings-button-save" button
        Then I should see "save-success" alert
        And I should see "This is a test user group rule" in the "auto-member-tab-settings-textbox-description" textbox

    @cleanup
    Scenario: Delete user group rule
        Given I delete user group rule "my_automember_usergroup"
        And I delete user group "my_automember_usergroup"

    @seed
    Scenario: Prep: Create a new user group to work with
        Given user group rule "my_automember_usergroup" exists

    @test
    Scenario: Add a new inclusive user group rule
        Given I am logged in as admin
        And I am on "user-group-rules/my_automember_usergroup" page

        When I click on the "settings-button-add-automemberinclusiveregex" button
        Then I should see "add-automember-condition-modal" modal

        When I select "departmentnumber" option in the "modal-attribute-select" selector
        Then I should see "departmentnumber" option in the "modal-attribute-select" selector

        When I type in the "modal-textbox-expression" textbox text "my-department"
        Then I should see "my-department" in the "modal-textbox-expression" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-automember-condition-success" alert
        And I should see "my-department" entry in the data table with ID "automemberinclusiveregex-table"

    @cleanup
    Scenario: Delete user group rule
        Given I delete user group rule "my_automember_usergroup"
        And I delete user group "my_automember_usergroup"

    @seed
    Scenario: Prep: Create a new user group to work with
        Given user group rule "my_automember_usergroup" exists

    @test
    Scenario: Add a new exclusive user group rule
        Given I am logged in as admin
        And I am on "user-group-rules/my_automember_usergroup" page

        When I click on the "settings-button-add-automemberexclusiveregex" button
        Then I should see "add-automember-condition-modal" modal

        When I select "carlicense" option in the "modal-attribute-select" selector
        Then I should see "carlicense" option in the "modal-attribute-select" selector

        When I type in the "modal-textbox-expression" textbox text "license123"
        Then I should see "license123" in the "modal-textbox-expression" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-automember-condition-success" alert
        And I should see "license123" entry in the data table with ID "automemberexclusiveregex-table"

    @cleanup
    Scenario: Delete user group rule
        Given I delete user group rule "my_automember_usergroup"
        And I delete user group "my_automember_usergroup"

    @seed
    Scenario: Prep: Create a new host group rule to work with
        Given hostgroup rule "my_automember_hostgroup" exists

    @test
    Scenario: Set 'Description' textarea field for host group rule
        Given I am logged in as admin
        And I am on "host-group-rules/my_automember_hostgroup" page

        When I type in the "auto-member-tab-settings-textbox-description" textbox text "This is a test host group rule"
        Then I should see "This is a test host group rule" in the "auto-member-tab-settings-textbox-description" textbox

        When I click on the "auto-member-tab-settings-button-save" button
        Then I should see "save-success" alert
        And I should see "This is a test host group rule" in the "auto-member-tab-settings-textbox-description" textbox

    @cleanup
    Scenario: Delete host group rule
        Given I delete hostgroup rule "my_automember_hostgroup"
        And I delete hostgroup "my_automember_hostgroup"

    @seed
    Scenario: Prep: Create a new host group to work with
        Given hostgroup rule "my_automember_hostgroup" exists

    # 'Inclusive' subsection
    Scenario: Add a new inclusive host group rule
        Given I am logged in as admin
        And I am on "host-group-rules/my_automember_hostgroup" page

        When I click on the "settings-button-add-automemberinclusiveregex" button
        Then I should see "add-automember-condition-modal" modal

        When I select "departmentnumber" option in the "modal-attribute-select" selector
        Then I should see "departmentnumber" option in the "modal-attribute-select" selector

        When I type in the "modal-textbox-expression" textbox text "my-department"
        Then I should see "my-department" in the "modal-textbox-expression" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-automember-condition-success" alert
        And I should see "my-department" entry in the data table with ID "automemberinclusiveregex-table"

    @cleanup
    Scenario: Delete host group rule
        Given I delete hostgroup rule "my_automember_hostgroup"
        And I delete hostgroup "my_automember_hostgroup"

    @seed
    Scenario: Prep: Create a new host group to work with
        Given hostgroup rule "my_automember_hostgroup" exists

    @test
    Scenario: Add a new exclusive host group rule
        Given I am logged in as admin
        And I am on "host-group-rules/my_automember_hostgroup" page

        When I click on the "settings-button-add-automemberexclusiveregex" button
        Then I should see "add-automember-condition-modal" modal

        When I select "employeetype" option in the "modal-attribute-select" selector
        Then I should see "employeetype" option in the "modal-attribute-select" selector

        When I type in the "modal-textbox-expression" textbox text "Software engineer"
        Then I should see "Software engineer" in the "modal-textbox-expression" textbox

        When I click on the "modal-button-add" button
        Then I should see "add-automember-condition-success" alert
        And I should see "Software engineer" entry in the data table with ID "automemberexclusiveregex-table"

    @cleanup
    Scenario: Delete host group rule
        Given I delete hostgroup rule "my_automember_hostgroup"
        And I delete hostgroup "my_automember_hostgroup"

    @seed
    Scenario: Prep: Create a new host group to work with
        Given hostgroup rule "my_automember_hostgroup" exists and has inclusive entry "my-department" with category "businesscategory"

    @test
    Scenario: Host group rule: Delete inclusive entry from table
        Given I am logged in as admin
        And I am on "host-group-rules/my_automember_hostgroup" page

        When I select "my-department" entry in the data table with ID "automemberinclusiveregex-table"
        Then I should see "my-department" entry selected in the data table with ID "automemberinclusiveregex-table"

        When I click on the "settings-button-delete-automemberinclusiveregex" button
        Then I should see "member-of-delete-modal" modal

        When I click on the "modal-button-delete" button
        Then I should see "remove-condition-success" alert
        Then I should see no table with ID "automemberinclusiveregex-table"

    @cleanup
    Scenario: Delete host group rule
        Given I delete hostgroup rule "my_automember_hostgroup"
        And I delete hostgroup "my_automember_hostgroup"

    @seed
    Scenario: Prep: Create a new user group to work with
        Given user group rule "my_automember_usergroup" exists and has inclusive entry "my-department" with category "businesscategory"

    @test
    Scenario: User group rule: Delete inclusive entry from table
        Given I am logged in as admin
        And I am on "user-group-rules/my_automember_usergroup" page

        When I select "my-department" entry in the data table with ID "automemberinclusiveregex-table"
        Then I should see "my-department" entry selected in the data table with ID "automemberinclusiveregex-table"

        When I click on the "settings-button-delete-automemberinclusiveregex" button
        Then I should see "member-of-delete-modal" modal

        When I click on the "modal-button-delete" button
        Then I should see "remove-condition-success" alert
        Then I should see no table with ID "automemberinclusiveregex-table"

    @cleanup
    Scenario: Delete user group rule
        Given I delete user group rule "my_automember_usergroup"
        And I delete user group "my_automember_usergroup"
