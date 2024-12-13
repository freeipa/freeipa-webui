Feature: Contextual help links panel
  Check the contextual help links panel

  Background:
    Given I am logged in as "Administrator"

  # Active users page
  Scenario: Open the contextual help links panel on 'active-users' main page
    Given I am on "active-users" page
    When I click on "Help" button
    Then I should see contextual help panel
    And I should see a title "Links" in the panel
    * I should see a list of links

  Scenario: Close the contextual help links panel on 'Active users' main page
    Given I am on "active-users" page
    Given I should see contextual help panel
    When I click on close button in the panel
    Then I should not see contextual help panel



