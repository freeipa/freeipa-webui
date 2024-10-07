Feature: ID Override user manipulation
  Create, and delete ID override users

  Background:
    Given I am logged in as "Administrator"
    Given I am on "id-views" page

  # Add our setup entries (users and id view)
  Scenario: Add one user after another
    Given I am on "active-users" page
    When I click on "Add" button
    * I type in the field "User login" text "overrideuser1"
    * I type in the field "First name" text "Chain"
    * I type in the field "Last name" text "User1"
    * I type in the field "New password" text "CorrectHorseBatteryStaple"
    * I type in the field "Verify password" text "CorrectHorseBatteryStaple"
    * in the modal dialog I click on "Add and add another" button

    When I type in the field "User login" text "overrideuser2"
    * I type in the field "First name" text "Chain"
    * I type in the field "Last name" text "User2"
    * I type in the field "New password" text "IncorrectHorseBatteryStaple"
    * I type in the field "Verify password" text "IncorrectHorseBatteryStaple"
    * in the modal dialog I click on "Add" button
    Then I should see "overrideuser1" entry in the data table
    Then I should see "overrideuser2" entry in the data table

  Scenario: Add a new view
    When I click on "Add" button
    * I type in the field "ID view name" text "override_view"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New ID view added"
    Then I should see "override_view" entry in the data table

  #
  # Start testing override users
  #
  Scenario: Add override user
    Given I click on "override_view" entry in the data table
    Given I click on "Overrides" page tab
    Given I click on "Users" page tab
    Then I click on "Add" button
    And I click in the "User to override" selector field
    Then I select "overrideuser1" option in the "User to override" selector
    * I type in the field "User login" text "myoverrideuser"
    * I type in the field "Home directory" text "/home/user"
    * I type in the field "Description" text "my description"
    * I type in the field "GECOS" text "my gecos"
    * I type in the field "Login shell" text "/bin/ksh"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New override user added"
    When I close the alert
    And I click in the "User to override" selector field
    Then I select "overrideuser2" option in the "User to override" selector
    * I type in the field "User login" text "myoverrideuser2"
    * I type in the field "Home directory" text "/home/user2"
    * I type in the field "Description" text "my description2"
    * I type in the field "GECOS" text "my gecos2"
    * I type in the field "Login shell" text "/bin/ksh"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New override user added"
    Then I should see "overrideuser2" entry in the data table
    And I should see the "user" tab count is "2"

  Scenario: Search for a user
    When I type "overrideuser1" in the search field
    Then I should see the "overrideuser1" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "overrideuser1" in the table
    Then I should not see the element "overrideuser2" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see the element "overrideuser1" in the table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search
    And I should see the element "overrideuser1" in the table
    And I should see the element "overrideuser2" in the table

  Scenario: Delete an override user
    Given I should see "overrideuser1" entry in the data table
    Then I select entry "overrideuser1" in the data table
    When I click on "Delete" button
    * I see "Remove override users" modal
    * I should see "overrideuser1" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Override users removed"
    Then I should not see "overrideuser1" entry in the data table
    And I should see the "user" tab count is "1"

  # Cleanup
  Scenario: Delete users
    Given I am on "active-users" page
    Given I should see "overrideuser1" entry in the data table
    Given I should see "overrideuser1" entry in the data table
    When I select entry "overrideuser1" in the data table
    And I select entry "overrideuser2" in the data table
    And I click on "Delete" button
    Then I see "Remove Active Users" modal
    * I should see "overrideuser1" entry in the data table
    * I should see "overrideuser2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Users removed"
    Then I should not see "overrideuser1" entry in the data table
    Then I should not see "overrideuser2" entry in the data table

  Scenario: Delete a view
    Given I am on "id-views" page
    Given I should see "override_view" entry in the data table
    Then I select entry "override_view" in the data table
    When I click on "Delete" button
    * I see "Remove ID views" modal
    * I should see "override_view" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "ID views removed"
    Then I should not see "override_view" entry in the data table
