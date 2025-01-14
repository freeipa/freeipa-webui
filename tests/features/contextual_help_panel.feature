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

  # Stage users page
  Scenario: Open the contextual help links panel on 'stage-users' main page
    Given I am on "stage-users" page
    When I click on "Help" button
    Then I should see contextual help panel
    And I should see a title "Links" in the panel
    * I should see a list of links

  Scenario: Close the contextual help links panel on 'Stage users' main page
    Given I am on "stage-users" page
    Given I should see contextual help panel
    When I click on close button in the panel
    Then I should not see contextual help panel

  # - Stage users > Settings page
  Scenario: Open and close the contextual help links panel on Stage users > Settings page
    Given I am on "stage-users-settings" page
    When I click on "Help" button
    Then I should see contextual help panel
    And I should see a title "Links" in the panel
    * I should see a list of links
    When I click on close button in the panel
    Then I should not see contextual help panel

  # Preserved users page
  Scenario: Open the contextual help links panel on 'preserved-users' main page
    Given I am on "preserved-users" page
    When I click on "Help" button
    Then I should see contextual help panel
    And I should see a title "Links" in the panel
    * I should see a list of links

  Scenario: Close the contextual help links panel on 'Preserved users' main page
    Given I am on "preserved-users" page
    Given I should see contextual help panel
    When I click on close button in the panel
    Then I should not see contextual help panel

  # Hosts page
  Scenario: Open the contextual help links panel on 'hosts' main page
    Given I am on "hosts" page
    When I click on "Help" button
    Then I should see contextual help panel
    And I should see a title "Links" in the panel
    * I should see a list of links

  Scenario: Close the contextual help links panel on 'Hosts' main page
    Given I am on "hosts" page
    Given I should see contextual help panel
    When I click on close button in the panel
    Then I should not see contextual help panel

  # Services
  Scenario: Open the contextual help links panel on 'services' main page
    Given I am on "services" page
    When I click on "Help" button
    Then I should see contextual help panel
    And I should see a title "Links" in the panel
    * I should see a list of links

  Scenario: Close the contextual help links panel on 'Services' main page
    Given I am on "services" page
    Given I should see contextual help panel
    When I click on close button in the panel
    Then I should not see contextual help panel
