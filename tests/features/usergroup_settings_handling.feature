Feature: User group settings manipulation
  Modify a group

  Background:
    Given I am logged in as "Administrator"
    Given I am on "user-groups" page

  Scenario: Add two groups
    When I click on "Add" button
    * I type in the field "Group name" text "group1"
    Then I select "Non-posix" in the "Group type" form selector field
    * I should see a new empty text input field with ID "modal-form-group-gid"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New user group added"
    Then I type in the field "Group name" text "group2"
    Then I select "Non-posix" in the "Group type" form selector field
    * I should see a new empty text input field with ID "modal-form-group-gid"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    Then I should see "group1" entry in the data table
    Then I should see "group2" entry in the data table

  Scenario: Set Description
    When I click on "group1" entry in the data table
    Then I click in the field "Description"
    * I type in the textarea "description" text "test"
    Then I click on "Save" button
    * I should see "success" alert with text "User group modified"
    Then Then I should see "test" in the textarea "description"

  Scenario: Convert group to POSIX group
    Given I should see a new empty text input field with ID "gid"
    When I click on the settings kebab menu and select "Change to POSIX group"
    * I see "Change group type" modal
    * I click on "Change Group" button
    Then I should see "success" alert with text "User group changed to POSIX group"
    Then I should see "POSIX" in readonly text input field with ID "group-type"
    * I should see a non-empty readonly text input field with ID "gid"
    * I click on the breadcrump link "User groups"

  Scenario: Convert group to external group
    Given I am on "user-groups" page
    When I click on "group2" entry in the data table
    Given I should see a new empty text input field with ID "gid"
    When I click on the settings kebab menu and select "Change to external group"
    * I see "Change group type" modal
    * I click on "Change Group" button
    Then I should see "success" alert with text "User group changed to external group"
    Then I should see "External" in readonly text input field with ID "group-type"
    * I should see an empty readonly text input field with ID "gid"
    * I click on the breadcrump link "User groups"

  Scenario: Delete the groups for cleanup
    Given I am on "user-groups" page
    Then I should see "group1" entry in the data table
    * I should see "group2" entry in the data table
    * I select entry "group1" in the data table
    * I select entry "group2" in the data table
    When I click on "Delete" button
    * I should see "group1" entry in the data table
    * I should see "group2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
