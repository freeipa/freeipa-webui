Feature: ID Override group manipulation
  Create, and delete ID override groups

  Background:
    Given I am logged in as "Administrator"
    Given I am on "id-views" page

  # Add our setup entries (groups and id view)
  Scenario: Add one group after another
    Given I am on "user-groups" page
    When I click on "Add" button
    And I type in the field "Group name" text "overridegroup1"
    Then in the modal dialog I click on "Add and add another" button
    When I type in the field "Group name" text "overridegroup2"
    Then in the modal dialog I click on "Add" button
    And I should see "overridegroup1" entry in the data table
    And I should see "overridegroup2" entry in the data table

  Scenario: Add a new view
    When I click on "Add" button
    And I type in the field "ID view name" text "override_group_view"
    Then in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "New ID view added"
    And I should see "override_group_view" entry in the data table

  #
  # Start testing override groups
  #
  Scenario: Add override group
    Given I click on "override_group_view" entry in the data table
    Given I click on "Overrides" page tab
    Given I click on "User groups" page tab
    Then I click on "Add" button
    And I click in the "Group to override" selector field
    Then I select "overridegroup1" option in the "Group to override" selector
    * I type in the field "Group name" text "myoverridegroup1"
    * I type in the field "Description" text "my description2"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New override group added"
    When I close the alert
    And I click in the "Group to override" selector field
    Then I select "overridegroup2" option in the "Group to override" selector
    * I type in the field "Group name" text "myoverridegroup2"
    * I type in the field "Description" text "my description2"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New override group added"
    Then I should see "overridegroup2" entry in the data table
    And I should see the "group" tab count is "2"

  Scenario: Search for a group
    When I type "overridegroup1" in the search field
    Then I should see the "overridegroup1" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "overridegroup1" in the table
    Then I should not see the element "overridegroup2" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see the element "overridegroup1" in the table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search
    And I should see the element "overridegroup1" in the table
    And I should see the element "overridegroup2" in the table

  Scenario: Delete an override group
    Given I should see "overridegroup1" entry in the data table
    Then I select entry "overridegroup1" in the data table
    When I click on "Delete" button
    * I see "Remove override groups" modal
    * I should see "overridegroup1" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Override groups removed"
    Then I should not see "overridegroup1" entry in the data table
    And I should see the "group" tab count is "1"

  # Cleanup
  Scenario: Delete groups
    Given I am on "user-groups" page
    Given I should see "overridegroup1" entry in the data table
    Given I should see "overridegroup1" entry in the data table
    When I select entry "overridegroup1" in the data table
    And I select entry "overridegroup2" in the data table
    And I click on "Delete" button
    Then I see "Remove user groups" modal
    * I should see "overridegroup1" entry in the data table
    * I should see "overridegroup2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
    Then I should not see "overridegroup1" entry in the data table
    Then I should not see "overridegroup2" entry in the data table

  Scenario: Delete a view
    Given I am on "id-views" page
    Given I should see "override_group_view" entry in the data table
    Then I select entry "override_group_view" in the data table
    When I click on "Delete" button
    * I see "Remove ID views" modal
    * I should see "override_group_view" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "ID views removed"
    Then I should not see "override_group_view" entry in the data table
