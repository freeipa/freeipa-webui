Feature: User is a member of
  Work with user Is a member of section and its operations in all the available tabs

  # TODO: Add pending tests for:
  #          - 'Roles', 'HBAC rules', and 'Sudo rules' tabs
  #          - Elements to add match with the ones available (in other pages)
  #          - Membership
  #          - Pagination functionality (with more elements in the table)

  Background:
    Given I am logged in as "Administrator"
    Given I am on "active-users" page
    Given sample testing user "armadillo" exists
    Given I click on "armadillo" entry in the data table
    Given I click on the Is a member of section
    Given I am on "armadillo" user > Is a member of > "User groups" section

  # 'User groups' tab
  Scenario: Default user groups are displayed in the table
    When I click on the "User groups" tab within Is a member of section
    Then I should see "User groups" tab is selected
    And I should see the table with "Group name" column
    And I should see the table with "GID" column
    And I should see the table with "Description" column
    And I should see the element "ipausers" in the table

  Scenario: Add a set of users into the user groups
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'armadillo' into User groups"
    When I move user "editors" from the available list and move it to the chosen options
    # TODO: Aditionally, add more users to the chosen options
    And in the modal dialog I click on "Add" button
    Then I should see the element "editors" in the table
    And I should see the element "ipausers" in the table
    * I should not see the element "editors" in the add list

  Scenario: Search for a user group
    When I type "editors" in the search field
    Then I should see the "editors" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "editors" in the table
    And I should not see the element "ipausers" in the table

  Scenario: Delete a set of users from the user groups
    When I select entry "editors" in the data table
    # TODO: Additionally, select more users to remove
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete user from user groups"
    And the "editors" group name should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed members from user group 'armadillo'"
    And I should not see the element "editors" in the table
    * I should see the element "ipausers" in the table
    * removed element "editors" is back to the add list

  # 'Netgroups' tab
  Scenario: Default user groups are displayed in the table
    When I click on the "User groups" tab within Is a member of section
    Then I should see "User groups" tab is selected
    And I should see the table with "Group name" column
    And I should see the table with "GID" column
    And I should see the table with "Description" column
    And I should see the element "ipausers" in the table

  Scenario: Add a set of users into the user groups
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Add 'armadillo' into User groups"
    When I move user "editors" from the available list and move it to the chosen options
    # TODO: Aditionally, add more users to the chosen options
    And in the modal dialog I click on "Add" button
    Then I should see the element "editors" in the table
    And I should see the element "ipausers" in the table

  Scenario: Search for a user group
    When I type "editors" in the search field
    Then I should see the "editors" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "editors" in the table
    And I should not see the element "ipausers" in the table

  Scenario: Delete a set of users from the user groups
    When I select entry "editors" in the data table
    # TODO: Additionally, select more users to remove
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete user from user groups"
    And the "editors" group name should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed members from user group 'armadillo'"
    And I should not see the element "editors" in the table
    * I should see the element "ipausers" in the table
