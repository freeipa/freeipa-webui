Feature: Service manipulation
  Create, and delete services

  Background:
    Given I am logged in as "Administrator"
    Given I am on "services" page

  Scenario: Add a new host to test services
    Given I am on "hosts" page
    When I click on "Add" button
    * I type in the field "Host name" text "service1"
    * I click on "Force" checkbox in modal
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "service1" entry in the data table

  Scenario: Add a service
    When I click on "Add" button
    * I click in the "Service" selector field
    * I select "HTTP" option in the "Service" selector
    * I click in the "Host" selector field
    * I select "service1" option in the "Host" selector
    * I click on "Force" checkbox
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New service added"
    Then I should see partial "HTTP\/service1" entry in the data table

  Scenario: Add several services
    When I click on "Add" button
    * I click in the "Service" selector field
    * I select "DNS" option in the "Service" selector
    * I click in the "Host" selector field
    * I select "service1" option in the "Host" selector
    * I click on "Force" checkbox
    * in the modal dialog I click on "Add and add another" button
    * I click in the "Service" selector field
    * I select "ftp" option in the "Service" selector
    * I click in the "Host" selector field
    * I select "service1" option in the "Host" selector
    * I click on "Force" checkbox
    * I click on "Skip host check" checkbox
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New service added"
    Then I should see partial "DNS\/service1" entry in the data table
    Then I should see partial "ftp\/service1" entry in the data table

  Scenario: Delete a service
    Given I should see partial "HTTP\/service1" entry in the data table
    When I select partial entry "HTTP\/service1" in the data table
    * I click on "Delete" button
    When I see "Remove services" modal
    * I should see partial "HTTP\/service1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Services removed"
    Then I should not see "HTTP\/service1" entry in the data table

  Scenario: Delete many services
    Given I should see partial "DNS\/service1" entry in the data table
    Given I should see partial "ftp\/service1" entry in the data table
    Then I select partial entry "DNS\/service1" in the data table
    Then I select partial entry "ftp\/service1" in the data table
    When I click on "Delete" button
    * I see "Remove services" modal
    * I should see partial "DNS\/service1" entry in the data table
    * I should see partial "ftp\/service1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Services removed"
    Then I should not see "DNS\/service1" entry in the data table
    Then I should not see "ftp\/service1" entry in the data table

  Scenario: Cancel creation of a service
    When I click on "Add" button
    * I click in the "Service" selector field
    * I select "nfs" option in the "Service" selector
    * I click in the "Host" selector field
    * I select "service1" option in the "Host" selector
    * in the modal dialog I click on "Cancel" button
    Then I should not see "nfs\/service1" entry in the data table
