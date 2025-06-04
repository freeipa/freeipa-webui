Feature: Automember > Settings page
    Modify automember settings

    Background:
        Given I am logged in as "Administrator"

    # Prep: Create test User group entry
    Scenario: Prep: Create a new user group to work with
        Given I am on "user-groups" page
        When I click on "Add" button
        * I type in the field "Group name" text "my_usergroup"
        When in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New user group added"
        When I close the alert
        Then I should see "my_usergroup" entry in the data table

    Scenario: Prep: Add a new automember user group rule
        Given I am on "user-group-rules" page
        When I click on "Add" button
        * I click in the "Automember" selector field
        * I select "my_usergroup" option in the "Automember" selector
        * in the modal dialog I click on "Add" button
        * I should see "success" alert with text "Entry successfully added"
        When I close the alert
        Then I should see "my_usergroup" entry in the data table

    # 'General' subsection
    Scenario: Set 'Description' textarea field
        Given I am on the "user-group-rules" > "my_usergroup" Settings page
        When I type in the textarea "description" text "This is a test user group rule"
        And I click on "Save" button
        And I should see "success" alert with text "Entry updated"
        Then I close the alert
        And Then I should see "This is a test user group rule" in the textarea "description"

    # 'Inclusive' subsection
    Scenario: Add a new inclusive user group rule
        When I click on ID "add-inclusive-condition" button
        Then I see "Add inclusive conditions" modal
        * in the modal, I select "departmentnumber" option in the "Attribute" selector
        * In the modal, I type into the field with ID "expression" text "my_department"
        When in the modal dialog I click on "Add" button
        And I should see "success" alert with text "Automember condition added"
        Then I close the alert
        And I should see "my_department" entry in the data table with ID "automemberinclusiveregex-table" and no link

    # 'Exclusive' subsection
    Scenario: Add a new exclusive user group rule
        When I click on ID "add-exclusive-condition" button
        Then I see "Add exclusive conditions" modal
        * in the modal, I select "carlicense" option in the "Attribute" selector
        * In the modal, I type into the field with ID "expression" text "license123"
        When in the modal dialog I click on "Add" button
        And I should see "success" alert with text "Automember condition added"
        Then I close the alert
        And I should see "license123" entry in the data table with ID "automemberexclusiveregex-table" and no link

    # Cleanup: Remove the test User group entry and rule
    Scenario: Cleanup: Delete the user group rule
        Given I click on the breadcrump link "User group rule"
        Given I should see "my_usergroup" entry in the data table
        Then I select entry "my_usergroup" in the data table
        When I click on "Delete" button
        * I see "Remove auto membership rules" modal
        * I should see "my_usergroup" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "The selected rules have been removed successfully"
        When I close the alert
        Then I should not see "my_usergroup" entry in the data table

    Scenario: Cleanup: Delete the user group
        Given I am on "user-groups" page
        Given I should see "my_usergroup" entry in the data table
        Then I select entry "my_usergroup" in the data table
        When I click on "Delete" button
        * I see "Remove user groups" modal
        * I should see "my_usergroup" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "User groups removed"
        When I close the alert
        Then I should not see "my_usergroup" entry in the data table

    # Prep: Create test Host group entry
    Scenario: Prep: Create a new host group to work with
        Given I am on "host-groups" page
        When I click on "Add" button
        * I type in the field "Group name" text "my_hostgroup"
        When in the modal dialog I click on "Add" button
        * I should see "success" alert with text "New host group added"
        When I close the alert
        Then I should see "my_hostgroup" entry in the data table

    Scenario: Prep: Add a new host rule
        Given I am on "host-group-rules" page
        When I click on "Add" button
        * I click in the "Automember" selector field
        * I select "my_hostgroup" option in the "Automember" selector
        When in the modal dialog I click on "Add" button
        And I should see "success" alert with text "Entry successfully added"
        Then I close the alert
        And I should see "my_hostgroup" entry in the data table

    # 'General' subsection
    Scenario: Set 'Description' textarea field for host group rule
        Given I am on the "host-group-rules" > "my_hostgroup" Settings page
        When I type in the textarea "description" text "This is a test host group rule"
        And I click on "Save" button
        And I should see "success" alert with text "Entry updated"
        Then I close the alert
        And Then I should see "This is a test host group rule" in the textarea "description"

    # 'Inclusive' subsection
    Scenario: Add a new inclusive host group rule
        When I click on ID "add-inclusive-condition" button
        Then I see "Add inclusive conditions" modal
        * in the modal, I select "telephonenumber" option in the "Attribute" selector
        * In the modal, I type into the field with ID "expression" text "123456789"
        When in the modal dialog I click on "Add" button
        And I should see "success" alert with text "Automember condition added"
        Then I close the alert
        And I should see "123456789" entry in the data table with ID "automemberinclusiveregex-table" and no link

    # 'Exclusive' subsection
    Scenario: Add a new exclusive host group rule
        When I click on ID "add-exclusive-condition" button
        Then I see "Add exclusive conditions" modal
        * in the modal, I select "employeetype" option in the "Attribute" selector
        * In the modal, I type into the field with ID "expression" text "Software engineer"
        When in the modal dialog I click on "Add" button
        And I should see "success" alert with text "Automember condition added"
        Then I close the alert
        And I should see "Software engineer" entry in the data table with ID "automemberexclusiveregex-table" and no link

    # Cleanup: Remove the test Host group entry and rule
    Scenario: Cleanup: Delete the host group rule
        Given I click on the breadcrump link "Host group rule"
        Given I should see "my_hostgroup" entry in the data table
        Then I select entry "my_hostgroup" in the data table
        When I click on "Delete" button
        * I see "Remove auto membership rules" modal
        * I should see "my_hostgroup" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "The selected rules have been removed successfully"
        When I close the alert
        Then I should not see "my_hostgroup" entry in the data table

    Scenario: Cleanup: Delete the host group
        Given I am on "host-groups" page
        Given I should see "my_hostgroup" entry in the data table
        Then I select entry "my_hostgroup" in the data table
        When I click on "Delete" button
        * I see "Remove host groups" modal
        * I should see "my_hostgroup" entry in the data table
        When in the modal dialog I click on "Delete" button
        * I should see "success" alert with text "Host groups removed"
        When I close the alert
        Then I should not see "my_hostgroup" entry in the data table

