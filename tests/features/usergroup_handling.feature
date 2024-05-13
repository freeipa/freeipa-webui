Feature: User group manipulation
  Create, and delete user groups

  Background:
    Given I am logged in as "Administrator"
    Given I am on "user-groups" page

  Scenario: Add a new posix group
    When I click on "Add" button
    * I type in the field "Group name" text "a_posix_group"
    Then TextInput "modal-form-group-gid" should be enabled
    * I type in the field "GID" text "77777"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    Then I should see "a_posix_group" entry in the data table
    * entry "a_posix_group" should have attribute "GID" set to "77777"

  Scenario: Add a new non-posix group
    When I click on "Add" button
    * I type in the field "Group name" text "a_nonposix_group"
    * I type in the field "Description" text "non-posix group"
    * I type in the field "GID" text "88888"
    Then I select "Non-posix" in the "Group type" form selector field
    * I should see a new empty text input field with ID "modal-form-group-gid"
    * TextInput "modal-form-group-gid" should be disabled
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    Then I should see "a_nonposix_group" entry in the data table
    * entry "a_nonposix_group" should have attribute "Description" set to "non-posix group"

  Scenario: Add a new external group
    When I click on "Add" button
    * I type in the field "Group name" text "an_external_group"
    * I type in the field "Description" text "external group"
    * I type in the field "GID" text "99999"
    Then I select "External" in the "Group type" form selector field
    * I should see a new empty text input field with ID "modal-form-group-gid"
    * TextInput "modal-form-group-gid" should be disabled
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    Then I should see "an_external_group" entry in the data table
    * entry "an_external_group" should have attribute "Description" set to "external group"

  Scenario: Add one user after another
    When I click on "Add" button
    * I type in the field "Group name" text "group1"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New user group added"
    Then I type in the field "Group name" text "group2"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    Then I should see "group1" entry in the data table
    Then I should see "group2" entry in the data table

  Scenario: Delete a group
    Given I should see "a_posix_group" entry in the data table
    Then I select entry "a_posix_group" in the data table
    When I click on "Delete" button
    * I see "Remove user groups" modal
    * I should see "a_posix_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
    Then I should not see "a_posix_group" entry in the data table

  Scenario: Delete many groups
    Given I should see "group1" entry in the data table
    Given I should see "group2" entry in the data table
    Given I should see "a_nonposix_group" entry in the data table
    Given I should see "an_external_group" entry in the data table
    Then I select entry "group1" in the data table
    Then I select entry "group2" in the data table
    Then I select entry "a_nonposix_group" in the data table
    Then I select entry "an_external_group" in the data table
    When I click on "Delete" button
    * I see "Remove user groups" modal
    * I should see "group1" entry in the data table
    * I should see "group2" entry in the data table
    * I should see "a_nonposix_group" entry in the data table
    * I should see "an_external_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
    Then I should not see "group1" entry in the data table
    Then I should not see "group2" entry in the data table
    Then I should not see "a_nonposix_group" entry in the data table
    Then I should not see "an_external_group" entry in the data table

  Scenario: Cancel creation of a group
    When I click on "Add" button
    * I type in the field "Group name" text "cancelgroup"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "cancelgroup" entry in the data table

